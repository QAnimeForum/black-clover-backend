import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';

//implements IUserService
@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
       // private readonly helperDateService: HelperDateService,
      //  private readonly configService: ConfigService
    ) {}
}

/**
 * 
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
