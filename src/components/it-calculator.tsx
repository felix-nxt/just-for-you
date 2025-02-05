"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { convertBinary, calculateDataSize, calculatePixels } from "@/utils/calculations"

interface ITCalculatorProps {
  onCalculation: (input: string, result: string) => void
}

export default function ITCalculator({ onCalculation }: ITCalculatorProps) {
  const [binaryInput, setBinaryInput] = useState("")
  const [fromBase, setFromBase] = useState("10")
  const [toBase, setToBase] = useState("2")

  const [dataSize, setDataSize] = useState("")
  const [fromUnit, setFromUnit] = useState("B")
  const [toUnit, setToUnit] = useState("KB")

  const [width, setWidth] = useState("")
  const [height, setHeight] = useState("")
  const [colorDepth, setColorDepth] = useState("24")

  const handleBaseConversion = () => {
    if (!binaryInput) {
      alert("Bitte geben Sie eine Zahl ein.")
      return
    }
    const result = convertBinary(binaryInput, Number.parseInt(fromBase), Number.parseInt(toBase))
    onCalculation(`Konvertiere ${binaryInput} von Basis ${fromBase} zu Basis ${toBase}`, result)
  }

  const handleDataSizeConversion = () => {
    if (!dataSize) {
      alert("Bitte geben Sie eine Größe ein.")
      return
    }
    const result = calculateDataSize(Number.parseFloat(dataSize), fromUnit, toUnit).toString()
    onCalculation(`Konvertiere ${dataSize}${fromUnit} zu ${toUnit}`, `${result}${toUnit}`)
  }

  const handlePixelCalculation = () => {
    if (!width || !height) {
      alert("Bitte geben Sie Breite und Höhe ein.")
      return
    }
    const result = calculatePixels(
      Number.parseInt(width),
      Number.parseInt(height),
      Number.parseInt(colorDepth),
    ).toString()
    onCalculation(`Berechne Größe für ${width}×${height} Pixel bei ${colorDepth} Bit`, `${result} Bit`)
  }

  return (
    <Tabs defaultValue="conversion" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="conversion">Zahlensysteme</TabsTrigger>
        <TabsTrigger value="data-size">Datengrößen</TabsTrigger>
        <TabsTrigger value="pixels">Pixel</TabsTrigger>
      </TabsList>

      <TabsContent value="conversion" className="space-y-4">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label>Zahl</Label>
            <Input value={binaryInput} onChange={(e) => setBinaryInput(e.target.value)} placeholder="Zahl eingeben" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Von Basis</Label>
              <Select value={fromBase} onValueChange={setFromBase}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">Binär (2)</SelectItem>
                  <SelectItem value="8">Oktal (8)</SelectItem>
                  <SelectItem value="10">Dezimal (10)</SelectItem>
                  <SelectItem value="16">Hexadezimal (16)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Zu Basis</Label>
              <Select value={toBase} onValueChange={setToBase}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">Binär (2)</SelectItem>
                  <SelectItem value="8">Oktal (8)</SelectItem>
                  <SelectItem value="10">Dezimal (10)</SelectItem>
                  <SelectItem value="16">Hexadezimal (16)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={handleBaseConversion}>Konvertieren</Button>
        </div>
      </TabsContent>

      <TabsContent value="data-size" className="space-y-4">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label>Größe</Label>
            <Input
              type="number"
              value={dataSize}
              onChange={(e) => setDataSize(e.target.value)}
              placeholder="Größe eingeben"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Von Einheit</Label>
              <Select value={fromUnit} onValueChange={setFromUnit}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="B">Bytes (B)</SelectItem>
                  <SelectItem value="KB">Kilobytes (KB)</SelectItem>
                  <SelectItem value="MB">Megabytes (MB)</SelectItem>
                  <SelectItem value="GB">Gigabytes (GB)</SelectItem>
                  <SelectItem value="TB">Terabytes (TB)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Zu Einheit</Label>
              <Select value={toUnit} onValueChange={setToUnit}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="B">Bytes (B)</SelectItem>
                  <SelectItem value="KB">Kilobytes (KB)</SelectItem>
                  <SelectItem value="MB">Megabytes (MB)</SelectItem>
                  <SelectItem value="GB">Gigabytes (GB)</SelectItem>
                  <SelectItem value="TB">Terabytes (TB)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={handleDataSizeConversion}>Konvertieren</Button>
        </div>
      </TabsContent>

      <TabsContent value="pixels" className="space-y-4">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label>Breite (Pixel)</Label>
            <Input
              type="number"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              placeholder="Breite eingeben"
            />
          </div>
          <div className="grid gap-2">
            <Label>Höhe (Pixel)</Label>
            <Input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="Höhe eingeben"
            />
          </div>
          <div className="grid gap-2">
            <Label>Farbtiefe (Bits)</Label>
            <Select value={colorDepth} onValueChange={setColorDepth}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1-Bit (Schwarz & Weiß)</SelectItem>
                <SelectItem value="8">8-Bit (256 Farben)</SelectItem>
                <SelectItem value="16">16-Bit (High Color)</SelectItem>
                <SelectItem value="24">24-Bit (True Color)</SelectItem>
                <SelectItem value="32">32-Bit (True Color + Alpha)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handlePixelCalculation}>Berechnen</Button>
        </div>
      </TabsContent>
    </Tabs>
  )
}

