interface IRGB {
  r: number;
  g: number;
  b: number;
}

export function HEX2RGB(hex: string): IRGB | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      }
    : null;
}

enum TextColors {
  black = "black",
  white = "white"
}
type TextColor = typeof TextColors.black | typeof TextColors.white;

interface NNColor {
  black: number;
}

// faster, but less costumizable
// export const textColorYIQ = (bgColor: IRGB | null): TextColor => {
//   if (!bgColor) {
//     return TextColors.black;
//   }
//   const { r, g, b } = bgColor;
//   const yiq = (r * 299 + g * 387 + b * 114) / 1000;
//   return yiq >= 128 ? TextColors.black : TextColors.white;
// };

const normalizeRGB = (color: IRGB): IRGB => {
  const { r, g, b } = color;
  return { r: r / 255, g: g / 255, b: b / 255 };
};

export const textColor = (bgColor: IRGB | null): TextColor => {
  if (!bgColor) {
    return TextColors.black;
  }

  const { black } = runNetwork(normalizeRGB(bgColor));

  if (black > 0.5) {
    return TextColors.black;
  }
  return TextColors.white;
};

// trained using https://brain.js.org/
export const runNetwork = (input: IRGB): NNColor => {
  return {
    black:
      1 /
      (1 +
        1 /
          Math.exp(
            -0.31647059321403503 -
              3.0159261226654053 *
                (1 /
                  (1 +
                    1 /
                      Math.exp(
                        1.0220708847045898 +
                          0.06390412896871567 * input["r"] -
                          2.3412184715270996 * input["g"] -
                          1.192130208015442 * input["b"]
                      ))) -
              7.755749702453613 *
                (1 /
                  (1 +
                    1 /
                      Math.exp(
                        3.444154977798462 +
                          0.7144421935081482 * input["r"] -
                          5.918922424316406 * input["g"] -
                          3.111375570297241 * input["b"]
                      ))) +
              9.531070709228516 *
                (1 /
                  (1 +
                    1 /
                      Math.exp(
                        -4.350701332092285 -
                          0.8096131682395935 * input["r"] +
                          7.283044815063477 * input["g"] +
                          3.8312060832977295 * input["b"]
                      )))
          ))
  };
};
