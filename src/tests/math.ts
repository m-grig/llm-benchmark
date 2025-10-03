import type { LLM } from '@lmstudio/sdk';
import type { TestItem } from './types';
import { runTests } from '../util/runTest';

export async function runMathTests(model: LLM) {
  console.log('🧠 Running math tests...');
  const basicAlgebraTests = await getBasicAlgebraTests();
  await runTests(basicAlgebraTests, model, 'Basic Algebra');
}

async function getBasicAlgebraTests() {
  const basicAlgebraTests: TestItem[] = [];
  const equations = [
    ['3x = 21', 7],
    ['5.9 = x + 5.11', 0.79],
    ['x + 5 = 13', 8],
    ['2x - 7 = 11', 9],
    ['5x + 4 = 29', 5],
    ['2x + 3x = 25', 5],
    ['1.2x - 0.6 = 5.4', 5],
  ];
  const instructions = 'Solve this algebra equation for x. Only respond with the correct number.\n';
  for (const [input, output] of equations) {
    if (!input) throw Error('Missing input value');
    basicAlgebraTests.push({
      name: input?.toString(),
      prompt: instructions + input,
      validation: (result) => {
        const parsedResponse = Number(result);
        const score = parsedResponse === output ? 1 : 0;
        return { percentage: score * 100, resultText: result };
      },
    });
  }
  return basicAlgebraTests;
}
