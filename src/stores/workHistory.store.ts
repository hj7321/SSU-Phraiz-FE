import { create } from "zustand";

interface WorkHistoryState {
  // 요약 작업
  currentSummarizeHistoryId: number | null;
  currentSummarizeSequence: number;
  // 변환 작업
  currentParaphraseHistoryId: number | null;
  currentParaphraseSequence: number;
  // 인용 작업
  currentCiteHistoryId: number | null;
  currentCiteSequence: number;

  // 요약 액션
  updateSummarizeWork: (historyId: number, sequenceNumber: number) => void;
  canSummarizeMore: () => boolean;
  resetSummarizeWork: () => void;
  // 변환 액션
  updateParaphraseWork: (historyId: number, sequenceNumber: number) => void;
  canParaphraseMore: () => boolean;
  resetParaphraseWork: () => void;
  // 인용 액션
  updateCiteWork: (historyId: number, sequenceNumber: number) => void;
  canCiteMore: () => boolean;
  resetCiteWork: () => void;
}

export const useWorkHistory = create<WorkHistoryState>((set, get) => ({
  // 초기값
  currentSummarizeHistoryId: null,
  currentSummarizeSequence: 0,
  currentParaphraseHistoryId: null,
  currentParaphraseSequence: 0,
  currentCiteHistoryId: null,
  currentCiteSequence: 0,

  // 요약 작업 업데이트 (API 응답 후 호출)
  updateSummarizeWork: (historyId, sequenceNumber) => {
    set({
      currentSummarizeHistoryId: historyId,
      currentSummarizeSequence: sequenceNumber,
    });
  },
  // 요약 가능 여부 체크 (10개 미만인지)
  canSummarizeMore: () => {
    const state = get();
    // currentSummarizeHistoryId가 없으면 첫 요약 → 가능
    // 있으면 sequenceNumber < 10인지 체크
    return (
      state.currentSummarizeHistoryId === null ||
      state.currentSummarizeSequence < 10
    );
  },
  // 요약 작업 초기화 (새 대화 시작)
  resetSummarizeWork: () => {
    set({
      currentSummarizeHistoryId: null,
      currentSummarizeSequence: 0,
    });
  },

  // 변환도 동일
  updateParaphraseWork: (historyId, sequenceNumber) => {
    set({
      currentParaphraseHistoryId: historyId,
      currentParaphraseSequence: sequenceNumber,
    });
  },
  canParaphraseMore: () => {
    const state = get();
    return (
      state.currentParaphraseHistoryId === null ||
      state.currentParaphraseSequence < 10
    );
  },
  resetParaphraseWork: () => {
    set({
      currentParaphraseHistoryId: null,
      currentParaphraseSequence: 0,
    });
  },
  updateCiteWork: (historyId, sequenceNumber) => {
    set({
      currentCiteHistoryId: historyId,
      currentCiteSequence: sequenceNumber,
    });
  },
  canCiteMore: () => {
    const state = get();
    return (
      state.currentCiteHistoryId === null || state.currentCiteSequence < 10
    );
  },
  resetCiteWork: () => {
    set({
      currentCiteHistoryId: null,
      currentCiteSequence: 0,
    });
  },
}));
