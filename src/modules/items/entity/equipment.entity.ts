import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

import { VehicleEntity } from './vehicle.entity';
import { EqupmentItemEntity } from './equpment.item.entity';

@Entity('equipment')
export class EquipmentEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => EqupmentItemEntity, { nullable: true })
    @JoinColumn({
        name: 'cap_id',
        referencedColumnName: 'id',
    })
    headdress: EqupmentItemEntity;

    @Column({
        name: 'headdress_id',
        type: 'uuid',
        nullable: true,
    })
    headdressId: string;

    @ManyToOne(() => EqupmentItemEntity, { nullable: true })
    @JoinColumn({
        name: 'armor_id',
        referencedColumnName: 'id',
    })
    armor: EqupmentItemEntity;

    @Column({
        name: 'armor_id',
        type: 'uuid',
        nullable: true,
    })
    armorId: string;

    @ManyToOne(() => EqupmentItemEntity, { nullable: true })
    @JoinColumn({
        name: 'cloak_id',
        referencedColumnName: 'id',
    })
    cloak: EqupmentItemEntity;

    @Column({
        name: 'cloak_id',
        type: 'uuid',
        nullable: true,
    })
    cloakId: string;

    @ManyToOne(() => EqupmentItemEntity, { nullable: true })
    @JoinColumn({
        name: 'left_hand_id',
        referencedColumnName: 'id',
    })
    leftHand: EqupmentItemEntity;

    @Column({
        name: 'left_hand_id',
        type: 'uuid',
        nullable: true,
    })
    leftHandId: string;

    @ManyToOne(() => EqupmentItemEntity, { nullable: true })
    @JoinColumn({
        name: 'right_hand_id',
        referencedColumnName: 'id',
    })
    rightHand: EqupmentItemEntity;

    @Column({
        name: 'right_hand_id',
        type: 'uuid',
        nullable: true,
    })
    rightHandId: string;

    @ManyToOne(() => EqupmentItemEntity, { nullable: true })
    @JoinColumn({
        name: 'gloves_id',
        referencedColumnName: 'id',
    })
    gloves: EqupmentItemEntity;

    @Column({
        name: 'gloves_id',
        type: 'uuid',
        nullable: true,
    })
    glovesId: string;

    @ManyToOne(() => EqupmentItemEntity, { nullable: true })
    @JoinColumn({
        name: 'feet_id',
        referencedColumnName: 'id',
    })
    feet: EqupmentItemEntity;

    @Column({
        name: 'feet_id',
        type: 'uuid',
        nullable: true,
    })
    feetId: string;

    @ManyToOne(() => EqupmentItemEntity, { nullable: true })
    @JoinColumn({
        name: 'accessory_id',
        referencedColumnName: 'id',
    })
    accessory: EqupmentItemEntity;

    @Column({
        name: 'accessory_id',
        type: 'uuid',
        nullable: true,
    })
    accessoryId: string;

    @ManyToOne(() => EqupmentItemEntity, { nullable: true })
    @JoinColumn({
        name: 'vehicle_id',
        referencedColumnName: 'id',
    })
    vehicle: VehicleEntity;

    @Column({
        name: 'vehicle_id',
        type: 'uuid',
        nullable: true,
    })
    vehicleId: string;
    /**
 * 
    @ManyToOne(() => EqupmentItemEntity)
    @JoinColumn({
        name: 'helmet_id',
        referencedColumnName: 'id',
    })
    helmet: EqupmentItemEntity;

    @ManyToOne(() => EqupmentItemEntity)
    @JoinColumn({
        name: 'weapon_id',
        referencedColumnName: 'id',
    })
    weapon: EqupmentItemEntity;

   

    @ManyToOne(() => EqupmentItemEntity)
    @JoinColumn({
        name: 'neck_id',
        referencedColumnName: 'id',
    })
    neck: EqupmentItemEntity;
    @ManyToOne(() => EqupmentItemEntity)
   

    @ManyToOne(() => EqupmentItemEntity)
    @JoinColumn({
        name: 'face_id',
        referencedColumnName: 'id',
    })
    face: EqupmentItemEntity;

    @ManyToOne(() => EqupmentItemEntity)
    @JoinColumn({
        name: 'eye_id',
        referencedColumnName: 'id',
    })
    eye: EqupmentItemEntity;

    @ManyToOne(() => EqupmentItemEntity)
    @JoinColumn({
        name: 'ear_id',
        referencedColumnName: 'id',
    })
    ear: EqupmentItemEntity;

    @ManyToOne(() => EqupmentItemEntity)
    @JoinColumn({
        name: 'clothes_id',
        referencedColumnName: 'id',
    })
    clothes: EqupmentItemEntity;

    @ManyToOne(() => EqupmentItemEntity)
    @JoinColumn({
        name: 'pants_id',
        referencedColumnName: 'id',
    })
    pants: EqupmentItemEntity;



   
    @ManyToOne(() => EqupmentItemEntity)
    @JoinColumn({
        name: 'shield_id',
        referencedColumnName: 'id',
    })
    shield: EqupmentItemEntity;


 */

    @CreateDateColumn({ default: () => 'now()', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ default: () => 'now()', name: 'updated_at' })
    updatedAt: Date;
}
