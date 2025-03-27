import { Controller, Get, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { PatientService } from "./application/patient.service";
import { UploadUsecase } from "src/patient/domain/usecase/upload.usecase";
import { FileInterceptor } from "@nestjs/platform-express";
import { ValidateXlsxFileInterceptor } from "src/common/interceptors/xlsx-file-validation.interceptor";
import { ApiBody, ApiConsumes, ApiResponse } from "@nestjs/swagger";

@Controller("patient")
export class PatientController {
  constructor(
    private readonly patientService: PatientService,
    private readonly uploadUsecase: UploadUsecase
  ) {}

  @Post("upload")
  @UseInterceptors(FileInterceptor("patientFile"), ValidateXlsxFileInterceptor)
  @ApiConsumes("multipart/form-data")
  @ApiResponse({
    example: {
      totalRows: 10,
      processedRows: 5,
      skippedRows: 5,
    },
  })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        patientFile: {
          type: "string",
          format: "binary",
        },
      },
    },
  })
  async upload(@UploadedFile() patientFile: Express.Multer.File) {
    return await this.uploadUsecase.execute(patientFile);
  }

  @Get()
  find() {
    return this.patientService.find();
  }
}
