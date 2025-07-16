
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Heart, ChevronDown, ExternalLink, Sparkles } from "lucide-react";

export function PersonalJourneySection() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="py-16 bg-gradient-to-r from-purple-50/50 via-blue-50/40 to-teal-50/50">
      <div className="container mx-auto px-4 max-w-4xl">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Card className="cursor-pointer hover:shadow-2xl transition-all duration-300 border-2 border-purple-200/60 hover:border-purple-400/80 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/20">
              <CardContent className="p-8 text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="bg-gradient-to-r from-purple-100 via-blue-100 to-teal-100 p-3 rounded-full">
                    <Heart className="h-8 w-8 bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent" />
                  </div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">
                    How MYRHYTHM Changed My Life
                  </h2>
                  <ChevronDown 
                    className={`h-6 w-6 text-purple-600 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                  />
                </div>
                <p className="text-lg text-gray-700 font-semibold">
                  A personal story of transformation, resilience, and finding unstoppable rhythm after brain aneurysm
                </p>
                <p className="text-sm text-purple-600 mt-2 font-medium">
                  Click to read this inspiring journey of triumph →
                </p>
              </CardContent>
            </Card>
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            <Card className="mt-4 border-cyan-200">
              <CardContent className="p-8 space-y-6">
                <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6">
                  <div className="bg-gradient-to-r from-cyan-100 to-teal-100 p-6 rounded-lg border-l-4 border-cyan-400">
                    <p className="text-lg font-medium text-cyan-900 mb-3">
                      🌟 "When everything I knew about my life changed in an instant, MyRhythm became the bridge between who I was and who I was becoming."
                    </p>
                  </div>
                  
                  <p>
                    After my brain aneurysm, I faced a reality that felt overwhelming and uncertain. The person I had been—organized, driven, capable—seemed lost in a fog of cognitive challenges and physical limitations. But what I discovered through creating and living MyRhythm was that <strong>adaptation doesn't mean limitation; it means evolution</strong>.
                  </p>
                  
                  <p>
                    MyRhythm didn't just help me cope—it transformed how I approached every aspect of my life. It taught me to work <em>with</em> my brain's new patterns, not against them. Through structured routines and gentle accountability, I found myself not just surviving, but <strong>thriving in ways I never imagined</strong>.
                  </p>
                  
                  <div className="bg-amber-50 p-6 rounded-lg border border-amber-200">
                    <h3 className="text-xl font-bold text-amber-900 mb-3 flex items-center gap-2">
                      <Sparkles className="h-5 w-5" />
                      What MyRhythm Made Possible
                    </h3>
                    <ul className="space-y-3 text-amber-800">
                      <li className="flex items-start gap-2">
                        <span className="text-amber-600 font-bold">💑</span>
                        <span><strong>Deepened my role as a wife:</strong> I learned to communicate my needs clearly and create rhythms that honored both my recovery and our relationship.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-600 font-bold">💼</span>
                        <span><strong>Excelled as a contractor:</strong> By structuring my work around my energy patterns, I delivered better results than ever before.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-600 font-bold">🎓</span>
                        <span><strong>Completed my MBA:</strong> What seemed impossible became achievable through breaking goals into manageable rhythms and celebrating every small victory.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-600 font-bold">👶</span>
                        <span><strong>Embraced motherhood of two:</strong> MyRhythm gave me the tools to be fully present for my children while honoring my own needs for rest and recovery.</span>
                      </li>
                    </ul>
                  </div>
                  
                  <p>
                    Through every challenge, every small victory, and every moment of doubt, <strong>God has been my unwavering rock and foundation</strong>. His strength carried me when mine failed, His wisdom guided my steps when the path seemed unclear, and His love reminded me daily that I am fearfully and wonderfully made—exactly as I am, including with my brain injury.
                  </p>
                  
                  <p>
                    The <strong>#IChoose Statements</strong> became my daily declarations of empowerment: <em>"I choose progress over perfection. I choose hope over fear. I choose to see my journey as beautiful, not broken."</em> These weren't just words—they became the foundation of a completely transformed life.
                  </p>
                  
                  <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                    <p className="text-green-800 font-medium text-lg mb-3">
                      💚 To you, dear friend, walking your own difficult path:
                    </p>
                    <p className="text-green-700 leading-relaxed">
                      Your current chapter is not your final story. The challenges you face today are not limitations on your tomorrow. You have within you an incredible capacity for adaptation, growth, and joy that might look different than before, but can be even more beautiful. 
                    </p>
                    <p className="text-green-700 leading-relaxed mt-3">
                      <strong>Your rhythm is waiting to be discovered. Your breakthrough is closer than you think. Your story matters, and your journey—exactly as it is—has the power to inspire and transform others.</strong>
                    </p>
                  </div>
                  
                  <div className="text-center mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                    <p className="text-gray-600 mb-4">
                      Want to dive deeper into this journey of transformation and discover more empowering insights?
                    </p>
                    <Button 
                      variant="outline" 
                      className="inline-flex items-center gap-2 hover:bg-purple-50"
                      onClick={() => window.open('https://www.annabelaaron.com', '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                      Visit My Blog at annabelaaron.com
                    </Button>
                    <p className="text-sm text-gray-500 mt-2">
                      Discover more #IChoose Statements and empowering content for your journey
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </section>
  );
}
