"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ErrorBadge from "./error-badge"
import SideCalculation from "./side-calculation"

interface PercentageCalculatorProps {
  onCalculation: (input: string, result: string) => void
}

export default function PercentageCalculator({ onCalculation }: PercentageCalculatorProps) {
  const [calculationType, setCalculationType] = useState("")
  const [value1, setValue1] = useState("")
  const [value2, setValue2] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const handleCalculation = () => {
    setErrorMessage("")
    if (!calculationType) {
      setErrorMessage("Bitte wählen Sie eine Berechnungsart aus.")
      return
    }
    if (!value1 || !value2) {
      setErrorMessage("Bitte füllen Sie alle Felder aus.")
      return
    }

    const num1 = Number.parseFloat(value1)
    const num2 = Number.parseFloat(value2)

    if (isNaN(num1) || isNaN(num2)) {
      setErrorMessage("Bitte geben Sie gültige Zahlen ein.")
      return
    }

    let result: number
    let description: string

    switch (calculationType) {
      case "percentageIncrease":
        result = num1 * (1 + num2 / 100)
        description = `${num1} erhöht um ${num2}%`
        break
      case "percentageDecrease":
        result = num1 * (1 - num2 / 100)
        description = `${num1} verringert um ${num2}%`
        break
      case "percentageOf":
        result = (num1 * num2) / 100
        description = `${num2}% von ${num1}`
        break
      case "percentageRate":
        result = (num1 / num2) * 100
        description = `${num1} ist ${result.toFixed(2)}% von ${num2}`
        break
      case "grossFromNet":
        result = num1 * (1 + num2 / 100)
        description = `Bruttopreis von ${num1} mit ${num2}% MwSt`
        break
      case "netFromGross":
        result = num1 / (1 + num2 / 100)
        description = `Nettopreis von ${num1} mit ${num2}% MwSt`
        break
      default:
        setErrorMessage("Ungültige Berechnungsart.")
        return
    }

    onCalculation(description, result.toFixed(2))
  }

  const handleSideCalculation = (result: string) => {
    // You can decide which input field to update based on your requirements
    setValue1(result)
  }

  return (
    <div className="grid gap-6">
      {errorMessage && <ErrorBadge message={errorMessage} />}
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label>Berechnungsart</Label>
          <Select value={calculationType} onValueChange={setCalculationType}>
            <SelectTrigger>
              <SelectValue placeholder="Wählen Sie eine Berechnungsart" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="percentageIncrease">Prozent dazu</SelectItem>
              <SelectItem value="percentageDecrease">Prozent weg</SelectItem>
              <SelectItem value="percentageOf">Prozent davon</SelectItem>
              <SelectItem value="percentageRate">Prozentsatz</SelectItem>
              <SelectItem value="grossFromNet">Bruttopreis aus Nettopreis</SelectItem>
              <SelectItem value="netFromGross">Nettopreis aus Bruttopreis</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label>Wert 1</Label>
          <Input
            type="number"
            value={value1}
            onChange={(e) => setValue1(e.target.value)}
            placeholder="Geben Sie den ersten Wert ein"
          />
        </div>
        <div className="grid gap-2">
          <Label>Wert 2</Label>
          <Input
            type="number"
            value={value2}
            onChange={(e) => setValue2(e.target.value)}
            placeholder="Geben Sie den zweiten Wert ein"
          />
        </div>
        <Button onClick={handleCalculation}>Berechnen</Button>
      </div>
      <div className="grid gap-4">
        <Label>Nebenrechnung</Label>
        <SideCalculation onResult={handleSideCalculation} />
      </div>
    </div>
  )
}

