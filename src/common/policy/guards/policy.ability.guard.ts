import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IRequestApp } from 'src/common/request/interfaces/request.interface';
import { POLICY_RULE_META_KEY } from '../constants/policy.constant';
import { ENUM_POLICY_STATUS_CODE_ERROR } from '../constants/policy.status-code.constant';
import { PolicyAbilityFactory } from '../factories/policy.ability.factory';
import {
    IPolicyRule,
    PolicyHandler,
    IPolicyAbility,
} from '../interfaces/policy.interface';

@Injectable()
export class PolicyGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly policyAbilityFactory: PolicyAbilityFactory
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const policyRule =
            this.reflector.get<IPolicyRule[]>(
                POLICY_RULE_META_KEY,
                context.getHandler()
            ) || [];

        /* const { user } = context.switchToHttp().getRequest<IRequestApp>();
        const { type, permissions } = user.user;

        const ability = this.policyAbilityFactory.defineAbilityFromRole({
            type,
            permissions,
        });

        const policyHandler: PolicyHandler[] =
            this.policyAbilityFactory.handlerRules(policyRule);
        const check: boolean = policyHandler.every((handler: PolicyHandler) => {
            return this.execPolicyHandler(handler, ability);
        });

        if (!check) {
            throw new ForbiddenException({
                statusCode:
                    ENUM_POLICY_STATUS_CODE_ERROR.POLICY_ABILITY_FORBIDDEN_ERROR,
                message: 'policy.error.abilityForbidden',
            });
        }*/

        return true;
    }

    private execPolicyHandler(handler: PolicyHandler, ability: IPolicyAbility) {
        if (typeof handler === 'function') {
            return handler(ability);
        }
        return handler.handle(ability);
    }
}
