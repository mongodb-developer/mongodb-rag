// src/cli/spinner.js
import chalk from 'chalk';

class MongoSpinner {
  constructor() {
    this.frames = [
      '🔍 ○ ○ ○ ',  // Search frame
      '🔍 ● ○ ○ ',  // Loading embeddings
      '🔍 ● ● ○ ',  // Processing vectors
      '🔍 ● ● ● ',  // Complete
    ];
    this.interval = null;
    this.frameIndex = 0;
    this.messages = [
      'Preparing vector magic...',
      'Calculating embeddings...',
      'Optimizing search space...',
      'Almost there...'
    ];
  }

  start(text = '') {
    process.stdout.write('\n');
    this.interval = setInterval(() => {
      const frame = this.frames[this.frameIndex];
      const message = this.messages[this.frameIndex];
      process.stdout.clearLine();
      process.stdout.cursorTo(0);
      process.stdout.write(
        chalk.blue(frame) + ' ' + 
        chalk.cyan(message) + ' ' + 
        chalk.yellow(text)
      );
      this.frameIndex = (this.frameIndex + 1) % this.frames.length;
    }, 800);
  }

  stop(success = true) {
    clearInterval(this.interval);
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    if (success) {
      process.stdout.write(
        chalk.green('✨ Vector magic complete! ') + 
        chalk.blue('🎉\n')
      );
    } else {
      process.stdout.write(
        chalk.red('✖ Operation failed ') + 
        chalk.yellow('😢\n')
      );
    }
  }
}

export default MongoSpinner;