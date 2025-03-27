import { Patient } from "src/patient/domain/entities/patient.entity";

export default (entity: Patient) => {
  return entity.address ? entity.address.length <= 255 : true;
};
