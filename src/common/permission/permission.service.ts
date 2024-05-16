import { Injectable } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { UserEntity } from 'src/modules/user/entities/user.entity';

import {
    Repository,
    EntityManager,
    DataSource,
    FindOptionsWhere,
} from 'typeorm';
import { PermissionObjectType } from './permission-object-type.enum';
import { PermissionForUserEntity } from './permission.user.entity';

@Injectable()
export class PermissionService {
    constructor(
        @InjectDataSource()
        private connection: DataSource,
        @InjectRepository(PermissionForUserEntity)
        private readonly permissionForUserRepository: Repository<PermissionForUserEntity>
    ) {}
/*
    private async setUserPermissionLevel<PermissionLevel extends number>(
        user: UserEntity,
        objectId: string,
        objectType: PermissionObjectType,
        permissionLevel: PermissionLevel,
        transactionalEntityManager?: EntityManager
    ): Promise<void> {
        const permissionForUser = new PermissionForUserEntity();
        permissionForUser.objectId = objectId;
        permissionForUser.objectType = objectType;
        permissionForUser.permissionLevel = permissionLevel;
        permissionForUser.userId = user.id;

        const queryBuilder = transactionalEntityManager
            ? transactionalEntityManager.createQueryBuilder()
            : this.permissionForUserRepository.createQueryBuilder();
        await queryBuilder
            .insert()
            .into(PermissionForUserEntity)
            .values(permissionForUser)
            .orUpdate({ overwrite: ['permissionLevel'] })
            .execute();
    }*/

    private async revokeUserPermission(
        user?: UserEntity,
        objectId?: string,
        objectType?: PermissionObjectType,
        transactionalEntityManager?: EntityManager
    ): Promise<void> {
        const match: FindOptionsWhere<PermissionForUserEntity> = {};
        if (objectId) match.objectId = objectId;
        if (objectType) match.objectType = objectType;
        if (user) match.userId = user.id;

        if (transactionalEntityManager)
            await transactionalEntityManager.delete(
                PermissionForUserEntity,
                match
            );
        else await this.permissionForUserRepository.delete(match);
    }
/*
    private async getUserPermissionLevel<PermissionLevel extends string>(
        user: UserEntity,
        objectId: string,
        objectType: PermissionObjectType
    ): Promise<PermissionLevel> {
        const permissionForUser =
            await this.permissionForUserRepository.findOneBy({
                objectId,
                objectType,
                userId: user.id,
            });
        if (!permissionForUser) return null;
        return permissionForUser.permissionLevel as PermissionLevel;
    }*/
/*
    async setPermissionLevel<PermissionLevel extends string>(
        userOrGroup: UserEntity,
        objectId: string,
        objectType: PermissionObjectType,
        permission: PermissionLevel,
        transactionalEntityManager?: EntityManager
    ): Promise<void> {
        if (userOrGroup instanceof UserEntity)
            return await this.setUserPermissionLevel(
                userOrGroup,
                objectId,
                objectType,
                permission,
                transactionalEntityManager
            );
        throw new Error('userOrGroup is neither a user nor a group');
    }*/
/*
    async revokePermission(
        userOrGroup: UserEntity,
        objectId?: number,
        objectType?: PermissionObjectType,
        transactionalEntityManager?: EntityManager
    ): Promise<void> {
        if (userOrGroup instanceof UserEntity)
            return await this.revokeUserPermission(
                userOrGroup,
                objectId,
                objectType,
                transactionalEntityManager
            );
        throw new Error('userOrGroup is neither a user nor a group');
    }*/
/*
    async getPermissionLevel<PermissionLevel extends number>(
        userOrGroup: UserEntity,
        objectId: string,
        objectType: PermissionObjectType
    ): Promise<PermissionLevel> {
        if (userOrGroup instanceof UserEntity)
            return await this.getUserPermissionLevel(
                userOrGroup,
                objectId,
                objectType
            );

        throw new Error('userOrGroup is neither a user nor a group');
    }*/
/*
    async userOrItsGroupsHavePermission<PermissionLevel extends number>(
        user: UserEntity,
        objectId: number,
        objectType: PermissionObjectType,
        permissionLevelRequired: PermissionLevel
    ): Promise<boolean> {
        if (!user) return false;
        if (
            (await this.getPermissionLevel(user, objectId, objectType)) >=
            permissionLevelRequired
        )
            return true;
    }*/

    /* async getUserOrItsGroupsMaxPermissionLevel<PermissionLevel extends number>(
        user: UserEntity,
        objectId: number,
        objectType: PermissionObjectType
    ): Promise<PermissionLevel> {
        const userPermission = await this.getPermissionLevel(
            user,
            objectId,
            objectType
        );

        const groupIdsOfUser = await this.groupService.getGroupIdsByUserId(
            user.id
        );
        const queryResult =
            groupIdsOfUser.length > 0 &&
            (await this.permissionForGroupRepository
                .createQueryBuilder()
                .select('MAX(permissionLevel)', 'maxPermissionLevel')
                .where(
                    'objectId = :objectId AND objectType = :objectType AND groupId IN (:...groupIds)',
                    {
                        objectId,
                        objectType,
                        groupIds: groupIdsOfUser,
                    }
                )
                .getRawOne());

        if (!userPermission)
            return queryResult ? queryResult.maxPermissionLevel : null;
        if (!queryResult) return userPermission as PermissionLevel;
        return Math.max(
            userPermission,
            queryResult.maxPermissionLevel
        ) as PermissionLevel;
    }*/

    async getUsersWithExactPermissionLevel<PermissionLevel extends number>(
        objectId: string,
        objectType: PermissionObjectType,
        permissionLevel: PermissionLevel
    ): Promise<string[]> {
        return (
            await this.permissionForUserRepository.findBy({
                objectId,
                objectType,
                permissionLevel,
            })
        ).map((permissionForUser) => permissionForUser.userId);
    }

    async getUsersAndGroupsWithExactPermissionLevel<
        PermissionLevel extends number,
    >(
        objectId: string,
        objectType: PermissionObjectType,
        permissionLevel: PermissionLevel
    ): Promise<string[]> {
        return await this.getUsersWithExactPermissionLevel(
            objectId,
            objectType,
            permissionLevel
        );
    }
    /*
    async getUserPermissionListOfObject<PermissionLevel extends number>(
        objectId: number,
        objectType: PermissionObjectType
    ): Promise<[userId: number, permissionLevel: PermissionLevel][]> {
        return (
            await this.permissionForUserRepository.findBy({
                objectId,
                objectType,
            })
        ).map((permissionForUser) => [
            permissionForUser.userId,
            permissionForUser.permissionLevel as PermissionLevel,
        ]);
    }*/
}
