export type Settings = {
  nameFirst: string;
  nameSecond: string;
  weddingDate: string;
  ceremonyTime: string;
  venue: string;
  venueMapUrl: string;
  totalBudget: number;
};

export type Task = { id: string; text: string; pic: string; date: string; done: boolean };
export type RundownItem = { id: string; time: string; activity: string; note: string; pic: string };
export type Arrival = {
  id: string; group: string; from: string; date: string; time: string;
  transport: string; count: string; note: string;
};
export type Lodging = {
  id: string; name: string; address: string; phone: string; rooms: string;
  forGroup: string; mapUrl: string; note: string;
};
export type RouteItem = { id: string; from: string; to: string; mode: string; duration: string; mapUrl: string; note: string };
export type Vendor = { id: string; category: string; name: string; phone: string };
export type BudgetItem = { id: string; pos: string; low: number; high: number; note: string };
export type Expense = { id: string; item: string; category: string; amount: number; date: string; paid: boolean; note: string };
/** a single timestamped step in the /persiapan/itinerary schedule
 * (e.g. "12:00 — Berangkat dari Surabaya") — a flat, ad-hoc travel log,
 * separate from the structured arrivals/lodging/routes on the main
 * /persiapan dashboard. */
export type ItineraryStep = { id: string; date: string; time: string; activity: string; note: string };

export type ProgressData = {
  settings: Settings;
  tasks: Task[];
  rundown: RundownItem[];
  arrivals: Arrival[];
  lodging: Lodging[];
  routes: RouteItem[];
  vendors: Vendor[];
  budgetItems: BudgetItem[];
  expenses: Expense[];
  familyItinerary: ItineraryStep[];
};

/** the array-valued keys of ProgressData — what the generic row helpers operate on */
export type ListKey = {
  [K in keyof ProgressData]: ProgressData[K] extends unknown[] ? K : never;
}[keyof ProgressData];

export type CalendarEvent = { label: string; color: string; done?: boolean };
