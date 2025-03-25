import { Patient } from "src/patient/entities/patient.entity";

export default (entity: Patient) => {
  if (!entity.birthday) return true;

  const basicRegex = /^(\d{2})(\d{2})(\d{2})(?:-?([1-4]|\*{1})([\d*]{0,6}))?$/;
  const match = entity.birthday.match(basicRegex);
  if (!match) return false;

  const [, yy, mm, dd, genderDigit, rest] = match;
  const year = parseInt(yy, 10);
  const month = parseInt(mm, 10);
  const day = parseInt(dd, 10);

  const isBefore2000 = year >= 50 && year <= 99;
  const isAfter2000 = year >= 0 && year <= 49;
  const fullYear = isBefore2000 ? 1900 + year : 2000 + year;

  const lastDayOfMonth = new Date(fullYear, month, 0).getDate();
  if (month < 1 || month > 12 || day < 1 || day > lastDayOfMonth) return false;

  // 6자 YYMMDD
  if (entity.birthday.length === 6) return true;

  // 7자 YYMMDDG
  if (entity.birthday.length === 7 && genderDigit) {
    const genderNum = parseInt(genderDigit, 10);
    return isBefore2000 ? [1, 2].includes(genderNum) : [3, 4].includes(genderNum);
  }

  // 8자 YYMMDD-G
  if (entity.birthday.length === 8 && entity.birthday[6] === "-" && genderDigit) {
    const genderNum = parseInt(genderDigit, 10);
    return isBefore2000 ? [1, 2].includes(genderNum) : [3, 4].includes(genderNum);
  }

  // 9자 이상 YYMMDD-GXXXXXX
  if (entity.birthday.length >= 9) {
    if (entity.birthday[6] !== "-" || !genderDigit || rest.length !== 6) return false;

    // 하이픈 뒤 7자리 모두 * 허용 (*******)
    if (genderDigit === "*" && rest === "******") return true;

    // 성별번호 체크
    const genderNum = parseInt(genderDigit, 10);
    if (!(genderNum >= 1 && genderNum <= 4)) return false;

    if (isBefore2000 && !(genderNum === 1 || genderNum === 2)) return false;
    if (isAfter2000 && !(genderNum === 3 || genderNum === 4)) return false;

    // 나머지 6자리 숫자 or * 혼용 체크
    return /^[\d*]{6}$/.test(rest);
  }

  return false;
};
