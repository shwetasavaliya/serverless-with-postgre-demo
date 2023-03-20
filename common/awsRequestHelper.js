const callbackRespondWithCodeOnly = function (callback, statusCode) {
  callback(null, {
    statusCode: Number.isInteger(statusCode) ? Number(statusCode) : 500,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
  });
};

const callbackRespondWithSimpleMessage = function (
  callback,
  statusCode,
  message
) {
  callback(null, {
    statusCode: Number.isInteger(statusCode) ? Number(statusCode) : 500,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify({
      message: message,
    }),
  });
};

const callbackRespondWithJsonBody = function (callback, statusCode, body) {
  callback(null, {
    statusCode: Number.isInteger(statusCode) ? Number(statusCode) : 500,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify(body),
  });
};

const respondWithCodeOnly = function (statusCode) {
  return {
    statusCode: Number.isInteger(statusCode) ? Number(statusCode) : 500,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
  };
};

const respondWithSimpleMessage = function (statusCode, message) {
  return {
    statusCode: Number.isInteger(statusCode) ? Number(statusCode) : 500,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify({
      message: message,
    }),
  };
};

const respondWithJsonBody = function (statusCode, body) {
  if (statusCode === 400) {
    var message = body?.message || "";
    message = message.replace(/_/g, " ");
    message = message.replace(/"/g, "");
    body["message"] = capitalize(message);
  }
  return {
    statusCode: Number.isInteger(statusCode) ? Number(statusCode) : 500,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify(body),
  };
};

module.exports = {
  respondWithJsonBody,
  respondWithSimpleMessage,
  respondWithCodeOnly,
  callbackRespondWithJsonBody,
  callbackRespondWithSimpleMessage,
  callbackRespondWithCodeOnly,
};

const capitalize = (s) => s && s[0].toUpperCase() + s.slice(1);
