
"use client";

import React, { useState } from 'react';
import { BackgroundOrbs } from '../components/BackgroundOrbs';
import { WhatsAppButton } from '../components/WhatsAppButton';
import { GlassCard } from '../components/GlassCard';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Sparkles, Brain, Target, Shield, Rocket, Download, Lock } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { freeTierProblemSummary, type FreeTierProblemSummaryOutput } from '@/ai/flows/free-tier-problem-summary';
import { premiumStrategicPlan, type PremiumStrategicPlanOutput } from '@/ai/flows/premium-strategic-plan';
import { toast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

const analysisSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  age: z.coerce.number().min(1, "Age is required"),
  problem: z.string().min(10, "Please describe your problem in more detail"),
  achievements: z.string().min(5, "Share some achievements"),
  goals: z.string().min(5, "Share your goals"),
});

type AnalysisFormData = z.infer<typeof analysisSchema>;

export default function LandingPage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<FreeTierProblemSummaryOutput | null>(null);
  const [premiumResults, setPremiumResults] = useState<PremiumStrategicPlanOutput | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [formData, setFormData] = useState<AnalysisFormData | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<AnalysisFormData>({
    resolver: zodResolver(analysisSchema)
  });

  const onSubmit = async (data: AnalysisFormData) => {
    setLoading(true);
    setFormData(data);
    try {
      const summary = await freeTierProblemSummary(data);
      setResults(summary);
      window.scrollTo({ top: document.getElementById('results')?.offsetTop, behavior: 'smooth' });
    } catch (error) {
      toast({ variant: 'destructive', title: "Error", description: "Failed to generate summary. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleUnlock = async () => {
    setShowPayment(true);
    // Simulating payment process
    setTimeout(async () => {
      if (!formData) return;
      try {
        const premium = await premiumStrategicPlan(formData);
        setPremiumResults(premium);
        setShowPayment(false);
        toast({ title: "Unlocked!", description: "Your strategic plan is ready." });
      } catch (error) {
        toast({ variant: 'destructive', title: "Error", description: "Payment processing failed. Contact support." });
        setShowPayment(false);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <BackgroundOrbs />
      <WhatsAppButton />

      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-20 pb-12 text-center relative z-10">
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-tr from-[#AA62FF] to-[#475BFF] rounded-2xl flex items-center justify-center shadow-2xl transform rotate-12">
            <Sparkles className="text-white w-12 h-12" />
          </div>
        </div>
        <h1 className="text-5xl md:text-7xl font-headline font-extrabold mb-6 tracking-tight leading-tight">
          You are <span className="text-gradient">1 decision away</span> <br /> from changing your life
        </h1>
        <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
          Get your life clarity in 2 minutes. Our AI analyzes your reality to provide deep strategic guidance for your career and personal growth.
        </p>
        <Button 
          size="lg" 
          className="btn-gradient text-lg px-8 py-6 rounded-xl font-bold"
          onClick={() => document.getElementById('analysis-form')?.scrollIntoView({ behavior: 'smooth' })}
        >
          Start My Analysis
        </Button>
      </section>

      {/* Analysis Form Section */}
      <section id="analysis-form" className="container mx-auto px-4 py-16 max-w-4xl">
        <GlassCard className="p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16" />
          <h2 className="text-3xl font-headline font-bold mb-8 flex items-center gap-3">
            <Brain className="text-[#AA62FF]" /> Personal Context
          </h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>What's your name?</Label>
                <Input {...register('name')} placeholder="John Doe" className="bg-white/5 border-white/10" />
                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Age</Label>
                <Input type="number" {...register('age')} placeholder="25" className="bg-white/5 border-white/10" />
                {errors.age && <p className="text-xs text-destructive">{errors.age.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Describe your current major problem or challenge</Label>
              <Textarea {...register('problem')} placeholder="I feel stuck in my career and don't know my next move..." className="bg-white/5 border-white/10 min-h-[120px]" />
              {errors.problem && <p className="text-xs text-destructive">{errors.problem.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>What are your top 3 achievements so far?</Label>
              <Textarea {...register('achievements')} placeholder="1. Graduated top of class, 2. Led a team project, 3. Improved efficiency by 20%..." className="bg-white/5 border-white/10 min-h-[80px]" />
              {errors.achievements && <p className="text-xs text-destructive">{errors.achievements.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>What are your main goals for the next year?</Label>
              <Textarea {...register('goals')} placeholder="Pivot to AI engineering, start a side hustle, improve fitness..." className="bg-white/5 border-white/10 min-h-[80px]" />
              {errors.goals && <p className="text-xs text-destructive">{errors.goals.message}</p>}
            </div>

            <Button type="submit" disabled={loading} className="w-full btn-gradient py-6 text-lg font-bold rounded-xl shadow-xl">
              {loading ? "Analyzing Realities..." : "Generate My Analysis"}
            </Button>
          </form>
        </GlassCard>
      </section>

      {/* Results Section */}
      {(loading || results) && (
        <section id="results" className="container mx-auto px-4 py-16 max-w-5xl">
          <div className="space-y-8">
            <h2 className="text-4xl font-headline font-bold text-center mb-12">Your Clarity Report</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Free Results */}
              <GlassCard className="border-primary/20">
                <div className="flex items-center gap-3 mb-6">
                  <Target className="text-[#AA62FF]" />
                  <h3 className="text-2xl font-bold">Analysis Summary</h3>
                </div>
                {loading ? <Skeleton className="h-40 w-full" /> : (
                  <div className="prose prose-invert">
                    <p className="text-lg leading-relaxed">{results?.problemSummary}</p>
                  </div>
                )}
              </GlassCard>

              <GlassCard className="border-primary/20">
                <div className="flex items-center gap-3 mb-6">
                  <Shield className="text-[#475BFF]" />
                  <h3 className="text-2xl font-bold">Hidden Mistakes</h3>
                </div>
                {loading ? <Skeleton className="h-40 w-full" /> : (
                  <ul className="space-y-4">
                    {results?.hiddenMistakes.map((mistake, idx) => (
                      <li key={idx} className="flex items-start gap-3 bg-white/5 p-4 rounded-lg border border-white/5">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-bold">{idx + 1}</span>
                        <span>{mistake}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </GlassCard>
            </div>

            {/* Premium Results / Lock */}
            <div className="mt-12">
              {!premiumResults ? (
                <GlassCard className="p-12 text-center relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/50 z-10" />
                  <div className="relative z-20">
                    <Lock className="w-16 h-16 mx-auto mb-6 text-primary animate-pulse" />
                    <h3 className="text-3xl font-bold mb-4">Unlock Your Strategic Plan</h3>
                    <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
                      Reveal your <span className="text-white font-bold">Realistic Future Prediction</span> and a customized <span className="text-white font-bold">5-Step Actionable Plan</span> to achieve your goals.
                    </p>
                    
                    <div className="flex flex-col items-center gap-4">
                      <Button onClick={handleUnlock} size="lg" className="btn-gradient px-12 py-8 text-xl font-bold rounded-2xl shadow-2xl">
                        {showPayment ? "Processing Payment..." : "Pay ₹99 to Unlock Everything"}
                      </Button>
                      <p className="text-xs text-muted-foreground flex items-center gap-2">
                        <Shield className="w-3 h-3" /> Secure Transaction • One-time Payment
                      </p>
                    </div>

                    <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4 blur-md opacity-40 select-none">
                      <div className="h-32 bg-white/5 rounded-xl border border-white/10" />
                      <div className="h-32 bg-white/5 rounded-xl border border-white/10" />
                    </div>
                  </div>
                </GlassCard>
              ) : (
                <div className="space-y-8">
                   <GlassCard className="border-accent/40 bg-accent/5">
                    <div className="flex items-center gap-3 mb-6">
                      <Sparkles className="text-accent" />
                      <h3 className="text-2xl font-bold">Realistic Future Prediction</h3>
                    </div>
                    <p className="text-lg leading-relaxed italic">"{premiumResults.futurePrediction}"</p>
                  </GlassCard>

                  <GlassCard className="border-accent/40">
                    <div className="flex items-center gap-3 mb-6">
                      <Rocket className="text-accent" />
                      <h3 className="text-2xl font-bold">5-Step Strategic Plan</h3>
                    </div>
                    <div className="space-y-4">
                      {premiumResults.fiveStepPlan.map((step, idx) => (
                        <div key={idx} className="bg-white/5 p-6 rounded-xl border border-white/10 hover:border-accent/50 transition-colors">
                          <h4 className="text-accent font-bold mb-2 uppercase text-xs tracking-widest">Step {idx + 1}</h4>
                          <p className="text-lg">{step}</p>
                        </div>
                      ))}
                    </div>
                  </GlassCard>

                  <div className="flex justify-center">
                    <Button onClick={() => window.print()} variant="outline" size="lg" className="gap-2 px-8 py-6 rounded-xl border-white/20 hover:bg-white/5">
                      <Download className="w-5 h-5" /> Download PDF Report
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* AI Clone Section */}
      <section className="container mx-auto px-4 py-24">
        <GlassCard className="bg-gradient-to-br from-[#AA62FF]/10 to-[#475BFF]/10 border-white/20 flex flex-col lg:flex-row items-center gap-12 p-12">
          <div className="lg:w-1/2">
            <h2 className="text-4xl font-headline font-extrabold mb-6">Create Your <span className="text-gradient">AI Personal Clone</span></h2>
            <p className="text-xl text-muted-foreground mb-8">
              Imagine having a mentor who knows your history, achievements, and fears. A personalized AI friend that heals and guides you logically or emotionally whenever you need.
            </p>
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">✓</div>
                <span>Personalized Emotional Intelligence</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">✓</div>
                <span>Strategic Career Mentorship 24/7</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">✓</div>
                <span>Evolving Database of your Life Success</span>
              </div>
            </div>
            <Button size="lg" className="btn-gradient px-10 py-7 text-lg font-bold rounded-2xl">
              Get Your Clone for ₹199
            </Button>
          </div>
          <div className="lg:w-1/2 flex justify-center">
            <div className="relative w-80 h-80">
              <div className="absolute inset-0 bg-primary/30 rounded-full blur-3xl animate-pulse" />
             <img src="/clone-3d.png" alt="AI Mentor" className="w-full h-full object-cover rounded-3xl border border-white/10 shadow-2xl relative z-10" />
            </div>
          </div>
        </GlassCard>
      </section>

      {/* Footer */}
      <footer className="bg-black/40 border-t border-white/5 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                 <Sparkles className="text-primary w-8 h-8" />
                 <span className="text-2xl font-bold tracking-tighter">CLARITY FLOW</span>
              </div>
              <p className="text-muted-foreground max-w-sm">
                Empowering individuals through AI-driven life clarity and strategic planning. Your future starts with one decision.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-6">Legal</h4>
              <ul className="space-y-4 text-muted-foreground">
                <li><a href="/legal/privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="/legal/terms" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="/contact" className="hover:text-white transition-colors">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6">Support</h4>
              <ul className="space-y-4 text-muted-foreground">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Feedback</a></li>
                <li><a href="#" className="hover:text-white transition-colors">WhatsApp Support</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/5 text-center text-muted-foreground text-sm">
            © {new Date().getFullYear()} Clarity Flow. All rights reserved. Designed for Modern Success.
          </div>
        </div>
      </footer>
    </div>
  );
}
