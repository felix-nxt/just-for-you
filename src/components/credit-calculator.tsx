"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ErrorBadge from "./error-badge"

interface CreditCalculatorProps {
  onCalculation: (input: string, result: string) => void
}

export default function CreditCalculator({ onCalculation }: CreditCalculatorProps) {
  const [calculationType, setCalculationType] = useState("")
  const [amount, setAmount] = useState("")
  const [interestRate, setInterestRate] = useState("")
  const [term, setTerm] = useState("")
  const [installment, setInstallment] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const handleCalculation = () => {
    setErrorMessage("")
    if (!calculationType) {
      setErrorMessage("Bitte wählen Sie eine Berechnungsart aus.")
      return
    }
    if (!amount || !interestRate) {
      setErrorMessage("Bitte geben Sie Kreditbetrag und Zinssatz ein.")
      return
    }

    const principal = Number.parseFloat(amount)
    const rate = Number.parseFloat(interestRate) / 100 / 12 // monthly interest rate

    if (isNaN(principal) || isNaN(rate) || principal <= 0 || rate <= 0) {
      setErrorMessage("Bitte geben Sie gültige positive Zahlen für Kreditbetrag und Zinssatz ein.")
      return
    }

    let result: string
    let description: string

    switch (calculationType) {
      case "singlePayment":
        if (!term) {
          setErrorMessage("Bitte geben Sie die Laufzeit in Monaten ein.")
          return
        }
        const months = Number.parseInt(term)
        if (isNaN(months) || months <= 0) {
          setErrorMessage("Bitte geben Sie eine gültige positive Zahl für die Laufzeit ein.")
          return
        }
        const totalAmount = principal * Math.pow(1 + rate, months)
        const totalInterest = totalAmount - principal
        result =
          `Kreditbetrag: ${principal.toFixed(2)} €\n` +
          `Zinssatz: ${(rate * 12 * 100).toFixed(2)}%\n` +
          `Laufzeit: ${months} Monate\n` +
          `Rückzahlungsbetrag: ${totalAmount.toFixed(2)} €\n` +
          `Zinsen gesamt: ${totalInterest.toFixed(2)} €`
        description = `Kredit mit einmaliger Rückzahlung über ${months} Monate`
        break

      case "installmentWithTerm":
        if (!term) {
          setErrorMessage("Bitte geben Sie die Laufzeit in Monaten ein.")
          return
        }
        const termMonths = Number.parseInt(term)
        if (isNaN(termMonths) || termMonths <= 0) {
          setErrorMessage("Bitte geben Sie eine gültige positive Zahl für die Laufzeit ein.")
          return
        }
        const monthlyPayment =
          (principal * rate * Math.pow(1 + rate, termMonths)) / (Math.pow(1 + rate, termMonths) - 1)
        const totalPaid = monthlyPayment * termMonths
        const totalInterestPaid = totalPaid - principal
        result =
          `Kreditbetrag: ${principal.toFixed(2)} €\n` +
          `Zinssatz: ${(rate * 12 * 100).toFixed(2)}%\n` +
          `Laufzeit: ${termMonths} Monate\n` +
          `Monatliche Rate: ${monthlyPayment.toFixed(2)} €\n` +
          `Rückzahlungsbetrag: ${totalPaid.toFixed(2)} €\n` +
          `Zinsen gesamt: ${totalInterestPaid.toFixed(2)} €`
        description = `Ratenkredit mit fester Laufzeit von ${termMonths} Monaten`
        break

      case "installmentWithPayment":
        if (!installment) {
          setErrorMessage("Bitte geben Sie die gewünschte Ratenhöhe ein.")
          return
        }
        const payment = Number.parseFloat(installment)
        if (isNaN(payment) || payment <= 0 || payment <= principal * rate) {
          setErrorMessage("Die Ratenhöhe ist zu niedrig oder ungültig.")
          return
        }

        // Calculate payments and final installment
        const exactPayments = Math.log(payment / (payment - principal * rate)) / Math.log(1 + rate)
        const numberOfPayments = Math.ceil(exactPayments)
        const regularPayments = numberOfPayments - 1
        const remainingBalance = principal * Math.pow(1 + rate, regularPayments) - 
          payment * (Math.pow(1 + rate, regularPayments) - 1) / rate
        const finalPayment = remainingBalance * (1 + rate)
        
        const actualTotalPaid = (payment * regularPayments) + finalPayment
        const actualTotalInterest = actualTotalPaid - principal

        result =
          `Kreditbetrag: ${principal.toFixed(2)} €\n` +
          `Zinssatz: ${(rate * 12 * 100).toFixed(2)}%\n` +
          `Monatliche Rate: ${payment.toFixed(2)} €\n` +
          `Laufzeit: ${numberOfPayments} Monate\n` +
          (Math.abs(payment - finalPayment) > 0.01 ? `Schlussrate: ${finalPayment.toFixed(2)} €\n` : '') +
          `Rückzahlungsbetrag: ${actualTotalPaid.toFixed(2)} €\n` +
          `Zinsen gesamt: ${actualTotalInterest.toFixed(2)} €`
        description = `Ratenkredit mit fester Ratenhöhe von ${payment.toFixed(2)} €`
        break

      default:
        setErrorMessage("Ungültige Berechnungsart.")
        return
    }

    onCalculation(description, result)
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
              <SelectItem value="singlePayment">Kredit mit einmaliger Rückzahlung</SelectItem>
              <SelectItem value="installmentWithTerm">Ratenkredit, Vorgabe der Laufzeit</SelectItem>
              <SelectItem value="installmentWithPayment">Ratenkredit, Vorgabe der Ratenhöhe</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label>Kreditbetrag (€)</Label>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Geben Sie den Kreditbetrag ein"
            min="0"
            step="0.01"
          />
        </div>
        <div className="grid gap-2">
          <Label>Zinssatz (% pro Jahr)</Label>
          <Input
            type="number"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            placeholder="Geben Sie den jährlichen Zinssatz ein"
            min="0"
            step="0.01"
          />
        </div>
        {(calculationType === "singlePayment" || calculationType === "installmentWithTerm") && (
          <div className="grid gap-2">
            <Label>Laufzeit (Monate)</Label>
            <Input
              type="number"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Geben Sie die Laufzeit in Monaten ein"
              min="1"
              step="1"
            />
          </div>
        )}
        {calculationType === "installmentWithPayment" && (
          <div className="grid gap-2">
            <Label>Ratenhöhe (€)</Label>
            <Input
              type="number"
              value={installment}
              onChange={(e) => setInstallment(e.target.value)}
              placeholder="Geben Sie die gewünschte Ratenhöhe ein"
              min="0"
              step="0.01"
            />
          </div>
        )}
        <Button onClick={handleCalculation}>Berechnen</Button>
      </div>
    </div>
  )
}

