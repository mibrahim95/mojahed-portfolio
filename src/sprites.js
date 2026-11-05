// Sprite grids for <Pix>: one character per pixel, "." is clear. Colors live in styles.css (.px-<char>).

// Player One: beard, navy suit, coral tie (after the portrait). 12 x 16, facing right.
// k ink, s skin, w shirt, n suit, d suit shade, r tie
const HEAD = [
  "....kkkkk...",
  "...kkkkkkk..",
  "...kkkssssk.",
  "...kkssskss.",
  "...ksssssss.",
  "...kkksssk..",
  "....kkkkk...",
];
const BODY = [
  "...dnnwrnn..",
  "..ddnnwrnnn.",
  "..ddnnnrnnn.",
];
export const HERO_IDLE = [
  ...HEAD,
  ...BODY,
  "..dsnnnnnsn.",
  "...dnnnnnn..",
  "...dnn.nnn..",
  "...dnn.nnn..",
  "...dnn.nnn..",
  "..kkkk.kkkk.",
];
export const HERO_IDLE_2 = [
  "............",
  ...HEAD,
  ...BODY,
  "..dsnnnnnsn.",
  "...dnnnnnn..",
  "...dnn.nnn..",
  "...dnn.nnn..",
  "..kkkk.kkkk.",
];
export const HERO_WALK_A = [
  ...HEAD,
  ...BODY,
  "..snnnnnnn..",
  "...nnnnnnns.",
  "..dnn...nn..",
  ".dnn.....nn.",
  "kkk......kkk",
  "............",
];
export const HERO_WALK_B = [
  "............",
  ...HEAD,
  ...BODY,
  "...dsnnnnn..",
  "....dnnns...",
  ".....dnn....",
  ".....dnn....",
  "....kkkk....",
];
