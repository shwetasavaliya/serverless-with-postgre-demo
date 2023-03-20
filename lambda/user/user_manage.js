const awsRequestHelper = require("../../common/awsRequestHelper");
const Joi = require("joi");
const { DBManager } = require("../../common/dbmanager");
const DB = new DBManager();
const bcrypt = require("bcrypt");
const saltRounds = 10;

const validateAction = function (body) {
  const userAction = ["add_user", "edit_user", "get_user", "delete_user"];

  const schema = Joi.object().keys({
    action: Joi.string()
      .valid(...userAction)
      .required(),
  });

  return new Promise(async (resolve, reject) => {
    try {
      const value = await schema.validateAsync(body, { allowUnknown: true });
      resolve(value);
    } catch (error) {
      reject({ status_code: 400, message: error.details[0].message });
      //   throw new Error(error.details[0].message)
    }
  });
};

const addUserValidate = function (body) {
  const schema = Joi.object().keys({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
  });

  return new Promise(async (resolve, reject) => {
    try {
      const value = await schema.validateAsync(body, { allowUnknown: true });
      resolve(value);
    } catch (error) {
      reject({ status_code: 400, message: error?.details[0]?.message });
    }
  });
};

module.exports.handler = async (event, context, callback) => {
  try {
    const apiData = JSON.parse(event.body);
    await validateAction(apiData);
    const { action } = apiData;

    switch (action) {
      case "add_user":
        await addUserValidate(apiData);
        return addUser(apiData);

      default:
        break;
    }
  } catch (error) {
    console.log("error::", error);
    let message = error.message;
    message = message.replace(/_/g, " ");
    message = message.replace(/"/g, "");

    return {
      statusCode: error.status_code,
      body: JSON.stringify({ message }),
    };
  }
};

const addUser = async function (apiData) {
  let response = {};
  try {
    const { first_name, last_name, email, password } = apiData;

    const userData = await DB.runQuery(
      `SELECT * FROM user_master WHERE email= '${email}' AND is_deleted = 0`
    );

    if (userData?.rows?.length) throw new Error("Email already exists!");

    const salt = bcrypt.genSaltSync(saltRounds);

    const newPassword = bcrypt.hashSync(password, salt);

    let userObj = {
      first_name,
      last_name,
      email,
      password: newPassword,
    };

    await DB.dataInsert("user_master", userObj);

    response = {
      status: true,
      message: "User added successfully....",
    };

    return awsRequestHelper.respondWithJsonBody(200, response);
  } catch (error) {
    console.log("error::", error);
    response["message"] =
      error && error.message ? error.message : response.message;
    let status_code =
      error && Number.isInteger(error.status_code)
        ? Number(error.status_code)
        : 500;
    return awsRequestHelper.respondWithJsonBody(status_code, response);
  }
};
