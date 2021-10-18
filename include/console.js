import chalk from 'chalk';

export function debug(msg) {
    console.log(chalk.blue(`[DEBUG :: ${Date.now()}] ${msg}`));
}
export function log(msg) {
    console.log(chalk.green(`[LOG :: ${Date.now()}] ${msg}`));
}
export function err(msg, error) {
    console.log(chalk.red(`[ERROR :: ${msg}] Error: ${error}`));
}