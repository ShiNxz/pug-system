import { createPool } from 'mysql2';
import { EmbedEdit } from '../discord/functions.js';
import { log } from './console.js';
import dotenv from 'dotenv';
dotenv.config();

export const db = createPool({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_DATABASE
});

export const lobby = [];
export let data;

export const construct = () => {
    db.query(
        'SELECT * FROM `Pug_Lobby`', [], (err, results) => {
            if(err) return console.log(err);
            results.forEach(Pug => {
                lobby[Pug.LID] = {};
                lobby[Pug.LID].id = Pug.LID;
                lobby[Pug.LID].title = Pug.Title;
                lobby[Pug.LID].players = [];
                lobby[Pug.LID].maxplayers = Pug.MaxPlayers;
                lobby[Pug.LID].maxrounds = Pug.MaxRounds;
                lobby[Pug.LID].maps = Pug.Maps.split(', ');
                lobby[Pug.LID].server = [];
                lobby[Pug.LID].server.ip = Pug.IP;
                lobby[Pug.LID].server.port = Pug.Port;
                lobby[Pug.LID].server.rcon = Pug.Rcon;
                lobby[Pug.LID].status = 0;
                lobby[Pug.LID].discord = [];
                lobby[Pug.LID].discord.channel = Pug.StatusChannel;
                EmbedEdit(lobby[Pug.LID]);
            });
            data = true;
            log(`Retrieved data from mysql, starting...`);
        }
    );
}