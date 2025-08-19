export type ValidationResult = {
  resultText?: string;
  percentage: number;
};

export type TestResult = ValidationResult & {
  totalTokens: number;
  averageTokensPerTest?: number;
};

export type TestItem = {
  name: string;
  prompt: string;
  validation: (result: string) => ValidationResult;
};
