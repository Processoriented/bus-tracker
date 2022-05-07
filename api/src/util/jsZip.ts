import { readFile } from 'fs';
import JSZip, { loadAsync } from 'jszip';
import { camelCase } from 'lodash';


const strPatt = /^"(.*?)"$/;
const nonNums = /\D/g;

async function unzip(filename: string) {
  const reader = async (r: JSZip) => r.file(filename)?.async('string');
  const parser = async (fileString: string|undefined) => {
    const toSplit = `${fileString ?? ''}`;
    const sub = toSplit.split(/\r\n/);
    const first = sub.shift();
    const keys = `${first ?? ''}`.split(',').map(camelCase);
    return sub.filter(row => row.trim() !== '').map((row) => row.split(',')
      .map(v => strPatt.test(v) ? v.replace(strPatt, '$1') : (nonNums.test(v) ? v : parseInt(v)))
      .reduce((p, v, i) => ({ ...p, [keys[i]]: v }), {}))
  };  
  const promise = new Promise((resolve) => {
    readFile('/usr/api/src/static/google_transit.zip', (err, data) => {
      if (err) throw err;
      loadAsync(data)
        .then(reader)
        .then(parser)
        .then(resolve);
    });
  });
  return await promise;
}

export { unzip };
