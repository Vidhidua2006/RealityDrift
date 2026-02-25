import { Entity, DriftEvent, DriftAnalysis, AILog, User } from './types';

const KEYS = {
  entities: 'rd_entities',
  events: 'rd_events',
  drifts: 'rd_drifts',
  logs: 'rd_logs',
  user: 'rd_user',
};

function get<T>(key: string, fallback: T): T {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch { return fallback; }
}

function set(key: string, val: unknown) {
  localStorage.setItem(key, JSON.stringify(val));
}

export const store = {
  // Entities
  getEntities: (): Entity[] => get(KEYS.entities, []),
  addEntity: (e: Entity) => { const all = store.getEntities(); all.push(e); set(KEYS.entities, all); },
  updateEntity: (id: string, updates: Partial<Entity>) => {
    const all = store.getEntities().map(e => e.id === id ? { ...e, ...updates, updatedAt: new Date().toISOString() } : e);
    set(KEYS.entities, all);
  },
  deleteEntity: (id: string) => { set(KEYS.entities, store.getEntities().filter(e => e.id !== id)); },

  // Events
  getEvents: (): DriftEvent[] => get(KEYS.events, []),
  addEvent: (e: DriftEvent) => { const all = store.getEvents(); all.unshift(e); set(KEYS.events, all); },

  // Drifts
  getDrifts: (): DriftAnalysis[] => get(KEYS.drifts, []),
  addDrift: (d: DriftAnalysis) => { const all = store.getDrifts(); all.unshift(d); set(KEYS.drifts, all); },

  // AI Logs
  getLogs: (): AILog[] => get(KEYS.logs, []),
  addLog: (l: AILog) => { const all = store.getLogs(); all.unshift(l); set(KEYS.logs, all); },

  // Auth
  getUser: (): User | null => get(KEYS.user, null),
  setUser: (u: User | null) => set(KEYS.user, u),
};
