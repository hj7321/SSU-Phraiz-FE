export type SuccessResponseData = {
  success: boolean;
  message: string;
};

export type Message = {
  message: string;
};

export type ServiceCode = "paraphrase" | "summary" | "cite";

export type Service = {
  service: ServiceCode;
};

// 공통 페이징 정렬 정보 타입
export type SortInfo = {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
};

// 공통 페이징 정보 타입
export type Pageable = {
  pageNumber: number;
  pageSize: number;
  offset: number;
  paged: boolean;
  unpaged: boolean;
  sort: SortInfo;
};

// 공통 API 응답 구조
export type ApiResponse<T> = {
  content: T[];
  pageable: Pageable;
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  sort: SortInfo;
  numberOfElements: number;
  first: boolean;
  empty: boolean;
};
