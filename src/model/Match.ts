import * as uuid from 'uuid';
import Player from './Player';
import Team from './Team';
import Word from './Word';

export default class Match {
    
    id: uuid;
    players: Player[];
    activeTeam: Team;
    teams: Team[];
    allWords: Word[];

    constructor() {
        this.id = uuid.v4();
        this.players = [];
        this.teams = [];
        this.allWords = [];
        this.start();
    }

    start() {
        const testPlayer: Player = new Player('Felipe');
        testPlayer.id = '2bbe5126-bf3f-43d2-b9ac-01cb2f4c07c5';
        testPlayer.addWord(new Word('bezerro'));
        testPlayer.addWord(new Word('lagarto'));
        this.addPlayer(testPlayer);
        this.addPlayer(new Player('Lidiane'));
        this.players[1].addWord(new Word('gazebo'));
        this.players[1].addWord(new Word('jocoso'));
        this.addPlayer(new Player('Gabriel'));
        this.addPlayer(new Player('Ricardo'));
        this.addPlayer(new Player('Thais'));
        this.addPlayer(new Player('Rodrigo'));
        this.addPlayer(new Player('Maria Clara'));

        this.addTeam(new Team("Team 1"));
        this.addTeam(new Team("Team 2"));

        this.shuffleTeams();

        this.activeTeam = this.teams[0];
    }

    addPlayer(player: Player) {
        this.players.push(player);
    }

    addTeam(team: Team) {
        this.teams.push(team);
    }

    clearPlayers() {
        this.players = [];
    }

    shuffleTeams(){
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

    guessWord(id: uuid) {
        let word: Word = this.allWords.find(x => x.id === id);
        if (word) {
            const index = this.allWords.indexOf(word);
            this.allWords.splice(index,1);
            this.activeTeam.addPoint();
        }
    }
}
