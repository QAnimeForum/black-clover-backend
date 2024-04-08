import { Module } from '@nestjs/common';
import { ErrorModule } from './error/error.module';
import { HelperModule } from './helper/helper.module';
import { MessageModule } from './message/message.module';
import { PaginationModule } from './pagination/pagination.module';
import { RequestModule } from './request/request.module';
import { ResponseModule } from './response/response.module';
@Module({
    controllers: [],
    providers: [],
    imports: [
        MessageModule,
        HelperModule,
        PaginationModule,
         ErrorModule,
        ResponseModule,
        RequestModule,
    ],
})
export class CommonModule {}
