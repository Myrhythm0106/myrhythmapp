import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Brain, Zap, Target, Heart } from 'lucide-react';

export function ColorSystemBible() {
  const colorSystem = {
    primary: {
      name: "Neural Empowerment",
      description: "Vibrant brand gradient - Headers, navigation, empowerment moments",
      gradient: "from-neural-purple-600 via-neural-magenta-600 to-brand-orange-600",
      accentColor: "clarity-teal-500",
      accentPosition: "top-right",
      usage: ["Hero Headers & Titles", "Navigation Active States", "Empowerment Moments", "Transformation Features"],
      hsl: {
        purple: "270° 88% 52%",
        magenta: "320° 92% 58%", 
        orange: "25° 88% 52%"
      },
      saturation: "85-92% (Vibrant empowerment)",
      icon: Sparkles,
      preview: [
        { name: "Neural Purple 600", className: "bg-gradient-to-r from-neural-purple-600 to-neural-purple-700" },
        { name: "Neural Magenta 500", className: "bg-gradient-to-r from-neural-magenta-500 to-neural-magenta-600" },
        { name: "Brand Orange 600", className: "bg-gradient-to-r from-brand-orange-600 to-brand-orange-700" }
      ]
    },
    magenta: {
      name: "Neural Magenta - Passionate Empowerment",
      description: "Vibrant magenta/pink for emotional connection and bold confidence",
      gradient: "from-neural-magenta-500 via-brand-orange-500 to-clarity-teal-500",
      accentColor: "brand-orange-500",
      accentPosition: "bottom-left",
      usage: ["Emotional Moments", "Passion Accents", "Celebration States", "Gradient Flows", "CTA Highlights"],
      hsl: {
        primary: "320° 92% 58%",
        light: "320° 92% 75%",
        dark: "320° 92% 42%"
      },
      saturation: "90-95% (Bold emotional energy)",
      icon: Heart,
      preview: [
        { name: "Magenta 500", className: "bg-gradient-to-r from-neural-magenta-500 to-neural-magenta-600" },
        { name: "Magenta 400", className: "bg-gradient-to-r from-neural-magenta-400 to-neural-magenta-500" },
        { name: "Magenta 600", className: "bg-gradient-to-r from-neural-magenta-600 to-neural-magenta-700" }
      ]
    },
    accent: {
      name: "Brain Health Spectrum",
      description: "Vibrant health gradient - Progress, wellness metrics, cognitive focus",
      gradient: "from-brain-health-500 via-clarity-teal-500 to-memory-emerald-500",
      accentColor: "neural-magenta-600",
      accentPosition: "bottom-left",
      usage: ["Progress Bars", "Health Metrics", "Success States", "Cognitive Enhancement"],
      hsl: {
        brainHealth: "173° 75% 52%",
        clarityTeal: "180° 75% 52%",
        emerald: "160° 52% 48%"
      },
      saturation: "68-78% (Vibrant wellness)",
      icon: Brain,
      preview: [
        { name: "Brain Health 500", className: "bg-gradient-to-r from-brain-health-500 to-brain-health-600" },
        { name: "Clarity Teal 500", className: "bg-gradient-to-r from-clarity-teal-500 to-clarity-teal-600" },
        { name: "Memory Emerald 500", className: "bg-gradient-to-r from-memory-emerald-500 to-memory-emerald-600" }
      ]
    },
    action: {
      name: "Vibrant Orange",
      description: "Premium action trigger - Primary CTAs, critical actions",
      gradient: "from-brand-orange-500 to-brand-orange-600",
      accentColor: "neural-magenta-600",
      accentPosition: "top-left",
      usage: ["Primary CTAs", "Submit Buttons", "Start Actions", "Empowerment Upgrades"],
      hsl: {
        primary: "25° 88% 58%",
        hover: "25° 88% 52%"
      },
      saturation: "85-90% (Energized warmth)",
      icon: Zap,
      preview: [
        { name: "Orange 500", className: "bg-gradient-to-r from-brand-orange-500 to-brand-orange-600" },
        { name: "Orange 600", className: "bg-gradient-to-r from-brand-orange-600 to-brand-orange-700" }
      ]
    },
    neutrals: {
      name: "Warm-to-Cool Grays",
      description: "Sophisticated backgrounds with subtle gradients",
      gradient: "from-slate-50 to-gray-100",
      accentColor: "neural-magenta-600",
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
      className: "bg-gradient-to-r from-neural-purple-600 via-neural-magenta-600 to-brand-orange-600 text-white",
      code: "from-neural-purple-600 via-neural-magenta-600 to-brand-orange-600"
    },
    {
      name: "Brain Passion Flow",
      description: "For progress bars and passionate cognitive metrics",
      className: "bg-gradient-to-r from-neural-magenta-500 via-brand-orange-500 to-clarity-teal-500 text-white",
      code: "from-neural-magenta-500 via-brand-orange-500 to-clarity-teal-500"
    },
    {
      name: "Transformation Gradient",
      description: "For transformation moments and achievements",
      className: "bg-gradient-to-r from-neural-blue-600 via-neural-magenta-500 to-neural-purple-600 text-white",
      code: "from-neural-blue-600 via-neural-magenta-500 to-neural-purple-600"
    },
    {
      name: "Action Trigger",
      description: "Primary CTAs with vibrant orange-magenta",
      className: "bg-gradient-to-r from-neural-magenta-500 to-brand-orange-600 text-white",
      code: "from-neural-magenta-500 to-brand-orange-600"
    },
    {
      name: "Wellness Flow",
      description: "Health and wellness progress indicators",
      className: "bg-gradient-to-r from-brain-health-500 via-clarity-teal-500 to-memory-emerald-500 text-white",
      code: "from-brain-health-500 via-clarity-teal-500 to-memory-emerald-500"
    },
    {
      name: "Subtle Background",
      description: "Page backgrounds with vibrant depth",
      className: "bg-gradient-to-br from-neural-purple-50/30 via-neural-magenta-50/25 to-clarity-teal-100/30",
      code: "from-neural-purple-50/30 via-neural-magenta-50/25 to-clarity-teal-100/30"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-neural-purple-600 via-neural-magenta-600 to-brand-orange-600 bg-clip-text text-transparent">
            Vibrant Empowerment Color System
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Bold, confident colors that inspire transformation and cognitive empowerment
          </p>
          <div className="flex items-center justify-center gap-3">
            <Badge variant="outline" className="bg-white/50 backdrop-blur-sm">
              85-92% Saturation
            </Badge>
            <Badge variant="outline" className="bg-white/50 backdrop-blur-sm">
              Neuroplasticity-Inspired
            </Badge>
            <Badge variant="outline" className="bg-white/50 backdrop-blur-sm">
              Empowerment Aesthetic
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
          <h2 className="text-3xl font-bold text-slate-800 mb-6">Color Philosophy: Empowerment Through Vibrancy</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Before: Clinical */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-red-700 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-600"></span>
                Before: Clinical & Muted
              </h3>
              <div className="space-y-3 bg-white/80 rounded-lg p-5 border border-slate-200">
                <p className="text-sm text-slate-600">❌ 65-75% saturation (too conservative)</p>
                <p className="text-sm text-slate-600">❌ No magenta/passion dimension</p>
                <p className="text-sm text-slate-600">❌ Safe, medical app aesthetic</p>
                <p className="text-sm text-slate-600">❌ Low emotional engagement</p>
              </div>
            </div>

            {/* After: Empowerment */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-green-700 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-600"></span>
                After: Vibrant Empowerment
              </h3>
              <div className="space-y-3 bg-white/80 rounded-lg p-5 border border-slate-200">
                <p className="text-sm text-slate-600">✅ 85-92% saturation (confident & bold)</p>
                <p className="text-sm text-slate-600">✅ Neural Magenta adds passion & emotion</p>
                <p className="text-sm text-slate-600">✅ Premium wellness aesthetic</p>
                <p className="text-sm text-slate-600">✅ High emotional connection</p>
              </div>
            </div>
          </div>

          <div className="mt-8 p-6 bg-gradient-to-r from-neural-purple-50 via-neural-magenta-50 to-brand-orange-50 rounded-lg border border-neural-magenta-200">
            <p className="text-lg text-slate-700 font-medium mb-4">
              💡 <strong>Design Principle:</strong> Empowerment Through Vibrancy
            </p>
            <p className="text-slate-600">
              Our vibrant color system reflects the neuroplastic potential of the brain - bold, adaptable, and full of energy. 
              Each color choice reinforces the message: <em>"Your brain can change, grow stronger, and transform."</em>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}