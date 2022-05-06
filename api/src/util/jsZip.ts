import { readFile } from 'fs';
import JSZip, { loadAsync } from 'jszip';


async function unzip(filename: string) {
  const reader = async (r: JSZip) => r.file(filename)?.async('string');
  const parser = async (fileString: string|undefined) => {
    const toSplit = `${fileString ?? ''}`;
    const sub = toSplit.split(/\r\n/);
    const first = sub.shift();
    const keys = `${first ?? ''}`.split(',');
    return sub.filter(row => row.trim() !== '')
      .map((row) => row.split(',').reduce((p, v, i) => ({ ...p, [keys[i]]: v }), {}))
  };  
  const promise = new Promise((resolve) => {
    readFile('/Users/vincent/Downloads/google_transit.zip', (err, data) => {
      if (err) throw err;
      loadAsync(data)
        .then(reader)
        .then(parser)
        .then(resolve);
    });
  });
  return await promise;
}

const main = async() => {
  unzip('calendar_dates.txt').then(console.log);
};

main();
