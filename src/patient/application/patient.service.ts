import { Injectable } from "@nestjs/common";

@Injectable()
export class PatientService {
  find() {
    return `This action returns all patient`;
  }
}
