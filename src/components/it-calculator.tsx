"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ErrorBadge from "./error-badge"
import {
  convertBinary,
  calculateDataSize,
  calculateImageSize,
  calculateVideoSize,
  roundToSignificantDigits,
} from "@/utils/calculations"

interface ITCalculatorProps {
  onCalculation: (input: string, result: string) => void
}

export default function ITCalculator({ onCalculation }: ITCalculatorProps) {
  const [numberInput, setNumberInput] = useState("")
  const [fromBase, setFromBase] = useState("10")
  const [toBase, setToBase] = useState("2")
  const [errorMessage, setErrorMessage] = useState("")

  const [dataSize, setDataSize] = useState("")
  const [fromUnit, setFromUnit] = useState("B")
  const [toUnit, setToUnit] = useState("KB")

  const [width, setWidth] = useState("")
  const [height, setHeight] = useState("")
  const [colorDepth, setColorDepth] = useState("24")
  const [frameRate, setFrameRate] = useState("30")
  const [duration, setDuration] = useState("")

  const bases = {
    "2": "Binär (2)",
    "3": "Ternär (3)",
    "8": "Oktal (8)",
    "10": "Dezimal (10)",
    "16": "Hexadezimal (16)",
  }

  const units = ["B", "KB", "MB", "GB", "TB"]

  const handleBaseConversion = () => {
    setErrorMessage("")
    if (!numberInput) {
      setErrorMessage("Bitte geben Sie eine Zahl ein.")
      return
    }

    try {
      const result = convertBinary(numberInput, Number.parseInt(fromBase), Number.parseInt(toBase))
      onCalculation(`Konvertiere ${numberInput} von ${bases[fromBase]} zu ${bases[toBase]}`, result)
    } catch (error) {
      setErrorMessage(error.message)
    }
  }

  const handleDataSizeConversion = () => {
    setErrorMessage("")
    if (!dataSize) {
      setErrorMessage("Bitte geben Sie eine Größe ein.")
      return
    }

    try {
      const size = Number.parseFloat(dataSize)
      if (isNaN(size) || size < 0) {
        throw new Error("Ungültige Datengröße.")
      }
      const result = calculateDataSize(size, fromUnit, toUnit)
      let formattedResult: string
      if (result >= 1 || result === 0) {
        formattedResult = result % 1 === 0 ? result.toString() : result.toFixed(1)
      } else {
        formattedResult = result.toFixed(3).replace(/\.?0+$/, "")
      }
      formattedResult = formattedResult.replace(".", ",")
      onCalculation(`${dataSize} ${fromUnit} zu ${toUnit}`, `${formattedResult} ${toUnit}`)
    } catch (error) {
      setErrorMessage(error.message)
    }
  }

  const handleGraphicsCalculation = () => {
    setErrorMessage("")
    if (!width || !height) {
      setErrorMessage("Bitte geben Sie Breite und Höhe ein.")
      return
    }

    try {
      const w = Number.parseInt(width)
      const h = Number.parseInt(height)
      const cd = Number.parseInt(colorDepth)
      if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) {
        throw new Error("Ungültige Breite oder Höhe.")
      }

      const imageSize = calculateImageSize(w, h, cd)
      const imageSizeMB = roundToSignificantDigits(imageSize / (1024 * 1024), 3)

      let result = `Bildgröße: ${imageSizeMB} MB`

      if (frameRate && duration) {
        const fr = Number.parseInt(frameRate)
        const dur = Number.parseInt(duration)
        if (!isNaN(fr) && !isNaN(dur) && fr > 0 && dur > 0) {
          const videoSize = calculateVideoSize(w, h, cd, fr, dur)
          const videoSizeMB = roundToSignificantDigits(videoSize / (1024 * 1024), 3)
          result += `\nVideogröße: ${videoSizeMB} MB`
        }
      }

      onCalculation(`Berechne Grafikspeicher für ${w}x${h} Pixel, ${cd} Bit Farbtiefe`, result)
    } catch (error) {
      setErrorMessage(error.message)
    }
  }

  return (
    <Tabs defaultValue="conversion" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="conversion">Zahlensysteme</TabsTrigger>
        <TabsTrigger value="data-size">Datengrößen</TabsTrigger>
        <TabsTrigger value="graphics">Grafikspeicher</TabsTrigger>
      </TabsList>

      {errorMessage && <ErrorBadge message={errorMessage} />}

      <TabsContent value="conversion" className="space-y-4">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label>Zahl</Label>
            <Input
              value={numberInput}
              onChange={(e) => {
                const value = e.target.value
                if (fromBase === "10") {
                  // Allow negative numbers for decimal
                  setNumberInput(value.replace(/[^-0-9]/g, ""))
                } else {
                  // Remove any non-alphanumeric characters
                  setNumberInput(value.replace(/[^a-fA-F0-9]/g, ""))
                }
              }}
              placeholder="Zahl eingeben"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Von Basis</Label>
              <Select value={fromBase} onValueChange={setFromBase}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(bases).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
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
                  {Object.entries(bases).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
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
                  {units.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
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
                  {units.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={handleDataSizeConversion}>Konvertieren</Button>
        </div>
      </TabsContent>

      <TabsContent value="graphics" className="space-y-4">
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
          <div className="grid gap-2">
            <Label>Bildrate (FPS) - Optional für Video</Label>
            <Input
              type="number"
              value={frameRate}
              onChange={(e) => setFrameRate(e.target.value)}
              placeholder="Bildrate eingeben"
            />
          </div>
          <div className="grid gap-2">
            <Label>Dauer (Sekunden) - Optional für Video</Label>
            <Input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="Dauer eingeben"
            />
          </div>
          <Button onClick={handleGraphicsCalculation}>Berechnen</Button>
        </div>
      </TabsContent>
    </Tabs>
  )
}

