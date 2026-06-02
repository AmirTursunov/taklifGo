'use client'

import React, { useState, useEffect, useRef } from 'react'

export default function BirthdayGreeting({ data = {} as any }) {
  const [slide, setSlide] = useState(0)
  const timerRef = useRef<any>(null)

  const d = {
    name: data.name || data.names || 'Dilnoza',
    age: data.age || '25',
    message: data.message || `Hayotingizning eng yorqin kunida\nsizi chin dildan tabriklaymiz!\n\nQuvonch, sog'lik va baxt\nsizni doim kuzatib yursin.\n\nHar bir orzuingiz ro'yobga chiqsin,\nhar bir kuni bahor kabi gullab yashnаsin!`,
    from: data.from || data.closingSub || 'Yaqinlaringiz',
    wishes: data.wishes || [
      { icon: '🌸', text: "Doim sog'-salomat bo'ling" },
      { icon: '⭐', text: 'Har bir orzuingiz amalga oshsin' },
      { icon: '🎀', text: 'Muhabbat va baxt to\'lsin' },
      { icon: '✨', text: 'Umr yo\'lingiz nurli bo\'lsin' },
      { icon: '🌈', text: "Har kuni yangi quvonch keltirsin" },
      { icon: '💫', text: "Baxtingiz chegara bilmasin" },
    ],
  }

  const DELAYS = [4500, 6000, 6500]

  const goTo = (n: number) => {
    clearTimeout(timerRef.current)
    setSlide(n)
    timerRef.current = setTimeout(() => goTo((n + 1) % 3), DELAYS[n])
  }

  useEffect(() => {
    timerRef.current = setTimeout(() => goTo(1), DELAYS[0])
    return () => clearTimeout(timerRef.current)
  }, [])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Pacifico&family=Nunito:wght@300;400;600;700&family=Dancing+Script:wght@600;700&display=swap');
        .bday-slide { transition: opacity 0.8s ease, transform 0.8s ease; }
        .bday-slide.on { opacity: 1; transform: scale(1) translateY(0); pointer-events: auto; z-index: 2; }
        .bday-slide.off { opacity: 0; transform: scale(0.96) translateY(8px); pointer-events: none; z-index: 1; }
        @keyframes confettiFall {
          0%   { transform: translateY(-20px) rotate(0deg);   opacity: 1;   }
          100% { transform: translateY(620px)  rotate(720deg); opacity: 0.3; }
        }
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes sparkle { 0%,100%{opacity:0.4;transform:scale(0.8)} 50%{opacity:1;transform:scale(1.2)} }
        @keyframes floatUp { 0%{transform:translateY(0) rotate(0deg);opacity:0.8} 100%{transform:translateY(-620px) rotate(360deg);opacity:0} }
        @keyframes wishPop { from{opacity:0;transform:translateX(-16px)} to{opacity:1;transform:translateX(0)} }
        @keyframes heartbeat { 0%,100%{transform:scale(1)} 50%{transform:scale(1.18)} }
        .bounce-a { animation: bounce 2s ease-in-out infinite; }
        .sparkle-a { animation: sparkle ease-in-out infinite; }
        .float-a   { animation: floatUp linear infinite; }
        .heartbeat { animation: heartbeat 1.6s ease-in-out infinite; }
        .wish-item { animation: wishPop 0.5s ease forwards; opacity: 0; }
      `}</style>

      <div style={{ fontFamily: "'Nunito',sans-serif", maxWidth: 360, margin: '0 auto', cursor: 'pointer' }}
        onClick={() => goTo((slide + 1) % 3)}>

        {/* ── CARD ── */}
        <div style={{
          width: '100%', aspectRatio: '9/16', maxHeight: '82vh',
          position: 'relative', overflow: 'hidden', borderRadius: 28,
          boxShadow: '0 12px 50px rgba(255,160,180,0.25), 0 4px 20px rgba(200,160,255,0.2)',
        }}>

          {/* Background */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(160deg,#fff5f9 0%,#fef0ff 35%,#f0f5ff 65%,#f5fff8 100%)',
          }} />

          {/* Blobs */}
          {[
            { w:220,h:220,t:-60,l:-60, c:'rgba(255,182,220,0.22)' },
            { w:180,h:180,t:-40,r:-50, c:'rgba(200,180,255,0.2)' },
            { w:160,h:160,b:80,l:-40,  c:'rgba(160,230,255,0.18)' },
            { w:200,h:200,b:-60,r:-60, c:'rgba(180,255,200,0.2)' },
          ].map((b,i) => (
            <div key={i} style={{
              position:'absolute', borderRadius:'50%',
              width:b.w, height:b.h, background:b.c,
              ...(b.t!==undefined?{top:b.t}:{}),
              ...(b.b!==undefined?{bottom:b.b}:{}),
              ...(b.l!==undefined?{left:b.l}:{}),
              ...(b.r!==undefined?{right:b.r}:{}),
            }} />
          ))}

          {/* Confetti */}
          <div style={{ position:'absolute',inset:0,overflow:'hidden',pointerEvents:'none',zIndex:3 }}>
            {[
              { l:'8%',  color:'#ffb3d1', dur:4,   del:0,   shape:'2px' },
              { l:'22%', color:'#c4b5fd', dur:5,   del:0.8, shape:'50%' },
              { l:'40%', color:'#93e4c1', dur:4.5, del:1.5, shape:'1px' },
              { l:'58%', color:'#fcd34d', dur:3.8, del:0.4, shape:'2px' },
              { l:'72%', color:'#f9a8d4', dur:5.2, del:1.2, shape:'1px' },
              { l:'85%', color:'#86efac', dur:4.2, del:2,   shape:'50%' },
              { l:'15%', color:'#fbbf24', dur:6,   del:2.5, shape:'50%' },
              { l:'93%', color:'#a5f3fc', dur:4.8, del:1,   shape:'2px' },
            ].map((c,i) => (
              <div key={i} style={{
                position:'absolute', top:-10, left:c.l,
                width: i%2===0?8:6, height: i%2===0?5:7,
                borderRadius:c.shape, background:c.color,
                animation:`confettiFall ${c.dur}s ${c.del}s linear infinite`,
                opacity: 0.7,
              }} />
            ))}
          </div>

          {/* ── SLIDE 0: Cover ── */}
          <div className={`bday-slide ${slide===0?'on':'off'}`}
            style={{ position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'space-between',padding:'28px 24px 24px' }}>

            <div style={{ width:'100%', textAlign:'center' }}>
              {/* Bunting flags */}
              <svg width="100%" viewBox="0 0 320 36" style={{ marginBottom:8 }}>
                <path d="M10 8 L55 22 L100 8 L145 22 L190 8 L235 22 L280 8 L310 18" stroke="#f9a8d4" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.6" fill="none"/>
                {[
                  { x:36, c:'#fecdd3', rot:-5 }, { x:75, c:'#ddd6fe', rot:4 },
                  { x:114, c:'#bfdbfe', rot:-3 }, { x:153, c:'#bbf7d0', rot:5 },
                  { x:192, c:'#fde68a', rot:-4 }, { x:231, c:'#fbcfe8', rot:3 },
                  { x:266, c:'#c7d2fe', rot:-2 },
                ].map((f,i) => (
                  <rect key={i} x={f.x} y={10} width={16} height={18} rx={1} fill={f.c} opacity={0.75}
                    transform={`rotate(${f.rot},${f.x+8},19)`} />
                ))}
                <circle cx="25" cy="6" r="3" fill="#fbbf24" opacity="0.8"/>
                <circle cx="295" cy="6" r="3" fill="#fbbf24" opacity="0.8"/>
                <circle cx="160" cy="4" r="2" fill="#f9a8d4" opacity="0.9"/>
              </svg>

              <span style={{ display:'inline-block', padding:'4px 14px', borderRadius:50, background:'#fce7f3', color:'#be185d', fontSize:11, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase' }}>
                Tabriklash
              </span>

              <div className="bounce-a" style={{ marginTop:14, fontFamily:"'Pacifico',cursive", fontSize:48, color:'#be185d', lineHeight:1.1, textShadow:'0 2px 0 rgba(255,182,220,0.5)' }}>
                {d.name}!
              </div>
              <div style={{ fontFamily:"'Dancing Script',cursive", fontSize:22, color:'#7c3aed', marginTop:2, fontWeight:700 }}>
                Tug'ilgan kuningiz muborak
              </div>
            </div>

            {/* Cake SVG */}
            <div style={{ display:'flex', justifyContent:'center' }}>
              <svg width="200" height="200" viewBox="0 0 200 200">
                <ellipse cx="100" cy="178" rx="70" ry="10" fill="#fce7f3" opacity="0.7"/>
                <rect x="40" y="128" width="120" height="48" rx="12" fill="#fecdd3"/>
                <rect x="40" y="128" width="120" height="14" rx="12" fill="#fda4af"/>
                <circle cx="70" cy="148" r="5" fill="#f9a8d4"/>
                <circle cx="100" cy="152" r="4" fill="#ddd6fe"/>
                <circle cx="130" cy="148" r="5" fill="#f9a8d4"/>
                <path d="M58 160 Q65 155 72 160 Q79 165 86 160 Q93 155 100 160 Q107 165 114 160 Q121 155 128 160 Q135 165 142 160" stroke="#fda4af" strokeWidth="2" fill="none" opacity="0.6"/>
                <rect x="55" y="88" width="90" height="42" rx="10" fill="#ddd6fe"/>
                <rect x="55" y="88" width="90" height="12" rx="10" fill="#c4b5fd"/>
                <circle cx="85" cy="106" r="4" fill="#f9a8d4"/>
                <circle cx="100" cy="110" r="3" fill="#fde68a"/>
                <circle cx="115" cy="106" r="4" fill="#86efac"/>
                <rect x="70" y="56" width="60" height="34" rx="8" fill="#bfdbfe"/>
                <rect x="70" y="56" width="60" height="10" rx="8" fill="#93c5fd"/>
                <path d="M72 56 Q76 48 80 56" fill="white" opacity="0.7"/>
                <path d="M85 56 Q89 46 93 56" fill="white" opacity="0.7"/>
                <path d="M98 56 Q102 48 106 56" fill="white" opacity="0.7"/>
                <path d="M111 56 Q115 46 119 56" fill="white" opacity="0.7"/>
                <path d="M124 56 Q126 50 128 56" fill="white" opacity="0.65"/>
                <rect x="85" y="32" width="9" height="24" rx="4" fill="#fde68a"/>
                <rect x="106" y="36" width="9" height="20" rx="4" fill="#f9a8d4"/>
                <ellipse cx="89" cy="30" rx="5" ry="8" fill="#fbbf24" opacity="0.9"/>
                <ellipse cx="89" cy="30" rx="3" ry="5" fill="#fef3c7"/>
                <ellipse cx="110" cy="34" rx="5" ry="8" fill="#fbbf24" opacity="0.9"/>
                <ellipse cx="110" cy="34" rx="3" ry="5" fill="#fef3c7"/>
                {[{x:26,y:110,d:'2s',dl:'0s'},{x:162,y:100,d:'2.4s',dl:'0.5s'},{x:30,y:155,d:'1.8s',dl:'1s'},{x:158,y:150,d:'2.2s',dl:'0.3s'}].map((s,i)=>(
                  <text key={i} x={s.x} y={s.y as any} fontSize="14" className="sparkle-a" style={{ animationDuration:s.d, animationDelay:s.dl }}>✦</text>
                ))}
              </svg>
            </div>

            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ width:50, height:1, background:'linear-gradient(90deg,transparent,#f9a8d4)' }}/>
                <div style={{ fontSize:11, fontWeight:700, letterSpacing:'0.15em', textTransform:'uppercase', color:'#be185d', opacity:0.7 }}>
                  {d.age} yosh
                </div>
                <div style={{ width:50, height:1, background:'linear-gradient(90deg,#f9a8d4,transparent)' }}/>
              </div>
            </div>
          </div>

          {/* ── SLIDE 1: Message ── */}
          <div className={`bday-slide ${slide===1?'on':'off'}`}
            style={{ position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'28px 24px' }}>

            {/* Balloons */}
            <svg width="300" height="130" viewBox="0 0 300 130" style={{ marginBottom:-10 }}>
              {[
                { cx:60,  cy:62, rx:26, ry:30, fill:'#fecdd3', sc:'#fecdd3', sx:57 },
                { cx:106, cy:58, rx:24, ry:28, fill:'#ddd6fe', sc:'#ddd6fe', sx:103 },
                { cx:150, cy:54, rx:28, ry:32, fill:'#bfdbfe', sc:'#bfdbfe', sx:147 },
                { cx:195, cy:58, rx:24, ry:28, fill:'#bbf7d0', sc:'#bbf7d0', sx:192 },
                { cx:240, cy:62, rx:26, ry:30, fill:'#fde68a', sc:'#fde68a', sx:237 },
              ].map((b,i) => {
                const bot = b.cy + b.ry
                return (
                  <g key={i}>
                    <path d={`M${b.cx} ${bot+2} Q${b.cx+2} ${bot+14} ${b.cx+3} 120`} stroke={b.fill} strokeWidth="1.2" fill="none"/>
                    <ellipse cx={b.cx} cy={b.cy} rx={b.rx} ry={b.ry} fill={b.fill}/>
                    <ellipse cx={b.cx-b.rx*0.35} cy={b.cy-b.ry*0.3} rx={b.rx*0.38} ry={b.ry*0.38} fill="rgba(255,255,255,0.38)"/>
                    <path d={`M${b.sx} ${bot} L${b.cx} ${bot+10} L${b.cx+3} ${bot}`} fill={b.fill}/>
                  </g>
                )
              })}
              <circle cx="30" cy="40" r="3" fill="#f9a8d4" opacity="0.6"/>
              <circle cx="270" cy="35" r="3" fill="#c4b5fd" opacity="0.6"/>
              <circle cx="150" cy="15" r="4" fill="#fbbf24" opacity="0.7"/>
            </svg>

            {/* Message box */}
            <div style={{
              background:'rgba(255,255,255,0.72)', border:'1.5px solid rgba(253,186,212,0.4)',
              borderRadius:24, padding:'24px 22px 20px', width:'100%', textAlign:'center',
              backdropFilter:'blur(8px)',
            }}>
              <div style={{ fontFamily:"'Dancing Script',cursive", fontSize:19, fontWeight:700, color:'#7c3aed', marginBottom:14 }}>
                Aziz {d.name},
              </div>
              <div style={{ fontSize:13.5, color:'#4c1d95', lineHeight:1.85 }}>
                {d.message.split('\n').map((l: string,i: number) => <div key={i}>{l || <br/>}</div>)}
              </div>
              <div style={{ marginTop:16, display:'flex', justifyContent:'center', gap:10 }}>
                {['🎀','🌸','🎀'].map((e,i)=>(
                  <span key={i} className="bounce-a" style={{ fontSize:18, animationDelay:`${i*0.3}s` }}>{e}</span>
                ))}
              </div>
            </div>

            <div style={{ marginTop:14, display:'flex', gap:10, justifyContent:'center', flexWrap:'wrap' }}>
              {['Muhabbat','Baxt','Sog\'lik'].map((t,i)=>(
                <span key={i} style={{
                  display:'inline-block', padding:'4px 14px', borderRadius:50, fontSize:11, fontWeight:700,
                  letterSpacing:'0.1em', textTransform:'uppercase',
                  background: i===0?'#fce7f3': i===1?'#ede9fe':'#ecfdf5',
                  color: i===0?'#be185d': i===1?'#5b21b6':'#065f46',
                }}>{t}</span>
              ))}
            </div>
          </div>

          {/* ── SLIDE 2: Wishes / Closing ── */}
          <div className={`bday-slide ${slide===2?'on':'off'}`}
            style={{ position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'space-between',padding:'28px 22px 24px' }}>

            {/* Top arch */}
            <div style={{ textAlign:'center', width:'100%' }}>
              <svg width="100%" viewBox="0 0 300 50">
                <path d="M20 46 Q150 -8 280 46" stroke="#f9a8d4" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                <path d="M30 46 Q150 2 270 46" stroke="#ddd6fe" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.6"/>
                {[{cx:55,cy:25,r:4,c:'#fecdd3'},{cx:95,cy:12,r:5,c:'#ddd6fe'},{cx:150,cy:7,r:6,c:'#bfdbfe'},{cx:205,cy:12,r:5,c:'#bbf7d0'},{cx:245,cy:25,r:4,c:'#fde68a'}].map((s,i)=>(
                  <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill={s.c}/>
                ))}
              </svg>
              <div style={{ fontFamily:"'Pacifico',cursive", fontSize:22, color:'#be185d', textShadow:'0 2px 0 rgba(255,182,220,0.4)', marginTop:4 }}>
                Tilaklarimiz
              </div>
              <div style={{ fontFamily:"'Dancing Script',cursive", fontSize:15, color:'#7c3aed', fontWeight:700, marginTop:2, marginBottom:14 }}>
                {d.name}ga — sevgi bilan 💖
              </div>
            </div>

            {/* Wish cards grid */}
            <div style={{ width:'100%', display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, flex:1 }}>
              {d.wishes.map((w: any,i: number) => (
                <div key={i} className="wish-item" style={{ animationDelay:`${i*0.12}s` }}>
                  <div style={{
                    background:'rgba(255,255,255,0.75)',
                    border:`1.5px solid ${['rgba(253,186,212,0.45)','rgba(196,181,253,0.45)','rgba(147,196,253,0.45)','rgba(134,239,172,0.45)','rgba(253,211,77,0.4)','rgba(249,168,212,0.45)'][i%6]}`,
                    borderRadius:16, padding:'12px 10px', textAlign:'center',
                    backdropFilter:'blur(6px)', height:'100%',
                    display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:6,
                  }}>
                    <span style={{ fontSize:24, animationDelay:`${i*0.2}s` }} className="bounce-a">{w.icon}</span>
                    <div style={{ fontSize:11.5, color:'#4c1d95', lineHeight:1.4, fontWeight:600 }}>{w.text}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Sign off */}
            <div style={{ textAlign:'center', marginTop:12 }}>
              <div style={{ fontFamily:"'Dancing Script',cursive", fontSize:17, color:'#be185d', fontWeight:700 }}>
                — {d.from}
              </div>
              <svg width="140" height="16" viewBox="0 0 140 16" style={{ marginTop:4 }}>
                <path d="M10 8 Q35 2 70 8 Q105 14 130 8" stroke="#f9a8d4" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                <circle cx="10" cy="8" r="3" fill="#fecdd3"/>
                <circle cx="70" cy="8" r="4" fill="#fbbf24"/>
                <circle cx="130" cy="8" r="3" fill="#fecdd3"/>
              </svg>
            </div>
          </div>

        </div>

        {/* Dot nav */}
        <div style={{ display:'flex', gap:8, justifyContent:'center', marginTop:10 }}>
          {[0,1,2].map(i=>(
            <button key={i} onClick={e=>{e.stopPropagation();goTo(i)}} style={{
              height:7, width: slide===i ? 22 : 7, borderRadius:4, border:'none', cursor:'pointer',
              background: slide===i
                ? ['linear-gradient(90deg,#f9a8d4,#be185d)','linear-gradient(90deg,#c4b5fd,#7c3aed)','linear-gradient(90deg,#86efac,#059669)'][i]
                : 'rgba(196,181,253,0.35)',
              transition:'all 0.4s ease', padding:0,
            }}/>
          ))}
        </div>
        <div style={{ textAlign:'center', marginTop:5, fontSize:11, color:'#be185d', opacity:0.6, fontWeight:600, letterSpacing:'0.08em' }}>
          bosish orqali o'tish
        </div>
      </div>
    </>
  )
}
