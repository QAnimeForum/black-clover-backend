import { AbilityBuilder, createMongoAbility } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { HelperNumberService } from 'src/common/helper/services/helper.number.service';
import {
    ENUM_POLICY_ACTION,
    ENUM_POLICY_REQUEST_ACTION,
} from '../constants/policy.enum.constant';
import {
    IPolicyRequest,
    IPolicyAbility,
    IPolicyRuleAbility,
    IPolicyRule,
    PolicyHandler,
} from '../interfaces/policy.interface';
import { UserPayloadPermissionSerialization } from 'src/app/modules/user/serializations/user.payload.serialization';
import { ENUM_ROLE_TYPE } from 'src/app/modules/role/constants/role.enum.constant';

@Injectable()
export class PolicyAbilityFactory {
    constructor(private readonly helperNumberService: HelperNumberService) {}

    defineAbilityFromRole({ type, permissions }: IPolicyRequest) {
        const { can, build } = new AbilityBuilder<IPolicyAbility>(
            createMongoAbility
        );

        if (type === ENUM_ROLE_TYPE.SUPER_ADMIN) {
            can(ENUM_POLICY_ACTION.MANAGE, 'all');
        } else {
            for (const permission of permissions) {
                const abilities = this.mappingAbility(permission);

                for (const ability of abilities) {
                    can(ability.action, ability.subject);
                }
            }
        }

        return build();
    }

    mappingAbility({
        subject,
        action,
    }: UserPayloadPermissionSerialization): IPolicyRuleAbility[] {
        return action
            .split(',')
            .map((val: string) => ({
                action: this.mappingRequestRule(Number.parseInt(val)),
                subject,
            }))
            .flat(1);
    }

    mappingRequestRule(action: number): ENUM_POLICY_ACTION {
        switch (action) {
            case ENUM_POLICY_REQUEST_ACTION.MANAGE:
                return ENUM_POLICY_ACTION.MANAGE;
            case ENUM_POLICY_REQUEST_ACTION.READ:
                return ENUM_POLICY_ACTION.READ;
            case ENUM_POLICY_REQUEST_ACTION.CREATE:
                return ENUM_POLICY_ACTION.CREATE;
            case ENUM_POLICY_REQUEST_ACTION.UPDATE:
                return ENUM_POLICY_ACTION.UPDATE;
            case ENUM_POLICY_REQUEST_ACTION.DELETE:
                return ENUM_POLICY_ACTION.DELETE;
            case ENUM_POLICY_REQUEST_ACTION.EXPORT:
                return ENUM_POLICY_ACTION.EXPORT;
            case ENUM_POLICY_REQUEST_ACTION.IMPORT:
                return ENUM_POLICY_ACTION.IMPORT;
            default:
                return null;
        }
    }

    handlerRules(rules: IPolicyRule[]): PolicyHandler[] {
        return rules
            .map(({ subject, action }) => {
                return action
                    .map(
                        (val) => (ability: IPolicyAbility) =>
                            ability.can(val, subject)
                    )
                    .flat(1);
            })
            .flat(1);
    }
}
