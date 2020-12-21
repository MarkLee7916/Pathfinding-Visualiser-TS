const isWidescreen = window.matchMedia("(min-width: 992px)");

export const HEIGHT = isWidescreen.matches ? 20 : 40;
export const WIDTH = isWidescreen.matches  ? 40 : 20;
export type Coord = [number, number];