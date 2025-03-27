import { Patient } from "src/patient/domain/entities/patient.entity";
import xlsxPatientAddressValidator from "src/patient/domain/validators/xlsxPatientAddress.validator";
import xlsxPatientBirthdayValidator from "src/patient/domain/validators/xlsxPatientBirthday.validator";
import xlsxPatientMemoValidator from "src/patient/domain/validators/xlsxPatientMemo.validator";
import xlsxPatientNameValidator from "src/patient/domain/validators/xlsxPatientName.validator";
import xlsxChartNumberValidator from "src/patient/domain/validators/xlsxChartNumber.validator";
import xlsxPatientphoneNumberValidator from "src/patient/domain/validators/xlsxPatientPhoneNumber.validator";

export default function (entity: Patient) {
  return (
    xlsxPatientAddressValidator(entity) &&
    xlsxPatientBirthdayValidator(entity) &&
    xlsxPatientMemoValidator(entity) &&
    xlsxPatientNameValidator(entity) &&
    xlsxChartNumberValidator(entity) &&
    xlsxPatientphoneNumberValidator(entity)
  );
}
