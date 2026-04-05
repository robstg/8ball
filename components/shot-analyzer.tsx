"use client"

import { useState } from "react"
import { Slider } from "@/components/ui/slider"
import { Sparkles, RotateCcw } from "lucide-react"

export function ShotAnalyzer() {
  const [angle, setAngle] = useState(45)
  const [power, setPower] = useState(60)
  const [spin, setSpin] = useState(0)
  
  const successRate = Math.min(98, Math.max(45, 85 - Math.abs(spin) * 0.5 + (power > 80 ? -10 : 0) + (angle > 30 && angle < 60 ? 10 : 0)))

  const resetValues = () => {
    setAngle(45)
    setPower(60)
    setSpin(0)
  }

  return (
    <div className="relative h-full flex flex-col min-h-[500px]">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium text-primary uppercase tracking-wider">AI-Powered</span>
          </div>
          <h3 className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl font-bold tracking-tight">
            Shot Analyzer
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Visualize and optimize your next shot
          </p>
        </div>
        <div className="text-right">
          <div className="text-4xl md:text-5xl font-bold text-primary font-[family-name:var(--font-heading)] tabular-nums">
            {Math.round(successRate)}%
          </div>
          <span className="text-xs text-muted-foreground">Success probability</span>
        </div>
      </div>

      {/* Table Visualization */}
      <div className="relative flex-1 min-h-[220px] rounded-xl bg-secondary/30 border border-white/5 overflow-hidden mb-6">
        {/* Grid lines */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="currentColor" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 150" preserveAspectRatio="xMidYMid meet">
          {/* Pockets with glow */}
          {[[10, 10], [150, 5], [290, 10], [10, 140], [150, 145], [290, 140]].map(([cx, cy], i) => (
            <g key={i}>
              <circle cx={cx} cy={cy} r="12" className="fill-background/20" />
              <circle cx={cx} cy={cy} r="7" className="fill-background/80" />
            </g>
          ))}
          
          {/* Trajectory prediction zone */}
          <ellipse 
            cx={80 + Math.cos((angle * Math.PI) / 180) * power * 1.2} 
            cy={100 - Math.sin((angle * Math.PI) / 180) * power * 1.2}
            rx="20"
            ry="15"
            className="fill-primary/5"
          />
          
          {/* Main trajectory line */}
          <line 
            x1="80" 
            y1="100" 
            x2={80 + Math.cos((angle * Math.PI) / 180) * power * 1.5} 
            y2={100 - Math.sin((angle * Math.PI) / 180) * power * 1.5}
            className="stroke-primary" 
            strokeWidth="2" 
            strokeLinecap="round"
            strokeDasharray="8 4"
            style={{ filter: "drop-shadow(0 0 4px rgba(56, 189, 248, 0.4))" }}
          />
          
          {/* Cue ball */}
          <circle cx="80" cy="100" r="10" className="fill-foreground" style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))" }} />
          <circle cx="78" cy="98" r="3" className="fill-white/40" />
          
          {/* Target ball */}
          <circle cx="180" cy="75" r="10" className="fill-primary" style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))" }} />
          <circle cx="178" cy="73" r="3" className="fill-white/30" />
          
          {/* Ghost ball position */}
          <circle 
            cx={80 + Math.cos((angle * Math.PI) / 180) * power * 1.2} 
            cy={100 - Math.sin((angle * Math.PI) / 180) * power * 1.2}
            r="10" 
            className="fill-none stroke-foreground/20" 
            strokeWidth="1.5" 
            strokeDasharray="4 3"
          />
          
          {/* Spin curve indicator */}
          {spin !== 0 && (
            <path 
              d={`M 80 100 Q ${80 + spin * 0.8} ${100 - 40} ${80 + Math.cos((angle * Math.PI) / 180) * 60} ${100 - Math.sin((angle * Math.PI) / 180) * 60}`}
              className="stroke-accent/50 fill-none"
              strokeWidth="1.5"
              strokeDasharray="3 2"
            />
          )}
        </svg>
      </div>

      {/* Controls */}
      <div className="space-y-5">
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground w-14">Angle</span>
          <Slider 
            value={[angle]} 
            onValueChange={([v]) => setAngle(v)} 
            min={0} 
            max={90} 
            step={1}
            className="flex-1"
          />
          <span className="text-sm font-mono w-14 text-right tabular-nums">{angle}°</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground w-14">Power</span>
          <Slider 
            value={[power]} 
            onValueChange={([v]) => setPower(v)} 
            min={10} 
            max={100} 
            step={1}
            className="flex-1"
          />
          <span className="text-sm font-mono w-14 text-right tabular-nums">{power}%</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground w-14">Spin</span>
          <Slider 
            value={[spin]} 
            onValueChange={([v]) => setSpin(v)} 
            min={-50} 
            max={50} 
            step={1}
            className="flex-1"
          />
          <span className="text-sm font-mono w-14 text-right tabular-nums">{spin > 0 ? '+' : ''}{spin}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-6">
        <button className="flex-1 px-6 py-3 rounded-full bg-foreground text-background font-medium hover:bg-foreground/90 transition-colors flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4" />
          Calculate optimal shot
        </button>
        <button 
          onClick={resetValues}
          className="px-4 py-3 rounded-full border border-white/10 hover:bg-white/5 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
