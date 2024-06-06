import { Inject, Injectable } from '@nestjs/common';
import { DataSource, In, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { UserCreateDto } from '../dtos/user.create.dto';
import { CharacterService } from 'src/modules/character/services/character.service';
//implements IUserService
@Injectable()
export class UserService {
    constructor(
        @InjectDataSource()
        private readonly connection: DataSource,
        @Inject(CharacterService)
        readonly characterService: CharacterService,
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>
    ) {}

    async findUserById(id: string): Promise<UserEntity> {
        return await this.userRepository.findOneBy({
            id,
        });
    }

    async findUserByTelegramId(telegramId: string): Promise<UserEntity> {
        return await this.userRepository.findOneBy({
            tgUserId: telegramId,
        });
    }

    async findUsersByExistingIds(userIds: number[]): Promise<UserEntity[]> {
        if (userIds.length === 0) return [];
        const uniqueIds = Array.from(new Set(userIds));
        const records = await this.userRepository.findBy({
            id: In(uniqueIds),
        });
        const map = Object.fromEntries(
            records.map((record) => [record.id, record])
        );
        return userIds.map((userId) => map[userId]);
    }

    async userExists(id: string): Promise<boolean> {
        return (await this.userRepository.countBy({ id })) !== 0;
    }

    async getUserList(
        sortBy: 'acceptedProblemCount' | 'rating',
        skipCount: number,
        takeCount: number
    ): Promise<[users: UserEntity[], count: number]> {
        return await this.userRepository.findAndCount({
            order: {
                [sortBy]: 'DESC',
            },
            skip: skipCount,
            take: takeCount,
        });
    }

    async createUser(dto: UserCreateDto) {
        let user: UserEntity;
        this.connection.transaction(
            'READ UNCOMMITTED',
            async (transactionManager) => {
                const character =
                    await this.characterService.createPlayableCharacter(
                        transactionManager,
                        dto.character
                    );
                user = new UserEntity();
                user.tgUserId = dto.tgUserId;
                user.characterId = character.id;
                user.isAdmin = false;
                console.log(user);
                await transactionManager.save(user);
            }
        );
        return user;
    }
    async exists(telegramUserId: string): Promise<boolean> {
        return this.userRepository.exists({
            where: {
                tgUserId: telegramUserId,
            },
        });
    }
    async isShowAdminButton(userTgId: string): Promise<boolean> {
        const user = await this.userRepository.findOneBy({
            tgUserId: userTgId,
        });
        return user.isAdmin;
    }

    async getAdmins(): Promise<Array<UserEntity>> {
        const users = await this.userRepository.find({
            where: {
                isAdmin: true,
            },
            select: {
                id: true,
                tgUserId: true,
            },
        });
        return users;
    }
    /**
 * 
    async changeUserRole(
        tgUserId: string,
        userRole: ENUM_ROLE_TYPE
    ): Promise<UserEntity> {
        const user = await this.userRepository.findOne({
            where: {
                tgUserId: tgUserId,
            },
        });
        user.role = userRole;
        return this.userRepository.save(user);
    }
 */
}
/*
    async findAll<T = IUserDoc>(
        find?: Record<string, any>,
        options?: IDatabaseFindAllOptions
    ): Promise<T[]> {
        return this.userRepository.findAll<T>(find, options);
    }

    async findOneById<UserEntity>(_id: string): Promise<UserEntity> {
        return this.userRepository.findOne({
            where: {
                id: _id,
            },
        });
    }

    async findOne<T>(
        find: Record<string, any>,
        options?: IDatabaseFindOneOptions
    ): Promise<T> {
        return this.userRepository.findOne<T>(find, options);
    }

    async getTotal(
        find?: Record<string, any>,
        options?: IDatabaseGetTotalOptions
    ): Promise<number> {
        return this.userRepository.getTotal(find, { ...options, join: true });
    }

    async create({ role }: UserCreateDto): Promise<UserDoc> {
        const create: UserEntity = new UserEntity();
        create.role = role;
        create.isActive = true;

        return this.userRepository.create<UserEntity>(create, options);
    }

    async delete(
        repository: UserDoc,
        options?: IDatabaseSaveOptions
    ): Promise<UserDoc> {
        return this.userRepository.softDelete(repository, options);
    }

    async updateName(
        repository: UserDoc,
        { firstName, lastName }: UserUpdateNameDto,
        options?: IDatabaseSaveOptions
    ): Promise<UserDoc> {
        repository.firstName = firstName;
        repository.lastName = lastName;

        return this.userRepository.save(repository, options);
    }

    async active(
        repository: UserDoc,
        options?: IDatabaseSaveOptions
    ): Promise<UserEntity> {
        repository.isActive = true;
        repository.inactiveDate = undefined;

        return this.userRepository.save(repository, options);
    }

    async inactive(
        repository: UserDoc,
        options?: IDatabaseSaveOptions
    ): Promise<UserDoc> {
        repository.isActive = false;
        repository.inactiveDate = this.helperDateService.create();

        return this.userRepository.save(repository, options);
    }

    async inactivePermanent(
        repository: UserDoc,
        options?: IDatabaseSaveOptions
    ): Promise<UserDoc> {
        repository.isActive = false;
        repository.inactivePermanent = true;
        repository.inactiveDate = this.helperDateService.create();

        return this.userRepository.save(repository, options);
    }

    async joinWithRole(repository: UserDoc): Promise<IUserDoc> {
        return repository.populate({
            path: 'role',
            localField: 'role',
            foreignField: '_id',
            model: RoleEntity.name,
        });
    }

    async import(
        data: UserImportDto[],
        role: string,
        { passwordCreated, passwordHash, salt }: IAuthPassword,
        options?: IDatabaseCreateManyOptions
    ): Promise<boolean> {
        const passwordExpired: Date = this.helperDateService.backwardInDays(1);
        const users: UserEntity[] = data.map(
            ({ email, firstName, lastName, mobileNumber }) => {
                const create: UserEntity = new UserEntity();
                create.firstName = firstName;
                create.email = email;
                create.password = passwordHash;
                create.role = role;
                create.isActive = true;
                create.inactivePermanent = false;
                create.blocked = false;
                create.lastName = lastName;
                create.salt = salt;
                create.passwordExpired = passwordExpired;
                create.passwordCreated = passwordCreated;
                create.signUpDate = this.helperDateService.create();
                create.passwordAttempt = 0;
                create.mobileNumber = mobileNumber ?? undefined;
                create.signUpFrom = ENUM_USER_SIGN_UP_FROM.ADMIN;

                return create;
            }
        );

        return this.userRepository.createMany<UserEntity>(users, options);
    }

    async deleteMany(
        find: Record<string, any>,
        options?: IDatabaseManyOptions
    ): Promise<boolean> {
        return this.userRepository.deleteMany(find, options);
    }
 */
