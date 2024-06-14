import * as uuid from 'uuid';
import Player from './Player';
import Team from './Team';
import Word from './Word';

export default class Match {
    
    id: uuid;
    players: Player[];
    activeTeamIndex: number;
    teams: Team[];
    allWords: Word[];
    guessedWords: Word[];
    started: boolean;
    round: number;

    constructor() {
        this.clear();
    }

    private clear() {
        this.id = uuid.v4();
        this.players = [];
        this.teams = [];
        this.allWords = [];
        this.guessedWords = [];
        this.started = false;
        this.round = 1;

        this.addTestData();
    }

    start() {
        this.shuffleTeams();
        this.activeTeamIndex = 0;
    }

    nextTurn() {
        const activeTeam = this.teams.find(x => x.id === this.teams[this.activeTeamIndex].id);
        activeTeam.activePlayerIndex++;
        if (activeTeam.activePlayerIndex === activeTeam.players.length) activeTeam.activePlayerIndex = 0;
        this.activeTeamIndex++;
        if (this.activeTeamIndex === this.teams.length) this.activeTeamIndex = 0;
    }

    addPlayer(player: Player) {
        this.players.push(player);
    }

    getPlayer(playerId: string) {
        return this.players.find((player) => {
            return player.id === playerId
        });
    }

    addTeam(team: Team) {
        this.teams.push(team);
    }

    clearPlayers() {
        this.players = [];
    }

    private shuffleTeams(){
        const teamQty: number = this.teams.length;
        let teamIndex: number = 0;
        while (this.players.length > 0) {
            let index = Math.floor(Math.random() * this.players.length);

            if (teamIndex === teamQty) {
                teamIndex = 0;
            }

            this.teams[teamIndex].players.push(this.players[index]);
            teamIndex++;
            this.players.splice(index, 1);
        }
        this.populateWordArray();
        this.started = true;
    }

    populateWordArray() {
        this.teams.forEach(t => {
            t.players.forEach(p => {
                p.words.forEach(w => {
                    this.allWords.push(w);
                })
            });
        });
    }

    getWord(): Word {
        let index = Math.floor(Math.random() * this.allWords.length);
        return this.allWords[index];
    }

    guessWord(userId: uuid, wordId: uuid) {
        const activeTeam = this.teams.find(x => x.id === this.teams[this.activeTeamIndex].id);
        const activePlayer = activeTeam.players[activeTeam.activePlayerIndex];
        if (userId !== activePlayer.id) {
            console.warn('Only active player can guess.');
            return {status: 'error'};
        }
        let word: Word = this.allWords.find(x => x.id === wordId);
        if (word) {
            this.guessedWords.push(word);
            const index = this.allWords.indexOf(word);
            this.allWords.splice(index,1);
            activeTeam.addPoint();
            if (this.allWords.length === 0) {
                this.nextRound();
            }
            return {status: 'success'};
        } else {
            return {status: 'error'};
        }
    }

    private nextRound() {
        this.guessedWords.forEach(w => this.allWords.push(w));
        this.guessedWords = [];
        this.round++;
        this.round === 4 ? this.started = false : this.nextTurn();
    }

    private addTestData() {
        // Test data
        const testPlayer: Player = new Player('Felipe');
        testPlayer.id = '42848cd5-ed02-4a36-a115-b2e62238d931';
        testPlayer.addWord(new Word('word1'));
        // testPlayer.addWord(new Word('word2'));
        this.addPlayer(testPlayer);
        this.addPlayer(new Player('Lidiane'));
        this.players[1].addWord(new Word('word3'));
        // this.players[1].addWord(new Word('word4'));
        this.addPlayer(new Player('Gabriel'));
        this.players[2].addWord(new Word('word5'));
        // this.players[2].addWord(new Word('word6'));
        this.addPlayer(new Player('Ricardo'));
        this.players[3].addWord(new Word('word7'));
        // this.players[3].addWord(new Word('word8'));
        this.addPlayer(new Player('Thais'));
        this.players[4].addWord(new Word('word9'));
        // this.players[4].addWord(new Word('word10'));
        this.addPlayer(new Player('Rodrigo'));
        this.players[5].addWord(new Word('word11'));
        // this.players[5].addWord(new Word('word12'));
        this.addPlayer(new Player('Maria Clara'));
        this.players[6].addWord(new Word('word13'));
        // this.players[6].addWord(new Word('word14'));

        this.addTeam(new Team("Team 1"));
        this.addTeam(new Team("Team 2"));
        // Test data
    }
}
