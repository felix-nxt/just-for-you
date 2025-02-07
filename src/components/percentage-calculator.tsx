"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { roundToSignificantDigits } from "@/utils/calculations"

interface PercentageCalculatorProps {
  onCalculation: (input: string, result: string) => void
}

export default function PercentageCalculator({ onCalculation }: PercentageCalculatorProps) {
  const [step, setStep] = useState(0)
  const [value, setValue] = useState("")
  const [percentage, setPercentage] = useState("")
  const [calculationType, setCalculationType] = useState("")

  const resetCalculator = () => {
    setStep(0)
    setValue("")
    setPercentage("")
    setCalculationType("")
  }

  const handleNextStep = () => {
    if (step === 0 && calculationType) {
      setStep(1)
    } else if (step === 1 && value) {
      setStep(2)
    }
  }

  const calculatePercentage = () => {
    if (!value || !percentage || !calculationType) {
      alert("Bitte füllen Sie alle Felder aus.")
      return
    }
    const val = Number.parseFloat(value)
    const perc = Number.parseFloat(percentage)
    let result = 0
    let description = ""

    switch (calculationType) {
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
        result = (val / perc) * 100
        description = `${val} ist ${result.toFixed(2)}% von ${perc}`
        break
      case "to":
        result = ((val - perc) / perc) * 100
        description = `Prozentuale Änderung von ${perc} zu ${val} ist ${result.toFixed(2)}%`
        break
    }

    onCalculation(description, roundToSignificantDigits(result).toString())
    resetCalculator()
  }

  return (
    <div className="grid gap-6">
      {step === 0 && (
        <div className="grid gap-4">
          <Label>Wählen Sie die Berechnungsart</Label>
          <Button onClick={() => setCalculationType("of")}>% von Zahl</Button>
          <Button onClick={() => setCalculationType("increase")}>Erhöhen um %</Button>
          <Button onClick={() => setCalculationType("decrease")}>Verringern um %</Button>
          <Button onClick={() => setCalculationType("is")}>Ist wieviel %</Button>
          <Button onClick={() => setCalculationType("to")}>% Änderung</Button>
        </div>
      )}
      {step === 1 && (
        <div className="grid gap-4">
          <Label>Geben Sie den Wert ein</Label>
          <Input type="number" value={value} onChange={(e) => setValue(e.target.value)} placeholder="Wert eingeben" />
          <Button onClick={handleNextStep}>Weiter</Button>
        </div>
      )}
      {step === 2 && (
        <div className="grid gap-4">
          <Label>Geben Sie den Prozentsatz ein</Label>
          <Input
            type="number"
            value={percentage}
            onChange={(e) => setPercentage(e.target.value)}
            placeholder="Prozentsatz eingeben"
          />
          <Button onClick={calculatePercentage}>Berechnen</Button>
        </div>
      )}
    </div>
  )
}

