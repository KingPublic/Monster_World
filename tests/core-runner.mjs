import { rolldown } from 'rolldown';
import { fileURLToPath } from 'node:url';
const bundle = await rolldown({ input: fileURLToPath(new URL('./core.test.ts', import.meta.url)) });
let output;
try { output = await bundle.generate({ format: 'es' }); } finally { await bundle.close(); }
const chunk = output.output.find((item) => item.type === 'chunk');
if (!chunk) throw new Error('Core test bundle produced no JavaScript.');
const tests = await import('data:text/javascript;base64,' + Buffer.from(chunk.code).toString('base64'));
export const report = tests.runCoreTests();
for (const result of report) console.log((result.pass ? 'PASS ' : 'FAIL ') + result.name + (result.error ? ': ' + result.error : ''));
if (report.some((result) => !result.pass)) throw new Error('Core tests failed.');
