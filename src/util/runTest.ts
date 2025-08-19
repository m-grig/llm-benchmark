import type { LLM } from '@lmstudio/sdk';
import { colorizePercentage, colorizeText, makeTextBold } from './logging';
import type { TestItem, TestResult } from '../tests/types';
import { averageOfArray } from './array';

export async function runTests(tests: TestItem[], model: LLM, title: string) {
  console.log(makeTextBold(`- ${title}:`));
  let totalTokens = 0;
  const results: TestResult[] = [];
  for (const test of tests) {
    try {
      const result = await runTest(model, test);
      results.push(result);
      totalTokens += result.totalTokens;
      console.log(
        `  ${test.name} - ${colorizePercentage(result.percentage)} - ${result.totalTokens.toLocaleString()} tokens`
      );
      if (result.resultText) console.log(colorizeText(`    Output: ${result.resultText}`, 'gray'));
    } catch (e) {
      console.log(`  ${test.name} - ${colorizePercentage(0)} - Failed to run test`);
      console.error(e);
      results.push({ percentage: 0, totalTokens: 0 });
    }
  }
  console.log(makeTextBold(`  ${title} Totals:`));
  console.log('    Percentage - ' + colorizePercentage(averageOfArray(results.map((result) => result.percentage))));
  console.log(`    Tokens used - ${totalTokens.toLocaleString()}`);
  console.log('');
}

export async function runTest(model: LLM, test: TestItem): Promise<TestResult> {
  const response = await model.respond(test.prompt);
  const score = test.validation(response.nonReasoningContent);
  const result: TestResult = { ...score, totalTokens: response.stats.totalTokensCount ?? 0 };
  return result;
}
