import fs from 'fs';
import { find } from './lib/util/find.mjs';
import { make } from './lib/util/utils.mjs';
import { output } from './lib/util/output.mjs';

const dir = '../';

fs.readdir(dir,function(err,files) {
    if(err)
        return console.log(err);
    const flist = [];
    files.forEach(function(f) {
        if(/^[^_].+\.xml$/.test(f))
            flist.push(dir+f);
    });
    readfiles(flist);
});


const readfiles = function(arr) {
    const data = arr.map((f) => 
    {
        const xmlDoc = make.xml( fs.readFileSync(f,{encoding:'utf-8'}) );
        return {
            cote: find.cote(xmlDoc),
            altcotes: find.altcotes(xmlDoc),
            fname: `https://tst-project.github.io/${f}`,
            repo: find.repo(xmlDoc),
            title: find.title(xmlDoc),
            material: find.material(xmlDoc),
            extent: find.extent(xmlDoc),
            width: find.dimension(xmlDoc,'leaf','width'),
            height: find.dimension(xmlDoc,'leaf','height'),
            date: find.date(xmlDoc),
            images: find.images(xmlDoc)
        };
    });
    data.sort((a,b) => {
        if(a.sort < b.sort) return -1;
        else return 1;
    });
    output.index(data);
    console.log('Main index compiled: index.html.');
    output.index(data,{prefix: 'Ducler'});
    console.log('Ducler index compiled: ducler.html.');
    output.index(data,{prefix: 'Ariel'});
    console.log('Ariel index compiled: ariel.html.');
};

