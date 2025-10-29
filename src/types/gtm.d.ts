export {}; // 이 파일을 모듈로 만듦

declare global {
  type DataLayerEvent = {
    event: string; // 'pageview' 등
    [key: string]: unknown; // 추가 필드 허용
  };

  interface Window {
    dataLayer: DataLayerEvent[]; // 전역 큐
  }
}
