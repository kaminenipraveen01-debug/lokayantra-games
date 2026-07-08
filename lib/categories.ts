export interface CategoryDef {
  id: string;
  name: string;
  description: string;
  icon: string; // SVG path content
}

export const FEATURED_CATEGORIES: CategoryDef[] = [
  {
    id: "action",
    name: "Action",
    description: "Fast-paced games full of combat, explosions, and adrenaline-pumping challenges. Test your reflexes and skill.",
    icon: `<path d="M13 2L4.5 13.5H11L10 22L19.5 10.5H13L13 2Z" />`,
  },
  {
    id: "racing",
    name: "Racing",
    description: "Get behind the wheel and race against time, opponents, or both. Cars, bikes, and everything in between.",
    icon: `<circle cx="7" cy="17" r="2.5"/><circle cx="17" cy="17" r="2.5"/><path d="M5 17L6 9H18L19 17M9 9L11 4H13L15 9" fill="none" stroke-width="1.6"/>`,
  },
  {
    id: "puzzle",
    name: "Puzzle",
    description: "Sharpen your mind with brain-bending puzzles, matching games, and logic challenges of every difficulty.",
    icon: `<path d="M5 5H11V8.5C11 9.5 12 10 13 9.5C13.8 9 15 9.5 15 10.8C15 12 13.8 12.5 13 12C12 11.5 11 12 11 13V16.5H5V11C4 11 3.5 10 4 9C4.5 8.2 4 7 2.8 7C1.5 7 1 8.2 1.5 9C2 10 1.5 11 0.5 11V5H5Z" fill="none" stroke-width="1.4"/>`,
  },
  {
    id: "adventure",
    name: "Adventure",
    description: "Embark on epic journeys, explore mysterious worlds, and uncover stories in immersive adventure games.",
    icon: `<path d="M12 3L19 8V21H5V8L12 3Z" fill="none" stroke-width="1.6"/><path d="M9 21V14H15V21" fill="none" stroke-width="1.6"/>`,
  },
  {
    id: "sports",
    name: "Sports",
    description: "Step onto the field, court, or track. Football, basketball, and every sport you love to play virtually.",
    icon: `<circle cx="12" cy="12" r="9" fill="none" stroke-width="1.6"/><path d="M12 3V21M3 12H21M5.5 6.5L18.5 17.5M18.5 6.5L5.5 17.5" stroke-width="1" opacity="0.6"/>`,
  },
  {
    id: "shooter",
    name: "Shooting",
    description: "Lock, load, and aim true. Tactical shooters and arcade blasters for sharpshooters of every level.",
    icon: `<circle cx="12" cy="12" r="8" fill="none" stroke-width="1.6"/><circle cx="12" cy="12" r="3" fill="none" stroke-width="1.4"/><path d="M12 2V5M12 19V22M2 12H5M19 12H22" stroke-width="1.6"/>`,
  },
  {
    id: "arcade",
    name: "Arcade",
    description: "Classic coin-op style gameplay reborn. Quick rounds, high scores, and nonstop retro fun.",
    icon: `<rect x="5" y="4" width="14" height="13" rx="2" fill="none" stroke-width="1.6"/><circle cx="9" cy="20" r="1.2"/><circle cx="15" cy="20" r="1.2"/><path d="M9 18V20M15 18V20" stroke-width="1.4"/>`,
  },
  {
    id: "simulation",
    name: "Simulation",
    description: "Build, manage, and simulate real-world systems and scenarios in detailed virtual environments.",
    icon: `<rect x="4" y="7" width="16" height="11" rx="1.5" fill="none" stroke-width="1.6"/><path d="M8 7V4H16V7" fill="none" stroke-width="1.6"/><path d="M4 11H20" stroke-width="1"/>`,
  },
  {
    id: "brain",
    name: "Brain",
    description: "Train your mind with memory challenges, quick math, and games designed to boost cognitive skills.",
    icon: `<path d="M9 4C6 4 4 6.5 4 9C4 10 4.3 10.8 4.8 11.5C4.3 12.2 4 13.2 4 14C4 16.5 6 18.5 8.5 18.5C9 19.8 10.3 21 12 21C13.7 21 15 19.8 15.5 18.5C18 18.5 20 16.5 20 14C20 13.2 19.7 12.2 19.2 11.5C19.7 10.8 20 10 20 9C20 6.5 18 4 15 4C13.8 4 12.8 4.5 12 5.2C11.2 4.5 10.2 4 9 4Z" fill="none" stroke-width="1.4"/>`,
  },
  {
    id: "battle",
    name: "Battle",
    description: "Fight your way through enemies, bosses, and rivals in intense battle and combat games.",
    icon: `<path d="M6.5 17.5L17.5 6.5M14 4L20 10M4 14L10 20M7 14L4 17L7 20M14 7L17 4L20 7" fill="none" stroke-width="1.6"/>`,
  },
  {
    id: "io",
    name: "IO Games",
    description: "Compete in real-time against players worldwide in fast, addictive multiplayer browser games.",
    icon: `<circle cx="12" cy="12" r="3" fill="none" stroke-width="1.6"/><circle cx="6" cy="6" r="1.8" fill="none" stroke-width="1.4"/><circle cx="18" cy="6" r="1.8" fill="none" stroke-width="1.4"/><circle cx="6" cy="18" r="1.8" fill="none" stroke-width="1.4"/><circle cx="18" cy="18" r="1.8" fill="none" stroke-width="1.4"/>`,
  },
];

export function getCategoryById(id: string): CategoryDef | undefined {
  return FEATURED_CATEGORIES.find((c) => c.id === id);
}