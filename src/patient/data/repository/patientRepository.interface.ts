import { Patient } from "src/patient/entities/patient.entity";

export interface IPatientRepository {
  save(data: Patient): Promise<Patient>;
  save(data: Patient[]): Promise<Patient[]>;
  save(data: any): Promise<any>;
  findAll(): Promise<Patient[]>;
}
