import { Column, Entity } from 'typeorm';

@Entity('variable_expenses')
export class VariableExpenses {
  @Column({ name: 'id', primary: true, generated: true })
  id: number;

  @Column({ name: 'uuid', default: () => 'gen_random_uuid()' })
  uuid: string;

  @Column({ name: 'description' })
  description: string;

  @Column({ name: 'amount' })
  amount: number;

  @Column({ name: 'category' })
  category: string;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'reference_year' })
  referenceYear: string;

  @Column({ name: 'reference_month' })
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
