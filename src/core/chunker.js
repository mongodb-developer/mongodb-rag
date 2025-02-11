import debug from 'debug';

const log = debug('mongodb-rag:chunker');

class Chunker {
  constructor(options = {}) {
    this.options = {
      strategy: options.strategy || 'sliding',
      maxChunkSize: options.maxChunkSize || 500,
      overlap: options.overlap || 50,
      splitter: options.splitter || 'sentence'
    };
  }

  async chunkDocument(document) {
    log(`Chunking document ${document.id} using ${this.options.strategy} strategy`);
    
    switch (this.options.strategy) {
      case 'sliding':
        return this.slidingWindowChunk(document);
      case 'semantic':
        return this.semanticChunk(document);
      case 'recursive':
        return this.recursiveChunk(document);
      default:
        throw new Error(`Unknown chunking strategy: ${this.options.strategy}`);
    }
  }

  slidingWindowChunk(document) {
    const text = document.content;
    const chunks = [];
    const sentences = this.splitIntoSentences(text);
    
    let currentChunk = [];
    let currentLength = 0;

    for (const sentence of sentences) {
      const sentenceLength = sentence.length;
      
      if (currentLength + sentenceLength > this.options.maxChunkSize && currentChunk.length > 0) {
        // Store current chunk and start a new one
        chunks.push(this.createChunk(document, currentChunk.join(' ')));
        
        // Handle overlap by keeping some sentences from the previous chunk
        const overlapSentences = this.calculateOverlap(currentChunk);
        currentChunk = overlapSentences;
        currentLength = overlapSentences.join(' ').length;
      }
      
      currentChunk.push(sentence);
      currentLength += sentenceLength;
    }

    // Don't forget the last chunk
    if (currentChunk.length > 0) {
      chunks.push(this.createChunk(document, currentChunk.join(' ')));
    }

    log(`Created ${chunks.length} chunks for document ${document.id}`);
    return chunks;
  }

  semanticChunk(document) {
    // This is a placeholder for semantic chunking
    // In a real implementation, this would use NLP to identify
    // semantic boundaries like paragraphs, sections, or topics
    return this.slidingWindowChunk(document);
  }

  recursiveChunk(document) {
    // This is a placeholder for recursive chunking
    // In a real implementation, this would recursively split
    // the document based on headers, sections, etc.
    return this.slidingWindowChunk(document);
  }

  splitIntoSentences(text) {
    // Simple sentence splitting - in production you'd want to use
    // a more sophisticated NLP approach
    return text
      .replace(/([.!?])\s+/g, '$1\n')
      .split('\n')
      .map(s => s.trim())
      .filter(s => s.length > 0);
  }

  calculateOverlap(sentences) {
    const overlapTokenCount = Math.ceil(sentences.length * (this.options.overlap / 100));
    return sentences.slice(-overlapTokenCount);
  }

  createChunk(document, content) {
    return {
      documentId: document.id,
      content: content,
      metadata: {
        ...document.metadata,
        chunkIndex: Date.now(), // Simple way to ensure unique chunks
        strategy: this.options.strategy
      }
    };
  }
}

export default Chunker;