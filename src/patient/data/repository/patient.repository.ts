import { Injectable } from "@nestjs/common";
import { DataWithTotalCount } from "src/common/dto/output/pagination.output";
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
  async upload(data: Patient[]) {
    const chunkSize = Math.ceil(data.length / 1000);
    const chunkedData = this.chunkArray(data, chunkSize);
    await Promise.allSettled(
      chunkedData.map((chunk) =>
        this.createQueryBuilder()
          .insert()
          .into(Patient)
          .values(chunk)
          .orUpdate(["birthday", "address", "memo"], ["name", "phoneNumber", "chartNumber"])
          .updateEntity(false)
          .execute()
      )
    );
  }

  private chunkArray<T>(arr: T[], size: number): T[][] {
    const result: T[][] = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  }

  async findByKeyword(keyword: string = "", page: number, take: number): Promise<DataWithTotalCount<Patient>> {
    const query = this.createQueryBuilder("patient")
      .where("patient.name LIKE :keyword", { keyword: `%${keyword}%` })
      .orWhere("patient.phoneNumber LIKE :keyword")
      .orWhere("patient.chartNumber LIKE :keyword");

    const [total, data] = await Promise.all([
      query.getCount(),
      query
        .clone()
        .take(take)
        .skip((page - 1) * take)
        .getMany(),
    ]);

    return { data, total };
  }
}
