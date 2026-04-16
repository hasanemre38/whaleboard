'use client';
import{useState,useEffect,useCallback}from'react';
const C={bg:'#040810',surf:'#080f1a',surf2:'#0b1625',brd:'#0d1f33',acc:'#00d4ff',grn:'#00e87a',red:'#ff2d55',ylw:'#ffc107',mut:'#2d4a6a',txt:'#8ab4cc',white:'#e8f4ff'};
const fU=n=>{if(!n&&n!==0)return'—';const a=Math.abs(n);if(a>=1e9)return'$'+(a/1e9).toFixed(2)+'B';if(a>=1e6)return'$'+(a/1e6).toFixed(2)+'M';if(a>=1e3)return'$'+(a/1e3).toFixed(1)+'K';return'$'+a.toFixed(0)};
const fP=n=>{if(n==null)return'—';if(n>=10000)return'$'+Math.round(n).toLocaleString('en');if(n>=100)return'$'+n.toFixed(1);if(n>=1)return'$'+n.toFixed(3);return'$'+n.toFixed(5)};
export default function Page(){
const[tab,setTab]=useState(0);
const[coins,setCoins]=useState([]);
const[liqs,setLiqs]=useState(null);
const[loading,setLoading]=useState(false);
const[lastUpd,setLastUpd]=useState('—');
const[cd,setCd]=useState(30);
const[sort,setSort]=useState('oiUsd');
const fetchAll=useCallback(async()=>{
setLoading(true);
try{
const[m,l]=await Promise.all([fetch('/api/market'),fetch('/api/liquidations')]);
const[md,ld]=await Promise.all([m.json(),l.json()]);
if(md.ok)setCoins(md.coins);
if(ld.ok)setLiqs(ld);
setLastUpd(new Date().toLocaleTimeString('tr-TR'));
setCd(30);
}catch(e){console.error(e);}
setLoading(false);
},[]);
useEffect(()=>{fetchAll();},[fetchAll]);
useEffect(()=>{const t=setInterval(fetchAll,30000);return()=>clearInterval(t);},[fetchAll]);
useEffect(()=>{const t=setInterval(()=>setCd(c=>c<=1?30:c-1),1000);return()=>clearInterval(t);},[]);
const sorted=[...coins].sort((a,b)=>sort==='oiUsd'?b.oiUsd-a.oiUsd:sort==='chg24'?b.chg24-a.chg24:sort==='vol24'?b.vol24-a.vol24:Math.abs(b.fundRate)-Math.abs(a.fundRate));
const btc=coins.find(c=>c.sym==='BTC');
const eth=coins.find(c=>c.sym==='ETH');
const avg=coins.length?coins.reduce((s,c)=>s+c.chg24,0)/coins.length:0;
const sent=avg>4?{e:'🔥',l:'AÇGÖZLÜ',col:C.grn}:avg>1?{e:'📈',l:'İYİMSER',col:C.grn}:avg>-1?{e:'😐',l:'NÖTR',col:C.acc}:avg>-4?{e:'📉',l:'TEMKİNLİ',col:C.red}:{e:'🩸',l:'KORKU',col:C.red};
return(
<div style={{background:C.bg,minHeight:'100vh',fontFamily:"'Barlow Condensed',sans-serif",color:C.txt}}>
<style>{`@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700&display=swap');@keyframes pulse{0%,100%{opacity:1}50%{opacity:.2}}@keyframes spin{to{transform:rotate(360deg)}}.dp{animation:pulse 1.3s infinite}.sp{animation:spin .7s linear infinite}tbody tr:hover td{background:rgba(0,212,255,.04)!important}*{box-sizing:border-box}::-webkit-scrollbar{height:3px}::-webkit-scrollbar-thumb{background:#0d1f33}`}</style>
<div style={{background:C.surf,borderBottom:`1px solid ${C.brd}`,padding:'12px 16px',position:'sticky',top:0,zIndex:99,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
<span style={{fontFamily:'monospace',fontSize:17,color:C.acc,letterSpacing:4}}>WHALE<span style={{color:C.ylw}}>BOARD</span></span>
<div style={{display:'flex',alignItems:'center',gap:10}}>
{loading?<div className="sp" style={{width:13,height:13,border:`2px solid ${C.brd}`,borderTopColor:C.acc,borderRadius:'50%'}}/>:<div className="dp" style={{width:8,height:8,background:C.grn,borderRadius:'50%'}}/>}
<span style={{fontFamily:'monospace',fontSize:10,color:C.mut}}>{lastUpd}</span>
<span style={{fontFamily:'monospace',fontSize:10,padding:'2px 7px',border:`1px solid ${C.brd}`,color:C.mut}}>{cd}s</span>
<button onClick={fetchAll} style={{background:'transparent',border:`1px solid rgba(0,212,255,.3)`,color:C.acc,padding:'5px 10px',fontSize:11,letterSpacing:2,cursor:'pointer'}}>⟳</button>
</div>
</div>
<div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,padding:'13px 13px 0'}}>
{[{lbl:'BTC',val:btc?fP(btc.price):'—',sub:btc?(btc.chg24>=0?'▲ +':'▼ ')+Math.abs(btc.chg24).toFixed(2)+'%':'—',col:btc?btc.chg24>=0?C.grn:C.red:C.acc},{lbl:'ETH',val:eth?fP(eth.price):'—',sub:eth?(eth.chg24>=0?'▲ +':'▼ ')+Math.abs(eth.chg24).toFixed(2)+'%':'—',col:eth?eth.chg24>=0?C.grn:C.red:C.acc},{lbl:'TOPLAM OI',val:coins.length?fU(coins.reduce((s,c)=>s+c.oiUsd,0)):'—',sub:'Futures OI',col:C.acc},{lbl:'PİYASA',val:`${sent.e} ${sent.l}`,sub:`Ort: ${avg.toFixed(2)}%`,col:sent.col}].map(s=>(
<div key={s.lbl} style={{background:C.surf,border:`1px solid ${C.brd}`,padding:'12px 14px',position:'relative',overflow:'hidden'}}>
<div style={{position:'absolute',top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,transparent,${s.col},transparent)`,opacity:.3}}/>
<div style={{fontSize:9,letterSpacing:2,color:C.mut,textTransform:'uppercase',marginBottom:5}}>{s.lbl}</div>
<div style={{fontFamily:'monospace',fontSize:16,color:s.col,fontWeight:700}}>{s.val}</div>
<div style={{fontSize:10,color:s.col,marginTop:3,opacity:.8}}>{s.sub}</div>
</div>
))}
</div>
<div style={{display:'flex',borderBottom:`1px solid ${C.brd}`,background:C.surf,margin:'13px 13px 0'}}>
{['📊 Market','⚡ Likidasyonlar'].map((t,i)=>(
<button key={t} onClick={()=>setTab(i)} style={{flex:1,padding:'11px 8px',background:'transparent',border:'none',borderBottom:tab===i?`2px solid ${C.acc}`:'2px solid transparent',color:tab===i?C.acc:C.mut,fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,letterSpacing:2,cursor:'pointer',textTransform:'uppercase'}}>{t}</button>
))}
</div>
<div style={{padding:13}}>
{tab===0&&(<>
<div style={{display:'flex',gap:6,marginBottom:12,flexWrap:'wrap',alignItems:'center'}}>
<span style={{fontSize:10,color:C.mut,letterSpacing:2}}>SIRALA:</span>
{[['oiUsd','OI'],['chg24','24s%'],['vol24','Hacim'],['fundRate','Funding']].map(([k,l])=>(
<button key={k} onClick={()=>setSort(k)} style={{padding:'4px 9px',background:sort===k?'rgba(0,212,255,.12)':'transparent',border:`1px solid ${sort===k?C.acc:C.brd}`,color:sort===k?C.acc:C.mut,fontSize:10,cursor:'pointer'}}>{l}</button>
))}
</div>
<div style={{background:C.surf,border:`1px solid ${C.brd}`,overflow:'hidden',marginBottom:13}}>
<div style={{padding:'9px 14px',borderBottom:`1px solid ${C.brd}`,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
<span style={{fontSize:11,letterSpacing:3,color:C.acc,textTransform:'uppercase',fontWeight:600}}>Futures OI & Long/Short</span>
<span style={{fontFamily:'monospace',fontSize:10,padding:'2px 7px',background:'rgba(0,212,255,.1)',border:`1px solid rgba(0,212,255,.2)`,color:C.acc}}>BİNANCE</span>
</div>
<div style={{overflowX:'auto'}}>
<table style={{width:'100%',borderCollapse:'collapse'}}>
<thead><tr style={{background:'rgba(13,31,51,.7)'}}>
{['KOİN','FİYAT','24s%','OI','LONG','SHORT','FUNDING'].map((h,i)=>(
<th key={h} style={{padding:'8px 10px',textAlign:i===0?'left':'right',fontSize:9,letterSpacing:1.5,textTransform:'uppercase',color:C.mut,fontWeight:400,borderBottom:`1px solid ${C.brd}`,whiteSpace:'nowrap'}}>{h}</th>
))}
</tr></thead>
<tbody>
{sorted.length===0?(<tr><td colSpan={7} style={{textAlign:'center',padding:28,color:C.mut,fontFamily:'monospace',fontSize:11}}>{loading?'⟳ YÜKLENİYOR...':'Bekleniyor'}</td></tr>):sorted.map(c=>(
<tr key={c.sym}>
<td style={{padding:'10px 10px',fontSize:13,borderBottom:`1px solid rgba(13,31,51,.9)`,fontFamily:'monospace',fontWeight:700,color:C.white}}>{c.sym}</td>
<td style={{padding:'10px 10px',fontSize:13,borderBottom:`1px solid rgba(13,31,51,.9)`,textAlign:'right',fontFamily:'monospace',color:C.white,fontWeight:700}}>{fP(c.price)}</td>
<td style={{padding:'10px 10px',fontSize:13,borderBottom:`1px solid rgba(13,31,51,.9)`,textAlign:'right',fontFamily:'monospace',fontWeight:700,color:c.chg24>=0?C.grn:C.red}}>{c.chg24>=0?'▲ +':'▼ '}{Math.abs(c.chg24).toFixed(2)}%</td>
<td style={{padding:'10px 10px',fontSize:13,borderBottom:`1px solid rgba(13,31,51,.9)`,textAlign:'right',fontFamily:'monospace',color:C.txt}}>{fU(c.oiUsd)}</td>
<td style={{padding:'10px 10px',fontSize:13,borderBottom:`1px solid rgba(13,31,51,.9)`,textAlign:'right',fontFamily:'monospace',color:C.grn,fontWeight:700}}>{c.longPct.toFixed(1)}%</td>
<td style={{padding:'10px 10px',fontSize:13,borderBottom:`1px solid rgba(13,31,51,.9)`,textAlign:'right',fontFamily:'monospace',color:C.red,fontWeight:700}}>{c.shortPct.toFixed(1)}%</td>
<td style={{padding:'10px 10px',fontSize:13,borderBottom:`1px solid rgba(13,31,51,.9)`,textAlign:'right'}}><span style={{display:'inline-block',padding:'2px 6px',fontFamily:'monospace',fontSize:11,fontWeight:700,background:c.fundRate>=0?'rgba(0,232,122,.1)':'rgba(255,45,85,.1)',color:c.fundRate>=0?C.grn:C.red,border:`1px solid ${c.fundRate>=0?'rgba(0,232,122,.25)':'rgba(255,45,85,.25)'}`}}>{c.fundRate>=0?'+':''}{c.fundRate.toFixed(4)}%</span></td>
</tr>
))}
</tbody>
</table>
</div>
</div>
</>)}
{tab===1&&(<>
<div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:13}}>
<div style={{background:C.surf,border:`1px solid ${C.brd}`,padding:'13px 15px',position:'relative',overflow:'hidden'}}>
<div style={{position:'absolute',top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,transparent,${C.red},transparent)`,opacity:.4}}/>
<div style={{fontSize:9,letterSpacing:2,color:C.mut,textTransform:'uppercase',marginBottom:5}}>LONG Likidasyon</div>
<div style={{fontFamily:'monospace',fontSize:20,color:C.red,fontWeight:700}}>{liqs?fU(liqs.totalLong):'—'}</div>
</div>
<div style={{background:C.surf,border:`1px solid ${C.brd}`,padding:'13px 15px',position:'relative',overflow:'hidden'}}>
<div style={{position:'absolute',top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,transparent,${C.grn},transparent)`,opacity:.4}}/>
<div style={{fontSize:9,letterSpacing:2,color:C.mut,textTransform:'uppercase',marginBottom:5}}>SHORT Likidasyon</div>
<div style={{fontFamily:'monospace',fontSize:20,color:C.grn,fontWeight:700}}>{liqs?fU(liqs.totalShort):'—'}</div>
</div>
</div>
<div style={{background:C.surf,border:`1px solid ${C.brd}`,overflow:'hidden',marginBottom:13}}>
<div style={{padding:'9px 14px',borderBottom:`1px solid ${C.brd}`,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
<span style={{fontSize:11,letterSpacing:3,color:C.acc,textTransform:'uppercase',fontWeight:600}}>Son Likidasyonlar</span>
<span style={{fontFamily:'monospace',fontSize:10,padding:'2px 7px',background:'rgba(0,212,255,.1)',border:`1px solid rgba(0,212,255,.2)`,color:C.acc}}>BİNANCE</span>
</div>
<div style={{overflowX:'auto'}}>
<table style={{width:'100%',borderCollapse:'collapse'}}>
<thead><tr style={{background:'rgba(13,31,51,.7)'}}>
{['SAAT','KOİN','TİP','FİYAT','USDT'].map((h,i)=>(
<th key={h} style={{padding:'8px 10px',textAlign:i<=1?'left':'right',fontSize:9,letterSpacing:1.5,textTransform:'uppercase',color:C.mut,fontWeight:400,borderBottom:`1px solid ${C.brd}`}}>{h}</th>
))}
</tr></thead>
<tbody>
{!liqs?.liquidations?.length?(<tr><td colSpan={5} style={{textAlign:'center',padding:28,color:C.mut,fontFamily:'monospace',fontSize:11}}>{loading?'⟳ YÜKLENİYOR...':'Bekleniyor'}</td></tr>):liqs.liquidations.map((l,i)=>(
<tr key={i}>
<td style={{padding:'10px 10px',fontSize:13,borderBottom:`1px solid rgba(13,31,51,.9)`,fontFamily:'monospace',color:C.mut}}>{l.time}</td>
<td style={{padding:'10px 10px',fontSize:13,borderBottom:`1px solid rgba(13,31,51,.9)`,fontFamily:'monospace',fontWeight:700,color:C.white}}>{l.sym}</td>
<td style={{padding:'10px 10px',fontSize:13,borderBottom:`1px solid rgba(13,31,51,.9)`,textAlign:'right'}}><span style={{display:'inline-block',padding:'2px 7px',fontFamily:'monospace',fontSize:10,fontWeight:700,background:l.dir==='LONG'?'rgba(255,45,85,.12)':'rgba(0,232,122,.12)',color:l.dir==='LONG'?C.red:C.grn,border:`1px solid ${l.dir==='LONG'?'rgba(255,45,85,.3)':'rgba(0,232,122,.3)'}`}}>{l.dir==='LONG'?'📉':'📈'} {l.side}</span></td>
<td style={{padding:'10px 10px',fontSize:13,borderBottom:`1px solid rgba(13,31,51,.9)`,textAlign:'right',fontFamily:'monospace',color:C.txt}}>{fP(l.price)}</td>
<td style={{padding:'10px 10px',fontSize:13,borderBottom:`1px solid rgba(13,31,51,.9)`,textAlign:'right',fontFamily:'monospace',fontWeight:700,color:l.dir==='LONG'?C.red:C.grn}}>{fU(l.usd)}</td>
</tr>
))}
</tbody>
</table>
</div>
</div>
</>)}
<div style={{textAlign:'center',padding:12,color:C.mut,fontSize:10,letterSpacing:2,borderTop:`1px solid ${C.brd}`}}>WHALEBOARD • Binance API • 30s otomatik güncellenir</div>
</div>
</div>
);
}
