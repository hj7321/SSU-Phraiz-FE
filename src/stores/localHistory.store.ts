import { create } from "zustand";

export interface LocalHistoryItem {
  id: number;
  content: string;
  inputText: string;
  mode: string;
  timestamp: Date;
  type: "paraphrase" | "summarize";
}

interface LocalHistoryState {
  // Box별로 분리된 히스토리
  summarizeHistories: LocalHistoryItem[];
  paraphraseHistories: LocalHistoryItem[];

  summarizeIndex: number;
  paraphraseIndex: number;

  maxHistories: number;

  // 요약 히스토리 액션
  addSummarizeHistory: (item: Omit<LocalHistoryItem, "id" | "timestamp" | "type">) => void;
  goToPreviousSummarize: () => void;
  goToNextSummarize: () => void;
  canGoBackSummarize: () => boolean;
  canGoForwardSummarize: () => boolean;
  getCurrentSummarize: () => LocalHistoryItem | null;
  clearSummarizeHistories: () => void;

  // 패러프레이징 히스토리 액션
  addParaphraseHistory: (item: Omit<LocalHistoryItem, "id" | "timestamp" | "type">) => void;
  goToPreviousParaphrase: () => void;
  goToNextParaphrase: () => void;
  canGoBackParaphrase: () => boolean;
  canGoForwardParaphrase: () => boolean;
  getCurrentParaphrase: () => LocalHistoryItem | null;
  clearParaphraseHistories: () => void;
}

export const useLocalHistory = create<LocalHistoryState>((set, get) => ({
  summarizeHistories: [],
  paraphraseHistories: [],
  summarizeIndex: -1,
  paraphraseIndex: -1,
  maxHistories: 10,

  // 요약 히스토리 관리
  addSummarizeHistory: (item) =>
    set((state) => {
      const histories = [...state.summarizeHistories];

      // 현재 인덱스 이후 제거
      if (state.summarizeIndex < histories.length - 1) {
        histories.splice(state.summarizeIndex + 1);
      }

      // 새 항목 추가
      const newItem: LocalHistoryItem = {
        ...item,
        id: Date.now(),
        timestamp: new Date(),
        type: "summarize"
      };
      histories.push(newItem);

      // 10개 초과시 제거
      if (histories.length > state.maxHistories) {
        histories.shift();
      }

      return {
        summarizeHistories: histories,
        summarizeIndex: histories.length - 1
      };
    }),

  goToPreviousSummarize: () =>
    set((state) => ({
      summarizeIndex: Math.max(0, state.summarizeIndex - 1)
    })),

  goToNextSummarize: () =>
    set((state) => ({
      summarizeIndex: Math.min(state.summarizeHistories.length - 1, state.summarizeIndex + 1)
    })),

  canGoBackSummarize: () => {
    const state = get();
    return state.summarizeIndex > 0;
  },

  canGoForwardSummarize: () => {
    const state = get();
    return state.summarizeIndex < state.summarizeHistories.length - 1;
  },

  getCurrentSummarize: () => {
    const state = get();
    return state.summarizeHistories[state.summarizeIndex] || null;
  },

  clearSummarizeHistories: () =>
    set({
      summarizeHistories: [],
      summarizeIndex: -1
    }),

  // 패러프레이징 히스토리 관리 (동일 패턴)
  addParaphraseHistory: (item) =>
    set((state) => {
      const histories = [...state.paraphraseHistories];

      if (state.paraphraseIndex < histories.length - 1) {
        histories.splice(state.paraphraseIndex + 1);
      }

      const newItem: LocalHistoryItem = {
        ...item,
        id: Date.now(),
        timestamp: new Date(),
        type: "paraphrase"
      };
      histories.push(newItem);

      if (histories.length > state.maxHistories) {
        histories.shift();
      }

      return {
        paraphraseHistories: histories,
        paraphraseIndex: histories.length - 1
      };
    }),

  goToPreviousParaphrase: () =>
    set((state) => ({
      paraphraseIndex: Math.max(0, state.paraphraseIndex - 1)
    })),

  goToNextParaphrase: () =>
    set((state) => ({
      paraphraseIndex: Math.min(state.paraphraseHistories.length - 1, state.paraphraseIndex + 1)
    })),

  canGoBackParaphrase: () => {
    const state = get();
    return state.paraphraseIndex > 0;
  },

  canGoForwardParaphrase: () => {
    const state = get();
    return state.paraphraseIndex < state.paraphraseHistories.length - 1;
  },

  getCurrentParaphrase: () => {
    const state = get();
    return state.paraphraseHistories[state.paraphraseIndex] || null;
  },

  clearParaphraseHistories: () =>
    set({
      paraphraseHistories: [],
      paraphraseIndex: -1
    }),
  // 히스토리 제한 체크 메서드
  isHistoryFullSummarize: () => {
    const state = get();
    return state.summarizeHistories.length >= state.maxHistories;
  },

  isHistoryFullParaphrase: () => {
    const state = get();
    return state.paraphraseHistories.length >= state.maxHistories;
  },

  // 새 대화 시작 (히스토리 초기화)
  startNewSummarizeConversation: () =>
    set({
      summarizeHistories: [],
      summarizeIndex: -1
    }),

  startNewParaphraseConversation: () =>
    set({
      paraphraseHistories: [],
      paraphraseIndex: -1
    })
}));
