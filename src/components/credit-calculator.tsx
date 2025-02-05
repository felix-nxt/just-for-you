"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface CreditCalculatorProps {
  onCalculation: (input: string, result: string) => void
}

export default function CreditCalculator({ onCalculation }: CreditCalculatorProps) {
  const [amount, setAmount] = useState("")
  const [rate, setRate] = useState("")
  const [terms, setTerms] = useState("")

  const calculateLoan = (type: "single" | "installment") => {
    if (!amount || !rate || !terms) {
      alert("Bitte füllen Sie alle Felder aus.")
      return
    }
    const principal = Number.parseFloat(amount)
    const interestRate = Number.parseFloat(rate) / 100
    const numberOfPayments = Number.parseInt(terms)

    if (type === "single") {
      const interest = principal * interestRate * (numberOfPayments / 12)
      const total = principal + interest
      onCalculation(
        `Einmalzahlung: ${principal}€ bei ${rate}% für ${terms} Monate`,
        `Gesamt: ${total.toFixed(2)}€ (Zinsen: ${interest.toFixed(2)}€)`,
      )
    } else {
      const monthlyRate = interestRate / 12
      const monthlyPayment =
        (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
      const totalPayment = monthlyPayment * numberOfPayments
      const totalInterest = totalPayment - principal

      onCalculation(
        `Ratenzahlung: ${principal}€ bei ${rate}% für ${terms} Monate`,
        `Monatlich: ${monthlyPayment.toFixed(2)}€ (Gesamt: ${totalPayment.toFixed(2)}€)`,
      )
    }
  }

  return (
    <div className="grid gap-6">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label>Kreditsumme (€)</Label>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Kreditsumme eingeben"
          />
        </div>
        <div className="grid gap-2">
          <Label>Jahreszins (%)</Label>
          <Input type="number" value={rate} onChange={(e) => setRate(e.target.value)} placeholder="Zinssatz eingeben" />
        </div>
        <div className="grid gap-2">
          <Label>Laufzeit (Monate)</Label>
          <Input
            type="number"
            value={terms}
            onChange={(e) => setTerms(e.target.value)}
            placeholder="Laufzeit in Monaten eingeben"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Button onClick={() => calculateLoan("single")}>Einmalzahlung</Button>
        <Button onClick={() => calculateLoan("installment")}>Ratenzahlung</Button>
      </div>
    </div>
  )
}

