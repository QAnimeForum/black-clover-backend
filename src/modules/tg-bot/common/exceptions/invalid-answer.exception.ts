import { TelegrafException } from 'nestjs-telegraf';

export class InvalidAnswerException extends TelegrafException {
    constructor(public message: string) {
        super(message);
    }
}
