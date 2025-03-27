import { IPatientRepository } from "src/patient/data/repository/patientRepository.interface";

export const mockPatientRepository = (): IPatientRepository => {
  return {
    save: jest.fn(),
    findAll: jest.fn(),
    upload: jest.fn(),
  };
};
