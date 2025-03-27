import { Patient } from "src/patient/domain/entities/patient.entity";

export interface IPatientRepository {
  save(data: Patient): Promise<Patient>;
  save(data: Patient[]): Promise<Patient[]>;
  save(data: any): Promise<any>;
  findAll(): Promise<Patient[]>;
}
