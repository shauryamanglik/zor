// Quick-add food database for logging extras: fruits, snacks, drinks, packaged
// foods, Indian snacks, nuts. Each item carries BASE macros for ONE base unit,
// plus a `unit` descriptor and size options so the logger can ask quantity in
// terms that actually make sense ("1 plum" vs "large bag of chips" vs "1 glass").
//
// macros are per ONE base unit. Final macros = base * count * sizeMultiplier.
//
// unitType drives the quantity UI:
//   "count"  -> integer stepper ("1 plum", "2 plums"), optional size presets
//   "size"   -> pick small/medium/large (chips, packaged); count usually 1
//   "glass"  -> drinks: pick glass/bottle/cup; count multiplies
//   "serving"-> generic serving stepper with 0.5 increments
//
// homemadeSweet: true means "if you make it at home, you use Great Value Monk
// Fruit & Erythritol, not sugar" - the logger offers a zero-sugar toggle that
// strips the sugar carbs/cals.

export const QUICK_CATEGORIES = [
  { id: "fruit", label: "Fruit" },
  { id: "drink", label: "Drinks" },
  { id: "indian", label: "Indian snacks" },
  { id: "packaged", label: "Packaged" },
  { id: "better", label: "Better-for-you" },
  { id: "nuts", label: "Nuts & seeds" },
  { id: "dairy", label: "Dairy & protein" },
  { id: "sweet", label: "Sweets" },
  { id: "other", label: "Other" },
];

// sizeMultipliers used by "size" unitType items
export const SIZE_PRESETS = {
  default: [
    { id: "small", label: "Small", mult: 0.6 },
    { id: "medium", label: "Medium", mult: 1 },
    { id: "large", label: "Large", mult: 1.6 },
  ],
  bag: [
    { id: "snack", label: "Snack bag", mult: 0.5 },   // ~1 oz
    { id: "single", label: "Single", mult: 1 },        // ~2 oz
    { id: "share", label: "Share bag", mult: 2.5 },    // ~5 oz
    { id: "party", label: "Party bag", mult: 5 },      // ~10 oz
  ],
  fruitSize: [
    { id: "small", label: "Small", mult: 0.7 },
    { id: "medium", label: "Medium", mult: 1 },
    { id: "large", label: "Large", mult: 1.4 },
  ],
};

export const DRINK_VESSELS = [
  { id: "glass", label: "Glass (250ml)", mult: 1 },
  { id: "cup", label: "Cup (180ml)", mult: 0.72 },
  { id: "bottle", label: "Bottle (500ml)", mult: 2 },
  { id: "can", label: "Can (330ml)", mult: 1.32 },
];

// Each entry: id, name, cat, unit (label of ONE base unit), unitType,
// macros {p,c,f,fiber,kcal} for ONE base unit, optional sizeSet, optional
// sugarCarbs (carbs attributable to sugar, for the homemade zero-sugar toggle).
export const QUICK_FOODS = [
  // ── Fruit (count-based, with size option) ───────────────────────────
  { id: "f_plum", name: "Plum", cat: "fruit", unit: "plum", unitType: "count", sizeSet: "fruitSize", macros: { p: 0.5, c: 8, f: 0.2, fiber: 1, kcal: 30 } },
  { id: "f_apple", name: "Apple", cat: "fruit", unit: "apple", unitType: "count", sizeSet: "fruitSize", macros: { p: 0.5, c: 25, f: 0.3, fiber: 4, kcal: 95 } },
  { id: "f_banana", name: "Banana", cat: "fruit", unit: "banana", unitType: "count", sizeSet: "fruitSize", macros: { p: 1, c: 27, f: 0.3, fiber: 3, kcal: 105 } },
  { id: "f_orange", name: "Orange", cat: "fruit", unit: "orange", unitType: "count", sizeSet: "fruitSize", macros: { p: 1, c: 15, f: 0.2, fiber: 3, kcal: 62 } },
  { id: "f_pear", name: "Pear", cat: "fruit", unit: "pear", unitType: "count", sizeSet: "fruitSize", macros: { p: 0.6, c: 27, f: 0.2, fiber: 6, kcal: 101 } },
  { id: "f_peach", name: "Peach", cat: "fruit", unit: "peach", unitType: "count", sizeSet: "fruitSize", macros: { p: 1, c: 14, f: 0.4, fiber: 2, kcal: 59 } },
  { id: "f_kiwi", name: "Kiwi", cat: "fruit", unit: "kiwi", unitType: "count", macros: { p: 0.8, c: 10, f: 0.4, fiber: 2, kcal: 42 } },
  { id: "f_mandarin", name: "Mandarin / Cutie", cat: "fruit", unit: "mandarin", unitType: "count", macros: { p: 0.6, c: 9, f: 0.2, fiber: 1.3, kcal: 35 } },
  { id: "f_fig", name: "Fresh fig", cat: "fruit", unit: "fig", unitType: "count", macros: { p: 0.4, c: 10, f: 0.2, fiber: 1.5, kcal: 37 } },
  { id: "f_date", name: "Medjool date", cat: "fruit", unit: "date", unitType: "count", macros: { p: 0.4, c: 18, f: 0, fiber: 1.6, kcal: 66 } },
  { id: "f_grapes", name: "Grapes", cat: "fruit", unit: "cup", unitType: "serving", macros: { p: 1, c: 27, f: 0.3, fiber: 1, kcal: 104 } },
  { id: "f_berries", name: "Mixed berries", cat: "fruit", unit: "cup", unitType: "serving", macros: { p: 1, c: 17, f: 0.5, fiber: 4, kcal: 70 } },
  { id: "f_straw", name: "Strawberries", cat: "fruit", unit: "cup", unitType: "serving", macros: { p: 1, c: 12, f: 0.5, fiber: 3, kcal: 49 } },
  { id: "f_blue", name: "Blueberries", cat: "fruit", unit: "cup", unitType: "serving", macros: { p: 1, c: 21, f: 0.5, fiber: 4, kcal: 84 } },
  { id: "f_mango", name: "Mango", cat: "fruit", unit: "cup", unitType: "serving", macros: { p: 1, c: 25, f: 0.6, fiber: 3, kcal: 99 } },
  { id: "f_pineapple", name: "Pineapple", cat: "fruit", unit: "cup", unitType: "serving", macros: { p: 1, c: 22, f: 0.2, fiber: 2, kcal: 83 } },
  { id: "f_watermelon", name: "Watermelon", cat: "fruit", unit: "cup", unitType: "serving", macros: { p: 1, c: 11, f: 0.2, fiber: 0.6, kcal: 46 } },
  { id: "f_pomegranate", name: "Pomegranate seeds", cat: "fruit", unit: "1/2 cup", unitType: "serving", macros: { p: 1.5, c: 16, f: 1, fiber: 3.5, kcal: 72 } },
  { id: "f_guava", name: "Guava", cat: "fruit", unit: "guava", unitType: "count", macros: { p: 1.4, c: 8, f: 0.5, fiber: 3, kcal: 37 } },
  { id: "f_papaya", name: "Papaya", cat: "fruit", unit: "cup", unitType: "serving", macros: { p: 0.7, c: 16, f: 0.4, fiber: 2.5, kcal: 62 } },
  { id: "f_avocado", name: "Avocado", cat: "fruit", unit: "avocado", unitType: "count", sizeSet: "fruitSize", macros: { p: 3, c: 12, f: 21, fiber: 9, kcal: 234 } },

  // ── Drinks (vessel-based) ───────────────────────────────────────────
  { id: "d_lemonade", name: "Lemonade (homemade)", cat: "drink", unit: "glass", unitType: "glass", homemadeSweet: true, sugarCarbs: 22, macros: { p: 0, c: 24, f: 0, fiber: 0, kcal: 96 } },
  { id: "d_lemonade_store", name: "Lemonade (store-bought)", cat: "drink", unit: "glass", unitType: "glass", macros: { p: 0, c: 26, f: 0, fiber: 0, kcal: 104 } },
  { id: "d_chai_sugar", name: "Chai (milk + sugar)", cat: "drink", unit: "cup", unitType: "glass", homemadeSweet: true, sugarCarbs: 8, macros: { p: 3, c: 14, f: 3, fiber: 0, kcal: 90 } },
  { id: "d_chai_nosugar", name: "Chai (milk, no sugar)", cat: "drink", unit: "cup", unitType: "glass", macros: { p: 3, c: 6, f: 3, fiber: 0, kcal: 60 } },
  { id: "d_greentea", name: "Green tea", cat: "drink", unit: "cup", unitType: "glass", macros: { p: 0, c: 0, f: 0, fiber: 0, kcal: 2 } },
  { id: "d_blackcoffee", name: "Black coffee", cat: "drink", unit: "cup", unitType: "glass", macros: { p: 0, c: 0, f: 0, fiber: 0, kcal: 5 } },
  { id: "d_latte", name: "Latte", cat: "drink", unit: "cup", unitType: "glass", macros: { p: 8, c: 13, f: 7, fiber: 0, kcal: 150 } },
  { id: "d_oj", name: "Orange juice", cat: "drink", unit: "glass", unitType: "glass", macros: { p: 2, c: 26, f: 0.5, fiber: 0.5, kcal: 110 } },
  { id: "d_coke", name: "Coke", cat: "drink", unit: "can", unitType: "glass", macros: { p: 0, c: 39, f: 0, fiber: 0, kcal: 140 } },
  { id: "d_dietcoke", name: "Diet Coke", cat: "drink", unit: "can", unitType: "glass", macros: { p: 0, c: 0, f: 0, fiber: 0, kcal: 0 } },
  { id: "d_lassi_sweet", name: "Sweet lassi", cat: "drink", unit: "glass", unitType: "glass", homemadeSweet: true, sugarCarbs: 18, macros: { p: 8, c: 30, f: 5, fiber: 0, kcal: 200 } },
  { id: "d_lassi_salt", name: "Salted lassi / chaas", cat: "drink", unit: "glass", unitType: "glass", macros: { p: 6, c: 8, f: 4, fiber: 0, kcal: 90 } },
  { id: "d_nimbu_pani", name: "Nimbu pani", cat: "drink", unit: "glass", unitType: "glass", homemadeSweet: true, sugarCarbs: 18, macros: { p: 0, c: 20, f: 0, fiber: 0, kcal: 80 } },
  { id: "d_protein_water", name: "Protein water", cat: "drink", unit: "bottle", unitType: "glass", macros: { p: 21, c: 2, f: 1, fiber: 0, kcal: 100 } },
  { id: "d_fairlife", name: "Fairlife Chocolate", cat: "drink", unit: "bottle", unitType: "glass", macros: { p: 30, c: 4, f: 4.5, fiber: 1, kcal: 150 } },
  { id: "d_kombucha", name: "Kombucha", cat: "drink", unit: "bottle", unitType: "glass", macros: { p: 0, c: 12, f: 0, fiber: 0, kcal: 50 } },
  { id: "d_beer", name: "Beer", cat: "drink", unit: "bottle", unitType: "glass", macros: { p: 1.6, c: 13, f: 0, fiber: 0, kcal: 153 } },
  { id: "d_redwine", name: "Red wine", cat: "drink", unit: "glass", unitType: "glass", macros: { p: 0.1, c: 4, f: 0, fiber: 0, kcal: 125 } },
  { id: "d_gatorade", name: "Gatorade", cat: "drink", unit: "bottle", unitType: "glass", macros: { p: 0, c: 34, f: 0, fiber: 0, kcal: 130 } },
  { id: "d_coconut", name: "Coconut water", cat: "drink", unit: "cup", unitType: "glass", macros: { p: 2, c: 9, f: 0, fiber: 3, kcal: 46 } },

  // ── Indian snacks ───────────────────────────────────────────────────
  { id: "i_mathri", name: "Mathri", cat: "indian", unit: "piece", unitType: "count", macros: { p: 1.5, c: 11, f: 6, fiber: 0.5, kcal: 100 } },
  { id: "i_papad", name: "Papad (roasted)", cat: "indian", unit: "papad", unitType: "count", macros: { p: 2, c: 6, f: 0.5, fiber: 1, kcal: 35 } },
  { id: "i_papad_fried", name: "Papad (fried)", cat: "indian", unit: "papad", unitType: "count", macros: { p: 2, c: 6, f: 4, fiber: 1, kcal: 70 } },
  { id: "i_chakli", name: "Chakli", cat: "indian", unit: "piece", unitType: "count", macros: { p: 1.5, c: 9, f: 6, fiber: 0.8, kcal: 95 } },
  { id: "i_sev", name: "Sev", cat: "indian", unit: "tbsp", unitType: "serving", macros: { p: 1.5, c: 4, f: 4, fiber: 0.6, kcal: 56 } },
  { id: "i_namkeen", name: "Mixed namkeen", cat: "indian", unit: "1/4 cup", unitType: "serving", macros: { p: 4, c: 14, f: 11, fiber: 2, kcal: 170 } },
  { id: "i_bhujia", name: "Aloo bhujia", cat: "indian", unit: "1/4 cup", unitType: "serving", macros: { p: 4, c: 13, f: 12, fiber: 2, kcal: 175 } },
  { id: "i_mathura_peda", name: "Peda", cat: "indian", unit: "piece", unitType: "count", macros: { p: 2, c: 12, f: 4, fiber: 0, kcal: 90 } },
  { id: "i_samosa", name: "Samosa", cat: "indian", unit: "samosa", unitType: "count", macros: { p: 4, c: 24, f: 12, fiber: 2, kcal: 220 } },
  { id: "i_kachori", name: "Kachori", cat: "indian", unit: "piece", unitType: "count", macros: { p: 4, c: 22, f: 14, fiber: 2, kcal: 230 } },
  { id: "i_dhokla", name: "Dhokla", cat: "indian", unit: "piece", unitType: "count", macros: { p: 2, c: 7, f: 1.3, fiber: 0.7, kcal: 50 } },
  { id: "i_khakhra", name: "Khakhra", cat: "indian", unit: "piece", unitType: "count", macros: { p: 2, c: 12, f: 2, fiber: 1.5, kcal: 75 } },
  { id: "i_thepla", name: "Thepla", cat: "indian", unit: "piece", unitType: "count", macros: { p: 3, c: 18, f: 5, fiber: 2, kcal: 130 } },
  { id: "i_chivda", name: "Poha chivda", cat: "indian", unit: "1/4 cup", unitType: "serving", macros: { p: 3, c: 16, f: 8, fiber: 2, kcal: 145 } },
  { id: "i_murukku", name: "Murukku", cat: "indian", unit: "piece", unitType: "count", macros: { p: 1.5, c: 9, f: 6, fiber: 0.8, kcal: 95 } },
  { id: "i_mixture", name: "Bombay mixture", cat: "indian", unit: "1/4 cup", unitType: "serving", macros: { p: 5, c: 15, f: 11, fiber: 3, kcal: 175 } },
  { id: "i_fryums", name: "Fryums", cat: "indian", unit: "handful", unitType: "serving", macros: { p: 0.5, c: 10, f: 5, fiber: 0.3, kcal: 90 } },
  { id: "i_chana_roasted", name: "Roasted chana", cat: "indian", unit: "1/4 cup", unitType: "serving", macros: { p: 7, c: 17, f: 2, fiber: 5, kcal: 110 } },
  { id: "i_gulab_jamun", name: "Gulab jamun", cat: "indian", unit: "piece", unitType: "count", macros: { p: 2, c: 21, f: 6, fiber: 0, kcal: 150 } },
  { id: "i_jalebi", name: "Jalebi", cat: "indian", unit: "piece", unitType: "count", macros: { p: 0.5, c: 18, f: 5, fiber: 0, kcal: 120 } },
  { id: "i_barfi", name: "Barfi", cat: "indian", unit: "piece", unitType: "count", macros: { p: 2, c: 15, f: 7, fiber: 0, kcal: 130 } },
  { id: "i_laddu", name: "Besan laddu", cat: "indian", unit: "piece", unitType: "count", macros: { p: 3, c: 18, f: 9, fiber: 1, kcal: 170 } },
  { id: "i_kaju_katli", name: "Kaju katli", cat: "indian", unit: "piece", unitType: "count", macros: { p: 1.5, c: 10, f: 4, fiber: 0.3, kcal: 80 } },
  { id: "i_rasgulla", name: "Rasgulla", cat: "indian", unit: "piece", unitType: "count", macros: { p: 2, c: 19, f: 1, fiber: 0, kcal: 90 } },
  { id: "i_vada_pav", name: "Vada pav", cat: "indian", unit: "piece", unitType: "count", macros: { p: 6, c: 40, f: 12, fiber: 3, kcal: 290 } },
  { id: "i_pani_puri", name: "Pani puri", cat: "indian", unit: "piece", unitType: "count", macros: { p: 0.6, c: 6, f: 1.5, fiber: 0.5, kcal: 36 } },
  { id: "i_bhel", name: "Bhel puri", cat: "indian", unit: "cup", unitType: "serving", macros: { p: 4, c: 30, f: 6, fiber: 3, kcal: 180 } },

  // ── Packaged / Western snacks ───────────────────────────────────────
  { id: "p_chips", name: "Potato chips", cat: "packaged", unit: "bag", unitType: "size", sizeSet: "bag", macros: { p: 2, c: 15, f: 10, fiber: 1, kcal: 160 } },
  { id: "p_tortilla", name: "Tortilla chips", cat: "packaged", unit: "bag", unitType: "size", sizeSet: "bag", macros: { p: 2, c: 18, f: 7, fiber: 1.5, kcal: 140 } },
  { id: "p_doritos", name: "Doritos", cat: "packaged", unit: "bag", unitType: "size", sizeSet: "bag", macros: { p: 2, c: 16, f: 8, fiber: 1, kcal: 150 } },
  { id: "p_popcorn", name: "Popcorn", cat: "packaged", unit: "cup", unitType: "serving", macros: { p: 1, c: 6, f: 1, fiber: 1, kcal: 31 } },
  { id: "p_pretzels", name: "Pretzels", cat: "packaged", unit: "1 oz", unitType: "serving", macros: { p: 3, c: 23, f: 1, fiber: 1, kcal: 110 } },
  { id: "p_cliff", name: "Clif Bar", cat: "packaged", unit: "bar", unitType: "count", macros: { p: 9, c: 44, f: 6, fiber: 4, kcal: 250 } },
  { id: "p_quest", name: "Quest protein bar", cat: "packaged", unit: "bar", unitType: "count", macros: { p: 21, c: 22, f: 8, fiber: 14, kcal: 200 } },
  { id: "p_rxbar", name: "RxBar", cat: "packaged", unit: "bar", unitType: "count", macros: { p: 12, c: 24, f: 9, fiber: 5, kcal: 210 } },
  { id: "p_granola_bar", name: "Granola bar", cat: "packaged", unit: "bar", unitType: "count", macros: { p: 3, c: 18, f: 5, fiber: 2, kcal: 130 } },
  { id: "p_crackers", name: "Crackers", cat: "packaged", unit: "5 crackers", unitType: "serving", macros: { p: 2, c: 10, f: 3, fiber: 0.5, kcal: 80 } },
  { id: "p_oreos", name: "Oreos", cat: "packaged", unit: "cookie", unitType: "count", macros: { p: 0.5, c: 8.3, f: 2.3, fiber: 0.4, kcal: 53 } },
  { id: "p_choc_chip", name: "Chocolate chip cookie", cat: "packaged", unit: "cookie", unitType: "count", sizeSet: "default", macros: { p: 1, c: 10, f: 4, fiber: 0.5, kcal: 78 } },
  { id: "p_icecream", name: "Ice cream", cat: "packaged", unit: "1/2 cup", unitType: "serving", macros: { p: 2.5, c: 16, f: 7, fiber: 0.5, kcal: 137 } },
  { id: "p_donut", name: "Donut", cat: "packaged", unit: "donut", unitType: "count", macros: { p: 3, c: 31, f: 14, fiber: 1, kcal: 260 } },
  { id: "p_muffin", name: "Muffin", cat: "packaged", unit: "muffin", unitType: "count", sizeSet: "default", macros: { p: 5, c: 55, f: 16, fiber: 2, kcal: 380 } },
  { id: "p_choc_dark", name: "Dark chocolate", cat: "sweet", unit: "square", unitType: "count", macros: { p: 1, c: 8, f: 5, fiber: 1.5, kcal: 85 } },
  { id: "p_choc_milk", name: "Milk chocolate", cat: "sweet", unit: "square", unitType: "count", macros: { p: 1, c: 9, f: 5, fiber: 0.5, kcal: 90 } },
  { id: "p_mnm", name: "M&Ms", cat: "sweet", unit: "fun-size pack", unitType: "count", macros: { p: 0.8, c: 11, f: 3.5, fiber: 0.5, kcal: 73 } },
  { id: "p_kitkat", name: "KitKat", cat: "sweet", unit: "2-finger bar", unitType: "count", macros: { p: 1, c: 11, f: 4.5, fiber: 0.3, kcal: 105 } },
  { id: "p_gummies", name: "Gummy bears", cat: "sweet", unit: "10 pieces", unitType: "serving", macros: { p: 1.5, c: 18, f: 0, fiber: 0, kcal: 75 } },

  // ── Better-for-you / frozen / lower-carb swaps ──────────────────────
  { id: "b_caulipizza", name: "Caulipower cauliflower pizza", cat: "better", unit: "1/3 pizza", unitType: "serving", macros: { p: 6, c: 25, f: 6, fiber: 2, kcal: 170 } },
  { id: "b_realgood_pizza", name: "Real Good chicken-crust pizza", cat: "better", unit: "1/2 pizza", unitType: "serving", macros: { p: 24, c: 9, f: 16, fiber: 3, kcal: 280 } },
  { id: "b_caulirice", name: "Cauliflower rice", cat: "better", unit: "cup", unitType: "serving", macros: { p: 2, c: 5, f: 0.3, fiber: 2, kcal: 25 } },
  { id: "b_caulignocchi", name: "Trader Joe's cauliflower gnocchi", cat: "better", unit: "cup", unitType: "serving", macros: { p: 2, c: 22, f: 3, fiber: 2, kcal: 120 } },
  { id: "b_banza", name: "Banza chickpea pasta", cat: "better", unit: "2 oz dry", unitType: "serving", macros: { p: 14, c: 32, f: 4, fiber: 8, kcal: 190 } },
  { id: "b_halo", name: "Halo Top ice cream", cat: "better", unit: "1/2 cup", unitType: "serving", macros: { p: 5, c: 14, f: 3, fiber: 3, kcal: 90 } },
  { id: "b_proteinchips", name: "Quest protein chips", cat: "better", unit: "bag", unitType: "count", macros: { p: 19, c: 5, f: 4, fiber: 1, kcal: 140 } },
  { id: "b_wholezero", name: "Whole-grain protein wrap", cat: "better", unit: "wrap", unitType: "count", macros: { p: 6, c: 15, f: 4, fiber: 8, kcal: 110 } },
  { id: "b_rxbar_egg", name: "Two Good yogurt", cat: "better", unit: "cup", unitType: "serving", macros: { p: 12, c: 3, f: 2, fiber: 0, kcal: 80 } },
  { id: "b_skinnypop", name: "SkinnyPop popcorn", cat: "better", unit: "bag", unitType: "size", sizeSet: "bag", macros: { p: 3, c: 15, f: 11, fiber: 3, kcal: 150 } },
  { id: "b_seaweed", name: "Roasted seaweed snack", cat: "better", unit: "pack", unitType: "count", macros: { p: 1, c: 1, f: 2.5, fiber: 0.5, kcal: 30 } },
  { id: "b_ricecake", name: "Rice cake", cat: "better", unit: "cake", unitType: "count", macros: { p: 1, c: 7, f: 0.3, fiber: 0.3, kcal: 35 } },
  { id: "b_eggwhite", name: "Egg white cup", cat: "better", unit: "3 tbsp", unitType: "serving", macros: { p: 5, c: 0.5, f: 0, fiber: 0, kcal: 25 } },
  { id: "b_proteinbar_zero", name: "Barebells protein bar", cat: "better", unit: "bar", unitType: "count", macros: { p: 20, c: 16, f: 8, fiber: 3, kcal: 200 } },
  { id: "b_lentilchips", name: "Lentil chips", cat: "better", unit: "1 oz", unitType: "serving", macros: { p: 3, c: 18, f: 6, fiber: 2, kcal: 130 } },
  { id: "b_proteinshake", name: "Premier Protein shake", cat: "better", unit: "bottle", unitType: "glass", macros: { p: 30, c: 5, f: 3, fiber: 1, kcal: 160 } },
  { id: "b_jerky", name: "Beef/soy jerky", cat: "better", unit: "1 oz", unitType: "serving", macros: { p: 9, c: 6, f: 1, fiber: 0, kcal: 80 } },
  { id: "b_edamame", name: "Edamame", cat: "better", unit: "1/2 cup", unitType: "serving", macros: { p: 9, c: 7, f: 4, fiber: 4, kcal: 100 } },
  { id: "b_proteincookie", name: "Lenny & Larry's cookie", cat: "better", unit: "1/2 cookie", unitType: "serving", macros: { p: 8, c: 18, f: 5, fiber: 3, kcal: 110 } },

  // ── Nuts & seeds ────────────────────────────────────────────────────
  { id: "n_almonds", name: "Almonds", cat: "nuts", unit: "10 almonds", unitType: "serving", macros: { p: 3, c: 2, f: 6, fiber: 1.5, kcal: 70 } },
  { id: "n_walnuts", name: "Walnuts", cat: "nuts", unit: "7 halves", unitType: "serving", macros: { p: 3, c: 2, f: 13, fiber: 1, kcal: 131 } },
  { id: "n_cashews", name: "Cashews", cat: "nuts", unit: "1 oz", unitType: "serving", macros: { p: 5, c: 9, f: 12, fiber: 1, kcal: 157 } },
  { id: "n_peanuts", name: "Peanuts", cat: "nuts", unit: "1 oz", unitType: "serving", macros: { p: 7, c: 5, f: 14, fiber: 2, kcal: 161 } },
  { id: "n_pistachios", name: "Pistachios", cat: "nuts", unit: "1 oz", unitType: "serving", macros: { p: 6, c: 8, f: 13, fiber: 3, kcal: 159 } },
  { id: "n_pb", name: "Peanut butter", cat: "nuts", unit: "tbsp", unitType: "serving", macros: { p: 4, c: 3, f: 8, fiber: 1, kcal: 96 } },
  { id: "n_almond_butter", name: "Almond butter", cat: "nuts", unit: "tbsp", unitType: "serving", macros: { p: 3.5, c: 3, f: 9, fiber: 1.5, kcal: 98 } },
  { id: "n_trailmix", name: "Trail mix", cat: "nuts", unit: "1/4 cup", unitType: "serving", macros: { p: 4, c: 13, f: 10, fiber: 2, kcal: 175 } },
  { id: "n_pumpkin", name: "Pumpkin seeds", cat: "nuts", unit: "1 oz", unitType: "serving", macros: { p: 9, c: 3, f: 13, fiber: 2, kcal: 158 } },
  { id: "n_chia", name: "Chia seeds", cat: "nuts", unit: "tbsp", unitType: "serving", macros: { p: 2, c: 5, f: 4, fiber: 4, kcal: 58 } },
  { id: "n_flax", name: "Ground flax", cat: "nuts", unit: "tbsp", unitType: "serving", macros: { p: 1.5, c: 1, f: 2, fiber: 2, kcal: 37 } },

  // ── Dairy & protein extras ──────────────────────────────────────────
  { id: "dy_greek", name: "Greek yogurt", cat: "dairy", unit: "cup", unitType: "serving", macros: { p: 23, c: 9, f: 5, fiber: 0, kcal: 170 } },
  { id: "dy_dahi", name: "Regular dahi", cat: "dairy", unit: "cup", unitType: "serving", macros: { p: 9, c: 11, f: 8, fiber: 0, kcal: 150 } },
  { id: "dy_cottage", name: "Cottage cheese", cat: "dairy", unit: "1/2 cup", unitType: "serving", macros: { p: 12, c: 4, f: 5, fiber: 0, kcal: 110 } },
  { id: "dy_cheese", name: "Cheese slice", cat: "dairy", unit: "slice", unitType: "count", macros: { p: 4, c: 1, f: 5, fiber: 0, kcal: 60 } },
  { id: "dy_paneer", name: "Paneer", cat: "dairy", unit: "100g", unitType: "serving", macros: { p: 18, c: 4, f: 20, fiber: 0, kcal: 265 } },
  { id: "dy_egg", name: "Egg (boiled)", cat: "dairy", unit: "egg", unitType: "count", macros: { p: 6, c: 0.5, f: 5, fiber: 0, kcal: 72 } },
  { id: "dy_milk", name: "Milk", cat: "dairy", unit: "cup", unitType: "glass", macros: { p: 8, c: 12, f: 5, fiber: 0, kcal: 122 } },
  { id: "dy_scoop", name: "Protein scoop (generic)", cat: "dairy", unit: "scoop", unitType: "count", macros: { p: 24, c: 3, f: 1.5, fiber: 1, kcal: 120 } },
  { id: "dy_orgain", name: "Orgain scoop", cat: "dairy", unit: "scoop", unitType: "count", macros: { p: 21, c: 15, f: 4, fiber: 5, kcal: 150 } },
];

// Fuzzy-ish search by name + category label.
export function searchQuickFoods(query, catId) {
  let list = QUICK_FOODS;
  if (catId && catId !== "all") list = list.filter((f) => f.cat === catId);
  if (!query.trim()) return list;
  const q = query.toLowerCase();
  return list.filter((f) => f.name.toLowerCase().includes(q));
}

// Compute final macros for a quick food given count + size multiplier + zeroSugar.
export function computeQuickMacros(food, count = 1, sizeMult = 1, zeroSugar = false) {
  const m = food.macros;
  let c = m.c, kcal = m.kcal;
  if (zeroSugar && food.homemadeSweet && food.sugarCarbs) {
    c = Math.max(0, m.c - food.sugarCarbs);
    kcal = Math.max(0, m.kcal - food.sugarCarbs * 4);
  }
  const factor = count * sizeMult;
  return {
    p: round1(m.p * factor),
    c: round1(c * factor),
    f: round1(m.f * factor),
    fiber: round1((m.fiber || 0) * factor),
    kcal: Math.round(kcal * factor),
  };
}

function round1(n) {
  return Math.round(n * 10) / 10;
}
