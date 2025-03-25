import { Patient } from "src/patient/entities/patient.entity";

export default (entity: Patient) => {
  return entity.address ? entity.address.length <= 255 : true;
};
