import { lobby } from '../include/db.js';
import { Router } from 'express';
var router = Router()
import { debug } from '../include/console.js';

router.get('/:serverId/:action', (req, res) => {
  switch(req.params.action) {
    case 'info':
      res.send(lobby[req.params.serverId]);
    break;

    case 'end':
      if(lobby[req.params.serverId].status == 0) return res.send(JSON.parse('{"error": "game already ended"}'));
      debug(`Pug Ended on Lobby: ${req.params.serverId}`);
      lobby[req.params.serverId].status = 0;
      lobby[req.params.serverId].players = [];
      res.send(JSON.parse('{"status": "game ended"}'));
    break;

    default:
      res.send(JSON.parse('{"error": "unknown params"}'));
    break;
  }
});

export default router