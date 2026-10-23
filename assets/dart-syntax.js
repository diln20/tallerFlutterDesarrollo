/* FlutterLab · resaltado Dart específico del editor simulado; sin dependencias. */
(function(){
  'use strict';
  window.FlutterLabDartSyntax=function dartSyntax(text) {
  const source=String(text??"");
  const esc = value=>String(value).replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
  const words = new Set("abstract as assert async await break case catch class const continue covariant default deferred do dynamic else enum export extends extension external factory final finally for get hide if implements import in interface is late library mixin new on operator part required rethrow return sealed set show static super switch sync this throw try typedef var void when while with yield".split(" "));
  const primitives = new Set("int double num bool String Object Never Null Type Widget BuildContext Future FutureOr Stream List Map Set Iterable Function".split(" "));
  const literals = new Set("true false null".split(" "));
  const punctuation = "(){}[];,.:?<>".split("");
  const segments=[];
  const append=(value,type)=>{
    if(!value)return;
    segments.push(type?'<span class="pv-dart-token pv-dart-'+type+'">'+esc(value)+'</span>':esc(value));
  };
  let i=0;
  while(i<source.length) {
    const char=source[i], next=source[i+1];
    if(char===" "||char==="\t"||char==="\n"||char==="\r"){let j=i+1;while(j<source.length&&/\s/.test(source[j]))j++;append(source.slice(i,j));i=j;continue;}
    if(char==="/"&&next==="/"){append(source.slice(i),"comment");break;}
    if(char==="/"&&next==="*"){const n=source.indexOf("*/",i+2);const j=n<0?source.length:n+2;append(source.slice(i,j),"comment");i=j;continue;}
    const rawString = (char==="r"||char==="R")&&(next==="'"||next==='"');
    if(char==="'"||char==='"'||rawString) {
      const start=i, quoteIndex=rawString?i+1:i, quote=source[quoteIndex];
      const triple=source.slice(quoteIndex,quoteIndex+3)===quote.repeat(3);
      let j=quoteIndex+(triple?3:1);
      while(j<source.length){
        if(!rawString&&source[j]==="\\"){j+=Math.min(2,source.length-j);continue;}
        if(triple&&source.slice(j,j+3)===quote.repeat(3)){j+=3;break;}
        if(!triple&&source[j]===quote){j++;break;}
        j++;
      }
      append(source.slice(start,j),"string");i=j;continue;
    }
    if(char==="@" && /[A-Za-z_]/.test(next||"")){
      const match=/^@[A-Za-z_][A-Za-z0-9_]*/.exec(source.slice(i));
      append(match[0],"annotation");i+=match[0].length;continue;
    }
    if(/[0-9]/.test(char)){
      const match=/^(?:0[xX][\da-fA-F]+|\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/.exec(source.slice(i));
      if(match){append(match[0],"number");i+=match[0].length;continue;}
    }
    if(/[A-Za-z_]/.test(char)){
      const match=/^[A-Za-z_]\w*/.exec(source.slice(i));
      const word=match[0],end=i+word.length;
      const tail=source.slice(end);
      const nextSymbol=/^\s*(.)/.exec(tail)?.[1]||"";
      const prevSymbol=source.slice(0,i).trimEnd().slice(-1);
      let type="";
      if(literals.has(word))type="literal";
      else if(words.has(word))type="keyword";
      else if(primitives.has(word))type="type";
      else if(nextSymbol===":")type="property";
      else if(/^[A-Z]/.test(word))type="type";
      else if(nextSymbol==="(")type="function";
      else if(prevSymbol===".")type="member";
      append(word,type);i=end;continue;
    }
    if(punctuation.includes(char)){append(char,"punctuation");i++;continue;}
    if(/[+\-*/%=!&|^~]/.test(char)){
      let j=i+1;
      while(j<source.length&&/[+\-*/%=!&|^~]/.test(source[j]) && j<i+3)j++;
      append(source.slice(i,j),"operator");i=j;continue;
    }
    append(char);i++;
  }
  return segments.join("");
};
})();
