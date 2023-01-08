/** Default priorities */
export enum Priorities {
  /** The lowest priority */
  lowest = 1,

  /** Middle-tier priority */
  middle = 100,

  /** High level priority */
  high = 1000,
}

/** Piority type */
export type Priority = Priorities | number;
