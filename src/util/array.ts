export function averageOfArray(array: number[]) {
  return array.reduce((a, b) => a + b) / array.length;
}

export function sumOfArray(array: number[]) {
  return array.reduce((partialSum, a) => partialSum + a, 0);
}

export function scoreArray(array: { score: number; tokens?: number }[]) {
  const sum = sumOfArray(array.map((val) => val.score));
  const percentage = (sum / array.length) * 100;
  const tokensArray = array.map((val) => val.tokens || 0);
  return {
    score: sum,
    total: array.length,
    percentage,
    totalTokens: sumOfArray(tokensArray),
    averageTokensPerTest: averageOfArray(tokensArray),
  };
}
