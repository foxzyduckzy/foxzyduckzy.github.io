(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,75134,e=>{"use strict";let t=(()=>{let e=new Uint32Array(256);for(let t=0;t<256;t++){let a=t;for(let e=0;e<8;e++)a=1&a?0xedb88320^a>>>1:a>>>1;e[t]=a>>>0}return e})();async function a(e){let t=new Blob([e]).stream().pipeThrough(new CompressionStream("deflate-raw"));return new Uint8Array(await new Response(t).arrayBuffer())}class l{parts=[];length=0;bytes(e){return this.parts.push(e),this.length+=e.length,this}u16(e){return this.bytes(new Uint8Array([255&e,e>>>8&255]))}u32(e){return this.bytes(new Uint8Array([255&e,e>>>8&255,e>>>16&255,e>>>24&255]))}done(){let e=new Uint8Array(this.length),t=0;for(let a of this.parts)e.set(a,t),t+=a.length;return e}}async function s(e){let s=new TextEncoder,n=new l,r=[];for(let l of e){let e=s.encode(l.name),o=s.encode(l.text),i=await a(o),p=function(e){let a=0xffffffff;for(let l=0;l<e.length;l++)a=t[(a^e[l])&255]^a>>>8;return(0xffffffff^a)>>>0}(o),m=n.length;n.u32(0x4034b50),n.u16(20),n.u16(0),n.u16(8),n.u16(0).u16(0),n.u32(p).u32(i.length).u32(o.length),n.u16(e.length).u16(0),n.bytes(e).bytes(i),r.push({name:e,crc:p,size:o.length,packed:i.length,at:m})}let o=n.length;for(let e of r)n.u32(0x2014b50),n.u16(20).u16(20).u16(0).u16(8),n.u16(0).u16(0),n.u32(e.crc).u32(e.packed).u32(e.size),n.u16(e.name.length).u16(0).u16(0),n.u16(0).u16(0).u32(0),n.u32(e.at),n.bytes(e.name);let i=n.length-o;return n.u32(0x6054b50),n.u16(0).u16(0),n.u16(r.length).u16(r.length),n.u32(i).u32(o).u16(0),n.done()}e.s(["writeZip",0,s,"xml",0,function(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;").replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g,"")}])},88172,e=>{"use strict";var t=e.i(75134),a=e.i(4640);let l={w:Math.round(12191695.2),h:Math.round(6858e3)},s=Math.round(640080),n=Math.round(1005840.0000000001);function r(e,a,l,s,n,r,o){let i=o.map(e=>{let a=`<a:pPr${e.bullet?' indent="-228600" marL="228600"':""}>`+(e.bullet?'<a:buChar char="•"/>':"<a:buNone/>")+"</a:pPr>";return`<a:p>${a}<a:r><a:rPr lang="en-US" sz="${Math.round(100*e.size)}"${e.bold?' b="1"':""} dirty="0"/><a:t>${(0,t.xml)(e.text)}</a:t></a:r></a:p>`}).join("");return`<p:sp><p:nvSpPr><p:cNvPr id="${e}" name="${(0,t.xml)(a)}"/><p:cNvSpPr txBox="1"/><p:nvPr/></p:nvSpPr><p:spPr><a:xfrm><a:off x="${l}" y="${s}"/><a:ext cx="${n}" cy="${r}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></p:spPr><p:txBody><a:bodyPr wrap="square"><a:normAutofit/></a:bodyPr><a:lstStyle/>${i||'<a:p><a:endParaRPr lang="en-US"/></a:p>'}</p:txBody></p:sp>`}function o(e){switch(e.type){case"heading":return[{text:e.text,size:1===e.level?24:20,bold:!0}];case"text":return[{text:e.text,size:16}];case"list":return e.items.map(e=>({text:e,size:16,bullet:!0}));case"tags":return[{text:e.items.join("  ·  "),size:14}];case"entry":return[{text:e.title,size:18,bold:!0},...e.org||e.when?[{text:[e.org,e.when].filter(Boolean).join(" · "),size:13}]:[],...e.body?[{text:e.body,size:15}]:[]];case"field":return[{text:`${e.label}: ${e.value}`,size:15}];case"table":return[{text:e.columns.join("  |  "),size:13,bold:!0},...e.rows.map(e=>({text:e.join("  |  "),size:13}))];case"lineItems":return[...e.lines.map(t=>({text:`${t.item}  \xb7  ${t.qty} \xd7 ${(0,a.money)(t.unit,e.currency)}`,size:14,bullet:!0})),{text:`Total  ${(0,a.money)((0,a.total)(e),e.currency)}`,size:16,bold:!0}];case"chart":return e.series.map(t=>({text:`${t.label}  ${t.value}${e.unit??""}`,size:16,bullet:!0}));case"flow":return[{text:e.steps.map(e=>e.label).join("  →  "),size:16}];default:return[]}}let i=`<p:cSld><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr>
<p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr>
</p:spTree></p:cSld>`,p=`xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"
 xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
 xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"`,m=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sldMaster ${p}>${i}
<p:clrMap bg1="lt1" tx1="dk1" bg2="lt2" tx2="dk2" accent1="accent1" accent2="accent2" accent3="accent3"
 accent4="accent4" accent5="accent5" accent6="accent6" hlink="hlink" folHlink="folHlink"/>
<p:sldLayoutIdLst><p:sldLayoutId id="2147483649" r:id="rId1"/></p:sldLayoutIdLst></p:sldMaster>`,c=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sldLayout ${p} type="blank" preserve="1">${i}</p:sldLayout>`,d=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<a:theme xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" name="Loopable8">
<a:themeElements>
<a:clrScheme name="Loopable8"><a:dk1><a:sysClr val="windowText" lastClr="000000"/></a:dk1>
<a:lt1><a:sysClr val="window" lastClr="FFFFFF"/></a:lt1>
<a:dk2><a:srgbClr val="17171A"/></a:dk2><a:lt2><a:srgbClr val="F5F5F7"/></a:lt2>
${[1,2,3,4,5,6].map(e=>`<a:accent${e}><a:srgbClr val="4A5FBF"/></a:accent${e}>`).join("")}
<a:hlink><a:srgbClr val="4A5FBF"/></a:hlink><a:folHlink><a:srgbClr val="8A8A92"/></a:folHlink></a:clrScheme>
<a:fontScheme name="Loopable8">
<a:majorFont><a:latin typeface="Inter"/><a:ea typeface=""/><a:cs typeface=""/></a:majorFont>
<a:minorFont><a:latin typeface="Inter"/><a:ea typeface=""/><a:cs typeface=""/></a:minorFont></a:fontScheme>
<a:fmtScheme name="Loopable8">
<a:fillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:fillStyleLst>
<a:lnStyleLst><a:ln><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:ln><a:ln><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:ln><a:ln><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:ln></a:lnStyleLst>
<a:effectStyleLst><a:effectStyle><a:effectLst/></a:effectStyle><a:effectStyle><a:effectLst/></a:effectStyle><a:effectStyle><a:effectLst/></a:effectStyle></a:effectStyleLst>
<a:bgFillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:bgFillStyleLst>
</a:fmtScheme></a:themeElements></a:theme>`;async function h(e){let a=e.pages.length?e.pages:[{id:"p",kind:"slide",nodes:[]}],i=a.length,h=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/>
<Override PartName="/ppt/slideMasters/slideMaster1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideMaster+xml"/>
<Override PartName="/ppt/slideLayouts/slideLayout1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideLayout+xml"/>
<Override PartName="/ppt/theme/theme1.xml" ContentType="application/vnd.openxmlformats-officedocument.theme+xml"/>
${a.map((e,t)=>`<Override PartName="/ppt/slides/slide${t+1}.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>`).join("")}
</Types>`,f=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="ppt/presentation.xml"/>
</Relationships>`,x=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:presentation ${p}>
<p:sldMasterIdLst><p:sldMasterId id="2147483648" r:id="rId1"/></p:sldMasterIdLst>
<p:sldIdLst>${a.map((e,t)=>`<p:sldId id="${256+t}" r:id="rId${t+2}"/>`).join("")}</p:sldIdLst>
<p:sldSz cx="${l.w}" cy="${l.h}"/><p:notesSz cx="${l.h}" cy="${l.w}"/></p:presentation>`,u=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster" Target="slideMasters/slideMaster1.xml"/>
${a.map((e,t)=>`<Relationship Id="rId${t+2}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide${t+1}.xml"/>`).join("")}
<Relationship Id="rId${i+2}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme" Target="theme/theme1.xml"/>
</Relationships>`,y=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout1.xml"/>
</Relationships>`,g=[{name:"[Content_Types].xml",text:h},{name:"_rels/.rels",text:f},{name:"ppt/presentation.xml",text:x},{name:"ppt/_rels/presentation.xml.rels",text:u},{name:"ppt/slideMasters/slideMaster1.xml",text:m},{name:"ppt/slideMasters/_rels/slideMaster1.xml.rels",text:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout1.xml"/>
<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme" Target="../theme/theme1.xml"/>
</Relationships>`},{name:"ppt/slideLayouts/slideLayout1.xml",text:c},{name:"ppt/slideLayouts/_rels/slideLayout1.xml.rels",text:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster" Target="../slideMasters/slideMaster1.xml"/>
</Relationships>`},{name:"ppt/theme/theme1.xml",text:d},...a.flatMap((t,a)=>{var i;let p,m,c,d,h;return[{name:`ppt/slides/slide${a+1}.xml`,text:(i=e.meta.title,p=t.nodes.find(e=>"heading"===e.type),m=t.title??(p?.type==="heading"?p.text:i),c=!t.title&&p,d=t.nodes.filter(e=>e!==c).flatMap(o),h=r(2,"Title",s,s,l.w-2*s,n,[{text:m,size:32,bold:!0}])+r(3,"Body",s,s+n,l.w-2*s,l.h-2*s-n,d),`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"
 xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
 xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
<p:cSld><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr>
<p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr>
${h}</p:spTree></p:cSld><p:clrMapOvr><a:overrideClrMapping bg1="lt1" tx1="dk1" bg2="lt2" tx2="dk2"
 accent1="accent1" accent2="accent2" accent3="accent3" accent4="accent4" accent5="accent5" accent6="accent6"
 hlink="hlink" folHlink="folHlink"/></p:clrMapOvr></p:sld>`)},{name:`ppt/slides/_rels/slide${a+1}.xml.rels`,text:y}]})];return(0,t.writeZip)(g)}e.s(["toPptx",0,h])}]);