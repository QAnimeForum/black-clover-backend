import { Injectable, PipeTransform } from '@nestjs/common';
import * as Joi from 'joi';
import { InvalidAnswerException } from '../exceptions/invalid-answer.exception';

export interface ValidateAnswerOptions {
    errorMessage: string;
    validAnswers?: string[];
    enum?: any;
    validationSchema?: Joi.StringSchema<string>;
    possibleAnswers?: string[];
}

@Injectable()
export class ValidateAnswerPipe implements PipeTransform {
    constructor(private options: ValidateAnswerOptions) {}
    transform(value: { text: string }) {
        const objToValidate = { text: value.text };
        if (value.text == '/start') {
            return value.text;
        }
        let answerValidation = Joi.string();
        console.log(this.options);
        if (this.options?.validationSchema)
            answerValidation = this.options.validationSchema;
        else if (this.options?.validAnswers)
            answerValidation = answerValidation.valid(
                ...this.options.validAnswers
            );
        else if (this.options?.enum)
            answerValidation = answerValidation.valid(
                ...Object.values(this.options.enum)
            );

        const validationSchema = Joi.object({
            text: answerValidation,
        });
        const { error } = validationSchema.validate(objToValidate);
        console.log(error);
        if (error) {
            throw new InvalidAnswerException(this.options.errorMessage);
        }
        return value.text;
    }
}
