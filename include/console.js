import chalk from 'chalk';

/**
  * @param {string} [msg] - event to debug
  */
export const debug = (msg) => {
    console.log(chalk.blue(`[DEBUG :: ${Date.now()}] ${msg}`));
}
/**
  * @param {string} [msg] - event to log
  */
export const log = (msg) => {
    console.log(chalk.green(`[LOG :: ${Date.now()}] ${msg}`));
}
/**
  * @param {string} [msg] - event to error
  * @param {string} [error] - given error
  */
export const err = (msg, error = 'NULL') => {
    console.log(chalk.red(`[ERROR :: ${msg}] Error: ${error}`));
}