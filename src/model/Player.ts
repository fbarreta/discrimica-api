import * as uuid from 'uuid';
import Word from './Word';

export default class Player {
    
    id: uuid;
    name: string;
    words: Word[];

    constructor(name: string) {
        this.id = uuid.v4();
        this.name = name;
        this.words = [];
    }
    
    addWord(word: Word) {
        this.words.push(word);
    }

    clearWords() {
        this.words = [];
    }
}
