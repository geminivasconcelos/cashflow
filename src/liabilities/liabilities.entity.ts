import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('liabilities')
export class Liabilities {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'uuid', default: () => 'gen_random_uuid()' })
  uuid: string;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'description', nullable: true })
  description: string;

  @Column({ name: 'status', nullable: true })
  status: string;

  @Column({ name: 'amount', type: 'numeric', precision: 10, scale: 2 })
  amount: number;

  @Column({ name: 'installment_quantity' })
  installmentQuantity: number;

  @Column({ name: 'purchase_in_installments' })
  purchaseInInstallments: boolean;

  @Column({ name: 'total_paid', type: 'numeric', precision: 10, scale: 2 })
  totalPaid: number;

  @Column({ name: 'total_due', type: 'numeric', precision: 10, scale: 2 })
  totalDue: number;

  @Column({ name: 'installments_paid' })
  installmentsPaid: number;

  @Column({ name: 'installments_due' })
  installmentsDue: number;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    name: 'updated_at',
    type: 'timestamp',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @Column({
    name: 'deleted_at',
    type: 'timestamp',
    nullable: true,
  })
  deletedAt: Date;
}
