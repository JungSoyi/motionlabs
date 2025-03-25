import { Patient } from "src/patient/entities/patient.entity";

export default (entity: Patient): boolean => {
  const PHONE_REGEX = /^(01[016789]|10)-?\d{3,4}-?\d{4}$/;
  return PHONE_REGEX.test(entity.phoneNumber);
};
