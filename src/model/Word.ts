import * as uuid from 'uuid';

export default class Word {
    id: uuid;
    description: string;
    constructor(description: string) {
        this.id = uuid.v4();
        this.description = description;
    }
}
