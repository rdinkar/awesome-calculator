export const validateEquation = (equation: string): boolean => {
  // Allow numbers, x, basic operators (+,-,*,/,^) and whitespace
  const validPattern = /^[0-9x\s\+\-\*\/\^]+$/;
  return validPattern.test(equation);
};

export const evaluateEquation = (equation: string, x: number): number => {
  // Replace x^n with Math.pow(x,n)
  const powReplaced = equation.replace(/x\^(\d+)/g, `Math.pow(x,$1)`);
  // Replace x with the actual value
  const xReplaced = powReplaced.replace(/x/g, x.toString());
  try {
    // eslint-disable-next-line no-eval
    return eval(xReplaced);
  } catch (error) {
    console.error("Error evaluating equation:", error);
    return 0;
  }
};
