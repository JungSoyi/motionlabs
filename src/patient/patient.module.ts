import { Module } from "@nestjs/common";
import { PatientService } from "./patient.service";
import { PatientController } from "./patient.controller";
import { UploadUsecase } from "src/patient/usecase/upload.usecase";
import { PatientRepository } from "src/patient/data/repository/patient.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Patient } from "src/patient/entities/patient.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Patient])],
  controllers: [PatientController],
  providers: [PatientService, UploadUsecase, PatientRepository],
})
export class PatientModule {}
