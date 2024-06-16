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

let activeMatch: Match = new Match();

app.get('/info', (req, res) => {
    res.send(activeMatch);
});

app.post('/start', (req, res) => {
    activeMatch.start();
    io.emit('add-player', activeMatch);
    const activeTeam = activeMatch.teams[activeMatch.activeTeamIndex];
    io.emit('player-info', {
        id: activeMatch.id,
        started: activeMatch.started,
        activePlayerId: activeTeam.players[activeTeam.activePlayerIndex].id,
        wordCount: activeMatch.allWords.length,
    });
    res.send(activeMatch);
});

app.get('/status', (req, res) => {
    const activeTeam = activeMatch.teams[activeMatch.activeTeamIndex];
    const info = {
        id: activeMatch.id,
        started: activeMatch.started,
        activePlayerId: activeMatch.started ? activeTeam.players[activeTeam.activePlayerIndex].id : null,
        wordCount: activeMatch.allWords.length,
    };
    res.send(info);
});

app.post('/reset', (req, res) => {
    activeMatch = new Match();
    io.emit('add-player', activeMatch);
    res.send(activeMatch);
});

app.post('/nextTurn', (req, res) => {
    const resp = activeMatch.nextTurn();
    io.emit('add-player', activeMatch);
    const activeTeam = activeMatch.teams[activeMatch.activeTeamIndex];
    const info = {
        id: activeMatch.id,
        started: activeMatch.started,
        activePlayerId: activeTeam.players[activeTeam.activePlayerIndex].id,
        wordCount: activeMatch.allWords.length,
    };
    io.emit('player-info', info);
    res.send(resp);
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

app.post('/guessWord/:user_id', (req, res) => {
    const userId = req.params.user_id;
    const activeTeam = activeMatch.teams[activeMatch.activeTeamIndex];
    res.send(activeMatch.guessWord(userId, req.body.id));
    io.emit('add-player', activeMatch);
    io.emit('player-info', {
        id: activeMatch.id,
        started: activeMatch.started,
        activePlayerId: activeTeam.players[activeTeam.activePlayerIndex].id,
        wordCount: activeMatch.allWords.length,
    });
});

app.post('/word/:user_id', (req, res) => {
    const userId = req.params.user_id;
    const word = new Word(req.body.description.toUpperCase());
    const player = activeMatch.players.find(x => x.id === userId);
    if(player) {
        player.addWord(word);
        io.emit('add-player', activeMatch);
        res.send(word)
    } else {
        res.send('Player not found ...')
    }
});

app.delete('/word/:user_id', (req, res) => {
    const userId = req.params.user_id;
    const word = req.body;
    const player = activeMatch.players.find(x => x.id === userId);
    if(player) {
        player.removeWord(word);
        io.emit('add-player', activeMatch);
        res.send(word)
    } else {
        res.send('Player not found ...')
    }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
server.listen(3001, () => {
    console.log('server running at http://localhost:3001');
  });
