import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';
import { HelperDateService } from 'src/common/helper/services/helper.date.service';
import { IResult } from 'ua-parser-js';

@ApiTags('hello')
@Controller({
    version: VERSION_NEUTRAL,
    path: '/',
})
export class AppController {
    private readonly serviceName: string;

    constructor(
        private readonly configService: ConfigService,
        private readonly helperDateService: HelperDateService
    ) {
        this.serviceName = this.configService.get<string>('app.name');
    }

    @Get('/hello')
    async hello() {
        return 'hello';
    }
}