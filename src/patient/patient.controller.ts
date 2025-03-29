import { Controller, Get, Post, Query, UploadedFile, UseInterceptors } from "@nestjs/common";
import { PatientService } from "./application/patient.service";
import { UploadUsecase } from "src/patient/domain/usecase/upload.usecase";
import { FileInterceptor } from "@nestjs/platform-express";
import { ValidateXlsxFileInterceptor } from "src/common/interceptors/xlsx-file-validation.interceptor";
import { ApiBody, ApiConsumes, ApiResponse } from "@nestjs/swagger";
import { PaginationOutput } from "src/common/dto/output/pagination.output";
import { Patient } from "src/patient/domain/entities/patient.entity";
import { GetPatientUsecase } from "src/patient/domain/usecase/get.usecase";
import { PositivePagePipe } from "src/common/pipes/page-input.pipe";

@Controller("patient")
export class PatientController {
  constructor(
    private readonly getUsecase: GetPatientUsecase,
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
  async find(
    @Query("page", PositivePagePipe) page: number = 1,
    @Query("keyword") keyword: string = ""
  ): Promise<PaginationOutput<Patient>> {
    return await this.getUsecase.execute(page, keyword);
  }
}
