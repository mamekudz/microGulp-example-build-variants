import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
async function Fixture(_t){const root=await fs.mkdtemp(path.join(os.tmpdir(),'microgulp-example-'));_t.after(async()=>{if(path.dirname(root)!==os.tmpdir()||!path.basename(root).startsWith('microgulp-example-'))throw Error('Unsafe cleanup');await fs.rm(root,{recursive:true,force:true});});return root;}
import {BuildVariants,FilterVariant,ValidateConfig} from '../src/Build.mjs';
import {pathToFileURL} from 'node:url';
const source=await fs.readFile(new URL('../fixtures/product.mjs',import.meta.url),'utf8');
test('both real filtered outputs contain exactly the expected features and sources stay unchanged',async _t=>{
 const root=await Fixture(_t);await fs.mkdir(path.join(root,'fixtures'));await fs.writeFile(path.join(root,'fixtures/product.mjs'),source);await fs.writeFile(path.join(root,'example.json'),JSON.stringify({schemaVersion:1,variants:['Community','Professional']}));
 const first=await BuildVariants(root);for(const [variant,feature,excluded] of [['Community','community-help','professional-export'],['Professional','professional-export','community-help']]){const file=path.join(first.directory,variant+'.mjs');assert.deepEqual((await import(pathToFileURL(file))).features,['common',feature]);assert.ok(!(await fs.readFile(file,'utf8')).includes(excluded));}
 const next=await BuildVariants(root,['Community']);assert.notEqual(first.directory,next.directory);assert.equal(await fs.readFile(path.join(root,'fixtures/product.mjs'),'utf8'),source);assert.equal(JSON.parse(await fs.readFile(path.join(first.directory,'manifest.json'))).status,'success');
 await assert.rejects(BuildVariants(root,[]),/INVALID_SELECTION/);await assert.rejects(BuildVariants(root,['Unknown']),/INVALID_SELECTION/);
});
test('unknown configuration, duplicate variants and unsupported clients fail',()=>{
 for(const config of [{schemaVersion:1,variants:[]},{schemaVersion:1,variants:['Community','Community']},{schemaVersion:1,variants:['Unknown']},{schemaVersion:1,variants:['Community'],typo:true}])assert.throws(()=>ValidateConfig(config),/INVALID_CONFIG/);
 assert.throws(()=>FilterVariant(source,'Unknown'),/UNKNOWN_VARIANT/);
});
test('syntax errors leave no successful manifest',async _t=>{
 const root=await Fixture(_t);await fs.mkdir(path.join(root,'fixtures'));await fs.writeFile(path.join(root,'fixtures/product.mjs'),'export const broken = ;');await fs.writeFile(path.join(root,'example.json'),JSON.stringify({schemaVersion:1,variants:['Community']}));await assert.rejects(BuildVariants(root));
 const [directory]=await fs.readdir(path.join(root,'dist'));await assert.rejects(fs.stat(path.join(root,'dist',directory,'manifest.json')),{code:'ENOENT'});
});
