import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces/features/arguments-host.interface';
import { Response, Request } from 'express';
import { Exception, InternalServerError } from './exception';

@Catch()
export class GlobalHandleExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const response: Response = ctx.getResponse();
    const request: Request = ctx.getRequest();

    this.logException(request, exception);

    if (exception instanceof Exception) {
      GlobalHandleExceptionFilter.sendResponse(request, response, exception);
    } else if (exception instanceof HttpException) {
      GlobalHandleExceptionFilter.sendBaseResponse(
        request,
        response,
        exception,
      );
    } else {
      GlobalHandleExceptionFilter.sendResponse(
        request,
        response,
        new InternalServerError(),
      );
    }
  }

  private logException(_: Request, exception: HttpException): void {
    if (process.env.DISABLE_LOG_REQUEST !== 'true') {
      console.error({
        ...exception,
        stack: exception.stack,
      });
    }
  }

  private static sendResponse(
    request: Request,
    response: Response,
    exception: Exception,
  ): void {
    const traceId = request.header('x-client-trace-id');
    response
      .status(exception.getStatus())
      .json(exception.prepareResponse(traceId));
  }

  private static sendBaseResponse(
    _: Request,
    response: Response,
    exception: HttpException,
  ): void {
    const expResponse = exception.getResponse();

    const statusCode = exception.getStatus();

    response
      .status(statusCode)
      .json({ statusCode, message: expResponse['message'] });
  }
}
