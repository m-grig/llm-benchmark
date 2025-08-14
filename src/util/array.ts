export function averageOfArray(array: number[]) {
  return array.reduce((a, b) => a + b) / array.length;
}

export function sumOfArray(array: number[]) {
  return array.reduce((partialSum, a) => partialSum + a, 0);
}

export function scoreArray(array: number[]) {
  const sum = sumOfArray(array);
  const percentage = sum / array.length;
  return {
    score: sum,
    total: array.length,
    percentage,
  };
}
