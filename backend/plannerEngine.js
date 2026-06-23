'use strict';

const MACRO_KEYS = ['calories', 'protein', 'carbs', 'fat'];
const ZERO = Object.freeze({ calories: 0, protein: 0, carbs: 0, fat: 0 });

function round(value, decimals = 0) {
  const factor = 10 ** decimals;
  return Math.round((Number(value) || 0) * factor) / factor;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, Number(value) || 0));
}

function emptyMacros() {
  return { ...ZERO };
}

function addMacros(a, b) {
  const out = emptyMacros();
  for (const key of MACRO_KEYS) out[key] = (Number(a?.[key]) || 0) + (Number(b?.[key]) || 0);
  return out;
}

function subtractMacros(a, b) {
  const out = emptyMacros();
  for (const key of MACRO_KEYS) out[key] = (Number(a?.[key]) || 0) - (Number(b?.[key]) || 0);
  return out;
}

function absMacroGap(macros) {
  return Math.abs(macros.calories || 0) + Math.abs(macros.protein || 0) * 14 + Math.abs(macros.carbs || 0) * 5 + Math.abs(macros.fat || 0) * 8;
}

function normalizeText(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function normalizeTarget(target = {}, fallback = {}) {
  const candidate = { ...fallback, ...target };
  const normalized = {
    calories: Number(candidate.calories) || 0,
    protein: Number(candidate.protein) || 0,
    carbs: Number(candidate.carbs) || 0,
    fat: Number(candidate.fat) || 0,
  };
  if (!normalized.calories) normalized.calories = Math.round(normalized.protein * 4 + normalized.carbs * 4 + normalized.fat * 9);
  return normalized;
}

function foodIndex(foods = []) {
  const byId = new Map();
  const byName = new Map();
  for (const food of foods || []) {
    if (!food) continue;
    if (food.id) byId.set(String(food.id), food);
    if (food.sourceId) byId.set(String(food.sourceId), food);
    for (const value of [food.name, food.displayNameEn, food.displayNameIt, ...(food.aliases || [])]) {
      const key = normalizeText(value);
      if (key && !byName.has(key)) byName.set(key, food);
    }
  }
  return { byId, byName };
}

function findFoodForItem(item, index) {
  if (!item) return null;
  for (const id of [item.foodId, item.sourceId, item.id]) {
    if (id && index.byId.has(String(id))) return index.byId.get(String(id));
  }
  for (const name of [item.foodName, item.rawName, item.name]) {
    const key = normalizeText(name);
    if (key && index.byName.has(key)) return index.byName.get(key);
  }
  return null;
}

function itemNutritionPer100g(item, index) {
  const direct = item?.nutritionPer100g || item?.per100g || null;
  const food = findFoodForItem(item, index);
  return {
    calories: Number(direct?.calories ?? item?.caloriesPer100g ?? food?.caloriesPer100g ?? 0) || 0,
    protein: Number(direct?.protein ?? item?.proteinPer100g ?? food?.proteinPer100g ?? 0) || 0,
    carbs: Number(direct?.carbs ?? item?.carbsPer100g ?? food?.carbsPer100g ?? 0) || 0,
    fat: Number(direct?.fat ?? item?.fatPer100g ?? food?.fatPer100g ?? 0) || 0,
  };
}

function calcItemMacros(item, index) {
  if (item?.macroSnapshot) return normalizeTarget(item.macroSnapshot);
  if (item?.actualMacroSnapshot) return normalizeTarget(item.actualMacroSnapshot);
  const per100 = itemNutritionPer100g(item, index);
  const grams = Number(item?.grams ?? item?.quantity ?? 0) || 0;
  const factor = grams / 100;
  return {
    calories: per100.calories * factor,
    protein: per100.protein * factor,
    carbs: per100.carbs * factor,
    fat: per100.fat * factor,
  };
}

function calcMealMacros(meal, index) {
  return (meal?.items || []).reduce((acc, item) => addMacros(acc, calcItemMacros(item, index)), emptyMacros());
}

function calcMealsMacros(meals, index) {
  return (meals || []).reduce((acc, meal) => addMacros(acc, calcMealMacros(meal, index)), emptyMacros());
}

function getProjectedMeals(plan) {
  return (plan?.meals || []).filter((meal) => meal.status !== 'skipped');
}

function getCompletedMeals(plan) {
  return (plan?.meals || []).filter((meal) => meal.status === 'completed' || meal.status === 'changed');
}

function mealSummary(meal, index) {
  return {
    mealId: meal.id,
    mealName: meal.slot || meal.recipeName || 'Meal',
    macros: roundMacros(calcMealMacros(meal, index)),
    items: (meal.items || []).map((item) => ({
      itemId: item.id,
      name: item.foodName || item.rawName || item.name || item.foodId || 'Item',
      grams: round(item.grams ?? item.quantity ?? 0, 1),
    })),
  };
}

function roundMacros(macros) {
  return {
    calories: round(macros.calories, 0),
    protein: round(macros.protein, 1),
    carbs: round(macros.carbs, 1),
    fat: round(macros.fat, 1),
  };
}

function classifyFood(item, food) {
  const name = normalizeText(`${item?.foodName || ''} ${item?.rawName || ''} ${food?.name || ''} ${food?.department || ''} ${food?.category || ''}`);
  const p = Number(food?.proteinPer100g ?? item?.proteinPer100g ?? item?.nutritionPer100g?.protein ?? 0) || 0;
  const c = Number(food?.carbsPer100g ?? item?.carbsPer100g ?? item?.nutritionPer100g?.carbs ?? 0) || 0;
  const f = Number(food?.fatPer100g ?? item?.fatPer100g ?? item?.nutritionPer100g?.fat ?? 0) || 0;
  if (/oil|olio|butter|burro|nut butter|peanut|mandorl|noci|walnut|avocado/.test(name) || f >= 20) return 'fat';
  if (/rice|riso|pasta|oats|avena|potato|patate|bread|pane|banana|cereal|couscous|quinoa/.test(name) || c >= p * 1.5 && c >= f * 2 && c >= 12) return 'carb';
  if (/chicken|pollo|turkey|tacchino|fish|salmon|tuna|tonno|beef|yogurt|skyr|whey|bresaola|egg|uova|albumi/.test(name) || p >= 8 && p >= c * 0.7 && p >= f * 1.2) return 'protein';
  if (/vegetable|verdure|fruit|frutta|apple|mela|salad|insalata/.test(name)) return 'vegetable';
  return 'mixed';
}

function practicalBounds(item, food) {
  const grams = Number(item?.grams ?? item?.quantity ?? 0) || 0;
  if (item?.locked || item?.userLocked) return { min: grams, max: grams };
  if (Number.isFinite(Number(item?.minG)) || Number.isFinite(Number(item?.maxG))) {
    return { min: Math.max(0, Number(item.minG) || 0), max: Math.max(Number(item.maxG) || grams || 1000, Number(item.minG) || 0) };
  }
  if (Number.isFinite(Number(food?.minG)) || Number.isFinite(Number(food?.maxG))) {
    return { min: Math.max(0, Number(food.minG) || 0), max: Math.max(Number(food.maxG) || grams || 1000, Number(food.minG) || 0) };
  }
  const role = classifyFood(item, food);
  if (role === 'protein') return { min: 60, max: 300 };
  if (role === 'carb') return { min: 20, max: /potato|patate|banana|bread|pane/.test(normalizeText(item?.foodName || food?.name)) ? 300 : 180 };
  if (role === 'fat') return { min: 0, max: 25 };
  if (role === 'vegetable') return { min: 0, max: 500 };
  if (/whey|protein powder/.test(normalizeText(item?.foodName || food?.name))) return { min: 0, max: 50 };
  return { min: Math.max(0, grams * 0.5), max: Math.max(100, grams * 2.25, grams + 150) };
}

function setItemGrams(item, grams) {
  const next = Math.max(0, Number(grams) || 0);
  item.grams = round(next, next < 20 ? 1 : 0);
  if (!item.unit || ['g', 'gram', 'grams'].includes(String(item.unit))) {
    item.unit = 'g';
    item.quantity = item.grams;
  }
  item.macroSnapshot = null;
}

function macroPerGram(item, index, macro) {
  return itemNutritionPer100g(item, index)[macro] / 100;
}

function flattenAdjustableMeals(meals, index) {
  return (meals || []).flatMap((meal) => (meal.items || [])
    .filter((item) => !meal.locked && !item.locked && !item.userLocked && !item.doNotAdjust)
    .map((item) => ({ meal, item, food: findFoodForItem(item, index) })));
}

function adjusterScore(item, food, index, macro) {
  const per = macroPerGram(item, index, macro);
  const cal = Math.max(0.01, macroPerGram(item, index, 'calories'));
  const role = classifyFood(item, food);
  const roleBonus = (macro === 'protein' && role === 'protein') || (macro === 'carbs' && role === 'carb') || (macro === 'fat' && role === 'fat') ? 4 : 0;
  return per * 100 + per / cal + roleBonus;
}

function createAdjusterItem(food, macro, grams) {
  return {
    id: `adjuster_${Date.now()}_${Math.random().toString(16).slice(2)}`,
    foodId: food.id,
    foodName: food.name,
    rawName: food.name,
    quantity: round(grams, grams < 20 ? 1 : 0),
    unit: 'g',
    grams: round(grams, grams < 20 ? 1 : 0),
    originalGrams: 0,
    locked: false,
    source: 'server_macro_adjuster',
    confidence: food.confidence || 'medium',
    rawOrCookedState: food.rawOrCookedState || 'as_sold',
    nutritionPer100g: {
      calories: Number(food.caloriesPer100g) || 0,
      protein: Number(food.proteinPer100g) || 0,
      carbs: Number(food.carbsPer100g) || 0,
      fat: Number(food.fatPer100g) || 0,
    },
    notes: `Added by server recalculation for ${macro}.`,
  };
}

function findAdjusterFood(foods, macro) {
  const wanted = {
    protein: [/whey|protein|skyr|yogurt|pollo|chicken|turkey|tuna|tonno|bresaola|lean/],
    carbs: [/rice|riso|pasta|potato|patate|oats|avena|banana|bread|pane/],
    fat: [/olive|olio|oil|almond|mandorl|walnut|noci|butter|burro/],
  }[macro] || [];
  return [...foods]
    .filter((food) => wanted.some((rx) => rx.test(normalizeText(`${food.name} ${(food.aliases || []).join(' ')}`))))
    .sort((a, b) => {
      const av = Number(a[`${macro}Per100g`]) || 0;
      const bv = Number(b[`${macro}Per100g`]) || 0;
      return bv - av;
    })[0] || null;
}

function addMacroAdjusters(meals, index, foods, target, tolerance, warnings) {
  const added = [];
  const slots = {
    protein: ['Snack 2', 'Dinner', 'Snack 1', 'Lunch'],
    carbs: ['Snack 2', 'Lunch', 'Dinner', 'Breakfast'],
    fat: ['Dinner', 'Lunch', 'Snack 1'],
  };
  for (const macro of ['protein', 'carbs', 'fat']) {
    const current = calcMealsMacros(meals, index);
    const gap = (target[macro] || 0) - (current[macro] || 0);
    if (gap <= (tolerance[macro] || 5)) continue;
    const food = findAdjusterFood(foods, macro);
    if (!food) {
      warnings.push({ level: 'info', message: `No ${macro} adjuster food is available yet.` });
      continue;
    }
    const per = (Number(food[`${macro}Per100g`]) || 0) / 100;
    if (per <= 0) continue;
    const maxByMacro = macro === 'fat' ? 25 : macro === 'protein' && /whey/.test(normalizeText(food.name)) ? 50 : 180;
    const grams = clamp(gap / per, macro === 'fat' ? 3 : 20, maxByMacro);
    const meal = slots[macro].map((slot) => meals.find((candidate) => candidate.slot === slot && candidate.status === 'planned' && !candidate.locked)).find(Boolean)
      || meals.find((candidate) => candidate.status === 'planned' && !candidate.locked);
    if (!meal) continue;
    const item = createAdjusterItem(food, macro, grams);
    meal.items ||= [];
    meal.items.push(item);
    meal.adjustments ||= [];
    meal.adjustments.push({ at: new Date().toISOString(), type: 'server_macro_adjuster_added', foodId: food.id, foodName: food.name, grams: item.grams, macro });
    added.push({ mealId: meal.id, mealName: meal.slot || meal.recipeName || 'Meal', item: food.name, grams: item.grams, reason: `${macro} recovery` });
  }
  if (added.length) warnings.push({ level: 'info', message: 'Added macro adjuster foods where practical.' });
  return added;
}

function scaleMealsToTarget(meals, index, target, options = {}) {
  const tolerance = { calories: 80, protein: 6, carbs: 10, fat: 5, ...(options.tolerance || {}) };
  const warnings = [];
  let candidates = flattenAdjustableMeals(meals, index).filter(({ item }) => itemNutritionPer100g(item, index).calories || itemNutritionPer100g(item, index).protein || itemNutritionPer100g(item, index).carbs || itemNutritionPer100g(item, index).fat);
  if (!candidates.length) {
    warnings.push({ level: 'warning', message: 'Needs nutrition data for adjustable remaining foods.' });
    return { warnings };
  }

  const current = calcMealsMacros(meals, index);
  const calorieFactor = current.calories > 0 && target.calories > 0 ? clamp(target.calories / current.calories, 0.55, 1.85) : 1;
  for (const { item, food } of candidates) {
    const bounds = practicalBounds(item, food);
    setItemGrams(item, clamp((Number(item.grams) || 0) * calorieFactor, bounds.min, bounds.max));
  }

  for (let pass = 0; pass < 8; pass += 1) {
    for (const macro of ['protein', 'carbs', 'fat']) {
      let gap = (target[macro] || 0) - (calcMealsMacros(meals, index)[macro] || 0);
      if (Math.abs(gap) <= tolerance[macro]) continue;
      const sorted = [...candidates]
        .filter(({ item }) => macroPerGram(item, index, macro) > 0.001)
        .sort((a, b) => adjusterScore(b.item, b.food, index, macro) - adjusterScore(a.item, a.food, index, macro));
      for (const { item, food } of sorted) {
        const per = macroPerGram(item, index, macro);
        const bounds = practicalBounds(item, food);
        if (gap > 0) {
          const room = bounds.max - (Number(item.grams) || 0);
          if (room <= 0) continue;
          const add = clamp(gap / per, 0, room);
          setItemGrams(item, (Number(item.grams) || 0) + add);
          gap -= add * per;
        } else {
          const room = (Number(item.grams) || 0) - bounds.min;
          if (room <= 0) continue;
          const reduce = clamp(Math.abs(gap) / per, 0, room);
          setItemGrams(item, (Number(item.grams) || 0) - reduce);
          gap += reduce * per;
        }
        if (Math.abs(gap) <= tolerance[macro]) break;
      }
    }
  }

  return { warnings };
}

function buildChanges(beforeMeals, afterMeals) {
  const changes = [];
  const beforeById = new Map(beforeMeals.map((meal) => [String(meal.id), meal]));
  for (const meal of afterMeals) {
    const before = beforeById.get(String(meal.id));
    if (!before) continue;
    const beforeItems = new Map((before.items || []).map((item) => [String(item.id || item.foodId || item.foodName), item]));
    const mealChanges = [];
    for (const item of meal.items || []) {
      const key = String(item.id || item.foodId || item.foodName);
      const old = beforeItems.get(key);
      const oldGrams = Number(old?.grams ?? old?.quantity ?? 0) || 0;
      const newGrams = Number(item.grams ?? item.quantity ?? 0) || 0;
      if (!old && newGrams > 0) {
        mealChanges.push({ item: item.foodName || item.rawName || item.name || 'Item', oldGrams: 0, newGrams: round(newGrams, 1), reason: item.source === 'server_macro_adjuster' ? 'macro recovery' : 'added' });
      } else if (Math.abs(newGrams - oldGrams) >= 1) {
        mealChanges.push({ item: item.foodName || item.rawName || item.name || 'Item', oldGrams: round(oldGrams, 1), newGrams: round(newGrams, 1), reason: 'portion adjustment' });
      }
    }
    if (mealChanges.length) changes.push({ mealId: meal.id, mealName: meal.slot || meal.recipeName || 'Meal', changes: mealChanges });
  }
  return changes;
}

function confidenceScore(beforeGap, afterGap, warnings) {
  const before = Math.max(1, absMacroGap(beforeGap));
  const after = absMacroGap(afterGap);
  const improvement = clamp(1 - after / before, 0, 1);
  const penalty = warnings.some((warning) => warning.level === 'warning') ? 0.12 : 0;
  return round(clamp(0.45 + improvement * 0.5 - penalty, 0.1, 0.95), 2);
}

function userSummary(eventType, mealName, beforeGap, afterGap) {
  const recoveredProtein = Math.max(0, Math.round(Math.abs(beforeGap.protein || 0) - Math.abs(afterGap.protein || 0)));
  const recoveredCalories = Math.max(0, Math.round(Math.abs(beforeGap.calories || 0) - Math.abs(afterGap.calories || 0)));
  if (eventType === 'skipped') {
    return {
      en: `${mealName} skipped. I adjusted remaining meals to recover ${recoveredProtein}g protein and ${recoveredCalories} kcal where practical.`,
      it: `${mealName} saltato. Ho regolato i pasti rimanenti per recuperare ${recoveredProtein}g di proteine e ${recoveredCalories} kcal dove possibile.`,
    };
  }
  if (eventType === 'eaten_as_planned') {
    return {
      en: `${mealName} completed. The rest of the day stays aligned with today’s target.`,
      it: `${mealName} completato. Il resto della giornata resta allineato al target di oggi.`,
    };
  }
  return {
    en: `${mealName} changed. I adjusted the rest of the day toward today’s target.`,
    it: `${mealName} modificato. Ho regolato il resto della giornata verso il target di oggi.`,
  };
}

function recalculateMealPlan(plan, event = {}, options = {}) {
  const foods = options.foods || [];
  const index = foodIndex(foods);
  const next = JSON.parse(JSON.stringify(plan || {}));
  next.meals ||= [];
  const target = normalizeTarget(options.target || next.targetSnapshot || next.target || {}, calcMealsMacros(getProjectedMeals(next), index));
  next.targetSnapshot = { ...(next.targetSnapshot || {}), ...target };

  const projectedBefore = calcMealsMacros(getProjectedMeals(next), index);
  const beforeGap = subtractMacros(target, projectedBefore);
  const remainingMeals = next.meals.filter((meal) => meal.status === 'planned' && !meal.locked);
  const beforeRemaining = JSON.parse(JSON.stringify(remainingMeals));
  const completed = calcMealsMacros(getCompletedMeals(next), index);
  const remainingTarget = normalizeTarget(subtractMacros(target, completed));

  const warnings = [];
  const scale = scaleMealsToTarget(remainingMeals, index, remainingTarget, options);
  warnings.push(...scale.warnings);
  addMacroAdjusters(remainingMeals, index, foods, remainingTarget, { protein: 6, carbs: 10, fat: 5 }, warnings);
  scaleMealsToTarget(remainingMeals, index, remainingTarget, options);

  const projectedAfter = calcMealsMacros(getProjectedMeals(next), index);
  const afterGap = subtractMacros(target, projectedAfter);
  const changedMeals = buildChanges(beforeRemaining, remainingMeals);
  if (!changedMeals.length && remainingMeals.length) warnings.push({ level: 'info', message: 'No practical portion changes were needed.' });

  const eventType = event.eventType || event.type || 'recalculation';
  const mealName = event.mealName || event.mealLabel || event.slot || 'Meal';
  const recalculation = {
    mealPlanId: next.id || next.date || null,
    event: {
      type: eventType,
      plannedMealId: event.plannedMealId || event.mealId || null,
    },
    target: roundMacros(target),
    before: {
      projected: roundMacros(projectedBefore),
      gap: roundMacros(beforeGap),
      remainingMeals: beforeRemaining.map((meal) => mealSummary(meal, index)),
    },
    after: {
      projected: roundMacros(projectedAfter),
      gap: roundMacros(afterGap),
      remainingMeals: remainingMeals.map((meal) => mealSummary(meal, index)),
    },
    changedMeals,
    warnings,
    confidence: confidenceScore(beforeGap, afterGap, warnings),
    userSummary: userSummary(eventType, mealName, beforeGap, afterGap),
    generatedAt: new Date().toISOString(),
  };

  next.generatedTotals = roundMacros(projectedAfter);
  next.recalculation = recalculation;
  next.recalculationLog ||= [];
  next.recalculationLog.push({ at: recalculation.generatedAt, eventType, beforeGap: recalculation.before.gap, afterGap: recalculation.after.gap, changedMeals: changedMeals.length, confidence: recalculation.confidence });
  next.updatedAt = new Date().toISOString();
  return { mealPlan: next, recalculation };
}

module.exports = {
  recalculateMealPlan,
  calcMealMacros,
  calcMealsMacros,
  roundMacros,
};
