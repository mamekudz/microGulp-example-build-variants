import fs from 'node:fs/promises';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import Filter from 'gulp-mu-build-filter';
export const VARIANTS=['Community','Professional'];
export function ValidateConfig(_config){
	if(!_config||_config.schemaVersion!==1||Object.keys(_config).some(_key=>!['schemaVersion','variants'].includes(_key))||!Array.isArray(_config.variants)||!_config.variants.length||new Set(_config.variants).size!==_config.variants.length||_config.variants.some(_id=>!VARIANTS.includes(_id)))throw Error('INVALID_CONFIG');return _config;
}
export function FilterVariant(_source,_variant){
	if(!VARIANTS.includes(_variant))throw Error('UNKNOWN_VARIANT');
	const output=Filter({text:_source,mode:'remove',release:'Production',client:_variant,variants:_variant});
	if(output.includes('@<BUILD_')||output.includes('@>BUILD_'))throw Error('UNRESOLVED_MARKERS');return output;
}
export async function BuildVariants(_root,_selection){
	const config=ValidateConfig(JSON.parse(await fs.readFile(path.join(_root,'example.json'),'utf8')));
	const selected=_selection??config.variants;
	if(!Array.isArray(selected)||!selected.length||new Set(selected).size!==selected.length||selected.some(_id=>!config.variants.includes(_id)))throw Error('INVALID_SELECTION');
	const source=await fs.readFile(path.join(_root,'fixtures/product.mjs'),'utf8');
	const dist=path.join(_root,'dist');await fs.mkdir(dist,{recursive:true});if((await fs.lstat(dist)).isSymbolicLink())throw Error('UNSAFE_OUTPUT');
	const directory=await fs.mkdtemp(path.join(dist,'build-'));
	for(const variant of selected){const output=FilterVariant(source,variant),file=path.join(directory,variant+'.mjs');await fs.writeFile(file,output,{flag:'wx'});execFileSync(process.execPath,['--check',file]);}
	await fs.writeFile(path.join(directory,'manifest.json'),JSON.stringify({variants:selected,status:'success'},null,2)+'\n',{flag:'wx'});return {directory,variants:selected};
}
