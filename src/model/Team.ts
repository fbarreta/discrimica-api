import * as uuid from 'uuid';
import Player from './Player';

export default class Team {
    id: uuid;
    name: string;
    points: number;
    players: Player[];
    constructor(name: string) {
        this.id = uuid.v4();
        this.name = name;
        this.points = 0;
        this.players = [];
    }

    addPoint() {
        this.points++;
    }
}
