// shared column sizes (px)
export const AREA_WIDTH = 190;
// ROLE_WIDTH chosen so TOTAL_TABLE_WIDTH = 1200
// 1200 = AREA_WIDTH + ROLE_WIDTH * 3 + COMPLETED_WIDTH
// => ROLE_WIDTH = (1200 - AREA_WIDTH - COMPLETED_WIDTH) / 3
export const ROLE_WIDTH = 260;
export const COMPLETED_WIDTH = 230;

export const HEADER_HEIGHT = 46; // for reference
export const ROW_HEIGHT = 61;

export const TOTAL_TABLE_WIDTH = AREA_WIDTH + ROLE_WIDTH * 3 + COMPLETED_WIDTH; // adjust if 4 roles

export default {
  AREA_WIDTH,
  ROLE_WIDTH,
  COMPLETED_WIDTH,
  HEADER_HEIGHT,
  ROW_HEIGHT,
  TOTAL_TABLE_WIDTH,
};
