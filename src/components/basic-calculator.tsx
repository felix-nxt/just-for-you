"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { evaluate } from "mathjs"
import ErrorBadge from "./error-badge"

interface BasicCalculatorProps {
  onCalculation: (input: string, result: string) => void
}

export default function BasicCalculator({ onCalculation }: BasicCalculatorProps) {
  const [display, setDisplay] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const buttons = ["7", "8", "9", "/", "4", "5", "6", "*", "1", "2", "3", "-", "0", ".", "=", "+", "C", "(", ")", "CE"]

  const handleButtonClick = (value: string) => {
    setErrorMessage("")

    switch (value) {
      case "C":
        setDisplay("")
        break
      case "CE":
        setDisplay((prev) => prev.slice(0, -1))
        break
      case "=":
        try {
          const result = evaluate(display)
          if (isNaN(result) || !isFinite(result)) {
            throw new Error("Ungültiges Ergebnis")
          }
          onCalculation(display, result.toString())
          setDisplay(result.toString())
        } catch (error) {
          setErrorMessage("Ungültige Berechnung")
        }
        break
      default:
        setDisplay((prev) => {
          if (prev === "0" && !isNaN(Number(value))) {
            return value
          }
          return prev + value
        })
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleButtonClick("=")
    }
  }

  return (
    <div className="grid gap-4">
      <Input
        value={display}
        onChange={(e) => setDisplay(e.target.value)}
        onKeyDown={handleKeyDown}
        className="text-right text-lg font-mono p-2"
        placeholder="0"
      />
      {errorMessage && <ErrorBadge message={errorMessage} />}
      <div className="grid grid-cols-4 gap-1">
        {buttons.map((btn) => (
          <Button
            key={btn}
            onClick={() => handleButtonClick(btn)}
            variant={["=", "+", "-", "*", "/"].includes(btn) ? "default" : "outline"}
            size="sm"
            className="text-sm py-1"
          >
            {btn}
          </Button>
        ))}
      </div>
    </div>
  )
}