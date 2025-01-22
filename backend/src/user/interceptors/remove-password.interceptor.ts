import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class RemovePasswordInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((value) => {
        // Kiểm tra nếu value là một mảng
        if (Array.isArray(value)) {
          return value.map((user) => {
            user.password = undefined;
            return user;
          });
        }

        // Nếu value là một object đơn lẻ
        if (value && typeof value === 'object') {
          value.password = undefined;
        }

        return value;
      }),
    );
  }
}
