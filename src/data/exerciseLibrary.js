// Full exercise library. EVERY entry is fully prepped so a swapped-in exercise
// gets the same UI as a default program exercise: how-to steps, mistakes,
// breathing, movement pattern, kind (drives weight increment), default start
// weight (lbs), default rest, target reps, and muscle group.
//
// kind: "compound" (+5 lb steps), "isolation" (+2.5), "bodyweight", "cardio".
// pattern maps to MovementArt SVG. muscleGroup is the high-level bucket used by
// the swap "same muscle" filter and the weekly volume chart.

function ex(o) {
  return {
    reps: 10, rest: 75, start: 30, kind: "isolation", pattern: "press",
    steps: [], mistakes: [], breathing: "Exhale on effort, inhale on the way back.",
    ...o,
  };
}

export const LIBRARY = {
  // ════════════════════════ CHEST ════════════════════════
  Chest: [
    ex({ name: "Flat Barbell Bench Press", machine: "Barbell + flat bench", kind: "compound", reps: 8, rest: 90, start: 95, pattern: "press",
      steps: ["Lie flat, eyes under the bar, feet planted.", "Grip slightly wider than shoulders, wrists stacked over elbows.", "Pull shoulder blades down and together, small arch.", "Unrack, bar over chest, arms straight.", "Lower slowly to mid-chest, elbows ~45 degrees.", "Press up explosively to straight arms."],
      mistakes: ["Bouncing off the chest", "Flaring elbows to 90 degrees", "Lifting hips off bench", "Lowering to the neck"],
      breathing: "In as you lower, out as you press." }),
    ex({ name: "Flat Dumbbell Press", machine: "Flat bench + dumbbells", kind: "compound", reps: 10, rest: 90, start: 45, pattern: "press",
      steps: ["Sit with dumbbells on thighs, kick back one at a time.", "Start at chest level, elbows below shoulders.", "Press up and slightly together to straight arms.", "Lower under control until you feel a stretch."],
      mistakes: ["Clanking the bells at the top", "Dropping elbows too low", "Pressing too far forward"] }),
    ex({ name: "Incline Dumbbell Press", machine: "Incline bench + dumbbells", kind: "compound", reps: 10, rest: 90, start: 40, pattern: "press",
      steps: ["Set bench to 30-45 degrees.", "Kick weights up, start at upper-chest level.", "Press up and slightly inward to nearly straight.", "Lower slowly for an upper-chest stretch."],
      mistakes: ["Bench too steep (becomes shoulders)", "Pressing forward instead of up", "No control on the lower"] }),
    ex({ name: "Incline Barbell Press", machine: "Incline bench + barbell", kind: "compound", reps: 8, rest: 90, start: 75, pattern: "press",
      steps: ["Set bench 30 degrees, grip just wider than shoulders.", "Unrack over upper chest.", "Lower to just below collarbone.", "Press up and slightly back over shoulders."],
      mistakes: ["Bar drifting to the belly", "Bouncing", "Elbows flaring wide"] }),
    ex({ name: "Machine Chest Press", machine: "Chest press machine", kind: "compound", reps: 10, rest: 75, start: 70, pattern: "press",
      steps: ["Set seat so handles are at mid-chest.", "Back flat on the pad, feet planted.", "Press out to nearly straight, squeeze chest.", "Return under control without clanking the stack."],
      mistakes: ["Seat too high or low", "Half reps", "Letting the weight slam"] }),
    ex({ name: "Cable Chest Fly (low to high)", machine: "Cable station, low pulleys", kind: "isolation", reps: 12, rest: 60, start: 25, pattern: "fly",
      steps: ["Set pulleys low, one handle each hand.", "Slight split stance, lean forward a touch.", "Arms down and slightly bent.", "Sweep up and together in an arc to face height.", "Squeeze 1 second, lower along the same arc."],
      mistakes: ["Bending elbows more mid-rep", "Too heavy, losing the arc", "Rushing the squeeze"] }),
    ex({ name: "Pec Deck Fly", machine: "Pec deck machine", kind: "isolation", reps: 12, rest: 60, start: 70, pattern: "fly",
      steps: ["Set seat so handles are at chest height.", "Forearms on the pads or grip handles.", "Bring arms together in front, squeeze.", "Open slowly until you feel a chest stretch."],
      mistakes: ["Using shoulders to push", "Slamming the pads together", "Going too deep and straining the shoulder"] }),
    ex({ name: "Dumbbell Fly", machine: "Flat bench + dumbbells", kind: "isolation", reps: 12, rest: 60, start: 20, pattern: "fly",
      steps: ["Lie flat, dumbbells over chest, palms facing.", "Slight bend in the elbows, keep it fixed.", "Open arms wide in an arc until chest stretches.", "Bring back together over the chest, squeeze."],
      mistakes: ["Straightening then bending elbows (pressing)", "Going too heavy", "Dropping too low and stressing the shoulder"] }),
    ex({ name: "Push-ups", machine: "Bodyweight", kind: "bodyweight", reps: 15, rest: 60, start: 0, pattern: "press",
      steps: ["Hands just wider than shoulders, body in a straight line.", "Brace your core and glutes.", "Lower until chest is an inch off the floor.", "Press back up to straight arms."],
      mistakes: ["Sagging hips", "Flaring elbows out", "Half reps"] }),
    ex({ name: "Dips (chest)", machine: "Dip bars", kind: "bodyweight", reps: 10, rest: 75, start: 0, pattern: "press",
      steps: ["Grip bars, lean torso slightly forward.", "Lower until shoulders are just below elbows.", "Press back up, staying leaned forward for chest."],
      mistakes: ["Going too deep and straining shoulders", "Staying too upright (hits triceps more)", "Swinging"] }),
  ],

  // ════════════════════════ SHOULDERS ════════════════════════
  Shoulders: [
    ex({ name: "Shoulder Press Machine", machine: "Seated shoulder press machine", kind: "compound", reps: 10, rest: 90, start: 70, pattern: "press",
      steps: ["Seat so handles start at ear level.", "Sit tall, back on the pad, feet planted.", "Press straight up to nearly straight.", "Lower under control to ear level."],
      mistakes: ["Shrugging toward ears", "Arching the lower back", "Half reps at the bottom"] }),
    ex({ name: "Dumbbell Shoulder Press", machine: "Dumbbells + bench", kind: "compound", reps: 10, rest: 90, start: 40, pattern: "press",
      steps: ["Sit upright, dumbbells at ear level, palms forward.", "Brace core, press up and slightly together.", "Stop just short of locking out.", "Lower under control to ears."],
      mistakes: ["Bouncing out of the bottom", "Leaning back into a press", "Flaring too wide"] }),
    ex({ name: "Arnold Press", machine: "Dumbbells + bench", kind: "compound", reps: 10, rest: 90, start: 30, pattern: "press",
      steps: ["Start with dumbbells in front, palms facing you.", "Press up while rotating palms to face forward.", "Finish overhead, arms nearly straight.", "Reverse the rotation on the way down."],
      mistakes: ["Rushing the rotation", "Using momentum", "Too heavy to control the twist"] }),
    ex({ name: "Barbell Overhead Press", machine: "Barbell", kind: "compound", reps: 8, rest: 90, start: 65, pattern: "press",
      steps: ["Bar on front delts, grip just outside shoulders.", "Brace core and glutes hard.", "Press straight up, move head back slightly.", "Lock out overhead, bar over mid-foot."],
      mistakes: ["Pressing around the face slowly", "Leaning back excessively", "Soft core letting hips push"] }),
    ex({ name: "Lateral Raises", machine: "Dumbbells", kind: "isolation", reps: 15, rest: 60, start: 22, pattern: "raise",
      steps: ["Dumbbell each hand, slight elbow bend.", "Lead with elbows, raise to shoulder height (T).", "Tilt thumbs slightly down at the top.", "Lower slowly over 2-3 seconds."],
      mistakes: ["Swinging / momentum", "Raising above shoulders", "Shrugging with traps"] }),
    ex({ name: "Cable Lateral Raise", machine: "Cable, low pulley", kind: "isolation", reps: 15, rest: 60, start: 15, pattern: "raise",
      steps: ["Stand side-on to a low pulley, handle in the far hand.", "Slight elbow bend, raise out to shoulder height.", "Pause at the top.", "Lower slowly against the cable tension."],
      mistakes: ["Leaning away to cheat", "Going too heavy", "Letting the stack drop fast"] }),
    ex({ name: "Machine Lateral Raise", machine: "Lateral raise machine", kind: "isolation", reps: 15, rest: 60, start: 50, pattern: "raise",
      steps: ["Adjust seat so pads sit on the outer arms.", "Push out and up to shoulder height with the elbows.", "Squeeze the side delts at the top.", "Lower slowly."],
      mistakes: ["Using bodyweight to bounce", "Half range", "Shrugging"] }),
    ex({ name: "Face Pulls", machine: "Cable + rope, high pulley", kind: "isolation", reps: 15, rest: 60, start: 40, pattern: "facepull",
      steps: ["Rope at upper-chest/face height, grip ends thumbs back.", "Pull toward your forehead, splitting the rope.", "Elbows high and wide, squeeze rear delts.", "Return slowly under control."],
      mistakes: ["Elbows dropping low (becomes a row)", "Too heavy, using the back", "No squeeze at the end"] }),
    ex({ name: "Reverse Pec Deck", machine: "Pec deck (reverse)", kind: "isolation", reps: 15, rest: 60, start: 50, pattern: "facepull",
      steps: ["Face the pad, grip handles with arms forward.", "Open arms back in a wide arc.", "Squeeze the rear delts and upper back.", "Return slowly to the front."],
      mistakes: ["Bending elbows mid-rep", "Using momentum", "Shrugging the traps"] }),
    ex({ name: "Front Raise", machine: "Dumbbells or plate", kind: "isolation", reps: 12, rest: 60, start: 20, pattern: "raise",
      steps: ["Hold weight in front of thighs.", "Raise straight in front to shoulder height.", "Pause briefly.", "Lower under control."],
      mistakes: ["Swinging the torso", "Going above shoulder height", "Too heavy"] }),
  ],

  // ════════════════════════ TRICEPS ════════════════════════
  Triceps: [
    ex({ name: "Tricep Pushdown", machine: "Cable + rope", kind: "isolation", reps: 12, rest: 60, start: 60, pattern: "pushdown",
      steps: ["Rope on the high pulley, grip both ends.", "Pin elbows to your sides.", "Push down and out, spread the ends at the bottom.", "Fully straighten, squeeze 1 second.", "Return under control to chest height."],
      mistakes: ["Elbows drifting forward", "Leaning over the weight", "Using shoulders"] }),
    ex({ name: "Overhead Tricep Extension", machine: "Cable or single dumbbell", kind: "isolation", reps: 12, rest: 60, start: 35, pattern: "extension",
      steps: ["Press a rope or dumbbell overhead.", "Hands behind head, elbows forward and up.", "Keep elbows still and close.", "Extend fully overhead, squeeze.", "Lower behind the head for a stretch."],
      mistakes: ["Flaring elbows wide", "Moving the upper arms", "Arching the back"] }),
    ex({ name: "Skull Crushers", machine: "EZ bar + bench", kind: "isolation", reps: 10, rest: 60, start: 40, pattern: "extension",
      steps: ["Lie flat, press the bar over your chest.", "Keep upper arms vertical and still.", "Lower the bar to your forehead/just behind.", "Extend back up by straightening the elbows."],
      mistakes: ["Moving the shoulders", "Flaring elbows", "Going too heavy and hitting your head"] }),
    ex({ name: "Close-grip Press", machine: "Barbell + flat bench", kind: "compound", reps: 8, rest: 90, start: 75, pattern: "press",
      steps: ["Grip the bar shoulder-width.", "Lower to the lower chest, elbows tucked.", "Press up keeping elbows close to the body.", "Lock out and squeeze the triceps."],
      mistakes: ["Grip too narrow (wrist strain)", "Flaring elbows", "Bouncing"] }),
    ex({ name: "Dips (triceps)", machine: "Dip bars", kind: "bodyweight", reps: 10, rest: 75, start: 0, pattern: "press",
      steps: ["Grip bars, torso upright.", "Lower until elbows hit 90 degrees.", "Press back up, keeping elbows tight.", "Lock out at the top."],
      mistakes: ["Leaning too far forward (chest takes over)", "Going too deep", "Swinging"] }),
    ex({ name: "Tricep Kickback", machine: "Dumbbells", kind: "isolation", reps: 12, rest: 60, start: 15, pattern: "extension",
      steps: ["Hinge forward, upper arm parallel to the floor.", "Keep the elbow pinned high.", "Extend the forearm back to straight.", "Squeeze, then return slowly."],
      mistakes: ["Dropping the elbow", "Swinging the weight", "Too heavy to keep form"] }),
    ex({ name: "Rope Overhead Extension", machine: "Cable + rope, low pulley", kind: "isolation", reps: 12, rest: 60, start: 40, pattern: "extension",
      steps: ["Face away from a low pulley, rope overhead.", "Elbows forward and close to the head.", "Extend the rope up and apart.", "Lower behind the head for a stretch."],
      mistakes: ["Elbows flaring", "Leaning too far", "Short range"] }),
  ],

  // ════════════════════════ BACK ════════════════════════
  Back: [
    ex({ name: "Lat Pulldown (wide grip)", machine: "Lat pulldown machine", kind: "compound", reps: 10, rest: 75, start: 100, pattern: "pulldown",
      steps: ["Grip the bar wider than shoulders.", "Set thighs under the pad.", "Pull the bar to your upper chest, drive elbows down.", "Squeeze the lats, return slowly to a full stretch."],
      mistakes: ["Leaning back too far", "Pulling behind the neck", "Using arms instead of lats"] }),
    ex({ name: "Lat Pulldown (close underhand)", machine: "Lat pulldown machine", kind: "compound", reps: 10, rest: 75, start: 100, pattern: "pulldown",
      steps: ["Grip shoulder-width, palms facing you.", "Pull to the chest, elbows driving down and back.", "Squeeze the lats and biceps.", "Return slowly to full stretch."],
      mistakes: ["Swinging", "Short range", "Shrugging at the top"] }),
    ex({ name: "Seated Cable Row", machine: "Seated cable row", kind: "compound", reps: 10, rest: 75, start: 110, pattern: "row",
      steps: ["Sit tall, slight knee bend, grip the handle.", "Pull to your stomach, elbows close.", "Squeeze the shoulder blades together.", "Return slowly to a full stretch, no rounding."],
      mistakes: ["Yanking with the lower back", "Rounding the spine", "Short pull"] }),
    ex({ name: "Chest-supported Row", machine: "Chest-supported row machine", kind: "compound", reps: 10, rest: 75, start: 90, pattern: "row",
      steps: ["Chest on the pad, grip the handles.", "Row by driving the elbows back.", "Squeeze the mid-back.", "Lower under control to a stretch."],
      mistakes: ["Lifting the chest off the pad", "Using momentum", "Short range"] }),
    ex({ name: "Single-arm Dumbbell Row", machine: "Dumbbell + bench", kind: "compound", reps: 10, rest: 75, start: 50, pattern: "row",
      steps: ["One knee and hand on the bench, flat back.", "Dumbbell hanging, pull to the hip.", "Drive the elbow up and back, squeeze.", "Lower to a full stretch."],
      mistakes: ["Rotating the torso to cheat", "Pulling to the chest not hip", "Rounding the back"] }),
    ex({ name: "T-bar Row", machine: "T-bar / landmine", kind: "compound", reps: 10, rest: 90, start: 70, pattern: "row",
      steps: ["Straddle the bar, hinge with a flat back.", "Grip the handles, pull to the lower chest.", "Squeeze the back at the top.", "Lower under control."],
      mistakes: ["Standing too upright", "Jerking with the legs", "Rounding the spine"] }),
    ex({ name: "Straight Arm Pulldown", machine: "Cable, high pulley + bar", kind: "isolation", reps: 12, rest: 60, start: 50, pattern: "pulldown",
      steps: ["Grip a straight bar at a high pulley, arms straight.", "Hinge slightly forward.", "Push the bar down to your thighs with straight arms.", "Feel the lats, return slowly overhead."],
      mistakes: ["Bending the elbows (becomes a pushdown)", "Using bodyweight", "Short range"] }),
    ex({ name: "Barbell Bent-over Row", machine: "Barbell", kind: "compound", reps: 8, rest: 90, start: 95, pattern: "row",
      steps: ["Hinge to about 45 degrees, flat back.", "Grip just outside the knees.", "Row the bar to the lower ribs.", "Squeeze, lower under control."],
      mistakes: ["Standing up as you pull", "Rounding the back", "Using too much momentum"] }),
    ex({ name: "Pull-ups", machine: "Pull-up bar", kind: "bodyweight", reps: 8, rest: 90, start: 0, pattern: "pulldown",
      steps: ["Grip wider than shoulders, hang fully.", "Pull until your chin clears the bar.", "Drive elbows down, squeeze the lats.", "Lower under control to a full hang."],
      mistakes: ["Kipping/swinging", "Half reps", "Not reaching full extension"] }),
  ],

  // ════════════════════════ BICEPS ════════════════════════
  Biceps: [
    ex({ name: "Dumbbell Bicep Curl", machine: "Dumbbells", kind: "isolation", reps: 12, rest: 60, start: 25, pattern: "curl",
      steps: ["Stand tall, dumbbells at your sides, palms forward.", "Curl one or both up, elbows pinned.", "Squeeze at the top.", "Lower slowly to straight arms."],
      mistakes: ["Swinging the body", "Elbows drifting forward", "Half reps"] }),
    ex({ name: "Barbell Curl", machine: "Barbell or EZ bar", kind: "isolation", reps: 10, rest: 60, start: 50, pattern: "curl",
      steps: ["Grip shoulder-width, palms up.", "Curl to the shoulders, elbows still.", "Squeeze the biceps.", "Lower slowly to straight."],
      mistakes: ["Swinging with the hips", "Elbows moving forward", "Bouncing at the bottom"] }),
    ex({ name: "Cable Curl", machine: "Cable, low pulley + bar", kind: "isolation", reps: 12, rest: 60, start: 50, pattern: "curl",
      steps: ["Grip the bar at a low pulley, palms up.", "Curl up keeping elbows pinned.", "Squeeze hard at the top.", "Lower slowly against the cable."],
      mistakes: ["Leaning back", "Elbows drifting", "Letting the stack drop"] }),
    ex({ name: "Hammer Curl", machine: "Dumbbells", kind: "isolation", reps: 12, rest: 60, start: 25, pattern: "curl",
      steps: ["Hold dumbbells with palms facing each other.", "Curl up keeping the neutral grip.", "Squeeze the forearms and biceps.", "Lower slowly."],
      mistakes: ["Swinging", "Rotating the wrist", "Elbows moving"] }),
    ex({ name: "Preacher Curl", machine: "Preacher bench + EZ bar", kind: "isolation", reps: 10, rest: 60, start: 40, pattern: "curl",
      steps: ["Arms on the pad, grip the bar palms up.", "Curl up without lifting the elbows.", "Squeeze at the top.", "Lower slowly to nearly straight (don't fully lock)."],
      mistakes: ["Bouncing at the bottom", "Coming off the pad", "Full lockout under load"] }),
    ex({ name: "Concentration Curl", machine: "Dumbbell + bench", kind: "isolation", reps: 12, rest: 60, start: 20, pattern: "curl",
      steps: ["Sit, elbow braced against the inner thigh.", "Curl the dumbbell up, squeeze.", "Lower slowly to a full stretch."],
      mistakes: ["Moving the upper arm", "Using momentum", "Short range"] }),
    ex({ name: "Incline Dumbbell Curl", machine: "Incline bench + dumbbells", kind: "isolation", reps: 12, rest: 60, start: 20, pattern: "curl",
      steps: ["Lie back on a 45-degree incline, arms hanging.", "Curl both dumbbells up, elbows back.", "Squeeze at the top.", "Lower slowly for a deep stretch."],
      mistakes: ["Swinging the elbows forward", "Cutting the stretch short", "Too heavy"] }),
  ],

  // ════════════════════════ QUADS ════════════════════════
  Quads: [
    ex({ name: "Leg Press", machine: "Leg press machine", kind: "compound", reps: 10, rest: 90, start: 180, pattern: "legpress",
      steps: ["Feet shoulder-width on the platform.", "Lower until knees reach about 90 degrees.", "Press through the heels to nearly straight.", "Don't lock the knees hard at the top."],
      mistakes: ["Knees caving in", "Half reps", "Locking out and hyperextending", "Lifting hips off the seat"] }),
    ex({ name: "Goblet Squat", machine: "Single dumbbell/kettlebell", kind: "compound", reps: 12, rest: 75, start: 45, pattern: "squat",
      steps: ["Hold a dumbbell at your chest.", "Feet shoulder-width, toes slightly out.", "Squat down between your knees, chest up.", "Drive through the heels to stand."],
      mistakes: ["Heels lifting", "Knees caving", "Rounding the back"] }),
    ex({ name: "Hack Squat", machine: "Hack squat machine", kind: "compound", reps: 10, rest: 90, start: 90, pattern: "squat",
      steps: ["Shoulders under the pads, feet mid-platform.", "Lower to about 90 degrees, controlled.", "Drive through the whole foot to stand.", "Keep your back flat against the pad."],
      mistakes: ["Knees caving", "Heels rising", "Bouncing at the bottom"] }),
    ex({ name: "Barbell Back Squat", machine: "Barbell + rack", kind: "compound", reps: 8, rest: 120, start: 95, pattern: "squat",
      steps: ["Bar on the upper back, grip firm.", "Brace, feet shoulder-width.", "Sit down and back to at least parallel.", "Drive up through mid-foot, chest tall."],
      mistakes: ["Knees caving", "Good-morning-ing (hips shoot up)", "Heels rising", "Rounding the back"] }),
    ex({ name: "Leg Extension Machine", machine: "Leg extension machine", kind: "isolation", reps: 15, rest: 60, start: 70, pattern: "legext",
      steps: ["Sit, pad on the lower shins, back on the pad.", "Extend to straight, squeeze the quads.", "Pause 1 second at the top.", "Lower slowly with control."],
      mistakes: ["Swinging the weight up", "Slamming the stack", "Partial range"] }),
    ex({ name: "Bulgarian Split Squat", machine: "Dumbbells + bench", kind: "compound", reps: 10, rest: 75, start: 25, pattern: "squat",
      steps: ["Rear foot on a bench, front foot forward.", "Lower straight down, front knee tracking over toes.", "Drive up through the front heel.", "Finish all reps, then switch legs."],
      mistakes: ["Front foot too close", "Leaning too far forward", "Pushing off the back foot"] }),
    ex({ name: "Walking Lunges", machine: "Dumbbells", kind: "compound", reps: 12, rest: 75, start: 25, pattern: "squat",
      steps: ["Dumbbells at your sides.", "Step forward, lower the back knee toward the floor.", "Drive up and step through with the other leg.", "Keep your torso upright."],
      mistakes: ["Short steps (knee over toe strain)", "Leaning forward", "Losing balance"] }),
  ],

  // ════════════════════════ HAMSTRINGS / GLUTES ════════════════════════
  Hamstrings: [
    ex({ name: "Leg Curl Machine", machine: "Lying or seated leg curl", kind: "isolation", reps: 12, rest: 60, start: 70, pattern: "legcurl",
      steps: ["Pad on the lower calves, grip the handles.", "Curl the heels toward your glutes.", "Squeeze the hamstrings at the top.", "Lower slowly under control."],
      mistakes: ["Hips lifting off the pad", "Using momentum", "Partial range"] }),
    ex({ name: "Romanian Deadlift", machine: "Barbell or dumbbells", kind: "compound", reps: 10, rest: 90, start: 95, pattern: "row",
      steps: ["Stand tall, weight in front of thighs.", "Soft knees, push hips back.", "Lower the weight along the legs to mid-shin.", "Feel the hamstring stretch, then drive hips forward."],
      mistakes: ["Rounding the back", "Bending the knees too much", "Going too low and losing flat back"] }),
    ex({ name: "Stiff-leg Deadlift", machine: "Barbell", kind: "compound", reps: 10, rest: 90, start: 85, pattern: "row",
      steps: ["Nearly straight legs, weight in front.", "Hinge at the hips, flat back.", "Lower until you feel a deep hamstring stretch.", "Drive hips forward to stand."],
      mistakes: ["Rounding the spine", "Bending the knees", "Using the lower back to lift"] }),
    ex({ name: "Glute-ham Raise", machine: "GHR bench", kind: "bodyweight", reps: 10, rest: 75, start: 0, pattern: "legcurl",
      steps: ["Anchor your feet, knees on the pad.", "Lower your torso forward under control.", "Use the hamstrings to pull yourself back up.", "Keep the body in a straight line."],
      mistakes: ["Bending at the hips", "Falling instead of lowering", "Half range"] }),
    ex({ name: "Hip Thrust", machine: "Barbell + bench", kind: "compound", reps: 10, rest: 90, start: 95, pattern: "row",
      steps: ["Upper back on a bench, bar over the hips.", "Plant feet, drive through the heels.", "Lift hips to full extension, squeeze glutes.", "Lower under control."],
      mistakes: ["Overarching the lower back", "Short range", "Pushing through the toes"] }),
  ],

  // ════════════════════════ ABS / CORE ════════════════════════
  Abs: [
    ex({ name: "Hanging Leg Raises", machine: "Pull-up bar", kind: "bodyweight", reps: 12, rest: 60, start: 0, pattern: "legraise",
      steps: ["Hang from the bar, shoulders engaged.", "Raise your legs to parallel or higher.", "Control the lower, no swinging.", "Keep the core braced throughout."],
      mistakes: ["Swinging for momentum", "Using hip flexors only", "Dropping the legs fast"] }),
    ex({ name: "Cable Crunch", machine: "Cable + rope, high pulley", kind: "isolation", reps: 15, rest: 60, start: 60, pattern: "crunch",
      steps: ["Kneel facing the stack, rope behind the head.", "Crunch down by flexing the abs, hips fixed.", "Bring elbows toward the thighs.", "Return slowly under control."],
      mistakes: ["Pulling with the arms", "Moving at the hips", "Short range"] }),
    ex({ name: "Reverse Crunches", machine: "Floor or bench", kind: "bodyweight", reps: 15, rest: 45, start: 0, pattern: "crunch",
      steps: ["Lie on your back, knees bent.", "Curl the knees toward your chest, lifting the hips.", "Pause, then lower slowly.", "Keep the lower back from arching."],
      mistakes: ["Using momentum", "Pulling with the legs", "Not lifting the hips"] }),
    ex({ name: "Bicycle Crunches", machine: "Floor", kind: "bodyweight", reps: 20, rest: 45, start: 0, pattern: "crunch",
      steps: ["Lie back, hands by the ears.", "Bring opposite elbow to opposite knee.", "Extend the other leg out.", "Alternate in a controlled pedaling motion."],
      mistakes: ["Yanking the neck", "Going too fast", "Not extending the leg"] }),
    ex({ name: "Plank", machine: "Floor", kind: "bodyweight", reps: 45, repsUnit: "sec", rest: 45, start: 0, pattern: "plank",
      steps: ["Forearms down, body in a straight line.", "Brace the abs and squeeze the glutes.", "Hold without letting the hips sag or pike.", "Breathe steadily through the hold."],
      mistakes: ["Hips sagging", "Butt too high", "Holding your breath"] }),
    ex({ name: "Ab Wheel Rollout", machine: "Ab wheel", kind: "bodyweight", reps: 10, rest: 60, start: 0, pattern: "plank",
      steps: ["Kneel, grip the wheel under your shoulders.", "Roll out slowly, keeping the core braced.", "Go as far as you can keep a flat back.", "Pull back with the abs to the start."],
      mistakes: ["Sagging the lower back", "Rolling out too far too soon", "Using the arms to pull"] }),
    ex({ name: "Russian Twists", machine: "Plate or dumbbell", kind: "isolation", reps: 20, rest: 45, start: 10, pattern: "crunch",
      steps: ["Sit, lean back slightly, feet up or down.", "Hold a weight at your chest.", "Rotate side to side, touching near the hip.", "Control the movement, don't rush."],
      mistakes: ["Just moving the arms", "Rounding the back hard", "Going too fast"] }),
  ],
};

// Build a flat lookup of every exercise by name, with its muscle group baked in.
const FLAT = {};
for (const [group, list] of Object.entries(LIBRARY)) {
  for (const e of list) {
    FLAT[e.name] = { ...e, muscle: e.muscle || group, muscleGroup: group };
  }
}

// All exercise names, sorted, for the searchable "all exercises" swap tab.
export const ALL_EXERCISE_NAMES = Object.keys(FLAT).sort();

// Map a muscle string (from the program) to a library group for "same muscle".
const MUSCLE_TO_GROUP = {
  Chest: "Chest", "Upper chest": "Chest", "Inner / upper chest": "Chest",
  Shoulders: "Shoulders", "Side delts": "Shoulders", "Rear delts": "Shoulders", "Front delts": "Shoulders",
  Triceps: "Triceps", "Triceps (long head)": "Triceps",
  Back: "Back", Lats: "Back", "Mid-back": "Back",
  Biceps: "Biceps",
  Quads: "Quads", Legs: "Quads",
  Hamstrings: "Hamstrings", Glutes: "Hamstrings",
  Abs: "Abs", Core: "Abs",
};

export function groupForMuscle(muscle) {
  return MUSCLE_TO_GROUP[muscle] || muscle;
}

// Return a fully-prepped exercise object by name, ready to drop into a session.
// Carries an id derived from the name so the runner can track it.
export function buildExercise(name, idPrefix = "lib") {
  const base = FLAT[name];
  if (!base) {
    // Custom typed exercise - minimal but valid, still fully usable.
    return {
      id: `${idPrefix}-${slug(name)}`, name, machine: "Custom", kind: "isolation",
      sets: 3, reps: 10, start: 20, rest: 60, muscle: "Custom", muscleGroup: "Other",
      pattern: "default", steps: ["Log your sets, reps and weight as you go."],
      mistakes: [], breathing: "Exhale on effort.",
    };
  }
  return {
    id: `${idPrefix}-${slug(name)}`, sets: 3, ...base,
  };
}

export function exercisesForGroup(group) {
  return (LIBRARY[group] || []).map((e) => e.name);
}

export function libraryGroups() {
  return Object.keys(LIBRARY);
}

function slug(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
