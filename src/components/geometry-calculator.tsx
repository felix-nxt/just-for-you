"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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
  const [base, setBase] = useState("")
  const [height, setHeight] = useState("")

  const calculate = () => {
    if (!base || !height) {
      alert("Bitte geben Sie Grundseite und Höhe ein.")
      return
    }
    const b = Number.parseFloat(base)
    const h = Number.parseFloat(height)
    const area = (b * h) / 2
    onCalculation(`Dreieck mit Grundseite ${b} und Höhe ${h}`, `Fläche: ${area.toFixed(2)}`)
  }

  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label>Grundseite</Label>
        <Input type="number" value={base} onChange={(e) => setBase(e.target.value)} placeholder="Grundseite eingeben" />
      </div>
      <div className="grid gap-2">
        <Label>Höhe</Label>
        <Input type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="Höhe eingeben" />
      </div>
      <Button onClick={calculate}>Berechnen</Button>
    </div>
  )
}

function CircleCalculator({ onCalculation }) {
  const [radius, setRadius] = useState("")

  const calculate = () => {
    if (!radius) {
      alert("Bitte geben Sie den Radius ein.")
      return
    }
    const r = Number.parseFloat(radius)
    const area = Math.PI * r * r
    const circumference = 2 * Math.PI * r
    onCalculation(`Kreis mit Radius ${r}`, `Fläche: ${area.toFixed(2)}, Umfang: ${circumference.toFixed(2)}`)
  }

  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label>Radius</Label>
        <Input type="number" value={radius} onChange={(e) => setRadius(e.target.value)} placeholder="Radius eingeben" />
      </div>
      <Button onClick={calculate}>Berechnen</Button>
    </div>
  )
}

function ParallelogramCalculator({ onCalculation }) {
  const [base, setBase] = useState("")
  const [height, setHeight] = useState("")

  const calculate = () => {
    if (!base || !height) {
      alert("Bitte geben Sie Grundseite und Höhe ein.")
      return
    }
    const b = Number.parseFloat(base)
    const h = Number.parseFloat(height)
    const area = b * h
    onCalculation(`Parallelogramm mit Grundseite ${b} und Höhe ${h}`, `Fläche: ${area.toFixed(2)}`)
  }

  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label>Grundseite</Label>
        <Input type="number" value={base} onChange={(e) => setBase(e.target.value)} placeholder="Grundseite eingeben" />
      </div>
      <div className="grid gap-2">
        <Label>Höhe</Label>
        <Input type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="Höhe eingeben" />
      </div>
      <Button onClick={calculate}>Berechnen</Button>
    </div>
  )
}

