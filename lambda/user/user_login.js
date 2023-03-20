const awsRequestHelper = require("../../common/awsRequestHelper");
const Joi = require("joi");
const { DBManager } = require("../../common/dbmanager");
const DB = new DBManager();
const bcrypt = require("bcrypt");

const validate = function (body) {
  const schema = Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  });

  return new Promise(async (resolve, reject) => {
    try {
      const data = schema.validateAsync(body, { allowUnknown: true });
      resolve(data);
    } catch (error) {
      reject({ status_code: 400, message: error.details[0].message });
    }
  });
};

module.exports.handler = async (event, context, callback) => {
  let response = {};
  try {
    const apiData = JSON.parse(event.body);
    await validate(apiData);

    const { email, password } = apiData;

    const userResult = await DB.runQuery(
      `SELECT * FROM user_master WHERE email = '${email}' AND is_deleted = 0`
    );

    const userData = userResult?.rows?.length > 0 ? userResult?.rows[0] : null;

    if (userData) {
      if (
        userData?.password &&
        bcrypt.compareSync(password, userData?.password)
      ) {
        response = {
          status: true,
          message: "User login successfully....",
          data: {
            first_name: userData?.first_name,
            last_name: userData?.last_name,
          },
        };
      } else {
        throw new Error("Invaild email and password!");
      }
    } else {
      throw new Error("Invaild email and password!");
    }

    console.log("response:::", response);

    return awsRequestHelper.respondWithJsonBody(200, response);
  } catch (error) {
    console.log("error:::", error);
    response["message"] =
      error && error.message ? error.message : response.message;
    let status_code =
      error && Number.isInteger(error.status_code)
        ? Number(error.status_code)
        : 500;
    return awsRequestHelper.respondWithJsonBody(status_code, response);
  }
};
