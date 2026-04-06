import { useState, useEffect } from "react";

// ── localStorage 헬퍼 ──────────────────────────────────
const _store = window.__appStore = window.__appStore || {};
const loadLS = (key, def) => {
  try{ const ls = localStorage.getItem(key); if(ls) return JSON.parse(ls); }catch{}
  return _store[key] !== undefined ? _store[key] : def;
};
const saveLS = (key, val) => {
  _store[key] = val;
  try{ localStorage.setItem(key, JSON.stringify(val)); }catch{}
};

// ── 캠핑 음식 아이디어 ─────────────────────────────────
const CAMPING_FOODS = [
  { cat:"🔥 그릴/바베큐", color:"#C62828", foods:[
    "소갈비","돼지갈비","삼겹살","목살","항정살","차돌박이","스테이크","치킨윙","닭꼬치","소시지구이",
    "새우구이","오징어구이","가리비구이","전복구이","랍스터구이","꽁치구이","고등어구이","연어구이",
    "불고기","LA갈비","양념갈비","간장닭구이","숯불닭갈비","바베큐립","풀드포크","버거패티","핫도그",
    "할라피뇨 소시지","치즈 소시지","브랏부어스트","양꼬치","램찹","스파이시 윙",
  ]},
  { cat:"🍳 캠핑 요리", color:"#E65100", foods:[
    "부대찌개","캠핑 스파게티","원팬 파스타","캠핑 라멘","나베","샤브샤브","김치찌개","된장찌개",
    "짜파구리","불닭볶음면","라볶이","떡볶이","어묵탕","순대볶음","닭갈비 볶음밥","김치볶음밥",
    "캠핑 리조또","스팸 무스비","참치마요 주먹밥","김밥","캠핑 카레","수제버거","핫도그 번",
    "치즈 닭갈비","불닭 치즈볶음밥","마라탕","훠궈","나시고렝","캠핑 타코","케사디아",
  ]},
  { cat:"🍕 피자 & 빵", color:"#F57F17", foods:[
    "캠핑 피자 (더치오븐)","포카치아","마늘빵","모닥불 빵 (반죽꼬치)","또띠아 피자","난 피자",
    "캠핑 시나몬롤","팬케이크","프렌치토스트","와플","크레이프","스콘","머핀","바나나브레드",
    "캠핑 그릴드 치즈","몬테크리스토 샌드위치","BLT 샌드위치","불고기 샌드위치",
  ]},
  { cat:"🥘 더치오븐", color:"#6A1B9A", foods:[
    "더치오븐 찜닭","더치오븐 갈비찜","더치오븐 로스트 치킨","더치오븐 풀드포크",
    "더치오븐 감자 수프","더치오븐 클램 차우더","더치오븐 비프 스튜","더치오븐 칠리",
    "더치오븐 파에야","더치오븐 리조또","더치오븐 코블러","더치오븐 브라우니",
    "더치오븐 콘브레드","더치오븐 애플 크럼블","더치오븐 복숭아 코블러",
  ]},
  { cat:"🌽 꼬치 & 스틱", color:"#2E7D32", foods:[
    "소고기 꼬치","닭 꼬치","새우 꼬치","채소 꼬치","버섯 꼬치","모듬 해물 꼬치",
    "마시멜로 구이","초코바나나 꼬치","과일 꼬치","스모어 (마시멜로+초콜릿+그래함)","핫도그 꼬치",
    "소시지 꼬치","치즈 핫도그 꼬치","문어 꼬치","가래떡 꼬치","떡 꼬치",
  ]},
  { cat:"🥗 사이드 & 샐러드", color:"#00695C", foods:[
    "코울슬로","감자 샐러드","파스타 샐러드","콘 샐러드","카프레제","그릴드 아스파라거스",
    "그릴드 옥수수","알루미늄 포일 감자","포일 고구마","포일 옥수수 버터",
    "캠핑 콩 샐러드","그릴드 파프리카","구운 마늘빵","감자튀김","어니언링",
    "피클","김치","깍두기","양파 장아찌","마늘 장아찌",
  ]},
  { cat:"🍜 라면 & 면류", color:"#1565C0", foods:[
    "신라면","짜파게티","불닭볶음면","참깨라면","너구리","안성탕면","육개장라면",
    "짜파구리 (짜파게티+너구리)","라면 나베","계란 라면","김치 라면","치즈 라면",
    "라면 볶음밥","쌀국수","우동","소바","냉면 (여름캠핑)","비빔면",
  ]},
  { cat:"🍫 디저트 & 스낵", color:"#4A148C", foods:[
    "스모어","캠핑 브라우니 (더치오븐)","그릴드 파인애플","꿀 바나나 구이","초코 바나나 포일구이",
    "캠핑 쿠키","그래함 크래커","마시멜로","핫초코","캠핑 도넛","시나몬 슈가 또띠아",
    "캠핑 아이스크림 샌드위치","과일 꼬치+초콜릿 소스","팝콘","트레일 믹스","에너지바",
    "칩스&딥","나초&살사","캠핑 치즈보드","크래커&훔무스",
  ]},
  { cat:"☕ 음료 & 브런치", color:"#4E342E", foods:[
    "캠핑 드립커피","모닥불 커피 (카우보이 커피)","핫초코","캠핑 라테","차","모히토",
    "샹그리아","캠핑 칵테일","레몬에이드","수박 주스","과일 펀치",
    "베이컨 에그","캠핑 스크램블","버섯 오믈렛","에그인헬 (샤크슈카)","해시브라운",
    "캠핑 아사이볼","오버나이트 오트밀","그래놀라",
  ]},
  { cat:"🏡 뒷마당 특선", color:"#558B2F", foods:[
    "백야드 BBQ 파티","저크 치킨","맥앤치즈 (더치오븐)","콘 온 더 콥","바베큐 베이크드빈",
    "코울슬로","포테이토 샐러드","워터멜론 슬라이스","레모네이드","아이스 티",
    "버거 바 (토핑 셀프)","타코 바 (토핑 셀프)","핫도그 바","피자 바","나초 바",
    "스모어 바 (재료 셀프)","아이스크림 바","시럽 소다 바","과일 꼬치 바",
    "수제 버거","BLT 슬라이더","미니 핫도그","치킨 슬라이더",
  ]},
];

const CONTENT_TAGS = {
  "그릴/바베큐": ["#캠핑바베큐","#캠핑그릴","#아웃도어쿡","#캠핑먹방","#캠핑고기"],
  "캠핑 요리": ["#캠핑요리","#캠핑밥","#캠핑레시피","#원팬요리","#캠핑쿡"],
  "피자 & 빵": ["#캠핑피자","#캠핑빵","#더치오븐요리","#캠핑베이킹"],
  "더치오븐": ["#더치오븐","#더치오븐요리","#캠핑쿡","#아웃도어쿠킹"],
  "꼬치 & 스틱": ["#캠핑꼬치","#모닥불요리","#캠핑스낵","#캠핑간식"],
  "뒷마당 특선": ["#백야드바베큐","#홈캠핑","#뒷마당파티","#가족바베큐","#백야드"],
};

export default function CampingPlanner() {
  // ── State ──────────────────────────────────────────
  const [tab, setTab] = useState("menu");
  const [campingTrips, setCampingTrips] = useState(() => loadLS("cp_trips", []));
  const [activeTrip, setActiveTrip] = useState(null);
  const [backyard, setBackyard] = useState(() => loadLS("cp_backyard", { menus:[], notes:"" }));
  const [savedMenus, setSavedMenus] = useState(() => loadLS("cp_savedMenus", []));
  const [customFoods, setCustomFoods] = useState(() => loadLS("cp_customFoods", {}));
  const [activeCat, setActiveCat] = useState(CAMPING_FOODS[0].cat);
  const [search, setSearch] = useState("");
  const [addTripModal, setAddTripModal] = useState(false);
  const [tripForm, setTripForm] = useState({ name:"", date:"", location:"", nights:1 });
  const [customInput, setCustomInput] = useState("");
  const [contentModal, setContentModal] = useState(null);
  const [shoppingModal, setShoppingModal] = useState(null);
  const [menuNote, setMenuNote] = useState("");

  // ── Auto-save ──────────────────────────────────────
  useEffect(() => saveLS("cp_trips", campingTrips), [campingTrips]);
  useEffect(() => saveLS("cp_backyard", backyard), [backyard]);
  useEffect(() => saveLS("cp_savedMenus", savedMenus), [savedMenus]);
  useEffect(() => saveLS("cp_customFoods", customFoods), [customFoods]);

  // ── Helpers ────────────────────────────────────────
  const isSaved = (name) => savedMenus.includes(name);
  const toggleSave = (name) => setSavedMenus(p => p.includes(name) ? p.filter(x => x !== name) : [...p, name]);

  const addToTrip = (tripId, food) => {
    setCampingTrips(p => p.map(t => t.id === tripId
      ? { ...t, menus: [...(t.menus||[]), { name:food, checked:false }] }
      : t
    ));
  };
  const addToBackyard = (food) => {
    setBackyard(p => ({ ...p, menus: [...(p.menus||[]), { name:food, checked:false }] }));
  };
  const toggleMenuCheck = (tripId, idx) => {
    if(tripId === "backyard") {
      setBackyard(p => ({ ...p, menus: p.menus.map((m,i) => i===idx ? {...m,checked:!m.checked} : m) }));
    } else {
      setCampingTrips(p => p.map(t => t.id===tripId
        ? { ...t, menus: t.menus.map((m,i) => i===idx ? {...m,checked:!m.checked} : m) }
        : t
      ));
    }
  };
  const removeMenu = (tripId, idx) => {
    if(tripId === "backyard") {
      setBackyard(p => ({ ...p, menus: p.menus.filter((_,i) => i!==idx) }));
    } else {
      setCampingTrips(p => p.map(t => t.id===tripId
        ? { ...t, menus: t.menus.filter((_,i) => i!==idx) }
        : t
      ));
    }
  };

  const getCatColor = (name) => {
    for(const c of CAMPING_FOODS) if(c.foods.includes(name)||(customFoods[c.cat]||[]).includes(name)) return c.color;
    return "#888";
  };
  const getCatName = (name) => {
    for(const c of CAMPING_FOODS) if(c.foods.includes(name)||(customFoods[c.cat]||[]).includes(name)) return c.cat.replace(/\S+ /,"");
    return "";
  };

  const allFilteredFoods = search
    ? CAMPING_FOODS.flatMap(c => [...c.foods,...(customFoods[c.cat]||[])].filter(f=>f.includes(search)).map(f=>({f,color:c.color,cat:c.cat})))
    : (()=>{
        const c = CAMPING_FOODS.find(c=>c.cat===activeCat);
        const all = [...(c?.foods||[]), ...(customFoods[activeCat]||[])];
        return all.map(f=>({f,color:c?.color||"#888",cat:activeCat}));
      })();

  const trip = campingTrips.find(t=>t.id===activeTrip);

  return (
    <div style={{fontFamily:"'Noto Sans KR',sans-serif",background:"#F2F0EB",minHeight:"100vh",maxWidth:480,margin:"0 auto",paddingBottom:60}}>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900&display=swap" rel="stylesheet"/>

      {/* ── 헤더 ── */}
      <div style={{background:"linear-gradient(135deg,#2D5016,#4A7C23)",padding:"22px 16px 16px",color:"#fff"}}>
        <div style={{fontSize:11,letterSpacing:3,color:"rgba(255,255,255,0.5)",textTransform:"uppercase",marginBottom:4}}>Camping Planner</div>
        <h1 style={{fontSize:24,fontWeight:900,margin:"0 0 12px"}}>🏕️ 캠핑 플래너</h1>
        {/* 탭 */}
        <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:2}}>
          {[["menu","🍖 음식 아이디어"],["trips","🏕️ 캠핑 목록"],["backyard","🏡 뒷마당"],["saved","⭐ 저장목록"]].map(([key,label])=>(
            <button key={key} onClick={()=>setTab(key)} style={{
              padding:"7px 12px",borderRadius:20,border:"none",flexShrink:0,cursor:"pointer",
              background:tab===key?"rgba(255,255,255,0.9)":"rgba(255,255,255,0.15)",
              color:tab===key?"#2D5016":"#fff",fontSize:11,fontWeight:700,
            }}>{label}</button>
          ))}
        </div>
      </div>

      <div style={{padding:"14px"}}>

        {/* ══ 음식 아이디어 탭 ══ */}
        {tab==="menu"&&(
          <div>
            {/* 검색 */}
            <div style={{position:"relative",marginBottom:12}}>
              <span style={{position:"absolute",left:11,top:"50%",transform:"translateY(-50%)",color:"#bbb"}}>🔍</span>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="음식 검색..."
                style={{width:"100%",padding:"10px 12px 10px 32px",borderRadius:12,border:"2px solid #E8E3DC",fontSize:13,outline:"none",boxSizing:"border-box",background:"#fff"}}/>
            </div>

            {/* 카테고리 탭 */}
            {!search&&(
              <div style={{display:"flex",gap:6,overflowX:"auto",marginBottom:12,paddingBottom:3}}>
                {CAMPING_FOODS.map(c=>(
                  <button key={c.cat} onClick={()=>setActiveCat(c.cat)} style={{
                    padding:"6px 11px",borderRadius:20,border:"none",flexShrink:0,cursor:"pointer",
                    background:activeCat===c.cat?c.color:"#fff",
                    color:activeCat===c.cat?"#fff":"#666",
                    fontSize:11,fontWeight:700,
                  }}>{c.cat}</button>
                ))}
              </div>
            )}

            {/* 직접 추가 */}
            <div style={{display:"flex",gap:7,marginBottom:12}}>
              <input value={customInput} onChange={e=>setCustomInput(e.target.value)}
                onKeyDown={e=>{if(e.key==="Enter"&&customInput.trim()){
                  setCustomFoods(p=>({...p,[activeCat]:[...new Set([...(p[activeCat]||[]),customInput.trim()])]}));
                  setCustomInput("");
                }}}
                placeholder="없는 음식 직접 추가..."
                style={{flex:1,padding:"9px 12px",borderRadius:11,border:"2px solid #E8E3DC",fontSize:12,outline:"none"}}/>
              <button onClick={()=>{
                if(!customInput.trim()) return;
                setCustomFoods(p=>({...p,[activeCat]:[...new Set([...(p[activeCat]||[]),customInput.trim()])]}));
                setCustomInput("");
              }} style={{padding:"9px 14px",borderRadius:11,border:"none",background:"#4A7C23",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer"}}>+</button>
            </div>

            {/* 저장된 메뉴 */}
            {savedMenus.length>0&&!search&&(
              <div style={{background:"#FFF8E1",borderRadius:12,padding:"10px 13px",marginBottom:12,border:"1px solid #FFE082"}}>
                <div style={{fontSize:11,fontWeight:700,color:"#F57F17",marginBottom:7}}>⭐ 저장한 메뉴 ({savedMenus.length}개)</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                  {savedMenus.map(f=>(
                    <span key={f} onClick={()=>toggleSave(f)} style={{padding:"4px 10px",borderRadius:15,background:"#FFD54F",color:"#2C2C2C",fontSize:12,fontWeight:700,cursor:"pointer"}}>{f} ×</span>
                  ))}
                </div>
              </div>
            )}

            {/* 음식 목록 */}
            <div style={{display:"flex",flexWrap:"wrap",gap:7,marginBottom:12}}>
              {allFilteredFoods.map(({f,color,cat})=>(
                <button key={f+cat} onClick={()=>setContentModal({name:f,color,cat})} style={{
                  padding:"7px 12px",borderRadius:20,
                  border:`2px solid ${isSaved(f)?color:"#E8E3DC"}`,
                  background:isSaved(f)?color:"#fff",
                  color:isSaved(f)?"#fff":"#444",
                  fontSize:12,fontWeight:isSaved(f)?700:400,cursor:"pointer",
                  display:"flex",alignItems:"center",gap:4,
                }}>
                  {isSaved(f)&&"⭐ "}{f}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ══ 캠핑 목록 탭 ══ */}
        {tab==="trips"&&(
          <div>
            <button onClick={()=>setAddTripModal(true)} style={{width:"100%",padding:"13px",borderRadius:13,border:"2px dashed #4A7C23",background:"#fff",color:"#4A7C23",fontSize:13,fontWeight:700,cursor:"pointer",marginBottom:14}}>
              + 새 캠핑 추가
            </button>

            {campingTrips.length===0&&(
              <div style={{textAlign:"center",padding:"40px",color:"#bbb"}}>
                <div style={{fontSize:40,marginBottom:10}}>🏕️</div>
                <div style={{fontSize:14,fontWeight:700}}>아직 캠핑 일정이 없어요</div>
                <div style={{fontSize:12,marginTop:4}}>위 버튼으로 추가해보세요!</div>
              </div>
            )}

            {campingTrips.map(t=>(
              <div key={t.id} style={{background:"#fff",borderRadius:14,overflow:"hidden",marginBottom:12,boxShadow:"0 2px 8px rgba(0,0,0,0.07)"}}>
                {/* 헤더 */}
                <div onClick={()=>setActiveTrip(activeTrip===t.id?null:t.id)} style={{
                  padding:"13px 15px",background:"linear-gradient(135deg,#2D5016,#4A7C23)",
                  display:"flex",alignItems:"center",justifyContent:"space-between",cursor:"pointer",
                }}>
                  <div>
                    <div style={{fontSize:15,fontWeight:900,color:"#fff"}}>{t.name}</div>
                    <div style={{fontSize:11,color:"rgba(255,255,255,0.7)",marginTop:2}}>{t.date} · {t.location} · {t.nights}박</div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontSize:11,background:"rgba(255,255,255,0.2)",color:"#fff",borderRadius:10,padding:"3px 8px"}}>{(t.menus||[]).length}개 메뉴</span>
                    <span style={{color:"rgba(255,255,255,0.7)",fontSize:14}}>{activeTrip===t.id?"▲":"▽"}</span>
                  </div>
                </div>

                {activeTrip===t.id&&(
                  <div style={{padding:"12px"}}>
                    {/* 메뉴 추가 버튼 */}
                    <button onClick={()=>setTab("menu")} style={{width:"100%",padding:"9px",borderRadius:10,border:"2px dashed #ccc",background:"#F8F7F4",color:"#888",fontSize:12,fontWeight:700,cursor:"pointer",marginBottom:10}}>
                      🍖 음식 아이디어에서 추가
                    </button>

                    {/* 메뉴 목록 */}
                    {(t.menus||[]).length===0?(
                      <div style={{textAlign:"center",padding:"16px",color:"#ccc",fontSize:12}}>메뉴를 추가해보세요!</div>
                    ):(
                      <div style={{display:"flex",flexDirection:"column",gap:6}}>
                        {(t.menus||[]).map((m,i)=>(
                          <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 10px",background:m.checked?"#F1F8E9":"#F8F7F4",borderRadius:10,border:`1px solid ${m.checked?"#A5D6A7":"#E8E3DC"}`}}>
                            <input type="checkbox" checked={m.checked} onChange={()=>toggleMenuCheck(t.id,i)} style={{accentColor:"#4A7C23",width:16,height:16,flexShrink:0,cursor:"pointer"}}/>
                            <span style={{flex:1,fontSize:13,fontWeight:600,color:m.checked?"#aaa":"#2C2C2C",textDecoration:m.checked?"line-through":"none"}}>{m.name}</span>
                            <span style={{fontSize:10,color:getCatColor(m.name),fontWeight:700}}>{getCatName(m.name)}</span>
                            <button onClick={()=>removeMenu(t.id,i)} style={{background:"none",border:"none",color:"#ddd",fontSize:16,cursor:"pointer",padding:0}}>×</button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* 장보기 리스트 */}
                    {(t.menus||[]).length>0&&(
                      <button onClick={()=>setShoppingModal(t)} style={{width:"100%",marginTop:10,padding:"10px",borderRadius:10,border:"none",background:"#4A7C23",color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer"}}>
                        🛒 이번 캠핑 장보기 리스트
                      </button>
                    )}

                    {/* 삭제 */}
                    <button onClick={()=>{if(window.confirm("이 캠핑을 삭제할까요?"))setCampingTrips(p=>p.filter(x=>x.id!==t.id));}} style={{width:"100%",marginTop:6,padding:"8px",borderRadius:9,border:"2px solid #FFEBEE",background:"#fff",color:"#C62828",fontSize:11,fontWeight:700,cursor:"pointer"}}>
                      🗑️ 삭제
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ══ 뒷마당 탭 ══ */}
        {tab==="backyard"&&(
          <div>
            <div style={{background:"linear-gradient(135deg,#33691E,#558B2F)",borderRadius:14,padding:"14px 16px",marginBottom:14,color:"#fff"}}>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.6)",marginBottom:2}}>Backyard Camping</div>
              <div style={{fontSize:20,fontWeight:900}}>🏡 뒷마당 캠핑</div>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.6)",marginTop:4}}>콘텐츠용 메뉴 관리</div>
            </div>

            {/* 메모 */}
            <div style={{background:"#fff",borderRadius:12,padding:"12px",marginBottom:12,boxShadow:"0 2px 6px rgba(0,0,0,0.06)"}}>
              <div style={{fontSize:11,fontWeight:700,color:"#558B2F",marginBottom:6}}>📝 메모 / 콘셉트</div>
              <textarea value={backyard.notes||""} onChange={e=>setBackyard(p=>({...p,notes:e.target.value}))}
                placeholder="뒷마당 캠핑 콘셉트, 아이디어 메모..."
                style={{width:"100%",padding:"9px 11px",borderRadius:9,border:"2px solid #E8E3DC",fontSize:12,outline:"none",resize:"none",minHeight:60,boxSizing:"border-box"}}/>
            </div>

            {/* 음식 아이디어에서 추가 버튼 */}
            <button onClick={()=>setTab("menu")} style={{width:"100%",padding:"11px",borderRadius:12,border:"2px dashed #558B2F",background:"#fff",color:"#558B2F",fontSize:12,fontWeight:700,cursor:"pointer",marginBottom:12}}>
              🍖 음식 아이디어에서 추가
            </button>

            {/* 메뉴 목록 */}
            {(backyard.menus||[]).length===0?(
              <div style={{textAlign:"center",padding:"30px",color:"#ccc"}}>
                <div style={{fontSize:36,marginBottom:8}}>🌿</div>
                <div style={{fontSize:13,fontWeight:700}}>뒷마당 메뉴를 추가해보세요!</div>
              </div>
            ):(
              <div style={{background:"#fff",borderRadius:13,overflow:"hidden",boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}}>
                <div style={{padding:"10px 14px",background:"#558B2F",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontSize:13,fontWeight:700,color:"#fff"}}>🍽️ 메뉴 ({(backyard.menus||[]).length}개)</span>
                  <button onClick={()=>setShoppingModal({id:"backyard",name:"뒷마당 캠핑",menus:backyard.menus})} style={{padding:"4px 10px",borderRadius:8,border:"none",background:"rgba(255,255,255,0.2)",color:"#fff",fontSize:10,fontWeight:700,cursor:"pointer"}}>🛒 장보기</button>
                </div>
                <div style={{padding:"10px 12px",display:"flex",flexDirection:"column",gap:6}}>
                  {(backyard.menus||[]).map((m,i)=>(
                    <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 10px",background:m.checked?"#F1F8E9":"#F8F7F4",borderRadius:10,border:`1px solid ${m.checked?"#A5D6A7":"#E8E3DC"}`}}>
                      <input type="checkbox" checked={m.checked} onChange={()=>toggleMenuCheck("backyard",i)} style={{accentColor:"#558B2F",width:16,height:16,cursor:"pointer"}}/>
                      <span style={{flex:1,fontSize:13,fontWeight:600,color:m.checked?"#aaa":"#2C2C2C",textDecoration:m.checked?"line-through":"none"}}>{m.name}</span>
                      <button onClick={()=>setContentModal({name:m.name,color:getCatColor(m.name),cat:""})} style={{fontSize:11,color:"#558B2F",background:"#E8F5E9",border:"none",borderRadius:8,padding:"3px 8px",cursor:"pointer",fontWeight:700}}>콘텐츠</button>
                      <button onClick={()=>removeMenu("backyard",i)} style={{background:"none",border:"none",color:"#ddd",fontSize:16,cursor:"pointer",padding:0}}>×</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══ 저장 목록 탭 ══ */}
        {tab==="saved"&&(
          <div>
            <div style={{background:"#fff",borderRadius:13,padding:"14px",boxShadow:"0 2px 8px rgba(0,0,0,0.06)",marginBottom:12}}>
              <div style={{fontSize:12,fontWeight:700,color:"#F57F17",marginBottom:10}}>⭐ 저장한 메뉴 ({savedMenus.length}개)</div>
              {savedMenus.length===0?(
                <div style={{textAlign:"center",padding:"20px",color:"#ccc",fontSize:12}}>
                  음식 아이디어에서 ⭐ 탭해서 저장해보세요!
                </div>
              ):(
                <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
                  {savedMenus.map(f=>(
                    <div key={f} style={{display:"flex",alignItems:"center",gap:0,background:"#FFF8E1",borderRadius:20,border:"1px solid #FFE082",overflow:"hidden"}}>
                      <span onClick={()=>setContentModal({name:f,color:getCatColor(f),cat:""})} style={{padding:"7px 11px",fontSize:12,fontWeight:700,color:"#2C2C2C",cursor:"pointer"}}>{f}</span>
                      <span onClick={()=>toggleSave(f)} style={{padding:"7px 10px 7px 0",fontSize:12,color:"#aaa",cursor:"pointer"}}>×</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 어떤 캠핑에 추가할지 */}
            {savedMenus.length>0&&campingTrips.length>0&&(
              <div style={{background:"#fff",borderRadius:13,padding:"14px",boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}}>
                <div style={{fontSize:12,fontWeight:700,color:"#4A7C23",marginBottom:10}}>🏕️ 캠핑에 추가</div>
                <div style={{display:"flex",flexDirection:"column",gap:7}}>
                  {campingTrips.map(t=>(
                    <button key={t.id} onClick={()=>{savedMenus.forEach(f=>addToTrip(t.id,f));alert(`${t.name}에 ${savedMenus.length}개 메뉴 추가됐어요!`);}} style={{
                      padding:"10px 14px",borderRadius:10,border:"2px solid #4A7C23",
                      background:"#F1F8E9",color:"#2D5016",fontSize:12,fontWeight:700,cursor:"pointer",textAlign:"left",
                    }}>+ {t.name}에 전체 추가</button>
                  ))}
                  <button onClick={()=>{savedMenus.forEach(f=>addToBackyard(f));alert(`뒷마당 캠핑에 ${savedMenus.length}개 메뉴 추가됐어요!`);}} style={{
                    padding:"10px 14px",borderRadius:10,border:"2px solid #558B2F",
                    background:"#F9FBE7",color:"#33691E",fontSize:12,fontWeight:700,cursor:"pointer",textAlign:"left",
                  }}>+ 🏡 뒷마당에 전체 추가</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ══ 새 캠핑 추가 모달 ══ */}
      {addTripModal&&(
        <div onClick={()=>setAddTripModal(false)} style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.55)",zIndex:1000,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
          <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:"20px 20px 0 0",padding:"22px 18px 40px",width:"100%",maxWidth:480}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <div style={{fontSize:17,fontWeight:900,color:"#2D5016"}}>🏕️ 새 캠핑 추가</div>
              <button onClick={()=>setAddTripModal(false)} style={{background:"#F4F2F9",border:"none",borderRadius:20,width:30,height:30,fontSize:15,cursor:"pointer"}}>✕</button>
            </div>
            {[["name","캠핑 이름","예: 지리산 캠핑","text"],["date","날짜","2026-05-01","date"],["location","장소","예: 지리산 성삼재","text"]].map(([key,label,ph,type])=>(
              <div key={key} style={{marginBottom:11}}>
                <div style={{fontSize:11,fontWeight:700,color:"#666",marginBottom:5}}>{label}</div>
                <input type={type} value={tripForm[key]} onChange={e=>setTripForm(p=>({...p,[key]:e.target.value}))} placeholder={ph}
                  style={{width:"100%",padding:"10px 12px",borderRadius:10,border:"2px solid #E8E3DC",fontSize:13,outline:"none",boxSizing:"border-box"}}/>
              </div>
            ))}
            <div style={{marginBottom:16}}>
              <div style={{fontSize:11,fontWeight:700,color:"#666",marginBottom:5}}>박수</div>
              <div style={{display:"flex",gap:7}}>
                {[1,2,3,4,5].map(n=>(
                  <button key={n} onClick={()=>setTripForm(p=>({...p,nights:n}))} style={{flex:1,padding:"9px",borderRadius:9,border:"none",background:tripForm.nights===n?"#4A7C23":"#F0EDE8",color:tripForm.nights===n?"#fff":"#888",fontSize:13,fontWeight:700,cursor:"pointer"}}>{n}박</button>
                ))}
              </div>
            </div>
            <button onClick={()=>{
              if(!tripForm.name) return;
              setCampingTrips(p=>[...p,{...tripForm,id:Date.now().toString(),menus:[]}]);
              setTripForm({name:"",date:"",location:"",nights:1});
              setAddTripModal(false);
              setTab("trips");
            }} style={{width:"100%",padding:"14px",borderRadius:12,border:"none",background:"#4A7C23",color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer"}}>
              저장
            </button>
          </div>
        </div>
      )}

      {/* ══ 콘텐츠 아이디어 모달 ══ */}
      {contentModal&&(
        <div onClick={()=>setContentModal(null)} style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.55)",zIndex:1000,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
          <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:"20px 20px 0 0",padding:"22px 18px 40px",width:"100%",maxWidth:480,maxHeight:"85vh",overflowY:"auto"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
              <div>
                <div style={{fontSize:11,color:"#aaa"}}>캠핑 콘텐츠 아이디어</div>
                <div style={{fontSize:20,fontWeight:900,color:"#2D5016"}}>{contentModal.name}</div>
              </div>
              <div style={{display:"flex",gap:7,alignItems:"center"}}>
                <button onClick={()=>toggleSave(contentModal.name)} style={{padding:"6px 12px",borderRadius:20,border:"none",background:isSaved(contentModal.name)?"#FFD54F":"#F0EDE8",color:isSaved(contentModal.name)?"#2C2C2C":"#888",fontSize:12,fontWeight:700,cursor:"pointer"}}>
                  {isSaved(contentModal.name)?"⭐ 저장됨":"☆ 저장"}
                </button>
                <button onClick={()=>setContentModal(null)} style={{background:"#F0EDE8",border:"none",borderRadius:20,width:30,height:30,fontSize:15,cursor:"pointer"}}>✕</button>
              </div>
            </div>

            {/* 캠핑에 추가 */}
            <div style={{background:"#F1F8E9",borderRadius:12,padding:"12px 14px",marginBottom:14,border:"1px solid #A5D6A7"}}>
              <div style={{fontSize:11,fontWeight:700,color:"#2D5016",marginBottom:8}}>🏕️ 어디에 추가할까요?</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                <button onClick={()=>{addToBackyard(contentModal.name);setContentModal(null);}} style={{padding:"7px 13px",borderRadius:20,border:"none",background:"#558B2F",color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer"}}>🏡 뒷마당</button>
                {campingTrips.map(t=>(
                  <button key={t.id} onClick={()=>{addToTrip(t.id,contentModal.name);setContentModal(null);}} style={{padding:"7px 13px",borderRadius:20,border:"none",background:"#4A7C23",color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer"}}>{t.name}</button>
                ))}
              </div>
            </div>

            {/* 쇼츠/릴스 아이디어 */}
            <div style={{background:"#F8F7F4",borderRadius:12,padding:"12px 14px",marginBottom:14}}>
              <div style={{fontSize:11,fontWeight:700,color:"#666",marginBottom:8}}>🎬 쇼츠/릴스 콘텐츠 아이디어</div>
              {[
                `🎯 훅: "캠핑에서 ${contentModal.name} 만드는 법 ㄷㄷ"`,
                `📍 촬영: 재료 준비 → 불 피우기 → 조리 과정 → 완성`,
                `✨ 포인트: 불꽃/연기 클로즈업, 완성샷 황금빛 조명`,
                `💬 CTA: "저장해두고 다음 캠핑에 만들어보세요!"`,
              ].map((tip,i)=>(
                <div key={i} style={{fontSize:12,color:"#444",marginBottom:6,lineHeight:1.5}}>{tip}</div>
              ))}
            </div>

            {/* 해시태그 */}
            <div style={{background:"#F8F7F4",borderRadius:12,padding:"12px 14px"}}>
              <div style={{fontSize:11,fontWeight:700,color:"#666",marginBottom:7}}>📲 추천 해시태그</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                {["#캠핑요리","#캠핑밥","#캠핑레시피","#아웃도어쿡","#캠핑먹방","#캠핑","#캠핑라이프","#캠핑그릴",`#${contentModal.name.replace(/\s/g,"")}`,  "#shorts","#reels","#캠핑일상"].map(tag=>(
                  <span key={tag} style={{padding:"4px 9px",borderRadius:12,background:"#E8F5E9",color:"#2D5016",fontSize:11,fontWeight:700}}>{tag}</span>
                ))}
              </div>
            </div>

            <button onClick={()=>setContentModal(null)} style={{width:"100%",marginTop:14,padding:"13px",background:"#2D5016",color:"#fff",border:"none",borderRadius:11,fontSize:13,fontWeight:700,cursor:"pointer"}}>닫기</button>
          </div>
        </div>
      )}

      {/* ══ 장보기 리스트 모달 ══ */}
      {shoppingModal&&(
        <div onClick={()=>setShoppingModal(null)} style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.55)",zIndex:1000,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
          <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:"20px 20px 0 0",padding:"22px 18px 40px",width:"100%",maxWidth:480,maxHeight:"85vh",overflowY:"auto"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <div>
                <div style={{fontSize:11,color:"#aaa"}}>장보기 리스트</div>
                <div style={{fontSize:17,fontWeight:900,color:"#2D5016"}}>🛒 {shoppingModal.name}</div>
              </div>
              <button onClick={()=>setShoppingModal(null)} style={{background:"#F0EDE8",border:"none",borderRadius:20,width:30,height:30,fontSize:15,cursor:"pointer"}}>✕</button>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:7}}>
              {(shoppingModal.menus||[]).filter(m=>!m.checked).map((m,i)=>(
                <label key={i} style={{display:"flex",alignItems:"center",gap:9,padding:"9px 11px",background:"#F8F7F4",borderRadius:10,cursor:"pointer"}}>
                  <input type="checkbox" style={{accentColor:"#4A7C23",width:16,height:16}}/>
                  <span style={{fontSize:13,fontWeight:600,color:"#2C2C2C"}}>{m.name}</span>
                  <span style={{fontSize:10,color:getCatColor(m.name),fontWeight:700,marginLeft:"auto"}}>{getCatName(m.name)}</span>
                </label>
              ))}
            </div>
            {(shoppingModal.menus||[]).filter(m=>m.checked).length>0&&(
              <div style={{marginTop:10,color:"#bbb",fontSize:11,textAlign:"center"}}>완료된 항목 {(shoppingModal.menus||[]).filter(m=>m.checked).length}개 제외됨</div>
            )}
            <button onClick={()=>setShoppingModal(null)} style={{width:"100%",marginTop:14,padding:"13px",background:"#4A7C23",color:"#fff",border:"none",borderRadius:11,fontSize:13,fontWeight:700,cursor:"pointer"}}>닫기</button>
          </div>
        </div>
      )}
    </div>
  );
}
