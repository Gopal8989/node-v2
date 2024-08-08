import { BadRequestException, Injectable } from '@nestjs/common';
import { CalcDto } from './calc.dto';

@Injectable()
export class CalcService {
  calculateExpression(calcBody: CalcDto) {
    try {
      const { expression: value } = calcBody;

      if (!/^[\d+\-*/\s]+$/.test(value)) {
        throw new BadRequestException({
          statusCode: 400,
          message: 'Invalid expression provided',
          error: 'Bad Request',
        });
      }

      const tokens = this.tokenize(value);
      if (!tokens || !this.isValidExp(tokens)) {
        throw new BadRequestException({
          statusCode: 400,
          message: 'Invalid expression provided',
          error: 'Bad Request',
        });
      }

      const result = this.evaluateExp(tokens);
      return Number(result);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException({
        statusCode: 400,
        message: 'An unexpected error occurred',
        error: 'Bad Request',
      });
    }
  }

  private tokenize(expression: string): (number | string)[] {
    const tokenArray: (number | string)[] = [];
    const regex = /\d+\.?\d*|[+\-*/()]|\s+/g;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(expression)) !== null) {
      const value: any = match[0]?.trim();
      if (value) {
        !isNaN(Number(value))
          ? tokenArray.push(Number(value))
          : tokenArray.push(value);
      }
    }

    return tokenArray;
  }

  private isValidExp(tokens: (number | string)[]): boolean {
    if (typeof tokens[0] !== 'number') return false;
    const exArray = ['+', '-', '*', '/'];
    for (let i = 1; i < tokens.length; i++) {
      const token = tokens[i];
      if (typeof token === 'number') {
        if (typeof tokens[i - 1] === 'number') return false;
      } else if (exArray.includes(token as string)) {
        if (
          typeof tokens[i - 1] === 'string' ||
          i === tokens.length - 1 ||
          typeof tokens[i + 1] !== 'number'
        )
          return false;
      }
    }

    return typeof tokens[tokens.length - 1] === 'number';
  }

  private evaluateExp(tokens: (number | string)[]): number {
    let result = tokens[0] as number;
    let i = 1;

    while (i < tokens.length) {
      const operator = tokens[i] as string;
      const nextValue = tokens[i + 1] as number;

      switch (operator) {
        case '+':
          result += nextValue;
          break;
        case '-':
          result -= nextValue;
          break;
        case '*':
          result *= nextValue;
          break;
        case '/':
          if (nextValue === 0) {
            throw new BadRequestException({
              statusCode: 400,
              message: 'Division by zero',
              error: 'Bad Request',
            });
          }
          result /= nextValue;
          break;
        default:
          throw new BadRequestException({
            statusCode: 400,
            message: 'Invalid operator',
            error: 'Bad Request',
          });
      }

      i += 2;
    }

    return Number(result);
  }
}
