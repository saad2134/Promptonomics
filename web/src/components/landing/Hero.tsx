"use client";

import { useState, useEffect } from "react";

export default function Hero() {
  const [prompt, setPrompt] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAnalyze = () => {
    alert(`Analyzing: ${prompt}`);
  };

  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-[90vh] flex items-center bg-background">
      <div className="absolute inset-0 bg-background z-0" />
      
      <div className="relative z-10 max-w-7xl mx-auto text-center w-full">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-8">
          <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
          Research-backed AI Sustainability Platform
        </div>
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-8">
          Make Every AI Prompt
          <span className="block text-primary">Count</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
          25-40% of global LLM energy is wasted. GreenPrompt makes invisible costs visible,
          helping developers and enterprises reduce API costs and environmental impact.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <button className="bg-primary text-primary-foreground px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary/90 transition-all hover:scale-105">
            Start Free Trial
          </button>
          <button className="border border-border px-8 py-4 rounded-lg text-lg font-semibold hover:bg-secondary transition-colors">
            View Demo
          </button>
        </div>

        <div className="max-w-4xl mx-auto bg-card/95 backdrop-blur-sm border border-border rounded-xl shadow-xl overflow-hidden">
          <div className="bg-muted px-4 py-3 border-b border-border flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="ml-2 text-sm text-muted-foreground">Prompt Analyzer</span>
          </div>
          <div className="p-6 text-left">
            <div className="mb-4">
              <label className="block text-sm font-medium text-muted-foreground mb-2">Your Prompt</label>
              <textarea
                className="w-full p-4 bg-muted rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                rows={3}
                placeholder="Please analyze and explain this text in detail..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Energy: <span className="text-foreground font-semibold">1,500 J</span></span>
              <button
                onClick={handleAnalyze}
                className="bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90 transition-colors"
              >
                Analyze
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
