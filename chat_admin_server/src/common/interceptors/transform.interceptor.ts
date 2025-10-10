import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp()
    const response = ctx.getResponse()

    return next.handle().pipe(
      map((data) => {
        const status = response?.statusCode || 200
  let message = 'Thành công'

        // If controller returned an object containing `message`, promote it
        if (data && typeof data === 'object') {
          // If controller already returned our shape, pass through
          if (typeof data.code === 'number' && 'message' in data && 'data' in data) {
            return data
          }

          if (typeof (data as any).message === 'string') {
            message = (data as any).message
            // If controller returned { message, data }
            if ('data' in (data as any)) {
              return { code: status, message, data: (data as any).data }
            }
            // Otherwise remove message from payload and use rest as data
            const clone = { ...data } as any
            delete clone.message
            return { code: status, message, data: clone }
          }
        }

        return { code: status, message, data }
      })
    )
  }
}
