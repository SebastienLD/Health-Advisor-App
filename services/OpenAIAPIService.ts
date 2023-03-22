import { HealthGoal, UserDietPreferences } from '../models/UserInfo';
import configData from '../config.json';

const { Configuration, OpenAIApi } = require('openai');

const OpenAIAPIService = {
  getMealRecipe: async (
    calories: number,
    healthGoal: HealthGoal
  ): Promise<string> => {
    const roundedCals = Math.round(calories);
    let gptMessage = '';
    switch (healthGoal) {
      case HealthGoal.gain_muscle:
        gptMessage = `
            Give me a good recipe for a meal that will help me build muscle.
            It should have about ${roundedCals} calories.
        `;
      case HealthGoal.lose_fat:
        gptMessage = `
        Give me a good recipe for a meal that will help me lose fat.
        It should have about ${roundedCals} calories.
            `;
      default:
        gptMessage = `
            Give me a good recipe that has about ${roundedCals} calories.
        `;
    }
    gptMessage += `
        Please give me a response in the following format, filling in the {}:

        Recipe Name: {},
        Calories: {},
        Nutrients:
          - Protein: {},
          - Carbohydrates: {},
          - Fats: {},
        Dietery Preferences:
          - Lactose Free: {},
          - Gluten Free: {},
          - Dairy Free: {},
          - Vegetarian: {},
          - Kosher: {},
          - Keto: {},
          - Good for diabetes: {},
          - Low carbohydrates: {}

          Recipe Ingredients: {},
          Recipe Instructions: {},
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
