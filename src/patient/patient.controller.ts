import { Controller, Get, Post, UploadedFile } from "@nestjs/common";
import { PatientService } from "./patient.service";
import { UploadUsecase } from "src/patient/usecase/upload.usecase";

@Controller("patient")
export class PatientController {
  constructor(
    private readonly patientService: PatientService,
    private readonly uploadUsecase: UploadUsecase
  ) {}

  @Post()
  upload() {
    const patientFile = "src/patient/patient_data.xlsx";
    return this.uploadUsecase.execute(patientFile);
  }

  @Get()
  find() {
    return this.patientService.find();
  }
}
