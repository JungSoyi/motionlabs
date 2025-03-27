import { Patient } from "src/patient/domain/entities/patient.entity";

export default (entity: Patient): boolean => {
  return entity.name && entity.name?.length > 0 && entity.name?.length <= 255;
};
