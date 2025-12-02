import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Sparkles, Rocket, Wrench, Clock, ExternalLink } from "lucide-react";
import { releases, comingSoon, currentVersion, ReleaseFeature } from "@/data/releaseNotes";

function FeatureCard({ feature }: { feature: ReleaseFeature }) {
  const typeStyles = {
    'new': 'bg-primary/10 text-primary border-primary/20',
    'improved': 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    'fixed': 'bg-green-500/10 text-green-600 border-green-500/20',
    'coming-soon': 'bg-muted text-muted-foreground border-border'
  };

  const typeLabels = {
    'new': 'New',
    'improved': 'Improved',
    'fixed': 'Fixed',
    'coming-soon': 'Coming Soon'
  };

  const TypeIcon = {
    'new': Sparkles,
    'improved': Wrench,
    'fixed': Wrench,
    'coming-soon': Clock
  }[feature.type];

  return (
    <div className="flex gap-4 p-4 rounded-lg bg-card hover:bg-muted/50 transition-colors border">
      <div className="text-3xl flex-shrink-0">{feature.icon}</div>
      <div className="flex-1 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-semibold">{feature.title}</h4>
          <Badge variant="outline" className={typeStyles[feature.type]}>
            <TypeIcon className="h-3 w-3 mr-1" />
            {typeLabels[feature.type]}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{feature.description}</p>
        {feature.learnMoreUrl && (
          <Button variant="link" className="p-0 h-auto text-primary" asChild>
            <a href={feature.learnMoreUrl}>
              Learn more <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          </Button>
        )}
      </div>
    </div>
  );
}

export default function WhatsNew() {
  const navigate = useNavigate();

  // Mark as viewed
  useEffect(() => {
    localStorage.setItem('myrhythm_last_viewed_version', currentVersion);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
      <div className="container max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Sparkles className="h-8 w-8 text-primary" />
              What's New
            </h1>
            <p className="text-muted-foreground">
              See the latest features and improvements in MyRhythm
            </p>
          </div>
        </div>

        {/* Current Version Badge */}
        <div className="flex items-center gap-2 mb-8">
          <Badge variant="secondary" className="text-sm">
            Current Version: {currentVersion}
          </Badge>
          <span className="text-sm text-muted-foreground">
            Last updated: {new Date(releases[0].date).toLocaleDateString('en-GB', { 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric' 
            })}
          </span>
        </div>

        {/* Releases */}
        <div className="space-y-8">
          {releases.map((release, index) => (
            <Card key={release.version} className={index === 0 ? "border-primary/50" : ""}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Rocket className="h-5 w-5 text-primary" />
                      {release.title}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Version {release.version} • {new Date(release.date).toLocaleDateString('en-GB', { 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </p>
                  </div>
                  {index === 0 && (
                    <Badge className="bg-primary text-primary-foreground">Latest</Badge>
                  )}
                </div>
                <p className="text-muted-foreground">{release.description}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                {release.features.map((feature) => (
                  <FeatureCard key={feature.id} feature={feature} />
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        <Separator className="my-8" />

        {/* Coming Soon */}
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              Coming Soon
            </CardTitle>
            <p className="text-muted-foreground">
              Features we're working on based on your feedback
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {comingSoon.map((feature) => (
              <FeatureCard key={feature.id} feature={feature} />
            ))}
          </CardContent>
        </Card>

        {/* Feedback CTA */}
        <Card className="mt-8 bg-primary/5 border-primary/20">
          <CardContent className="py-6 text-center">
            <h3 className="font-semibold mb-2">Have a feature request?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              As a Founding Member, your input shapes the future of MyRhythm
            </p>
            <Button variant="outline" onClick={() => navigate('/help')}>
              Share Your Ideas
            </Button>
          </CardContent>
        </Card>

        {/* Signature */}
        <div className="mt-8 text-center py-6 border-t">
          <p className="text-sm text-muted-foreground italic">
            "Every promise you keep builds trust. You're building something amazing." 💪
          </p>
        </div>
      </div>
    </div>
  );
}
