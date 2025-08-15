export function colorizeText(text: string, color: 'green' | 'yellow' | 'red' | 'gray'): string {
  const colors: Record<typeof color, string> = {
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    gray: '\x1b[90m',
  };

  const reset = '\x1b[0m';
  return `${colors[color]}${text}${reset}`;
}

export function colorizePercentage(percent: number) {
  const percentageText = `${percent.toFixed(2)}%`;
  if (percent >= 80) return colorizeText(percentageText, 'green');
  else if (percent >= 60) return colorizeText(percentageText, 'yellow');
  else return colorizeText(percentageText, 'red');
}

export function makeTextBold(text: string) {
  // \x1b[1m starts bold, \x1b[0m resets style
  return `\x1b[1m${text}\x1b[0m`;
}
