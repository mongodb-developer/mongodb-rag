// src/cli/spinner.js
import chalk from 'chalk';

class MongoSpinner {
  constructor() {
    this.frames = [
      '🔍 ○ ○ ○ ',
      '🔍 ● ○ ○ ',
      '🔍 ● ● ○ ',
      '🔍 ● ● ● '
    ];
    
    this.messages = [
      'Preparing vector magic...',
      'Calculating embeddings...',
      'Optimizing search space...',
      'Almost there...'
    ];
    
    this.frameIndex = 0;
    this.interval = null;
    this.currentMessage = '';
    this.isEnabled = this._checkEnabled();
  }

  _checkEnabled() {
    // Check for required properties and methods
    const requiredMethods = {
      clearLine: process.stdout.clearLine,
      cursorTo: process.stdout.cursorTo,
      write: process.stdout.write
    };

    // Verify all methods exist and are functions
    const hasRequiredMethods = Object.values(requiredMethods)
      .every(method => method && typeof method === 'function');

    return Boolean(
      process.stdout.isTTY && 
      !process.env.NO_SPINNER && 
      !process.env.CI && 
      hasRequiredMethods
    );
  }

  start(text = '') {
    this.currentMessage = text;

    if (!this.isEnabled) {
      // In non-interactive mode, just log once
      this._fallbackLog(this.messages[0], text);
      return;
    }

    process.stdout.write('\n');
    
    this.interval = setInterval(() => {
      const frame = this.frames[this.frameIndex];
      const message = this.messages[this.frameIndex];
      
      process.stdout.clearLine();
      process.stdout.cursorTo(0);
      
      process.stdout.write(
        chalk.blue(frame) + ' ' + 
        chalk.cyan(message) + ' ' + 
        chalk.yellow(this.currentMessage)
      );
      
      this.frameIndex = (this.frameIndex + 1) % this.frames.length;
    }, 800);
  }

  updateMessage(text) {
    this.currentMessage = text;
    
    if (!this.isEnabled) {
      this._fallbackLog(text);
      return;
    }
  }

  stop(success = true) {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }

    if (this.isEnabled) {
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

  _fallbackLog(...messages) {
    // Use plain console.log for non-interactive environments
    console.log(...messages);
  }
}

export default MongoSpinner;