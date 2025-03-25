import { Patient } from "src/patient/entities/patient.entity";

export default (entity: Patient): boolean => {
  return entity.patientNumber ? entity.patientNumber.length <= 255 : true;
};
