import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { BadRequestException } from "@nestjs/common/exceptions/bad-request.exception";
import { extname } from "path";
import { Observable } from "rxjs";

@Injectable()
export class ValidateXlsxFileInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const file: Express.Multer.File = request.file;
    if (!file) {
      throw new BadRequestException(ErrorCode.INVALID_FILE);
    }
    const ext = extname(file.originalname).toLowerCase();
    if (ext !== ".xlsx") {
      throw new BadRequestException(ErrorCode.INVALID_FILE_TYPE);
    }
    return next.handle();
  }
}

const ErrorCode = {
  INVALID_FILE: "INVALID_FILE",
  INVALID_FILE_TYPE: "INVALID_FILE_TYPE",
};
