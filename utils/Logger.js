import chalk from 'chalk';

class Logger {
  static error(message) {
    console.error(chalk.red.bold('[ ERROR ]'), message);
  }
  static warn(message) {
    console.warn(chalk.yellow.bold('[ WARN ]'), message);
  }
  static log(message) {
    console.log(chalk.green.bold('[ LOG ]'), message);
  }
  static check(message) {
    console.log(chalk.blueBright.bold('[ CHECK ]'), message);
  }
}

export default Logger;
