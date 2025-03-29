import { Test } from "@nestjs/testing";
import { Page } from "src/common/utils/paging/page";
import { PatientRepository } from "src/patient/data/repository/patient.repository";
import { IPatientRepository } from "src/patient/data/repository/patientRepository.interface";
import { GetPatientUsecase } from "src/patient/domain/usecase/get.usecase";
import { mockPatientRepository } from "src/patient/test/stubs/repository.stub";

describe("GetPatientUsecase", () => {
  let usecase: GetPatientUsecase;
  let repository: IPatientRepository;
  const page = 1;
  const keyword = "keyword";
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        GetPatientUsecase,
        {
          provide: PatientRepository,
          useValue: mockPatientRepository(),
        },
      ],
    }).compile();
    usecase = module.get(GetPatientUsecase);
    repository = module.get<IPatientRepository>(PatientRepository);
  });
  it("to be defined", () => {
    expect(usecase).toBeDefined();
    expect(repository).toBeDefined();
  });
  describe("execute", () => {
    beforeEach(() => {
      jest.spyOn(repository, "findByKeyword").mockResolvedValue({ total: 10, data: undefined });
    });
    it("데이터 조회", () => {
      usecase.execute(page, keyword);
      expect(repository.findByKeyword).toHaveBeenCalledWith(keyword, page, 10);
    });
    it("", async () => {
      expect(await usecase.execute(page, keyword)).toBeInstanceOf(Page);
    });
  });
});
