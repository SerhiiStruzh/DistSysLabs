import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class RoleValidationPipe implements PipeTransform {
  private readonly allowedRoles = ['developer', 'manager', 'customer'];

  transform(value: string | undefined) {
    if(value === undefined) {
      return value;
    }

    if (!this.allowedRoles.includes(value!)) {
      throw new BadRequestException(`Role "${value}" is not valid`);
    }
    return value;
  }
}
