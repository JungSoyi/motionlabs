import { Test } from "@nestjs/testing";
import { PatientRepository } from "src/patient/data/repository/patient.repository";
import { IPatientRepository } from "src/patient/data/repository/patientRepository.interface";
import { Patient } from "src/patient/domain/entities/patient.entity";
import { mockPatientRepository } from "src/patient/test/stubs/repository.stub";
import { UploadUsecase } from "src/patient/domain/usecase/upload.usecase";

describe("UploadUsecase", () => {
  let usecase: UploadUsecase;
  let repository: IPatientRepository;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [UploadUsecase, { provide: PatientRepository, useValue: mockPatientRepository() }],
    }).compile();
    usecase = module.get(UploadUsecase);
    repository = module.get(PatientRepository);
  });
  it("to be defined", () => {
    expect(usecase).toBeDefined();
    expect(repository).toBeDefined();
  });
  describe("execute", () => {
    const inputFile = "src/patient/patient_data.xlsx";
    beforeEach(() => {
      jest.spyOn(repository, "upload").mockResolvedValue([]);
      jest.spyOn(usecase, "xlsxToJson").mockReturnValue([]);
      jest.spyOn(usecase, "processData").mockReturnValue([patient_stub_1()]);
      usecase.execute(inputFile);
    });
    afterEach(() => {
      jest.restoreAllMocks();
    });
    describe("호출 확인", () => {
      it("input file로 xlsxToJson 호출", () => {
        expect(usecase.xlsxToJson).toHaveBeenCalledWith(inputFile);
      });
      it("xlsxToJson 반환 값으로 processData 호출", () => {
        expect(usecase.processData).toHaveBeenCalledWith([]);
      });
      it("processData 반환 값으로 processData 호출", () => {
        expect(repository.upload).toHaveBeenCalledWith([patient_stub_1()]);
      });
    });
    describe("return 확인", () => {
      it("return값의 totalRows는 patientJsonData.length", async () => {
        jest.spyOn(usecase, "xlsxToJson").mockReturnValue([patient_stub_1()]);
        expect(await usecase.execute(inputFile)).toEqual(expect.objectContaining({ totalRows: 1 }));
      });
      it("return값의 processedRows는 processData의 결과값의 length", async () => {
        jest.spyOn(usecase, "processData").mockReturnValue([patient_stub_1()]);
        expect(await usecase.execute(inputFile)).toEqual(expect.objectContaining({ processedRows: 1 }));
      });
      it("return값의 skippedRows는 patientJsonData.length - processData의 결과값의 length", async () => {
        jest.spyOn(usecase, "xlsxToJson").mockReturnValue([patient_stub_1(), patient_stub_1()]);
        jest.spyOn(usecase, "processData").mockReturnValue([patient_stub_1()]);
        expect(await usecase.execute(inputFile)).toEqual(expect.objectContaining({ skippedRows: 1 }));
      });
    });
  });

  describe("processData", () => {
    beforeEach(() => {
      jest.spyOn(usecase, "filterValidatedData").mockReturnValue([]);
      jest.spyOn(usecase, "getDeduplicatedData").mockReturnValue([]);
      usecase.processData([]);
    });
    afterEach(() => {
      jest.restoreAllMocks();
    });
    it("filterValidatedData 호출", () => {
      expect(usecase.filterValidatedData).toHaveBeenCalled();
    });
    it("getDeduplicatedData 호출", () => {
      expect(usecase.getDeduplicatedData).toHaveBeenCalled();
    });
  });

  describe("filterValidatedData", () => {
    const validateFunction = jest.requireActual("src/patient/domain/validators/xlsx.validator");
    let inputData: any[];
    let result;
    beforeEach(() => {
      jest.spyOn(validateFunction, "default");
    });
    afterEach(() => jest.restoreAllMocks());
    it("data가 undefined일 때", () => {
      inputData = undefined;
      result = usecase.filterValidatedData(inputData);
      expect(result).toEqual([]);
    });
    it("data가 빈배열일 때", () => {
      inputData = [];
      result = usecase.filterValidatedData(inputData);
      expect(result).toEqual([]);
    });
    it("data의 xlsx validation을 통과하면 리턴에 포함", () => {
      inputData = [{ name: "test" }];
      jest.spyOn(validateFunction, "default").mockReturnValue(true);
      result = usecase.filterValidatedData(inputData);
      expect(result).toEqual(inputData);
    });
    it("data의 xlsx validation을 통과 안하면 리턴에 안포함", () => {
      inputData = [{ name: "test" }];
      jest.spyOn(validateFunction, "default").mockReturnValue(false);
      result = usecase.filterValidatedData(inputData);
      expect(result).toEqual([]);
    });
    it("data의 xlsx validation을 통과한 데이터만 리턴에 포함", () => {
      inputData = [{ name: "test" }, { name: "test2" }];
      jest.spyOn(validateFunction, "default").mockReturnValueOnce(false).mockReturnValueOnce(true);
      result = usecase.filterValidatedData(inputData);
      expect(result).toEqual([{ name: "test2" }]);
    });
  });

  describe("getDeduplicatedData", () => {
    describe("chartNumber가 없으면 이름과 전화번호가 같은 먼저 들어온 데이터이고 가장 최신데이터와 병합", () => {
      it("chartNumber가 없지만 먼저 들어온 데이터 중에 이름과 전화번호가 일치하는 데이터가 없으면 chartNumber 없이 리턴", () => {
        const inputData = [
          { name: "test", chartNumber: "1111", phoneNumber: "01011111111" },
          { name: "test", chartNumber: null, phoneNumber: "01011111111" },
        ] as unknown as Patient[];
        const result = usecase.getDeduplicatedData(inputData);
        expect(result).toEqual([expect.objectContaining({ name: "test", chartNumber: "1111", phoneNumber: "01011111111" })]);
      });
      it("chartNumber가 없지만 먼저 들어온 데이터 중에 이름과 전화번호가 일치하는 데이터가 있으면 chartNumber 병합하여 리턴", () => {
        const inputData = [
          { name: "test", chartNumber: null, phoneNumber: "01011111111" },
          { name: "test", chartNumber: "1111", phoneNumber: "01011111111" },
        ] as unknown as Patient[];
        const result = usecase.getDeduplicatedData(inputData);
        expect(result).toContainEqual(expect.objectContaining({ name: "test", chartNumber: "", phoneNumber: "01011111111" }));
        expect(result).toContainEqual(expect.objectContaining({ name: "test", chartNumber: "1111", phoneNumber: "01011111111" }));
      });
      it("chartNumber가 없지만 먼저 들어온 데이터 중에 이름과 전화번호가 일치하는 데이터가 여러개 있으면 가장 최근에 처리된 데이터와 병합하여 리턴", () => {
        const inputData = [
          { name: "test", chartNumber: "1111", phoneNumber: "01011111111" },
          { name: "test", chartNumber: "2222", phoneNumber: "01011111111" },
          { name: "test", chartNumber: null, phoneNumber: "01011111111", memo: "no patient number" },
        ] as unknown as Patient[];
        const result = usecase.getDeduplicatedData(inputData);
        expect(result).toContainEqual(
          expect.objectContaining({ name: "test", chartNumber: "2222", phoneNumber: "01011111111", memo: "no patient number" })
        );
        expect(result).toContainEqual(expect.objectContaining({ name: "test", chartNumber: "1111", phoneNumber: "01011111111" }));
      });
    });
    describe("키가 일치하는 데이터가 있으면, 가장 최근에 처리된 데이터에 현재 처리중인 데이터의 값으로 업데이트", () => {
      it("키가 일치하고 address가 다르면, 키가 일치하는 데이터 중 가장 마지막 데이터의 address로 업데이트", () => {
        const inputData = [
          { name: "test", chartNumber: "1111", phoneNumber: "01011111111", address: "address1" },
          { name: "test", chartNumber: "1111", phoneNumber: "01011111111", address: "address2" },
          { name: "test", chartNumber: "1111", phoneNumber: "01011111111", address: "address3" },
        ] as unknown as Patient[];
        const result = usecase.getDeduplicatedData(inputData);
        expect(result).toContainEqual(
          expect.objectContaining({ name: "test", chartNumber: "1111", phoneNumber: "01011111111", address: "address3" })
        );
      });
      it("키가 일치하고 address가 다르면, 키가 일치하는 데이터 중 가장 마지막 데이터의 address로 업데이트", () => {
        const inputData = [
          { name: "test", chartNumber: "1111", phoneNumber: "01011111111", address: "address1-1" },
          { name: "test", chartNumber: "2222", phoneNumber: "01011111111", address: "address1-2" },
          { name: "test", chartNumber: "1111", phoneNumber: "01011111111", address: "address2-1" },
          { name: "test", chartNumber: "2222", phoneNumber: "01011111111", address: "address2-2" },
          { name: "test", chartNumber: "1111", phoneNumber: "01011111111", address: "address3-1" },
          { name: "test", chartNumber: "2222", phoneNumber: "01011111111", address: "address3-2" },
        ] as unknown as Patient[];
        const result = usecase.getDeduplicatedData(inputData);
        expect(result).toContainEqual(
          expect.objectContaining({ name: "test", chartNumber: "1111", phoneNumber: "01011111111", address: "address3-1" })
        );
        expect(result).toContainEqual(
          expect.objectContaining({ name: "test", chartNumber: "2222", phoneNumber: "01011111111", address: "address3-2" })
        );
      });
      it("키가 일치하고 birthday가 다르면, 키가 일치하는 데이터 중 가장 마지막 데이터의 birthday 업데이트", () => {
        const inputData = [
          { name: "test", chartNumber: "1111", phoneNumber: "01011111111", birthday: "950101" },
          { name: "test", chartNumber: "1111", phoneNumber: "01011111111", birthday: "550201" },
          { name: "test", chartNumber: "1111", phoneNumber: "01011111111", birthday: "990801" },
        ] as unknown as Patient[];
        const result = usecase.getDeduplicatedData(inputData);
        expect(result).toContainEqual(
          expect.objectContaining({ name: "test", chartNumber: "1111", phoneNumber: "01011111111", birthday: "990801-0" })
        );
      });
      it("키가 일치하고 birthday 다르면, 키가 일치하는 데이터 중 가장 마지막 데이터의 birthday 업데이트", () => {
        const inputData = [
          { name: "test", chartNumber: "1111", phoneNumber: "01011111111", birthday: "950101-1" },
          { name: "test", chartNumber: "2222", phoneNumber: "01011111111", birthday: "950101-2" },
          { name: "test", chartNumber: "1111", phoneNumber: "01011111111", birthday: "550201-1" },
          { name: "test", chartNumber: "2222", phoneNumber: "01011111111", birthday: "550201-2" },
          { name: "test", chartNumber: "1111", phoneNumber: "01011111111", birthday: "990801-1" },
          { name: "test", chartNumber: "2222", phoneNumber: "01011111111", birthday: "990801-2" },
        ] as unknown as Patient[];
        const result = usecase.getDeduplicatedData(inputData);
        expect(result).toContainEqual(
          expect.objectContaining({ name: "test", chartNumber: "1111", phoneNumber: "01011111111", birthday: "990801-1" })
        );
        expect(result).toContainEqual(
          expect.objectContaining({ name: "test", chartNumber: "2222", phoneNumber: "01011111111", birthday: "990801-2" })
        );
      });
      it("키가 일치하고 memo가 다르면, 키가 일치하는 데이터 중 가장 마지막 데이터의 memo 업데이트", () => {
        const inputData = [
          { name: "test", chartNumber: "1111", phoneNumber: "01011111111", memo: "memo1" },
          { name: "test", chartNumber: "1111", phoneNumber: "01011111111", memo: "memo2" },
          { name: "test", chartNumber: "1111", phoneNumber: "01011111111", memo: "memo3" },
        ] as unknown as Patient[];
        const result = usecase.getDeduplicatedData(inputData);
        expect(result).toContainEqual(
          expect.objectContaining({ name: "test", chartNumber: "1111", phoneNumber: "01011111111", memo: "memo3" })
        );
      });
      it("키가 일치하고 memo 다르면, 키가 일치하는 데이터 중 가장 마지막 데이터의 memo 업데이트", () => {
        const inputData = [
          { name: "test", chartNumber: "1111", phoneNumber: "01011111111", memo: "memo1-1" },
          { name: "test", chartNumber: "2222", phoneNumber: "01011111111", memo: "memo1-2" },
          { name: "test", chartNumber: "1111", phoneNumber: "01011111111", memo: "memo2-1" },
          { name: "test", chartNumber: "2222", phoneNumber: "01011111111", memo: "memo2-2" },
          { name: "test", chartNumber: "1111", phoneNumber: "01011111111", memo: "memo3-1" },
          { name: "test", chartNumber: "2222", phoneNumber: "01011111111", memo: "memo3-2" },
        ] as unknown as Patient[];
        const result = usecase.getDeduplicatedData(inputData);
        expect(result).toContainEqual(
          expect.objectContaining({ name: "test", chartNumber: "1111", phoneNumber: "01011111111", memo: "memo3-1" })
        );
        expect(result).toContainEqual(
          expect.objectContaining({ name: "test", chartNumber: "2222", phoneNumber: "01011111111", memo: "memo3-2" })
        );
      });
    });
  });
});

const patient_stub_1 = () => ({
  name: "test",
  id: 0,
  phoneNumber: "",
  birthday: "",
  chartNumber: "",
  address: "",
  memo: "",
  createdAt: undefined,
  updatedAt: undefined,
});
