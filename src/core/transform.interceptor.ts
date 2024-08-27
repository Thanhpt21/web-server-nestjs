import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RESPONSE_MESSAGE } from '@/decorator/customize';

export interface Response<T> {
  statusCode: number;
  message?: string;
  data: any;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    console.log('TransformInterceptor: intercept method called');
    
    return next.handle().pipe(
      map((data) => {
        console.log('Data from handler:', data);

        const response = {
          statusCode: context.switchToHttp().getResponse().statusCode,
          message: this.reflector.get<string>(RESPONSE_MESSAGE, context.getHandler()) || '',
          data: data,
        };

        console.log('Response data transformed by interceptor:', response);
        return response;
      }),
    );
  }
}
