"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import BasicCalculator from "@/components/basic-calculator"
import ITCalculator from "@/components/it-calculator"
import PercentageCalculator from "@/components/percentage-calculator"
import CreditCalculator from "@/components/credit-calculator"
import GeometryCalculator from "@/components/geometry-calculator"
import MathCalculator from "@/components/math-calculator"
import SchoolCalculator from "@/components/school-calculator"
import type { CalculationHistory, CalculatorMode } from "@/types/calculator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { encryptData, decryptData } from "@/utils/encryption"
import { CopyIcon, CheckIcon, UploadIcon, FileIcon } from "lucide-react"
import ErrorBadge from "@/components/error-badge"

export default function CalculatorApp() {
  const [history, setHistory] = useState<CalculationHistory[]>([])
  const [mode, setMode] = useState<CalculatorMode>("basic")
  const [fontSize, setFontSize] = useState(16)
  const [fontFamily, setFontFamily] = useState("sans-serif")
  const [backgroundColor, setBackgroundColor] = useState("#ffffff")
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [importData, setImportData] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [sideCalculationResult, setSideCalculationResult] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fontOptions = [
    { value: "sans-serif", label: "Sans-Serif" },
    { value: "serif", label: "Serif" },
    { value: "monospace", label: "Monospace" },
  ]

  useEffect(() => {
    const today = new Date().toLocaleDateString("de-DE")
    if (history.length === 0 || history[0].date !== today) {
      setHistory((prev) => [
        {
          input: "",
          result: "",
          type: "system",
          timestamp: new Date(),
          date: today,
        },
        ...prev,
      ])
    }
  }, [history.length, history[0]?.date])

  const handleCalculation = (input: string, result: string) => {
    const today = new Date().toLocaleDateString("de-DE")
    setHistory((prev) => [
      {
        input,
        result,
        type: mode,
        timestamp: new Date(),
        date: today,
      },
      ...prev,
    ])
  }

  const handleSideCalculation = (input: string, result: string) => {
    setSideCalculationResult(result)
    const today = new Date().toLocaleDateString("de-DE")
    setHistory((prev) => [
      {
        input: "Nebenrechnung",
        calculation: input,
        result,
        type: "basic",
        timestamp: new Date(),
        date: today,
      },
      ...prev,
    ])
  }

  const handleClearHistory = () => {
    setHistory([])
  }

  const handleExportHistory = () => {
    const historyString = JSON.stringify(history)
    const encryptedData = encryptData(historyString)
    const blob = new Blob([encryptedData], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "calculator_history_encrypted.json"
    a.click()
  }

  // Helper function to convert timestamp strings to Date objects
  const processImportedHistory = (importedHistory: any[]): CalculationHistory[] => {
    return importedHistory.map((item) => ({
      ...item,
      timestamp: new Date(item.timestamp),
    }))
  }

  const handleImportHistory = () => {
    setErrorMessage("")
    try {
      const decryptedData = decryptData(importData)
      const importedHistory = JSON.parse(decryptedData)

      if (!Array.isArray(importedHistory)) {
        throw new Error("Ungültiges Datenformat")
      }

      const processedHistory = processImportedHistory(importedHistory)
      setHistory((prev) => [...processedHistory, ...prev])
      setImportData("")
    } catch (error) {
      setErrorMessage("Fehler beim Importieren: " + error.message)
    }
  }

  const handleFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage("")
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const decryptedData = decryptData(content)
        const importedHistory = JSON.parse(decryptedData)

        if (!Array.isArray(importedHistory)) {
          throw new Error("Ungültiges Datenformat")
        }

        const processedHistory = processImportedHistory(importedHistory)
        setHistory((prev) => [...processedHistory, ...prev])
        // Reset the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
      } catch (error) {
        setErrorMessage("Fehler beim Importieren: " + error.message)
      }
    }
    reader.onerror = () => {
      setErrorMessage("Fehler beim Lesen der Datei")
    }
    reader.readAsText(file)
  }

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000)
    })
  }

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ backgroundColor, fontSize: `${fontSize}px`, fontFamily }}>
      <div className="mx-auto max-w-6xl space-y-8">
        <h1 className="text-3xl font-bold text-center">Just For You</h1>

        <div className="grid md:grid-cols-4 gap-8">
          {/* Side Calculator (Basic Calculator) */}
          <div className="md:col-span-1">
            <div className="border rounded-lg p-4">
              <h2 className="font-semibold mb-4">Nebenrechner</h2>
              <BasicCalculator onCalculation={handleSideCalculation} />
              {sideCalculationResult && (
                <div className="mt-4 p-2 bg-gray-100 rounded flex justify-between items-center">
                  <span>{sideCalculationResult}</span>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(sideCalculationResult, -1)}>
                    {copiedIndex === -1 ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Main Calculator Modules */}
          <div className="md:col-span-2">
            <Tabs value={mode} onValueChange={(value) => setMode(value as CalculatorMode)} className="w-full">
              <TabsList className="grid w-full grid-cols-7">
                <TabsTrigger value="basic" className="px-2 py-1.5">
                  Basis
                </TabsTrigger>
                <TabsTrigger value="it" className="px-2 py-1.5">
                  IT
                </TabsTrigger>
                <TabsTrigger value="percentage" className="px-2 py-1.5">
                  Prozent
                </TabsTrigger>
                <TabsTrigger value="credit" className="px-2 py-1.5">
                  Kredit
                </TabsTrigger>
                <TabsTrigger value="geometry" className="px-2 py-1.5">
                  Geometrie
                </TabsTrigger>
                <TabsTrigger value="math" className="px-2 py-1.5">
                  Mathe
                </TabsTrigger>
                <TabsTrigger value="school" className="px-2 py-1.5">
                  Schule
                </TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="mt-4">
                <BasicCalculator onCalculation={handleCalculation} />
              </TabsContent>

              <TabsContent value="it" className="mt-4">
                <ITCalculator onCalculation={handleCalculation} />
              </TabsContent>

              <TabsContent value="percentage" className="mt-4">
                <PercentageCalculator onCalculation={handleCalculation} />
              </TabsContent>

              <TabsContent value="credit" className="mt-4">
                <CreditCalculator onCalculation={handleCalculation} />
              </TabsContent>

              <TabsContent value="geometry" className="mt-4">
                <GeometryCalculator onCalculation={handleCalculation} />
              </TabsContent>

              <TabsContent value="math" className="mt-4">
                <MathCalculator onCalculation={handleCalculation} />
              </TabsContent>

              <TabsContent value="school" className="mt-4">
                <SchoolCalculator onCalculation={handleCalculation} />
              </TabsContent>
            </Tabs>
          </div>

          {/* History and Settings */}
          <div className="md:col-span-1 space-y-4">
            <div className="border rounded-lg p-4">
              <h2 className="font-semibold mb-4">Verlauf</h2>
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {history.map((calc, index) => (
                    <div key={index} className="text-sm space-y-1">
                      {calc.type === "system" ? (
                        <div className="font-medium">{calc.input}</div>
                      ) : calc.calculation ? (
                        // For side calculations with separate calculation field
                        <>
                          <div className="font-medium">{calc.input}</div>
                          <div className="text-muted-foreground">{calc.calculation}</div>
                          <div className="text-muted-foreground flex justify-between items-center">
                            <span>{calc.result}</span>
                            <Button variant="ghost" size="sm" onClick={() => copyToClipboard(calc.result, index)}>
                              {copiedIndex === index ? (
                                <CheckIcon className="h-4 w-4" />
                              ) : (
                                <CopyIcon className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {calc.timestamp instanceof Date ? calc.timestamp.toLocaleTimeString() : ""}
                          </div>
                        </>
                      ) : (
                        // For regular calculations
                        <>
                          <div className="font-medium">{calc.input}</div>
                          <div className="text-muted-foreground flex justify-between items-center">
                            <span>{calc.result}</span>
                            <Button variant="ghost" size="sm" onClick={() => copyToClipboard(calc.result, index)}>
                              {copiedIndex === index ? (
                                <CheckIcon className="h-4 w-4" />
                              ) : (
                                <CopyIcon className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {calc.timestamp instanceof Date ? calc.timestamp.toLocaleTimeString() : ""}
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
            <div className="space-y-2">
              <Button onClick={handleClearHistory} variant="outline" className="w-full">
                Verlauf löschen
              </Button>
              <Button onClick={handleExportHistory} variant="outline" className="w-full">
                Verlauf exportieren
              </Button>
            </div>
            <div className="border rounded-lg p-4 space-y-4">
              <h2 className="font-semibold">Verlauf importieren</h2>
              {errorMessage && <ErrorBadge message={errorMessage} />}
              <div className="space-y-2">
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json" className="hidden" />
                <Button onClick={handleFileSelect} variant="outline" className="w-full">
                  <FileIcon className="h-4 w-4 mr-2" />
                  JSON-Datei auswählen
                </Button>
                <div className="text-xs text-muted-foreground text-center">oder</div>
                <Input
                  value={importData}
                  onChange={(e) => setImportData(e.target.value)}
                  placeholder="Verschlüsselte Daten einfügen"
                />
                <Button onClick={handleImportHistory} className="w-full" disabled={!importData}>
                  <UploadIcon className="h-4 w-4 mr-2" />
                  Importieren
                </Button>
              </div>
            </div>
            <div className="border rounded-lg p-4 space-y-4">
              <h2 className="font-semibold">Einstellungen</h2>
              <div className="space-y-2">
                <Label htmlFor="font-size">Schriftgröße</Label>
                <Input
                  id="font-size"
                  type="number"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  min="10"
                  max="24"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="font-family">Schriftart</Label>
                <Select value={fontFamily} onValueChange={setFontFamily}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fontOptions.map((font) => (
                      <SelectItem key={font.value} value={font.value}>
                        {font.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="background-color">Hintergrundfarbe</Label>
                <Input
                  id="background-color"
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}