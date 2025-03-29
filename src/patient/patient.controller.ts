import { Controller, Get, Post, Query, UploadedFile, UseInterceptors } from "@nestjs/common";
import { UploadUsecase } from "src/patient/domain/usecase/upload.usecase";
import { FileInterceptor } from "@nestjs/platform-express";
import { ValidateXlsxFileInterceptor } from "src/common/interceptors/xlsx-file-validation.interceptor";
import { ApiBadRequestResponse, ApiBody, ApiConsumes, ApiOkResponse, ApiOperation, ApiQuery, ApiResponse } from "@nestjs/swagger";
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
  @ApiOperation({
    summary: "환자 엑셀 파일 업로드",
    description: "엑셀(.xlsx) 형식의 환자 데이터를 업로드하고, 유효성 검증 및 중복 제거 후 저장합니다.",
  })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    description: "xlsx 파일을 업로드합니다. 필드 이름은 반드시 `patientFile`이어야 합니다.",
    schema: {
      type: "object",
      properties: {
        patientFile: {
          type: "string",
          format: "binary",
          description: "엑셀(.xlsx) 파일",
        },
      },
      required: ["patientFile"],
    },
  })
  @ApiResponse({
    status: 201,
    description: "업로드 결과",
    schema: {
      example: {
        totalRows: 10,
        processedRows: 5,
        skippedRows: 5,
      },
    },
  })
  async upload(@UploadedFile() patientFile: Express.Multer.File) {
    return await this.uploadUsecase.execute(patientFile);
  }

  @Get()
  @ApiOperation({ summary: "환자 목록 조회", description: "페이지네이션 기반으로 환자 목록을 조회합니다." })
  @ApiQuery({ name: "page", required: false, type: Number, example: 1, description: "페이지 번호 (1부터 시작)" })
  @ApiQuery({ name: "keyword", required: false, type: String, example: "홍길동", description: "이름 또는 전화번호로 검색" })
  @ApiOkResponse({ description: "조회된 환자 목록", type: PaginationOutput, example: { total: 132, page: 1, count: 0, data: [] } })
  @ApiBadRequestResponse({
    description: "page 값이 1보다 작거나 숫자가 아닐 경우",
    example: { success: false, message: "Invalid page number: undefined", code: 400 },
  })
  async find(
    @Query("page", PositivePagePipe) page: number = 1,
    @Query("keyword") keyword: string = ""
  ): Promise<PaginationOutput<Patient>> {
    return await this.getUsecase.execute(page, keyword);
  }
}
