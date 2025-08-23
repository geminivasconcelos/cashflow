import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('savings')
export class Savings {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'uuid', default: () => 'gen_random_uuid()' })
  uuid: string;

  @Column({ name: 'description', nullable: true })
  description: string;

  @Column({ name: 'amount' })
  amount: number;

  @Column({ name: 'category', nullable: true })
  category: string;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'created_in', default: () => 'CURRENT_TIMESTAMP' })
  createdIn: string;

  @Column({
    name: 'updated_in',
    nullable: true,
  })
  updatedIn: string;

  @Column({ name: 'deleted_in', nullable: true })
  deletedIn: string;
}
