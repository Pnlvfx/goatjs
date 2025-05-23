/* eslint-disable unicorn/number-literal-case */
/* eslint-disable unicorn/prefer-code-point */

// Truncate string by size in bytes
export const truncate = (string: string, byteLength: number) => {
  const charLength = string.length;
  let curByteLength = 0;
  let codePoint: number;
  let segment: string | undefined;

  for (let i = 0; i < charLength; i += 1) {
    codePoint = string.charCodeAt(i);
    /** @ts-expect-error Skip this shit for now. */
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    segment += string[i];

    if (isHighSurrogate(codePoint) && isLowSurrogate(string.charCodeAt(i + 1))) {
      // eslint-disable-next-line sonarjs/updated-loop-counter
      i += 1;
      /** @ts-expect-error Skip this shit for now. */
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      segment += string[i];
    }

    if (segment) {
      curByteLength += Buffer.byteLength(segment);
    }

    if (curByteLength === byteLength) {
      return string.slice(0, i + 1);
    } else if (segment && curByteLength > byteLength) {
      return string.slice(0, i - segment.length + 1);
    }
  }

  return string;
};

const isHighSurrogate = (codePoint: number) => {
  return codePoint >= 0xd8_00 && codePoint <= 0xdb_ff;
};

const isLowSurrogate = (codePoint: number) => {
  return codePoint >= 0xdc_00 && codePoint <= 0xdf_ff;
};
