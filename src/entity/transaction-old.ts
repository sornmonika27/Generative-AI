import { TranOldEnum } from './../common/types/enum';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('transactionOld')
export class TransactionOld {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255, nullable: true })
    fullMessage: string | null;

    @Column({ type: 'varchar', length: 100, nullable: true })
    trxId: string | null;

    @Column({ type: 'varchar', length: 50, nullable: true })
    apv: string | null;

    @Column({ type: 'varchar', length: 20, nullable: true })
    amount: string | null;

    @Column({ type: 'varchar', length: 50, nullable: true })
    payBy: string | null;

    @Column({ type: 'varchar', length: 20, nullable: true })
    payVia: string | null;

    @Column({ type: 'varchar', length: 50, nullable: true })
    payDate: string | null;

    @Column({ type: 'enum', enum: [TranOldEnum.PENDING, TranOldEnum.COMPLETED], default: TranOldEnum.PENDING })
  status: 'pending' | 'completed';

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updateAt: Date;
}