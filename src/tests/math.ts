import type { LLM } from '@lmstudio/sdk';
import { scoreArray } from '../util/array';

export async function runMathTests(model: LLM) {
  console.log('🧠 Running math tests...');
  await testBasicAlgebra(model);
}

async function testBasicAlgebra(model: LLM) {
  const instructions = 'Solve this algebra equation for x. Only respond with the correct number.\n';
  const equations = [
    ['3x = 21', 7],
    ['5.9 = x + 5.11', 0.79],
    ['x + 5 = 13', 8],
    ['2x - 7 = 11', 9],
    ['5x + 4 = 29', 5],
    ['2x + 3x = 25', 5],
  ];
  const results = equations.map(async (equation, i) => {
    const prompt = instructions + equation[0];
    const response = await model.respond(prompt);
    const result = Number(response.nonReasoningContent);
    const score = result === equation[1] ? 1 : 0;
    console.log(`${i + 1}/${equations.length} ${score == 1 ? '✅' : '❌'} ${equation[0]}`);
    return { score, tokens: response.stats.totalTokensCount };
  });
  const awaitedResults = await Promise.all(results);
  const finalScore = scoreArray(awaitedResults);
  console.log('Algebra score:');
  console.log(`${finalScore.percentage.toFixed(2)}% ${finalScore.score} out of ${finalScore.total}`);
  console.log(
    `Total tokens used: ${finalScore.totalTokens}; Average tokens per test: ${finalScore.averageTokensPerTest}`
  );
}
