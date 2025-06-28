export interface Flashcard {
  question: string;
  answer: string;
}

export enum AppState {
  IDLE,
  PROCESSING,
  SHOWING_CARDS,
  ERROR,
}
