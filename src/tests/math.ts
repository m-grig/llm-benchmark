import type { LLM } from '@lmstudio/sdk';
import { scoreArray } from '../util/array';

export async function runMathTests(model: LLM) {
  console.log('Running math tests')
  const scores = tests.map(async (test) => {
    const response = await model.respond(test.prompt);
    return test.validation(response.nonReasoningContent);
  });
  const finalScore = scoreArray(await Promise.all(scores));
  console.log('Math tests:');
  console.log(`${finalScore.percentage.toFixed(2)}% ${finalScore.score} out of ${finalScore.total}`);
}

type MathTest = {
  prompt: string;
  validation: (value: any) => number;
};

const tests: MathTest[] = [
  {
    prompt: `Solve this algebra equation for x. Only respond with the correct number.
5.9 = x + 5.11`,
    validation: (v: string) => {
      return Number(v) === 0.79 ? 1 : 0;
    },
  },
];

async function basicAlgebra() {
  const prompt = `Solve this algebra equation for x. Only respond with the correct number.
5.9 = x + 5.11`;
}
