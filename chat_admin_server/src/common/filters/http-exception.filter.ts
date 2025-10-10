import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    const request = ctx.getRequest()

  let status = HttpStatus.INTERNAL_SERVER_ERROR
  let message = 'Lỗi máy chủ nội bộ'
  let code = 500

    if (exception instanceof HttpException) {
      status = exception.getStatus()
      const res = exception.getResponse()
      if (typeof res === 'string') {
        message = res
      } else if (res && typeof res === 'object' && 'message' in (res as any)) {
        // class-validator returns { message: [...], error: 'Bad Request' }
        const body = res as any
        if (Array.isArray(body.message)) {
          message = Array.isArray(body.message) ? body.message.join('; ') : String(body.message)
        } else {
          message = String(body.message)
        }
      }
      code = status
    } else if (exception instanceof Error) {
      message = exception.message
    }

    response.status(status).json({
      code,
      message
    })
  }
}
