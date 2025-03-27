import { Test, TestingModule } from "@nestjs/testing";
import { PatientController } from "../patient.controller";
import { PatientService } from "../application/patient.service";
import { UploadUsecase } from "src/patient/domain/usecase/upload.usecase";

describe("PatientController", () => {
  let controller: PatientController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PatientController],
      providers: [PatientService, { provide: UploadUsecase, useValue: { execute: jest.fn().mockResolvedValue({}) } }],
    }).compile();

    controller = module.get<PatientController>(PatientController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
