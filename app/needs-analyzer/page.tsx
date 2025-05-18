"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { HelpCircle, Info, Lightbulb, ArrowRight } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { motion } from '@/lib/motion';

export default function NeedsAnalyzer() {
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(25);
  const [annualIncome, setAnnualIncome] = useState(1000000);
  const [age, setAge] = useState('30');
  const [dependents, setDependents] = useState('0');
  const [existingCoverage, setExistingCoverage] = useState('no');
  const [existingInsurance, setExistingInsurance] = useState(0);
  const [activeTab, setActiveTab] = useState('standard');
  const [preExistingConditions, setPreExistingConditions] = useState(false);

  const recommendedCoverage = Math.max(
    annualIncome * 10, 
    parseInt(dependents) * 2000000 + 3000000
  );
  
  const adjustedCoverage = preExistingConditions 
    ? recommendedCoverage * 1.2 
    : recommendedCoverage;
  
  const finalCoverage = existingCoverage === 'yes' 
    ? Math.max(0, adjustedCoverage - existingInsurance)
    : adjustedCoverage;

  const monthlyPremiumEstimate = Math.round((finalCoverage * (0.2 + (parseInt(age) / 100))) / 12000);

  const handleNextStep = () => {
    if (step < 3) {
      setStep(step + 1);
      setProgress(progress + 25);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      setProgress(progress - 25);
    }
  };

  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || (parseInt(value) >= 18 && parseInt(value) <= 80)) {
      setAge(value);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 md:py-16 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Insurance Needs Analyzer</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Answer a few questions to get a personalized insurance recommendation tailored to your specific situation.
          </p>
        </div>

        <Card className="mb-8 border-border/50 shadow-md">
          <CardHeader className="pb-4">
            <CardTitle>Your Insurance Profile</CardTitle>
            <CardDescription>
              We&apos;ll analyze your personal and financial situation to recommend the right coverage.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span>Personal Info</span>
                <span>Financial Details</span>
                <span>Results</span>
              </div>
            </div>

            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="age">Age</Label>
                    <span className="text-sm font-medium">{age} years</span>
                  </div>
                  <Input
                    id="age"
                    type="number"
                    min={18}
                    max={80}
                    value={age}
                    onChange={handleAgeChange}
                    placeholder="Enter your age (18-80)"
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dependents">Number of Dependents</Label>
                  <Select value={dependents} onValueChange={setDependents}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select dependents" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">No dependents</SelectItem>
                      <SelectItem value="1">1 dependent</SelectItem>
                      <SelectItem value="2">2 dependents</SelectItem>
                      <SelectItem value="3">3 dependents</SelectItem>
                      <SelectItem value="4">4+ dependents</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="preExistingConditions">Pre-existing Medical Conditions</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>This includes conditions like diabetes, heart disease, hypertension, etc. that may affect your insurance coverage and premium.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="preExistingConditions" 
                      checked={preExistingConditions}
                      onCheckedChange={setPreExistingConditions}
                    />
                    <Label htmlFor="preExistingConditions">
                      {preExistingConditions ? 'Yes' : 'No'}
                    </Label>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button onClick={handleNextStep}>
                    Next Step
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="annualIncome">Annual Income (₹)</Label>
                    <span className="text-sm font-medium">₹{annualIncome.toLocaleString()}</span>
                  </div>
                  <Input
                    id="annualIncome"
                    type="number"
                    min={300000}
                    max={5000000}
                    value={annualIncome}
                    onChange={(e) => setAnnualIncome(parseInt(e.target.value) || 0)}
                    placeholder="Enter your annual income"
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>₹3L</span>
                    <span>₹50L</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="existingCoverage">Do you have existing life/health insurance?</Label>
                  <RadioGroup
                    id="existingCoverage"
                    value={existingCoverage}
                    onValueChange={setExistingCoverage}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="existing-yes" />
                      <Label htmlFor="existing-yes">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="existing-no" />
                      <Label htmlFor="existing-no">No</Label>
                    </div>
                  </RadioGroup>
                </div>

                {existingCoverage === 'yes' && (
                  <div className="space-y-2">
                    <Label htmlFor="existingInsurance">Existing Coverage Amount (₹)</Label>
                    <Input
                      id="existingInsurance"
                      type="number"
                      value={existingInsurance}
                      onChange={(e) => setExistingInsurance(parseInt(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </div>
                )}

                <div className="pt-4 flex justify-between">
                  <Button variant="outline" onClick={handlePrevStep}>
                    Previous
                  </Button>
                  <Button onClick={handleNextStep}>
                    See Results
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="bg-muted p-4 rounded-md">
                  <div className="flex items-start gap-4">
                    <Info className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Your Recommended Coverage</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Based on your age, income, and family situation, we recommend:
                      </p>
                      <div className="text-3xl font-bold text-primary mb-1">
                        ₹{finalCoverage.toLocaleString()}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Estimated monthly premium: <span className="font-semibold">₹{monthlyPremiumEstimate.toLocaleString()}</span>
                      </p>
                    </div>
                  </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="standard">Standard View</TabsTrigger>
                    <TabsTrigger value="eli5">Explain Like I&apos;m 5</TabsTrigger>
                  </TabsList>
                  <TabsContent value="standard" className="pt-4">
                    <div className="space-y-4">
                      <h3 className="font-semibold">Coverage Explanation</h3>
                      <p className="text-sm text-muted-foreground">
                        Your recommended coverage is based on several factors:
                      </p>
                      <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
                        <li>Income Replacement: 10x your annual income (₹{(annualIncome * 10).toLocaleString()})</li>
                        <li>Family Protection: ₹2,000,000 per dependent</li>
                        {preExistingConditions && (
                          <li>Additional 20% buffer for pre-existing conditions</li>
                        )}
                        {existingCoverage === 'yes' && (
                          <li>Adjusted for your existing coverage (₹{existingInsurance.toLocaleString()})</li>
                        )}
                      </ul>
                    </div>
                  </TabsContent>
                  <TabsContent value="eli5" className="pt-4">
                    <div className="bg-muted/50 p-4 rounded-md border border-border">
                      <div className="flex gap-3">
                        <Lightbulb className="h-6 w-6 text-yellow-500 flex-shrink-0" />
                        <div>
                          <h3 className="font-semibold mb-2">Insurance Explained Simply</h3>
                          <p className="text-sm mb-3">
                            Think of insurance like a big piggy bank that someone else fills up for your family if something happens to you.
                          </p>
                          <p className="text-sm mb-3">
                            We recommend a piggy bank of ₹{finalCoverage.toLocaleString()} because:
                          </p>
                          <ul className="text-sm space-y-2 list-disc pl-5">
                            <li>Your family would need money to replace your income</li>
                            <li>Each person who depends on you needs extra protection</li>
                            {preExistingConditions && (
                              <li>Your health conditions might mean more medical expenses</li>
                            )}
                          </ul>
                          <p className="text-sm mt-3">
                            To keep this piggy bank ready, you&apos;d put in about ₹{monthlyPremiumEstimate.toLocaleString()} each month.
                          </p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="pt-6 flex justify-between">
                  <Button variant="outline" onClick={handlePrevStep}>
                    Previous
                  </Button>
                  <Button>
                    View Recommended Plans
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}