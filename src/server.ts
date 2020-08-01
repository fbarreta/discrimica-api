import * as express from 'express';
const app = express();
const port = 3000;
import * as bodyParser from 'body-parser';

import Match from './model/Match';
import Player from './model/Player';
import Word from './model/Word';
import Team from './model/Team';

// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

let activeMatch: Match = new Match();

app.get('/', (req, res) => {
    res.send(activeMatch);
});

app.get('/start', (req, res) => {
    activeMatch = new Match();
    res.send(activeMatch);
});

app.get('/getWord', (req, res) => {
    res.send(activeMatch.getWord());
});

app.post('/addPlayer', urlencodedParser, (req, res) => {
    const player = new Player(req.body.name);
    activeMatch.addPlayer(player);
    res.send(player)
});

app.post('/guessWord', urlencodedParser, (req, res) => {
    activeMatch.guessWord(req.body.id);
    res.send(activeMatch.allWords)
});

app.post('/shuffle', urlencodedParser, (req, res) => {
    activeMatch.shuffleTeams();
    res.send(activeMatch)
});

app.post('/addWord/:user_id', urlencodedParser, (req, res) => {
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
