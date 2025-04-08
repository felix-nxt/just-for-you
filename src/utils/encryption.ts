export function encryptData(data: string, key = "JustForYouCalculator"): string {
  let result = ""
  for (let i = 0; i < data.length; i++) {
    result += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length))
  }
  return btoa(result) // Base64 encode
}

export function decryptData(encryptedData: string, key = "JustForYouCalculator"): string {
  try {
    const data = atob(encryptedData) // Base64 decode
    let result = ""
    for (let i = 0; i < data.length; i++) {
      result += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length))
    }
    return result
  } catch (error) {
    throw new Error("Ungültiges Format oder Passwort")
  }
}
