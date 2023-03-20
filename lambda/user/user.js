module.exports.handler = async (event, context, callback) => {
  try {
    let resource =event.requestContext.resourcePath;
    switch (resource) {
      case "/user/login":
        const userLoginHandler = require("./user_login");
        return await userLoginHandler.handler(event, context, callback);

      case "/user/create":
        const userCreateHandler = require("./user_manage");
        return await userCreateHandler.handler(event, context, callback);
    }
  } catch (error) {
    console.log(error);
  }

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
