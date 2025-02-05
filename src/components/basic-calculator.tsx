"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { calculateBasic } from "@/utils/calculations"

interface BasicCalculatorProps {
  onCalculation: (input: string, result: string) => void
}

export default function BasicCalculator({ onCalculation }: BasicCalculatorProps) {
  const [display, setDisplay] = useState("0")
  const [waitingForOperand, setWaitingForOperand] = useState(true)

  const buttons = ["7", "8", "9", "÷", "4", "5", "6", "×", "1", "2", "3", "-", "0", ".", "=", "+", "C", "(", ")", "CE"]

  const handleButtonClick = (value: string) => {
    switch (value) {
      case "C":
        setDisplay("0")
        setWaitingForOperand(true)
        break
      case "CE":
        setDisplay(display.slice(0, -1) || "0")
        break
      case "=":
        try {
          const result = calculateBasic(display)
          onCalculation(display, result)
          setDisplay(result)
          setWaitingForOperand(true)
        } catch (error) {
          setDisplay("Fehler")
        }
        break
      default:
        if (waitingForOperand) {
          setDisplay(value)
          setWaitingForOperand(false)
        } else {
          setDisplay(display + value)
        }
    }
  }

  return (
    <div className="grid gap-4">
      <div className="p-4 text-right text-2xl font-mono bg-muted rounded-lg">{display}</div>
      <div className="grid grid-cols-4 gap-2">
        {buttons.map((btn) => (
          <Button
            key={btn}
            onClick={() => handleButtonClick(btn)}
            variant={["÷", "×", "-", "+", "="].includes(btn) ? "default" : "outline"}
          >
            {btn}
          </Button>
        ))}
      </div>
    </div>
  )
}

