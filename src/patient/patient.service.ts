import { Injectable } from "@nestjs/common";

@Injectable()
export class PatientService {
  create() {
    return "This action adds a new patient";
  }

  find() {
    return `This action returns all patient`;
  }
}
