import radipanConfig from "radipan/radipan.config";

interface RadipanConfig {
  include: string[];
  exclude: string[];
  includeNames: string[];
  excludeNames: string[];
  outdir: string;
  sourceTranspile: {
    enabled: boolean;
    extension: string;
  };
}

const config: RadipanConfig = {
  include: radipanConfig.include,
  exclude: radipanConfig.exclude,
  includeNames: radipanConfig.includeNames,
  excludeNames: radipanConfig.excludeNames,
  outdir: radipanConfig.outdir,
  sourceTranspile: radipanConfig.sourceTranspile,
};

export const include: string[] = radipanConfig.include;
export const exclude: string[] = radipanConfig.exclude;
export const includeNames: string[] = radipanConfig.includeNames;
export const excludeNames: string[] = radipanConfig.excludeNames;
export const outdir: string = radipanConfig.outdir;
export const sourceTranspile = radipanConfig.sourceTranspile;

export default config;
