import chalk from 'chalk';
import { server } from './socket.io/_main.js'
import dotenv from 'dotenv';
dotenv.config();

server.listen(10500, () => {
    console.log('─────────────────────────────────────────────');
	console.log(chalk.cyan(`Express App Started!\n---\n`
	+ `> Listening on https://io.next-il.co.il:10500`));
	console.log('─────────────────────────────────────────────');
});