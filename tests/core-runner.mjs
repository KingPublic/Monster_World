import { rolldown } from 'rolldown';
import { fileURLToPath } from 'node:url';
const files=['./core.test.ts','./assets.test.ts'];
export const report=[];
for(const file of files){
const bundle = await rolldown({ input: fileURLToPath(new URL(file, import.meta.url)) });
let output;
try { output = await bundle.generate({ format: 'es' }); } finally { await bundle.close(); }
const chunk = output.output.find((item) => item.type === 'chunk');
if (!chunk) throw new Error('Core test bundle produced no JavaScript.');
const tests = await import('data:text/javascript;base64,' + Buffer.from(chunk.code).toString('base64'));
report.push(...await tests.runCoreTests());
}
for (const result of report) console.log((result.pass ? 'PASS ' : 'FAIL ') + result.name + (result.error ? ': ' + result.error : ''));
if (report.some((result) => !result.pass)) throw new Error('Core tests failed.');
