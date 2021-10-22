import Rcon from 'mbr-rcon';
import { debug, err } from './console.js';

export const StartGame = (lobby, password) => {
  // create the connection
  const rcon = new Rcon({
    host: lobby.server.ip,
    port: lobby.server.port,
    pass: lobby.server.rcon,
    onClose: () => { }
  });
  // connect
  let connection = rcon.connect({
    onSuccess: () => {
      debug(`Rcon Connected to Lobby ${lobby}`);
    },
    onError: (error) => {
      err(`Rcon Couldnt connect to Lobby ${lobby} Rcon`, error);
    }
  });
  connection.auth({
    onSuccess: () => { },
    onError: (error) => { }
  });
  // send the reset command
  connection.send(`bot_kick`,
    {
      onSuccess: (response) => {
        debug(`Rcon Sent start command to lobby ${lobby} with password ${password}`);
      },
      onError: (error) => {
        err(`Rcon Couldnt send reset command to lobby ${lobby}`, error);
      }
    });
  connection.send(`sm_kick @all`);
  connection.send(`sv_password ${password}`);
}