import { rolldown } from 'rolldown';
import { fileURLToPath } from 'node:url';
import { readdir } from 'node:fs/promises';
const requested=process.argv.slice(2);
const files=(await readdir(fileURLToPath(new URL('.',import.meta.url)))).filter(file=>file.endsWith('.test.ts')&&(!requested.length||requested.includes(file))).sort();
if(!files.length)throw new Error('No matching test files.');
export const report=[];
for(const file of files){
const bundle = await rolldown({ input: fileURLToPath(new URL(file, import.meta.url)),platform:'node',plugins:[{name:'test-browser-environment',load(id){if(id.endsWith('.css'))return {code:'',moduleType:'js'};},transform(code){if(code.includes('import.meta.env'))return code.replaceAll('import.meta.env.BASE_URL','"/"').replaceAll('import.meta.env.DEV','false');}}] });
let output;
try { output = await bundle.generate({ format: 'es' }); } finally { await bundle.close(); }
const chunk = output.output.find((item) => item.type === 'chunk');
if (!chunk) throw new Error('Core test bundle produced no JavaScript.');
let tests;
try {tests=await import('data:text/javascript;base64,' + Buffer.from(chunk.code).toString('base64'));}
catch(error){console.error('Test import failed: '+file+' — '+String(error));process.exit(1);}
report.push(...await tests.runCoreTests());
}
for (const result of report) console.log((result.pass ? 'PASS ' : 'FAIL ') + result.name + (result.error ? ': ' + result.error : ''));
if (report.some((result) => !result.pass)) throw new Error('Core tests failed.');
