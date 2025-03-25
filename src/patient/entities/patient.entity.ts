import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "patient" })
export class Patient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 255 })
  name: string;

  @Column({ name: "phone_number", type: "varchar", length: 20 })
  phoneNumber: string;

  @Column({ type: "varchar", length: 8 })
  birthday: string;

  @Column({ name: "patient_number", type: "varchar", length: 255, default: "" })
  patientNumber: string;

  @Column({ type: "varchar", length: 255 })
  address: string;

  @Column({ type: "varchar", length: 255, default: "" })
  memo: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
