"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { roundToSignificantDigits } from "@/utils/calculations"
import ErrorBadge from "./error-badge"

interface SchoolCalculatorProps {
  onCalculation: (input: string, result: string) => void
}

export default function SchoolCalculator({ onCalculation }: SchoolCalculatorProps) {
  const [grades, setGrades] = useState<string[]>([""])
  const [errorMessage, setErrorMessage] = useState("")

  const addGrade = () => {
    setGrades([...grades, ""])
    setErrorMessage("")
  }

  const updateGrade = (index: number, value: string) => {
    const newGrades = [...grades]
    newGrades[index] = value
    setGrades(newGrades)

    if (value === "") {
      setErrorMessage("")
    } else if (!validateGrade(value)) {
      setErrorMessage("Die Note muss zwischen 1 und 6 liegen.")
    } else {
      setErrorMessage("")
    }
  }

  const validateGrade = (grade: string): boolean => {
    const numGrade = Number.parseFloat(grade)
    return !isNaN(numGrade) && numGrade >= 1 && numGrade <= 6
  }

  const calculateAverage = () => {
    const validGrades = grades.filter((g) => g !== "" && validateGrade(g))

    if (validGrades.length === 0) {
      setErrorMessage("Bitte geben Sie mindestens eine gültige Note ein.")
      return
    }

    const numericGrades = validGrades.map((g) => Number.parseFloat(g))
    const sum = numericGrades.reduce((a, b) => a + b, 0)
    const average = roundToSignificantDigits(sum / numericGrades.length, 2)

    onCalculation(
      `Durchschnitt von ${numericGrades.length} Noten`,
      `${average.toFixed(2)} (${getGradeRecommendation(average)})`,
    )
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
      {errorMessage && <ErrorBadge message={errorMessage} />}
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
              className={!validateGrade(grade) && grade !== "" ? "border-red-500" : ""}
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

