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
  { id: "fastfood", label: "Fast Food & Chains" },
  { id: "packaged", label: "Packaged & Junk" },
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
  // ── Fruit & Raw Veg (Fresh & Prepared) ──────────────────────────────
  { id: "f_plum", name: "Plum", cat: "fruit", unit: "plum", unitType: "count", sizeSet: "fruitSize", macros: { p: 0.5, c: 8, f: 0.2, fiber: 1, kcal: 30 } },
  { id: "f_apple", name: "Apple", cat: "fruit", unit: "apple", unitType: "count", sizeSet: "fruitSize", macros: { p: 0.5, c: 25, f: 0.3, fiber: 4, kcal: 95 } },
  { id: "f_banana", name: "Banana", cat: "fruit", unit: "banana", unitType: "count", sizeSet: "fruitSize", macros: { p: 1, c: 27, f: 0.3, fiber: 3, kcal: 105 } },
  { id: "f_orange", name: "Orange", cat: "fruit", unit: "orange", unitType: "count", sizeSet: "fruitSize", macros: { p: 1, c: 15, f: 0.2, fiber: 3, kcal: 62 } },
  { id: "f_pear", name: "Pear", cat: "fruit", unit: "pear", unitType: "count", sizeSet: "fruitSize", macros: { p: 0.6, c: 27, f: 0.2, fiber: 6, kcal: 101 } },
  { id: "f_peach", name: "Peach", cat: "fruit", unit: "peach", unitType: "count", sizeSet: "fruitSize", macros: { p: 1, c: 14, f: 0.4, fiber: 2, kcal: 59 } },
  { id: "f_kiwi", name: "Kiwi", cat: "fruit", unit: "kiwi", unitType: "count", macros: { p: 0.8, c: 10, f: 0.4, fiber: 2, kcal: 42 } },
  { id: "f_mandarin", name: "Cutie / Mandarin", cat: "fruit", unit: "mandarin", unitType: "count", macros: { p: 0.6, c: 9, f: 0.2, fiber: 1.3, kcal: 35 } },
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
  { id: "f_cantaloupe", name: "Cantaloupe / Melon", cat: "fruit", unit: "cup", unitType: "serving", macros: { p: 1.3, c: 13, f: 0.3, fiber: 1.4, kcal: 54 } },
  { id: "f_cherries", name: "Cherries (sweet)", cat: "fruit", unit: "cup", unitType: "serving", macros: { p: 1.5, c: 22, f: 0.3, fiber: 3, kcal: 87 } },
  { id: "f_grapefruit", name: "Grapefruit", cat: "fruit", unit: "1/2 grapefruit", unitType: "serving", macros: { p: 1, c: 13, f: 0.2, fiber: 2, kcal: 52 } },
  { id: "f_jicama", name: "Jicama sticks (with Tajin)", cat: "better", unit: "cup", unitType: "serving", macros: { p: 1, c: 11, f: 0.1, fiber: 6, kcal: 46 } },
  { id: "f_cucumber", name: "Cucumber slices", cat: "better", unit: "cup", unitType: "serving", macros: { p: 0.6, c: 3, f: 0.1, fiber: 0.5, kcal: 16 } },
  { id: "f_carrots", name: "Baby carrots", cat: "better", unit: "10 carrots", unitType: "serving", macros: { p: 0.5, c: 8, f: 0.1, fiber: 2, kcal: 35 } },
  { id: "f_tomatoes", name: "Cherry tomatoes", cat: "better", unit: "cup", unitType: "serving", macros: { p: 1.3, c: 6, f: 0.3, fiber: 1.8, kcal: 27 } },

  // ── Fast Food, Local Chains & Southwest Veg ─────────────────────────
  // Taco Bell
  { id: "ff_tb_nachofries", name: "Taco Bell Nacho Fries", cat: "fastfood", unit: "order", unitType: "count", macros: { p: 5, c: 47, f: 24, fiber: 4, kcal: 420 } },
  { id: "ff_tb_potatotaco", name: "Taco Bell Spicy Potato Soft Taco", cat: "fastfood", unit: "taco", unitType: "count", macros: { p: 5, c: 33, f: 12, fiber: 3, kcal: 240 } },
  { id: "ff_tb_beanburrito", name: "Taco Bell Bean Burrito", cat: "fastfood", unit: "burrito", unitType: "count", macros: { p: 13, c: 54, f: 9, fiber: 9, kcal: 350 } },
  { id: "ff_tb_crunchwrap_veg", name: "Taco Bell Black Bean Crunchwrap", cat: "fastfood", unit: "wrap", unitType: "count", macros: { p: 13, c: 73, f: 18, fiber: 8, kcal: 520 } },
  { id: "ff_tb_cheesygordita_veg", name: "Taco Bell Cheesy Gordita Crunch (Veg)", cat: "fastfood", unit: "taco", unitType: "count", macros: { p: 15, c: 42, f: 20, fiber: 6, kcal: 400 } },
  { id: "ff_tb_mexicanpizza_veg", name: "Taco Bell Mexican Pizza (Veg)", cat: "fastfood", unit: "pizza", unitType: "count", macros: { p: 16, c: 48, f: 26, fiber: 8, kcal: 480 } },
  { id: "ff_tb_chalupa_veg", name: "Taco Bell Black Bean Chalupa", cat: "fastfood", unit: "chalupa", unitType: "count", macros: { p: 10, c: 41, f: 18, fiber: 7, kcal: 340 } },
  { id: "ff_tb_cheesyrollup", name: "Taco Bell Cheesy Roll Up", cat: "fastfood", unit: "rollup", unitType: "count", macros: { p: 9, c: 15, f: 8, fiber: 1, kcal: 180 } },
  { id: "ff_tb_cinnabon", name: "Taco Bell Cinnabon Delights", cat: "fastfood", unit: "2 pack", unitType: "serving", macros: { p: 2, c: 17, f: 9, fiber: 0, kcal: 160 } },
  
  // Local / Southwest Style (Nico's, Beto's, Eegee's, Culver's)
  { id: "ff_nicos_beanburrito", name: "Nico's / Beto's Bean & Cheese Burrito", cat: "fastfood", unit: "large burrito", unitType: "count", macros: { p: 28, c: 85, f: 26, fiber: 14, kcal: 680 } },
  { id: "ff_nicos_quesadilla", name: "Nico's Cheese Quesadilla", cat: "fastfood", unit: "quesadilla", unitType: "count", macros: { p: 32, c: 45, f: 38, fiber: 3, kcal: 650 } },
  { id: "ff_nicos_chips", name: "Mexican Shop Chips & Salsa", cat: "fastfood", unit: "basket", unitType: "count", macros: { p: 6, c: 54, f: 24, fiber: 6, kcal: 450 } },
  { id: "ff_eegees_ranchfries", name: "Eegee's Ranch Fries", cat: "fastfood", unit: "regular", unitType: "count", macros: { p: 5, c: 60, f: 38, fiber: 5, kcal: 600 } },
  { id: "ff_culvers_curds", name: "Culver's Cheese Curds", cat: "fastfood", unit: "regular", unitType: "count", macros: { p: 20, c: 50, f: 26, fiber: 1, kcal: 510 } },
  { id: "ff_culvers_concrete", name: "Culver's Vanilla Concrete Mixer", cat: "fastfood", unit: "short", unitType: "count", macros: { p: 9, c: 53, f: 21, fiber: 0, kcal: 430 } },

  // Big Chains
  { id: "ff_dom_cheese", name: "Domino's Cheese Pizza", cat: "fastfood", unit: "slice (med)", unitType: "count", sizeSet: "default", macros: { p: 9, c: 25, f: 8, fiber: 1, kcal: 200 } },
  { id: "ff_dom_veggie", name: "Domino's Veggie Pizza", cat: "fastfood", unit: "slice (med)", unitType: "count", macros: { p: 9, c: 25, f: 8, fiber: 2, kcal: 200 } },
  { id: "ff_dom_bites", name: "Domino's Parm Bread Bites", cat: "fastfood", unit: "piece", unitType: "count", macros: { p: 1, c: 5, f: 1.5, fiber: 0, kcal: 37 } },
  { id: "ff_dom_stuffed", name: "Domino's Stuffed Cheesy Bread", cat: "fastfood", unit: "piece", unitType: "count", macros: { p: 6, c: 15, f: 6, fiber: 1, kcal: 140 } },
  { id: "ff_sbux_vanillabean", name: "Starbucks Vanilla Bean Frappe", cat: "fastfood", unit: "Grande", unitType: "count", macros: { p: 5, c: 57, f: 16, fiber: 0, kcal: 380 } },
  { id: "ff_sbux_caramelmac", name: "Starbucks Iced Caramel Macchiato", cat: "fastfood", unit: "Grande", unitType: "count", macros: { p: 7, c: 37, f: 7, fiber: 0, kcal: 250 } },
  { id: "ff_sbux_spinachfeta", name: "Starbucks Spinach Feta Wrap", cat: "fastfood", unit: "wrap", unitType: "count", macros: { p: 20, c: 34, f: 10, fiber: 3, kcal: 290 } },
  { id: "ff_sbux_eggbites", name: "Starbucks Egg White Bites", cat: "fastfood", unit: "order (2)", unitType: "count", macros: { p: 12, c: 11, f: 8, fiber: 0, kcal: 170 } },
  { id: "ff_sbux_croissant", name: "Starbucks Butter Croissant", cat: "fastfood", unit: "croissant", unitType: "count", macros: { p: 5, c: 28, f: 14, fiber: 1, kcal: 250 } },
  { id: "ff_sbux_cakepop", name: "Starbucks Cake Pop", cat: "fastfood", unit: "pop", unitType: "count", macros: { p: 1, c: 22, f: 7, fiber: 0, kcal: 160 } },
  { id: "ff_mcd_fries", name: "McDonald's Fries", cat: "fastfood", unit: "medium", unitType: "count", macros: { p: 4, c: 43, f: 15, fiber: 4, kcal: 320 } },
  { id: "ff_mcd_hashbrown", name: "McDonald's Hash Brown", cat: "fastfood", unit: "piece", unitType: "count", macros: { p: 2, c: 15, f: 9, fiber: 1, kcal: 140 } },
  { id: "ff_mcd_mcflurry", name: "McDonald's Oreo McFlurry", cat: "fastfood", unit: "regular", unitType: "count", macros: { p: 12, c: 80, f: 16, fiber: 1, kcal: 510 } },
  { id: "ff_bk_impossible", name: "BK Impossible Whopper", cat: "fastfood", unit: "burger", unitType: "count", macros: { p: 25, c: 58, f: 34, fiber: 4, kcal: 630 } },
  { id: "ff_chipotle_sofritas", name: "Chipotle Sofritas Bowl", cat: "fastfood", unit: "bowl", unitType: "count", macros: { p: 25, c: 65, f: 25, fiber: 12, kcal: 600 } },
  { id: "ff_chipotle_chipsguac", name: "Chipotle Chips & Guac", cat: "fastfood", unit: "order", unitType: "count", macros: { p: 9, c: 81, f: 49, fiber: 14, kcal: 770 } },
  { id: "ff_subway_veggie", name: "Subway Veggie Delite", cat: "fastfood", unit: "6-inch", unitType: "count", macros: { p: 8, c: 39, f: 2.5, fiber: 4, kcal: 200 } },
  { id: "ff_subway_cookie", name: "Subway Choc Chip Cookie", cat: "fastfood", unit: "cookie", unitType: "count", macros: { p: 2, c: 30, f: 10, fiber: 1, kcal: 210 } },
  { id: "ff_inout_grilledcheese", name: "In-N-Out Grilled Cheese", cat: "fastfood", unit: "sandwich", unitType: "count", macros: { p: 16, c: 39, f: 21, fiber: 3, kcal: 380 } },
  { id: "ff_inout_animalfries_veg", name: "In-N-Out Animal Fries", cat: "fastfood", unit: "order", unitType: "count", macros: { p: 9, c: 54, f: 24, fiber: 5, kcal: 470 } },
  { id: "ff_panera_broc", name: "Panera Broccoli Cheddar Soup", cat: "fastfood", unit: "bowl", unitType: "count", macros: { p: 14, c: 25, f: 24, fiber: 6, kcal: 360 } },
  { id: "ff_panera_mac", name: "Panera Mac & Cheese", cat: "fastfood", unit: "small", unitType: "count", macros: { p: 17, c: 34, f: 26, fiber: 1, kcal: 450 } },
  { id: "ff_panera_bagel", name: "Panera Asiago Cheese Bagel", cat: "fastfood", unit: "bagel", unitType: "count", macros: { p: 13, c: 55, f: 6, fiber: 2, kcal: 320 } },
  { id: "ff_panda_chowmein", name: "Panda Express Chow Mein", cat: "fastfood", unit: "side", unitType: "count", macros: { p: 13, c: 86, f: 23, fiber: 5, kcal: 510 } },
  { id: "ff_panda_eggplant", name: "Panda Express Eggplant Tofu", cat: "fastfood", unit: "entree", unitType: "count", macros: { p: 7, c: 23, f: 24, fiber: 3, kcal: 340 } },

  // ── Indian Snacks, Sweets & Curries (Massively Expanded) ────────────
  // Savory Packets & Sauces
  { id: "i_chings_schezwan", name: "Ching's Schezwan Chutney", cat: "indian", unit: "tbsp", unitType: "serving", macros: { p: 0.2, c: 3, f: 2, fiber: 0.1, kcal: 30 } },
  { id: "i_maggi", name: "Maggi 2-Minute Noodles", cat: "indian", unit: "packet", unitType: "count", macros: { p: 8, c: 52, f: 12, fiber: 2, kcal: 350 } },
  { id: "i_maggi_atta", name: "Maggi Atta Noodles", cat: "indian", unit: "packet", unitType: "count", macros: { p: 9, c: 45, f: 11, fiber: 4, kcal: 320 } },
  { id: "i_yippee", name: "Sunfeast Yippee Noodles", cat: "indian", unit: "packet", unitType: "count", macros: { p: 7, c: 42, f: 13, fiber: 2, kcal: 310 } },
  { id: "i_bhujia", name: "Haldiram's Aloo Bhujia", cat: "indian", unit: "bag", unitType: "size", sizeSet: "bag", macros: { p: 6, c: 26, f: 24, fiber: 4, kcal: 340 } },
  { id: "i_moongdal", name: "Haldiram's Moong Dal", cat: "indian", unit: "bag", unitType: "size", sizeSet: "bag", macros: { p: 14, c: 32, f: 12, fiber: 6, kcal: 300 } },
  { id: "i_khatta_meetha", name: "Haldiram's Khatta Meetha", cat: "indian", unit: "bag", unitType: "size", sizeSet: "bag", macros: { p: 5, c: 35, f: 18, fiber: 3, kcal: 320 } },
  { id: "i_navrattan", name: "Haldiram's Navrattan", cat: "indian", unit: "bag", unitType: "size", sizeSet: "bag", macros: { p: 8, c: 26, f: 22, fiber: 4, kcal: 330 } },
  { id: "i_kurkure_masala", name: "Kurkure Masala Munch", cat: "indian", unit: "bag", unitType: "size", sizeSet: "bag", macros: { p: 4, c: 34, f: 18, fiber: 2, kcal: 310 } },
  { id: "i_kurkure_chilli", name: "Kurkure Chilli Chatka", cat: "indian", unit: "bag", unitType: "size", sizeSet: "bag", macros: { p: 4, c: 33, f: 19, fiber: 2, kcal: 320 } },
  { id: "i_kurkure_solidmasti", name: "Kurkure Solid Masti", cat: "indian", unit: "bag", unitType: "size", sizeSet: "bag", macros: { p: 3, c: 36, f: 15, fiber: 1, kcal: 300 } },
  { id: "i_lays_magicmasala", name: "Lay's India's Magic Masala", cat: "indian", unit: "bag", unitType: "size", sizeSet: "bag", macros: { p: 4, c: 32, f: 20, fiber: 2, kcal: 320 } },
  { id: "i_lays_tomato", name: "Lay's Spanish Tomato Tango", cat: "indian", unit: "bag", unitType: "size", sizeSet: "bag", macros: { p: 4, c: 32, f: 20, fiber: 2, kcal: 320 } },
  
  // Biscuits & Baked Goods
  { id: "i_parleg", name: "Parle-G", cat: "indian", unit: "packet (small)", unitType: "count", macros: { p: 4, c: 45, f: 8, fiber: 1, kcal: 270 } },
  { id: "i_goodday", name: "Britannia Good Day", cat: "indian", unit: "2 biscuits", unitType: "serving", macros: { p: 1.5, c: 14, f: 6, fiber: 0.5, kcal: 115 } },
  { id: "i_bourbon", name: "Britannia Bourbon", cat: "indian", unit: "2 biscuits", unitType: "serving", macros: { p: 1, c: 17, f: 5, fiber: 0.5, kcal: 120 } },
  { id: "i_darkfantasy", name: "Sunfeast Dark Fantasy", cat: "indian", unit: "cookie", unitType: "count", macros: { p: 1, c: 10, f: 4.5, fiber: 0.5, kcal: 85 } },
  { id: "i_marie_gold", name: "Marie Gold", cat: "indian", unit: "3 biscuits", unitType: "serving", macros: { p: 2, c: 18, f: 3, fiber: 1, kcal: 105 } },
  { id: "i_rusk", name: "Toast / Rusk", cat: "indian", unit: "piece", unitType: "count", macros: { p: 1.5, c: 10, f: 2.5, fiber: 0.5, kcal: 65 } },
  { id: "i_khari", name: "Khari Biscuit", cat: "indian", unit: "piece", unitType: "count", macros: { p: 1, c: 8, f: 6, fiber: 0, kcal: 90 } },

  // Street Food, Meals & Curries
  { id: "i_masala_dosa", name: "Masala Dosa", cat: "indian", unit: "dosa", unitType: "count", macros: { p: 8, c: 65, f: 12, fiber: 5, kcal: 400 } },
  { id: "i_idli", name: "Idli", cat: "indian", unit: "piece", unitType: "count", macros: { p: 2, c: 12, f: 0.2, fiber: 1, kcal: 58 } },
  { id: "i_sambar", name: "Sambar", cat: "indian", unit: "1/2 cup", unitType: "serving", macros: { p: 3, c: 10, f: 2, fiber: 2, kcal: 70 } },
  { id: "i_poha", name: "Poha", cat: "indian", unit: "cup", unitType: "serving", macros: { p: 5, c: 45, f: 8, fiber: 3, kcal: 260 } },
  { id: "i_upma", name: "Upma", cat: "indian", unit: "cup", unitType: "serving", macros: { p: 5, c: 35, f: 10, fiber: 2, kcal: 250 } },
  { id: "i_sabudana", name: "Sabudana Khichdi", cat: "indian", unit: "cup", unitType: "serving", macros: { p: 4, c: 55, f: 12, fiber: 2, kcal: 330 } },
  { id: "i_dal_makhani", name: "Dal Makhani", cat: "indian", unit: "1/2 cup", unitType: "serving", macros: { p: 7, c: 17, f: 8, fiber: 6, kcal: 160 } },
  { id: "i_dal_tadka", name: "Dal Tadka (Yellow Dal)", cat: "indian", unit: "1/2 cup", unitType: "serving", macros: { p: 9, c: 18, f: 4, fiber: 7, kcal: 140 } },
  { id: "i_palak_paneer", name: "Palak Paneer", cat: "indian", unit: "1/2 cup", unitType: "serving", macros: { p: 10, c: 8, f: 14, fiber: 3, kcal: 190 } },
  { id: "i_jeera_rice", name: "Jeera Rice", cat: "indian", unit: "cup", unitType: "serving", macros: { p: 4, c: 45, f: 4, fiber: 1, kcal: 230 } },
  { id: "i_roti", name: "Roti / Phulka (no ghee)", cat: "indian", unit: "piece", unitType: "count", macros: { p: 3, c: 15, f: 0.5, fiber: 2, kcal: 75 } },
  { id: "i_garlic_naan", name: "Garlic Naan", cat: "indian", unit: "piece", unitType: "count", macros: { p: 6, c: 40, f: 7, fiber: 2, kcal: 250 } },
  { id: "i_aloo_paratha", name: "Aloo Paratha", cat: "indian", unit: "piece", unitType: "count", macros: { p: 5, c: 35, f: 8, fiber: 3, kcal: 230 } },
  { id: "i_samosa", name: "Samosa", cat: "indian", unit: "samosa", unitType: "count", macros: { p: 4, c: 24, f: 12, fiber: 2, kcal: 220 } },
  { id: "i_kachori", name: "Kachori", cat: "indian", unit: "piece", unitType: "count", macros: { p: 4, c: 22, f: 14, fiber: 2, kcal: 230 } },
  { id: "i_aloo_tikki", name: "Aloo Tikki", cat: "indian", unit: "piece", unitType: "count", macros: { p: 2, c: 20, f: 7, fiber: 2, kcal: 150 } },
  { id: "i_vada_pav", name: "Vada pav", cat: "indian", unit: "piece", unitType: "count", macros: { p: 6, c: 40, f: 12, fiber: 3, kcal: 290 } },
  { id: "i_pav_bhaji", name: "Pav Bhaji (with 2 Pav)", cat: "indian", unit: "plate", unitType: "count", macros: { p: 12, c: 65, f: 18, fiber: 8, kcal: 470 } },
  { id: "i_chole_bhature", name: "Chole Bhature (2 Bhature)", cat: "indian", unit: "plate", unitType: "count", macros: { p: 15, c: 80, f: 28, fiber: 10, kcal: 620 } },
  { id: "i_pani_puri", name: "Pani puri / Golgappa", cat: "indian", unit: "piece", unitType: "count", macros: { p: 0.6, c: 6, f: 1.5, fiber: 0.5, kcal: 36 } },
  { id: "i_bhel", name: "Bhel puri", cat: "indian", unit: "cup", unitType: "serving", macros: { p: 4, c: 30, f: 6, fiber: 3, kcal: 180 } },
  { id: "i_dhokla", name: "Dhokla", cat: "indian", unit: "piece", unitType: "count", macros: { p: 2, c: 7, f: 1.3, fiber: 0.7, kcal: 50 } },
  { id: "i_makhana", name: "Roasted Makhana (Fox Nuts)", cat: "indian", unit: "cup", unitType: "serving", macros: { p: 3, c: 22, f: 2, fiber: 2, kcal: 120 } },
  { id: "i_namakpare", name: "Namak Pare", cat: "indian", unit: "1/4 cup", unitType: "serving", macros: { p: 3, c: 18, f: 10, fiber: 1, kcal: 170 } },
  
  // Indian Sweets
  { id: "i_gulab_jamun", name: "Gulab jamun", cat: "indian", unit: "piece", unitType: "count", macros: { p: 2, c: 21, f: 6, fiber: 0, kcal: 150 } },
  { id: "i_rasmalai", name: "Rasmalai", cat: "indian", unit: "piece", unitType: "count", macros: { p: 5, c: 25, f: 8, fiber: 0, kcal: 190 } },
  { id: "i_gajar_halwa", name: "Gajar Ka Halwa", cat: "indian", unit: "1/2 cup", unitType: "serving", macros: { p: 4, c: 35, f: 12, fiber: 3, kcal: 260 } },
  { id: "i_kheer", name: "Rice Kheer", cat: "indian", unit: "1/2 cup", unitType: "serving", macros: { p: 5, c: 30, f: 6, fiber: 0, kcal: 200 } },
  { id: "i_soan_papdi", name: "Soan Papdi", cat: "indian", unit: "piece", unitType: "count", macros: { p: 2, c: 16, f: 8, fiber: 1, kcal: 140 } },
  { id: "i_motichoor", name: "Motichoor Laddu", cat: "indian", unit: "piece", unitType: "count", macros: { p: 2, c: 22, f: 8, fiber: 1, kcal: 170 } },
  { id: "i_jalebi", name: "Jalebi", cat: "indian", unit: "piece", unitType: "count", macros: { p: 0.5, c: 18, f: 5, fiber: 0, kcal: 120 } },
  { id: "i_kaju_katli", name: "Kaju katli", cat: "indian", unit: "piece", unitType: "count", macros: { p: 1.5, c: 10, f: 4, fiber: 0.3, kcal: 80 } },

  // ── Groceries, Junk & Packaged Foods ────────────────────────────────
  // Chips, Puffs & Pretzels
  { id: "p_cheetos", name: "Cheetos", cat: "packaged", unit: "bag", unitType: "size", sizeSet: "bag", macros: { p: 2, c: 15, f: 10, fiber: 1, kcal: 160 } },
  { id: "p_takis", name: "Takis Fuego", cat: "packaged", unit: "bag", unitType: "size", sizeSet: "bag", macros: { p: 2, c: 17, f: 8, fiber: 1, kcal: 140 } },
  { id: "p_takis_blue", name: "Takis Blue Heat", cat: "packaged", unit: "bag", unitType: "size", sizeSet: "bag", macros: { p: 2, c: 17, f: 8, fiber: 1, kcal: 140 } },
  { id: "p_chips", name: "Lay's Classic", cat: "packaged", unit: "bag", unitType: "size", sizeSet: "bag", macros: { p: 2, c: 15, f: 10, fiber: 1, kcal: 160 } },
  { id: "p_ruffles", name: "Ruffles Cheddar & Sour Cream", cat: "packaged", unit: "bag", unitType: "size", sizeSet: "bag", macros: { p: 2, c: 15, f: 10, fiber: 1, kcal: 160 } },
  { id: "p_tostitos", name: "Tostitos Scoops", cat: "packaged", unit: "bag", unitType: "size", sizeSet: "bag", macros: { p: 2, c: 19, f: 7, fiber: 2, kcal: 140 } },
  { id: "p_sunchips", name: "SunChips Harvest Cheddar", cat: "packaged", unit: "bag", unitType: "size", sizeSet: "bag", macros: { p: 2, c: 18, f: 6, fiber: 3, kcal: 140 } },
  { id: "p_popcorners", name: "PopCorners Kettle Corn", cat: "packaged", unit: "bag", unitType: "size", sizeSet: "bag", macros: { p: 1, c: 19, f: 4, fiber: 0, kcal: 120 } },
  { id: "p_funyuns", name: "Funyuns", cat: "packaged", unit: "bag", unitType: "size", sizeSet: "bag", macros: { p: 2, c: 18, f: 8, fiber: 1, kcal: 140 } },
  { id: "p_pringles", name: "Pringles", cat: "packaged", unit: "15 crisps", unitType: "serving", macros: { p: 1, c: 15, f: 9, fiber: 1, kcal: 150 } },
  { id: "p_doritos", name: "Doritos", cat: "packaged", unit: "bag", unitType: "size", sizeSet: "bag", macros: { p: 2, c: 16, f: 8, fiber: 1, kcal: 150 } },
  { id: "p_chexmix", name: "Chex Mix (Traditional)", cat: "packaged", unit: "1/2 cup", unitType: "serving", macros: { p: 3, c: 22, f: 3.5, fiber: 2, kcal: 120 } },
  { id: "p_bugles", name: "Bugles", cat: "packaged", unit: "1.5 cups", unitType: "serving", macros: { p: 2, c: 18, f: 9, fiber: 0, kcal: 160 } },
  { id: "p_fritos", name: "Fritos Original", cat: "packaged", unit: "bag", unitType: "size", sizeSet: "bag", macros: { p: 2, c: 16, f: 10, fiber: 1, kcal: 160 } },
  { id: "p_pretzels", name: "Pretzels (Rold Gold)", cat: "packaged", unit: "1 oz", unitType: "serving", macros: { p: 3, c: 23, f: 1, fiber: 1, kcal: 110 } },
  { id: "p_crackers", name: "Ritz Crackers", cat: "packaged", unit: "5 crackers", unitType: "serving", macros: { p: 1, c: 10, f: 4.5, fiber: 0, kcal: 80 } },
  { id: "p_cheezit", name: "Cheez-It", cat: "packaged", unit: "27 crackers", unitType: "serving", macros: { p: 3, c: 17, f: 8, fiber: 1, kcal: 150 } },
  { id: "p_goldfish", name: "Goldfish Crackers", cat: "packaged", unit: "55 crackers", unitType: "serving", macros: { p: 3, c: 20, f: 5, fiber: 1, kcal: 140 } },
  { id: "p_tj_takis", name: "TJ's Rolled Corn Tortilla Chips", cat: "packaged", unit: "1 oz", unitType: "serving", macros: { p: 2, c: 16, f: 8, fiber: 2, kcal: 150 } },
  { id: "p_tj_pbpretzel", name: "TJ's Peanut Butter Pretzels", cat: "packaged", unit: "11 nuggets", unitType: "serving", macros: { p: 5, c: 15, f: 7, fiber: 1, kcal: 140 } },

  // Cookies, Pastries & Sweets
  { id: "p_poptart", name: "Pop-Tart (Unfrosted Strawberry)", cat: "packaged", unit: "pastry", unitType: "count", macros: { p: 2, c: 37, f: 5, fiber: 1, kcal: 200 } },
  { id: "p_poptart_brownsugar", name: "Pop-Tart (Brown Sugar)", cat: "packaged", unit: "pastry", unitType: "count", macros: { p: 2, c: 34, f: 5, fiber: 1, kcal: 190 } },
  { id: "p_oreos", name: "Oreos (Double Stuf)", cat: "packaged", unit: "cookie", unitType: "count", macros: { p: 0.5, c: 10, f: 3.5, fiber: 0.4, kcal: 70 } },
  { id: "p_chipsahoy", name: "Chips Ahoy", cat: "packaged", unit: "cookie", unitType: "count", macros: { p: 0.5, c: 7, f: 2.5, fiber: 0, kcal: 53 } },
  { id: "p_nutterbutter", name: "Nutter Butter", cat: "packaged", unit: "cookie", unitType: "count", macros: { p: 1, c: 9, f: 3.5, fiber: 0.5, kcal: 65 } },
  { id: "p_teddygraham", name: "Teddy Grahams", cat: "packaged", unit: "24 pieces", unitType: "serving", macros: { p: 2, c: 22, f: 4, fiber: 1, kcal: 130 } },
  { id: "p_animalcracker", name: "Animal Crackers", cat: "packaged", unit: "16 crackers", unitType: "serving", macros: { p: 2, c: 22, f: 3, fiber: 1, kcal: 120 } },
  { id: "p_nillawafer", name: "Nilla Wafers", cat: "packaged", unit: "8 wafers", unitType: "serving", macros: { p: 1, c: 21, f: 5, fiber: 0, kcal: 140 } },
  { id: "p_biscoff", name: "Biscoff Cookies", cat: "packaged", unit: "4 cookies", unitType: "serving", macros: { p: 2, c: 23, f: 6, fiber: 0, kcal: 150 } },
  { id: "p_tj_cookiebutter", name: "TJ's Speculoos Cookie Butter", cat: "sweet", unit: "tbsp", unitType: "serving", macros: { p: 0.5, c: 8, f: 6, fiber: 0, kcal: 90 } },
  
  // Candies
  { id: "p_choc_dark", name: "Dark chocolate", cat: "sweet", unit: "square", unitType: "count", macros: { p: 1, c: 8, f: 5, fiber: 1.5, kcal: 85 } },
  { id: "p_choc_milk", name: "Milk chocolate", cat: "sweet", unit: "square", unitType: "count", macros: { p: 1, c: 9, f: 5, fiber: 0.5, kcal: 90 } },
  { id: "p_mnm", name: "M&Ms", cat: "sweet", unit: "fun-size pack", unitType: "count", macros: { p: 0.8, c: 11, f: 3.5, fiber: 0.5, kcal: 73 } },
  { id: "p_snickers", name: "Snickers", cat: "sweet", unit: "regular bar", unitType: "count", macros: { p: 4, c: 33, f: 12, fiber: 1, kcal: 250 } },
  { id: "p_twix", name: "Twix", cat: "sweet", unit: "regular pack (2 bars)", unitType: "count", macros: { p: 2, c: 34, f: 12, fiber: 0, kcal: 250 } },
  { id: "p_reeses", name: "Reese's Peanut Butter Cups", cat: "sweet", unit: "regular pack (2 cups)", unitType: "count", macros: { p: 5, c: 24, f: 13, fiber: 2, kcal: 210 } },
  { id: "p_reeses_pieces", name: "Reese's Pieces", cat: "sweet", unit: "1/4 cup", unitType: "serving", macros: { p: 5, c: 25, f: 9, fiber: 2, kcal: 200 } },
  { id: "p_hershey", name: "Hershey's Milk Chocolate Bar", cat: "sweet", unit: "bar", unitType: "count", macros: { p: 3, c: 26, f: 13, fiber: 1, kcal: 220 } },
  { id: "p_kitkat", name: "KitKat", cat: "sweet", unit: "regular bar", unitType: "count", macros: { p: 3, c: 27, f: 11, fiber: 1, kcal: 210 } },
  { id: "p_skittles", name: "Skittles", cat: "sweet", unit: "regular pack", unitType: "count", macros: { p: 0, c: 56, f: 2.5, fiber: 0, kcal: 250 } },
  { id: "p_sourpatch", name: "Sour Patch Kids", cat: "sweet", unit: "regular pack", unitType: "count", macros: { p: 0, c: 36, f: 0, fiber: 0, kcal: 140 } },
  { id: "p_swedishfish", name: "Swedish Fish", cat: "sweet", unit: "5 pieces", unitType: "serving", macros: { p: 0, c: 27, f: 0, fiber: 0, kcal: 110 } },
  { id: "p_sourpunch", name: "Sour Punch Straws", cat: "sweet", unit: "9 straws", unitType: "serving", macros: { p: 1, c: 33, f: 0, fiber: 0, kcal: 130 } },
  { id: "p_fruitsnack", name: "Fruit Snacks (Pectin/Vegan)", cat: "sweet", unit: "pouch", unitType: "count", macros: { p: 0, c: 19, f: 0, fiber: 0, kcal: 80 } },

  // ── Better-for-you / Low Carb / High Protein ────────────────────────
  { id: "b_bettergoods_cauli", name: "Bettergoods Cauli Pizza", cat: "better", unit: "1/3 pizza", unitType: "serving", macros: { p: 6, c: 25, f: 6, fiber: 2, kcal: 170 } },
  { id: "b_caulipizza", name: "Caulipower cauliflower pizza", cat: "better", unit: "1/3 pizza", unitType: "serving", macros: { p: 6, c: 25, f: 6, fiber: 2, kcal: 170 } },
  { id: "b_banza", name: "Banza chickpea pasta", cat: "better", unit: "2 oz dry", unitType: "serving", macros: { p: 14, c: 32, f: 4, fiber: 8, kcal: 190 } },
  { id: "b_banza_mac", name: "Banza Mac & Cheese", cat: "better", unit: "1/2 box prep", unitType: "serving", macros: { p: 18, c: 36, f: 12, fiber: 8, kcal: 320 } },
  { id: "b_edamame_pasta", name: "Edamame Pasta", cat: "better", unit: "2 oz dry", unitType: "serving", macros: { p: 24, c: 20, f: 3, fiber: 13, kcal: 200 } },
  { id: "b_halo", name: "Halo Top ice cream", cat: "better", unit: "1/2 cup", unitType: "serving", macros: { p: 5, c: 14, f: 3, fiber: 3, kcal: 90 } },
  { id: "b_yasso", name: "Yasso Greek Yogurt Bar", cat: "better", unit: "bar", unitType: "count", macros: { p: 5, c: 16, f: 2, fiber: 0, kcal: 100 } },
  { id: "b_outshine", name: "Outshine Fruit Bar", cat: "better", unit: "bar", unitType: "count", macros: { p: 0, c: 15, f: 0, fiber: 1, kcal: 60 } },
  { id: "b_kodiak_cup", name: "Kodiak Cakes Flapjack Cup", cat: "better", unit: "cup", unitType: "count", macros: { p: 14, c: 36, f: 3.5, fiber: 3, kcal: 230 } },
  { id: "b_proteinchips", name: "Quest protein chips", cat: "better", unit: "bag", unitType: "count", macros: { p: 19, c: 5, f: 4, fiber: 1, kcal: 140 } },
  { id: "b_questcookie", name: "Quest Protein Cookie", cat: "better", unit: "cookie", unitType: "count", macros: { p: 15, c: 19, f: 17, fiber: 9, kcal: 250 } },
  { id: "b_legendary_poptart", name: "Legendary Protein Pastry", cat: "better", unit: "pastry", unitType: "count", macros: { p: 20, c: 24, f: 8, fiber: 8, kcal: 180 } },
  { id: "b_magicspoon", name: "Magic Spoon Cereal", cat: "better", unit: "cup", unitType: "serving", macros: { p: 13, c: 15, f: 5, fiber: 1, kcal: 140 } },
  { id: "b_catalina", name: "Catalina Crunch Cereal", cat: "better", unit: "1/2 cup", unitType: "serving", macros: { p: 11, c: 14, f: 5, fiber: 9, kcal: 110 } },
  { id: "b_twogood", name: "Two Good yogurt", cat: "better", unit: "cup", unitType: "serving", macros: { p: 12, c: 3, f: 2, fiber: 0, kcal: 80 } },
  { id: "b_chobani_flip", name: "Chobani Flip", cat: "better", unit: "tub", unitType: "count", macros: { p: 10, c: 22, f: 5, fiber: 1, kcal: 170 } },
  { id: "b_chobani_complete", name: "Chobani Complete Drink", cat: "better", unit: "bottle", unitType: "count", macros: { p: 20, c: 14, f: 2.5, fiber: 3, kcal: 140 } },
  { id: "b_oikos_pro", name: "Oikos Pro Yogurt", cat: "better", unit: "cup", unitType: "serving", macros: { p: 20, c: 8, f: 3, fiber: 0, kcal: 140 } },
  { id: "b_skinnypop", name: "SkinnyPop popcorn", cat: "better", unit: "bag", unitType: "size", sizeSet: "bag", macros: { p: 3, c: 15, f: 11, fiber: 3, kcal: 150 } },
  { id: "b_seaweed", name: "Roasted seaweed snack", cat: "better", unit: "pack", unitType: "count", macros: { p: 1, c: 1, f: 2.5, fiber: 0.5, kcal: 30 } },
  { id: "b_ricecake", name: "Rice cake", cat: "better", unit: "cake", unitType: "count", macros: { p: 1, c: 7, f: 0.3, fiber: 0.3, kcal: 35 } },
  { id: "b_proteinbar_zero", name: "Barebells protein bar", cat: "better", unit: "bar", unitType: "count", macros: { p: 20, c: 16, f: 8, fiber: 3, kcal: 200 } },
  { id: "b_proteinshake", name: "Premier Protein shake", cat: "better", unit: "bottle", unitType: "glass", macros: { p: 30, c: 5, f: 3, fiber: 1, kcal: 160 } },
  { id: "b_edamame", name: "Edamame", cat: "better", unit: "1/2 cup", unitType: "serving", macros: { p: 9, c: 7, f: 4, fiber: 4, kcal: 100 } },
  { id: "b_seitan", name: "Seitan", cat: "better", unit: "3 oz", unitType: "serving", macros: { p: 21, c: 4, f: 1.5, fiber: 1, kcal: 120 } },
  { id: "b_tofu_firm", name: "Extra Firm Tofu", cat: "better", unit: "3 oz", unitType: "serving", macros: { p: 8, c: 2, f: 4, fiber: 1, kcal: 80 } },

  // ── Drinks ──────────────────────────────────────────────────────────
  { id: "d_lemonade", name: "Lemonade (homemade)", cat: "drink", unit: "glass", unitType: "glass", homemadeSweet: true, sugarCarbs: 22, macros: { p: 0, c: 24, f: 0, fiber: 0, kcal: 96 } },
  { id: "d_lemonade_store", name: "Lemonade (store-bought)", cat: "drink", unit: "glass", unitType: "glass", macros: { p: 0, c: 26, f: 0, fiber: 0, kcal: 104 } },
  { id: "d_chai_sugar", name: "Chai (milk + sugar)", cat: "drink", unit: "cup", unitType: "glass", homemadeSweet: true, sugarCarbs: 8, macros: { p: 3, c: 14, f: 3, fiber: 0, kcal: 90 } },
  { id: "d_chai_nosugar", name: "Chai (milk, no sugar)", cat: "drink", unit: "cup", unitType: "glass", macros: { p: 3, c: 6, f: 3, fiber: 0, kcal: 60 } },
  { id: "d_greentea", name: "Green tea", cat: "drink", unit: "cup", unitType: "glass", macros: { p: 0, c: 0, f: 0, fiber: 0, kcal: 2 } },
  { id: "d_blackcoffee", name: "Black coffee", cat: "drink", unit: "cup", unitType: "glass", macros: { p: 0, c: 0, f: 0, fiber: 0, kcal: 5 } },
  { id: "d_latte", name: "Latte", cat: "drink", unit: "cup", unitType: "glass", macros: { p: 8, c: 13, f: 7, fiber: 0, kcal: 150 } },
  { id: "d_boba", name: "Boba Milk Tea", cat: "drink", unit: "cup", unitType: "glass", macros: { p: 1, c: 54, f: 6, fiber: 1, kcal: 270 } },
  { id: "d_coke", name: "Coke", cat: "drink", unit: "can", unitType: "glass", macros: { p: 0, c: 39, f: 0, fiber: 0, kcal: 140 } },
  { id: "d_dietcoke", name: "Diet Coke / Coke Zero", cat: "drink", unit: "can", unitType: "glass", macros: { p: 0, c: 0, f: 0, fiber: 0, kcal: 0 } },
  { id: "d_sprite", name: "Sprite", cat: "drink", unit: "can", unitType: "glass", macros: { p: 0, c: 38, f: 0, fiber: 0, kcal: 140 } },
  { id: "d_redbull", name: "Red Bull", cat: "drink", unit: "can (8oz)", unitType: "count", macros: { p: 0, c: 27, f: 0, fiber: 0, kcal: 110 } },
  { id: "d_redbull_sf", name: "Red Bull Sugar Free", cat: "drink", unit: "can (8oz)", unitType: "count", macros: { p: 0, c: 2, f: 0, fiber: 0, kcal: 10 } },
  { id: "d_monster_ultra", name: "Monster Zero Ultra", cat: "drink", unit: "can (16oz)", unitType: "count", macros: { p: 0, c: 4, f: 0, fiber: 0, kcal: 10 } },
  { id: "d_celsius", name: "Celsius Energy", cat: "drink", unit: "can", unitType: "count", macros: { p: 0, c: 2, f: 0, fiber: 0, kcal: 10 } },
  { id: "d_poppi", name: "Poppi Prebiotic Soda", cat: "drink", unit: "can", unitType: "count", macros: { p: 0, c: 5, f: 0, fiber: 2, kcal: 25 } },
  { id: "d_olipop", name: "Olipop", cat: "drink", unit: "can", unitType: "count", macros: { p: 0, c: 16, f: 0, fiber: 9, kcal: 35 } },
  { id: "d_spindrift", name: "Spindrift Sparkling Water", cat: "drink", unit: "can", unitType: "count", macros: { p: 0, c: 3, f: 0, fiber: 0, kcal: 15 } },
  { id: "d_prime", name: "Prime Hydration", cat: "drink", unit: "bottle", unitType: "count", macros: { p: 0, c: 6, f: 0, fiber: 0, kcal: 25 } },
  { id: "d_liquiddeath", name: "Liquid Death (Flavored)", cat: "drink", unit: "can", unitType: "count", macros: { p: 0, c: 4, f: 0, fiber: 0, kcal: 20 } },
  { id: "d_dutch_goldeneagle", name: "Dutch Bros Golden Eagle (Med Iced)", cat: "drink", unit: "medium", unitType: "count", macros: { p: 7, c: 64, f: 16, fiber: 0, kcal: 430 } },
  { id: "d_dutch_rebel", name: "Dutch Bros Blue Rebel (Med Iced)", cat: "drink", unit: "medium", unitType: "count", macros: { p: 0, c: 52, f: 0, fiber: 0, kcal: 200 } },
  { id: "d_lassi_sweet", name: "Sweet lassi", cat: "drink", unit: "glass", unitType: "glass", homemadeSweet: true, sugarCarbs: 18, macros: { p: 8, c: 30, f: 5, fiber: 0, kcal: 200 } },
  { id: "d_lassi_salt", name: "Salted lassi / chaas", cat: "drink", unit: "glass", unitType: "glass", macros: { p: 6, c: 8, f: 4, fiber: 0, kcal: 90 } },
  { id: "d_nimbu_pani", name: "Nimbu pani", cat: "drink", unit: "glass", unitType: "glass", homemadeSweet: true, sugarCarbs: 18, macros: { p: 0, c: 20, f: 0, fiber: 0, kcal: 80 } },
  { id: "d_protein_water", name: "Protein water", cat: "drink", unit: "bottle", unitType: "glass", macros: { p: 21, c: 2, f: 1, fiber: 0, kcal: 100 } },
  { id: "d_fairlife", name: "Fairlife Chocolate", cat: "drink", unit: "bottle", unitType: "glass", macros: { p: 30, c: 4, f: 4.5, fiber: 1, kcal: 150 } },
  { id: "d_kombucha", name: "Kombucha", cat: "drink", unit: "bottle", unitType: "glass", macros: { p: 0, c: 12, f: 0, fiber: 0, kcal: 50 } },
  { id: "d_beer", name: "Beer", cat: "drink", unit: "bottle", unitType: "glass", macros: { p: 1.6, c: 13, f: 0, fiber: 0, kcal: 153 } },
  { id: "d_gatorade", name: "Gatorade", cat: "drink", unit: "bottle", unitType: "glass", macros: { p: 0, c: 34, f: 0, fiber: 0, kcal: 130 } },
  { id: "d_coconut", name: "Coconut water", cat: "drink", unit: "cup", unitType: "glass", macros: { p: 2, c: 9, f: 0, fiber: 3, kcal: 46 } },
  { id: "d_eegees", name: "Eegee's Lemon Freeze", cat: "drink", unit: "small", unitType: "glass", macros: { p: 0, c: 36, f: 0, fiber: 0, kcal: 140 } },

  // ── Nuts, Seeds & Dairy ─────────────────────────────────────────────
  { id: "n_almonds", name: "Almonds", cat: "nuts", unit: "10 almonds", unitType: "serving", macros: { p: 3, c: 2, f: 6, fiber: 1.5, kcal: 70 } },
  { id: "n_walnuts", name: "Walnuts", cat: "nuts", unit: "7 halves", unitType: "serving", macros: { p: 3, c: 2, f: 13, fiber: 1, kcal: 131 } },
  { id: "n_cashews", name: "Cashews", cat: "nuts", unit: "1 oz", unitType: "serving", macros: { p: 5, c: 9, f: 12, fiber: 1, kcal: 157 } },
  { id: "n_peanuts", name: "Peanuts", cat: "nuts", unit: "1 oz", unitType: "serving", macros: { p: 7, c: 5, f: 14, fiber: 2, kcal: 161 } },
  { id: "n_pistachios", name: "Pistachios", cat: "nuts", unit: "1 oz", unitType: "serving", macros: { p: 6, c: 8, f: 13, fiber: 3, kcal: 159 } },
  { id: "n_pb", name: "Peanut butter", cat: "nuts", unit: "tbsp", unitType: "serving", macros: { p: 4, c: 3, f: 8, fiber: 1, kcal: 96 } },
  { id: "n_almond_butter", name: "Almond butter", cat: "nuts", unit: "tbsp", unitType: "serving", macros: { p: 3.5, c: 3, f: 9, fiber: 1.5, kcal: 98 } },
  { id: "n_trailmix", name: "Trail mix", cat: "nuts", unit: "1/4 cup", unitType: "serving", macros: { p: 4, c: 13, f: 10, fiber: 2, kcal: 175 } },
  { id: "n_pumpkin", name: "Pumpkin seeds", cat: "nuts", unit: "1 oz", unitType: "serving", macros: { p: 9, c: 3, f: 13, fiber: 2, kcal: 158 } },
  { id: "dy_greek", name: "Greek yogurt", cat: "dairy", unit: "cup", unitType: "serving", macros: { p: 23, c: 9, f: 5, fiber: 0, kcal: 170 } },
  { id: "dy_dahi", name: "Regular dahi", cat: "dairy", unit: "cup", unitType: "serving", macros: { p: 9, c: 11, f: 8, fiber: 0, kcal: 150 } },
  { id: "dy_cottage", name: "Cottage cheese", cat: "dairy", unit: "1/2 cup", unitType: "serving", macros: { p: 12, c: 4, f: 5, fiber: 0, kcal: 110 } },
  { id: "dy_goodculture", name: "Good Culture Cottage Cheese", cat: "dairy", unit: "1/2 cup", unitType: "serving", macros: { p: 14, c: 3, f: 4, fiber: 0, kcal: 110 } },
  { id: "dy_cheese", name: "Cheese slice", cat: "dairy", unit: "slice", unitType: "count", macros: { p: 4, c: 1, f: 5, fiber: 0, kcal: 60 } },
  { id: "dy_string", name: "Light String Cheese", cat: "dairy", unit: "stick", unitType: "count", macros: { p: 7, c: 1, f: 2.5, fiber: 0, kcal: 50 } },
  { id: "dy_babybel", name: "Babybel Cheese", cat: "dairy", unit: "wheel", unitType: "count", macros: { p: 5, c: 0, f: 6, fiber: 0, kcal: 70 } },
  { id: "dy_laughingcow", name: "Laughing Cow Wedge", cat: "dairy", unit: "wedge", unitType: "count", macros: { p: 2, c: 1, f: 1.5, fiber: 0, kcal: 30 } },
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
