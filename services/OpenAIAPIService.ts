import { HealthGoal } from '../models/UserInfo';
import configData from '../config.json';

const { Configuration, OpenAIApi } = require('openai');

const OpenAIAPIService = {
  getMealRecipe: async (calories: number, healthGoal: HealthGoal) => {
    let gptMessage = '';
    switch (healthGoal) {
      case HealthGoal.gain_muscle:
        gptMessage = `
            Give me a good recipe for a meal that will help me build muscle.
            It should have about ${calories} calories.
        `;
      case HealthGoal.lose_fat:
        gptMessage = `
        Give me a good recipe for a meal that will help me lose fat.
        It should have about ${calories} calories.
            `;
      default:
        gptMessage = `
            Give me a good recipe that has about ${calories} calories.
        `;
    }
    gptMessage += `
        Please begin the response by breaking down the 
        nutrition of this recipe, including how many calories it is,
        and the macro nutrietns, such as protein, fats, and carbohydrates
    `;
    const configuration = new Configuration({
      apiKey: configData.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    const completion = await openai.createCompletion({
      //   model: 'gpt-3.5-turbo',
      model: 'text-davinci-003',
      prompt: gptMessage,
      max_tokens: 2000,
    });
    return completion.data.choices[0].text;
  },
};

export default OpenAIAPIService;
