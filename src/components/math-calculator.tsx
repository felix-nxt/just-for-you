"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface MathCalculatorProps {
  onCalculation: (input: string, result: string) => void
}

export default function MathCalculator({ onCalculation }: MathCalculatorProps) {
  return (
    <Tabs defaultValue="basic" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="basic">Grundfunktionen</TabsTrigger>
        <TabsTrigger value="prime">Primzahlen</TabsTrigger>
        <TabsTrigger value="fractions">Brüche</TabsTrigger>
      </TabsList>

      <TabsContent value="basic" className="space-y-4">
        <BasicMathCalculator onCalculation={onCalculation} />
      </TabsContent>

      <TabsContent value="prime" className="space-y-4">
        <PrimeCalculator onCalculation={onCalculation} />
      </TabsContent>

      <TabsContent value="fractions" className="space-y-4">
        <FractionCalculator onCalculation={onCalculation} />
      </TabsContent>
    </Tabs>
  )
}

function BasicMathCalculator({ onCalculation }) {
  const [number, setNumber] = useState("")

  const calculate = (operation: "sqrt" | "squared" | "factorial") => {
    if (!number) {
      alert("Bitte geben Sie eine Zahl ein.")
      return
    }
    const num = Number.parseFloat(number)
    let result: number
    let description: string

    switch (operation) {
      case "sqrt":
        result = Math.sqrt(num)
        description = `Quadratwurzel von ${num}`
        break
      case "squared":
        result = Math.pow(num, 2)
        description = `${num} zum Quadrat`
        break
      case "factorial":
        result = factorial(num)
        description = `Fakultät von ${num}`
        break
    }

    onCalculation(description, result.toString())
  }

  const factorial = (n: number): number => {
    if (n === 0 || n === 1) return 1
    return n * factorial(n - 1)
  }

  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label>Zahl</Label>
        <Input type="number" value={number} onChange={(e) => setNumber(e.target.value)} placeholder="Zahl eingeben" />
      </div>
      <div className="grid grid-cols-3 gap-2">
        <Button onClick={() => calculate("sqrt")}>√x</Button>
        <Button onClick={() => calculate("squared")}>x²</Button>
        <Button onClick={() => calculate("factorial")}>x!</Button>
      </div>
    </div>
  )
}

function PrimeCalculator({ onCalculation }) {
  const [start, setStart] = useState("")
  const [end, setEnd] = useState("")

  const isPrime = (num: number): boolean => {
    if (num <= 1) return false
    for (let i = 2; i <= Math.sqrt(num); i++) {
      if (num % i === 0) return false
    }
    return true
  }

  const findPrimes = () => {
    if (!start || !end) {
      alert("Bitte geben Sie Start- und Endwert ein.")
      return
    }
    const s = Number.parseInt(start)
    const e = Number.parseInt(end)
    const primes = []

    for (let i = s; i <= e; i++) {
      if (isPrime(i)) primes.push(i)
    }

    onCalculation(`Primzahlen zwischen ${s} und ${e}`, primes.join(", "))
  }

  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label>Start</Label>
        <Input
          type="number"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          placeholder="Startwert eingeben"
        />
      </div>
      <div className="grid gap-2">
        <Label>Ende</Label>
        <Input type="number" value={end} onChange={(e) => setEnd(e.target.value)} placeholder="Endwert eingeben" />
      </div>
      <Button onClick={findPrimes}>Primzahlen finden</Button>
    </div>
  )
}

function FractionCalculator({ onCalculation }) {
  const [numerator, setNumerator] = useState("")
  const [denominator, setDenominator] = useState("")

  const convertToDecimal = () => {
    if (!numerator || !denominator) {
      alert("Bitte geben Sie Zähler und Nenner ein.")
      return
    }
    const num = Number.parseInt(numerator)
    const den = Number.parseInt(denominator)
    const result = num / den
    onCalculation(`${num}/${den} als Dezimalzahl`, result.toString())
  }

  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label>Zähler</Label>
        <Input
          type="number"
          value={numerator}
          onChange={(e) => setNumerator(e.target.value)}
          placeholder="Zähler eingeben"
        />
      </div>
      <div className="grid gap-2">
        <Label>Nenner</Label>
        <Input
          type="number"
          value={denominator}
          onChange={(e) => setDenominator(e.target.value)}
          placeholder="Nenner eingeben"
        />
      </div>
      <Button onClick={convertToDecimal}>In Dezimalzahl umwandeln</Button>
    </div>
  )
}

