"use client"

import { useState } from "react"
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

export default function CalculatorApp() {
  const [history, setHistory] = useState<CalculationHistory[]>([])
  const [mode, setMode] = useState<CalculatorMode>("basic")

  const handleCalculation = (input: string, result: string) => {
    setHistory((prev) => [
      {
        input,
        result,
        type: mode,
        timestamp: new Date(),
      },
      ...prev,
    ])
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-2xl space-y-8">
        <h1 className="text-3xl font-bold text-center">Just For You</h1>

        <div className="grid md:grid-cols-3 gap-8">
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

          <div className="border rounded-lg p-4">
            <h2 className="font-semibold mb-4">Verlauf</h2>
            <ScrollArea className="h-[400px]">
              <div className="space-y-4">
                {history.map((calc, index) => (
                  <div key={index} className="text-sm space-y-1">
                    <div className="font-medium">{calc.input}</div>
                    <div className="text-muted-foreground">{calc.result}</div>
                    <div className="text-xs text-muted-foreground">{calc.timestamp.toLocaleTimeString()}</div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  )
}

