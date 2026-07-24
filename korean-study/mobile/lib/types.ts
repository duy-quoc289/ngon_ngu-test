// Lesson + Vocab data contracts (khớp với data/*.json)

/* ─── Topic / Lesson ─── */

export type LessonType = "explainer" | "tile-grid" | "comparison" | "exercise" | "rule" | "grammar";

export interface BaseLesson {
  id: string;
  title: string;
  icon?: string;
  hint?: string;
  type: LessonType;
}

/* explainer */
export interface ExplainerIntroBlock {
  kind: "intro";
  text: string;
}

export interface DiagramExample {
  parts: string[];
  result: string;
  romanization?: string;
}

export interface ExplainerDiagramBlock {
  kind: "diagram";
  title: string;
  examples: DiagramExample[];
}

export interface RuleItem {
  label: string;
  chars?: string[];
  rule: string;
  examples?: string[];
}

export interface ExplainerRulesBlock {
  kind: "rules";
  title: string;
  items: RuleItem[];
}

export type ExplainerBlock =
  | ExplainerIntroBlock
  | ExplainerDiagramBlock
  | ExplainerRulesBlock;

export interface ExplainerLesson extends BaseLesson {
  type: "explainer";
  blocks: ExplainerBlock[];
}

/* tile-grid */
export interface Tile {
  char: string;
  rom?: string;
  vi?: string;
  syllable?: string;
  audio?: string;
  made?: string;
}

export interface TileGridLesson extends BaseLesson {
  type: "tile-grid";
  tiles: Tile[];
}

/* comparison */
export type ComparisonColor = "blue" | "rose" | "amber" | "violet" | "emerald" | "slate";

export interface ComparisonItem {
  char: string;
  syllable?: string;
  audio?: string;
}

export interface ComparisonGroup {
  name: string;
  color: ComparisonColor;
  description: string;
  items: ComparisonItem[];
}

export interface ComparisonLesson extends BaseLesson {
  type: "comparison";
  groups: ComparisonGroup[];
}

/* exercise */
export interface ExerciseItem {
  ko: string;
  rom?: string;
  vi?: string;
  audio?: string;
}

export interface ExerciseLesson extends BaseLesson {
  type: "exercise";
  items: ExerciseItem[];
}

/* rule */
export interface RuleDiagram {
  before: string;
  after?: string;
  result?: string;
}

export interface RuleExample {
  written: string;
  read?: string;
  rom?: string;
  vi?: string;
  audio?: string;
}

export interface RuleLesson extends BaseLesson {
  type: "rule";
  formula?: string;
  explanation?: string;
  diagram?: RuleDiagram;
  examples?: RuleExample[];
}

/* grammar */
export interface GrammarExample {
  ko: string;
  rom: string;
  vi: string;
  audio?: string;
  highlight?: string;
}

export type GrammarExerciseType = "fill-blank" | "choice";

export interface GrammarExercise {
  type: GrammarExerciseType;
  question: string;
  answer: string | string[];
  options?: string[];
  hint?: string;
}

export interface ConjugationTable {
  headers: string[];
  rows: { verb: string; forms: string[] }[];
}

export interface GrammarRule {
  label: string;
  rule: string;
  examples?: string[];
}

export interface GrammarLesson extends BaseLesson {
  type: "grammar";
  formula: string;
  meaning: string;
  conjugation?: ConjugationTable;
  rules: GrammarRule[];
  examples: GrammarExample[];
  exercise?: GrammarExercise[];
}

export type Lesson =
  | ExplainerLesson
  | TileGridLesson
  | ComparisonLesson
  | ExerciseLesson
  | RuleLesson
  | GrammarLesson;

export interface Topic {
  topic: string;
  title: string;
  titleKo?: string;
  subtitle: string;
  intro: string;
  lessons: Lesson[];
}

/* ─── Vocab ─── */

export interface VocabExample {
  ko: string;
  rom?: string;
  vi: string;
}

export interface VocabWord {
  ko: string;
  rom: string;
  vi: string;
  viExtra?: string;
  tags?: string[];
  audio: string;
  example?: VocabExample;
  note?: string;
}

export interface VocabCategory {
  id: string;
  title: string;
  icon: string;
  color: ComparisonColor;
  description: string;
  words: VocabWord[];
}

export interface VocabData {
  topic: "vocab";
  title: string;
  titleKo: string;
  subtitle: string;
  intro: string;
  categories: VocabCategory[];
}

export type FlatVocabWord = VocabWord & { _catId: string };
