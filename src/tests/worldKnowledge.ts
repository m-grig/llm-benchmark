import type { LLM } from '@lmstudio/sdk';
import { colorizePercentage, makeTextBold } from '../util/logging';
import { parseJSON } from '../util/parse';
import type { TestResult } from './types';

export async function runWorldKnowledgeTests(model: LLM) {
  console.log('🌎 Running world knowledge tests...');
  try {
    const geographyScore = await testGeography(model);
    console.log(`  Total tokens used: ${geographyScore.totalTokens.toLocaleString()}`);
  } catch (e) {
    console.log(makeTextBold('- Geography Knowledge:'));
    console.log(`  ${colorizePercentage(0)} - Failed to run test`);
    console.error(e);
    return 0;
  }
  console.log('');
}

async function testGeography(model: LLM): Promise<TestResult> {
  const prompt = `Please respond in a JSON array of strings listing the capitol cities of the following countries:
Kenya
South Korea
Argentina
Panama
Zambia`;
  const expectedResult = ['Nairobi', 'Seoul', 'Buenos Aires', 'Panama City', 'Lusaka'];

  const response = await model.respond(prompt);
  const result = parseJSON(response.nonReasoningContent);
  const percentage = Number(JSON.stringify(expectedResult) === JSON.stringify(result)) * 100;

  console.log(makeTextBold('- Geography:'));
  console.log(`  ${colorizePercentage(percentage)}`);
  return {
    percentage,
    totalTokens: response.stats.totalTokensCount ?? 0,
  };
}
