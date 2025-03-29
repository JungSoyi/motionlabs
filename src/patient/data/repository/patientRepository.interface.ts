import { DataWithTotalCount } from "src/common/dto/output/pagination.output";
import { Patient } from "src/patient/domain/entities/patient.entity";

export interface IPatientRepository {
  save(data: Patient): Promise<Patient>;
  save(data: Patient[]): Promise<Patient[]>;
  save(data: any): Promise<any>;
  findAll(): Promise<Patient[]>;
  upload(data: Patient[]);
  findByKeyword(keyword: string, page: number, take: number): Promise<DataWithTotalCount<Patient>>;
}
