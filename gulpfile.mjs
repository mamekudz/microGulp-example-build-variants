import * as Api from 'gulp-mu-gulp-api';
import {dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {GetVersionString} from './tools/RecipeRelease.mjs';
Api.InstallStringExtensions();
const ROOT=dirname(fileURLToPath(import.meta.url));
export const µI18xContext={GetValues(){return {version:GetVersionString()};}};
export async function BUILD_VARIANTS(){
	const {BuildVariants,ValidateConfig}=await import('./src/Build.mjs');
	const {readFile}=await import('node:fs/promises');
	const config=ValidateConfig(JSON.parse(await readFile(new URL('./example.json',import.meta.url),'utf8')));
	let selected=config.variants;
	if(Api.IsMicroGulp()){
		const answer=await Api.RequestForm({title:'Build variants<context="example form"/>'.i18xRegister(),cancelable:true,fields:[{id:'variants',type:'checkbox',label:'Variants<context="example form"/>'.i18xRegister(),validate:{required:true,minSelected:1},options:selected.map(_id=>({value:_id,label:_id,checked:true}))}]});
		if(answer===null)return;selected=answer.variants;
	}
	const result=await BuildVariants(ROOT,selected);Api.Log('Build created in <directory/><context="example log"/>',result);
}
BUILD_VARIANTS.µKeyBinding = { key: 'ctrl+shift+F8', mac: 'cmd+shift+F8' };
BUILD_VARIANTS.µDisplayName='Build variants V<version/><context="µDisplayName"/>'.i18xRegister();
BUILD_VARIANTS.µGroup='Build<context="µGroup"/>'.i18xRegister();
BUILD_VARIANTS.µExecutionConcurrency=false;
