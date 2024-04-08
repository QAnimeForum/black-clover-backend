import { config } from 'dotenv';

export const envFilePath = `${process.cwd()}/.${process.env.NODE_ENV || 'production'}.env`;

config({ path: envFilePath });

export const getFileMimeType = (filePath: string) => filePath.split('.').pop();

export const isValidImageFile = (mimeType: string) =>
    ['jpg', 'png', 'jpeg'].includes(mimeType);
