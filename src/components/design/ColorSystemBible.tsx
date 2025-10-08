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
            return (
              <Card key={key} className="p-6 bg-white/80 backdrop-blur-sm border-2 border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${family.gradient} flex items-center justify-center shadow-md`}>
                          <IconComponent className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800">{family.name}</h3>
                      </div>
                      <p className="text-sm text-slate-600">{family.description}</p>
                    </div>
                  </div>

                  {/* HSL Values */}
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      HSL Values
                    </p>
                    <div className="space-y-1">
                      {Object.entries(family.hsl).map(([colorName, value]) => (
                        <div key={colorName} className="flex justify-between text-sm">
                          <span className="font-medium text-slate-700 capitalize">{colorName}:</span>
                          <code className="text-xs bg-white px-2 py-1 rounded border border-slate-300">{value}</code>
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
                      <div key={idx} className={`h-14 rounded-lg ${color.className} flex items-center justify-center text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200`}>
                        {color.name}
                      </div>
                    ))}
                  </div>

                  {/* Usage */}
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      Usage
                    </p>
                    <ul className="space-y-1">
                      {family.usage.map((use, idx) => (
                        <li key={idx} className="text-sm text-slate-700 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
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
              <div key={idx} className="space-y-3">
                <div className={`h-24 rounded-xl ${flow.className} flex items-center justify-center font-bold text-lg shadow-lg`}>
                  {flow.name}
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-700">{flow.description}</p>
                  <code className="text-xs bg-slate-100 px-3 py-2 rounded border border-slate-300 block">
                    {flow.code}
                  </code>
                </div>
              </div>
            ))}
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

        {/* Comparison */}
        <Card className="p-8 bg-white/80 backdrop-blur-sm border-2 border-slate-200/60 shadow-lg">
          <h2 className="text-3xl font-bold text-slate-800 mb-6">Before vs. After</h2>
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-red-600">❌ Before (Fragmented)</h3>
              <div className="space-y-2">
                <div className="h-12 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-lg"></div>
                <p className="text-xs text-slate-600">Multiple teal/emerald families</p>
              </div>
              <div className="space-y-2">
                <div className="h-12 bg-gradient-to-r from-purple-500 to-purple-700 rounded-lg"></div>
                <p className="text-xs text-slate-600">Beacon: 70-95% saturation (too intense)</p>
              </div>
              <div className="space-y-2">
                <div className="h-12 bg-gradient-to-r from-orange-400 to-orange-500 rounded-lg"></div>
                <p className="text-xs text-slate-600">Bright orange (not burnt)</p>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-emerald-600">✅ After (Luxury)</h3>
              <div className="space-y-2">
                <div className="h-12 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 rounded-lg"></div>
                <p className="text-xs text-slate-600">Unified brain health gradient (45-55%)</p>
              </div>
              <div className="space-y-2">
                <div className="h-12 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-lg"></div>
                <p className="text-xs text-slate-600">Neural Luxury: 65-75% saturation (refined)</p>
              </div>
              <div className="space-y-2">
                <div className="h-12 bg-gradient-to-r from-orange-600 to-orange-700 rounded-lg"></div>
                <p className="text-xs text-slate-600">Burnt orange (luxury warmth)</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
