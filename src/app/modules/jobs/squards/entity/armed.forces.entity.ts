import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { SquadEntity } from "./squad.entity";
import { StateEntity } from "src/app/modules/map/enitity/state.entity";

@Entity("armer_forces")
export class ArmerForcesEntity{
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    type: 'varchar'
  })
  name: string;

  @Column({
    type: 'varchar'
  })
  descripiton: string;

  state: StateEntity;
  squads: Array<SquadEntity>;
}