const hsSyntax = " css:";
const jsxSyntax = " css={";
const idLength = 7;
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

const addRadipanId = (code: string) => {
  seqId++;
  const regex = /( css={| css:)/g; // Match for JSX and HS syntax
  const replacer = (match: string) => {
    const radipanId = `${seqId}-${genRandomId(seqId)}`;
    switch (match) {
      case jsxSyntax:
        return ` radipanId={"${radipanId}"}${match}`;
      case hsSyntax:
      default:
        return ` radipanId: "${radipanId}",${match}`;
    }
  };
  return code.replace(regex, replacer);
};

export const preformat = (code: string) => {
  return addRadipanId(code);
};
