// bin/utils/prompts.js
import Enquirer from 'enquirer';
import chalk from 'chalk';

const enquirer = new Enquirer();

export async function promptWithValidation(promptConfig) {
  while (true) {
    try {
      const response = await enquirer.prompt(promptConfig);
      const userInput = response[promptConfig.name];

      if (userInput === '?') {
        console.log(chalk.yellow(`ℹ️ Help: ${promptConfig.helpMessage}\n`));
        continue;
      }

      if (promptConfig.validate) {
        const validationResult = promptConfig.validate(userInput);
        if (validationResult !== true) {
          console.log(chalk.red(`❌ ${validationResult}`));
          continue;
        }
      }

      return userInput;
    } catch (error) {
      if (error.isCanceled) {
        console.log(chalk.yellow('\n⚠️ Operation cancelled'));
        process.exit(0);
      }
      throw error;
    }
  }
}

export async function confirmAction(message, defaultValue = false) {
  const response = await enquirer.prompt({
    type: 'confirm',
    name: 'confirmed',
    message,
    initial: defaultValue
  });

  return response.confirmed;
}

export async function selectFromList(options) {
  const { type = 'select', name = 'selected', message, choices, initial } = options;
  
  const response = await enquirer.prompt({
    type,
    name,
    message,
    choices,
    initial
  });

  return response[name];
}