import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const http = context.switchToHttp();
    const request = http.getRequest<Request & { user?: any }>();
    const method = (request as any)?.method;
    const url = (request as any)?.url;
    const user = (request as any)?.user;

    const userInfo = user
      ? `userId=${user.id ?? user.sub ?? 'unknown'} role=${user.role ?? 'unknown'}`
      : 'anonymous';

    this.logger.log(`Incoming request: ${method} ${url} - ${userInfo}`);

    return next.handle().pipe(
      tap({
        next: () => {
          const response = http.getResponse<Response & { statusCode?: number }>();
          const statusCode = (response as any)?.statusCode;
          const elapsed = Date.now() - now;
          this.logger.log(
            `Request completed: ${method} ${url} - status=${statusCode} - ${elapsed}ms - ${userInfo}`,
          );
        },
        error: (err) => {
          const response = http.getResponse<Response & { statusCode?: number }>();
          const statusCode = (response as any)?.statusCode;
          const elapsed = Date.now() - now;
          this.logger.error(
            `Request error: ${method} ${url} - status=${statusCode} - ${elapsed}ms - ${userInfo} - error=$${
              err?.message ?? err
            }`,
          );
        },
      }),
    );
  }
}
