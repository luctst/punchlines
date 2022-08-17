const response = require('@utils/responseClient');

/**
 * function who parsed response controller and call response function who send data to client.
 * @param {Object} res - response express objet
 * @param {Object} dataToSend - Data to parse and sent.
 */
module.exports = function parseResponse(res, dataToSend) {
  if (dataToSend instanceof Error || dataToSend instanceof TypeError) {
    if (process.env.NODE_ENV === 'production') {
      return response(res, 500);
    }

    return response(res, 500, {
      ...(res.locals.data &&
        res.locals.data.header && { serverHeader: res.locals.data.header }),
      modifyResponse: {
        message: dataToSend.message,
        stack: dataToSend.stack,
        ...(res.locals.data &&
          res.locals.data.newToken && { token: res.locals.data.newToken }),
      },
    });
  }

  const ops = {};

  if (dataToSend.serverHeader) {
    ops.serverHeader = { ...dataToSend.serverHeader };
  }

  if (dataToSend.content) {
    ops.content = dataToSend.content;
  }

  if (dataToSend.modifyResponse) {
    ops.modifyResponse = { ...dataToSend.modifyResponse };
  }

  if (dataToSend.redirectTo) {
    ops.redirectTo = dataToSend.redirectTo;
  }

  return response(res, dataToSend.code, { ...ops });
};
