import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, url, body } = req;

    this.logger.log(
      `Request: ${method} ${url} - Body: ${JSON.stringify(body)}`,
    );

    return next
      .handle()
      .pipe(
        tap((data) => this.logger.log(`Response: ${JSON.stringify(data)}`)),
      );
  }
}
