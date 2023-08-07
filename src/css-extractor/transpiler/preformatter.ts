const hsSyntax = " css:";
const jsxSyntax = " css=";
const idLength = 7;
const taggedPadding = ` radipanId={""}`.length + idLength + 18;
let seqId = 10;

const genRandomId = (seqNum: number) =>
  Number(
    Math.random() +
      (((((((((seqNum / 2) * 3) / 5) * 7) / 11) * 13) / 17) * 23) / 29) * 31 +
      0.000000000101010101010101010101
  )
    .toString(35)
    .slice(-idLength)
    .toUpperCase();

export const preformat = (code: string, start: number = 0) => {
  seqId++;
  if (!code) if (start >= code.length) return code;
  // Tag with Radipan ID
  const foundHs = code.indexOf(hsSyntax, start);
  const foundJsx = code.indexOf(jsxSyntax, start);
  const found = foundHs || foundJsx;
  if (found <= 0) return code;
  const useJsx =
    (foundHs <= 0 && foundJsx > 0) ||
    (foundJsx > 0 && foundHs > 0 && foundJsx < foundHs);
  const radipanId = `${seqId}-${genRandomId(seqId)}`;
  const tagged =
    code.substring(0, found) +
    (useJsx ? ` radipanId={"${radipanId}"}` : ` radipanId: "${radipanId}",`) +
    code.substring(found);

  return preformat(tagged, found + taggedPadding);
};
