import { Module } from "@nestjs/common";
import { PatientService } from "./application/patient.service";
import { PatientController } from "./patient.controller";
import { UploadUsecase } from "src/patient/domain/usecase/upload.usecase";
import { PatientRepository } from "src/patient/data/repository/patient.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Patient } from "src/patient/domain/entities/patient.entity";
import { GetPatientUsecase } from "src/patient/domain/usecase/get.usecase";

@Module({
  imports: [TypeOrmModule.forFeature([Patient])],
  controllers: [PatientController],
  providers: [PatientService, UploadUsecase, GetPatientUsecase, PatientRepository],
})
export class PatientModule {}
