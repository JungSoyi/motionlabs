import { Patient } from "src/patient/domain/entities/patient.entity";

export default (entity: Patient) => {
  return entity.memo ? entity.memo.length <= 255 : true;
};
