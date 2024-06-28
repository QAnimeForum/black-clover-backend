import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AnnouncementEntity } from '../entity/announcement.entity';
import { ENUM_ANNOUNCEMENT_TYPE } from '../constant/announcement.enum';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';

export class AnnouncementCreateDto {
    title: string;
    description: string;
    type: ENUM_ANNOUNCEMENT_TYPE;
}
@Injectable()
export class AnnouncementService {
    constructor(
        @InjectRepository(AnnouncementEntity)
        private readonly announcementRepository: Repository<AnnouncementEntity>
    ) {}

    async createAnnouncement(dto: AnnouncementCreateDto) {
        return this.announcementRepository.insert({
            title: dto.title,
            description: dto.description,
            type: dto.type,
        });
    }


    public findAllAnnouncements(
        query: PaginateQuery
    ): Promise<Paginated<AnnouncementEntity>> {
        /**
         *   where: {
                grimoire: grimoireId,
            },
         */
        return paginate(query, this.announcementRepository, {
            sortableColumns: ['id', 'title'],
            nullSort: 'last',
            defaultSortBy: [['title', 'DESC']],
            searchableColumns: ['title'],
            select: ['id', 'title', 'description'],
            filterableColumns: {
                title: true,
            },
        });
    }
}
