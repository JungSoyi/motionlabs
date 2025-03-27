import { Patient } from "src/patient/domain/entities/patient.entity";
import xlsxPatientAddressValidator from "src/patient/domain/validators/xlsxPatientAddress.validator";
import xlsxPatientBirthdayValidator from "src/patient/domain/validators/xlsxPatientBirthday.validator";
import xlsxPatientMemoValidator from "src/patient/domain/validators/xlsxPatientMemo.validator";
import xlsxPatientNameValidator from "src/patient/domain/validators/xlsxPatientName.validator";
import xlsxChartNumberValidator from "src/patient/domain/validators/xlsxChartNumber.validator";
import xlsxPatientPhoneNumberValidator from "src/patient/domain/validators/xlsxPatientPhoneNumber.validator";

describe("Validate Patient Xlsx Data", () => {
  let entity: Patient;

  describe("xlsx data validation", () => {
    beforeEach(() => {
      entity = new Patient();
    });
    describe("name", () => {
      it("키에 반드시 포함되므로 값이 없으면 안됨. 빈 문자", () => {
        entity.name = "";
        expect(xlsxPatientNameValidator(entity)).toBeFalsy();
      });
      it("키에 반드시 포함되므로 값이 없으면 안됨. 정의 안됨", () => {
        entity.name = undefined;
        expect(xlsxPatientNameValidator(entity)).toBeFalsy();
      });
      it("1자 이상", () => {
        entity.name = "1";
        expect(entity.name.length).toBe(1);
        expect(xlsxPatientNameValidator(entity)).toBeTruthy();
      });
      it("255자 이하", () => {
        entity.name = "a".repeat(255);
        expect(entity.name.length).toBe(255);
        expect(xlsxPatientNameValidator(entity)).toBeTruthy();
      });
      it("255자를 초과할 수 없다.", () => {
        entity.name = "a".repeat(256);
        expect(entity.name.length).toBe(256);
        expect(xlsxPatientNameValidator(entity)).toBeFalsy();
      });
    });
    describe("phoneNumber", () => {
      it("키에 반드시 포함되므로 값이 없으면 안됨.", () => {
        entity.phoneNumber = "";
        expect(xlsxPatientPhoneNumberValidator(entity)).toBeFalsy();
      });
      it("키에 반드시 포함되므로 값이 없으면 안됨.", () => {
        entity.phoneNumber = undefined;
        expect(xlsxPatientPhoneNumberValidator(entity)).toBeFalsy();
      });
      it.each(["012341234", "12341234", "1234123"])("9자 이하면 안됨", (phoneNum: string) => {
        entity.phoneNumber = phoneNum;
        expect(xlsxPatientPhoneNumberValidator(entity)).toBeFalsy();
      });
      it("하이픈을 제외한 '10'으로 시작하는 10자 문자열 10XXXXXXXX 가능하다.", () => {
        entity.phoneNumber = "1012341234";
        expect(xlsxPatientPhoneNumberValidator(entity)).toBeTruthy();
      });
      it.each(["2012341234", "3012341234", "4012341234", "0012341234"])(
        "하이픈을 제외한 '10'으로 시작하지 않는 10자 문자열은 불가능하다.",
        (phoneNum: string) => {
          entity.phoneNumber = phoneNum;
          expect(xlsxPatientPhoneNumberValidator(entity)).toBeFalsy();
        }
      );
      it("010으로 시작하는 하이픈을 제외된 11자 문자열 010XXXXXXXX 가능하다", () => {
        entity.phoneNumber = "01012341234";
        expect(xlsxPatientPhoneNumberValidator(entity)).toBeTruthy();
      });
      it("010으로 시작하는 하이픈을 포함한 13자 010-XXXX-XXXX", () => {
        entity.phoneNumber = "010-1234-1234";
        expect(xlsxPatientPhoneNumberValidator(entity)).toBeTruthy();
      });
      it("10으로 시작하는 하이픈을 포함한 12자 10-XXXX-XXXX", () => {
        entity.phoneNumber = "10-1234-1234";
        expect(xlsxPatientPhoneNumberValidator(entity)).toBeTruthy();
      });
      it.each(["010-12345-1234", "010-1234-12345", "10-12345-1234", "10-1234-12345", "010123451234", "010123412345", "10123412345"])(
        "중간, 뒷 번호가 각각 4자리를 초과할 경우 불가능하다.",
        (phoneNum: string) => {
          entity.phoneNumber = phoneNum;
          expect(xlsxPatientPhoneNumberValidator(entity)).toBeFalsy();
        }
      );
    });
    describe("birthday", () => {
      it("값이 없어도 됨", () => {
        entity.birthday = "";
        expect(xlsxPatientBirthdayValidator(entity)).toBeTruthy();
      });
      it.each(["950131", "000101", "990228", "200229"])("6자 XXXXXX 형식: %p", (birthday: string) => {
        entity.birthday = birthday;
        expect(xlsxPatientBirthdayValidator(entity)).toBeTruthy();
      });
      it.each(["950133", "000000", "010100", "010000", "010001", "000431", "990230", "190229"])(
        "6자 이지만 날짜 형식에 어긋나면 안된다.: %p",
        (birthday: string) => {
          entity.birthday = birthday;
          expect(xlsxPatientBirthdayValidator(entity)).toBeFalsy();
        }
      );
      it.each(["9501311", "0001013", "9902282", "2002294"])("성별을 포함한 7자 XXXXXXX 형식: %p", (birthday: string) => {
        entity.birthday = birthday;
        expect(xlsxPatientBirthdayValidator(entity)).toBeTruthy();
      });
      it.each(["9501313", "0001011", "9902284", "2002292", "9501331", "0000003", "0101004"])(
        "성별을 포함한 7자 형식이지만 성별 혹은 날짜가 유효하지 않으면 안된다.: %p",
        (birthday: string) => {
          entity.birthday = birthday;
          expect(xlsxPatientBirthdayValidator(entity)).toBeFalsy();
        }
      );
      it.each(["950131-1", "000101-3", "990228-2", "200229-4"])("8자 XXXXXX-X 형식: %p", (birthday: string) => {
        entity.birthday = birthday;
        expect(xlsxPatientBirthdayValidator(entity)).toBeTruthy();
      });
      it.each(["950131-3", "000101-1", "990228-4", "200229-2", "950133-1", "000000-3", "010100-4"])(
        "성별을 포함한 8자 형식이지만 성별 혹은 날짜가 유효하지 않으면 안된다.: %p",
        (birthday: string) => {
          entity.birthday = birthday;
          expect(xlsxPatientBirthdayValidator(entity)).toBeFalsy();
        }
      );
      it.each(["950131-1111111", "000101-3111111", "990228-2111111", "200229-4111111"])(
        "9자 이상 XXXXXX-XXXXXXX 형식: %p",
        (birthday: string) => {
          entity.birthday = birthday;
          expect(xlsxPatientBirthdayValidator(entity)).toBeTruthy();
        }
      );
      it.each([
        "950131-3222222",
        "000101-1111111",
        "990228-4111111",
        "200229-2111111",
        "950133-1111111",
        "000000-3111111",
        "010100-4111111",
      ])("9자 이상 XXXXXX-XXXXXXX 형식이지만 유효하지 않은 경우: %p", (birthday: string) => {
        entity.birthday = birthday;
        expect(xlsxPatientBirthdayValidator(entity)).toBeFalsy();
      });
      it.each(["950131-1******", "000101-3******", "990228-2******", "200229-4******"])(
        "9자 이상 XXXXXX-X****** 형식: %p",
        (birthday: string) => {
          entity.birthday = birthday;
          expect(xlsxPatientBirthdayValidator(entity)).toBeTruthy();
        }
      );
      it.each(["950131-3******", "950100-1******", "000101-1******", "990228-4******", "200229-2******"])(
        "9자 이상 XXXXXX-X****** 형식이지만 유효하지 않을 때: %p",
        (birthday: string) => {
          entity.birthday = birthday;
          expect(xlsxPatientBirthdayValidator(entity)).toBeFalsy();
        }
      );
      it.each(["950131-*******", "000101-*******", "990228-*******", "200229-*******"])(
        "9자 이상 XXXXXX-******* 형식: %p",
        (birthday: string) => {
          entity.birthday = birthday;
          expect(xlsxPatientBirthdayValidator(entity)).toBeTruthy();
        }
      );
      it.each(["950131*******", "0001013232323", "9902281010101", "2002294******"])(
        "9자 이상 XXXXXX******* 형식: %p",
        (birthday: string) => {
          entity.birthday = birthday;
          expect(xlsxPatientBirthdayValidator(entity)).toBeTruthy();
        }
      );
    });
    describe("patientNumber", () => {
      it.each(["", undefined])("값이 없어도 됨: %p", (patientNumber: string) => {
        entity.chartNumber = patientNumber;
        expect(xlsxChartNumberValidator(entity)).toBeTruthy();
      });

      it("255자 초과", () => {
        entity.chartNumber = "a".repeat(256);
        expect(entity.chartNumber.length).toBe(256);
        expect(xlsxChartNumberValidator(entity)).toBeFalsy();
      });
      it("255자 이하", () => {
        entity.chartNumber = "a".repeat(255);
        expect(entity.chartNumber.length).toBe(255);
        expect(xlsxChartNumberValidator(entity)).toBeTruthy();
      });
    });
    describe("address", () => {
      it.each(["", undefined])("값이 없어도 됨: %p", (address: string) => {
        entity.address = address;
        expect(xlsxPatientAddressValidator(entity)).toBeTruthy();
      });

      it("255자 초과", () => {
        entity.address = "a".repeat(256);
        expect(entity.address.length).toBe(256);
        expect(xlsxPatientAddressValidator(entity)).toBeFalsy();
      });
      it("255자 이하", () => {
        entity.address = "a".repeat(255);
        expect(entity.address.length).toBe(255);
        expect(xlsxPatientAddressValidator(entity)).toBeTruthy();
      });
    });
    describe("memo", () => {
      it.each(["", undefined])("값이 없어도 됨: %p", (memo: string) => {
        entity.memo = memo;
        expect(xlsxPatientMemoValidator(entity)).toBeTruthy();
      });

      it("255자 초과", () => {
        entity.memo = "a".repeat(256);
        expect(entity.memo.length).toBe(256);
        expect(xlsxPatientMemoValidator(entity)).toBeFalsy();
      });
      it("255자 이하", () => {
        entity.memo = "a".repeat(255);
        expect(entity.memo.length).toBe(255);
        expect(xlsxPatientMemoValidator(entity)).toBeTruthy();
      });
    });
  });
});
