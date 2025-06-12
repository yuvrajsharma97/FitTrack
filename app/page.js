"use client";
import Link from "next/link";
import {
  ArrowRight,
  Target,
  TrendingUp,
  Users,
  Github,
  Twitter,
  Instagram,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-violet-50 to-indigo-100 dark:from-violet-950/20 dark:to-indigo-950/20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Transform Your
            <span className="text-violet-500 block">Fitness Journey</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            &quot;The groundwork for all happiness is good health.&quot; - Leigh
            Hunt
          </p>
          <p className="text-lg text-muted-foreground mb-10 max-w-3xl mx-auto">
            Track your workouts, visualize your progress, and achieve your
            fitness goals with our comprehensive fitness tracking platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="bg-violet-500 text-white px-8 py-4 rounded-lg hover:bg-violet-600 transition-colors inline-flex items-center justify-center space-x-2 font-semibold">
              <span>Start Your Journey</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/auth/login"
              className="border border-border px-8 py-4 rounded-lg hover:bg-accent transition-colors inline-flex items-center justify-center font-semibold">
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Why Choose FitTrack?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to stay motivated and track your fitness
              progress in one place.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-xl shadow-sm border border-border hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-violet-100 dark:bg-violet-900/20 rounded-lg flex items-center justify-center mb-6">
                <Target className="h-6 w-6 text-violet-500" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Track Workouts
              </h3>
              <p className="text-muted-foreground">
                Log your exercises, sets, and reps with our intuitive workout
                tracking system. Never lose track of your progress again.
              </p>
            </div>

            <div className="bg-card p-8 rounded-xl shadow-sm border border-border hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-violet-100 dark:bg-violet-900/20 rounded-lg flex items-center justify-center mb-6">
                <TrendingUp className="h-6 w-6 text-violet-500" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Visualize Progress
              </h3>
              <p className="text-muted-foreground">
                See your improvements over time with detailed charts and
                analytics. Watch your strength and endurance grow.
              </p>
            </div>

            <div className="bg-card p-8 rounded-xl shadow-sm border border-border hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-violet-100 dark:bg-violet-900/20 rounded-lg flex items-center justify-center mb-6">
                <Users className="h-6 w-6 text-violet-500" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Personalized Splits
              </h3>
              <p className="text-muted-foreground">
                Get customized workout plans tailored to your goals. From
                beginner to advanced, we&apos;ve got you covered.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <span className="font-bold text-xl">FitTrack</span>
            </div>
            <div className="flex space-x-6">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-violet-500 transition-colors">
                <Github className="h-6 w-6" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-violet-500 transition-colors">
                <Twitter className="h-6 w-6" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-violet-500 transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center text-muted-foreground">
            <p>&copy; 2024 FitTrack. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
