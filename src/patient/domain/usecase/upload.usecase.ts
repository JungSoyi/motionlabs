import { Inject, Injectable } from "@nestjs/common";
import { PatientRepository } from "src/patient/data/repository/patient.repository";
import { IPatientRepository } from "src/patient/data/repository/patientRepository.interface";
import { UploadPatientDataOutput } from "src/patient/application/dto/output/upload.output";
import { Patient } from "src/patient/domain/entities/patient.entity";
import { XlsxUploadDataType } from "src/patient/domain/types/xlsxUploadData.type";
import xlsxValidator from "src/patient/domain/validators/xlsx.validator";
import { read, utils } from "xlsx";

@Injectable()
export class UploadUsecase {
  constructor(
    @Inject(PatientRepository)
    private readonly repository: IPatientRepository
  ) {}
  async execute(file: Express.Multer.File): Promise<UploadPatientDataOutput> {
    const patientJsonData = this.xlsxToJson(file);
    const processedData = this.processData(patientJsonData);
    await this.repository.upload(processedData);

    return {
      totalRows: patientJsonData.length,
      processedRows: processedData?.length || 0,
      skippedRows: patientJsonData.length - (processedData?.length || 0),
    };
  }

  processData(data: Patient[]): Patient[] {
    const validatedData = this.filterValidatedData(data);
    return this.getDeduplicatedData(validatedData);
  }

  filterValidatedData(data: Patient[]): Patient[] {
    if (!data) return [];
    return data?.filter((row) => xlsxValidator(row));
  }

  getDeduplicatedData(data: Patient[]) {
    /**
     * 키에 차트번호가 포함된 데이터
     * @example
     * "PN:1111|NAME:홍길동|PHONE:01011111111" => {name: '홍길동', chartNumber: '1111', phoneNumber: '01011111111'}
     * */
    const noPatientNumMap = new Map<string, Patient>();
    /**
     * 키에 차트번호가 없는 데이터
     * @example
     * "NOPN|NAME:홍길동|PHONE:01011111111" => {name: '홍길동', phoneNumber: '01011111111'}
     * */
    const patientNumMap = new Map<string, Patient>();
    /**
     * 차트번호 없는 키 -> 차트번호 있는 키 맵핑
     * @example
     * "NOPN|NAME:홍길동|PHONE:01011111111" => "PN:1111|NAME:홍길동|PHONE:01011111111"
     * */
    const keyLinkMap = new Map<string, string>();

    data.forEach((d) => {
      const baseKey = this.generateKeyWithoutchartNumber(d);
      const patientNumKey = d.chartNumber ? this.generateKeyWithchartNumber(d) : null;
      if (patientNumKey) {
        const existingPatient = patientNumMap.get(patientNumKey);
        const mergedPatient = existingPatient ? this.mergePatientData(existingPatient, d) : Patient.create(d);
        patientNumMap.set(patientNumKey, mergedPatient);
        keyLinkMap.set(baseKey, patientNumKey);
      } else {
        const linkedPatientNumKey = keyLinkMap.get(baseKey);
        const existingPatient = linkedPatientNumKey ? patientNumMap.get(linkedPatientNumKey) : noPatientNumMap.get(baseKey);
        if (linkedPatientNumKey) {
          patientNumMap.set(linkedPatientNumKey, this.mergePatientData(existingPatient, d));
        } else {
          noPatientNumMap.set(baseKey, existingPatient ? this.mergePatientData(existingPatient, d) : Patient.create(d));
        }
      }
    });
    return Array.from(patientNumMap.values()).concat(Array.from(noPatientNumMap.values()));
  }

  xlsxToJson(file: Express.Multer.File): Patient[] {
    console.log(file);
    const workbook = read(file.buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = utils.sheet_to_json(sheet, {
      defval: null,
    });
    return data.map((d: XlsxUploadDataType) => {
      return {
        name: d.이름,
        chartNumber: d.차트번호,
        birthday: d.주민등록번호,
        phoneNumber: d.전화번호,
        address: d.주소,
        memo: d.메모,
      } as Patient;
    });
  }

  generateKeyWithchartNumber(patient: Patient): string {
    return `PN:${patient.chartNumber}|NAME:${patient.name}|PHONE:${patient.phoneNumber}`;
  }

  generateKeyWithoutchartNumber(patient: Patient): string {
    return `NOPN|NAME:${patient.name}|PHONE:${patient.phoneNumber}`;
  }

  mergePatientData(base: Patient, newer: Patient): Patient {
    return Patient.create({
      ...base,
      memo: newer.memo || base.memo,
      birthday: newer.birthday ? newer.birthday : base.birthday,
      address: newer.address || base.address,
    });
  }
}
