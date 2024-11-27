import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, TreeRepository } from 'typeorm';

import { EqupmentItemEntity } from '../entity/equpment.item.entity';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import fs from 'fs';
import { ResourceEntity } from '../entity/resource.entity';
import { ResourceCategoryEntity } from '../entity/resource.category.entity';
import { ResourceDto } from '../dto/resource.dto';
import { resources } from '../../../../Assets/json/items/resources.json';
@Injectable()
export class ResourceService {
    constructor(
        @InjectRepository(ResourceEntity)
        private readonly resourceRepository: TreeRepository<ResourceEntity>,
        @InjectRepository(ResourceCategoryEntity)
        private readonly resourceCateogryRepisitory: Repository<ResourceCategoryEntity>,
        @InjectDataSource()
        private readonly connection: DataSource
    ) {}

    public async findCategories() {
        return this.resourceRepository.findRoots();
    }
    public async findCategoriesByRoot(categoryId: string) {
        const item = await this.resourceRepository.findOneBy({
            id: categoryId,
        });
        return this.resourceRepository.findDescendantsTree(item);
    }

    async create(dto: ResourceDto) {
        const newItem = new ResourceEntity();

        const image = dto.image;
        const saveFormat = image
            .split('.')
            [image.split('.').length - 1].toLowerCase();
        const newName = `0.${saveFormat}`;

        newItem.name = dto.name;
        newItem.description = dto.description;
        newItem.edible = dto.edible;
        newItem.categoryId = dto.categoryId;
        newItem.image = newName;

        const savedItem = await this.resourceRepository.save(newItem);

        const dir = `${process.env.APP_API_URL}/Assets/images/items/${savedItem.id}`;

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.copyFileSync(image, `${dir}/${newName}`);
        return savedItem;
    }

    async findItemById(itemId: string | null): Promise<ResourceEntity> {
        if (itemId === null) {
            const newItem = new ResourceEntity();
            newItem.name = 'Нет';
            newItem.description = '';
            newItem.image = '';
            newItem.categoryId = '';
            return newItem;
        }
        const res: ResourceEntity = await this.resourceRepository.findOne({
            where: { id: itemId },
            relations: ['category'],
        });
        if (res) {
            return res;
        } else {
            throw Error('Не существует предмета с id: ' + itemId);
        }
    }

    async findAllResources(query: PaginateQuery) {
        return paginate(query, this.resourceRepository, {
            sortableColumns: ['id', 'name'],
            nullSort: 'last',
            defaultSortBy: [['name', 'DESC']],
            searchableColumns: ['name'],
            select: ['id', 'name'],
            filterableColumns: {
                categoryId: true,
            },
        });
    }
    async getIdWithName(itemName: string): Promise<string | null> {
        const res: ResourceEntity[] = await this.resourceRepository.findBy({
            name: itemName,
        });
        if (res.length) {
            return res[0].id;
        } else {
            return null;
        }
    }
    async changeItemName(dto: ChangeNameDto) {
        return await this.connection
            .createQueryBuilder()
            .update(ResourceEntity)
            .set({ name: dto.name })
            .where('id = :id', { id: dto.id })
            .returning('*')
            .updateEntity(true)
            .execute();
    }
    async changeItemDescription(dto: ChangeDescriptionDto) {
        return await this.connection
            .createQueryBuilder()
            .update(ResourceEntity)
            .set({ description: dto.description })
            .where('id = :id', { id: dto.id })
            .returning('*')
            .updateEntity(true)
            .execute();
    }

    async changeItemCategory(dto: ChangeItemCategoryDto) {
        return await this.connection
            .createQueryBuilder()
            .update(ResourceEntity)
            .set({ categoryId: dto.categoryId })
            .where('id = :id', { id: dto.id })
            .returning('*')
            .updateEntity(true)
            .execute();
    }

    async changePhoto(dto: ChangePhotoDto) {
        return await this.connection
            .createQueryBuilder()
            .update(ResourceEntity)
            .set({ image: dto.photoPath })
            .where('id = :id', { id: dto.id })
            .returning('*')
            .updateEntity(true)
            .execute();
    }

    async loadCategories() {
        for (let i = 0; i < resources.length; ++i) {
            const entity = await this.resourceCateogryRepisitory.save({
                name: resources[i].name,
                description: '',
                parentId: null,
            });
            this.loadChildrenCategories(
                resources[i]?.children ?? [],
                entity.id
            );
        }
    }
    async loadChildrenCategories(array: Array<any>, parentId: string) {
        for (let i = 0; i < array.length; ++i) {
            const entity = await this.resourceCateogryRepisitory.save({
                name: array[i].name,
                description: '',
                parentId: parentId,
            });
            this.loadChildrenCategories(array[i]?.children ?? [], entity.id);
        }
    }
}

class ChangeNameDto {
    id: string;
    name: string;
}

class ChangeDescriptionDto {
    id: string;
    description: string;
}

class ChangeItemCategoryDto {
    id: string;
    categoryId: string;
}

class ChangePhotoDto {
    id: string;
    photoPath: string;
}
