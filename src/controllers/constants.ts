const isWidescreen = window.matchMedia("(min-width: 600px)");

export const HEIGHT = isWidescreen ? 20 : 40;
export const WIDTH = isWidescreen ? 40 : 20;
export type Coord = [number, number];