"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface PercentageCalculatorProps {
  onCalculation: (input: string, result: string) => void
}

export default function PercentageCalculator({ onCalculation }: PercentageCalculatorProps) {
  const [value, setValue] = useState("")
  const [percentage, setPercentage] = useState("")

  const calculatePercentage = (type: string) => {
    if (!value || !percentage) {
      alert("Bitte geben Sie beide Werte ein.")
      return
    }
    const val = Number.parseFloat(value)
    const perc = Number.parseFloat(percentage)
    let result = 0
    let description = ""

    switch (type) {
      case "of":
        result = (val * perc) / 100
        description = `${perc}% von ${val}`
        break
      case "increase":
        result = val * (1 + perc / 100)
        description = `${val} erhöht um ${perc}%`
        break
      case "decrease":
        result = val * (1 - perc / 100)
        description = `${val} verringert um ${perc}%`
        break
      case "is":
        result = (val / percentage) * 100
        description = `${val} ist wieviel % von ${percentage}`
        break
      case "to":
        result = ((val - percentage) / percentage) * 100
        description = `Prozentuale Änderung von ${percentage} zu ${val}`
        break
    }

    onCalculation(description, result.toFixed(2))
  }

  return (
    <div className="grid gap-6">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label>Wert</Label>
          <Input type="number" value={value} onChange={(e) => setValue(e.target.value)} placeholder="Wert eingeben" />
        </div>
        <div className="grid gap-2">
          <Label>Prozentsatz</Label>
          <Input
            type="number"
            value={percentage}
            onChange={(e) => setPercentage(e.target.value)}
            placeholder="Prozentsatz eingeben"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        <Button onClick={() => calculatePercentage("of")}>% von Zahl</Button>
        <Button onClick={() => calculatePercentage("increase")}>Erhöhen um %</Button>
        <Button onClick={() => calculatePercentage("decrease")}>Verringern um %</Button>
        <Button onClick={() => calculatePercentage("is")}>Ist wieviel %</Button>
        <Button onClick={() => calculatePercentage("to")}>% Änderung</Button>
      </div>
    </div>
  )
}

