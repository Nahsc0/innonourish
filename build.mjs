import {cp,mkdir,rm,writeFile,stat} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.dirname(fileURLToPath(import.meta.url)),out=path.resolve(root,'dist');
if(path.dirname(out)!==root||path.basename(out)!=='dist')throw Error('Unexpected build destination.');
await rm(out,{recursive:true,force:true});await mkdir(out,{recursive:true});
for(const name of ['index.html','styles.css','app.js','core.js','data.js','assets'])await cp(path.join(root,name),path.join(out,name),{recursive:true});
try{if((await stat(path.join(root,'docs'))).isDirectory())await cp(path.join(root,'docs'),path.join(out,'docs'),{recursive:true});}catch(e){if(e.code!=='ENOENT')throw e;}
await writeFile(path.join(out,'.nojekyll'),'');
console.log('Built static app in dist/. All asset paths are relative for GitHub Pages or a future subdomain.');
