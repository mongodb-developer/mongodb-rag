import natural from 'natural';
const tokenizer = new natural.WordTokenizer();

export class DocumentChunker {
  constructor(options = {}) {
    this.chunkSize = options.chunkSize || 1000;
    this.chunkOverlap = options.chunkOverlap || 200;
    this.method = options.method || 'fixed';  // 'fixed', 'recursive', or 'semantic'
  }

  /**
   * Chunks a document into smaller pieces
   * @param {Object} doc - The document to chunk
   * @returns {Array<Object>} Array of chunked documents
   */
  chunkDocument(doc) {
    switch (this.method) {
      case 'fixed':
        return this.fixedChunking(doc);
      case 'recursive':
        return this.recursiveChunking(doc);
      case 'semantic':
        return this.semanticChunking(doc);
      default:
        throw new Error(`Unknown chunking method: ${this.method}`);
    }
  }

  /**
   * Fixed-size chunking with overlap
   */
  fixedChunking(doc) {
    const tokens = tokenizer.tokenize(doc.content);
    const chunks = [];
    let start = 0;

    while (start < tokens.length) {
      const end = Math.min(start + this.chunkSize, tokens.length);
      const chunkTokens = tokens.slice(start, end);
      
      chunks.push({
        ...doc,
        content: chunkTokens.join(' '),
        metadata: {
          ...doc.metadata,
          chunk: {
            index: chunks.length,
            total: Math.ceil(tokens.length / (this.chunkSize - this.chunkOverlap)),
            start,
            end,
            method: 'fixed'
          }
        },
        documentId: `${doc.documentId}-chunk-${chunks.length}`
      });

      start += (this.chunkSize - this.chunkOverlap);
    }

    return chunks;
  }

  /**
   * Recursive chunking based on sections and paragraphs
   */
  recursiveChunking(doc) {
    const chunks = [];
    const sections = doc.content.split(/(?=#{1,6}\s)/); // Split on headers

    sections.forEach((section, sectionIndex) => {
      const paragraphs = section.split(/\n{2,}/);
      let currentChunk = [];
      let currentLength = 0;

      paragraphs.forEach((paragraph) => {
        const paragraphTokens = tokenizer.tokenize(paragraph);
        
        if (currentLength + paragraphTokens.length > this.chunkSize) {
          if (currentChunk.length > 0) {
            chunks.push(this.createChunk(doc, currentChunk.join('\n\n'), {
              section: sectionIndex,
              method: 'recursive'
            }));
            currentChunk = [];
            currentLength = 0;
          }
        }

        currentChunk.push(paragraph);
        currentLength += paragraphTokens.length;
      });

      if (currentChunk.length > 0) {
        chunks.push(this.createChunk(doc, currentChunk.join('\n\n'), {
          section: sectionIndex,
          method: 'recursive'
        }));
      }
    });

    return chunks;
  }

  /**
   * Semantic chunking based on natural breaks in the text
   */
  semanticChunking(doc) {
    const chunks = [];
    // Split on semantic boundaries (headers, lists, code blocks, etc.)
    const segments = doc.content.split(/(?=#{1,6}\s|```|\n-\s|\n\d+\.\s)/);
    let currentChunk = [];
    let currentLength = 0;

    segments.forEach((segment) => {
      const segmentTokens = tokenizer.tokenize(segment);
      
      if (currentLength + segmentTokens.length > this.chunkSize) {
        if (currentChunk.length > 0) {
          chunks.push(this.createChunk(doc, currentChunk.join('\n\n'), {
            method: 'semantic'
          }));
          currentChunk = [];
          currentLength = 0;
        }
      }

      currentChunk.push(segment);
      currentLength += segmentTokens.length;
    });

    if (currentChunk.length > 0) {
      chunks.push(this.createChunk(doc, currentChunk.join('\n\n'), {
        method: 'semantic'
      }));
    }

    return chunks;
  }

  createChunk(doc, content, chunkInfo) {
    return {
      ...doc,
      content: content.trim(),
      metadata: {
        ...doc.metadata,
        chunk: {
          index: chunkInfo.index || 0,
          method: chunkInfo.method,
          ...chunkInfo
        }
      },
      documentId: `${doc.documentId}-chunk-${chunkInfo.index || 0}`
    };
  }
} 