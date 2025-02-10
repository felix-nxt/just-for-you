"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ErrorBadge from "./error-badge"

interface GeometryCalculatorProps {
  onCalculation: (input: string, result: string) => void
}

export default function GeometryCalculator({ onCalculation }: GeometryCalculatorProps) {
  return (
    <Tabs defaultValue="triangle" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="triangle">Dreieck</TabsTrigger>
        <TabsTrigger value="circle">Kreis</TabsTrigger>
        <TabsTrigger value="parallelogram">Parallelogramm</TabsTrigger>
      </TabsList>

      <TabsContent value="triangle" className="space-y-4">
        <TriangleCalculator onCalculation={onCalculation} />
      </TabsContent>

      <TabsContent value="circle" className="space-y-4">
        <CircleCalculator onCalculation={onCalculation} />
      </TabsContent>

      <TabsContent value="parallelogram" className="space-y-4">
        <ParallelogramCalculator onCalculation={onCalculation} />
      </TabsContent>
    </Tabs>
  )
}

function TriangleCalculator({ onCalculation }) {
  const [sideA, setSideA] = useState("")
  const [sideB, setSideB] = useState("")
  const [sideC, setSideC] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const calculate = () => {
    setErrorMessage("")
    if (!sideA || !sideB || !sideC) {
      setErrorMessage("Bitte geben Sie alle Seitenlängen ein.")
      return
    }

    const a = Number.parseFloat(sideA)
    const b = Number.parseFloat(sideB)
    const c = Number.parseFloat(sideC)

    if (a <= 0 || b <= 0 || c <= 0) {
      setErrorMessage("Alle Seitenlängen müssen positiv sein.")
      return
    }

    if (a + b <= c || a + c <= b || b + c <= a) {
      setErrorMessage("Die Seitenlängen bilden kein gültiges Dreieck.")
      return
    }

    const perimeter = a + b + c
    const s = perimeter / 2
    const area = Math.sqrt(s * (s - a) * (s - b) * (s - c))

    onCalculation(`Dreieck mit Seiten ${a}, ${b}, ${c}`, `Umfang: ${perimeter.toFixed(2)}, Fläche: ${area.toFixed(2)}`)
  }

  return (
    <div className="grid gap-4">
      {errorMessage && <ErrorBadge message={errorMessage} />}
      <div className="grid gap-2">
        <Label>Seite a</Label>
        <Input
          type="number"
          value={sideA}
          onChange={(e) => setSideA(e.target.value)}
          placeholder="Länge der Seite a"
          min="0"
          step="0.01"
        />
      </div>
      <div className="grid gap-2">
        <Label>Seite b</Label>
        <Input
          type="number"
          value={sideB}
          onChange={(e) => setSideB(e.target.value)}
          placeholder="Länge der Seite b"
          min="0"
          step="0.01"
        />
      </div>
      <div className="grid gap-2">
        <Label>Seite c</Label>
        <Input
          type="number"
          value={sideC}
          onChange={(e) => setSideC(e.target.value)}
          placeholder="Länge der Seite c"
          min="0"
          step="0.01"
        />
      </div>
      <Button onClick={calculate}>Berechnen</Button>
    </div>
  )
}

function CircleCalculator({ onCalculation }) {
  const [radius, setRadius] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const calculate = () => {
    setErrorMessage("")
    if (!radius) {
      setErrorMessage("Bitte geben Sie den Radius ein.")
      return
    }

    const r = Number.parseFloat(radius)

    if (r <= 0) {
      setErrorMessage("Der Radius muss positiv sein.")
      return
    }

    const perimeter = 2 * Math.PI * r
    const area = Math.PI * r * r

    onCalculation(`Kreis mit Radius ${r}`, `Umfang: ${perimeter.toFixed(2)}, Fläche: ${area.toFixed(2)}`)
  }

  return (
    <div className="grid gap-4">
      {errorMessage && <ErrorBadge message={errorMessage} />}
      <div className="grid gap-2">
        <Label>Radius</Label>
        <Input
          type="number"
          value={radius}
          onChange={(e) => setRadius(e.target.value)}
          placeholder="Radius eingeben"
          min="0"
          step="0.01"
        />
      </div>
      <Button onClick={calculate}>Berechnen</Button>
    </div>
  )
}

function ParallelogramCalculator({ onCalculation }) {
  const [base, setBase] = useState("")
  const [height, setHeight] = useState("")
  const [side, setSide] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const calculate = () => {
    setErrorMessage("")
    if (!base || !height || !side) {
      setErrorMessage("Bitte geben Sie Grundseite, Höhe und Seite ein.")
      return
    }

    const b = Number.parseFloat(base)
    const h = Number.parseFloat(height)
    const s = Number.parseFloat(side)

    if (b <= 0 || h <= 0 || s <= 0) {
      setErrorMessage("Alle Werte müssen positiv sein.")
      return
    }

    const perimeter = 2 * (b + s)
    const area = b * h

    onCalculation(
      `Parallelogramm mit Grundseite ${b}, Höhe ${h}, und Seite ${s}`,
      `Umfang: ${perimeter.toFixed(2)}, Fläche: ${area.toFixed(2)}`,
    )
  }

  return (
    <div className="grid gap-4">
      {errorMessage && <ErrorBadge message={errorMessage} />}
      <div className="grid gap-2">
        <Label>Grundseite</Label>
        <Input
          type="number"
          value={base}
          onChange={(e) => setBase(e.target.value)}
          placeholder="Grundseite eingeben"
          min="0"
          step="0.01"
        />
      </div>
      <div className="grid gap-2">
        <Label>Höhe</Label>
        <Input
          type="number"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          placeholder="Höhe eingeben"
          min="0"
          step="0.01"
        />
      </div>
      <div className="grid gap-2">
        <Label>Seite</Label>
        <Input
          type="number"
          value={side}
          onChange={(e) => setSide(e.target.value)}
          placeholder="Seite eingeben"
          min="0"
          step="0.01"
        />
      </div>
      <Button onClick={calculate}>Berechnen</Button>
    </div>
  )
}

