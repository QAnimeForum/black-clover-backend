import { Injectable } from '@nestjs/common';
import { DevilEntity } from '../entity/devil.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationListDto } from 'src/common/pagination/dtos/pagination.list.dto';
import { DevilCreateDto } from '../dtos/devil.create.dto';
import { DevilUnionEntity } from '../entity/devil.union.entity';
import { DevilSpellEntity } from '../entity/devil.spell.entity';
import { DevilUpdateNameDto } from '../dtos/devil.update-name.dto';
import { DevilUpdateDescriptionDto } from '../dtos/devil.update-description.dto';
import { ENUM_DEVIL_RANK } from '../constants/devil.ranks.enum';
import { ENUM_DEVIL_FLOOR } from '../constants/devil.floor.enum';
@Injectable()
export class DevilsService {
    constructor(
        @InjectRepository(DevilEntity)
        private readonly devilRepository: Repository<DevilEntity>,
        @InjectRepository(DevilUnionEntity)
        private readonly devilUnionRepository: Repository<DevilUnionEntity>,
        @InjectRepository(DevilSpellEntity)
        private readonly devilSpellRepository: Repository<DevilSpellEntity>
    ) {}

    async findAllDevils(
        dto: PaginationListDto,
        rank: Record<string, any>,
        floor: Record<string, any>
    ): Promise<[DevilEntity[], number]> {
        const [entities, total] = await this.devilRepository.findAndCount({
            skip: dto._offset * dto._limit,
            take: dto._limit,
            order: dto._availableOrderBy?.reduce(
                (accumulator, sort) => ({
                    ...accumulator,
                    [sort]: dto._order,
                }),
                {}
            ),
        });
        return [entities, total];
    }
    findByRank(rank: ENUM_DEVIL_RANK): Promise<DevilEntity[]> {
        return this.devilRepository.find({
            where: {
                rank: rank,
            },
        });
    }

    findByFloor(floor: ENUM_DEVIL_FLOOR): Promise<DevilEntity[]> {
        return this.devilRepository.find({
            where: {
                floor: floor,
            },
        });
    }

    findDevilById(id: string): Promise<DevilEntity | null> {
        return this.devilRepository.findOneBy({ id });
    }

    findDevilByIdWithUnions(id: string): Promise<DevilEntity | null> {
        return this.devilRepository.findOne({
            where: {
                id: id,
            },
            relations: {
                union_10: true,
                union_25: true,
                union_50: true,
                union_65: true,
                union_80: true,
                union_100: true,
            },
        });
    }
    findSpellsByUnion(id: string) {
        return this.devilUnionRepository.findOne({
            where: {
                id: id,
            },
            relations: {
                spells: true,
            },
        });
    }
    findOneByName(name: string): Promise<DevilEntity | null> {
        return this.devilRepository.findOne({
            where: {
                name: name,
            },
        });
    }
    async createDevil(dto: DevilCreateDto) {
        const devil_union_10: DevilUnionEntity = (
            await this.devilUnionRepository.insert({})
        ).raw[0];
        const devil_union_25: DevilUnionEntity = (
            await this.devilUnionRepository.insert({})
        ).raw[0];
        const devil_union_50: DevilUnionEntity = (
            await this.devilUnionRepository.insert({})
        ).raw[0];
        const devil_union_65: DevilUnionEntity = (
            await this.devilUnionRepository.insert({})
        ).raw[0];
        const devil_union_80: DevilUnionEntity = (
            await this.devilUnionRepository.insert({})
        ).raw[0];
        const devil_union_100: DevilUnionEntity = (
            await this.devilUnionRepository.insert({})
        ).raw[0];
        const insert = await this.devilRepository.insert({
            name: dto.name,
            description: dto.description,
            rank: ENUM_DEVIL_RANK[dto.rank],
            floor: ENUM_DEVIL_FLOOR[dto.floor],
            magic_type: dto.magic_type,
            union_10: devil_union_10,
            union_25: devil_union_25,
            union_50: devil_union_50,
            union_65: devil_union_65,
            union_80: devil_union_80,
            union_100: devil_union_100,
        });
        return insert.raw[0].id;
    }
    async deleteDevil(id: string): Promise<void> {
        await this.devilRepository.delete(id);
    }
    async updateDevilName(id: string, dto: DevilUpdateNameDto) {
        const devil = await this.findDevilById(id);
        devil.name = dto.name;
        await this.devilRepository.save(devil);
    }
    async updateDevilDescription(id: string, dto: DevilUpdateDescriptionDto) {
        const devil = await this.findDevilById(id);
        devil.name = dto.description;
        this.devilRepository.save(devil);
    }
    async existByName(name: string): Promise<boolean> {
        const entity = await this.devilRepository.findOneBy({
            name: name,
        });
        return entity ? true : false;
    }
}

/**
 *     findAll() {}
    findById() {}
    findeOne() {}
    findOneByName() {}
    create() {}
    delete() {}
    deleteMany() {}
 */
/**
 *   findAll<T>(
        find?: Record<string, any>,
        options?: IDatabaseFindAllOptions
    ): Promise<T[]>;
    findOneById<T>(_id: string, options?: IDatabaseFindOneOptions): Promise<T>;
    findOne<T>(
        find: Record<string, any>,
        options?: IDatabaseFindOneOptions
    ): Promise<T>;
    findOneByUsername<T>(
        username: string,
        options?: IDatabaseFindOneOptions
    ): Promise<T>;
    findOneByEmail<T>(
        email: string,
        options?: IDatabaseFindOneOptions
    ): Promise<T>;
    findOneByMobileNumber<T>(
        mobileNumber: string,
        options?: IDatabaseFindOneOptions
    ): Promise<T>;
    getTotal(
        find?: Record<string, any>,
        options?: IDatabaseGetTotalOptions
    ): Promise<number>;
    create(
        { firstName, lastName, email, mobileNumber, role }: UserCreateDto,
        { passwordExpired, passwordHash, salt, passwordCreated }: IAuthPassword,
        options?: IDatabaseCreateOptions
    ): Promise<UserDoc>;
    existByEmail(
        email: string,
        options?: IDatabaseExistOptions
    ): Promise<boolean>;
    existByMobileNumber(
        mobileNumber: string,
        options?: IDatabaseExistOptions
    ): Promise<boolean>;
    existByUsername(
        username: string,
        options?: IDatabaseExistOptions
    ): Promise<boolean>;
    delete(
        repository: UserDoc,
        options?: IDatabaseSaveOptions
    ): Promise<UserDoc>;
    updateName(
        repository: UserDoc,
        { firstName, lastName }: UserUpdateNameDto,
        options?: IDatabaseSaveOptions
    ): Promise<UserDoc>;
    updateUsername(
        repository: UserDoc,
        { username }: UserUpdateUsernameDto,
        options?: IDatabaseSaveOptions
    ): Promise<UserDoc>;
    updatePhoto(
        repository: UserDoc,
        photo: AwsS3Serialization,
        options?: IDatabaseSaveOptions
    ): Promise<UserDoc>;
    updatePassword(
        repository: UserDoc,
        { passwordHash, passwordExpired, salt, passwordCreated }: IAuthPassword,
        options?: IDatabaseSaveOptions
    ): Promise<UserDoc>;
    active(
        repository: UserDoc,
        options?: IDatabaseSaveOptions
    ): Promise<UserEntity>;
    inactive(
        repository: UserDoc,
        options?: IDatabaseSaveOptions
    ): Promise<UserDoc>;
    inactivePermanent(
        repository: UserDoc,
        options?: IDatabaseSaveOptions
    ): Promise<UserDoc>;
    blocked(
        repository: UserDoc,
        options?: IDatabaseSaveOptions
    ): Promise<UserDoc>;
    unblocked(
        repository: UserDoc,
        options?: IDatabaseSaveOptions
    ): Promise<UserDoc>;
    updatePasswordAttempt(
        repository: UserDoc,
        { passwordAttempt }: UserUpdatePasswordAttemptDto,
        options?: IDatabaseSaveOptions
    ): Promise<UserDoc>;
    increasePasswordAttempt(
        repository: UserDoc,
        options?: IDatabaseSaveOptions
    ): Promise<UserDoc>;
    resetPasswordAttempt(
        repository: UserDoc,
        options?: IDatabaseSaveOptions
    ): Promise<UserDoc>;
    updatePasswordExpired(
        repository: UserDoc,
        passwordExpired: Date,
        options?: IDatabaseSaveOptions
    ): Promise<UserDoc>;
    joinWithRole(repository: UserDoc): Promise<IUserDoc>;
    getUploadPath(user: string): Promise<string>;
    payloadSerialization(data: IUserDoc): Promise<UserPayloadSerialization>;
    deleteMany(
        find: Record<string, any>,
        options?: IDatabaseManyOptions
    ): Promise<boolean>;
    import(
        data: UserImportDto[],
        role: string,
        { passwordCreated, passwordHash, salt }: IAuthPassword,
        options?: IDatabaseCreateManyOptions
    ): Promise<boolean>;
    existByEmails(
        emails: string[],
        options?: IDatabaseExistOptions
    ): Promise<boolean>;
    existByMobileNumbers(
        mobileNumbers: string[],
        options?: IDatabaseExistOptions
    ): Promise<boolean>;
 */
