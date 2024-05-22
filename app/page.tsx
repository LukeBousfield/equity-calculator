'use client';

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useState, useEffect, useRef } from "react";

function calculateEquityPercentage(investmentAmount: number, actualValuation: number, valuationCap: number, valuationFloor: number, discountRate: number) {
  // Apply discount rate to the actual valuation
  let discountedValuation = actualValuation * (1 - discountRate / 100);

  // Determine the effective valuation
  let effectiveValuation = Math.min(valuationCap, Math.max(discountedValuation, valuationFloor));

  // Calculate the percentage of the company the investor would receive
  let equityPercentage = (investmentAmount / effectiveValuation) * 100;

  return equityPercentage;
}

const presets: any = {
  'yc': {
    name: 'YCombinator',
    investment: '375,000',
    cap: null,
    floor: null,
    discount: '0',
    fixedInvestment: '125,000',
    fixedStake: '7'
  },
  'pearx': {
    name: 'PearX',
    investment: '500,000',
    cap: '10,000,000',
    floor: null,
    discount: '0',
    fixedInvestment: '0',
    fixedStake: '0'
  },
  'zfellow': {
    name: 'ZFellows',
    investment: '10,000',
    cap: '1,000,000,000',
    floor: null,
    discount: '0',
    fixedInvestment: '0',
    fixedStake: '0'
  },
  'neo': {
    name: 'Neo',
    investment: '600,000',
    cap: null,
    floor: '10,000,000',
    discount: '0',
    fixedInvestment: '0',
    fixedStake: '1.5'
  },
  'techstars': {
    name: 'TechStars',
    investment: '0',
    cap: null,
    floor: null,
    discount: '0',
    fixedInvestment: '20,000',
    fixedStake: '6'
  },
  'none': {
    name: 'None',
    investment: '100,000',
    cap: null,
    floor: null,
    discount: '0',
    fixedInvestment: '0',
    fixedStake: '0'
  }
};

export default function Home() {

  const [sliderValue, setSliderValue] = useState(40);
  const [isCapDisabled, setIsCapDisabled] = useState(true);
  const [isFloorDisabled, setIsFloorDisabled] = useState(true);
  const [investmentStr, setInvestmentStr] = useState('10,000');
  const [capStr, setCapStr] = useState('');
  const [floorStr, setFloorStr] = useState('');
  const [discountStr, setDiscountStr] = useState('0');
  const [preset, setPreset] = useState('none');
  const [fixedInvestmentStr, setFixedInvestmentStr] = useState('0');
  const [fixedStakeStr, setFixedStakeStr] = useState('0');

  const lastPreset = usePrevious(preset);

  function usePrevious(value: any) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  }

  useEffect(() => {
    if (preset !== lastPreset) return;
    setPreset('none');
  }, [investmentStr, isCapDisabled, isFloorDisabled, capStr, floorStr, discountStr, preset, fixedStakeStr]);

  let valuation = Math.round(100000 * Math.pow(100000, sliderValue / 100));
  valuation = Math.round(valuation / 10000) * 10000;
  let valShow = valuation.toLocaleString();

  function parseNum(inputString: string) {
    return parseFloat(inputString.replace(/[^\d.]/g, '')) || 0;
  }

  function applyPreset(preset: any) {
    setIsCapDisabled(preset.cap === null);
    setIsFloorDisabled(preset.floor === null);
    setInvestmentStr(preset.investment);
    if (preset.cap) setCapStr(preset.cap);
    if (preset.floor) setFloorStr(preset.floor);
    setDiscountStr(preset.discount);
    setFixedInvestmentStr(preset.fixedInvestment);
    setFixedStakeStr(preset.fixedStake);
  }

  let investment = parseNum(investmentStr);
  let cap = isCapDisabled ? 1000000000000 : parseNum(capStr);
  let floor = isFloorDisabled ? 0 : parseNum(floorStr);
  let discount = parseNum(discountStr);

  let percent = calculateEquityPercentage(investment, valuation, cap, floor, discount);

  percent = Math.min(percent, 100);

  let fixedInvestment = parseNum(fixedInvestmentStr);
  let fixedStake = parseNum(fixedStakeStr);

  let numDigits = 2;
  if (percent < 0.1) {
    numDigits = 3;
  }
  if (percent < 0.01) {
    numDigits = 4;
  }
  if (percent === 0) {
    numDigits = 0;
  }
  let showBeforePercent = percent.toFixed(numDigits).toLocaleString();

  percent += fixedStake;

  percent = Math.min(percent, 100);
  let numDigits2 = 2;
  if (percent < 0.1) {
    numDigits2 = 3;
  }
  if (percent < 0.01) {
    numDigits2 = 4;
  }
  if (percent === 0) {
    numDigits2 = 0;
  }
  let showPercent = percent.toFixed(numDigits2).toLocaleString();
  let worth = Math.round(percent/100 * valuation).toLocaleString();

  function changePresetSelect(newPreset: string) {
    setPreset(newPreset);
    applyPreset(presets[newPreset]);
  }

  useEffect(() => {
    changePresetSelect('yc');
  }, []);

  return (
    <div className="container flex flex-col items-center justify-center h-screen">

      <h1 className="text-2xl mb-5">Your Ultimate Equity Calculator</h1>

      <div className="flex w-1/2 items-center justify-center">
        <Label className="mr-2">Preset: </Label>
        <Select value={preset} onValueChange={changePresetSelect}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="None" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(presets).map((preset: any, i: number) => (
            <SelectItem key={preset} value={preset}>{presets[preset].name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex w-full py-10">
      <div className="flex flex-col mb-10 w-1/2 items-center">
      <h1 className="font-semibold text-xl mb-2">SAFE Note</h1>
          <div className="flex items-center justify-center my-4">
            <Label className="mr-2">Investment:</Label>
            <Label className="mr-0">$</Label>
            <Input className="input-number mx-2 w-[100px]" size={10} value={investmentStr} onChange={e => setInvestmentStr(e.target.value)} />
        </div>
        <div className="flex items-center justify-center my-4">
            <Label className="mr-2">Valuation cap:</Label>
            <Label className="mr-0">$</Label>
            <Input className="input-number mx-2 w-[100px]" size={10} disabled={isCapDisabled} value={capStr} onChange={e => setCapStr(e.target.value)} />
            <div className="flex items-center">
                <Input className="input-checkbox mr-2" type="checkbox" checked={isCapDisabled} onChange={e => setIsCapDisabled(e.target.checked)} />
                <Label>Uncapped</Label>
            </div>
        </div>
        <div className="flex items-center justify-center my-4">
            <Label className="mr-2">Valuation floor:</Label>
            <Label className="mr-0">$</Label>
            <Input className="input-number mx-2 w-[100px]" size={10} disabled={isFloorDisabled} value={floorStr} onChange={e => setFloorStr(e.target.value)} />
            <div className="flex items-center">
            <Input className="input-checkbox mr-2" type="checkbox" checked={isFloorDisabled} onChange={e => setIsFloorDisabled(e.target.checked)} />
                <Label>None</Label>
            </div>
        </div>
        <div className="flex items-center justify-center my-4">
            <Label className="mr-2">Discount rate:</Label>
            <Input className="input-number mx-2 w-[100px]" type="number" value={discountStr} onChange={e => setDiscountStr(e.target.value)} />
            <span>%</span>
        </div>
      </div>
      <div className="border-l border-gray-300 h-full mx-4"></div>
      <div className="flex flex-col mb-10 w-1/2">
      <h1 className="font-semibold text-xl mb-2 text-center">Fixed-Term</h1>
      <div className="flex flex-col items-center justify-center">
        <div className="flex items-center justify-center my-4">
        <Label className="mr-2">Investment:</Label>
        <Label className="mr-0">$</Label>
        <Input className="input-number mx-2 w-[100px]" size={10} value={fixedInvestmentStr} onChange={e => setFixedInvestmentStr(e.target.value)} />
        </div>
        <div className="flex items-center justify-center my-4">
        <Label className="mr-2">Stake:</Label>
        <Input className="input-number mx-2 w-[100px]" size={10} value={fixedStakeStr} onChange={e => setFixedStakeStr(e.target.value)} />
        <span>%</span>
        </div>
      </div>
      </div>
      </div>

      <div className="flex flex-col items-center justify-center w-screen px-10">
        <Slider value={[sliderValue]} onValueChange={values => setSliderValue(values[0])} />
        <h1 className="my-10 font-semibold text-2xl">${valShow}</h1>
      </div>

      <div className="flex items-center justify-center">
        {(showPercent !== "NaN" && worth !== "NaN" && showPercent !== "Infinity") && (
        <h1>
        At this valuation, the investor would receive <span className="text-teal-600">{showPercent}%</span> of your company, worth <span className="text-teal-600">${worth}.</span>
        {(fixedStake != 0) && (
          <span><br/>This includes <span className="text-teal-600">{showBeforePercent}%</span> from the SAFE note and <span className="text-teal-600">{fixedStakeStr}%</span> from the fixed terms.</span>
        )}
        </h1>
        )}
      </div>
      
    </div>
  );
}
