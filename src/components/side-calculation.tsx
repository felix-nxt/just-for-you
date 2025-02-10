"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import ErrorBadge from "./error-badge"

interface SideCalculationProps {
  onResult: (result: string) => void
}

export default function SideCalculation({ onResult }: SideCalculationProps) {
  const [expression, setExpression] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const handleCalculate = () => {
    setErrorMessage("")
    try {
      // Using Function constructor to evaluate the expression
      // This is generally safe for simple arithmetic expressions
      const result = new Function(`return ${expression}`)()
      if (isNaN(result) || !isFinite(result)) {
        throw new Error("Ungültiges Ergebnis")
      }
      onResult(result.toString())
      setExpression("")
    } catch (error) {
      setErrorMessage("Ungültige Berechnung")
    }
  }

  return (
    <div className="grid gap-4">
      {errorMessage && <ErrorBadge message={errorMessage} />}
      <Input
        value={expression}
        onChange={(e) => setExpression(e.target.value)}
        placeholder="Ausdruck eingeben (z.B. 2 + 2)"
      />
      <Button onClick={handleCalculate}>Berechnen</Button>
    </div>
  )
}

