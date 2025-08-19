import type { LLM } from '@lmstudio/sdk';
import { parseJSON } from '../util/parse';
import type { TestItem } from './types';
import { runTests } from '../util/runTest';

export async function runWorldKnowledgeTests(model: LLM) {
  console.log('🌎 Running world knowledge tests...');
  runTests(geographyTests, model, 'Geography');
}

const geographyTests: TestItem[] = [
  {
    name: 'Country Capitals',
    prompt: `Please respond in a JSON array of strings listing the capitol cities of the following countries:
Kenya
South Korea
Argentina
Panama
Zambia`,
    validation: (result) => {
      const expectedResult = JSON.stringify(['Nairobi', 'Seoul', 'Buenos Aires', 'Panama City', 'Lusaka']);
      const parsedResult = parseJSON(result);
      const resultText = JSON.stringify(parsedResult);
      const percentage = Number(expectedResult === JSON.stringify(parsedResult)) * 100;
      return {
        percentage,
        resultText,
      };
    },
  },
  {
    name: 'Bass Pro Shop',
    prompt: `Where is the Bass Pro Shop pyramid located? Please respond in the following JSON format:
{"state": string, "city": string}.`,
    validation: (result) => {
      const parsedResult = parseJSON(result);
      const resultText = JSON.stringify(parsedResult);
      if (parsedResult.city === 'Memphis' && ['TN', 'Tennessee'].includes(parsedResult.state))
        return { percentage: 100, resultText };
      return { percentage: 0, resultText };
    },
  },
];
