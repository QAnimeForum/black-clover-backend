import { registerAs } from '@nestjs/config';
import {
    IsOptional,
    IsInt,
    Min,
    Max,
    IsString,
    ValidateIf,
    IsBoolean,
} from 'class-validator';
import validateConfig from 'src/utils/validate-config';
export type DatabaseConfig = {
    url?: string;
    type?: string;
    host?: string;
    port?: number;
    password?: string;
    name?: string;
    username?: string;
    synchronize?: boolean;
    maxConnections: number;
    sslEnabled?: boolean;
    rejectUnauthorized?: boolean;
    ca?: string;
    key?: string;
    cert?: string;
};
class EnvironmentVariablesValidator {
    @ValidateIf((envValues) => envValues.DATABASE_URL)
    @IsString()
    DATABASE_URL: string;

    @ValidateIf((envValues) => !envValues.DATABASE_URL)
    @IsString()
    DATABASE_TYPE: string;

    @ValidateIf((envValues) => !envValues.DATABASE_URL)
    @IsString()
    DATABASE_HOST: string;

    @ValidateIf((envValues) => !envValues.DATABASE_URL)
    @IsInt()
    @Min(0)
    @Max(65535)
    DATABASE_PORT: number;

    @ValidateIf((envValues) => !envValues.DATABASE_URL)
    @IsString()
    DATABASE_PASSWORD: string;

    @ValidateIf((envValues) => !envValues.DATABASE_URL)
    @IsString()
    DATABASE_NAME: string;

    @ValidateIf((envValues) => !envValues.DATABASE_URL)
    @IsString()
    DATABASE_USERNAME: string;

    @IsBoolean()
    @IsOptional()
    DATABASE_SYNCHRONIZE: boolean;

    @IsInt()
    @IsOptional()
    DATABASE_MAX_CONNECTIONS: number;
}

export default registerAs<DatabaseConfig>('database', () => {
    validateConfig(process.env, EnvironmentVariablesValidator);
    console.log(process.env.DATABASE_PASSWORD);
    return {
        url: process.env.DATABASE_URL,
        type: process.env.DATABASE_TYPE,
        host: process.env.DATABASE_HOST,
        port: process.env.DATABASE_PORT
            ? parseInt(process.env.DATABASE_PORT, 10)
            : 5432,
        password: process.env.DATABASE_PASSWORD,
        name: process.env.DATABASE_NAME,
        username: process.env.DATABASE_USERNAME,
        synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
        maxConnections: process.env.DATABASE_MAX_CONNECTIONS
            ? parseInt(process.env.DATABASE_MAX_CONNECTIONS, 10)
            : 100,
    };
});