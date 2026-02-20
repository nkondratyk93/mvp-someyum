"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView, useMotionValue, useTransform } from "framer-motion";
import {
  Brain,
  Zap,
  Grid3X3,
  Users,
  Image,
  MapPin,
  Star,
  ArrowRight,
  ChefHat,
  Flame,
} from "lucide-react";

// A/B Testing
const variants = {
  A: { headline: "Swipe Right on Recipes You Love", subtitle: "Beat mealtime indecision in 30 seconds! Swipe through 10,000+ recipes like dating profiles. Our AI learns your taste and suggests perfect meals. No signup needed.", cta: "Start Swiping" },
  B: { headline: "Your Next Meal is One Swipe Away", subtitle: "10,000+ recipes. AI that learns your taste. Zero signup.", cta: "Find Your Next Meal" }
};

function useABVariant() {
  const [variant] = useState<'A' | 'B'>(() => {
    if (typeof window === 'undefined') return 'A';
    const stored = document.cookie.match(/ab_variant=([AB])/);
    if (stored) return stored[1] as 'A' | 'B';
    const v = Math.random() < 0.5 ? 'A' : 'B';
    document.cookie = `ab_variant=${v};path=/;max-age=${60*60*24*30}`;
    if (window.gtag) window.gtag('event', 'ab_impression', { variant: v });
    return v;
  });
  return variant;
}

// Emoji Rain Component
function EmojiRain() {
  const emojis = ["🍕", "🍔", "🍣", "🥗", "🍰", "🌮", "🍜", "🥑", "🍱", "🫕"];
  const items = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    emoji: emojis[i % emojis.length],
    left: `${(i * 5.1) % 100}%`,
    delay: `${(i * 0.7) % 8}s`,
    duration: `${8 + (i % 6)}s`,
    size: `${1.5 + (i % 3) * 0.5}rem`,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {items.map((item) => (
        <span
          key={item.id}
          className="emoji-rain-item"
          style={{
            left: item.left,
            animationDelay: item.delay,
            animationDuration: item.duration,
            fontSize: item.size,
            opacity: 0.35,
          }}
        >
          {item.emoji}
        </span>
      ))}
    </div>
  );
}

// Animated Recipe Card (Hero)
function HeroRecipeCard() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [8, -8]);
  const rotateY = useTransform(x, [-100, 100], [-8, 8]);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      className="relative w-72 md:w-80 cursor-pointer mx-auto"
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ y: [0, -12, 0], rotate: [-1, 1, -1] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      <div className="rounded-3xl overflow-hidden border border-orange-900/40 shadow-2xl"
        style={{ background: "linear-gradient(135deg, #1A1A1A 0%, #252525 100%)" }}>
        {/* Recipe Image Placeholder */}
        <div className="h-52 relative overflow-hidden gradient-food flex items-center justify-center">
          <span className="text-7xl">🍜</span>
          {/* Swipe indicators */}
          <div className="absolute left-4 top-4 bg-red-500/80 text-white text-xs font-bold px-3 py-1 rounded-full rotate-[-15deg] opacity-0 transition-opacity" id="nope-label">NOPE</div>
          <div className="absolute right-4 top-4 bg-green-500/80 text-white text-xs font-bold px-3 py-1 rounded-full rotate-[15deg] opacity-0" id="like-label">LIKE ❤️</div>
          <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-[#1A1A1A] to-transparent" />
        </div>
        {/* Card Details */}
        <div className="p-5 pt-3">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-white font-bold text-xl leading-tight">Thai Basil Chicken</h3>
              <p className="text-orange-400 text-sm font-medium">Asian · Medium · ⏱ 25 min</p>
            </div>
            <div className="text-2xl">🌶️</div>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed mb-4">
            Fragrant basil, spicy chilies, tender chicken over jasmine rice. A weeknight hero.
          </p>
          <div className="flex gap-2">
            <span className="bg-orange-500/20 text-orange-400 text-xs px-2 py-1 rounded-full border border-orange-500/30">Spicy</span>
            <span className="bg-orange-500/20 text-orange-400 text-xs px-2 py-1 rounded-full border border-orange-500/30">High Protein</span>
            <span className="bg-orange-500/20 text-orange-400 text-xs px-2 py-1 rounded-full border border-orange-500/30">Asian</span>
          </div>
        </div>
        {/* Swipe Controls */}
        <div className="flex gap-4 p-4 pt-0 justify-center">
          <div className="w-14 h-14 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center text-2xl cursor-pointer hover:bg-red-500/30 transition-colors">
            ❌
          </div>
          <div className="w-14 h-14 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center text-2xl cursor-pointer hover:bg-green-500/30 transition-colors">
            ❤️
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Stats Counter
function StatItem({ value, label, icon }: { value: string; label: string; icon: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="text-center px-6 py-4"
    >
      <div className="text-3xl mb-1">{icon}</div>
      <div className="text-2xl md:text-3xl font-black text-orange-400">{value}</div>
      <div className="text-sm text-gray-400 mt-1">{label}</div>
    </motion.div>
  );
}

// Feature Card
function FeatureCard({
  icon,
  title,
  desc,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  delay: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      className="feature-card bg-[#1A1A1A] border border-orange-900/30 rounded-2xl p-6 transition-all duration-300"
    >
      <div className="w-12 h-12 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 mb-4">
        {icon}
      </div>
      <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
    </motion.div>
  );
}

// Testimonial Card
function TestimonialCard({
  name,
  location,
  text,
  delay,
}: {
  name: string;
  location: string;
  text: string;
  delay: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 30 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      className="flex-shrink-0 w-80 bg-[#1A1A1A] border border-orange-900/30 rounded-2xl p-6"
    >
      <div className="flex text-yellow-400 mb-3">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={14} fill="currentColor" />
        ))}
      </div>
      <p className="text-gray-300 text-sm leading-relaxed mb-4">"{text}"</p>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-orange-500/30 flex items-center justify-center text-sm font-bold text-orange-400">
          {name[0]}
        </div>
        <div>
          <div className="text-white text-sm font-semibold">{name}</div>
          <div className="text-gray-500 text-xs">{location}</div>
        </div>
      </div>
    </motion.div>
  );
}

// Blog Card
function BlogCard({
  emoji,
  title,
  gradientClass,
  delay,
}: {
  emoji: string;
  title: string;
  gradientClass: string;
  delay: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      className="feature-card bg-[#1A1A1A] border border-orange-900/30 rounded-2xl overflow-hidden cursor-pointer group"
    >
      <div className={`h-40 ${gradientClass} flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-300`}>
        {emoji}
      </div>
      <div className="p-5">
        <div className="text-xs text-orange-400 font-medium mb-2">TRENDING</div>
        <h3 className="text-white font-bold text-base leading-snug">{title}</h3>
        <div className="flex items-center gap-1 mt-3 text-orange-400 text-sm font-medium group-hover:gap-2 transition-all">
          Read more <ArrowRight size={14} />
        </div>
      </div>
    </motion.div>
  );
}

export default function LandingPage() {
  const variant = useABVariant();
  const v = variants[variant];

  function trackCta() {
    if (window.gtag) window.gtag('event', 'ab_cta_click', { variant });
  }

  return (
    <main className="min-h-screen bg-[#0F0F0F] text-[#FAFAFA] overflow-x-hidden">
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-16 px-4 overflow-hidden">
        <EmojiRain />

        {/* Nav */}
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-[#0F0F0F]/80 backdrop-blur-md border-b border-orange-900/20">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🍽️</span>
            <span className="text-xl font-black text-white">SomeYum</span>
          </div>
          <Link
            href="/app"
            onClick={trackCta}
            className="bg-[#FF6B35] hover:bg-orange-500 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all hover:shadow-lg hover:shadow-orange-500/30"
          >
            Start Swiping →
          </Link>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 text-center max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 rounded-full px-4 py-1.5 text-orange-400 text-sm font-medium mb-6"
          >
            <Flame size={14} />
            52,000+ people swiping right now
          </motion.div>

          <motion.h1
            key={variant}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-black leading-tight mb-4 tracking-tight"
          >
            {v.headline}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-400 mb-8 max-w-2xl mx-auto"
          >
            {v.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Link
              href="/app"
              onClick={trackCta}
              className="pulse-glow inline-flex items-center justify-center gap-2 bg-[#FF6B35] hover:bg-orange-500 text-white font-bold px-8 py-4 rounded-2xl text-lg transition-all hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/40"
            >
              {v.cta} <ArrowRight size={20} />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 border border-orange-900/50 hover:border-orange-500/50 text-gray-300 hover:text-white font-semibold px-8 py-4 rounded-2xl text-lg transition-all"
            >
              See How It Works
            </a>
          </motion.div>

          {/* Hero Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <HeroRecipeCard />
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <div className="w-6 h-10 border-2 border-orange-900/50 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-orange-400 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* ── STATS BAR ─────────────────────────────────────────────────────── */}
      <section className="border-y border-orange-900/30 bg-[#1A1A1A]/60">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 divide-x divide-orange-900/30">
          <StatItem value="52K+" label="Daily Swipers" icon="👥" />
          <StatItem value="10K+" label="Recipes" icon="📖" />
          <StatItem value="30s" label="To Decide" icon="⚡" />
          <StatItem value="45+" label="Cuisines" icon="🌍" />
          <StatItem value="5-120" label="Min Cook Times" icon="⏱️" />
          <StatItem value="15+" label="Dietary Options" icon="🥗" />
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────────────────────── */}
      <section className="py-24 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 rounded-full px-4 py-1.5 text-orange-400 text-sm font-medium mb-4"
          >
            <Zap size={14} /> Features
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-white mb-4"
          >
            Everything you need to love
            <br />
            <span className="text-orange-400">what you eat</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            icon={<Brain size={22} />}
            title="Smart AI Recommendations"
            desc="No signup needed. Our AI learns what you love with every swipe, building a unique taste profile just for you."
            delay={0}
          />
          <FeatureCard
            icon={<Zap size={22} />}
            title="Tinder-Style Swiping"
            desc="Swipe right to save, left to skip. Build your personal recipe collection faster than ordering takeout."
            delay={0.1}
          />
          <FeatureCard
            icon={<Grid3X3 size={22} />}
            title="All Recipe Categories"
            desc="Sweet, Savory, Healthy, Comfort Food — filter by mood, cuisine, or dietary preference in seconds."
            delay={0.2}
          />
          <FeatureCard
            icon={<Users size={22} />}
            title="Multiple Cooking Modes"
            desc="Cook for yourself, your partner, or the whole family. Portions and complexity adapt to your needs."
            delay={0.3}
          />
          <FeatureCard
            icon={<Image size={22} />}
            title="Beautiful Recipe Cards"
            desc="Stunning food photography with complete recipe details — ingredients, steps, nutrition, all in one place."
            delay={0.4}
          />
          <FeatureCard
            icon={<MapPin size={22} />}
            title="Location-Aware Suggestions"
            desc="Discover popular dishes in your region. Local favorites bubble up based on what your neighbors love."
            delay={0.5}
          />
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 px-4 bg-[#111] border-y border-orange-900/20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-black text-white mb-4"
            >
              How It Works
            </motion.h2>
            <p className="text-gray-400 text-lg">Three steps to meal enlightenment</p>
          </div>

          <div className="relative">
            {/* Connecting line */}
            <div className="absolute left-8 md:left-1/2 top-8 bottom-8 w-0.5 bg-gradient-to-b from-orange-500 to-orange-500/10 md:-translate-x-px hidden md:block" />

            <div className="space-y-12">
              {[
                {
                  step: "01",
                  title: "Start Swiping Instantly",
                  desc: "No account, no signup, no friction. Open the app and immediately start discovering recipes tailored to your preferences.",
                  emoji: "⚡",
                  side: "left",
                },
                {
                  step: "02",
                  title: "AI Learns Your Taste",
                  desc: "Every swipe teaches our Bayesian AI engine about your preferences. After just 10 swipes, recommendations become personalized to you.",
                  emoji: "🧠",
                  side: "right",
                },
                {
                  step: "03",
                  title: "Save & Cook Favorites",
                  desc: "Your saved recipes build into a personal cookbook. Filter by cook time, difficulty, and ingredients on hand.",
                  emoji: "👨‍🍳",
                  side: "left",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: item.side === "left" ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className={`flex items-center gap-8 ${
                    item.side === "right" ? "md:flex-row-reverse" : "md:flex-row"
                  } flex-row`}
                >
                  <div className="flex-shrink-0 relative z-10">
                    <div className="w-16 h-16 rounded-2xl bg-[#1A1A1A] border-2 border-orange-500 flex items-center justify-center text-3xl shadow-lg shadow-orange-500/20">
                      {item.emoji}
                    </div>
                  </div>
                  <div className={`bg-[#1A1A1A] border border-orange-900/30 rounded-2xl p-6 flex-1`}>
                    <div className="text-orange-500 text-sm font-black mb-1">STEP {item.step}</div>
                    <h3 className="text-white text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── AI SECTION ────────────────────────────────────────────────────── */}
      <section className="py-24 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 rounded-full px-4 py-1.5 text-orange-400 text-sm font-medium mb-4"
          >
            <Brain size={14} /> AI Technology
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-white mb-4"
          >
            Powered by{" "}
            <span className="text-orange-400">Intelligent AI</span>
          </motion.h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Our proprietary Bayesian inference algorithm builds a unique taste profile from every interaction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              icon: "🧠",
              title: "Progressive Learning",
              desc: "Gets smarter with every swipe. After 10 swipes, recommendations become eerily accurate.",
            },
            {
              icon: "👤",
              title: "Unique Taste Profile",
              desc: "No two users get the same experience. Your profile is built on YOUR preferences, not averages.",
            },
            {
              icon: "📍",
              title: "Location Aware",
              desc: "Regional favorites and seasonal ingredients factor into every recommendation.",
            },
            {
              icon: "🕐",
              title: "Time-Based Suggestions",
              desc: "Breakfast ideas at 8am, dinner inspiration at 6pm. Context-aware recommendations that make sense.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="feature-card bg-[#1A1A1A] border border-orange-900/30 rounded-2xl p-6 flex gap-4 transition-all duration-300"
            >
              <div className="text-3xl flex-shrink-0">{item.icon}</div>
              <div>
                <h3 className="text-white font-bold text-lg mb-1">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── BLOG / TRENDING ───────────────────────────────────────────────── */}
      <section className="py-24 px-4 bg-[#111] border-y border-orange-900/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-black text-white mb-4"
            >
              🔥 Trending This Week
            </motion.h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <BlogCard
              emoji="🍽️"
              title="10 Most-Swiped Dinner Recipes This Week"
              gradientClass="gradient-food"
              delay={0}
            />
            <BlogCard
              emoji="🥞"
              title="5-Minute Breakfast Ideas You'll Actually Make"
              gradientClass="gradient-purple"
              delay={0.1}
            />
            <BlogCard
              emoji="💕"
              title="Date Night Recipes: Our Most Romantic Swipes"
              gradientClass="gradient-pink"
              delay={0.2}
            />
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────────────────── */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-black text-white mb-4"
            >
              Home Cooks{" "}
              <span className="text-orange-400">Love It</span>
            </motion.h2>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
            <TestimonialCard
              name="Sarah M."
              location="Boston, MA"
              text="Swiped right on Thai Basil Chicken and learned I love spicy food after just 10 swipes. Game changer for weeknight dinners!"
              delay={0}
            />
            <TestimonialCard
              name="Mike D."
              location="Seattle, WA"
              text="Found tonight's dinner in 30 seconds — Honey Garlic Salmon. Kids absolutely loved it! This app is witchcraft."
              delay={0.1}
            />
            <TestimonialCard
              name="Emma L."
              location="New York, NY"
              text="Swiped through 100+ recipes and saved 23 favorites in my first week! My meal planning has never been easier."
              delay={0.2}
            />
            <TestimonialCard
              name="James K."
              location="Austin, TX"
              text="I used to spend 20 minutes deciding what to cook. Now? 30 seconds and I'm excited about my meal. Total game changer."
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────────────────── */}
      <section className="py-24 px-4 bg-[#111] border-t border-orange-900/20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-[#1A1A1A] to-[#141414] border border-orange-900/30 rounded-3xl p-12"
          >
            <div className="text-6xl mb-6">🍽️</div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Beat Mealtime Indecision{" "}
              <span className="text-orange-400">Today!</span>
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-lg mx-auto">
              Join 52,000+ home cooks swiping daily. No signup, no credit card, no excuses.
            </p>
            <Link
              href="/app"
              onClick={trackCta}
              className="pulse-glow inline-flex items-center gap-2 bg-[#FF6B35] hover:bg-orange-500 text-white font-black text-xl px-10 py-5 rounded-2xl transition-all hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/40"
            >
              <ChefHat size={24} /> Start Swiping Free
            </Link>
            <p className="text-gray-600 text-sm mt-4">No signup required · Free forever · 10,000+ recipes</p>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer className="border-t border-orange-900/20 py-10 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🍽️</span>
            <span className="font-black text-white">SomeYum</span>
            <span className="text-gray-600 text-sm">— Tinder for Food Recipes</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <Link href="/privacy" className="hover:text-orange-400 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-orange-400 transition-colors">Terms</Link>
            <a href="https://no-humans.app" target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition-colors">
              Built by no-humans.app
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
