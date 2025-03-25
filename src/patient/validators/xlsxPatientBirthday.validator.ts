import { Patient } from "src/patient/entities/patient.entity";

export default (entity: Patient) => {
  if (!entity.birthday) return true;

  const basicRegex = /^(\d{2})(\d{2})(\d{2})(?:-?([1-4*])([\d*]{0,6}))?$/;
  const rrnRegex = /^(\d{6})([1-4])(\d{6})$/;

  let match = entity.birthday.match(basicRegex);

  if (!match) {
    match = entity.birthday.match(rrnRegex);
    if (!match) return false;

    const [, datePart, genderDigit] = match;
    return validateDateAndGender(datePart, genderDigit);
  }

  const [, yy, mm, dd, genderDigit, rest] = match;
  const datePart = `${yy}${mm}${dd}`;

  if (!genderDigit || genderDigit === "*") return validateDateAndGender(datePart, null);
  return validateDateAndGender(datePart, genderDigit);
};

function validateDateAndGender(datePart: string, genderDigit: string | null): boolean {
  const year = parseInt(datePart.slice(0, 2), 10);
  const month = parseInt(datePart.slice(2, 4), 10);
  const day = parseInt(datePart.slice(4, 6), 10);

  const isBefore2000 = year >= 50 && year <= 99;
  const fullYear = isBefore2000 ? 1900 + year : 2000 + year;

  const lastDayOfMonth = new Date(fullYear, month, 0).getDate();
  if (month < 1 || month > 12 || day < 1 || day > lastDayOfMonth) return false;

  if (!genderDigit) return true;

  const genderNum = parseInt(genderDigit, 10);
  if (isBefore2000 && ![1, 2].includes(genderNum)) return false;
  if (!isBefore2000 && ![3, 4].includes(genderNum)) return false;

  return true;
}
