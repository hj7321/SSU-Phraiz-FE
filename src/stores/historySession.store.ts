import { ServiceCode } from "@/types/common.type";
import { create } from "zustand";

interface OneSession {
  currentSessionId: number | null;
  itemCount: number;
}

interface HistorySessionState {
  sessions: Record<ServiceCode, OneSession>;
  getSession: (k: ServiceCode) => OneSession;
  canAppendHistory: (k: ServiceCode) => boolean;
  appendOneHistory: (k: ServiceCode) => void;
  startNewSession: (k: ServiceCode, sessionId: number) => void;
  resetSession: (k: ServiceCode) => void;
  resetAll: () => void;
}

const empty: OneSession = { currentSessionId: null, itemCount: 0 };

export const useHistorySessionStore = create<HistorySessionState>()(
  (set, get) => ({
    sessions: {
      paraphrase: { ...empty },
      summary: { ...empty },
      cite: { ...empty },
    },
    getSession: (k) => get().sessions[k],
    canAppendHistory: (k) => {
      const session = get().sessions[k];
      return Boolean(session.currentSessionId) && session.itemCount < 10;
    },
    appendOneHistory: (k) =>
      set((state) => {
        const current = state.sessions[k];
        return {
          sessions: {
            ...state.sessions,
            [k]: { ...current, itemCount: current.itemCount + 1 },
          },
        };
      }),
    startNewSession: (k, sessionId) =>
      set((state) => ({
        sessions: {
          ...state.sessions,
          [k]: { currentSessionId: sessionId, itemCount: 1 },
        },
      })),
    resetSession: (k) =>
      set((state) => ({
        sessions: { ...state.sessions, [k]: { ...empty } },
      })),
    resetAll: () =>
      set({
        sessions: {
          paraphrase: { ...empty },
          summary: { ...empty },
          cite: { ...empty },
        },
      }),
  })
);
