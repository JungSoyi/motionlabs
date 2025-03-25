export default function (birthday: string) {
  const match = birthday.match(/^(\d{6})(?:-?([1-4*])([\d*]{0,6}))?$/);

  if (!match) {
    throw new Error(`Invalid birthday format: ${birthday}`);
  }

  const [, datePart, genderPart, restPart] = match;

  // 성별자리가 없거나, '*'만 있는 경우
  if (!genderPart || genderPart === "*") {
    return `${datePart}-0`;
  }

  // 성별자리가 숫자인 경우 (뒤에 뭐가 붙든 상관없이 성별만 명확하면 사용)
  if (/[1-4]/.test(genderPart)) {
    return `${datePart}-${genderPart}`;
  }

  // 그 외의 경우 (전부 *인 경우)
  return `${datePart}-0`;
}
