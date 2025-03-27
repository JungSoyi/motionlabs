import { Patient } from "src/patient/entities/patient.entity";

export default (entity: Patient): boolean => {
  return entity.chartNumber ? entity.chartNumber.length <= 255 : true;
};
