import type { LLM } from '@lmstudio/sdk';
import { parseJSON } from '../util/parse';
import type { TestItem } from './types';
import { runTests } from '../util/runTest';
import { allPkmn } from '../data/gen_1_pokemon';

export async function runWorldKnowledgeTests(model: LLM) {
  console.log('🌎 Running world knowledge tests...');
  await runTests(geographyTests, model, 'Geography');
  return await runTests(gameKnowledge, model, 'Gaming');
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

const gameKnowledge: TestItem[] = [
  {
    name: 'Gen I Pokemon',
    prompt: `Give me a list of all 151 Gen 1 Pokémon.`,
    validation: (result) => {
      const parsedResult = result.split('\n');
      let currentPokemon = allPkmn.shift();
      let previousPokemon: (typeof allPkmn)[0] | undefined;
      let score = 0;
      if (!currentPokemon) throw Error('Error parsing PKMN list');
      for (const pokemon of parsedResult) {
        if (previousPokemon && pokemon.includes(previousPokemon.name) && pokemon.includes(previousPokemon.number)) {
          return {
            percentage: 0,
            resultText: 'Duplicate Pokemon, failed test',
          };
        }
        if (pokemon.includes(currentPokemon.name) && pokemon.includes(currentPokemon.number)) {
          score++;
          previousPokemon = currentPokemon;
          currentPokemon = allPkmn.shift();
          if (!currentPokemon) break; // break when finished
        }
      }
      const percentage = (score / 151) * 100;
      return {
        percentage,
        resultText: '',
      };
    },
  },
];

const transactionEnrichment: TestItem[] = [];
