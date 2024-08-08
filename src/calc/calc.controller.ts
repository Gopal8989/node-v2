import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { CalcService } from './calc.service';
import { CalcDto } from './calc.dto';

@Controller('calc')
export class CalcController {
  constructor(private readonly calcService: CalcService) {}

  @Post('/')
  calc(@Body() calcBody: CalcDto) {
    const result = this.calcService.calculateExpression(calcBody);
    if (result === null || result === undefined) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid expression provided',
          error: 'Bad Request',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return { result };
  }
}
