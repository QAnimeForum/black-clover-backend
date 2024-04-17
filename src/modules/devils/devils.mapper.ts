import { Devil } from './domain/devil';
import { DevilEntity } from './entity/devil.entity';

export class DevilMapper {
    static toDomain(raw: DevilEntity): Devil {
        const devil = new Devil();
        devil.id = raw.id;
        devil.name = raw.name;
        devil.description = raw.description;
        devil.floor = raw.floor;
        devil.rank = raw.rank;
        devil.magic_type = raw.magic_type;
        return devil;
    }

    static toPersistence(devil: Devil): DevilEntity {
        const devilEntity = new DevilEntity();
        if (devil.id && typeof devil.id === 'string') {
            devilEntity.id = devil.id;
        }
        devilEntity.name = devil.name;
        devilEntity.description = devil.description;
        devilEntity.floor = devil.floor;
        devilEntity.rank = devil.rank;
        devilEntity.magic_type = devil.magic_type;
        return devilEntity;
    }
}
