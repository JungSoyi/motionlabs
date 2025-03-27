import { Patient } from "src/patient/domain/entities/patient.entity";

describe("Patient", () => {
  let entity: Patient;
  beforeEach(async () => {
    entity = new Patient();
  });
  it("to be defined", () => {
    expect(entity).toBeDefined();
  });
});
