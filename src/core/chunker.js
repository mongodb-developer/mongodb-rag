// chunker.js
import debug from 'debug';
import natural from 'natural';

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
        chunks.push(this.createChunk(document, currentChunk.join(' ')));

        const overlapSentences = this.calculateOverlap(currentChunk);
        currentChunk = overlapSentences;
        currentLength = overlapSentences.join(' ').length;
      }

      currentChunk.push(sentence);
      currentLength += sentenceLength;
    }

    if (currentChunk.length > 0) {
      chunks.push(this.createChunk(document, currentChunk.join(' ')));
    }

    log(`Created ${chunks.length} chunks for document ${document.id}`);
    return chunks;
  }

  semanticChunk(document) {
    const text = document.content;
    const tokenizer = new natural.SentenceTokenizer();
    const sentences = tokenizer.tokenize(text);
    const chunks = [];

    let currentChunk = [];
    let currentLength = 0;

    for (const sentence of sentences) {
      const sentenceLength = sentence.length;

      if (currentLength + sentenceLength > this.options.maxChunkSize && currentChunk.length > 0) {
        chunks.push(this.createChunk(document, currentChunk.join(' ')));

        currentChunk = [];
        currentLength = 0;
      }

      currentChunk.push(sentence);
      currentLength += sentenceLength;
    }

    if (currentChunk.length > 0) {
      chunks.push(this.createChunk(document, currentChunk.join(' ')));
    }

    log(`Created ${chunks.length} semantic chunks for document ${document.id}`);
    return chunks;
  }

  recursiveChunk(document) {
    const text = document.content;
    const chunks = [];
    const sections = text.split(/\n\s*\n/); // Split based on paragraphs

    for (const section of sections) {
      if (section.length <= this.options.maxChunkSize) {
        chunks.push(this.createChunk(document, section));
      } else {
        // If a section is too large, break it into sentences
        const sentences = this.splitIntoSentences(section);
        let currentChunk = [];
        let currentLength = 0;

        for (const sentence of sentences) {
          const sentenceLength = sentence.length;

          if (currentLength + sentenceLength > this.options.maxChunkSize && currentChunk.length > 0) {
            chunks.push(this.createChunk(document, currentChunk.join(' ')));

            currentChunk = [];
            currentLength = 0;
          }

          currentChunk.push(sentence);
          currentLength += sentenceLength;
        }

        if (currentChunk.length > 0) {
          chunks.push(this.createChunk(document, currentChunk.join(' ')));
        }
      }
    }

    log(`Created ${chunks.length} recursive chunks for document ${document.id}`);
    return chunks;
  }

  splitIntoSentences(text) {
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
        chunkIndex: Date.now(),
        strategy: this.options.strategy
      }
    };
  }
}

export default Chunker;
