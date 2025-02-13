// src/cli/progressBar.js
import chalk from 'chalk';

const funFacts = [
  "Did you know? Vector search helps find similar items even if they use different words!",
  "MongoDB Atlas Vector Search uses cosine similarity by default 📐",
  "RAG helps combine the power of vector search with your own data 🔋",
  "Vector embeddings can capture semantic meaning beyond keywords 🎯",
  "MongoDB can handle billions of vectors efficiently! 🚀",
  "Vector search is like giving your database a human-like understanding 🧠"
];

class FunProgressBar {
  constructor() {
    this.width = 40;
    this.currentFact = 0;
  }

  update(progress) {
    const filled = Math.round(this.width * progress);
    const empty = this.width - filled;
    
    const filledBar = '█'.repeat(filled);
    const emptyBar = '░'.repeat(empty);
    
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    
    const percentage = Math.round(progress * 100);
    process.stdout.write(
      chalk.blue(`[${filledBar}${emptyBar}] ${percentage}%\n`) +
      chalk.yellow(`Fun Fact: ${funFacts[this.currentFact]}\n`)
    );
    
    this.currentFact = (this.currentFact + 1) % funFacts.length;
  }
}

export default FunProgressBar;