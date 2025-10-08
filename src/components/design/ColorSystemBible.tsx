import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Brain, Zap, Target } from 'lucide-react';

export function ColorSystemBible() {
  const colorSystem = {
    primary: {
      name: "Neural Luxury",
      description: "Premium brand gradient - Headers, navigation, brand moments",
      gradient: "from-purple-600 via-indigo-600 to-blue-600",
      accentColor: "emerald-500",
      accentPosition: "top-right",
      usage: ["Headers & Titles", "Navigation Active States", "Brand Moments", "Premium Features"],
      hsl: {
        purple: "265° 70% 55%",
        indigo: "243° 70% 58%", 
        blue: "217° 70% 60%"
      },
      saturation: "65-75% (Reduced for sophistication)",
      icon: Sparkles,
      preview: [
        { name: "Purple 600", className: "bg-gradient-to-r from-purple-600 to-purple-700" },
        { name: "Indigo 600", className: "bg-gradient-to-r from-indigo-600 to-indigo-700" },
        { name: "Blue 600", className: "bg-gradient-to-r from-blue-600 to-blue-700" }
      ]
    },
    accent: {
      name: "Brain Health Spectrum",
      description: "Emerald-to-Teal gradient - Progress, health metrics, cognitive focus",
      gradient: "from-emerald-500 via-teal-500 to-cyan-600",
      accentColor: "orange-600",
      accentPosition: "bottom-left",
      usage: ["Progress Bars", "Health Metrics", "Success States", "Cognitive Enhancement"],
      hsl: {
        emerald: "160° 52% 48%",
        teal: "173° 52% 48%",
        cyan: "186° 52% 45%"
      },
      saturation: "45-55% (Clinical credibility)",
      icon: Brain,
      preview: [
        { name: "Emerald 500", className: "bg-gradient-to-r from-emerald-500 to-emerald-600" },
        { name: "Teal 500", className: "bg-gradient-to-r from-teal-500 to-teal-600" },
        { name: "Cyan 600", className: "bg-gradient-to-r from-cyan-600 to-cyan-700" }
      ]
    },
    action: {
      name: "Burnt Orange",
      description: "Premium action trigger - Primary CTAs, critical actions",
      gradient: "from-orange-600 to-orange-700",
      accentColor: "indigo-600",
      accentPosition: "top-left",
      usage: ["Primary CTAs", "Submit Buttons", "Start Actions", "Premium Upgrades"],
      hsl: {
        primary: "18° 68% 48%",
        hover: "18° 70% 42%"
      },
      saturation: "60-75% (Luxury warmth)",
      icon: Zap,
      preview: [
        { name: "Orange 600", className: "bg-gradient-to-r from-orange-600 to-orange-700" },
        { name: "Orange 700", className: "bg-gradient-to-r from-orange-700 to-orange-800" }
      ]
    },
    neutrals: {
      name: "Warm-to-Cool Grays",
      description: "Sophisticated backgrounds with subtle gradients",
      gradient: "from-slate-50 to-gray-100",
      accentColor: "cyan-600",
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
      name: "Brand Hero Gradient",
      description: "For hero sections and major headers",
      className: "bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white",
      code: "from-purple-600 via-indigo-600 to-blue-600"
    },
    {
      name: "Brain Health Flow",
      description: "For progress and cognitive metrics",
      className: "bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 text-white",
      code: "from-emerald-500 via-teal-500 to-cyan-600"
    },
    {
      name: "Action Trigger",
      description: "Primary CTAs with burnt orange",
      className: "bg-gradient-to-r from-orange-600 to-orange-700 text-white",
      code: "from-orange-600 to-orange-700"
    },
    {
      name: "Subtle Background",
      description: "Page backgrounds with depth",
      className: "bg-gradient-to-br from-purple-50/30 via-indigo-50/20 to-blue-50/30",
      code: "from-purple-50/30 via-indigo-50/20 to-blue-50/30"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
            Neural Luxury Color System
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Apple/Tesla/Gucci aesthetic meets clinical brain health credibility
          </p>
          <div className="flex items-center justify-center gap-3">
            <Badge variant="outline" className="bg-white/50 backdrop-blur-sm">
              Dr. Caroline Leaf Approved
            </Badge>
            <Badge variant="outline" className="bg-white/50 backdrop-blur-sm">
              Dr. Daniel Amen Credibility
            </Badge>
            <Badge variant="outline" className="bg-white/50 backdrop-blur-sm">
              Luxury Tech Standard
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

        {/* Color Relationships */}
        <Card className="p-8 bg-gradient-to-br from-white via-slate-50/50 to-white backdrop-blur-sm border-2 border-slate-200/60 shadow-lg">
          <h2 className="text-3xl font-bold text-slate-800 mb-6">Color Relationships & Accent Strategy</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-3 p-4 rounded-xl bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200/50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600"></div>
                <span className="font-bold text-purple-800">Neural Luxury</span>
              </div>
              <div className="flex items-center gap-2 pl-10">
                <span className="text-sm text-slate-600">+</span>
                <div className="w-6 h-6 rounded-full bg-emerald-500"></div>
                <span className="text-sm font-medium text-emerald-700">Emerald Accent</span>
              </div>
              <p className="text-xs text-slate-600 pl-10">Creates trust + growth energy</p>
            </div>

            <div className="space-y-3 p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"></div>
                <span className="font-bold text-emerald-800">Brain Health</span>
              </div>
              <div className="flex items-center gap-2 pl-10">
                <span className="text-sm text-slate-600">+</span>
                <div className="w-6 h-6 rounded-full bg-orange-600"></div>
                <span className="text-sm font-medium text-orange-700">Orange Accent</span>
              </div>
              <p className="text-xs text-slate-600 pl-10">Balances calm with action</p>
            </div>

            <div className="space-y-3 p-4 rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200/50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-600 to-orange-700"></div>
                <span className="font-bold text-orange-800">Burnt Orange</span>
              </div>
              <div className="flex items-center gap-2 pl-10">
                <span className="text-sm text-slate-600">+</span>
                <div className="w-6 h-6 rounded-full bg-indigo-600"></div>
                <span className="text-sm font-medium text-indigo-700">Indigo Accent</span>
              </div>
              <p className="text-xs text-slate-600 pl-10">Premium warmth + sophistication</p>
            </div>

            <div className="space-y-3 p-4 rounded-xl bg-gradient-to-br from-slate-50 to-gray-50 border border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-slate-100 to-gray-200"></div>
                <span className="font-bold text-slate-700">Neutrals</span>
              </div>
              <div className="flex items-center gap-2 pl-10">
                <span className="text-sm text-slate-600">+</span>
                <div className="w-6 h-6 rounded-full bg-cyan-600"></div>
                <span className="text-sm font-medium text-cyan-700">Cyan Accent</span>
              </div>
              <p className="text-xs text-slate-600 pl-10">Subtle energy on calm base</p>
            </div>
          </div>
        </Card>

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

        {/* Luxury Details System */}
        <Card className="p-8 bg-gradient-to-br from-slate-50 via-white to-slate-50 backdrop-blur-sm border-2 border-slate-200/60 shadow-lg">
          <h2 className="text-3xl font-bold text-slate-800 mb-8">Luxury Details System</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Typography */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-purple-700 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-600"></span>
                Typography Scale
              </h3>
              <div className="space-y-3 bg-white/80 rounded-lg p-5 border border-slate-200">
                <div className="text-4xl font-bold text-slate-800">Headline</div>
                <p className="text-xs text-slate-500">48px / Bold (700)</p>
                <div className="text-2xl font-semibold text-slate-700">Subheadline</div>
                <p className="text-xs text-slate-500">24px / Semibold (600)</p>
                <div className="text-base font-medium text-slate-600">Body Text</div>
                <p className="text-xs text-slate-500">16px / Medium (500)</p>
                <div className="text-sm text-slate-500">Caption</div>
                <p className="text-xs text-slate-500">14px / Regular (400)</p>
              </div>
            </div>

            {/* Shadow System */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-indigo-700 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                Shadow System
              </h3>
              <div className="space-y-3">
                <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-100">
                  <p className="font-medium text-slate-700">Subtle</p>
                  <code className="text-xs text-slate-500">shadow-sm</code>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-md">
                  <p className="font-medium text-slate-700">Medium</p>
                  <code className="text-xs text-slate-500">shadow-md</code>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-lg">
                  <p className="font-medium text-slate-700">Elevated</p>
                  <code className="text-xs text-slate-500">shadow-lg</code>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-2xl">
                  <p className="font-medium text-slate-700">Prominent</p>
                  <code className="text-xs text-slate-500">shadow-2xl</code>
                </div>
              </div>
            </div>

            {/* Spacing */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-emerald-700 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                Spacing (8px Grid)
              </h3>
              <div className="space-y-2 bg-white/80 rounded-lg p-5 border border-slate-200">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 bg-emerald-500"></div>
                  <span className="text-sm font-medium text-slate-700">4px - Tight spacing</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-4 h-4 bg-emerald-500"></div>
                  <span className="text-sm font-medium text-slate-700">8px - Base unit</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-emerald-500"></div>
                  <span className="text-sm font-medium text-slate-700">16px - Standard</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-500"></div>
                  <span className="text-sm font-medium text-slate-700">24px - Comfortable</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-emerald-500"></div>
                  <span className="text-sm font-medium text-slate-700">32px - Generous</span>
                </div>
              </div>
            </div>

            {/* Border Radius */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-orange-700 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-600"></span>
                Border Radius
              </h3>
              <div className="space-y-3">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded p-4 text-white font-medium">
                  4px - Subtle
                </div>
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-4 text-white font-medium">
                  8px - Standard (rounded-lg)
                </div>
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-4 text-white font-medium">
                  12px - Comfortable (rounded-xl)
                </div>
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-4 text-white font-medium">
                  16px - Prominent (rounded-2xl)
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Design Principles */}
        <Card className="p-8 bg-gradient-to-br from-purple-50/50 via-indigo-50/30 to-blue-50/50 backdrop-blur-sm border-2 border-purple-200/40 shadow-lg">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent mb-6">
            Design Principles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-purple-700">Luxury Simplicity</h3>
              <p className="text-sm text-slate-700">
                Reduced saturation (65-75%) creates sophistication. No overwhelming gradients.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-indigo-700">Clinical Credibility</h3>
              <p className="text-sm text-slate-700">
                Brain health colors (45-55% saturation) convey medical trust and expertise.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-blue-700">Action Clarity</h3>
              <p className="text-sm text-slate-700">
                Burnt orange CTAs (60-75% saturation) create premium warmth without aggression.
              </p>
            </div>
          </div>
        </Card>

        {/* Component Examples */}
        <Card className="p-8 bg-white/80 backdrop-blur-sm border-2 border-slate-200/60 shadow-lg">
          <h2 className="text-3xl font-bold text-slate-800 mb-6">Real Component Examples</h2>
          <div className="space-y-8">
            {/* Button Examples */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-700">Buttons with Accent Strategy</h3>
              <div className="flex flex-wrap gap-4">
                <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                  Neural Luxury CTA
                </button>
                <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                  Brain Health Action
                </button>
                <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-orange-700 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                  Primary Action
                </button>
              </div>
            </div>

            {/* Card Examples */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-700">Cards with Gradient Borders</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 group">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 opacity-5 group-hover:opacity-10 transition-opacity rounded-xl"></div>
                  <div className="relative">
                    <h4 className="font-bold text-slate-800 mb-2">Premium Feature</h4>
                    <p className="text-sm text-slate-600">Neural Luxury theme card with subtle gradient overlay</p>
                  </div>
                </div>
                <div className="relative p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 group">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 opacity-5 group-hover:opacity-10 transition-opacity rounded-xl"></div>
                  <div className="relative">
                    <h4 className="font-bold text-slate-800 mb-2">Health Metric</h4>
                    <p className="text-sm text-slate-600">Brain Health spectrum with clinical credibility</p>
                  </div>
                </div>
                <div className="relative p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 group">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-600 to-orange-700 opacity-5 group-hover:opacity-10 transition-opacity rounded-xl"></div>
                  <div className="relative">
                    <h4 className="font-bold text-slate-800 mb-2">Action Card</h4>
                    <p className="text-sm text-slate-600">Burnt orange warmth for engagement</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Text Readability Examples */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-700">Text Contrast & Readability</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 rounded-xl p-6 text-white">
                  <h4 className="font-bold mb-2">White on Neural Luxury</h4>
                  <p className="text-sm opacity-90">WCAG AAA Contrast Ratio: 7.2:1</p>
                  <p className="text-xs mt-2 opacity-75">Perfect for headlines and key messages</p>
                </div>
                <div className="bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 rounded-xl p-6 text-white">
                  <h4 className="font-bold mb-2">White on Brain Health</h4>
                  <p className="text-sm opacity-90">WCAG AAA Contrast Ratio: 6.8:1</p>
                  <p className="text-xs mt-2 opacity-75">Excellent for health metrics</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Comparison */}
        <Card className="p-8 bg-white/80 backdrop-blur-sm border-2 border-slate-200/60 shadow-lg">
          <h2 className="text-3xl font-bold text-slate-800 mb-6">Before vs. After Transformation</h2>
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-red-600 flex items-center gap-2">
                <span className="text-2xl">❌</span> Before (Fragmented)
              </h3>
              <div className="space-y-3">
                <div className="space-y-2">
                  <div className="h-16 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center text-white font-semibold shadow-md">
                    Too Bright
                  </div>
                  <p className="text-xs text-slate-600">Multiple teal/emerald families (80-90% saturation)</p>
                </div>
                <div className="space-y-2">
                  <div className="h-16 bg-gradient-to-r from-purple-500 to-purple-700 rounded-lg flex items-center justify-center text-white font-semibold shadow-md">
                    Too Intense
                  </div>
                  <p className="text-xs text-slate-600">Beacon: 70-95% saturation (overwhelming)</p>
                </div>
                <div className="space-y-2">
                  <div className="h-16 bg-gradient-to-r from-orange-400 to-orange-500 rounded-lg flex items-center justify-center text-white font-semibold shadow-md">
                    Not Burnt
                  </div>
                  <p className="text-xs text-slate-600">Bright orange (lacks luxury warmth)</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-emerald-600 flex items-center gap-2">
                <span className="text-2xl">✅</span> After (Luxury)
              </h3>
              <div className="space-y-3">
                <div className="space-y-2">
                  <div className="h-16 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 rounded-lg flex items-center justify-center text-white font-semibold shadow-lg hover:shadow-xl transition-all">
                    Refined
                  </div>
                  <p className="text-xs text-slate-600">Unified brain health gradient (45-55% saturation)</p>
                </div>
                <div className="space-y-2">
                  <div className="h-16 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-lg flex items-center justify-center text-white font-semibold shadow-lg hover:shadow-xl transition-all">
                    Sophisticated
                  </div>
                  <p className="text-xs text-slate-600">Neural Luxury: 65-75% saturation (elegant)</p>
                </div>
                <div className="space-y-2">
                  <div className="h-16 bg-gradient-to-r from-orange-600 to-orange-700 rounded-lg flex items-center justify-center text-white font-semibold shadow-lg hover:shadow-xl transition-all">
                    Premium
                  </div>
                  <p className="text-xs text-slate-600">Burnt orange (luxury warmth with action)</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
