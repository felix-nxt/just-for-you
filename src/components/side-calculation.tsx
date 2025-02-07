"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { calculateBasic } from "@/utils/calculations"

interface SideCalculationProps {
  onResult: (result: string) => void
}

export default function SideCalculation({ onResult }: SideCalculationProps) {
  const [expression, setExpression] = useState("")

  const handleCalculate = () => {
    const result = calculateBasic(expression)
    onResult(result)
    setExpression("")
  }

  return (
    <div className="grid gap-4">
      <Label>Nebenrechnung</Label>
      <Input
        value={expression}
        onChange={(e) => setExpression(e.target.value)}
        placeholder="Ausdruck eingeben (z.B. 2 + 2)"
      />
      <Button onClick={handleCalculate}>Berechnen</Button>
    </div>
  )
}

