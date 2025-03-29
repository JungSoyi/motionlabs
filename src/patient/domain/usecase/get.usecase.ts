import { Inject, Injectable } from "@nestjs/common";
import { PaginationOutput } from "src/common/dto/output/pagination.output";
import { Page } from "src/common/utils/paging/page";
import { PatientRepository } from "src/patient/data/repository/patient.repository";
import { IPatientRepository } from "src/patient/data/repository/patientRepository.interface";
import { Patient } from "src/patient/domain/entities/patient.entity";

@Injectable()
export class GetPatientUsecase {
  constructor(
    @Inject(PatientRepository)
    private readonly repository: IPatientRepository
  ) {}
  async execute(page: number, keyword: string, _take: number = 10): Promise<PaginationOutput<Patient>> {
    const { data, total } = await this.repository.findByKeyword(keyword, page, _take);
    return Page.of<Patient>(total, page, data);
  }
}
