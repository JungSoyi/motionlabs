import { Injectable } from "@nestjs/common";
import { IPatientRepository } from "src/patient/data/repository/patientRepository.interface";
import { Patient } from "src/patient/domain/entities/patient.entity";
import { DataSource } from "typeorm/data-source/DataSource";
import { Repository } from "typeorm/repository/Repository";

@Injectable()
export class PatientRepository extends Repository<Patient> implements IPatientRepository {
  constructor(private dataSource: DataSource) {
    super(Patient, dataSource.manager);
  }
  save(data: Patient): Promise<Patient>;
  save(data: Patient[]): Promise<Patient[]>;
  async save(data: any): Promise<any> {
    return await super.save(data);
  }
  async findAll() {
    return this.findAll();
  }
}
