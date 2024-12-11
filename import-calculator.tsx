import React, { useState } from "react"
import { motion } from "framer-motion"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, ResponsiveContainer } from "recharts"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChartContainer, ChartTooltip as Tooltip } from "@/components/ui/chart"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"

// Sample duty rates for different countries
const COUNTRY_DUTY_RATES = {
  "United States": 0.025,
  "European Union": 0.03,
  "Canada": 0.02,
  "Japan": 0.035,
  "Australia": 0.028,
}

// Top 69 countries for dropdown
const TOP_COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Argentina", "Australia", "Austria", "Bangladesh", "Belgium", 
  "Brazil", "Bulgaria", "Cambodia", "Canada", "Chile", "China", "Colombia", "Croatia", "Czech Republic", 
  "Denmark", "Egypt", "Finland", "France", "Germany", "Greece", "Hong Kong", "Hungary", "India", 
  "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Japan", "Jordan", "Kazakhstan", "Kenya", 
  "Kuwait", "Malaysia", "Mexico", "Morocco", "Netherlands", "New Zealand", "Nigeria", "Norway", "Pakistan", 
  "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Saudi Arabia", "Singapore", 
  "South Africa", "South Korea", "Spain", "Sweden", "Switzerland", "Taiwan", "Thailand", "Turkey", 
  "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Venezuela", "Vietnam", "Yemen"
]

export default function ImportCalculator() {
  const [formData, setFormData] = useState({
    htsCode: "",
    countryOfOrigin: "",
    quantity: 0,
    unitCost: 0,
    freightCost: "",
  })
  const [results, setResults] = useState<any[]>([])

  const calculateCosts = () => {
    const quantity = formData.quantity
    const unitCost = formData.unitCost
    const freightCost = Number(formData.freightCost)
    const commercialValue = quantity * unitCost

    const newResults = Object.entries(COUNTRY_DUTY_RATES).map(([country, rate]) => {
      const dutyAmount = commercialValue * rate
      const totalCost = commercialValue + dutyAmount + freightCost
      return {
        country,
        dutyAmount: dutyAmount.toFixed(2),
        totalCost: totalCost.toFixed(2),
      }
    })

    setResults(newResults)
  }

  return (
    <div className="min-h-screen text-[#58846A] p-8 font-['Courier_Prime'] flex">

      {/* Left side: Titles */}
      <div 
        className="w-1/2 flex flex-col justify-center items-start pr-8 relative"
        style={{
          backgroundImage: `url("https://hebbkx1anhila5yf.public.blob.vercel-storage.com/MERiCADO%20(5)-1MPQwfBHGi7T1GL2IY9DB7n8kl6nBV.png")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="relative z-10">
          <div className="mb-6">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/MERiCADO__4_-removebg-preview-PbPUCaC9uwLCP6fxKwYmVetWVWXqqa.png"
              alt="MERICADO Logo"
              width={200}
              height={48}
              priority
            />
          </div>
          <h1 className="text-6xl font-bold mb-8">Tariff Calculator</h1>
          <h3 className="text-2xl leading-relaxed">
            Additional tariffs are coming from China. Find the <span className="relative inline-block">
              <span className="relative z-10">quickest</span>
              <span 
                className="absolute inset-x-0 bottom-1 h-3 transform -skew-y-3 rounded-[20px]"
                style={{
                  background: 'linear-gradient(to right, white, #FF802B)',
                }}
              />
            </span> and <span className="relative inline-block">
              <span className="relative z-10">cheapest</span>
              <span 
                className="absolute inset-x-0 bottom-1 h-3 transform -skew-y-3 rounded-[20px]"
                style={{
                  background: 'linear-gradient(to right, white, #FF802B)',
                }}
              />
            </span> country to import your goods from.
          </h3>
        </div>
      </div>

      {/* Right side: Calculator */}
      <div 
        className="w-1/2 relative"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='800' height='800' viewBox='0 0 800 800' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,100 C150,100 150,200 300,200 C450,200 450,100 600,100 C750,100 750,200 900,200 M0,300 C150,300 150,400 300,400 C450,400 450,300 600,300 C750,300 750,400 900,400 M0,500 C150,500 150,600 300,600 C450,600 450,500 600,500 C750,500 750,600 900,600' stroke='%23FF802B' fill='none' stroke-width='2' stroke-opacity='0.2'/%3E%3C/svg%3E")`,
          backgroundSize: '800px 800px',
        }}
      >
        <div className="relative z-10">
          <div className="grid gap-4 mb-4">
            {/* HTS Code + Country of Origin */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-white/10 backdrop-blur-sm border-none">
                <CardContent className="p-4 flex flex-col h-full">
                  <Label htmlFor="htsCode" className="text-[#58846A] text-sm mb-1">
                    HTS Code (10 digits)
                  </Label>
                  <Input
                    id="htsCode"
                    placeholder="Enter HTS Code"
                    value={formData.htsCode}
                    onChange={(e) => setFormData({ ...formData, htsCode: e.target.value })}
                    className="bg-white/5 border-[#58846A]/20 text-[#58846A] placeholder:text-[#58846A]/50 mb-2"
                  />
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-none">
                <CardContent className="p-4 flex flex-col h-full">
                  <Label htmlFor="countryOfOrigin" className="text-[#58846A] text-sm mb-1">
                    Country of Origin (COO)
                  </Label>
                  <Select
                    value={formData.countryOfOrigin}
                    onValueChange={(value) => setFormData({ ...formData, countryOfOrigin: value })}
                  >
                    <SelectTrigger className="bg-white/5 border-[#58846A]/20 text-[#58846A]">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent className="z-50">
                      {TOP_COUNTRIES.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            </div>

            {/* Quantity + Unit Cost */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-white/10 backdrop-blur-sm border-none">
                <CardContent className="p-4 flex flex-col h-full">
                  <Label htmlFor="quantity" className="text-[#58846A] text-sm mb-1">
                    Quantity
                  </Label>
                  <div className="flex flex-col gap-2">
                    <Slider
                      id="quantity"
                      min={0}
                      max={10000}
                      step={1}
                      value={[formData.quantity]}
                      onValueChange={(value) => setFormData({ ...formData, quantity: value[0] })}
                      className="mb-2"
                    />
                    <span className="text-right text-[#58846A]">{formData.quantity}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-none">
                <CardContent className="p-4 flex flex-col h-full">
                  <Label htmlFor="unitCost" className="text-[#58846A] text-sm mb-1">
                    Unit Cost (USD)
                  </Label>
                  <div className="flex flex-col gap-2">
                    <Slider
                      id="unitCost"
                      min={0}
                      max={500}
                      step={0.01}
                      value={[formData.unitCost]}
                      onValueChange={(value) => setFormData({ ...formData, unitCost: value[0] })}
                      className="mb-2"
                    />
                    <span className="text-right text-[#58846A]">${formData.unitCost.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Freight Cost */}
            <Card className="bg-white/10 backdrop-blur-sm border-none">
              <CardContent className="p-4 flex flex-col h-full">
                <Label htmlFor="freightCost" className="text-[#58846A] text-sm mb-1">
                  Base Freight Cost (USD)
                </Label>
                <Input
                  id="freightCost"
                  type="number"
                  placeholder="Enter freight cost"
                  value={formData.freightCost}
                  onChange={(e) => setFormData({ ...formData, freightCost: e.target.value })}
                  className="bg-white/5 border-[#58846A]/20 text-[#58846A] placeholder:text-[#58846A]/50 mb-2"
                />
              </CardContent>
            </Card>
          </div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mb-4"
          >
            <Button
              onClick={calculateCosts}
              className="w-full bg-transparent hover:bg-[#FF802B] text-[#58846A] border-2 border-[#FF802B] hover:border-transparent transition-all duration-300 ease-in-out hover:text-white"
              size="lg"
              style={{
                boxShadow: "0 0 10px #FF802B",
              }}
            >
              Calculate Total Costs
            </Button>
          </motion.div>

          {results.length > 0 && (
            <Card className="bg-white/10 backdrop-blur-sm border-none">
              <CardContent className="p-4">
                <h2 className="text-2xl font-bold mb-6 text-[#58846A]">Cost Comparison by Country</h2>
                <div className="h-[300px] w-full">
                  <ChartContainer
                    config={{
                      totalCost: {
                        label: "Total Cost",
                        color: "hsl(var(--chart-1))",
                      },
                      dutyAmount: {
                        label: "Duty Amount",
                        color: "hsl(var(--chart-2))",
                      },
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={results} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="country" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="totalCost" fill="#FF802B" name="Total Cost" />
                        <Bar dataKey="dutyAmount" fill="#58846A" name="Duty Amount" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

