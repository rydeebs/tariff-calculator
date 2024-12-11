"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import {
BarChart,
Bar,
XAxis,
YAxis,
CartesianGrid,
Tooltip as ChartTooltip,
ResponsiveContainer
} from "recharts"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChartContainer, ChartTooltip as Tooltip } from "@/components/ui/chart"
import { Slider } from "@/components/ui/slider"
import {
Select,
SelectContent,
SelectItem,
SelectTrigger,
SelectValue
} from "@/components/ui/select"
import Image from "next/image"
import { ArrowRight } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid';

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
  dutyRate: "",
  countryOfOrigin: "",
  posPerYear: "",
  quantity: 0,
  unitCost: 0,
  freightCost: "0",
  email: ""
})
const [results, setResults] = useState<any[]>([])
const [isCalculating, setIsCalculating] = useState(false)

const isFormValid = () => {
  return (
    (formData.htsCode || formData.dutyRate) &&
    formData.countryOfOrigin &&
    formData.posPerYear &&
    formData.quantity > 0 &&
    formData.unitCost > 0 &&
    formData.freightCost &&
    formData.email
  );
};

const handleSubmit = () => {
  if (isFormValid()) {
    calculateCosts();
    setResults([]); // Clear the results
  } else {
    console.log('Please fill in all required fields');
  }
};

const calculateCosts = async () => {
  if (!isFormValid()) {
    console.log('Please fill in all required fields');
    return;
  }
  setIsCalculating(true)
  try {
    const submissionId = uuidv4();
    const submissionData = {
      ...formData,
      submissionId,
      timestamp: new Date().toISOString()
    };

    const response = await fetch('/api/calculate-tariff', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(submissionData),
    })

    if (!response.ok) {
      throw new Error('Failed to calculate tariff')
    }

    const result = await response.json()
    setResults([{ ...result, submissionId }])

    // Send data to Zapier after calculation
    await sendDataToZapier(submissionData, result);
  } catch (error) {
    console.error('Error calculating tariff:', error)
    // You might want to show an error message to the user here
  } finally {
    setIsCalculating(false)
  }
}

const sendDataToZapier = async (submissionData, calculationResults) => {
  // Prepare the data to send to Zapier
  const dataToSend = {
    ...submissionData,
    calculationResults
  };

  console.log('Data to send to Zapier:', dataToSend);

  // TODO: Replace with actual Zapier webhook call
  // const response = await fetch('YOUR_ZAPIER_WEBHOOK_URL', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify(dataToSend),
  // });

  // if (response.ok) {
  //   console.log('Data successfully sent to Zapier');
  // } else {
  //   console.error('Failed to send data to Zapier');
  // }
};

return (
 <div className="min-h-screen text-[#58846A] p-8 font-['Courier_Prime'] flex">
   {/* Left side: Titles */}
   <div 
     className="w-1/2 flex flex-col justify-center items-start relative p-8"
     style={{
       backgroundImage: `url("https://hebbkx1anhila5yf.public.blob.vercel-storage.com/MERiCADO-Dya2w6bTOwkWBKgxtofVBcXbCEFyQ8.svg")`,
       backgroundSize: 'cover',
       backgroundPosition: 'center',
       backgroundRepeat: 'no-repeat',
       height: '100vh'
     }}
   >
     <div>
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
         Additional tariffs are coming from China.
         <br />
         Find the <span className="relative inline-block">
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
   <div className="w-1/2 relative pl-8">
     <div className="relative z-10">
       <div className="grid gap-4 mb-4 text-2xl">
         {/* HTS Code + Duty Rate */}
         <div className="grid grid-cols-5 gap-4 items-center">
           <Card className="col-span-2 bg-white/10 backdrop-blur-sm border-none">
             <CardContent className="p-4 flex flex-col h-full">
               <Label htmlFor="htsCode" className="text-[#58846A] mb-1 text-xl">
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

           <div className="flex items-center justify-center">
             <span className="text-[#58846A] font-bold">-OR-</span>
           </div>

           <Card className="col-span-2 bg-white/10 backdrop-blur-sm border-none">
             <CardContent className="p-4 flex flex-col h-full">
               <Label htmlFor="dutyRate" className="text-[#58846A] mb-1 text-xl">
                 Duty Rate
               </Label>
               <div className="relative">
                 <Input
                   id="dutyRate"
                   placeholder="Enter Duty Rate"
                   value={formData.dutyRate}
                   onChange={(e) => setFormData({ ...formData, dutyRate: e.target.value })}
                   className="bg-white/5 border-[#58846A]/20 text-[#58846A] placeholder:text-[#58846A]/50 mb-2 pr-6"
                 />
                 <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#58846A]">%</span>
               </div>
             </CardContent>
           </Card>
         </div>

         {/* Country of Origin + Number of PO's per Year */}
         <div className="grid grid-cols-2 gap-4">
           <Card className="bg-white/10 backdrop-blur-sm border-none">
             <CardContent className="p-4 flex flex-col h-full">
               <Label htmlFor="countryOfOrigin" className="text-[#58846A] mb-1 text-xl">
                 Country of Origin (COO)
               </Label>
               <Select
                 value={formData.countryOfOrigin}
                 onValueChange={(value) => setFormData({ ...formData, countryOfOrigin: value })}
               >
                 <SelectTrigger className="bg-white/5 border-[#58846A]/20 text-[#58846A]">
                   <SelectValue placeholder="Select country" />
                 </SelectTrigger>
                 <SelectContent className="z-[9999]">
                   {TOP_COUNTRIES.map((country) => (
                     <SelectItem key={country} value={country}>
                       {country}
                     </SelectItem>
                   ))}
                 </SelectContent>
               </Select>
             </CardContent>
           </Card>

           <Card className="bg-white/10 backdrop-blur-sm border-none">
             <CardContent className="p-4 flex flex-col h-full">
               <Label htmlFor="posPerYear" className="text-[#58846A] mb-1 text-xl">
                 Number of PO's (per Year)
               </Label>
               <Input
                 id="posPerYear"
                 type="number"
                 placeholder="Enter number of PO's"
                 value={formData.posPerYear}
                 onChange={(e) => setFormData({ ...formData, posPerYear: e.target.value })}
                 className="bg-white/5 border-[#58846A]/20 text-[#58846A] placeholder:text-[#58846A]/50 mb-2"
               />
             </CardContent>
           </Card>
         </div>

         {/* Quantity + Unit Cost */}
         <div className="grid grid-cols-2 gap-4">
           <Card className="bg-white/10 backdrop-blur-sm border-none">
             <CardContent className="p-4 flex flex-col h-full">
               <Label htmlFor="quantity" className="text-[#58846A] mb-1 text-xl">
                 Number of Units (per PO)
               </Label>
               <Input
                 id="quantity"
                 type="number"
                 placeholder="Enter number of units"
                 value={formData.quantity || ''}
                 onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                 className="bg-white/5 border-[#58846A]/20 text-[#58846A] placeholder:text-[#58846A]/50 mb-2"
               />
             </CardContent>
           </Card>

           <Card className="bg-white/10 backdrop-blur-sm border-none">
             <CardContent className="p-4 flex flex-col h-full">
               <Label htmlFor="unitCost" className="text-[#58846A] mb-1 text-xl">
                 Unit Cost (per PO) (USD)
               </Label>
               <div className="relative">
                 <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#58846A]">$</span>
                 <Input
                   id="unitCost"
                   type="number"
                   step="0.01"
                   placeholder="Enter unit cost"
                   value={formData.unitCost || ''}
                   onChange={(e) => setFormData({ ...formData, unitCost: parseFloat(e.target.value) || 0 })}
                   className="bg-white/5 border-[#58846A]/20 text-[#58846A] placeholder:text-[#58846A]/50 mb-2 pl-6"
                 />
               </div>
             </CardContent>
           </Card>
         </div>

         {/* Estimated Freight Cost */}
         <Card className="bg-white/10 backdrop-blur-sm border-none">
           <CardContent className="p-4 flex flex-col h-full">
             <Label htmlFor="freightCost" className="text-[#58846A] mb-1 text-xl">
               Estimated Freight Cost (per PO)
             </Label>
             <div className="flex flex-col gap-2">
               <Slider
                 id="freightCost"
                 min={0}
                 max={10000}
                 step={1}
                 value={[parseFloat(formData.freightCost) || 0]}
                 onValueChange={(value) => setFormData({ ...formData, freightCost: value[0].toString() })}
                 className="mb-2"
               />
               <span className="text-right text-[#58846A]">${parseFloat(formData.freightCost).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
             </div>
           </CardContent>
         </Card>
       </div>

       <div className="relative">
         <div
           className="absolute inset-0 rounded-lg"
           style={{
             boxShadow: "0 0 10px #FF802B",
             opacity: 0.5,
           }}
         ></div>
         <div className="relative z-10 bg-white/10 backdrop-blur-sm rounded-lg p-4">
           <h2 className="text-2xl font-bold text-center mb-4">Get Tariff Report</h2>
           <div className="flex items-center space-x-2">
             <Input
               type="email"
               placeholder="Enter your email"
               value={formData.email}
               onChange={(e) => setFormData({ ...formData, email: e.target.value })}
               className="flex-grow bg-white/5 border-[#58846A]/20 text-[#58846A] placeholder:text-[#58846A]/50"
             />
             <Button
               size="icon"
               className="bg-[#FF802B] hover:bg-[#FF802B]/80"
               onClick={handleSubmit}
               disabled={!isFormValid()}
             >
               <ArrowRight className="h-4 w-4" />
             </Button>
           </div>
         </div>
       </div>
     </div>
   </div>
 </div>
)
}

