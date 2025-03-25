import { Patient } from "src/patient/entities/patient.entity";

export default (entity: Patient) => {
  return entity.memo ? entity.memo.length <= 255 : true;
};
