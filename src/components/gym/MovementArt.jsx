// Simple, clean stick-figure-style SVG illustrations per movement pattern.
// Gold strokes on transparent background. Not anatomical — just a visual cue.

const S = { fill: "none", stroke: "currentColor", strokeWidth: 2.4, strokeLinecap: "round", strokeLinejoin: "round" };
const A = { fill: "none", stroke: "currentColor", strokeWidth: 2.4, strokeLinecap: "round", strokeLinejoin: "round", opacity: 0.35 };

function Frame({ children }) {
  return (
    <svg viewBox="0 0 120 90" className="w-full h-28 text-gold">
      {children}
    </svg>
  );
}

const head = (cx, cy) => <circle cx={cx} cy={cy} r="6" {...S} />;

export function MovementArt({ pattern }) {
  switch (pattern) {
    case "press": // overhead/bench press — arms extending up
      return (
        <Frame>
          {head(60, 30)}
          <path d="M60 36 L60 60" {...S} />
          <path d="M60 42 L46 30 M60 42 L74 30" {...A} />
          <path d="M60 40 L44 22 M60 40 L76 22" {...S} />
          <path d="M60 60 L50 78 M60 60 L70 78" {...S} />
        </Frame>
      );
    case "fly": // chest fly — arms arc together
      return (
        <Frame>
          {head(60, 28)}
          <path d="M60 34 L60 60" {...S} />
          <path d="M60 40 C40 40 34 50 34 56 M60 40 C80 40 86 50 86 56" {...A} />
          <path d="M60 42 C52 42 48 46 46 50 M60 42 C68 42 72 46 74 50" {...S} />
          <path d="M60 60 L50 78 M60 60 L70 78" {...S} />
        </Frame>
      );
    case "raise": // lateral raise — arms out to sides
      return (
        <Frame>
          {head(60, 28)}
          <path d="M60 34 L60 62" {...S} />
          <path d="M60 40 L40 40 M60 40 L80 40" {...S} />
          <path d="M40 40 L34 34 M80 40 L86 34" {...A} />
          <path d="M60 62 L50 80 M60 62 L70 80" {...S} />
        </Frame>
      );
    case "pushdown":
    case "extension": // triceps — forearm extending down/up
      return (
        <Frame>
          {head(60, 26)}
          <path d="M60 32 L60 58" {...S} />
          <path d="M60 38 L70 48 L66 60" {...S} />
          <path d="M70 48 L62 56" {...A} />
          <path d="M60 58 L50 78 M60 58 L70 78" {...S} />
        </Frame>
      );
    case "pulldown": // lat pulldown — arms pulling down from above
      return (
        <Frame>
          {head(60, 34)}
          <path d="M60 40 L60 64" {...S} />
          <path d="M60 44 L46 30 M60 44 L74 30" {...S} />
          <path d="M60 46 L48 20 M60 46 L72 20" {...A} />
          <path d="M44 18 L76 18" {...S} />
          <path d="M60 64 L52 80 M60 64 L68 80" {...S} />
        </Frame>
      );
    case "row": // row — pulling toward torso
      return (
        <Frame>
          {head(40, 34)}
          <path d="M40 40 L62 46" {...S} />
          <path d="M62 46 L80 40" {...A} />
          <path d="M62 46 L74 52" {...S} />
          <path d="M40 40 L36 60 M62 46 L66 64" {...S} />
        </Frame>
      );
    case "facepull": // face pull — rope to face, elbows high
      return (
        <Frame>
          {head(60, 32)}
          <path d="M60 38 L60 62" {...S} />
          <path d="M60 42 L44 36 M60 42 L76 36" {...S} />
          <path d="M44 36 L34 40 M76 36 L86 40" {...A} />
          <path d="M60 62 L50 80 M60 62 L70 80" {...S} />
        </Frame>
      );
    case "curl": // bicep curl — forearm curling up
      return (
        <Frame>
          {head(60, 26)}
          <path d="M60 32 L60 60" {...S} />
          <path d="M60 40 L70 50 L64 38" {...S} />
          <path d="M70 50 L74 60" {...A} />
          <path d="M60 60 L50 78 M60 60 L70 78" {...S} />
        </Frame>
      );
    case "squat":
    case "legpress": // squat — bent knees
      return (
        <Frame>
          {head(60, 22)}
          <path d="M60 28 L60 48" {...S} />
          <path d="M60 48 L48 58 L52 74 M60 48 L72 58 L68 74" {...S} />
          <path d="M60 34 L48 40 M60 34 L72 40" {...S} />
        </Frame>
      );
    case "legext": // leg extension — lower leg out
      return (
        <Frame>
          {head(44, 30)}
          <path d="M44 36 L44 52" {...S} />
          <path d="M44 52 L64 52 L82 44" {...S} />
          <path d="M64 52 L82 60" {...A} />
        </Frame>
      );
    case "legcurl": // leg curl — heel toward glutes
      return (
        <Frame>
          {head(40, 54)}
          <path d="M40 54 L66 54" {...S} />
          <path d="M66 54 L78 42" {...S} />
          <path d="M66 54 L80 56" {...A} />
        </Frame>
      );
    case "legraise": // hanging leg raise
      return (
        <Frame>
          {head(60, 22)}
          <path d="M60 16 L60 12" {...S} />
          <path d="M60 28 L60 50" {...S} />
          <path d="M60 50 L78 46 M60 50 L78 58" {...S} />
          <path d="M60 50 L60 74" {...A} />
        </Frame>
      );
    case "crunch": // crunch — curling torso
      return (
        <Frame>
          {head(40, 40)}
          <path d="M40 46 C52 50 60 54 64 64" {...S} />
          <path d="M64 64 L80 64" {...S} />
          <path d="M64 64 L60 50" {...S} />
        </Frame>
      );
    case "plank": // plank — straight line on forearms
      return (
        <Frame>
          {head(34, 50)}
          <path d="M40 52 L84 64" {...S} />
          <path d="M40 52 L36 64 L30 64" {...S} />
          <path d="M84 64 L88 76 M76 62 L80 76" {...S} />
        </Frame>
      );
    default:
      return (
        <Frame>
          {head(60, 30)}
          <path d="M60 36 L60 60 M60 44 L48 52 M60 44 L72 52 M60 60 L50 78 M60 60 L70 78" {...S} />
        </Frame>
      );
  }
}
