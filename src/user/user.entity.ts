import { Column, Entity } from 'typeorm';

@Entity()
export class User {
  @Column({ name: 'id', primary: true, generated: true })
  id: number;

  @Column({ name: 'uuid', default: () => 'gen_random_uuid()' })
  uuid: string;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'surname' })
  surname: string;

  @Column({ name: 'email' })
  email: string;

  @Column({ name: 'password' })
  password: string;

  @Column({ name: 'created_in', default: () => 'CURRENT_TIMESTAMP' })
  createdIn: string;

  @Column({
    name: 'updated_in',
    nullable: true,
  })
  updatedIn: string;

  @Column({ name: 'deleted_in', nullable: true })
  deletedIn: string;

  @Column({ name: 'photo', default: true })
  photo: string;
}
