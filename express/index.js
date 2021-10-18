import express from 'express';
import { log } from '../include/console.js';

export const app = express();

// Routes
import Pug from './pug.route.js';
app.use('/pug', Pug);

// express
app.get('/', (req, res) => {
    res.send('<h7>Not Authorized.</h7>');
    log(`Someone tried to enter io.next-il.co.il`);
});