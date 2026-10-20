import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
let count=0;
function Walk(_dir){for(const entry of fs.readdirSync(_dir,{withFileTypes:true})){if(['node_modules','.git','dist','.example-state'].includes(entry.name))continue;const file=path.join(_dir,entry.name);if(entry.isDirectory())Walk(file);else if(file.endsWith('.mjs')){execFileSync(process.execPath,['--check',file]);count++;}}}
Walk(root);console.log('Syntax OK: '+count+' modules');
