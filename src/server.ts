import * as express from 'express';
const { createServer } = require('node:http');
import { Server } from 'socket.io';
import * as cors from 'cors';
const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const port = 8080;

const server = createServer(app);
const io = new Server(server, {cors: {origin: ['http://localhost:3000']}});

import Match from './model/Match';
import Player from './model/Player';
import Word from './model/Word';
import Team from './model/Team';

let activeMatch: Match = new Match();

app.get('/info', (req, res) => {
    res.send(activeMatch);
});

app.get('/start', (req, res) => {
    activeMatch = new Match();
    res.send(activeMatch);
});

app.get('/getWord', (req, res) => {
    res.send(activeMatch.getWord());
});

app.get('/getPlayer/:user_id', (req, res) => {
    const userId = req.params.user_id;
    res.send(activeMatch.getPlayer(userId));
});

app.post('/addPlayer', (req, res) => {
    const player = new Player(req.body.name);
    activeMatch.addPlayer(player);
    io.emit('add-player', activeMatch);
    res.send(player)
});

app.post('/guessWord', (req, res) => {
    activeMatch.guessWord(req.body.id);
    res.send(activeMatch.allWords)
});

app.post('/shuffle', (req, res) => {
    activeMatch.shuffleTeams();
    res.send(activeMatch)
});

app.post('/addWord/:user_id', (req, res) => {
    const userId = req.params.user_id;
    const word = new Word(req.body.word.toUpperCase());
    const player = activeMatch.players.find(x => x.id === userId);
    if(player) {
        player.addWord(word);
        res.send(word)
    } else {
        res.send('Player not found ...')
    }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
server.listen(3001, () => {
    console.log('server running at http://localhost:3001');
  });
