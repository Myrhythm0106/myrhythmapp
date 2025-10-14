import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Brain, Zap, Target, Heart } from 'lucide-react';

export function ColorSystemBible() {
  const colorSystem = {
    primary: {
      name: "Empowerment Gradient",
      description: "Vibrant brand gradient - Headers, navigation, empowerment moments",
      gradient: "from-neural-purple-600 via-neural-blue-500 to-brand-orange-600",
      accentColor: "clarity-teal-500",
      accentPosition: "top-right",
      usage: ["Hero Headers & Titles", "Navigation Active States", "Empowerment Moments", "Transformation Features"],
      hsl: {
        purple: "270° 88% 52%",
        blue: "220° 88% 56%", 
        orange: "25° 88% 52%"
      },
      saturation: "85-88% (Vibrant empowerment)",
      icon: Sparkles,
      preview: [
        { name: "Neural Purple 600", className: "bg-gradient-to-r from-neural-purple-600 to-neural-purple-700" },
        { name: "Neural Blue 500", className: "bg-gradient-to-r from-neural-blue-500 to-neural-blue-600" },
        { name: "Brand Orange 600", className: "bg-gradient-to-r from-brand-orange-600 to-brand-orange-700" }
      ]
    },
    teal: {
      name: "Cognitive Clarity - Teal",
      description: "Mental focus, clarity, and cognitive wellness",
      gradient: "from-clarity-teal-500 to-brain-health-500",
      accentColor: "memory-emerald-500",
      accentPosition: "bottom-left",
      usage: ["Focus States", "Cognitive Features", "Mental Clarity", "Navigation Icons", "Success with Emerald"],
      hsl: {
        primary: "180° 75% 52%",
        light: "180° 75% 75%",
        dark: "180° 75% 42%"
      },
      saturation: "75% (Vibrant clarity)",
      icon: Brain,
      preview: [
        { name: "Clarity Teal 500", className: "bg-gradient-to-r from-clarity-teal-500 to-clarity-teal-600" },
        { name: "Brain Health 500", className: "bg-gradient-to-r from-brain-health-500 to-brain-health-600" },
        { name: "Teal 400", className: "bg-gradient-to-r from-clarity-teal-400 to-clarity-teal-500" }
      ]
    },
    accent: {
      name: "Brain Health Spectrum - Emerald",
      description: "Growth, healing, memory retention, and success",
      gradient: "from-memory-emerald-500 via-clarity-teal-500 to-brain-health-500",
      accentColor: "brand-orange-600",
      accentPosition: "bottom-left",
      usage: ["Success States", "Health Metrics", "Memory Features", "Healing Progress", "Achievement Badges"],
      hsl: {
        emerald: "160° 52% 48%",
        clarityTeal: "180° 75% 52%",
        brainHealth: "173° 75% 52%"
      },
      saturation: "52-75% (Natural wellness)",
      icon: Heart,
      preview: [
        { name: "Memory Emerald 500", className: "bg-gradient-to-r from-memory-emerald-500 to-memory-emerald-600" },
        { name: "Clarity Teal 500", className: "bg-gradient-to-r from-clarity-teal-500 to-clarity-teal-600" },
        { name: "Brain Health 500", className: "bg-gradient-to-r from-brain-health-500 to-brain-health-600" }
      ]
    },
    action: {
      name: "Burnt Orange - Primary Action",
      description: "Premium action trigger - Primary CTAs, critical actions",
      gradient: "from-brand-orange-500 to-brand-orange-600",
      accentColor: "neural-purple-600",
      accentPosition: "top-left",
      usage: ["Primary CTAs", "Submit Buttons", "Start Actions", "Active States"],
      hsl: {
        primary: "25° 88% 58%",
        hover: "25° 88% 52%"
      },
      saturation: "88% (Bold action)",
      icon: Zap,
      preview: [
        { name: "Orange 500", className: "bg-gradient-to-r from-brand-orange-500 to-brand-orange-600" },
        { name: "Orange 600", className: "bg-gradient-to-r from-brand-orange-600 to-brand-orange-700" }
      ]
    },
    blue: {
      name: "Neural Blue - Trust & Structure",
      description: "Trust, stability, and core navigation",
      gradient: "from-neural-blue-500 to-neural-blue-600",
      accentColor: "neural-purple-600",
      accentPosition: "top-right",
      usage: ["Navigation", "Structural Elements", "Informational Content", "Trust Indicators"],
      hsl: {
        primary: "220° 88% 56%",
        light: "220° 88% 75%",
        dark: "220° 88% 46%"
      },
      saturation: "88% (Strong trust)",
      icon: Target,
      preview: [
        { name: "Neural Blue 500", className: "bg-gradient-to-r from-neural-blue-500 to-neural-blue-600" },
        { name: "Neural Blue 600", className: "bg-gradient-to-r from-neural-blue-600 to-neural-blue-700" },
        { name: "Neural Blue 400", className: "bg-gradient-to-r from-neural-blue-400 to-neural-blue-500" }
      ]
    },
    neutrals: {
      name: "Warm-to-Cool Grays",
      description: "Sophisticated backgrounds with subtle gradients",
      gradient: "from-slate-50 to-gray-100",
      accentColor: "neural-purple-600",
      accentPosition: "bottom-right",
      usage: ["Backgrounds", "Body Text", "Borders", "Subtle Accents"],
      hsl: {
        warm: "30° 10% 97%",
        neutral: "0° 0% 96%",
        cool: "210° 12% 95%"
      },
      saturation: "0-12% (Clinical minimalism)",
      icon: Target,
      preview: [
        { name: "Warm Gray", className: "bg-gradient-to-r from-slate-50 to-slate-100" },
        { name: "Neutral Gray", className: "bg-gradient-to-r from-gray-50 to-gray-100" },
        { name: "Cool Gray", className: "bg-gradient-to-r from-slate-100 to-slate-200" }
      ]
    }
  };

  const gradientFlows = [
    {
      name: "Empowerment Hero",
      description: "For hero sections and major empowerment headers",
      className: "bg-gradient-to-r from-neural-purple-600 via-neural-blue-500 to-brand-orange-600 text-white",
      code: "from-neural-purple-600 via-neural-blue-500 to-brand-orange-600"
    },
    {
      name: "Success Flow",
      description: "For progress bars and success metrics",
      className: "bg-gradient-to-r from-memory-emerald-500 via-clarity-teal-500 to-brain-health-500 text-white",
      code: "from-memory-emerald-500 via-clarity-teal-500 to-brain-health-500"
    },
    {
      name: "Action Trigger",
      description: "Primary CTAs with bold orange",
      className: "bg-gradient-to-r from-brand-orange-500 to-brand-orange-600 text-white",
      code: "from-brand-orange-500 to-brand-orange-600"
    },
    {
      name: "Cognitive Gradient",
      description: "Teal-based cognitive clarity",
      className: "bg-gradient-to-r from-clarity-teal-500 to-brain-health-500 text-white",
      code: "from-clarity-teal-500 to-brain-health-500"
    },
    {
      name: "Empowerment Blend",
      description: "Purple to blue empowerment",
      className: "bg-gradient-to-r from-neural-purple-600 to-neural-blue-600 text-white",
      code: "from-neural-purple-600 to-neural-blue-600"
    },
    {
      name: "Subtle Background",
      description: "Page backgrounds with subtle depth",
      className: "bg-gradient-to-br from-neural-purple-50/30 via-neural-blue-50/25 to-clarity-teal-50/30",
      code: "from-neural-purple-50/30 via-neural-blue-50/25 to-clarity-teal-50/30"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-neural-purple-600 via-neural-blue-500 to-brand-orange-600 bg-clip-text text-transparent">
            MyRhythm Color System
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            5 core colors that inspire transformation and cognitive empowerment: Teal, Emerald, Orange, Blue, Purple
          </p>
          <div className="flex items-center justify-center gap-3">
            <Badge variant="outline" className="bg-white/50 backdrop-blur-sm">
              5-Color Palette
            </Badge>
            <Badge variant="outline" className="bg-white/50 backdrop-blur-sm">
              Brain-Health Focused
            </Badge>
            <Badge variant="outline" className="bg-white/50 backdrop-blur-sm">
              Apple/Google Standard
            </Badge>
          </div>
        </div>

        {/* Color Families */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(colorSystem).map(([key, family]) => {
            const IconComponent = family.icon;
            const accentPositionClasses = {
              'top-right': 'top-4 right-4',
              'top-left': 'top-4 left-4',
              'bottom-right': 'bottom-4 right-4',
              'bottom-left': 'bottom-4 left-4'
            };
            
            return (
              <Card key={key} className="relative p-6 bg-white/90 backdrop-blur-sm border-2 border-slate-200/60 shadow-lg hover:shadow-2xl transition-all duration-500 group overflow-hidden">
                {/* Accent Splash */}
                <div className={`absolute ${accentPositionClasses[family.accentPosition]} w-20 h-20 bg-${family.accentColor} rounded-full opacity-10 blur-2xl group-hover:opacity-20 group-hover:scale-150 transition-all duration-700`}></div>
                
                {/* Gradient Border Glow */}
                <div className={`absolute inset-0 bg-gradient-to-br ${family.gradient} opacity-0 group-hover:opacity-5 transition-all duration-500 rounded-lg`}></div>
                
                <div className="relative space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${family.gradient} flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300`}>
                          <IconComponent className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800 group-hover:text-slate-900 transition-colors">{family.name}</h3>
                      </div>
                      <p className="text-sm text-slate-600">{family.description}</p>
                    </div>
                  </div>

                  {/* HSL Values */}
                  <div className="bg-slate-50/80 backdrop-blur-sm rounded-lg p-4 border border-slate-200 group-hover:border-slate-300 transition-colors">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      HSL Values
                    </p>
                    <div className="space-y-1">
                      {Object.entries(family.hsl).map(([colorName, value]) => (
                        <div key={colorName} className="flex justify-between text-sm">
                          <span className="font-medium text-slate-700 capitalize">{colorName}:</span>
                          <code className="text-xs bg-white px-2 py-1 rounded border border-slate-300 font-mono">{value}</code>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-slate-600 mt-3 font-medium">
                      Saturation: {family.saturation}
                    </p>
                  </div>

                  {/* Color Previews */}
                  <div className="space-y-2">
                    {family.preview.map((color, idx) => (
                      <div key={idx} className={`h-14 rounded-lg ${color.className} flex items-center justify-center text-white font-semibold shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer`}>
                        {color.name}
                      </div>
                    ))}
                  </div>

                  {/* Usage */}
                  <div className="bg-slate-50/80 backdrop-blur-sm rounded-lg p-4 border border-slate-200 group-hover:border-slate-300 transition-colors">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      Usage
                    </p>
                    <ul className="space-y-1">
                      {family.usage.map((use, idx) => (
                        <li key={idx} className="text-sm text-slate-700 flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full bg-${family.accentColor}`}></span>
                          {use}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Gradient Flows */}
        <Card className="p-8 bg-white/80 backdrop-blur-sm border-2 border-slate-200/60 shadow-lg">
          <h2 className="text-3xl font-bold text-slate-800 mb-6">Gradient Flow Examples</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {gradientFlows.map((flow, idx) => (
              <div key={idx} className="space-y-3 group">
                <div className={`h-24 rounded-xl ${flow.className} flex items-center justify-center font-bold text-lg shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer relative overflow-hidden`}>
                  <span className="relative z-10">{flow.name}</span>
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-700">{flow.description}</p>
                  <code className="text-xs bg-slate-100 px-3 py-2 rounded border border-slate-300 block font-mono hover:bg-slate-200 transition-colors">
                    {flow.code}
                  </code>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Color Philosophy */}
        <Card className="p-8 bg-gradient-to-br from-white via-slate-50/50 to-white backdrop-blur-sm border-2 border-slate-200/60 shadow-lg">
          <h2 className="text-3xl font-bold text-slate-800 mb-6">Color Philosophy: Clarity Through Simplicity</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Before: Too Many Colors */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-red-700 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-600"></span>
                Before: Too Complex
              </h3>
              <div className="space-y-3 bg-white/80 rounded-lg p-5 border border-slate-200">
                <p className="text-sm text-slate-600">❌ 7+ colors (magenta, indigo, beacon)</p>
                <p className="text-sm text-slate-600">❌ Inconsistent usage across components</p>
                <p className="text-sm text-slate-600">❌ Overwhelming for brain injury users</p>
                <p className="text-sm text-slate-600">❌ No clear semantic meaning</p>
              </div>
            </div>

            {/* After: 5-Color System */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-green-700 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-600"></span>
                After: Clear & Focused
              </h3>
              <div className="space-y-3 bg-white/80 rounded-lg p-5 border border-slate-200">
                <p className="text-sm text-slate-600">✅ 5 core colors with clear purposes</p>
                <p className="text-sm text-slate-600">✅ Consistent semantic usage</p>
                <p className="text-sm text-slate-600">✅ Brain-friendly, not overwhelming</p>
                <p className="text-sm text-slate-600">✅ Apple/Google design standard</p>
              </div>
            </div>
          </div>

          <div className="mt-8 p-6 bg-gradient-to-r from-neural-purple-50 via-neural-blue-50 to-clarity-teal-50 rounded-lg border border-clarity-teal-200">
            <p className="text-lg text-slate-700 font-medium mb-4">
              💡 <strong>Design Principle:</strong> Clarity Through Simplicity
            </p>
            <p className="text-slate-600">
              By limiting to 5 colors, we create a cohesive, predictable interface that doesn't overwhelm users recovering from brain injuries. 
              Each color has a clear semantic meaning: <em>Teal = Clarity, Emerald = Success, Orange = Action, Blue = Trust, Purple = Empowerment.</em>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}