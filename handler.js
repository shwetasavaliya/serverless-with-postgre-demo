const { Configuration, OpenAIApi } = require("openai");

module.exports.travelplan = async (event) => {
  try {
    console.log("======================", JSON.parse(event.body));
    const { location, date, days } = JSON.parse(event.body);

    const question1 = `Location: ${location}, Date: ${date}, Days to stay: ${days}
    Give me a travel plan as per the given input and also give it place name and location, give in json`;
    const configuration = new Configuration({
      apiKey: "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",
    });

    const openai = new OpenAIApi(configuration);

    const completion1 = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: question1 }],
    });

    console.log("data:::", completion1.data.choices[0].message);

    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: "Go Serverless v1.0! Your function executed successfully!",
          data: completion1.data.choices[0].message,
        },
        null,
        2
      ),
    };
  } catch (error) {
    console.log(error);
  }

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
