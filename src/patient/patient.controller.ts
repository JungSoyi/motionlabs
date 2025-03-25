import { Controller, Get, Post, UploadedFile } from "@nestjs/common";
import { PatientService } from "./patient.service";

@Controller("patient")
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Post()
  upload() {
    return this.patientService.create();
  }

  @Get()
  find() {
    return this.patientService.find();
  }
}
