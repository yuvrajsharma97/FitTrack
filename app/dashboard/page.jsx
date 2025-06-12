"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "../../components/ProtectedRoute";
import { Calendar, Dumbbell, Filter, Plus } from "lucide-react";
import Link from "next/link";
import { db } from "../../lib/Firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default function Dashboard() {
  const [workoutSplits, setWorkoutSplits] = useState([]);
  const [filterMuscle, setFilterMuscle] = useState("all");
  const [loading, setLoading] = useState(true);
  const [streak, setStreak] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [totalSetsThisMonth, setTotalSetsThisMonth] = useState(0);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        // Get workout splits (static plan)
        const workoutRef = doc(db, "workouts", "fiveDaySplit");
        const workoutSnap = await getDoc(workoutRef);
        if (workoutSnap.exists()) {
          const data = workoutSnap.data();
          const formattedSplits = data.days.map((day, idx) => ({
            id: idx.toString(),
            day: day.day || `Day ${idx + 1}`,
            title: day.title || "",
            focus: day.focus || "",
            exercises: day.exercises || [],
            completed: false,
          }));
          setWorkoutSplits(formattedSplits);
        }

        // Get or initialize user workout stats
        const statsRef = doc(db, "users", user.uid, "workoutStats", "summary");
        const statsSnap = await getDoc(statsRef);

        if (statsSnap.exists()) {
          const stats = statsSnap.data();
          setStreak(stats.streak || 0);
          setLastUpdated(stats.lastUpdated || null);
          setTotalSetsThisMonth(stats.totalSetsThisMonth || 0);
        } else {
          await setDoc(statsRef, {
            attended: false,
            streak: 0,
            lastUpdated: null,
            totalSetsThisMonth: 0,
          });
        }
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleStartWorkout = async (id, setsThisWorkout = 12) => {
    if (!user) return;
    const today = new Date().toISOString().split("T")[0];

    const updatedSplits = workoutSplits.map((split) =>
      split.id === id ? { ...split, completed: true } : split
    );
    setWorkoutSplits(updatedSplits);

    if (lastUpdated !== today) {
      const newStreak = streak + 1;
      const newTotalSets = totalSetsThisMonth + setsThisWorkout;
      setStreak(newStreak);
      setLastUpdated(today);
      setTotalSetsThisMonth(newTotalSets);

      const ref = doc(db, "users", user.uid, "workoutStats", "summary");
      try {
        await updateDoc(ref, {
          attended: true,
          streak: newStreak,
          lastUpdated: today,
          totalSetsThisMonth: newTotalSets,
        });
      } catch (err) {
        console.error("Error updating workout stats:", err);
      }
    }
  };

  const filteredSplits = workoutSplits.filter((split) => {
    return (
      filterMuscle === "all" ||
      split.focus.toLowerCase().includes(filterMuscle.toLowerCase())
    );
  });

  const completedWorkouts = workoutSplits.filter(
    (split) => split.completed
  ).length;
  const totalWorkouts = workoutSplits.length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Loading your workout plan...
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground mb-6">
            Track your progress and stay consistent
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard
              title="This Week"
              value={`${completedWorkouts}/${totalWorkouts}`}
              subtitle="Workouts completed"
              icon={<Dumbbell className="h-6 w-6 text-violet-500" />}
            />
            <StatCard
              title="Current Streak"
              value={`${streak} days 🔥`}
              subtitle="Keep it up!"
              icon={<Calendar className="h-6 w-6 text-orange-500" />}
            />
            <StatCard
              title="Total Sets"
              value={totalSetsThisMonth}
              subtitle="This month"
              icon={<Plus className="h-6 w-6 text-green-500" />}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Filter className="h-5 w-5 my-auto text-muted-foreground" />
            <select
              value={filterMuscle}
              onChange={(e) => setFilterMuscle(e.target.value)}
              className="px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 bg-background">
              <option value="all">All Muscle Groups</option>
              <option value="chest">Chest</option>
              <option value="back">Back</option>
              <option value="legs">Legs</option>
              <option value="shoulders">Shoulders</option>
              <option value="arms">Arms</option>
            </select>
          </div>

          {filteredSplits.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredSplits.map((split) => (
                <div
                  key={split.id}
                  className={`bg-card p-6 rounded-xl shadow-sm border transition-all hover:shadow-md ${
                    split.completed
                      ? "border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20"
                      : "border-border hover:border-violet-200 dark:hover:border-violet-800"
                  }`}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-foreground">
                          {split.day}
                        </h3>
                        {split.completed && (
                          <span className="text-green-500 text-sm">✓</span>
                        )}
                      </div>
                      <h4 className="text-lg font-bold text-foreground mb-1">
                        {split.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {split.focus}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {split.exercises.map((exercise, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center py-1">
                        <span className="text-sm text-foreground">
                          {exercise.name}
                        </span>
                        <span className="text-sm text-muted-foreground font-mono">
                          {exercise.reps}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t border-border">
                    <button
                      onClick={() =>
                        handleStartWorkout(split.id, split.exercises.length)
                      }
                      disabled={split.completed}
                      className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                        split.completed
                          ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 cursor-not-allowed"
                          : "bg-violet-500 text-white hover:bg-violet-600"
                      }`}>
                      {split.completed ? "Completed" : "Start Workout"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Dumbbell className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No workout plans found
              </h3>
              <p className="text-muted-foreground mb-6">
                Get started by loading a default workout plan
              </p>
              <Link
                href="/load-plan"
                className="bg-violet-500 text-white px-6 py-3 rounded-lg hover:bg-violet-600 transition-colors inline-flex items-center space-x-2">
                <Plus className="h-5 w-5" />
                <span>Load Default Plan</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}

function StatCard({ title, value, subtitle, icon }) {
  return (
    <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
        <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-muted/20 dark:bg-muted/30">
          {icon}
        </div>
      </div>
    </div>
  );
}
