"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { roundToSignificantDigits } from "@/utils/calculations"

interface SchoolCalculatorProps {
  onCalculation: (input: string, result: string) => void
}

export default function SchoolCalculator({ onCalculation }: SchoolCalculatorProps) {
  const [grades, setGrades] = useState<string[]>([""])

  const addGrade = () => {
    setGrades([...grades, ""])
  }

  const updateGrade = (index: number, value: string) => {
    const newGrades = [...grades]
    newGrades[index] = value
    setGrades(newGrades)
  }

  const calculateAverage = () => {
    const validGrades = grades.map((g) => Number.parseFloat(g)).filter((g) => !isNaN(g) && g >= 1 && g <= 6)

    if (validGrades.length === 0) {
      alert("Bitte geben Sie mindestens eine gültige Note ein.")
      return
    }

    const sum = validGrades.reduce((a, b) => a + b, 0)
    const average = roundToSignificantDigits(sum / validGrades.length)

    onCalculation(`Durchschnitt von ${validGrades.length} Noten`, `${average} (${getGradeRecommendation(average)})`)
  }

  const getGradeRecommendation = (average: number): string => {
    if (average <= 1.5) return "Sehr gut (1)"
    if (average <= 2.5) return "Gut (2)"
    if (average <= 3.5) return "Befriedigend (3)"
    if (average <= 4.5) return "Ausreichend (4)"
    if (average <= 5.5) return "Mangelhaft (5)"
    return "Ungenügend (6)"
  }

  return (
    <div className="grid gap-6">
      <div className="grid gap-4">
        {grades.map((grade, index) => (
          <div key={index} className="grid gap-2">
            <Label>Note {index + 1}</Label>
            <Input
              type="number"
              min="1"
              max="6"
              step="0.1"
              value={grade}
              onChange={(e) => updateGrade(index, e.target.value)}
              placeholder="Note eingeben (1-6)"
            />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Button onClick={addGrade} variant="outline">
          Note hinzufügen
        </Button>
        <Button onClick={calculateAverage}>Durchschnitt berechnen</Button>
      </div>
    </div>
  )
}

