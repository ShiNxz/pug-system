import { client } from './index.js';
import { MessageEmbed, MessageActionRow, MessageButton } from 'discord.js';
import { err as _err } from '../include/console.js';
import { db } from '../include/db.js';

/**
  * @param {int} [lobby] - lobby id
  */
export const EmbedEdit = (lobby) => {
    client.channels.cache.get(lobby.discord.channel).messages.fetch({ limit: 1 }).then(messages => {
        let players = '';

        if(lobby.players.length > 0) {
            lobby.players.forEach(player => {
                players += `**➜ [${player.name}](https://steamcommunity.com/profiles/${player.steam}) | <@${player.discord.user.id}>:** ${player.status.emoji} ${player.status.name}\n`
            })
        }

        let status = lobby.status == 0 ? 'Waiting' : 'Started';

        messages.first().edit({
            embeds: [
                new MessageEmbed()
                    .setImage('https://i.imgur.com/jJEOi6b.png')
                    .setColor('#e67e22'),
                new MessageEmbed()
                    .setTitle(`▬▬▬▬▬▬▬▬     Pickup #${lobby.id} - ${lobby.title}     ▬▬▬▬▬▬▬▬`)
                    .setDescription(`**➜ Status:** ${status}\n**➜ Players:** ${lobby.players.length}/${lobby.maxplayers}\n\n**➜ IP:** ${lobby.server.ip}:${lobby.server.port}\n**➜ Join:** [Click Here](https://next-il.co.il/pug?p=${lobby.id})\n**➜ Connect:** steam://connect/${lobby.server.ip}:${lobby.server.port}\n**➜ Rules:** [Click Here](https://next-il.co.il/pug/rules.php)\n**➜ Maps:** ${lobby.maps}`)
                    .setColor('#e67e22'),

                new MessageEmbed()
                    .setTitle('▬▬▬▬▬▬▬▬▬▬    Players    ▬▬▬▬▬▬▬▬▬▬')
                    .setDescription(players)
                    .setColor('#e67e22'),
                new MessageEmbed()
                .setTitle('▬▬▬▬▬▬▬▬▬▬      מדריך     ▬▬▬▬▬▬▬▬▬▬')
                .setDescription(`עליכם לקשר את המשחק דיסקורד שלכם לאתר [מכאן](https://verify.next-il.co.il) ולאחר מכן\nעליכם להכנס לאתר למעלה ולהרשם על מנת להתחיל לשחק\n לאחר שיהיו עשרה שחקנים על כולם לעשות רדי ולהמתין לתחילת המשחק\nלאחר תחילת המשחק ישלח אליכם בדיסקורד ובאתר הודעה\nיחד עם פרטי השרת וכניסה מהירה\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n`)
                .setImage('https://img.next-il.co.il/welcome.gif')
                .setColor('#e67e22'),
            ],
            components: [
                new MessageActionRow()
                .addComponents(
                    new MessageButton().setStyle('LINK').setLabel('    אימות סטים    ').setURL(`https://verify.next-il.co.il`), 
                    new MessageButton().setStyle('LINK').setLabel('    הצטרפות לשרת    ').setURL(`https://next-il.co.il/pug/?p=1`),
                    new MessageButton().setStyle('LINK').setLabel('    חוקים    ').setURL(`https://next-il.co.il/pug/rules.php`)
                )
            ]
        });
    }).catch(err => {
        _err(`error while updating embed ${lobby.id}`, err);
    });
}

/**
  * @param {string} [player] - steam player id
  */
export const getPlayerGames = (player) => {
    return new Promise((resolve, reject) => {
        player = `%${player}%`;
        db.query(
            'SELECT COUNT(*) AS count FROM `Pug_Games` WHERE `Players` LIKE ?', [player], (err, results) => {
                if(err) {
                    _err('mysql:', err);
                    return reject(err);
                }
                resolve(results[0].count);
            }
        );
    });
}