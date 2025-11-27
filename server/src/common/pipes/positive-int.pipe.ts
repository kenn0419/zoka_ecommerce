import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class PositiveIntPipe implements PipeTransform {
  // constructor(private message: string = `Value must be a positive number`) {}

  transform(value: any, metadata: ArgumentMetadata) {
    const num = parseInt(value, 10);
    const fieldName = metadata.data || `Unknown`;

    if (isNaN(num) || num < 0) {
      throw new BadRequestException(
        `Query param ${fieldName} must be a positive number`,
      );
    }

    return num;
  }
}
