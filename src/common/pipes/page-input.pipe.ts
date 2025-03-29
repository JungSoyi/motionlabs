import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";

export class PositivePagePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const num = parseInt(value, 10);
    if (!num || isNaN(num) || num <= 0) {
      throw new BadRequestException(`Invalid page number: ${value}`);
    }
    return num;
  }
}
