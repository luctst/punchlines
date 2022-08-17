module.exports = {
  apiVersion: 1,
  returnHttpCode(message, translateFn) {
    return {
      200: {
        message: message || translateFn('httpCode.200'),
      },
      201: {
        message: message || translateFn('httpCode.201'),
      },
      303: {
        message: message || translateFn('httpCode.303'),
      },
      400: {
        error: true,
        message: message || translateFn('httpCode.400'),
      },
      401: {
        error: true,
        message: message || translateFn('httpCode.401'),
      },
      403: {
        error: true,
        message: message || translateFn('httpCode.403'),
      },
      405: {
        error: true,
        message: translateFn('httpCode.405'),
      },
      406: {
        error: true,
        message: translateFn('httpCode.406'),
      },
      409: {
        error: true,
        message: message || translateFn('httpCode.409'),
      },
      422: {
        error: true,
        message: message || translateFn('httpCode.422'),
      },
      500: {
        error: true,
        message: message || translateFn('httpCode.500'),
      },
    }
  },
  routes: {
    get: [
      {
        path: '/example',
        data: null,
      },
    ],
  },
}