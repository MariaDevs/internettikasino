const c=require('cheerio'),fs=require('fs'),TD=require('turndown'),{gfm}=require('turndown-plugin-gfm');
const td=new TD({headingStyle:'atx',bulletListMarker:'-'});td.use(gfm);
const out={};
for(const f of fs.readdirSync('html')){
  const h=fs.readFileSync('html/'+f,'utf8');const $=c.load(h);
  const meta={title:$('title').text(),desc:$('meta[name=description]').attr('content'),canonical:$('link[rel=canonical]').attr('href'),
    ogimg:$('meta[property="og:image"]').attr('content'),schema:$('script[type="application/ld+json"]').map((i,e)=>$(e).html()).get()};
  $('script,style,noscript,header,footer,#mobile-menu,iframe').remove();
  const body=$('#page-wrapper').length?$('#page-wrapper'):$('body');
  const md=td.turndown(body.html()||'');
  fs.writeFileSync('md/'+f.replace('.html','.md'),`---\n${JSON.stringify({title:meta.title,desc:meta.desc,canonical:meta.canonical,ogimg:meta.ogimg})}\n---\n\n`+md);
  out[f]={...meta,words:md.split(/\s+/).length};
}
fs.writeFileSync('meta.json',JSON.stringify(out,null,1));
for(const[k,v] of Object.entries(out))console.log(v.words,k);
