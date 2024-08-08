import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { winstonLogger } from './winston.config';

@Injectable()
export class ApiLoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const start = process.hrtime();

    res.on('finish', () => {
      const duration = process.hrtime(start);
      const milliseconds = (duration[0] * 1000 + duration[1] / 1e6).toFixed(2);
      winstonLogger.info(
        `${method} ${originalUrl} ${res.statusCode} ${milliseconds} ms`,
      );
    });

    next();
  }
}
