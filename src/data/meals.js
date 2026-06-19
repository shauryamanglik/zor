// Zor meal plan — Shaw's revised weekly plan.
// All eggs confined to breakfast. Variety across chole/paneer/dal formats.
// Editable at runtime via Settings (overrides stored in state + Sheets).

export const MEAL_SLOTS = ["Breakfast", "Lunch", "Pre-gym", "Dinner", "Snack"];

export const MEAL_PLAN = {
  Mon: [
    {
      slot: "Breakfast", id: "mon-b", name: "Masala Veggie Omelette + Ezekiel Toast",
      macros: { p: 30, c: 22, f: 14, fiber: 4, kcal: 334 }, veg: "Spinach, onion, tomato",
      ingredients: ["2 whole eggs", "2 egg whites", "Onion", "Tomato", "Spinach", "Green chili", "Turmeric", "1 Ezekiel slice", "Lemon"],
      recipe: [
        "Whisk 2 whole eggs + 2 egg whites with a pinch of salt.",
        "Heat pan on medium, 1 tsp oil.",
        "Add chopped onion, tomato, spinach, green chili, pinch turmeric.",
        "Pour eggs over, cook 3 min, fold.",
        "Toast 1 Ezekiel slice in the sandwich press or pan (no toaster needed).",
        "Squeeze lemon over the spinach before eating — boosts iron absorption.",
      ],
    },
    {
      slot: "Lunch", id: "mon-l", name: "Chole Sandwich + Tamarind Chutney (press)",
      macros: { p: 32, c: 56, f: 10, fiber: 12, kcal: 448 }, veg: "Cucumber, onion",
      ingredients: ["Sunday chole (thick)", "2 Ezekiel slices", "Tamarind chutney", "Onion", "Cucumber"],
      recipe: [
        "Take thick chole from Sunday batch (drain excess liquid so it doesn't go soggy).",
        "Spread chole on 1 Ezekiel slice. Add a thin layer of tamarind chutney.",
        "Add thin raw onion + cucumber.",
        "Close with second slice, press in the MyMini sandwich maker 3-4 min till golden.",
        "Wrap in foil for your tiffin.",
      ],
    },
    {
      slot: "Pre-gym", id: "mon-p", name: "Fairlife Chocolate + Banana + Creatine",
      macros: { p: 33, c: 42, f: 5, fiber: 3, kcal: 345 }, veg: "Banana",
      ingredients: ["1 Fairlife Chocolate bottle", "1 banana", "5g creatine"],
      recipe: ["Drink 1 Fairlife bottle cold (30g protein).", "Eat 1 banana.", "Stir 5g creatine into a small glass of water.", "45-60 min before gym."],
    },
    {
      slot: "Dinner", id: "mon-d", name: "Paneer Tikka Bowl + Quinoa",
      macros: { p: 38, c: 34, f: 20, fiber: 5, kcal: 464 }, veg: "Bell pepper, onion",
      ingredients: ["120g Sunday paneer tikka", "1/2 cup quinoa", "Bell pepper", "Onion"],
      recipe: [
        "Reheat 120g Sunday paneer tikka in air fryer 3-4 min (brings texture back).",
        "Serve over 1/2 cup cooked quinoa.",
        "Stir-fry bell pepper + onion in 1 tsp oil 4 min, add on top.",
        "Best paneer day — it's freshest Mon/Tue from the Sunday batch.",
      ],
    },
    {
      slot: "Snack", id: "mon-s", name: "Greek Yogurt + Berries + Flax",
      macros: { p: 18, c: 16, f: 6, fiber: 4, kcal: 190 }, veg: "Berries",
      ingredients: ["3/4 cup Greek yogurt", "Mixed berries", "1 tbsp ground flax"],
      recipe: ["3/4 cup Greek yogurt, top with berries + 1 tbsp ground flax.", "Slow casein protein for overnight recovery."],
    },
  ],
  Tue: [
    {
      slot: "Breakfast", id: "tue-b", name: "Savory Besan French Toast",
      macros: { p: 24, c: 30, f: 12, fiber: 4, kcal: 324 }, veg: "—",
      ingredients: ["2 eggs", "2 tbsp milk", "Ajwain", "Chili flakes", "2 Ezekiel slices", "1 tsp butter"],
      recipe: ["Whisk 2 eggs + 2 tbsp milk + salt + ajwain + chili flakes.", "Dip 2 Ezekiel slices fully.", "Pan fry in 1 tsp butter, 2-3 min per side till golden."],
    },
    {
      slot: "Lunch", id: "tue-l", name: "Chole Tikki Chaat Plate",
      macros: { p: 30, c: 50, f: 12, fiber: 11, kcal: 428 }, veg: "Onion, tomato",
      ingredients: ["2-3 Sunday tikki patties", "Tamarind chutney", "Mint chutney", "Greek yogurt", "Onion", "Tomato", "Chaat masala"],
      recipe: [
        "Air fry 2-3 raw tikki patties at 390F for 12 min, flip at 6.",
        "Plate them, break slightly with a fork.",
        "Drizzle tamarind chutney + mint chutney + 2 tbsp Greek yogurt (the dahi).",
        "Top with chopped onion, tomato, chaat masala.",
        "Street-chaat flavor. Packs well — keep chutneys separate, assemble at your desk.",
      ],
    },
    {
      slot: "Pre-gym", id: "tue-p", name: "Orgain Shake + Banana + Creatine",
      macros: { p: 32, c: 40, f: 5, fiber: 3, kcal: 333 }, veg: "Banana",
      ingredients: ["1.5 scoops Orgain", "350ml water/milk", "1 banana", "5g creatine"],
      recipe: ["1.5 scoops Orgain in 350ml water or milk.", "1 banana.", "5g creatine in small water."],
    },
    {
      slot: "Dinner", id: "tue-d", name: "Masoor Dal + Brown Rice",
      macros: { p: 24, c: 55, f: 8, fiber: 16, kcal: 388 }, veg: "Onion, tomato",
      ingredients: ["3/4 cup masoor dal (dry)", "Onion", "Tomato", "Jeera", "Turmeric", "Ginger-garlic", "1 cup brown rice", "Lemon"],
      recipe: [
        "Rinse 3/4 cup masoor dal. Pot with 2.5 cups water + turmeric + salt. Boil then simmer 15-18 min (no soaking).",
        "Tadka: 1 tsp oil/ghee, jeera, chopped onion 3 min, ginger-garlic, tomato 2 min.",
        "Stir tadka into the dal, simmer 2 min.",
        "Serve over 1 cup brown rice. Squeeze lemon — iron absorption.",
        "Highest fiber + iron dinner. The only new thing you cook — 20 min total.",
      ],
    },
    {
      slot: "Snack", id: "tue-s", name: "Greek Yogurt + Walnuts",
      macros: { p: 18, c: 8, f: 14, fiber: 2, kcal: 226 }, veg: "—",
      ingredients: ["3/4 cup Greek yogurt", "7-8 walnut halves"],
      recipe: ["3/4 cup Greek yogurt + 7-8 walnut halves.", "Best plant omega-3 source."],
    },
  ],
  Wed: [
    {
      slot: "Breakfast", id: "wed-b", name: "3-Egg Veggie Omelette + Ezekiel Toast",
      macros: { p: 32, c: 24, f: 16, fiber: 5, kcal: 364 }, veg: "Mushroom, spinach",
      ingredients: ["2 whole eggs", "1 egg white", "Mushrooms", "Spinach", "1 Ezekiel slice"],
      recipe: ["2 whole eggs + 1 white. Add mushrooms, spinach, salt, pepper.", "Cook 3 min, fold.", "1 Ezekiel toast in press. Leg day needs fuel — lemon on spinach."],
    },
    {
      slot: "Lunch", id: "wed-l", name: "Schezwan Paneer Parantha Roll",
      macros: { p: 32, c: 40, f: 20, fiber: 5, kcal: 452 }, veg: "Bell pepper, onion",
      ingredients: ["1 frozen parantha", "100g Sunday paneer tikka", "Schezwan sauce", "Bell pepper", "Onion"],
      recipe: [
        "Heat 1 frozen parantha on tava/pan, ~2 min per side till cooked and slightly crisp.",
        "Pan-toss 100g Sunday paneer chunks + bell pepper strips + onion 3-4 min with 1 tbsp schezwan sauce.",
        "Lay filling along the parantha, roll tight, wrap in foil.",
        "Indo-Chinese flavor — different from the rest of the week. Parantha day 1 of 2.",
      ],
    },
    {
      slot: "Pre-gym", id: "wed-p", name: "Fairlife + Banana + Creatine",
      macros: { p: 33, c: 42, f: 5, fiber: 3, kcal: 345 }, veg: "Banana",
      ingredients: ["1 Fairlife bottle", "1 banana", "5g creatine"],
      recipe: ["1 Fairlife + 1 banana + 5g creatine.", "Leg day = highest carb need. Don't skip the banana."],
    },
    {
      slot: "Dinner", id: "wed-d", name: "Chole Masala + Quinoa + Tamarind",
      macros: { p: 30, c: 58, f: 12, fiber: 14, kcal: 460 }, veg: "Onion",
      ingredients: ["1.5 cups Sunday chole", "1/2 cup quinoa", "Onion", "Tamarind chutney", "Lemon"],
      recipe: [
        "Reheat 1.5 cups Sunday chole (5 min — easiest dinner of the week).",
        "Cook or reheat 1/2 cup quinoa.",
        "Quinoa base, chole on top, raw onion, drizzle tamarind chutney, squeeze lemon.",
        "Quinoa + chole = complete protein. Lunch was schezwan paneer so chole here isn't repetitive.",
      ],
    },
    {
      slot: "Snack", id: "wed-s", name: "Greek Yogurt + Berries + Flax",
      macros: { p: 18, c: 16, f: 7, fiber: 5, kcal: 200 }, veg: "Berries",
      ingredients: ["3/4 cup Greek yogurt", "Berries", "1 tbsp flax"],
      recipe: ["3/4 cup yogurt + berries + 1 tbsp flax. Recovery night."],
    },
  ],
  Thu: [
    {
      slot: "Breakfast", id: "thu-b", name: "Boiled Eggs + Orgain + Creatine",
      macros: { p: 36, c: 18, f: 14, fiber: 1, kcal: 338 }, veg: "—",
      ingredients: ["3 boiled eggs", "1 scoop Orgain", "5g creatine"],
      recipe: ["3 boiled eggs from Sunday batch — just peel.", "1 scoop Orgain + 5g creatine in water.", "Zero cooking. Laziest morning."],
    },
    {
      slot: "Lunch", id: "thu-l", name: "Paneer Tikka Kathi Roll (parantha)",
      macros: { p: 32, c: 38, f: 18, fiber: 5, kcal: 442 }, veg: "Cucumber, bell pepper",
      ingredients: ["1 frozen parantha", "100g Sunday paneer tikka", "Mint chutney", "Cucumber", "Bell pepper", "Coriander", "Onion"],
      recipe: [
        "Heat 1 frozen parantha on tava/pan ~2 min per side.",
        "Lay 100g cold Sunday paneer tikka + mint chutney + cucumber + bell pepper strips + onion + coriander.",
        "Roll tight, wrap in foil. Classic Indian kathi-roll flavor.",
        "Parantha day 2 of 2 — different flavor from Wed's schezwan, different format from Mon's sandwich.",
      ],
    },
    {
      slot: "Pre-gym", id: "thu-p", name: "Orgain Shake + Banana + Creatine",
      macros: { p: 32, c: 40, f: 5, fiber: 3, kcal: 333 }, veg: "Banana",
      ingredients: ["1.5 scoops Orgain", "1 banana", "5g creatine"],
      recipe: ["1.5 scoops Orgain + 1 banana + 5g creatine."],
    },
    {
      slot: "Dinner", id: "thu-d", name: "Paneer Makhani (no cream) + Ezekiel",
      macros: { p: 36, c: 32, f: 24, fiber: 6, kcal: 484 }, veg: "Onion, tomato",
      ingredients: ["120g fresh paneer", "Onion", "Ginger-garlic", "1/2 can crushed tomato", "Kashmiri chili", "Cardamom", "2 tbsp Greek yogurt", "1 Ezekiel slice"],
      recipe: [
        "1 tsp oil, onion + ginger-garlic 3 min.",
        "Add 1/2 can crushed tomato + kashmiri chili + cardamom + salt, simmer 5 min.",
        "Add 120g paneer + 2 tbsp Greek yogurt (cream substitute). Cook 5 min.",
        "Serve with 1 Ezekiel toast for dipping. Rich reward for Push B. No eggs.",
      ],
    },
    {
      slot: "Snack", id: "thu-s", name: "Greek Yogurt + Berries",
      macros: { p: 18, c: 14, f: 5, fiber: 3, kcal: 173 }, veg: "Berries",
      ingredients: ["3/4 cup Greek yogurt", "Berries"],
      recipe: ["3/4 cup Greek yogurt + berries."],
    },
  ],
  Fri: [
    {
      slot: "Breakfast", id: "fri-b", name: "Savory French Toast + Orange",
      macros: { p: 24, c: 35, f: 12, fiber: 5, kcal: 344 }, veg: "Orange",
      ingredients: ["2 Ezekiel slices", "2 eggs", "Milk", "1 small orange"],
      recipe: ["Same as Tuesday's savory French toast.", "Side: 1 small orange.", "Rest day, slightly lighter."],
    },
    {
      slot: "Lunch", id: "fri-l", name: "Chole Tikki Wrap (Ezekiel press)",
      macros: { p: 28, c: 46, f: 11, fiber: 11, kcal: 392 }, veg: "Cucumber",
      ingredients: ["2 Sunday tikki patties", "2 Ezekiel slices", "Sriracha", "Mint chutney", "Cucumber"],
      recipe: [
        "Air fry last 2 tikki patties 12 min.",
        "On Ezekiel: tikki + sriracha + mint chutney + cucumber.",
        "Close, press in sandwich maker 3 min.",
        "Back to Ezekiel (used 2 paranthas already). Uses up the tikki batch before the weekend.",
      ],
    },
    {
      slot: "Pre-gym", id: "fri-p", name: "Apple + 10 Almonds (rest day)",
      macros: { p: 5, c: 22, f: 8, fiber: 4, kcal: 177 }, veg: "Apple",
      ingredients: ["1 apple", "10 almonds"],
      recipe: ["No gym today. Light snack only.", "No protein shake — rest day calories stay lower."],
    },
    {
      slot: "Dinner", id: "fri-d", name: "Chili Paneer Bowl + Quinoa",
      macros: { p: 36, c: 38, f: 22, fiber: 5, kcal: 498 }, veg: "Bell pepper, onion, spring onion",
      ingredients: ["120g fresh paneer", "Bell pepper", "Onion", "Schezwan sauce", "Soy sauce", "Sriracha", "1/2 cup quinoa", "Spring onion"],
      recipe: [
        "Pan-toss 120g fresh paneer cubes till edges golden, 4 min.",
        "Add bell pepper + onion, toss 3 min.",
        "Add 1 tbsp schezwan + 1 tsp soy + splash sriracha, toss to coat 2 min.",
        "Serve over 1/2 cup quinoa, top with spring onion.",
        "Friday treat — Indo-Chinese, tastes indulgent, totally on plan. 10 min cook.",
      ],
    },
    {
      slot: "Snack", id: "fri-s", name: "Greek Yogurt + Walnuts",
      macros: { p: 18, c: 8, f: 14, fiber: 2, kcal: 226 }, veg: "—",
      ingredients: ["3/4 cup Greek yogurt", "Walnuts"],
      recipe: ["3/4 cup yogurt + walnuts."],
    },
  ],
  Sat: [
    {
      slot: "Breakfast", id: "sat-b", name: "Big Weekend Omelette + Ezekiel + Fruit",
      macros: { p: 34, c: 38, f: 20, fiber: 7, kcal: 468 }, veg: "Mixed veg + fruit",
      ingredients: ["3 eggs", "Mushroom", "Bell pepper", "Spinach", "Onion", "Cheese", "1 Ezekiel slice", "Mixed fruit"],
      recipe: ["3 eggs (2 whole + 1 white). Loaded: mushroom, bell pepper, spinach, onion, sprinkle cheese.", "1 Ezekiel toast.", "Side: mixed fresh fruit bowl. Earn the bigger breakfast."],
    },
    {
      slot: "Lunch", id: "sat-l", name: "Chole Chaat Plate (upgraded, no cook)",
      macros: { p: 26, c: 48, f: 9, fiber: 12, kcal: 366 }, veg: "Onion, tomato, cucumber",
      ingredients: ["Cold Sunday chole", "Tamarind chutney", "Mint chutney", "Onion", "Tomato", "Cucumber", "Chaat masala", "Lemon", "Sev (optional)"],
      recipe: [
        "Cold Sunday chole in a bowl (no heating).",
        "Top with onion + tomato + cucumber.",
        "Drizzle tamarind + mint chutney generously, chaat masala, big squeeze lemon.",
        "Optional crunch: sprinkle sev. The upgraded version of the boring one — now tastes like street chaat. 2 min.",
      ],
    },
    {
      slot: "Pre-gym", id: "sat-p", name: "Fairlife + Banana + Creatine",
      macros: { p: 33, c: 42, f: 5, fiber: 3, kcal: 345 }, veg: "Banana",
      ingredients: ["1 Fairlife bottle", "1 banana", "5g creatine"],
      recipe: ["Standard pre-gym. Gym closes 7PM on weekends — go by 5PM."],
    },
    {
      slot: "Dinner", id: "sat-d", name: "Cheat Meal — Eat Out", isCheat: true,
      macros: { p: 25, c: 60, f: 30, fiber: 5, kcal: 600 }, veg: "Whatever you want",
      ingredients: [],
      recipe: ["Saturday dinner out. Guilt-free.", "Good Indian, burger, pasta, whatever you want.", "Refeeds glycogen + leptin, keeps the diet sustainable.", "Log it if you want (name + calories), or don't. One meal doesn't undo 6 days."],
    },
    {
      slot: "Snack", id: "sat-s", name: "Greek Yogurt (small)",
      macros: { p: 12, c: 6, f: 3, fiber: 0, kcal: 99 }, veg: "—",
      ingredients: ["1/2 cup Greek yogurt"],
      recipe: ["Small 1/2 cup Greek yogurt if you're hungry. Brings protein back up post-cheat."],
    },
  ],
  Sun: [
    {
      slot: "Breakfast", id: "sun-b", name: "Sweet French Toast + Banana",
      macros: { p: 26, c: 40, f: 14, fiber: 5, kcal: 386 }, veg: "Banana",
      ingredients: ["2 Ezekiel slices", "2 eggs", "Milk", "Cinnamon", "Vanilla", "1 banana"],
      recipe: ["2 Ezekiel slices + batter (2 eggs + milk + cinnamon + vanilla).", "Pan fry golden.", "Side: sliced banana. Cinnamon improves insulin sensitivity."],
    },
    {
      slot: "Lunch", id: "sun-l", name: "Greek Yogurt Bowl + Fruit + Orgain",
      macros: { p: 30, c: 50, f: 18, fiber: 8, kcal: 474 }, veg: "Banana, berries",
      ingredients: ["1 cup Greek yogurt", "Banana", "Berries", "10 almonds", "1 tbsp flax", "1/2 scoop Orgain"],
      recipe: ["1 cup Greek yogurt + banana + berries + 10 almonds + 1 tbsp flax + 1/2 scoop Orgain.", "No cooking — recovery day."],
    },
    {
      slot: "Pre-gym", id: "sun-p", name: "Rest Day — No Pre-gym", isRest: true,
      macros: { p: 0, c: 0, f: 0, fiber: 0, kcal: 0 }, veg: "—",
      ingredients: [],
      recipe: ["Rest day. No pre-gym meal needed."],
    },
    {
      slot: "Dinner", id: "sun-d", name: "Paneer Tikka + Quinoa + Stir-fry Veg",
      macros: { p: 38, c: 42, f: 22, fiber: 9, kcal: 514 }, veg: "Broccoli, bell pepper",
      ingredients: ["Fresh Sunday paneer tikka", "1/2 cup quinoa", "Broccoli", "Bell pepper", "Garlic"],
      recipe: ["Air fry fresh paneer tikka from today's batch.", "1/2 cup quinoa.", "Stir-fry broccoli + bell pepper + garlic 5 min.", "First meal from the fresh Sunday batch — freshest paneer of the week."],
    },
    {
      slot: "Snack", id: "sun-s", name: "Greek Yogurt + Berries + Flax",
      macros: { p: 18, c: 16, f: 7, fiber: 5, kcal: 196 }, veg: "Berries",
      ingredients: ["3/4 cup Greek yogurt", "Berries", "Flax"],
      recipe: ["3/4 cup yogurt + berries + flax."],
    },
  ],
};

// Expanded Indian staples database for custom logging (per typical portion).
export const STAPLES = [
  { name: "Paneer (100g)", p: 18, c: 4, f: 20, fiber: 0, kcal: 265 },
  { name: "Chole cooked (1 cup)", p: 15, c: 45, f: 4, fiber: 12, kcal: 269 },
  { name: "Rajma cooked (1 cup)", p: 15, c: 40, f: 1, fiber: 13, kcal: 225 },
  { name: "Masoor dal (1 cup)", p: 18, c: 40, f: 1, fiber: 16, kcal: 230 },
  { name: "Moong dal (1 cup)", p: 14, c: 39, f: 1, fiber: 15, kcal: 212 },
  { name: "Toor/Arhar dal (1 cup)", p: 15, c: 41, f: 1, fiber: 15, kcal: 230 },
  { name: "Palak paneer (1 cup)", p: 14, c: 12, f: 18, fiber: 4, kcal: 270 },
  { name: "Paneer bhurji (1 cup)", p: 20, c: 8, f: 22, fiber: 2, kcal: 300 },
  { name: "Aloo sabzi (1 cup)", p: 4, c: 35, f: 8, fiber: 5, kcal: 230 },
  { name: "Mixed veg sabzi (1 cup)", p: 5, c: 20, f: 8, fiber: 6, kcal: 170 },
  { name: "Bhindi sabzi (1 cup)", p: 4, c: 15, f: 9, fiber: 6, kcal: 160 },
  { name: "Greek yogurt (1 cup)", p: 23, c: 9, f: 5, fiber: 0, kcal: 170 },
  { name: "Regular dahi (1 cup)", p: 9, c: 11, f: 8, fiber: 0, kcal: 150 },
  { name: "Orgain shake (1 scoop)", p: 21, c: 15, f: 4, fiber: 5, kcal: 150 },
  { name: "Fairlife Chocolate (1 bottle)", p: 30, c: 4, f: 4.5, fiber: 1, kcal: 150 },
  { name: "Ezekiel bread (1 slice)", p: 5, c: 15, f: 0.5, fiber: 3, kcal: 80 },
  { name: "Frozen parantha (1)", p: 4, c: 24, f: 7, fiber: 2, kcal: 170 },
  { name: "Roti/Chapati (1)", p: 3, c: 18, f: 3, fiber: 3, kcal: 110 },
  { name: "Quinoa cooked (1 cup)", p: 8, c: 39, f: 4, fiber: 5, kcal: 222 },
  { name: "Brown rice (1 cup)", p: 5, c: 45, f: 2, fiber: 4, kcal: 216 },
  { name: "White rice (1 cup)", p: 4, c: 45, f: 0.4, fiber: 1, kcal: 205 },
  { name: "Poha (1 cup)", p: 4, c: 38, f: 8, fiber: 3, kcal: 250 },
  { name: "Upma (1 cup)", p: 6, c: 40, f: 10, fiber: 4, kcal: 270 },
  { name: "Idli (2)", p: 4, c: 26, f: 1, fiber: 2, kcal: 130 },
  { name: "Dosa plain (1)", p: 4, c: 30, f: 5, fiber: 2, kcal: 170 },
  { name: "Masala dosa (1)", p: 6, c: 45, f: 12, fiber: 4, kcal: 310 },
  { name: "Uttapam (1)", p: 5, c: 35, f: 6, fiber: 3, kcal: 210 },
  { name: "Khichdi (1 cup)", p: 9, c: 38, f: 6, fiber: 6, kcal: 240 },
  { name: "Thepla (1)", p: 3, c: 18, f: 5, fiber: 2, kcal: 130 },
  { name: "Samosa (1)", p: 4, c: 24, f: 12, fiber: 2, kcal: 220 },
  { name: "Dhokla (3 pcs)", p: 6, c: 22, f: 4, fiber: 2, kcal: 150 },
  { name: "Egg (1 large)", p: 6, c: 0.5, f: 5, fiber: 0, kcal: 72 },
  { name: "Tofu firm (100g)", p: 17, c: 3, f: 9, fiber: 2, kcal: 144 },
  { name: "Banana (1 medium)", p: 1, c: 27, f: 0.3, fiber: 3, kcal: 105 },
  { name: "Apple (1 medium)", p: 0.5, c: 25, f: 0.3, fiber: 4, kcal: 95 },
  { name: "Orange (1 medium)", p: 1, c: 15, f: 0.2, fiber: 3, kcal: 62 },
  { name: "Mixed berries (1 cup)", p: 1, c: 17, f: 0.5, fiber: 4, kcal: 70 },
  { name: "Walnuts (7 halves)", p: 3, c: 2, f: 13, fiber: 1, kcal: 131 },
  { name: "Almonds (10)", p: 3, c: 2, f: 6, fiber: 1.5, kcal: 70 },
  { name: "Peanuts (1 oz)", p: 7, c: 5, f: 14, fiber: 2, kcal: 161 },
  { name: "Cashews (1 oz)", p: 5, c: 9, f: 12, fiber: 1, kcal: 157 },
  { name: "Mango (1 cup)", p: 1, c: 25, f: 0.6, fiber: 3, kcal: 99 },
  { name: "Grapes (1 cup)", p: 1, c: 27, f: 0.3, fiber: 1, kcal: 104 },
];

// Quick drinks — loggable in one tap.
export const DRINKS = [
  { name: "Black coffee", p: 0, c: 0, f: 0, fiber: 0, kcal: 5 },
  { name: "Chai with milk + sugar", p: 3, c: 14, f: 3, fiber: 0, kcal: 90 },
  { name: "Chai with milk, no sugar", p: 3, c: 6, f: 3, fiber: 0, kcal: 60 },
  { name: "Protein water (1 scoop)", p: 21, c: 2, f: 1, fiber: 0, kcal: 100 },
  { name: "Fairlife Chocolate", p: 30, c: 4, f: 4.5, fiber: 1, kcal: 150 },
  { name: "Orange juice (1 cup)", p: 2, c: 26, f: 0.5, fiber: 0.5, kcal: 110 },
  { name: "Coke (can)", p: 0, c: 39, f: 0, fiber: 0, kcal: 140 },
  { name: "Diet Coke (can)", p: 0, c: 0, f: 0, fiber: 0, kcal: 0 },
  { name: "Lassi sweet (1 cup)", p: 8, c: 30, f: 5, fiber: 0, kcal: 200 },
];

// Ingredient substitution suggestions (when out of something).
export const SUBSTITUTIONS = {
  Paneer: ["Tofu (firm, same weight)", "Extra Greek yogurt + chickpeas", "Halloumi if available"],
  Chole: ["Rajma (canned)", "Black chana", "Mixed beans"],
  Quinoa: ["Brown rice", "Couscous", "Millet"],
  "Ezekiel bread": ["Frozen parantha", "Whole wheat roti", "Whole grain wrap"],
  "Greek yogurt": ["Skyr", "Hung regular dahi", "Cottage cheese"],
  Orgain: ["Any plant protein", "Fairlife as protein source", "Greek yogurt + milk"],
};

// Macro targets — base, plus carb cycling for gym vs rest days.
export const DAILY_TARGETS = { p: 145, c: 175, f: 58, fiber: 32, kcal: 1850 };
export const GYM_DAY_TARGETS = { p: 145, c: 200, f: 55, fiber: 32, kcal: 1950 };
export const REST_DAY_TARGETS = { p: 145, c: 140, f: 60, fiber: 32, kcal: 1700 };

export const DAY_KEYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Resolve the plan for a day, applying permanent meal overrides.
// overrides keyed as `${dayKey}-${slot}`, value is a full meal object.
export function resolveDayPlan(dayKey, mealOverrides = {}) {
  const base = MEAL_PLAN[dayKey] || [];
  return base.map((m) => {
    const key = `${dayKey}-${m.slot}`;
    return mealOverrides[key] ? { ...mealOverrides[key], slot: m.slot } : m;
  });
}

// Targets for a given day with carb cycling (gym vs rest).
export function targetsForDay(dayKey, custom) {
  if (custom) return custom;
  const rest = dayKey === "Fri" || dayKey === "Sun";
  return rest ? REST_DAY_TARGETS : GYM_DAY_TARGETS;
}

// All meals across the week in a given slot (for swap suggestions), minus banned.
export function mealsForSlot(slot, bannedIds = []) {
  const out = [];
  Object.values(MEAL_PLAN).forEach((day) =>
    day.forEach((m) => {
      if (m.slot === slot && !m.isCheat && !m.isRest && !bannedIds.includes(m.id) && !out.find((x) => x.name === m.name)) {
        out.push(m);
      }
    })
  );
  return out;
}
