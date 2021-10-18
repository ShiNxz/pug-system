import { client, PREFIX } from './index.js';
import { MessageEmbed, MessageActionRow, MessageButton } from 'discord.js';

// User Commands
export const commands = client.on('messageCreate', message => {
	if (!message.content.startsWith(PREFIX) || message.author.bot) return;
	let args = message.content.substring(PREFIX.length).split(" ");
    switch(args[0]) {
        case 'embeds':
            message.channel.send ({
                embeds: [
                    new MessageEmbed()
                        .setImage('https://i.imgur.com/jJEOi6b.png')
                        .setColor('#e67e22'),
                    new MessageEmbed()
                        .setTitle('▬▬▬▬▬▬▬▬     Pickup #X - 5v5     ▬▬▬▬▬▬▬▬')
                        .setDescription(`**➜ Status:** Started / Waiting\n**➜ Players:** X/X\n\n**➜ IP:** XXX\n**➜ Join:** [Click Here]\n**➜ Connect:** IP\n**➜ Rules:** [Click Here]`)
                        .setColor('#e67e22'),
                    new MessageEmbed()
                        .setTitle('▬▬▬▬▬▬▬▬▬▬    Players    ▬▬▬▬▬▬▬▬▬▬')
                        .setDescription(`**➜ ShiNxz | <@137254857710108672>:** ✅ Ready\n**➜ ShiNxz:** ❎ Not Ready\n`)
                        .setColor('#e67e22'),
                    new MessageEmbed()
                    .setTitle('▬▬▬▬▬▬▬▬▬▬      מדריך     ▬▬▬▬▬▬▬▬▬▬')
                    .setDescription(`עליכם לקשר את המשחק דיסקורד שלכם לאתר [מכאן](https://verify.next-il.co.il) ולאחר מכן\nעליכם להכנס לאתר למעלה ולהרשם על מנת להתחיל לשחק\n לאחר שיהיו עשרה שחקנים על כולם לעשות רדי ולהמתין לתחילת המשחק\nלאחר תחילת המשחק ישלח אליכם בדיסקורד ובאתר הודעה\nיחד עם פרטי השרת וכניסה מהירה\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n`)
                    .setImage('https://img.next-il.co.il/welcome.gif')
                    .setColor('#e67e22'),
                ],
                components: [
                    new MessageActionRow().addComponents(
                        new MessageButton().setStyle('LINK').setLabel('    אימות סטים    ').setURL(`https://verify.next-il.co.il`), 
                        new MessageButton().setStyle('LINK').setLabel('    הצטרפות לשרת    ').setURL(`https://next-il.co.il/pug/?p=1`),
                        new MessageButton().setStyle('LINK').setLabel('    חוקים    ').setURL(`https://next-il.co.il/pug/rules.php`)
                    )
                ]
            });
        break;

    }
});