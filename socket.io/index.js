import { GenRndChars } from '../include/functions.js';
import { log, err, debug } from '../include/console.js';
import { StartGame } from '../include/Rcon.js';
import { client } from '../discord/index.js';
import { data, lobby, db } from '../include/db.js';
import { Server } from 'socket.io';
import { app } from '../express/index.js';
import { readFileSync } from "fs";
import { createServer } from "https";
import { EmbedEdit, getPlayerGames } from '../discord/functions.js';

export const status = {
    0: {
        name: 'Not Ready',
        style: 'danger',
        emoji: '❎'
    },
    1: {
        name: 'Ready',
        style: 'success',
        emoji: '✅'
    }
}

export const server = createServer({
    cert: readFileSync("./cert/server.cert"),
    key: readFileSync("./cert/server.key")
}, app);

export const io = new Server(server, {
    cors: { origin: "*" },
});

io.on('connection', (socket) => {
    if(typeof data == 'undefined') return log(socket.id+` socket tried to join while retriving data from mysql.`);
    debug(`New Socket Connection: ${socket.id} (socket.id)`);
    let socket_pug;
    let socket_pug2;

    socket.on('player-connect', (pug, user) => {
        debug(`Player ${user.name} connected to pug: ${pug} (socket: ${socket.id})`);
        io.to(socket.id).emit('players-refresh', lobby[pug].players);
        io.to(socket.id).emit('pickup-status', lobby[pug].status);
        socket.join(`lobby:${pug}`);
        socket_pug2 = pug;
        socket.user = user;
    });

    socket.on('disconnect', () => {
        debug(`Socket Disconnected: ${socket.id}`);

        if(!socket_pug) return;

        EmbedEdit(lobby[socket_pug]);

        lobby[socket_pug].players = lobby[socket_pug].players.filter(s => s.socket != socket.id);
        io.to(`lobby:${socket_pug}`).emit('players-refresh', lobby[socket_pug].players);
    });

    // Join & Leave Statements
    socket.on('player-join', async (player) => {
        let discord = await client.guilds.cache.get('770819843573415977').members.fetch(player.discord);
        if(!discord) return;

        socket_pug = player.lobby;
        EmbedEdit(lobby[socket_pug]);
        
        // check if lobby is full => return
        if(lobby[socket_pug].players.filter(s => s.socket == player.socket || s.steam == player.steam).length > 0) return;
        debug(`Player ${socket.user.name} joined to lobby: ${socket_pug} (socket: ${socket.id})`);

        lobby[socket_pug].players.push(player);
        lobby[socket_pug].players.filter(s =>
            s.socket == player.socket
        )[0].status = status[0];
        lobby[socket_pug].players.filter(s =>
            s.socket == player.socket
        )[0].discord = discord;

        player.discord = discord;

        player.games = await getPlayerGames(player.steam);

        io.to(`lobby:${socket_pug}`).emit('player-join', player );
    });

    socket.on('player-leave', () => {
        if(!lobby[socket_pug]) return;
        EmbedEdit(lobby[socket_pug]);
        debug(`Player ${socket.user.name} left pug: ${socket_pug} (socket: ${socket.id})`);
        if(!lobby[socket_pug].players.filter(s => s.socket != socket.id)) return;
        lobby[socket_pug].players = lobby[socket_pug].players.filter(s => s.socket != socket.id);
        io.to(`lobby:${socket_pug}`).emit('players-refresh', lobby[socket_pug].players);
        io.to(`lobby:${socket_pug}`).emit('player-left', {
            name: socket.user.name,
            steam: socket.user.steam,
        });
    });

    function StartPug(pug) {
        debug(`Pug Started on Lobby: ${pug}`);
        // check if the game already started ->
        if(lobby[pug].status == 1) return;
        // generate random password => kick all from the server => set the password and pass it to the socket
        let PugInfo = {
            password: GenRndChars(15),
            ip: lobby[pug].server.ip,
            port: lobby[pug].server.port,
        };
        StartGame(lobby[pug], PugInfo.password);
        // save mysql info
        let players = '';
        lobby[pug].players.forEach(player => {
            players += `${player.steam}::`
        });
        db.query(
            'INSERT INTO `Pug_Games` (`LID`, `Players`) VALUES (?, ?)', [parseInt(pug), players], (err, results) => {
                if(err) return console.log(err);
            }
        );

        io.to(`lobby:${pug}`).emit('pug-start', PugInfo);
        lobby[pug].status = 1;
        EmbedEdit(lobby[socket_pug]);
    }

    // Ready Statement
    socket.on('player-ready', () => {
        if(!lobby[socket_pug]) return;
        if(!lobby[socket_pug].players.filter(s => s.socket == socket.id)) return;
        try {
            lobby[socket_pug].players.filter(s => s.socket == socket.id)[0].status = status[1];
        } catch(e) {
            err(`undefined`+e);
        }

        debug(`Player ${socket.user.name} ready in lobby: ${socket_pug} (socket: ${socket.id})`);
        EmbedEdit(lobby[socket_pug]);

        io.to(`lobby:${socket_pug}`).emit('players-refresh', lobby[socket_pug].players);
        if(lobby[socket_pug].players.filter(s => s.status == status[1]).length == lobby[socket_pug].maxplayers) StartPug(socket_pug);
    });

    // Unready Statement
    socket.on('player-unready', () => {
        if(!lobby[socket_pug]) return;
        if(!lobby[socket_pug].players.filter(s => s.socket == socket.id)) return;

        EmbedEdit(lobby[socket_pug]);

        try {
            lobby[socket_pug].players.filter(s => s.socket == socket.id)[0].status = status[0];
        } catch(e) {
            err(`undefined`+e);
        }

        debug(`Player ${socket.user.name} unready in lobby: ${socket_pug} (socket: ${socket.id})`);

        io.to(`lobby:${socket_pug}`).emit('players-refresh', lobby[socket_pug].players);
    });

    // Chat
    socket.on('message-new', (info) => {
        if(!lobby[socket_pug2]) return;

        debug(`new message ${info.text} (socket: ${socket.id}, steamid: ${info.steam}, name: ${info.name})`);

        io.to(`lobby:${socket_pug2}`).emit('message-new', info);
    });
});