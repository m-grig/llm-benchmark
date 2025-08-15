import type { LLM } from '@lmstudio/sdk';
import { scoreArray } from '../util/array';
import { colorizePercentage, colorizeText, makeTextBold } from '../util/logging';

export async function runMathTests(model: LLM) {
  console.log('🧠 Running math tests...');
  const algebraScore = await testBasicAlgebra(model);
  console.log('');
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
    ['1.2x - 0.6 = 5.4', 5],
  ];
  let correctCount = 0;
  const results = equations.map(async (equation, i) => {
    const prompt = instructions + equation[0];
    const response = await model.respond(prompt);
    const result = Number(response.nonReasoningContent);
    const score = result === equation[1] ? 1 : 0;
    correctCount += score;
    const colorizedEquation = colorizeText(equation[0]?.toString() ?? '', 'gray');
    const colorizedResult =
      score == 1 ? colorizeText(result.toString(), 'green') : colorizeText(result.toString(), 'red');
    console.log(`  ${correctCount}/${equations.length} ${colorizedEquation} - ${colorizedResult}`);
    return { score, tokens: response.stats.totalTokensCount };
  });
  const awaitedResults = await Promise.all(results);
  const finalScore = scoreArray(awaitedResults);
  console.log(makeTextBold('- Basic Algebra:'));
  console.log(`  ${colorizePercentage(finalScore.percentage)} - ${finalScore.score}/${finalScore.total}`);
  console.log(
    `  Total tokens used: ${finalScore.totalTokens.toLocaleString()}; Average tokens per test: ${finalScore.averageTokensPerTest.toLocaleString()}`
  );
  return finalScore;
}
