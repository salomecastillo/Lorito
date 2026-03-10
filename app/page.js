import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Briefcase, Sparkles, Globe, Brain, MessageCircle, Target, ChevronRight } from "lucide-react";
import heroImage from "../public/lorito-hero.png";

export default function Home() {
  const features = [
    {
      icon: Briefcase,
      title: "Profession-Based Lessons",
      description: "Learn vocabulary and phrases tailored to your career — from medicine to marketing.",
    },
    {
      icon: Sparkles,
      title: "AI-Powered Personalization",
      description: "Our AI adapts every lesson to your unique interests, pace, and learning style.",
    },
    {
      icon: Globe,
      title: "Real-World Context",
      description: "Practice with scenarios drawn from your hobbies, travel goals, and daily life.",
    },
    {
      icon: Brain,
      title: "Smart Retention",
      description: "Spaced repetition and adaptive quizzes ensure you remember what you learn.",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Tell us about you",
      description: "Share your profession, hobbies, and what you're passionate about.",
      icon: Target,
    },
    {
      number: "02",
      title: "Get personalized lessons",
      description: "Our AI crafts lessons around topics that matter to you.",
      icon: MessageCircle,
    },
    {
      number: "03",
      title: "Learn & grow",
      description: "Practice with real scenarios and watch your fluency take off.",
      icon: Sparkles,
    },
  ];

  return (
    <div>
      <div className="min-h-screen bg-background">
        {/* Nav */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
          <div className="container mx-auto flex items-center justify-between h-16 px-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-warm flex items-center justify-center">
                <img
                  src={'/logo-img.png'}
                  alt="Lorito - AI language learning parrot mascot"
                  className="w-200 md:w-100 animate-float drop-shadow-2xl rounded-md"
                />
              </div>
              <span className="font-display font-bold text-xl text-foreground color-primary">Lorito</span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How It Works</a>

              <SignUpButton mode="redirect" forceRedirectUrl="/workspace">
                <button className="gradient-warm text-primary-foreground font-medium text-sm px-5 py-2.5 rounded-lg shadow-warm hover:opacity-90 transition-opacity">
                  Get Started
                </button>
              </SignUpButton>
            </div>
          </div>
        </nav>

        {/* Hero */}
        <section className="gradient-hero pt-32 pb-20 md:pt-40 md:pb-28">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="animate-fade-up">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-6">
                  <Sparkles className="w-4 h-4" />
                  AI-Powered Language Learning
                </div>

                <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
                  Learn languages{" "}
                  <span className="text-gradient-warm">your way</span>
                </h1>

                <p className="text-lg text-muted-foreground max-w-lg mb-8 leading-relaxed">
                  Lorito generates personalized lessons based on your profession, hobbies, and interests — so every word you learn is one you'll actually use.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <SignUpButton mode="redirect" forceRedirectUrl="/workspace">
                    <button className="gradient-warm text-primary-foreground font-semibold px-8 py-3.5 rounded-xl shadow-warm hover:opacity-90 transition-all text-base flex items-center justify-center gap-2">
                      Sign Up
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </SignUpButton>

                  <SignInButton mode="redirect" forceRedirectUrl="/workspace">
                    <button className="border-2 border-border text-foreground font-semibold px-8 py-3.5 rounded-xl hover:bg-accent transition-colors text-base">
                      Sign In
                    </button>
                  </SignInButton>
                </div>
              </div>

              <div className="flex justify-center animate-fade-up" style={{ animationDelay: "0.2s" }}>
                <img
                  src={'/parrot.png'}
                  alt="Lorito - AI language learning parrot mascot"
                  className="w-72 md:w-96 animate-float drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-20 md:py-28 bg-background">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                Why learners love <span className="text-gradient-warm">Lorito</span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Every lesson is crafted around your life — making language learning feel natural, relevant, and exciting.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, i) => (
                <div
                  key={feature.title}
                  className="group p-6 rounded-2xl bg-card border border-border shadow-card hover:shadow-warm transition-all duration-300 hover:-translate-y-1"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="w-12 h-12 rounded-xl gradient-warm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-display font-semibold text-foreground text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-20 md:py-28 gradient-warm-soft">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                How it works
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Three simple steps to start learning a language that fits your life.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {steps.map((step, i) => (
                <div key={step.number} className="text-center">
                  <div className="w-16 h-16 rounded-2xl gradient-warm flex items-center justify-center mx-auto mb-5 shadow-warm">
                    <step.icon className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <span className="font-display text-sm font-bold text-primary/40 tracking-widest">{step.number}</span>
                  <h3 className="font-display font-semibold text-foreground text-xl mt-1 mb-3">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">{step.description}</p>
                  {i < steps.length - 1 && (
                    <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2">
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 md:py-28 bg-background">
          <div className="container mx-auto px-6">
            <div className="max-w-2xl mx-auto text-center gradient-warm rounded-3xl p-12 md:p-16 shadow-warm">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
                Ready to learn your way?
              </h2>
              <p className="text-primary-foreground/80 text-lg mb-8">
                Join thousands of learners who study languages tailored to their real lives.
              </p>

              <SignUpButton mode="redirect" forceRedirectUrl="/workspace">
                <button className="bg-primary-foreground text-foreground font-semibold px-8 py-3.5 rounded-xl hover:bg-primary-foreground/90 transition-colors text-base shadow-lg">
                  Get Started with Lorito
                </button>
              </SignUpButton>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border py-12 bg-background">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg gradient-warm flex items-center justify-center">
                  <span className="font-display font-bold text-primary-foreground text-xs">L</span>
                </div>
                <span className="font-display font-bold text-lg text-foreground">Lorito</span>
              </div>

              <div className="flex items-center gap-8">
                <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
                <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
              </div>

              <p className="text-sm text-muted-foreground">© 2026 Lorito. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}