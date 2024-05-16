import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TelegrafExecutionContext } from 'nestjs-telegraf';
import { ROLES_KEY } from '../decorators/allowed-roles.decorator';
import { BotContext } from 'src/modules/tg-bot/interfaces/bot.context';
import { ENUM_ROLE_TYPE } from 'src/modules/user/constants/role.enum.constant';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRoles = this.reflector.getAllAndMerge<ENUM_ROLE_TYPE[]>(
            ROLES_KEY,
            [context.getHandler(), context.getClass()]
        );
        if (!requiredRoles.length) return true;
        const execCtx = TelegrafExecutionContext.create(context);
        const ctx = execCtx.getContext<BotContext>();
        const { user } = ctx.session;
        const canPass = requiredRoles.some((role) => role === user.role);
        if (!canPass) {
            return false;
        }
        return true;
    }
}
