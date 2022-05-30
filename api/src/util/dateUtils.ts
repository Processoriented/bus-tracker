


export const CTA_TS_PATT = /(\d{4})(\d{2})(\d{2}) (\d{2}):(\d{2})/;

export const ctaTsToDate = (ctaTs: string): string => {
  const pattTest = CTA_TS_PATT.test(ctaTs);
  if (!pattTest) return new Date(1989, 8, 30, 1, 11).toISOString();
  const separated = ctaTs.replace(CTA_TS_PATT, '$1,$2,$3,$4,$5');
  const asNums = [...(separated.split(',')), ...(Array(5).fill('0'))]
    .map(parseInt).map((x, i) => i === 1 ? x - 1 : x).slice(0, 5);
  const [y, m, d, hh, mm] = asNums;
  const asDate = new Date(y, m, d, hh, mm);
  return asDate.toISOString();
};
