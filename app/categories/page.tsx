import type { Metadata } from "next";
import Link from "next/link";
import { fetchAllCategories } from "@/lib/gamepix";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "All Game Categories | LokaYantra",
  description: "Browse all game categories on LokaYantra — Action, Racing, Puzzle, Adventure, Sports, and more. Find your favorite type of free online HTML5 games.",
};

// Category కి SVG icon
function CategorySVG({ id }: { id: string }) {
  const icons: Record<string, React.ReactNode> = {
  "2048": <><rect x="3" y="3" width="8" height="8" rx="1" fill="none" stroke="currentColor" strokeWidth="1.6"/><rect x="13" y="3" width="8" height="8" rx="1" fill="currentColor" opacity="0.4" stroke="currentColor" strokeWidth="1.6"/><rect x="3" y="13" width="8" height="8" rx="1" fill="currentColor" opacity="0.7" stroke="currentColor" strokeWidth="1.6"/><rect x="13" y="13" width="8" height="8" rx="1" fill="currentColor" stroke="currentColor" strokeWidth="1.6"/></>,
  action: <path d="M13 2L4.5 13.5H11L10 22L19.5 10.5H13L13 2Z" fill="currentColor"/>,
  addictive: <><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="none" stroke="currentColor" strokeWidth="1.6"/><path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1.6" fill="none"/></>,
  adventure: <><path d="M12 3L19 8V21H5V8L12 3Z" fill="none" stroke="currentColor" strokeWidth="1.6"/><path d="M9 21V14H15V21" fill="none" stroke="currentColor" strokeWidth="1.6"/></>,
  airplane: <><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" fill="currentColor"/></>,
  animal: <><circle cx="8" cy="8" r="2.5" fill="currentColor"/><circle cx="16" cy="8" r="2.5" fill="currentColor"/><circle cx="5" cy="13" r="2" fill="currentColor"/><circle cx="19" cy="13" r="2" fill="currentColor"/><path d="M12 11C8.5 11 6 13.5 6 17C6 19.2 7.8 21 10 21H14C16.2 21 18 19.2 18 17C18 13.5 15.5 11 12 11Z" fill="none" stroke="currentColor" strokeWidth="1.5"/><circle cx="10" cy="16" r="1" fill="currentColor"/><circle cx="14" cy="16" r="1" fill="currentColor"/></>,
  arcade: <><rect x="5" y="2" width="14" height="15" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6"/><path d="M9 17V20M15 17V20M7 20H17" stroke="currentColor" strokeWidth="1.4"/><path d="M9 8H15M12 6V10" stroke="currentColor" strokeWidth="1.5"/></>,
  archery: <><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.6"/><circle cx="12" cy="12" r="5" fill="none" stroke="currentColor" strokeWidth="1.2"/><circle cx="12" cy="12" r="2" fill="currentColor"/><path d="M21 3L14 10" stroke="currentColor" strokeWidth="1.6"/><path d="M17 3H21V7" stroke="currentColor" strokeWidth="1.6" fill="none"/></>,
  ball: <><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.6"/><path d="M12 3V21M3.5 7.5L20.5 7.5M3.5 16.5L20.5 16.5" stroke="currentColor" strokeWidth="1"/></>,
  basketball: <><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.6"/><path d="M12 3C12 3 8 7 8 12C8 17 12 21 12 21" stroke="currentColor" strokeWidth="1.2"/><path d="M12 3C12 3 16 7 16 12C16 17 12 21 12 21" stroke="currentColor" strokeWidth="1.2"/><path d="M3 12H21" stroke="currentColor" strokeWidth="1.2"/></>,
  baseball: <><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.6"/><path d="M9 3.5C9 3.5 10 8 10 12C10 16 9 20.5 9 20.5" stroke="currentColor" strokeWidth="1.2" fill="none"/><path d="M15 3.5C15 3.5 14 8 14 12C14 16 15 20.5 15 20.5" stroke="currentColor" strokeWidth="1.2" fill="none"/></>,
  battle: <path d="M6.5 17.5L17.5 6.5M14 4L20 10M4 14L10 20M7 14L4 17L7 20M14 7L17 4L20 7" fill="none" stroke="currentColor" strokeWidth="1.6"/>,
  "battle-royale": <><path d="M12 2L15 8H21L16.5 12.5L18.5 19L12 15.5L5.5 19L7.5 12.5L3 8H9L12 2Z" fill="none" stroke="currentColor" strokeWidth="1.5"/></>,
  bike: <><circle cx="6" cy="16" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.6"/><circle cx="18" cy="16" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.6"/><path d="M6 16L10 8H14M10 8L18 16M14 8H17L18 12.5" stroke="currentColor" strokeWidth="1.5" fill="none"/></>,
  block: <><rect x="3" y="12" width="9" height="9" rx="1" fill="currentColor" opacity="0.5"/><rect x="12" y="12" width="9" height="9" rx="1" fill="currentColor" opacity="0.8"/><rect x="3" y="3" width="9" height="9" rx="1" fill="currentColor" opacity="0.8"/><rect x="12" y="3" width="9" height="9" rx="1" fill="currentColor"/></>,
  board: <><rect x="3" y="3" width="18" height="18" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6"/><path d="M3 9H21M3 15H21M9 3V21M15 3V21" stroke="currentColor" strokeWidth="1"/></>,
  brain: <path d="M9.5 2C7 2 5 4 5 6.5C5 7.5 5.3 8.4 5.9 9.1C5.3 9.8 5 10.8 5 11.8C5 14.1 6.8 16 9 16.3C9.4 17.5 10.6 18.5 12 18.5C13.4 18.5 14.6 17.5 15 16.3C17.2 16 19 14.1 19 11.8C19 10.8 18.7 9.8 18.1 9.1C18.7 8.4 19 7.5 19 6.5C19 4 17 2 14.5 2C13.4 2 12.4 2.4 11.7 3C11 2.4 10 2 9.5 2Z" fill="none" stroke="currentColor" strokeWidth="1.4"/>,
  building: <><rect x="3" y="10" width="8" height="12" fill="none" stroke="currentColor" strokeWidth="1.5"/><rect x="13" y="6" width="8" height="16" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M1 22H23" stroke="currentColor" strokeWidth="1.6"/><rect x="5" y="13" width="2" height="2" fill="currentColor"/><rect x="9" y="13" width="2" height="2" fill="currentColor"/><rect x="15" y="9" width="2" height="2" fill="currentColor"/><rect x="19" y="9" width="2" height="2" fill="currentColor"/></>,
  car: <><rect x="3" y="10" width="18" height="8" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6"/><path d="M6 10L8 5H16L18 10" stroke="currentColor" strokeWidth="1.5" fill="none"/><circle cx="8" cy="18" r="2" fill="currentColor"/><circle cx="16" cy="18" r="2" fill="currentColor"/></>,
  card: <><rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6"/><path d="M3 9H21" stroke="currentColor" strokeWidth="1.6"/><path d="M7 14H10M13 14H17" stroke="currentColor" strokeWidth="1.4"/></>,
  casual: <><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.6"/><path d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14" stroke="currentColor" strokeWidth="1.5" fill="none"/><circle cx="9" cy="10" r="1.2" fill="currentColor"/><circle cx="15" cy="10" r="1.2" fill="currentColor"/></>,
  cats: <><path d="M4 6L4 2L7 5M20 6L20 2L17 5" stroke="currentColor" strokeWidth="1.5" fill="none"/><path d="M4 6C4 6 3 8 3 12C3 17 7 21 12 21C17 21 21 17 21 12C21 8 20 6 20 6C19 5 17 4 12 4C7 4 5 5 4 6Z" fill="none" stroke="currentColor" strokeWidth="1.5"/><circle cx="9" cy="12" r="1.2" fill="currentColor"/><circle cx="15" cy="12" r="1.2" fill="currentColor"/><path d="M10 15.5C10 15.5 11 16.5 12 15.5C13 16.5 14 15.5 14 15.5" stroke="currentColor" strokeWidth="1.2" fill="none"/></>,
  chess: <><path d="M9 4H15M12 4V7M10 7H14L15 10H9L10 7Z" fill="none" stroke="currentColor" strokeWidth="1.5"/><rect x="8" y="10" width="8" height="3" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5"/><rect x="6" y="18" width="12" height="3" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M8 13L7 18M16 13L17 18" stroke="currentColor" strokeWidth="1.3"/></>,
  christmas: <><path d="M12 2L16 8H14L17 13H14L18 19H6L10 13H7L10 8H8L12 2Z" fill="none" stroke="currentColor" strokeWidth="1.5"/><rect x="10" y="19" width="4" height="3" fill="none" stroke="currentColor" strokeWidth="1.5"/><circle cx="12" cy="10" r="1" fill="currentColor"/><circle cx="10" cy="14" r="1" fill="currentColor"/><circle cx="14" cy="14" r="1" fill="currentColor"/></>,
  clicker: <><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.6"/><path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/></>,
  cooking: <><path d="M9 3C9 3 8 6 10 8C12 10 11 13 11 13H13C13 13 12 10 14 8C16 6 15 3 15 3" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M7 13H17V18C17 19.1 16.1 20 15 20H9C7.9 20 7 19.1 7 18V13Z" fill="none" stroke="currentColor" strokeWidth="1.6"/></>,
  "dirt-bike": <><circle cx="6" cy="17" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.6"/><circle cx="18" cy="17" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.6"/><path d="M6 17L9 8H13.5M9 8L18 17M13.5 8L16 5H19" stroke="currentColor" strokeWidth="1.5" fill="none"/></>,
  dinosaur: <><path d="M8 3C8 3 5 4 4 7C3 10 5 11 5 11L3 14L5 14L6 12C7 13 9 13 9 13L10 17L12 17L13 13C15 13 17 11 17 9C17 7 15 5 15 5L16 3L14 3L13 5C12 4 10 3 8 3Z" fill="none" stroke="currentColor" strokeWidth="1.4"/><path d="M10 17L9 21M12 17L13 21" stroke="currentColor" strokeWidth="1.4"/></>,
  drawing: <><path d="M12 19L4 21L6 13L16 3L21 8L12 19Z" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M16 3L21 8" stroke="currentColor" strokeWidth="1.5"/><path d="M6 13L11 18" stroke="currentColor" strokeWidth="1.2"/></>,
  "dress-up": <><path d="M8 3L5 8L9 10V21H15V10L19 8L16 3" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M8 3C9 5 11 6 12 6C13 6 15 5 16 3" stroke="currentColor" strokeWidth="1.5" fill="none"/></>,
  drifting: <><path d="M3 12C3 12 8 8 12 8C16 8 18 12 21 12" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/><path d="M3 16C3 16 8 12 12 12C16 12 18 16 21 16" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.5"/><circle cx="8" cy="19" r="2" fill="none" stroke="currentColor" strokeWidth="1.5"/><circle cx="16" cy="19" r="2" fill="none" stroke="currentColor" strokeWidth="1.5"/></>,
  driving: <><rect x="3" y="10" width="18" height="8" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6"/><path d="M6 10L8 5H16L18 10" stroke="currentColor" strokeWidth="1.5" fill="none"/><circle cx="8" cy="18" r="2" fill="currentColor"/><circle cx="16" cy="18" r="2" fill="currentColor"/><path d="M5 7H8" stroke="currentColor" strokeWidth="1.2"/></>,
  educational: <><rect x="3" y="8" width="18" height="13" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M8 8V6C8 4.9 8.9 4 10 4H14C15.1 4 16 4.9 16 6V8" stroke="currentColor" strokeWidth="1.5" fill="none"/><path d="M12 12V17M9.5 14.5H14.5" stroke="currentColor" strokeWidth="1.6"/></>,
  escape: <><rect x="3" y="3" width="18" height="18" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5"/><circle cx="9" cy="12" r="1.5" fill="currentColor"/><path d="M10.5 12H16M14 10L16 12L14 14" stroke="currentColor" strokeWidth="1.5" fill="none"/></>,
  family: <><circle cx="9" cy="6" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.5"/><circle cx="15" cy="6" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.5"/><circle cx="12" cy="15" r="2" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M5 22C5 18.7 6.8 16 9 16M19 22C19 18.7 17.2 16 15 16" stroke="currentColor" strokeWidth="1.5" fill="none"/><path d="M9 22C9 20 10.3 18.5 12 18.5C13.7 18.5 15 20 15 22" stroke="currentColor" strokeWidth="1.5" fill="none"/></>,
  farming: <><path d="M3 20H21" stroke="currentColor" strokeWidth="1.6"/><path d="M5 20V12L9 8L13 12V20" stroke="currentColor" strokeWidth="1.5" fill="none"/><path d="M13 20V14H17V20" stroke="currentColor" strokeWidth="1.5" fill="none"/><path d="M9 8V5M7 7L11 3" stroke="currentColor" strokeWidth="1.4"/></>,
  fashion: <><path d="M8 3L5 8L9 10V21H15V10L19 8L16 3C15 5 13 6 12 6C11 6 9 5 8 3Z" fill="none" stroke="currentColor" strokeWidth="1.5"/><circle cx="12" cy="15" r="1.5" fill="currentColor"/></>,
  fighting: <><path d="M8 3L5 9H9L7 14L16 7H12L14 3H8Z" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M16 10L19 14L16 18L13 14" fill="none" stroke="currentColor" strokeWidth="1.5"/></>,
  "fire-and-water": <><path d="M12 2C12 2 8 6 8 10C8 12.5 9.5 14 9.5 14C9.5 14 9 12 10 11C10 11 10 14 12 16C14 14 14 11 14 11C15 12 14.5 14 14.5 14C14.5 14 16 12.5 16 10C16 6 12 2 12 2Z" fill="currentColor" opacity="0.7"/><path d="M4 20C4 17 6 15 8 15C8 15 6 18 8 20H16C18 18 16 15 16 15C18 15 20 17 20 20H4Z" fill="none" stroke="currentColor" strokeWidth="1.5"/></>,
  "first-person-shooter": <><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.5"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.2"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><path d="M12 3V7M12 17V21M3 12H7M17 12H21" stroke="currentColor" strokeWidth="1.4"/></>,
  fishing: <><path d="M4 4C4 4 8 6 8 12C8 16 6 18 4 20" stroke="currentColor" strokeWidth="1.5" fill="none"/><path d="M4 4L12 4" stroke="currentColor" strokeWidth="1.5"/><path d="M12 4C12 4 20 8 20 16C20 18 19 20 17 20C15 20 14 18 14 16C14 14 15 12 17 12" stroke="currentColor" strokeWidth="1.4" fill="none"/><circle cx="17" cy="12" r="2" fill="none" stroke="currentColor" strokeWidth="1.4"/></>,
  flash: <path d="M13 2L4 14H11L10 22L20 10H13L13 2Z" fill="currentColor"/>,
  flight: <><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" fill="currentColor"/></>,
  fun: <><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.6"/><path d="M8 13C8 13 9.5 16 12 16C14.5 16 16 13 16 13" stroke="currentColor" strokeWidth="1.5" fill="none"/><path d="M9 9.5C9 9.5 9.5 9 10 9.5M14 9.5C14 9.5 14.5 9 15 9.5" stroke="currentColor" strokeWidth="1.5"/></>,
  "games-for-girls": <><circle cx="12" cy="8" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M12 11.5C8 11.5 5 14 5 18V21H19V18C19 14 16 11.5 12 11.5Z" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M8 6C8.5 4 10 3 12 3" stroke="currentColor" strokeWidth="1.2"/></>,
  gangster: <><path d="M4 20L8 14L12 16L16 14L20 20H4Z" fill="none" stroke="currentColor" strokeWidth="1.5"/><circle cx="12" cy="9" r="4" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M8 7C8 7 9 5 12 5" stroke="currentColor" strokeWidth="1.3"/></>,
  gdevelop: <><rect x="3" y="3" width="18" height="18" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M8 12H14M12 9C10.3 9 9 10.3 9 12C9 13.7 10.3 15 12 15H14V12.5" stroke="currentColor" strokeWidth="1.5" fill="none"/></>,
  golf: <><circle cx="12" cy="18" r="3" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M12 15V4M12 4L17 7M12 4L7 7" stroke="currentColor" strokeWidth="1.5"/></>,
  granny: <><circle cx="12" cy="6" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M6 22V17C6 14.2 8.7 12 12 12C15.3 12 18 14.2 18 17V22" stroke="currentColor" strokeWidth="1.5" fill="none"/><path d="M4 12C4 12 3 15 6 16M20 12C20 12 21 15 18 16" stroke="currentColor" strokeWidth="1.3"/></>,
  gun: <><path d="M3 9H15V13H17L19 11H21V15H19L17 13H15V15H5C4 15 3 14 3 13V9Z" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M7 15V18" stroke="currentColor" strokeWidth="1.5"/></>,
  "hair-salon": <><circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M8 12L5 19M16 12L19 19" stroke="currentColor" strokeWidth="1.5"/><path d="M7 17H17" stroke="currentColor" strokeWidth="1.3"/></>,
  halloween: <><path d="M5 13C5 8.6 8.1 5 12 5C15.9 5 19 8.6 19 13C19 17.4 15.9 21 12 21C8.1 21 5 17.4 5 13Z" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M9 11L10.5 13L9 15M15 11L13.5 13L15 15M11 17H13" stroke="currentColor" strokeWidth="1.4"/><path d="M10 5C10 5 10 3 8 2M14 5C14 5 14 3 16 2" stroke="currentColor" strokeWidth="1.3"/></>,
  helicopter: <><rect x="8" y="10" width="12" height="4" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M4 10H8" stroke="currentColor" strokeWidth="1.5"/><path d="M16 10L18 7" stroke="currentColor" strokeWidth="1.5"/><path d="M6 12V16" stroke="currentColor" strokeWidth="1.5"/><path d="M3 8H13" stroke="currentColor" strokeWidth="1.8"/><path d="M18 7H22" stroke="currentColor" strokeWidth="1.5"/></>,
  "hidden-object": <><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.5"/><circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M3 12H9M15 12H21M12 3V9M12 15V21" stroke="currentColor" strokeWidth="1.2"/></>,
  hockey: <><path d="M4 19C4 17 5.5 16 8 16H16C18.5 16 20 17 20 19V20H4V19Z" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M8 16L6 8M16 16L18 8" stroke="currentColor" strokeWidth="1.4"/><path d="M6 8H18" stroke="currentColor" strokeWidth="1.5"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/></>,
  horror: <><path d="M12 2L14.5 8H21L16 12.5L18 19L12 15L6 19L8 12.5L3 8H9.5L12 2Z" fill="none" stroke="currentColor" strokeWidth="1.5"/></>,
  horse: <><path d="M17 3C17 3 19 4 19 7L17 8L18 10C18 10 20 11 20 14C20 17 17 19 14 19H10C7 19 4 17 4 14V10L6 8C6 8 5 6 7 4L9 5L10 3H14L15 5L17 3Z" fill="none" stroke="currentColor" strokeWidth="1.4"/><path d="M10 19V22M14 19V22" stroke="currentColor" strokeWidth="1.4"/></>,
  hunting: <><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.5"/><circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1.2"/><path d="M12 3V9M12 15V21M3 12H9M15 12H21" stroke="currentColor" strokeWidth="1.3"/><path d="M18 4L14.5 9.5" stroke="currentColor" strokeWidth="1.5"/></>,
  "hyper-casual": <><path d="M13 2L4.5 13.5H11L10 22L19.5 10.5H13L13 2Z" fill="currentColor" opacity="0.6"/><circle cx="19" cy="5" r="3" fill="none" stroke="currentColor" strokeWidth="1.5"/></>,
  idle: <><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.6"/><path d="M12 7V12H16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></>,
  io: <><circle cx="12" cy="12" r="3" fill="currentColor"/><circle cx="5" cy="5" r="2" fill="none" stroke="currentColor" strokeWidth="1.6"/><circle cx="19" cy="5" r="2" fill="none" stroke="currentColor" strokeWidth="1.6"/><circle cx="5" cy="19" r="2" fill="none" stroke="currentColor" strokeWidth="1.6"/><circle cx="19" cy="19" r="2" fill="none" stroke="currentColor" strokeWidth="1.6"/><path d="M7 7L10 10M14 10L17 7M7 17L10 14M14 14L17 17" stroke="currentColor" strokeWidth="1"/></>,
  "jigsaw-puzzles": <><path d="M5 5H11V8.5C11 9.5 12 10 13 9.5C14 9 15 9.5 15 10.8C15 12 14 12.5 13 12C12 11.5 11 12 11 13V17H5V11C4 11 3 10 3.5 9C4 8 3.5 7 2.5 7C1.5 7 1 8 1.5 9C2 10 1.5 11 0.5 11V5H5Z" fill="none" stroke="currentColor" strokeWidth="1.4"/></>,
  jumping: <><circle cx="12" cy="5" r="3" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M12 8V14M8 22L12 14L16 22" stroke="currentColor" strokeWidth="1.5" fill="none"/><path d="M8 11L12 13L16 11" stroke="currentColor" strokeWidth="1.3"/></>,
  junior: <><circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M8 22V16C8 14.9 8.9 14 10 14H14C15.1 14 16 14.9 16 16V22" stroke="currentColor" strokeWidth="1.5" fill="none"/><path d="M9 8.5C9.5 7 11 6 12 6" stroke="currentColor" strokeWidth="1.2"/></>,
  kids: <><circle cx="12" cy="9" r="4" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M8 9C8 9 5 8 4 6M16 9C16 9 19 8 20 6" stroke="currentColor" strokeWidth="1.3"/><path d="M6 20C6 16.7 8.7 14 12 14C15.3 14 18 16.7 18 20" fill="none" stroke="currentColor" strokeWidth="1.5"/></>,
  knight: <><path d="M9 3H15L14 8H10L9 3Z" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M8 8H16V14C16 17 14 19 12 20C10 19 8 17 8 14V8Z" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M9 22H15" stroke="currentColor" strokeWidth="1.5"/><path d="M12 20V22" stroke="currentColor" strokeWidth="1.5"/></>,
  mahjong: <><rect x="3" y="6" width="7" height="9" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5"/><rect x="14" y="6" width="7" height="9" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5"/><rect x="8.5" y="3" width="7" height="9" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5"/></>,
  makeup: <><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M12 8V3M12 16V21M8 12H3M16 12H21" stroke="currentColor" strokeWidth="1.3"/><path d="M9.5 9.5L6 6M14.5 14.5L18 18M14.5 9.5L18 6M9.5 14.5L6 18" stroke="currentColor" strokeWidth="1.2"/></>,
  management: <><rect x="3" y="3" width="7" height="5" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5"/><rect x="14" y="3" width="7" height="5" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5"/><rect x="8" y="14" width="8" height="5" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M6.5 8V11H17.5V8M12 11V14" stroke="currentColor" strokeWidth="1.4"/></>,
  mario: <><rect x="7" y="3" width="10" height="2" fill="currentColor"/><rect x="5" y="5" width="14" height="2" fill="currentColor"/><rect x="5" y="7" width="4" height="2" fill="currentColor"/><rect x="5" y="9" width="14" height="2" fill="currentColor"/><rect x="7" y="11" width="10" height="2" fill="currentColor"/><rect x="5" y="13" width="4" height="4" fill="currentColor"/><rect x="15" y="13" width="4" height="4" fill="currentColor"/></>,
  "match-3": <><circle cx="7" cy="7" r="2.5" fill="currentColor"/><circle cx="12" cy="7" r="2.5" fill="currentColor"/><circle cx="17" cy="7" r="2.5" fill="currentColor"/><circle cx="7" cy="17" r="2.5" fill="currentColor"/><circle cx="12" cy="17" r="2.5" fill="currentColor"/><circle cx="17" cy="17" r="2.5" fill="currentColor" opacity="0.3"/></>,
  math: <><path d="M6 12H18M12 6V18M7 7L17 17M17 7L7 17" stroke="currentColor" strokeWidth="1.8"/></>,
  memory: <><rect x="3" y="3" width="7" height="7" rx="1" fill="none" stroke="currentColor" strokeWidth="1.6"/><rect x="14" y="3" width="7" height="7" rx="1" fill="currentColor" opacity="0.3" stroke="currentColor" strokeWidth="1.6"/><rect x="3" y="14" width="7" height="7" rx="1" fill="currentColor" opacity="0.6" stroke="currentColor" strokeWidth="1.6"/><rect x="14" y="14" width="7" height="7" rx="1" fill="currentColor" stroke="currentColor" strokeWidth="1.6"/></>,
  mermaid: <><circle cx="12" cy="7" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M12 10.5C9 10.5 7 12.5 7 15L9 16L7 17L9 18L7 19L10 21C11 21.5 13 21.5 14 21L17 19L15 18L17 17L15 16L17 15C17 12.5 15 10.5 12 10.5Z" fill="none" stroke="currentColor" strokeWidth="1.4"/></>,
  minecraft: <><rect x="3" y="3" width="8" height="8" fill="currentColor" opacity="0.6"/><rect x="13" y="3" width="8" height="8" fill="currentColor" opacity="0.4"/><rect x="3" y="13" width="8" height="8" fill="currentColor" opacity="0.8"/><rect x="13" y="13" width="8" height="8" fill="currentColor"/></>,
  mining: <><path d="M14 3L21 10L10 21L3 14L14 3Z" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M3 21L7 17" stroke="currentColor" strokeWidth="1.5"/><path d="M10 6L18 14" stroke="currentColor" strokeWidth="1" opacity="0.5"/></>,
  mmorpg: <><circle cx="12" cy="8" r="3" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M6 21V18C6 15.8 8.7 14 12 14C15.3 14 18 15.8 18 18V21" stroke="currentColor" strokeWidth="1.5" fill="none"/><path d="M3 8L6 11M21 8L18 11" stroke="currentColor" strokeWidth="1.3"/><path d="M3 5L6 8M18 8L21 5" stroke="currentColor" strokeWidth="1.3" opacity="0.5"/></>,
  mobile: <><rect x="7" y="2" width="10" height="20" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6"/><path d="M10 18H14" stroke="currentColor" strokeWidth="1.5"/><path d="M10 6H14M10 9H14M10 12H12" stroke="currentColor" strokeWidth="1.2"/></>,
  money: <><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M12 6V8M12 16V18M9 9.5C9 8.1 10.3 7 12 7C13.7 7 15 8.1 15 9.5C15 12 12 12 12 14.5M12 14.5C12 14.5 9 14.5 9 16" stroke="currentColor" strokeWidth="1.4" fill="none"/></>,
  monster: <><path d="M4 8C4 5 7 3 10 3H14C17 3 20 5 20 8V14C20 17 17 19 14 19H10C7 19 4 17 4 14V8Z" fill="none" stroke="currentColor" strokeWidth="1.5"/><circle cx="9" cy="10" r="1.5" fill="currentColor"/><circle cx="15" cy="10" r="1.5" fill="currentColor"/><path d="M8 14H10V16H8V14ZM11 14H13V16H11V14ZM14 14H16V16H14V14Z" fill="currentColor"/><path d="M5 8L3 5M19 8L21 5" stroke="currentColor" strokeWidth="1.5"/></>,
  multiplayer: <><circle cx="8" cy="8" r="3" fill="none" stroke="currentColor" strokeWidth="1.5"/><circle cx="16" cy="8" r="3" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M2 21V19C2 16.8 4.7 15 8 15" stroke="currentColor" strokeWidth="1.5" fill="none"/><path d="M22 21V19C22 16.8 19.3 15 16 15" stroke="currentColor" strokeWidth="1.5" fill="none"/><path d="M12 21V19C12 17 13.3 15.5 16 15" stroke="currentColor" strokeWidth="1.3" fill="none" opacity="0.5"/></>,
  music: <><path d="M9 18V7L21 4V15" stroke="currentColor" strokeWidth="1.5" fill="none"/><circle cx="6" cy="18" r="3" fill="none" stroke="currentColor" strokeWidth="1.5"/><circle cx="18" cy="15" r="3" fill="none" stroke="currentColor" strokeWidth="1.5"/></>,
  naval: <><path d="M4 17L6 10H18L20 17H4Z" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M12 10V5M9 5H15" stroke="currentColor" strokeWidth="1.5"/><path d="M2 19C2 19 5 21 12 21C19 21 22 19 22 19" stroke="currentColor" strokeWidth="1.5"/></>,
  ninja: <><circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M8 8H4M20 8H16M12 12V20" stroke="currentColor" strokeWidth="1.5"/><path d="M8 20H16" stroke="currentColor" strokeWidth="1.5"/><path d="M4 8L8 8" stroke="currentColor" strokeWidth="1.5" strokeDasharray="1 1"/></>,
  "ninja-turtle": <><circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M8 10C8 10 10 9 12 9C14 9 16 10 16 10" stroke="currentColor" strokeWidth="1.3"/><circle cx="9.5" cy="12" r="1.5" fill="none" stroke="currentColor" strokeWidth="1.3"/><circle cx="14.5" cy="12" r="1.5" fill="none" stroke="currentColor" strokeWidth="1.3"/><path d="M10 15C10 15 11 16 12 15C13 16 14 15 14 15" stroke="currentColor" strokeWidth="1.3"/></>,
  offroad: <><circle cx="7" cy="17" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.6"/><circle cx="17" cy="17" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.6"/><path d="M3 17L4 9L7 7H17L20 9L21 17" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M7 7L9 4H15L17 7" stroke="currentColor" strokeWidth="1.4"/></>,
  "open-world": <><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M12 3C12 3 8 7 8 12C8 17 12 21 12 21" stroke="currentColor" strokeWidth="1.2"/><path d="M12 3C12 3 16 7 16 12C16 17 12 21 12 21" stroke="currentColor" strokeWidth="1.2"/><path d="M3 9H21M3 15H21" stroke="currentColor" strokeWidth="1"/></>,
  parking: <><rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M9 9H13C14.7 9 16 10.3 16 12C16 13.7 14.7 15 13 15H9V9Z" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M9 15V19" stroke="currentColor" strokeWidth="1.5"/></>,
  parkour: <><circle cx="15" cy="4" r="2" fill="currentColor"/><path d="M13 6L10 10L13 12L11 18M10 10L7 14" stroke="currentColor" strokeWidth="1.5" fill="none"/><path d="M5 8H10" stroke="currentColor" strokeWidth="1.5"/><path d="M11 18L9 22M11 18L14 20" stroke="currentColor" strokeWidth="1.4"/></>,
  piano: <><rect x="3" y="5" width="18" height="14" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M3 13H21" stroke="currentColor" strokeWidth="1.2"/><rect x="6" y="5" width="2.5" height="8" fill="currentColor"/><rect x="11" y="5" width="2.5" height="8" fill="currentColor"/><rect x="16" y="5" width="2.5" height="8" fill="currentColor"/></>,
  pirates: <><path d="M3 21L12 3L21 21H3Z" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M9 14H15M7 18H17" stroke="currentColor" strokeWidth="1.3"/><circle cx="12" cy="10" r="1.5" fill="currentColor"/></>,
  pixel: <><rect x="3" y="3" width="4" height="4" fill="currentColor"/><rect x="10" y="3" width="4" height="4" fill="currentColor" opacity="0.6"/><rect x="17" y="3" width="4" height="4" fill="currentColor" opacity="0.3"/><rect x="3" y="10" width="4" height="4" fill="currentColor" opacity="0.3"/><rect x="10" y="10" width="4" height="4" fill="currentColor"/><rect x="17" y="10" width="4" height="4" fill="currentColor" opacity="0.6"/><rect x="3" y="17" width="4" height="4" fill="currentColor" opacity="0.6"/><rect x="10" y="17" width="4" height="4" fill="currentColor" opacity="0.3"/><rect x="17" y="17" width="4" height="4" fill="currentColor"/></>,
  platformer: <><rect x="2" y="16" width="8" height="3" rx="1" fill="currentColor"/><rect x="14" y="11" width="8" height="3" rx="1" fill="currentColor"/><rect x="8" y="6" width="8" height="3" rx="1" fill="currentColor"/><circle cx="6" cy="13" r="2" fill="none" stroke="currentColor" strokeWidth="1.5"/></>,
  police: <><path d="M9 3H15L16 6H8L9 3Z" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M7 6H17V12C17 16 14 19 12 20C10 19 7 16 7 12V6Z" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M12 9V13M10 11H14" stroke="currentColor" strokeWidth="1.5"/></>,
  pool: <><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.5"/><circle cx="8" cy="10" r="2" fill="currentColor"/><circle cx="14" cy="8" r="2" fill="currentColor" opacity="0.5"/><circle cx="16" cy="14" r="2" fill="currentColor" opacity="0.7"/><path d="M20 20L16 16" stroke="currentColor" strokeWidth="1.8"/></>,
  princess: <><path d="M6 6L8 3L12 5L16 3L18 6L12 8L6 6Z" fill="none" stroke="currentColor" strokeWidth="1.5"/><circle cx="12" cy="10" r="3" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M12 13C8 13 5 16 5 20V21H19V20C19 16 16 13 12 13Z" fill="none" stroke="currentColor" strokeWidth="1.5"/></>,
  puzzle: <><path d="M5 5H11V8.5C11 9.5 12 10 13 9.5C14 9 15 9.5 15 10.8C15 12 14 12.5 13 12C12 11.5 11 12 11 13V17H5V11C4 11 3 10 3.5 9C4 8 3.5 7 2.5 7C1.5 7 1 8 1.5 9C2 10 1.5 11 0.5 11V5H5Z" fill="none" stroke="currentColor" strokeWidth="1.4"/></>,
  racing: <><circle cx="7" cy="17" r="2.5" fill="currentColor"/><circle cx="17" cy="17" r="2.5" fill="currentColor"/><path d="M5 17L6 9H18L19 17M9 9L11 4H13L15 9" fill="none" stroke="currentColor" strokeWidth="1.6"/></>,
  restaurant: <><path d="M18 3V8C18 10.2 16.2 12 14 12H13V21H11V12H10C7.8 12 6 10.2 6 8V3" stroke="currentColor" strokeWidth="1.5" fill="none"/><path d="M9 3V8M12 3V8M15 3V8" stroke="currentColor" strokeWidth="1.3"/></>,
  retro: <><rect x="3" y="5" width="18" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M8 21H16M12 17V21" stroke="currentColor" strokeWidth="1.5"/><circle cx="9" cy="11" r="2" fill="none" stroke="currentColor" strokeWidth="1.3"/><path d="M14 9H17M14 11H17M14 13H16" stroke="currentColor" strokeWidth="1.2"/></>,
  robots: <><rect x="8" y="6" width="8" height="8" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5"/><circle cx="10" cy="9" r="1" fill="currentColor"/><circle cx="14" cy="9" r="1" fill="currentColor"/><path d="M10 12H14" stroke="currentColor" strokeWidth="1.2"/><path d="M12 6V4M10 4H14" stroke="currentColor" strokeWidth="1.4"/><path d="M8 14L6 17H18L16 14" stroke="currentColor" strokeWidth="1.4"/><path d="M9 17V20M15 17V20" stroke="currentColor" strokeWidth="1.4"/></>,
  rpg: <><path d="M12 3L14 7H18L15 10L16.5 14L12 11.5L7.5 14L9 10L6 7H10L12 3Z" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M9 15L6 21M15 15L18 21M9 21H15" stroke="currentColor" strokeWidth="1.4"/></>,
  runner: <><circle cx="15" cy="4" r="2.5" fill="currentColor"/><path d="M13 7L10 12L13 14L11 20M10 12L7 10" stroke="currentColor" strokeWidth="1.5" fill="none"/><path d="M11 20L9 23M11 20L14 22" stroke="currentColor" strokeWidth="1.4"/></>,
  scary: <><path d="M12 2L14.5 8H21L16 12.5L18 19L12 15L6 19L8 12.5L3 8H9.5L12 2Z" fill="none" stroke="currentColor" strokeWidth="1.5"/></>,
  scrabble: <><rect x="3" y="3" width="7" height="7" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5"/><rect x="14" y="3" width="7" height="7" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5"/><rect x="3" y="14" width="7" height="7" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5"/><rect x="14" y="14" width="7" height="7" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M5.5 5.5L8.5 8.5M15.5 5L18.5 8M5 15L8 18M16 15L19 18" stroke="currentColor" strokeWidth="1.3"/></>,
  sharks: <><path d="M3 14C3 14 5 10 9 10L12 6L15 10C19 10 21 14 21 14L17 15L15 20H9L7 15L3 14Z" fill="none" stroke="currentColor" strokeWidth="1.4"/><circle cx="10" cy="13" r="1" fill="currentColor"/></>,
  shooter: <><circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="1.6"/><circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1.4"/><path d="M12 2V5M12 19V22M2 12H5M19 12H22" stroke="currentColor" strokeWidth="1.6"/></>,
  simulation: <><rect x="4" y="7" width="16" height="11" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.6"/><path d="M8 7V4H16V7" fill="none" stroke="currentColor" strokeWidth="1.6"/><path d="M4 11H20M9 14H15" stroke="currentColor" strokeWidth="1"/></>,
  skateboard: <><path d="M4 15H20C20 15 19 17 16 17H8C5 17 4 15 4 15Z" fill="none" stroke="currentColor" strokeWidth="1.5"/><circle cx="8" cy="18" r="1.5" fill="none" stroke="currentColor" strokeWidth="1.3"/><circle cx="16" cy="18" r="1.5" fill="none" stroke="currentColor" strokeWidth="1.3"/><path d="M14 15L12 9L9 13" stroke="currentColor" strokeWidth="1.5" fill="none"/><circle cx="12" cy="7" r="2" fill="none" stroke="currentColor" strokeWidth="1.3"/></>,
  "skibidi-toilet": <><path d="M8 3H16C17 3 18 4 18 5V9C18 12 15 14 12 14C9 14 6 12 6 9V5C6 4 7 3 8 3Z" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M6 9H18" stroke="currentColor" strokeWidth="1.2"/><rect x="5" y="14" width="14" height="7" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5"/><circle cx="10" cy="7" r="1" fill="currentColor"/><circle cx="14" cy="7" r="1" fill="currentColor"/></>,
  skill: <><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M12 7V12L15 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/></>,
  snake: <><path d="M4 12C4 8 7 5 11 5C14 5 16 7 16 10C16 13 14 15 11 15C9 15 8 14 8 12C8 10 9 9 11 9C12 9 13 10 13 11" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round"/><path d="M13 11C13 13 14 15 16 16C18 17 20 16 20 14" stroke="currentColor" strokeWidth="1.5" fill="none"/><circle cx="8.5" cy="4.5" r="1" fill="currentColor"/></>,
  sniper: <><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.5"/><circle cx="12" cy="12" r="2" fill="currentColor"/><path d="M12 3V9M12 15V21M3 12H9M15 12H21" stroke="currentColor" strokeWidth="1.5"/><path d="M20 4L16 10" stroke="currentColor" strokeWidth="1.8"/></>,
  soccer: <><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M12 5L14.5 8L12 11L9.5 8L12 5Z" fill="currentColor"/><path d="M5 9L8 10.5V13.5L5 15" stroke="currentColor" strokeWidth="1.2" fill="none"/><path d="M19 9L16 10.5V13.5L19 15" stroke="currentColor" strokeWidth="1.2" fill="none"/><path d="M9.5 16L12 13L14.5 16L12 19L9.5 16Z" fill="currentColor" opacity="0.5"/></>,
  solitaire: <><rect x="4" y="3" width="7" height="9" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5"/><rect x="13" y="3" width="7" height="9" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5"/><rect x="4" y="14" width="7" height="7" rx="1" fill="currentColor" opacity="0.4" stroke="currentColor" strokeWidth="1.5"/><rect x="13" y="14" width="7" height="7" rx="1" fill="currentColor" stroke="currentColor" strokeWidth="1.5"/></>,
  spinner: <><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M12 12L18 8M12 12L6 8M12 12V19" stroke="currentColor" strokeWidth="1.5"/><circle cx="12" cy="12" r="2" fill="currentColor"/></>,
  sports: <><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.6"/><path d="M12 3C12 3 8 7 8 12C8 17 12 21 12 21" stroke="currentColor" strokeWidth="1.2"/><path d="M12 3C12 3 16 7 16 12C16 17 12 21 12 21" stroke="currentColor" strokeWidth="1.2"/><path d="M3 12H21" stroke="currentColor" strokeWidth="1.2"/></>,
  stickman: <><circle cx="12" cy="4" r="2" fill="currentColor"/><path d="M12 6V14M8 9L12 11L16 9M10 14L8 20M14 14L16 20" stroke="currentColor" strokeWidth="1.6" fill="none"/></>,
  strategy: <><rect x="3" y="13" width="5" height="8" fill="none" stroke="currentColor" strokeWidth="1.5"/><rect x="9.5" y="8" width="5" height="13" fill="none" stroke="currentColor" strokeWidth="1.5"/><rect x="16" y="3" width="5" height="18" fill="none" stroke="currentColor" strokeWidth="1.5"/></>,
  surgery: <><rect x="4" y="8" width="16" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M8 3V8M16 3V8" stroke="currentColor" strokeWidth="1.5"/><path d="M12 12V17M9.5 14.5H14.5" stroke="currentColor" strokeWidth="1.8"/></>,
  survival: <><path d="M12 3L4 8V16L12 21L20 16V8L12 3Z" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M12 3V21M4 8L20 16M20 8L4 16" stroke="currentColor" strokeWidth="1" opacity="0.5"/></>,
  sword: <><path d="M4 20L11 13M20 4L11 13" stroke="currentColor" strokeWidth="1.6"/><path d="M7 17L4 20L7 20V17ZM4 17H7" stroke="currentColor" strokeWidth="1.4"/><path d="M14 4H20V10" stroke="currentColor" strokeWidth="1.5" fill="none"/><path d="M9 15L7 17" stroke="currentColor" strokeWidth="1.4"/></>,
  tanks: <><rect x="5" y="9" width="14" height="8" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5"/><rect x="3" y="12" width="18" height="5" rx="1" fill="none" stroke="currentColor" strokeWidth="1.4"/><path d="M10 9L12 4H14L16 9" stroke="currentColor" strokeWidth="1.3"/><circle cx="8" cy="17" r="2" fill="none" stroke="currentColor" strokeWidth="1.2"/><circle cx="16" cy="17" r="2" fill="none" stroke="currentColor" strokeWidth="1.2"/></>,
  tap: <><path d="M12 3C12 3 15 5 15 9V13L17 14C17 14 19 16 17 18C15 20 12 20 12 20C12 20 9 20 7 18C5 16 7 14 7 14L9 13V9C9 5 12 3 12 3Z" fill="none" stroke="currentColor" strokeWidth="1.4"/><circle cx="12" cy="9" r="1.5" fill="currentColor"/></>,
  tetris: <><rect x="3" y="12" width="4" height="4" fill="currentColor"/><rect x="7" y="12" width="4" height="4" fill="currentColor"/><rect x="11" y="12" width="4" height="4" fill="currentColor"/><rect x="15" y="12" width="4" height="4" fill="currentColor"/><rect x="7" y="4" width="4" height="4" fill="currentColor" opacity="0.6"/><rect x="7" y="8" width="4" height="4" fill="currentColor" opacity="0.6"/><rect x="11" y="8" width="4" height="4" fill="currentColor" opacity="0.4"/><rect x="15" y="8" width="4" height="4" fill="currentColor" opacity="0.4"/><rect x="15" y="4" width="4" height="4" fill="currentColor" opacity="0.4"/></>,
  trivia: <><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M9.5 9C9.5 7.6 10.6 6.5 12 6.5C13.4 6.5 14.5 7.6 14.5 9C14.5 10.4 13 11 12 12V13" stroke="currentColor" strokeWidth="1.5" fill="none"/><circle cx="12" cy="16" r="1" fill="currentColor"/></>,
  truck: <><rect x="2" y="9" width="15" height="9" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M17 12H21L22 18H17V12Z" fill="none" stroke="currentColor" strokeWidth="1.5"/><circle cx="7" cy="19" r="2" fill="none" stroke="currentColor" strokeWidth="1.4"/><circle cx="17" cy="19" r="2" fill="none" stroke="currentColor" strokeWidth="1.4"/><path d="M2 13H17" stroke="currentColor" strokeWidth="1"/></>,
  "two-player": <><circle cx="8" cy="7" r="3" fill="none" stroke="currentColor" strokeWidth="1.5"/><circle cx="16" cy="7" r="3" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M2 21V18C2 15.8 4.7 14 8 14C11.3 14 14 15.8 14 18V21" stroke="currentColor" strokeWidth="1.5" fill="none"/><path d="M16 14C18 14 22 15.3 22 18V21" stroke="currentColor" strokeWidth="1.4" fill="none"/></>,
  tycoon: <><rect x="3" y="13" width="5" height="8" fill="currentColor" opacity="0.4"/><rect x="9.5" y="8" width="5" height="13" fill="currentColor" opacity="0.7"/><rect x="16" y="3" width="5" height="18" fill="currentColor"/><path d="M5 13L5 8L8 5" stroke="currentColor" strokeWidth="1.3" fill="none" opacity="0.6"/></>,
  war: <><path d="M12 3L14.5 8H21L16 12.5L18 19L12 15L6 19L8 12.5L3 8H9.5L12 3Z" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M9 12H15" stroke="currentColor" strokeWidth="1.3"/></>,
  word: <><rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M7 9H17M7 12H14M7 15H11" stroke="currentColor" strokeWidth="1.4"/></>,
  "world-cup": <><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M5 9H19M5 15H19" stroke="currentColor" strokeWidth="1"/><path d="M12 3V21" stroke="currentColor" strokeWidth="1"/><path d="M3 12C3 12 7 10 12 10C17 10 21 12 21 12" stroke="currentColor" strokeWidth="1" opacity="0.5"/></>,
  worm: <><path d="M4 18C4 14 6 12 8 12C10 12 10 14 12 14C14 14 14 12 16 12C18 12 20 14 20 18" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round"/><circle cx="6" cy="10" r="3" fill="none" stroke="currentColor" strokeWidth="1.4"/><circle cx="5.5" cy="9.5" r="0.8" fill="currentColor"/></>,
  wrestling: <><circle cx="8" cy="5" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.4"/><circle cx="16" cy="5" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.4"/><path d="M5 8L8 14L12 11L16 14L19 8" stroke="currentColor" strokeWidth="1.4" fill="none"/><path d="M8 14L7 20M16 14L17 20" stroke="currentColor" strokeWidth="1.4"/></>,
  zombie: <><circle cx="12" cy="7" r="4" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M8 7C8 7 7 5 9 4" stroke="currentColor" strokeWidth="1.2"/><path d="M5 22V17C5 14.2 8.1 12 12 12C15.9 12 19 14.2 19 17V22" stroke="currentColor" strokeWidth="1.5" fill="none"/><path d="M9 17H15M10 20H14" stroke="currentColor" strokeWidth="1.3"/><path d="M8 22L5 22" stroke="currentColor" strokeWidth="1.5"/></>,
};

  const defaultIcon = (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-7 h-7">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );

  const iconContent = icons[id];
  if (!iconContent) return defaultIcon;

  return (
    <svg viewBox="0 0 24 24" className="w-7 h-7">
      {iconContent}
    </svg>
  );
}

function formatCategoryName(id: string): string {
  return id
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default async function CategoriesPage() {
  let categories: string[] = [];
  try {
    categories = await fetchAllCategories();
  } catch {
    categories = [];
  }

  return (
    <main className="w-full min-h-screen text-black font-sans pb-12 relative overflow-hidden select-none bg-[#cfcfcf]">

      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-50px] left-[20%] w-[180px] h-[180px] rounded-full bg-black/20" />
        <div className="absolute top-[50px] left-[5%] w-[150px] h-[150px] rounded-full bg-black/15" />
        <div className="absolute top-[60px] right-[10%] w-[160px] h-[160px] rounded-full bg-black/10" />
        <div className="absolute bottom-[320px] left-[5%] w-[180px] h-[180px] rounded-full bg-black/15" />
        <div className="absolute bottom-[-30px] left-[12%] w-[190px] h-[190px] rounded-full bg-black/10" />
        <div className="absolute bottom-[-60px] right-[20%] w-[220px] h-[220px] rounded-full bg-black/20" />
      </div>

      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-3 sm:px-4 pt-[105px] sm:pt-[115px]">

        <div className="bg-white/60 backdrop-blur-2xl rounded-[24px] sm:rounded-[32px] border border-black/10 p-6 sm:p-10 shadow-sm mb-6">
          <span className="text-[9px] font-black uppercase tracking-[0.25em] text-black/40">
            LokaYantra Arcade Station
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-black uppercase tracking-tight mt-1 mb-3">
            All Game Categories
          </h1>
          <p className="text-xs sm:text-sm text-black/60 font-semibold leading-relaxed max-w-3xl">
            At LokaYantra we organize thousands of free browser games into clear, easy-to-browse categories.
            Whether you&apos;re after heart-pounding action, brain-teasing puzzles, high-speed racing, or relaxing
            simulation games — every category links to a curated collection of HTML5 games that load instantly,
            no downloads, no installs.
          </p>
          <p className="text-[10px] font-bold text-black/40 mt-3">{categories.length} categories available</p>
        </div>

        {categories.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
            {categories.map((catId) => (
              <Link
                key={catId}
                href={`/category/${catId}`}
                className="group flex items-center gap-3 p-3.5 sm:p-4 rounded-[16px] border border-black/10 bg-white/50 hover:bg-white/80 hover:border-black/20 hover:-translate-y-0.5 shadow-[0_4px_10px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.12)] transition-all duration-200"
              >
                <div className="shrink-0 w-10 h-10 rounded-xl bg-black/5 group-hover:bg-black group-hover:text-white text-black/70 flex items-center justify-center transition-colors duration-200">
                  <CategorySVG id={catId} />
                </div>
                <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wide text-black/80 group-hover:text-black leading-tight">
                  {formatCategoryName(catId)} Games
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center font-bold py-20 bg-white/20 rounded-[24px] border border-black/10 uppercase tracking-wider text-xs">
            Categories loading failed. Please try again later.
          </div>
        )}

        <div className="mt-8">
          <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-black/50 hover:text-black transition-colors">
            ← Back to All Games
          </Link>
        </div>
      </div>
    </main>
  );
}