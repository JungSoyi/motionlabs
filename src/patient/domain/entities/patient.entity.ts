import regexBirthday from "src/patient/application/util/regexBirthday";
import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Index(["name", "phoneNumber", "chartNumber"], { unique: true })
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

  @Column({ name: "chart_number", type: "varchar", length: 255, default: "" })
  chartNumber: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  address: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  memo: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  static create(data: Partial<Patient>) {
    const patient = new Patient();
    patient.name = data.name;
    patient.phoneNumber = data.phoneNumber;
    patient.birthday = data.birthday ? regexBirthday(data.birthday) : null;
    patient.chartNumber = data.chartNumber || "";
    patient.address = data.address;
    patient.memo = data.memo;
    return patient;
  }
}
