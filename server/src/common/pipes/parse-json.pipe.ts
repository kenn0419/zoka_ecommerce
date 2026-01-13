import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseJsonPipe implements PipeTransform {
  constructor(private readonly field: string) {}

  transform(value: any) {
    const fieldValue = value[this.field];

    if (!fieldValue) return value;

    try {
      const parsed =
        typeof fieldValue === 'string' ? JSON.parse(fieldValue) : fieldValue;

      if (!Array.isArray(parsed)) {
        throw new BadRequestException(`${this.field} must be an array`);
      }

      value[this.field] = parsed;
      return value;
    } catch (err) {
      throw new BadRequestException(`${this.field} is not valid JSON array`);
    }
  }
}
