export const calculateBasic = (expression: string): string => {
  try {
    // Replace × with * and ÷ with / for evaluation
    const sanitizedExpression = expression.replace(/×/g, "*").replace(/÷/g, "/")
    return Function(`'use strict'; return (${sanitizedExpression})`)()
  } catch (error) {
    return "Error"
  }
}

export const convertBinary = (num: string, from: number, to: number): string => {
  try {
    return Number.parseInt(num, from).toString(to)
  } catch (error) {
    return "Error"
  }
}

export const calculateDataSize = (size: number, from: string, to: string): number => {
  const units = {
    B: 1,
    KB: 1024,
    MB: 1024 * 1024,
    GB: 1024 * 1024 * 1024,
    TB: 1024 * 1024 * 1024 * 1024,
  }

  return (size * units[from]) / units[to]
}

export const calculatePixels = (width: number, height: number, colorDepth: number): number => {
  return width * height * colorDepth
}

