import { Column, Entity } from 'typeorm';

@Entity('variable_expenses')
export class VariableExpenses {
  @Column({ name: 'id', primary: true, generated: true })
  id: number;

  @Column({ name: 'uuid', default: () => 'gen_random_uuid()' })
  uuid: string;

  @Column()
  description: string;

  @Column()
  amount: number;

  @Column()
  category: string;

  @Column()
  userId: number;

  @Column()
  referenceYear: string;

  @Column()
  referenceMonth: string;

  @Column({ name: 'created_in', default: () => 'CURRENT_TIMESTAMP' })
  createdIn: string;

  @Column({
    name: 'updated_in',
    nullable: true,
  })
  updatedIn: string;

  @Column({ name: 'deleted_in', nullable: true })
  deletedIn: string;

  @Column({ name: 'payment_date' })
  paymentDate: string;
}
