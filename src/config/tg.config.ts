import { registerAs } from '@nestjs/config';
import { IsString, ValidateIf } from 'class-validator';
import validateConfig from 'src/utils/validate-config';
export type TgConfig = {
    tg_bot_token: string;
};
class EnvironmentVariablesValidator {
    @ValidateIf((envValues) => envValues.TELEGRAM_BOT_TOKEN)
    @IsString()
    TELEGRAM_BOT_TOKEN: string;
}

export default registerAs<TgConfig>('tg_bot', () => {
    validateConfig(process.env, EnvironmentVariablesValidator);
    return {
        tg_bot_token: process.env.TELEGRAM_BOT_TOKEN,
    };
});
