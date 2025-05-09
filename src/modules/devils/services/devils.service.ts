import { Injectable } from '@nestjs/common';
import { DevilEntity } from '../entity/devil.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { PaginationListDto } from 'src/common/pagination/dtos/pagination.list.dto';
import { DevilCreateDto } from '../dtos/devil.create.dto';
import { DevilUnionEntity } from '../entity/devil.union.entity';
import { DevilSpellEntity } from '../entity/devil.spell.entity';
import { DevilUpdateNameDto } from '../dtos/devil.update-name.dto';
import { DevilUpdateDescriptionDto } from '../dtos/devil.update-description.dto';
import { ENUM_DEVIL_RANK } from '../constants/devil.ranks.enum';
import { ENUM_DEVIL_FLOOR } from '../constants/devil.floor.enum';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { DevilDefaultSpellsEntity } from '../entity/devil.default.spells.entity';
import { DevilUnionsPercentEnum } from '../constants/devil.union.percent.enum';
import { SpellCreateDto } from 'src/modules/grimoire/dto/spell.create.dto';
import { SpellEntity } from 'src/modules/grimoire/entity/spell.entity';
import { ENUM_SPELL_STATUS } from 'src/modules/grimoire/constants/spell.status.enum.constant';
@Injectable()
export class DevilsService {
    constructor(
        @InjectDataSource()
        private readonly connection: DataSource,
        @InjectRepository(DevilEntity)
        private readonly devilRepository: Repository<DevilEntity>,
        @InjectRepository(DevilUnionEntity)
        private readonly devilUnionRepository: Repository<DevilUnionEntity>,
        @InjectRepository(DevilSpellEntity)
        private readonly devilSpellRepository: Repository<DevilSpellEntity>,
        @InjectRepository(DevilDefaultSpellsEntity)
        private readonly devilDefaultSpellsRepository: Repository<DevilDefaultSpellsEntity>
    ) {}

    public findAll(query: PaginateQuery): Promise<Paginated<DevilEntity>> {
        return paginate(query, this.devilRepository, {
            sortableColumns: ['id', 'name', 'floor'],
            nullSort: 'last',
            defaultSortBy: [['name', 'DESC']],
            searchableColumns: ['name', 'floor', 'rank'],
            select: ['id', 'name', 'floor', 'rank'],
            filterableColumns: {
                name: true,
                floor: true,
                rank: true,
            },
        });
    }

    findDevilById(id: string): Promise<DevilEntity | null> {
        return this.devilRepository.findOneBy({ id });
    }

    /* findDevilByIdWithUnions(id: string): Promise<DevilEntity | null> {
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
    }*/
    /* findSpellsByUnion(id: string) {
        return this.devilUnionRepository.findOne({
            where: {
                id: id,
            },
            relations: {
                spells: true,
            },
        });
    }*/
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
            magicType: dto.magicType,
            /* union_10: devil_union_10,
            union_25: devil_union_25,
            union_50: devil_union_50,
            union_65: devil_union_65,
            union_80: devil_union_80,
            union_100: devil_union_100,*/
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
        devil.description = dto.description;
        this.devilRepository.save(devil);
    }

    async updateDevilFloor(id: string, floor: ENUM_DEVIL_FLOOR) {
        return await this.connection
            .createQueryBuilder()
            .update(DevilEntity)
            .set({ floor: floor })
            .where('id = :id', { id: id })
            .execute();
    }

    async updateDevilRank(id: string, rank: ENUM_DEVIL_RANK) {
        return await this.connection
            .createQueryBuilder()
            .update(DevilEntity)
            .set({ rank: rank })
            .where('id = :id', { id: id })
            .execute();
    }

    async existByName(name: string): Promise<boolean> {
        const entity = await this.devilRepository.findOneBy({
            name: name,
        });
        return entity ? true : false;
    }

    async findDefaultSpells(query: PaginateQuery) {
        return paginate(query, this.devilDefaultSpellsRepository, {
            sortableColumns: ['id', 'percent', 'spell.name'],
            nullSort: 'last',
            defaultSortBy: [['spell.name', 'DESC']],
            searchableColumns: [
                'id',
                'percent',
                'devil.id',
                'devil.name',
                'spell.id',
                'spell.name',
            ],
            select: [
                'id',
                'devilId',
                'percent',
                'devil',
                'devil.id',
                'devil.name',
                'spell',
                'spell.id',
                'spell.name',
            ],
            relations: {
                devil: true,
                spell: true,
            },
            filterableColumns: {
                spell: true,
                devil_id: true,
                percent: true,
            },
        });
    }
    async createSpell(
        dto: SpellCreateDto,
        devilId: string,
        percent: DevilUnionsPercentEnum
    ) {
        let spellEntity: SpellEntity;
        await this.connection.transaction(
            async (transactionalEntityManager) => {
                // execute queries using transactionalEntityManager
                spellEntity = new SpellEntity();
                spellEntity.name = dto.name;
                spellEntity.description = dto.description;
                spellEntity.damage = dto.damage;
                spellEntity.range = dto.range;
                spellEntity.duration = dto.duration;
                spellEntity.cost = dto.cost;
                spellEntity.castTime = dto.castTime;
                spellEntity.cooldown = dto.cooldown;
                spellEntity.type = dto.type;
                spellEntity.goals = dto.goals;
                spellEntity.status = ENUM_SPELL_STATUS.DRAFT;
                await transactionalEntityManager.save(spellEntity);
                // spellEntity.minimalCharacterLevel = dto.minLevel;
                //  spellEntity.requirements = dto.requipments;
                const defaultSpellsEntity = new DevilDefaultSpellsEntity();
                defaultSpellsEntity.spell = spellEntity;
                defaultSpellsEntity.devilId = devilId;
                defaultSpellsEntity.percent = percent;
                await transactionalEntityManager.save(defaultSpellsEntity);
            }
        );
    }
    findDefaultSpell(defaultSpellId: string) {
        return this.devilDefaultSpellsRepository.findOne({
            where: {
                id: defaultSpellId,
            },
            relations: {
                spell: true,
            },
        });
    }
}

export class UnionDefaultSpellsDto {
    devilId: string;
    unionType: DevilUnionsPercentEnum;
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
