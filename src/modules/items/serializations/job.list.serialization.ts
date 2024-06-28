import { OmitType } from '@nestjs/swagger';
import { JobGetSerialization } from './job.get.serialization';
export class JobListSerialization extends OmitType(
    JobGetSerialization,
    [] as const
) {}
