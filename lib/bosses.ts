import { DEFAULT_RESPAWN_MINUTES, WEEKLY_RESPAWN_MINUTES } from "./config";
import { weeklyBossImageUrl } from "./genshin-api";
import type { Boss, BossType, Region } from "./types";

/** Regions in display order. Add future regions here (e.g. Nod-Krai). */
export const ALL_REGIONS: Region[] = [
  "Mondstadt",
  "Liyue",
  "Inazuma",
  "Sumeru",
  "Fontaine",
  "Natlan",
];

interface CuratedBoss {
  id: string;
  name: string;
  region: Region;
  element?: string;
  type?: BossType;
}

/**
 * Curated local dataset.
 *
 * genshin.jmp.blue does not expose normal overworld bosses (Hypostases,
 * Oceanid, Regisvines, ...), so their names/regions/elements are maintained
 * here. Weekly bosses exist in the API: their names and artwork are upgraded
 * from the API at runtime, while region/element metadata stays curated.
 */
const CURATED_BOSSES: CuratedBoss[] = [
  // Mondstadt
  { id: "anemo-hypostasis", name: "Anemo Hypostasis", region: "Mondstadt", element: "Anemo" },
  { id: "electro-hypostasis", name: "Electro Hypostasis", region: "Mondstadt", element: "Electro" },
  { id: "cryo-hypostasis", name: "Cryo Hypostasis", region: "Mondstadt", element: "Cryo" },
  // Liyue
  { id: "geo-hypostasis", name: "Geo Hypostasis", region: "Liyue", element: "Geo" },
  { id: "oceanid", name: "Oceanid", region: "Liyue", element: "Hydro" },
  { id: "primo-geovishap", name: "Primo Geovishap", region: "Liyue", element: "Geo" },
  { id: "pyro-regisvine", name: "Pyro Regisvine", region: "Liyue", element: "Pyro" },
  { id: "cryo-regisvine", name: "Cryo Regisvine", region: "Liyue", element: "Cryo" },
  // Inazuma
  { id: "pyro-hypostasis", name: "Pyro Hypostasis", region: "Inazuma", element: "Pyro" },
  { id: "hydro-hypostasis", name: "Hydro Hypostasis", region: "Inazuma", element: "Hydro" },
  { id: "maguu-kenki", name: "Maguu Kenki", region: "Inazuma" },
  { id: "perpetual-mechanical-array", name: "Perpetual Mechanical Array", region: "Inazuma" },
  { id: "thunder-manifestation", name: "Thunder Manifestation", region: "Inazuma", element: "Electro" },
  { id: "golden-wolflord", name: "Golden Wolflord", region: "Inazuma", element: "Geo" },
  // Sumeru
  { id: "jadeplume-terrorshroom", name: "Jadeplume Terrorshroom", region: "Sumeru", element: "Dendro" },
  { id: "aeonblight-drake", name: "Aeonblight Drake", region: "Sumeru" },
  { id: "setekh-wenut", name: "Setekh Wenut", region: "Sumeru" },
  { id: "algorithm-matrix-overseer-network", name: "Algorithm of Semi-Intransient Matrix of Overseer Network", region: "Sumeru" },
  // Fontaine
  { id: "hydro-tulpa", name: "Hydro Tulpa", region: "Fontaine", element: "Hydro" },
  { id: "icewind-suite", name: "Icewind Suite", region: "Fontaine" },
  { id: "experimental-field-generator", name: "Experimental Field Generator", region: "Fontaine" },
  { id: "emperor-of-fire-and-iron", name: "Emperor of Fire and Iron", region: "Fontaine", element: "Pyro" },
  // Natlan
  { id: "goldflame-qucusaur-tyrant", name: "Goldflame Qucusaur Tyrant", region: "Natlan", element: "Pyro" },
  { id: "gluttonous-yumkasaur-mountain-king", name: "Gluttonous Yumkasaur Mountain King", region: "Natlan" },
  { id: "secret-source-automaton-configuration-device", name: "Secret Source Automaton: Configuration Device", region: "Natlan" },
  // Weekly bosses (API-backed at runtime; metadata curated here)
  { id: "stormterror", name: "Stormterror", region: "Mondstadt", element: "Anemo", type: "Weekly Boss" },
  { id: "lupus-boreas", name: "Lupus Boreas", region: "Mondstadt", element: "Cryo", type: "Weekly Boss" },
  { id: "azhdaha", name: "Azhdaha", region: "Liyue", element: "Geo", type: "Weekly Boss" },
  { id: "childe", name: "Childe", region: "Liyue", element: "Hydro", type: "Weekly Boss" },
  { id: "la-signora", name: "La Signora", region: "Inazuma", element: "Pyro", type: "Weekly Boss" },
  { id: "magatsu-mitake-narukami-no-mikoto", name: "Magatsu Mitama Narukami no Mikoto", region: "Inazuma", element: "Electro", type: "Weekly Boss" },
  { id: "everlasting-lord-of-arcane-wisdom", name: "Everlasting Lord of Arcane Wisdom", region: "Sumeru", element: "Electro", type: "Weekly Boss" },
  { id: "guardian-of-apep-s-oasis", name: "Guardian of Apep's Oasis", region: "Sumeru", element: "Dendro", type: "Weekly Boss" },
  { id: "all-devouring-narwhal", name: "All-Devouring Narwhal", region: "Fontaine", element: "Hydro", type: "Weekly Boss" },
  { id: "the-knave", name: "The Knave", region: "Fontaine", element: "Pyro", type: "Weekly Boss" },
];

export const LOCAL_BOSSES: Boss[] = CURATED_BOSSES.map((curated) => {
  const type: BossType = curated.type ?? "Normal Boss";
  const respawnMinutes =
    type === "Weekly Boss" ? WEEKLY_RESPAWN_MINUTES : DEFAULT_RESPAWN_MINUTES;
  return {
    id: curated.id,
    name: curated.name,
    region: curated.region,
    element: curated.element,
    type,
    respawnMinutes,
    image: type === "Weekly Boss" ? weeklyBossImageUrl(curated.id) : undefined,
    fallbackImage: `/bosses/${curated.id}.svg`,
    source: "local",
  };
});
