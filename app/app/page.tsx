"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { Heart, X, ArrowLeft, BookOpen, Clock, Flame, MessageSquare } from "lucide-react";
import { RECIPES, Recipe } from "@/lib/recipes";

// Load/save favorites from localStorage
function loadFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem("someyum_favorites");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveFavorites(ids: string[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem("someyum_favorites", JSON.stringify(ids));
}

function loadSeen(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem("someyum_seen");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveSeen(ids: string[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem("someyum_seen", JSON.stringify(ids));
}

// Swipe Card Component
function RecipeCard({
  recipe,
  onSwipe,
  isTop,
  zIndex,
}: {
  recipe: Recipe;
  onSwipe: (direction: "left" | "right") => void;
  isTop: boolean;
  zIndex: number;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-20, 20]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  // Overlay indicators
  const likeOpacity = useTransform(x, [0, 80], [0, 1]);
  const nopeOpacity = useTransform(x, [-80, 0], [1, 0]);

  const dragEndHandler = useCallback(() => {
    const currentX = x.get();
    if (currentX > 100) {
      onSwipe("right");
    } else if (currentX < -100) {
      onSwipe("left");
    }
  }, [x, onSwipe]);

  if (!isTop) {
    return (
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        style={{ zIndex }}
        initial={{ scale: 0.93, y: 16 }}
        animate={{ scale: 0.96, y: 8 }}
      >
        <div className="w-full max-w-sm bg-[#1A1A1A] border border-orange-900/30 rounded-3xl overflow-hidden shadow-xl">
          <div className={`h-64 bg-gradient-to-br ${recipe.gradient} flex items-center justify-center`}>
            <span className="text-8xl">{recipe.emoji}</span>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      style={{ zIndex, x, rotate, opacity }}
      drag="x"
      dragConstraints={{ left: -300, right: 300 }}
      dragElastic={0.8}
      onDragEnd={dragEndHandler}
      whileTap={{ cursor: "grabbing" }}
    >
      <div className="w-full max-w-sm bg-[#1A1A1A] border border-orange-900/30 rounded-3xl overflow-hidden shadow-2xl cursor-grab select-none">
        {/* Image area */}
        <div className={`h-64 bg-gradient-to-br ${recipe.gradient} flex items-center justify-center relative`}>
          <span className="text-8xl drop-shadow-2xl">{recipe.emoji}</span>
          {/* Swipe Indicators */}
          <motion.div
            className="absolute left-4 top-4 bg-green-500 text-white font-black text-lg px-4 py-2 rounded-2xl border-4 border-green-400 shadow-lg rotate-[-15deg]"
            style={{ opacity: likeOpacity }}
          >
            ❤️ SAVE
          </motion.div>
          <motion.div
            className="absolute right-4 top-4 bg-red-500 text-white font-black text-lg px-4 py-2 rounded-2xl border-4 border-red-400 shadow-lg rotate-[15deg]"
            style={{ opacity: nopeOpacity }}
          >
            ❌ SKIP
          </motion.div>

          {/* Bottom gradient */}
          <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-[#1A1A1A] to-transparent" />
        </div>

        {/* Card content */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h2 className="text-2xl font-black text-white leading-tight">{recipe.name}</h2>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-orange-400 text-sm font-semibold">{recipe.cuisine}</span>
                <span className="text-gray-600">·</span>
                <span className="flex items-center gap-1 text-gray-400 text-sm">
                  <Clock size={12} /> {recipe.cookTime} min
                </span>
                <span className="text-gray-600">·</span>
                <span className={`text-sm font-medium ${
                  recipe.difficulty === "Easy" ? "text-green-400" :
                  recipe.difficulty === "Medium" ? "text-yellow-400" : "text-red-400"
                }`}>
                  {recipe.difficulty}
                </span>
              </div>
            </div>
            <div className="text-3xl">{recipe.emoji}</div>
          </div>

          <p className="text-gray-400 text-sm leading-relaxed mb-4">{recipe.description}</p>

          <div className="flex items-center gap-2 mb-4 flex-wrap">
            {recipe.tags.map((tag) => (
              <span key={tag} className="bg-orange-500/15 text-orange-400 text-xs px-2.5 py-1 rounded-full border border-orange-500/25">
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500 border-t border-orange-900/20 pt-3">
            <span className="flex items-center gap-1"><Flame size={12} className="text-orange-400" /> {recipe.calories} cal</span>
            <span>{recipe.servings} serving{recipe.servings > 1 ? "s" : ""}</span>
            <span className="bg-[#111] px-2 py-1 rounded-lg">{recipe.category}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Favorites Drawer
function FavoritesDrawer({
  favorites,
  onClose,
}: {
  favorites: Recipe[];
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed inset-y-0 right-0 w-full md:w-96 bg-[#1A1A1A] border-l border-orange-900/30 z-50 flex flex-col shadow-2xl"
    >
      <div className="flex items-center justify-between p-6 border-b border-orange-900/20">
        <div className="flex items-center gap-2">
          <Heart size={20} className="text-green-400 fill-green-400" />
          <h2 className="text-white font-bold text-lg">Saved Recipes</h2>
          <span className="bg-green-500/20 text-green-400 text-xs px-2 py-0.5 rounded-full">{favorites.length}</span>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {favorites.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">💔</div>
            <p className="text-gray-400 text-sm">No saved recipes yet.</p>
            <p className="text-gray-600 text-xs mt-1">Swipe right on something you love!</p>
          </div>
        ) : (
          favorites.map((recipe) => (
            <div
              key={recipe.id}
              className="flex items-center gap-3 bg-[#111] border border-orange-900/20 rounded-2xl p-3"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${recipe.gradient} flex items-center justify-center text-xl flex-shrink-0`}>
                {recipe.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white font-semibold text-sm truncate">{recipe.name}</div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-orange-400 text-xs">{recipe.cuisine}</span>
                  <span className="text-gray-600 text-xs">· {recipe.cookTime} min</span>
                </div>
              </div>
              <div className="text-green-400">
                <Heart size={14} fill="currentColor" />
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}

// Feedback Widget
const FEEDBACK_KEY = "feedback_someyum";

function FeedbackWidget() {
  const [state, setState] = useState<"ask" | "comment" | "done">("ask");
  const [comment, setComment] = useState("");
  const [helpful, setHelpful] = useState(47);

  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem(FEEDBACK_KEY) || "{}");
      setHelpful(data.helpful ?? 47);
      if (data.submitted) setState("done");
    } catch {
      setHelpful(47);
    }
  }, []);

  const submit = (yes: boolean) => {
    const newCount = yes ? helpful + 1 : helpful;
    setHelpful(newCount);
    setState("comment");
  };

  const submitComment = () => {
    localStorage.setItem(FEEDBACK_KEY, JSON.stringify({ helpful, comment, submitted: true }));
    setState("done");
  };

  if (state === "done") {
    return (
      <div className="text-center py-4 text-sm text-gray-500">
        <MessageSquare size={14} className="inline mr-1" />
        {helpful} people found this helpful
      </div>
    );
  }

  if (state === "comment") {
    return (
      <div className="text-center py-4 space-y-3">
        <p className="text-sm text-gray-400">Any feedback? (optional)</p>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full max-w-xs mx-auto block bg-[#111] border border-orange-900/30 rounded-lg p-2 text-sm text-white resize-none h-20 focus:outline-none focus:border-orange-500"
          placeholder="Tell us what you think..."
        />
        <button
          onClick={submitComment}
          className="bg-[#FF6B35] hover:bg-orange-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          Submit
        </button>
      </div>
    );
  }

  return (
    <div className="text-center py-4 space-y-2">
      <p className="text-sm text-gray-400">Was this tool helpful?</p>
      <div className="flex gap-3 justify-center">
        <button
          onClick={() => submit(true)}
          className="border border-green-500/30 text-green-400 hover:bg-green-500/10 text-sm px-4 py-1.5 rounded-lg transition-colors"
        >
          👍 Yes
        </button>
        <button
          onClick={() => submit(false)}
          className="border border-red-500/30 text-red-400 hover:bg-red-500/10 text-sm px-4 py-1.5 rounded-lg transition-colors"
        >
          👎 No
        </button>
      </div>
    </div>
  );
}

export default function AppPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [seenIds, setSeenIds] = useState<string[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [swipeFlash, setSwipeFlash] = useState<"left" | "right" | null>(null);
  const [swipeCount, setSwipeCount] = useState(0);

  // Init
  useEffect(() => {
    const seen = loadSeen();
    const favs = loadFavorites();
    setSeenIds(seen);
    setFavoriteIds(favs);

    // Filter out seen recipes, shuffle remaining
    const unseen = RECIPES.filter((r) => !seen.includes(r.id));
    const shuffled = unseen.sort(() => Math.random() - 0.5);
    setRecipes(shuffled.length > 0 ? shuffled : [...RECIPES].sort(() => Math.random() - 0.5));
    setCurrentIndex(0);
  }, []);

  const handleSwipe = useCallback((direction: "left" | "right") => {
    if (currentIndex >= recipes.length) return;

    const recipe = recipes[currentIndex];
    setSwipeFlash(direction);
    setTimeout(() => setSwipeFlash(null), 600);

    // Track in seen
    const newSeen = [...seenIds, recipe.id];
    setSeenIds(newSeen);
    saveSeen(newSeen);

    // Track favorites
    if (direction === "right") {
      const newFavs = [...favoriteIds, recipe.id];
      setFavoriteIds(newFavs);
      saveFavorites(newFavs);
    }

    setSwipeCount((c) => c + 1);
    setCurrentIndex((i) => i + 1);
  }, [currentIndex, recipes, seenIds, favoriteIds]);

  const handleReset = () => {
    const shuffled = [...RECIPES].sort(() => Math.random() - 0.5);
    setRecipes(shuffled);
    setCurrentIndex(0);
    setSeenIds([]);
    saveSeen([]);
  };

  const currentRecipe = recipes[currentIndex];
  const nextRecipe = recipes[currentIndex + 1];
  const isFinished = currentIndex >= recipes.length;

  const favoriteRecipes = RECIPES.filter((r) => favoriteIds.includes(r.id));

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex flex-col">
      {/* Flash overlay */}
      <AnimatePresence>
        {swipeFlash && (
          <motion.div
            key={swipeFlash}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className={`fixed inset-0 z-50 pointer-events-none ${
              swipeFlash === "right"
                ? "bg-green-500/20 border-4 border-green-500/40"
                : "bg-red-500/20 border-4 border-red-500/40"
            }`}
          />
        )}
      </AnimatePresence>

      {/* Favorites Drawer */}
      <AnimatePresence>
        {showFavorites && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40"
              onClick={() => setShowFavorites(false)}
            />
            <FavoritesDrawer
              favorites={favoriteRecipes}
              onClose={() => setShowFavorites(false)}
            />
          </>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="flex items-center justify-between px-4 py-4 border-b border-orange-900/20 bg-[#0F0F0F]/80 backdrop-blur-md">
        <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft size={18} />
          <span className="text-sm font-medium hidden sm:block">Back</span>
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-xl">🍽️</span>
          <span className="font-black text-white">SomeYum</span>
        </div>
        <button
          onClick={() => setShowFavorites(true)}
          className="flex items-center gap-2 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 text-green-400 rounded-xl px-3 py-2 text-sm font-semibold transition-all"
        >
          <BookOpen size={15} />
          <span className="hidden sm:block">Saved</span>
          {favoriteIds.length > 0 && (
            <span className="bg-green-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
              {favoriteIds.length}
            </span>
          )}
        </button>
      </header>

      {/* Progress */}
      <div className="h-1 bg-[#1A1A1A]">
        <motion.div
          className="h-full bg-gradient-to-r from-orange-500 to-orange-400"
          animate={{ width: `${Math.min(100, (currentIndex / recipes.length) * 100)}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Swipe counter */}
      <div className="flex items-center justify-center gap-6 py-3 text-xs text-gray-500">
        <span>⬅️ {seenIds.length - favoriteIds.length} skipped</span>
        <span className="text-orange-400 font-semibold">{recipes.length - currentIndex} left</span>
        <span>❤️ {favoriteIds.length} saved</span>
      </div>

      {/* Card Area */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-4">
        {isFinished ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-sm"
          >
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-black text-white mb-2">You've seen them all!</h2>
            <p className="text-gray-400 text-sm mb-6">
              You saved <span className="text-green-400 font-bold">{favoriteIds.length}</span> recipes from{" "}
              <span className="text-orange-400 font-bold">{swipeCount}</span> swipes.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleReset}
                className="w-full bg-[#FF6B35] hover:bg-orange-500 text-white font-bold py-3 rounded-2xl transition-all"
              >
                🔄 See More Recipes
              </button>
              <button
                onClick={() => setShowFavorites(true)}
                className="w-full border border-green-500/40 text-green-400 hover:bg-green-500/10 font-bold py-3 rounded-2xl transition-all flex items-center justify-center gap-2"
              >
                <BookOpen size={16} /> View {favoriteIds.length} Saved Recipes
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="relative w-full max-w-sm" style={{ height: "580px" }}>
            {/* Next card preview */}
            {nextRecipe && (
              <RecipeCard
                key={`next-${nextRecipe.id}`}
                recipe={nextRecipe}
                onSwipe={() => {}}
                isTop={false}
                zIndex={1}
              />
            )}
            {/* Top card */}
            {currentRecipe && (
              <AnimatePresence mode="wait">
                <RecipeCard
                  key={`top-${currentRecipe.id}`}
                  recipe={currentRecipe}
                  onSwipe={handleSwipe}
                  isTop={true}
                  zIndex={2}
                />
              </AnimatePresence>
            )}
          </div>
        )}
      </div>

      {/* Control Buttons */}
      {!isFinished && currentRecipe && (
        <div className="flex items-center justify-center gap-6 py-6 px-4">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => handleSwipe("left")}
            className="w-16 h-16 rounded-full bg-[#1A1A1A] border-2 border-red-500/50 flex items-center justify-center text-2xl hover:bg-red-500/10 hover:border-red-500 transition-all shadow-lg"
          >
            ❌
          </motion.button>
          <div className="text-center">
            <div className="text-xs text-gray-600 mb-1">drag or tap</div>
            <div className="text-2xl">👆</div>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => handleSwipe("right")}
            className="w-16 h-16 rounded-full bg-[#1A1A1A] border-2 border-green-500/50 flex items-center justify-center text-2xl hover:bg-green-500/10 hover:border-green-500 transition-all shadow-lg"
          >
            ❤️
          </motion.button>
        </div>
      )}

      {/* Hint bar */}
      {!isFinished && currentRecipe && swipeCount === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="text-center pb-4 text-xs text-gray-600"
        >
          👈 Drag the card left to skip · right to save ❤️
        </motion.div>
      )}

      {/* Feedback */}
      <div className="border-t border-orange-900/20 px-4">
        <FeedbackWidget />
      </div>
    </div>
  );
}
