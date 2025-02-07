export function roundToSignificantDigits(num: number, significantDigits = 6): number {
  if (num === 0) {
    return 0
  }
  const d = Math.ceil(Math.log10(Math.abs(num)))
  const power = significantDigits - d
  const magnitude = Math.pow(10, power)
  const shifted = Math.round(num * magnitude)
  return shifted / magnitude
}

export function convertBinary(value: string, fromBase: number, toBase: number): string {
  const decimal = Number.parseInt(value, fromBase)
  if (isNaN(decimal)) {
    throw new Error("Ungültige Eingabe für das gewählte Zahlensystem.")
  }
  return decimal.toString(toBase)
}

export function calculateDataSize(size: number, fromUnit: string, toUnit: string): number {
  const units = ["B", "KB", "MB", "GB", "TB"]
  const fromIndex = units.indexOf(fromUnit)
  const toIndex = units.indexOf(toUnit)
  return size * Math.pow(1024, fromIndex - toIndex)
}

export function calculateImageSize(width: number, height: number, colorDepth: number): number {
  return (width * height * colorDepth) / 8 // Result in bytes
}

export function calculateVideoSize(
  width: number,
  height: number,
  colorDepth: number,
  frameRate: number,
  duration: number,
): number {
  return (width * height * colorDepth * frameRate * duration) / 8 // Result in bytes
}

