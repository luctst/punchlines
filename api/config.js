const { Types } = require('mongoose');

module.exports = {
  apiVersion: 1,
  cookieRefresh: 'XSRF-TOKEN',
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
        path: '/auth/refresh_token',
        data: null,
      },
      {
        path: '/lyrics',
        data: null,
      },
      {
        path: '/lyrics/:id',
        data: null,
      },
      {
        path: '/user/:uid',
        data: null,
      },
      {
        path: '/punchlines/:id',
        data: null,
      },
    ],
    post: [
      {
        path: '/auth/register',
        data: {
          username: {
            type: String,
            required: true,
          },
          email: {
            type: String,
            required: true,
            match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
          },
          password: {
            type: String,
            required: true,
          },
        },
      },
      {
        path: '/auth/login',
        data: {
          email: {
            type: String,
            required: true,
            match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
          },
          password: {
            type: String,
            required: true,
          },
        },
      },
      {
        path: '/punchlines',
        data: {
          punchline: {
            type: String,
            required: true,
          },
          author: {
            type: Types.ObjectId,
            required: true,
          },
          lyrics_id: {
            type: Types.ObjectId,
            required: true,
          },
        },
      },
    ],
    delete: [
      {
        path: '/punchlines/:id',
        data: null,
      },
    ],
    patch: [
      {
        path: '/punchlines/:id/likes',
        data: {
          author_id: {
            type: Types.ObjectId,
            required: true,
          },
          likes: {
            type: Number,
            required: true,
            min: 0,
            max: 100,
          },
        },
      },
    ],
  },
}