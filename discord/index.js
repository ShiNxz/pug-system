import { Intents } from 'discord.js';
import { Client } from 'discord.js';
import dotenv from 'dotenv';
import { construct } from '../include/db.js';
import chalk from 'chalk';
dotenv.config();

export const client = new Client({ partials: ['MESSAGE', 'REACTION'], intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_PRESENCES] });

export const PREFIX = '!';

client.login(process.env.BOT_TOKEN);

client.on('ready', () => {
    console.log('─────────────────────────────────────────────');
	console.log(chalk.red(`Discord Bot Started!\n---\n`
	+ `> Users: ${client.users.cache.size}\n`
	+ `> Channels: ${client.channels.cache.size}`));
	console.log('─────────────────────────────────────────────');
	client.user.setActivity(`${PREFIX}Pickup`, {type: 'WATCHING'});

    construct();
});

import('./commands.js');