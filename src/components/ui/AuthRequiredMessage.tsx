import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Sparkles, ArrowRight, Calendar, Brain, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

interface AuthRequiredMessageProps {
  title?: string;
  message?: string;
  features?: string[];
  showPreview?: boolean;
  className?: string;
}

export function AuthRequiredMessage({
  title = "Sign in to unlock your personalized actions",
  message = "Your AI-powered personal assistant is waiting to help you organize, schedule, and achieve your goals with intelligent suggestions.",
  features = [
    "Smart scheduling with conflict detection",
    "AI-powered action prioritization", 
    "Calendar integration across all devices",
    "Personal assistant that learns your patterns"
  ],
  showPreview = true,
  className = ""
}: AuthRequiredMessageProps) {
  const navigate = useNavigate();

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-6 ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl w-full"
      >
        <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-lg overflow-hidden">
          <CardContent className="p-0">
            <div className="grid lg:grid-cols-2 gap-0">
              {/* Main Content */}
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  {/* Header */}
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                      <Lock className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                        Welcome to MyRhythm
                      </h1>
                      <p className="text-muted-foreground">Your AI Personal Assistant</p>
                    </div>
                  </div>

                  {/* Main Message */}
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-foreground mb-4">
                      {title}
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      {message}
                    </p>
                  </div>

                  {/* Features List */}
                  <div className="mb-8">
                    <h3 className="font-semibold text-foreground mb-4 flex items-center">
                      <Sparkles className="w-5 h-5 mr-2 text-primary" />
                      What you'll get access to:
                    </h3>
                    <div className="space-y-3">
                      {features.map((feature, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
                          className="flex items-center space-x-3"
                        >
                          <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                          </div>
                          <span className="text-muted-foreground">{feature}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* CTA Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.4 }}
                  >
                    <Button
                      onClick={() => navigate('/auth')}
                      size="lg"
                      className="w-full lg:w-auto bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-primary-foreground px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Lock className="w-5 h-5 mr-2" />
                      Sign In to Get Started
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </motion.div>

                  {/* Additional Info */}
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.4 }}
                    className="text-sm text-muted-foreground mt-6"
                  >
                    New to MyRhythm?{' '}
                    <button
                      onClick={() => navigate('/auth')}
                      className="text-primary hover:text-primary/80 font-medium underline"
                    >
                      Create your free account
                    </button>
                    {' '}and start your empowering journey today.
                  </motion.p>
                </motion.div>
              </div>

              {/* Preview Section */}
              {showPreview && (
                <div className="bg-gradient-to-br from-primary/5 to-primary/10 p-8 lg:p-12 flex items-center">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="w-full space-y-6"
                  >
                    <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center">
                      <Sparkles className="w-5 h-5 mr-2 text-primary" />
                      Preview: Your Personal Assistant
                    </h3>

                    {/* Mock Action Cards */}
                    <div className="space-y-4">
                      {[
                        { 
                          icon: Calendar, 
                          title: "Schedule team meeting", 
                          time: "Tomorrow 2:00 PM",
                          confidence: "95% confidence"
                        },
                        { 
                          icon: Brain, 
                          title: "Review project proposal", 
                          time: "Today 4:00 PM",
                          confidence: "87% confidence"
                        },
                        { 
                          icon: Target, 
                          title: "Complete quarterly goals", 
                          time: "Friday 10:00 AM",
                          confidence: "92% confidence"
                        }
                      ].map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
                          className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                              <item.icon className="w-4 h-4 text-primary" />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-sm text-foreground">
                                {item.title}
                              </div>
                              <div className="text-xs text-muted-foreground flex items-center space-x-2">
                                <span>{item.time}</span>
                                <span>•</span>
                                <span className="text-emerald-600">{item.confidence}</span>
                              </div>
                            </div>
                            <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                              <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Blur overlay to indicate preview */}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent pointer-events-none" />
                  </motion.div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}