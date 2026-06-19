// Hardcoded GIF map — verified against hasaneyldrm/exercises-dataset (1324 exercises).
// Educational / non-commercial personal use only.
// Base URL for all paths:
const BASE = "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/";

const GIF_MAP = {
  "Flat Barbell Bench Press":          "videos/0025-EIeI8Vf.gif",
  "Incline Dumbbell Press":            "videos/0314-ns0SIbU.gif",
  "Cable Chest Fly (low to high)":     "videos/1262-w4dLzSx.gif",
  "Shoulder Press Machine":            "videos/0603-67n3r98.gif",
  "Lateral Raises":                    "videos/0334-DsgkuIt.gif",
  "Tricep Pushdown":                   "videos/0201-3ZflifB.gif",
  "Overhead Tricep Extension":         "videos/0194-2IxROQ1.gif",
  "Lat Pulldown (wide grip)":          "videos/2330-LEprlgG.gif",
  "Lat Pulldown (close underhand)":    "videos/0245-xBYcQHj.gif",
  "Seated Cable Row":                  "videos/0861-fUBheHs.gif",
  "Chest-Supported Machine Row":       "videos/0606-aaXr7ld.gif",
  "Face Pulls":                        "videos/1022-tc5dYrf.gif",
  "Dumbbell Bicep Curl":               "videos/0294-NbVPDMW.gif",
  "Hammer Curl":                       "videos/0313-slDvUAU.gif",
  "Leg Press":                         "videos/0739-10Z2DXU.gif",
  "Goblet Squat":                      "videos/1760-yn8yg1r.gif",
  "Leg Extension Machine":             "videos/0585-my33uHU.gif",
  "Leg Curl Machine":                  "videos/0586-17lJ1kr.gif",
  "Hanging Leg Raises":                "videos/0472-I3tsCnC.gif",
  "Cable Crunch":                      "videos/0175-WW95auq.gif",
  "Plank":                             "videos/0464-CosupLu.gif",
  "Overhead Press Machine":            "videos/0603-67n3r98.gif",
  "Arnold Press":                      "videos/2137-Xy4jlWA.gif",
  "Pec Deck Fly":                      "videos/1262-w4dLzSx.gif",
  "Bicycle Crunches":                  "videos/0003-1ZFqTDN.gif",
  "Reverse Crunches":                  "videos/0872-nCU1Ekp.gif",
  "Ab Wheel Rollout":                  "videos/0971-zhF9lW4.gif",
  "Single Arm Dumbbell Row":           "videos/1285-o5Jsk92.gif",
  "Straight Arm Pulldown":             "videos/0238-x69MAlq.gif",
  "Concentration Curl":                "videos/0297-gvsWLQw.gif",
  "Plank with Hip Dips":               "videos/3544-5VXmnV5.gif",
};

// Returns a full GIF URL or null — instant, no network call, no guessing.
export function getExerciseGif(exerciseName) {
  const path = GIF_MAP[exerciseName];
  return path ? BASE + path : null;
}
