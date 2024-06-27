import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CorePaginateResult, CoreResponse } from '../interfaces';

@Injectable()
export class CoreTransformInterceptor
  implements NestInterceptor<CorePaginateResult>
{
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((result: CoreResponse) => {
        const respStatus = true;
        const respMessage = 'success';
        const respStatusCode = HttpStatus.OK;

        if (result) {
          const data = result;
          // Paging/Single documents
          if (typeof result['docs'] != 'undefined') {
            return {
              status: respStatus,
              statusCode: respStatusCode,
              message: respMessage,
              data,
            };
          } else {
            return {
              status: respStatus,
              statusCode: respStatusCode,
              message: respMessage,
              data,
            };
          }
        } else {
          return {
            status: respStatus,
            statusCode: respStatusCode,
            message: respMessage,
            data: null,
          };
        }
      }),
    );
  }
}
