import { useState, useMemo, useEffect } from "react";
const curriculum = {
  "표현법": [
    { month:"3월",  theme:"Hello 나",     weeks:["내가 좋아하는 것","vlog 주인공","내가 대표가 된다","포스터 만들기"] },
    { month:"4월",  theme:"나의 주변",    weeks:["나를 닮은 집","화질실","집에 물건","공간과 사람"] },
    { month:"5월",  theme:"감정",         weeks:["캐릭터","이모티콘","숨기고 싶은 마음","스트레스"] },
    { month:"6월",  theme:"STEAM",        weeks:["구슬 길","구슬놀이","예술 속 장면","한 장면"] },
    { month:"7월",  theme:"현재와 미래",  weeks:["우리 동네","입체지도","미래도시","미래 뉴스"] },
    { month:"8월",  theme:"사고의 전환",  weeks:["사물의 재구성","초현실주의 작품","도와주고 싶은","신발"] },
    { month:"9월",  theme:"동물",         weeks:["나의 띠","잰탱글 피","아쿠아리움","필요한 물고기"] },
    { month:"10월", theme:"식물",         weeks:["무궁화","새들개 무궁화","선인장의 비밀","선인장과 친구"] },
    { month:"11월", theme:"환경",         weeks:["쓰레기 섬","환경보호","미래의 직업","할머니 할아버지"] },
    { month:"12월", theme:"겨울 이야기",  weeks:["얼음","얼음왕국","피레이드","팝업북"] },
    { month:"1월",  theme:"한국문화",     weeks:["선조들 집","한옥","초상화","새로운 이진"] },
    { month:"2월",  theme:"예술과 물화",  weeks:["초상화","새로운 초상화","마음을 담은 시","시와 그림"] },
  ],
  "발상편": [
    { month:"3월",  theme:"나",           weeks:["내 손","수수께끼 책","개성 있는 나","나도 작가처럼"] },
    { month:"4월",  theme:"소통과 자아",  weeks:["또 다른 나","나를 광고해요","잘했어 메달","나의 영웅에게"] },
    { month:"5월",  theme:"감각과 감정",  weeks:["달콤함","다양한 감정","토요일","놀이기구"] },
    { month:"6월",  theme:"숫자",         weeks:["십만원","숫자","트럼프 카드","비밀 숫자"] },
    { month:"7월",  theme:"기계와 시간",  weeks:["드림노트북","포크레인","텔레비전","타임머신"] },
    { month:"8월",  theme:"사고의 전환",  weeks:["외계인","서츠록","초능력 로봇","발명 아이디어"] },
    { month:"9월",  theme:"동물",         weeks:["또 가족","꽃향랑 나랑","요상한 동물","사람 닮은 동물"] },
    { month:"10월", theme:"식물",         weeks:["커다란 꽃","작은 정원","식물도감","해골가면"] },
    { month:"11월", theme:"환경",         weeks:["너의 모습","온난화","방독면","낙서"] },
    { month:"12월", theme:"겨울 이야기",  weeks:["겨울토끼","나무에게 옷","선물","스티커"] },
    { month:"1월",  theme:"한국문화",     weeks:["사군자","조선","자연","도자기"] },
    { month:"2월",  theme:"예술과 문화",  weeks:["음악여행","이동수단","손 글씨","쓰는 편지"] },
  ],
  "베이직 A": [
    { month:"3월",  theme:"내몸",             weeks:["나의 모습","내몸 인형","뼈","이카루스"] },
    { month:"4월",  theme:"꽃",               weeks:["생화 관찰","작은 씨앗","대황 꽃","고흐 핑거 프린트"] },
    { month:"5월",  theme:"옷과 신발",        weeks:["찰흙 신발","인어공주 신발","빨래하는 날","마르가리타 공주"] },
    { month:"6월",  theme:"소방차",           weeks:["소방차","달나라 뿔","소방차 호스","목탄"] },
    { month:"7월",  theme:"달팽이",           weeks:["달팽이","어러가지 색","달팽이 집","마티스"] },
    { month:"8월",  theme:"물방울",           weeks:["물방울 관찰","비 설치미술","내가 마신 물","물방울 그리기"] },
    { month:"9월",  theme:"동물의 사육제",    weeks:["동물의 사육제","신나는 축제","악보","칸딘스티"] },
    { month:"10월", theme:"비빔밥/열매",      weeks:["비빔밥/열매","오리사/땅콩 세상","도시락/주형","비빔밥색/가을열매"] },
    { month:"11월", theme:"바람",             weeks:["바람","날아라 공","바퀴이 쌤","바람부는 날"] },
    { month:"12월", theme:"공룡",             weeks:["멕스 만들기","아기 공룡","커다린 집","공룡시대"] },
    { month:"1월",  theme:"고등어",           weeks:["고등어","고등어 뱃속","고등어 친구","물고기의 꿈"] },
    { month:"2월",  theme:"확대/축소",        weeks:["우주(마블링)","우주공간","항아리","항아리 속"] },
  ],
  "베이직 B": [
    { month:"3월",  theme:"자연",         weeks:["키위 또는 얼론","나만의 과일","뿌리","맛이 나는 작품"] },
    { month:"4월",  theme:"인간",         weeks:["스티커 사진","눈코입에 마술","표정 인형","오페라 뮤직"] },
    { month:"5월",  theme:"시간여행",     weeks:["케이크","시간의 거울","베개","시간여행 속"] },
    { month:"6월",  theme:"공간여행",     weeks:["가방","만능 가방","전개도 드로잉","상상의 공간"] },
    { month:"7월",  theme:"식물",         weeks:["딸로에","신비한 악","파리지옥","파리지옥 탈출"] },
    { month:"8월",  theme:"소동",         weeks:["신풀","새로운 전달","핸드폰 관찰","편지 만들기"] },
    { month:"9월",  theme:"결합",         weeks:["톱니바퀴","스팀펑크 기법","시계 디자인","시계 만들기"] },
    { month:"10월", theme:"여행",         weeks:["지구본","여행가방","여권","새로운 나라"] },
    { month:"11월", theme:"곤충",         weeks:["장수풍뎅이","새로운 곤충","참나무","숲 속 친구들"] },
    { month:"12월", theme:"음식",         weeks:["햄버거","건강한 재료","맛있는 소리","아삭 채소 김치"] },
    { month:"1월",  theme:"과정",         weeks:["버섯","버섯 집","조개","만능 조개"] },
    { month:"2월",  theme:"카메라",       weeks:["카메라 촬칵","콜리주 기법","내가 찍은 사진","사진 작품 속"] },
  ],
  "토들러": [
    { month:"3월",  theme:"신나는 놀이",  weeks:["휴식·스타킹","그리기 도구","종이박스·골판지","사인펜·매직"] },
    { month:"4월",  theme:"탐색놀이",     weeks:["거북이 기방","스티커","셀로판지","슬자치"] },
    { month:"5월",  theme:"만지기놀이",   weeks:["밀가루","클레이(첫소)","두부","식빵"] },
    { month:"6월",  theme:"소리놀이",     weeks:["풍선","벨크로","긴빵","에어캡"] },
    { month:"7월",  theme:"도구놀이",     weeks:["롯(색깔비)","야채(도장)","집게(닭)","테이프(그물)"] },
    { month:"8월",  theme:"여름놀이",     weeks:["얼음","수박","거품(마블링)","파란비닐"] },
    { month:"9월",  theme:"재료놀이",     weeks:["프레이콘","우드락","골판지(기타)","백업"] },
    { month:"10월", theme:"모양놀이",     weeks:["은박지","색종이(모양나무)","가을열매","찰흙"] },
    { month:"11월", theme:"색깔놀이",     weeks:["물감(나비)","나비책","솜(앙)","쌀(무당벌레)"] },
    { month:"12월", theme:"겨울놀이",     weeks:["겨울나무","그랜드","네모장이(트리)","햄프"] },
    { month:"1월",  theme:"형태놀이",     weeks:["구슬","고무줄(거미)","포스트잇","보자기"] },
    { month:"2월",  theme:"만들기놀이",   weeks:["철사","종이컵","거울지(부엉이)","아이스크림 막대"] },
  ],
  "마미앤미": [
    { month:"1월",  theme:"겨울·봄 감각놀이",   weeks:["새해놀이","무지개놀이","토끼와당근","꿀벌놀이"] },
    { month:"2월",  theme:"촉감·빛놀이",         weeks:["하트놀이","휴지놀이","셀로판지/빛놀이","오렌지놀이"] },
    { month:"3월",  theme:"자연재료놀이",         weeks:["빵가루","미역놀이","거미놀이","딸기놀이"] },
    { month:"4월",  theme:"식재료놀이",           weeks:["콩나물","파스타놀이","빨래놀이","공룡놀이"] },
    { month:"5월",  theme:"감각탐색놀이",         weeks:["두부놀이","소방차","구름나라","비눗방울놀이"] },
    { month:"6월",  theme:"여름감각놀이",         weeks:["밀가루","피자놀이","김치놀이","세차놀이"] },
    { month:"7월",  theme:"여름특별놀이",         weeks:["농장놀이","밀가루2","캠핑놀이","수박놀이"] },
    { month:"8월",  theme:"물·모래놀이",          weeks:["건축놀이","바다놀이","국수놀이","습자지놀이"] },
    { month:"9월",  theme:"가을감각놀이",         weeks:["공놀이","오이놀이","개구리놀이","쌀놀이"] },
    { month:"10월", theme:"가을수확놀이",         weeks:["호박놀이","캔디놀이","감자놀이","뻥튀기"] },
    { month:"11월", theme:"겨울준비놀이",         weeks:["치과놀이","정글놀이","사과놀이","코끼리엄마"] },
    { month:"12월", theme:"겨울특별놀이",         weeks:["미용실","팝콘놀이","우주/야광","풍선놀이"] },
  ],
  "퍼포먼스 놀이": [
    { month:"1월",  theme:"겨울·봄 감각놀이",   weeks:["새해놀이","무지개놀이","토끼와당근","꿀벌놀이"] },
    { month:"2월",  theme:"촉감·빛놀이",         weeks:["하트놀이","휴지놀이","셀로판지/빛놀이","오렌지놀이"] },
    { month:"3월",  theme:"자연재료놀이",         weeks:["빵가루","미역놀이","거미놀이","딸기놀이"] },
    { month:"4월",  theme:"식재료놀이",           weeks:["콩나물","파스타놀이","빨래놀이","공룡놀이"] },
    { month:"5월",  theme:"감각탐색놀이",         weeks:["두부놀이","소방차","구름나라","비눗방울놀이"] },
    { month:"6월",  theme:"여름감각놀이",         weeks:["밀가루","피자놀이","김치놀이","세차놀이"] },
    { month:"7월",  theme:"여름특별놀이",         weeks:["농장놀이","밀가루","캠핑놀이","수박놀이"] },
    { month:"8월",  theme:"물·모래놀이",          weeks:["건축놀이","바다놀이","국수놀이","습자지놀이"] },
    { month:"9월",  theme:"가을감각놀이",         weeks:["공놀이","오이놀이","개구리놀이","쌀놀이"] },
    { month:"10월", theme:"가을수확놀이",         weeks:["호박놀이","캔디놀이","감자놀이","뻥튀기"] },
    { month:"11월", theme:"겨울준비놀이",         weeks:["치과놀이","정글놀이","사과놀이","코끼리엄마"] },
    { month:"12월", theme:"겨울특별놀이",         weeks:["미용실","팝콘놀이","우주/야광","풍선놀이"] },
  ],
  "키들러": [
    { month:"3월",  theme:"start",        weeks:["단추(탬버린)","수건(코끼리)","수수깡","룰(젤리음료수)"] },
    { month:"4월",  theme:"시각",         weeks:["우주선 팽이","파리채","블룸(태지)","하양이까깡이"] },
    { month:"5월",  theme:"촉각",         weeks:["빨래판","길대발","소스통","스폰지"] },
    { month:"6월",  theme:"공감각",       weeks:["압축기","달걀","그물(악어)","로션"] },
    { month:"7월",  theme:"기초드로잉",   weeks:["포도","카멜레온","금붕어","잠자리"] },
    { month:"8월",  theme:"기초드로잉",   weeks:["하트가방","리본 춤","세모(벨대)","별"] },
    { month:"9월",  theme:"관찰드로잉",   weeks:["무지개","방패","반쪽로봇","돌하르방"] },
    { month:"10월", theme:"관찰드로잉",   weeks:["그롯","양말","브로콜리","석류"] },
    { month:"11월", theme:"생각드로잉",   weeks:["게미","꽃빵","우산","크리"] },
    { month:"12월", theme:"생각드로잉",   weeks:["연필","느낌 친구","반원","선물 상자"] },
    { month:"1월",  theme:"표현드로잉",   weeks:["쌍둥이(빵긴)","태권도","접시","실(새장)"] },
    { month:"2월",  theme:"표현드로잉",   weeks:["퍼즐","모빌","고무장갑","과거 장원"] },
  ],
};

const monthOrder = ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"];
const curriculumNames = Object.keys(curriculum);
const currColors = { "표현법":"#7C5CBF","발상편":"#D4875E","베이직 A":"#4A7C59","베이직 B":"#1565C0","토들러":"#C62828","마미앤미":"#E91E63","퍼포먼스 놀이":"#FF5722","키들러":"#827717" };
const schedule = {
  월:[
    { id:"mon1", time:"3:40–4:40", type:"그룹", currName:"베이직 A",
      students:[{name:"다은"},{name:"케일리"},{name:"데이지"},{name:"지우"}] },
    { id:"mon2", time:"4:50–5:50", type:"그룹", currName:"표현법",
      students:[{name:"유안"},{name:"하로"}] },
    { id:"mon3", time:"6:00–7:00", type:"그룹", currName:"발상편",
      students:[{name:"노아"},{name:"엘리엇"},{name:"딜런"}] },
    { id:"mon4", time:"7:10–8:00", type:"1:1",  currName:"베이직 B",
      students:[{name:"브랜든"}] },
  ],
  화:[
    { id:"tue1", time:"4:15–5:15", type:"그룹", currName:"베이직 A",
      students:[{name:"서아"},{name:"올리비다"},{name:"다니"},{name:"Ethan"},{name:"이든"}] },
    { id:"tue2", time:"5:30–6:30", type:"그룹", currName:"표현법",
      students:[{name:"지안"},{name:"정우"}] },
    { id:"tue3", time:"6:45–7:45", type:"1:1",  currName:"발상편",
      students:[{name:"로건"}] },
  ],
  수:[
    { id:"wed1", time:"12:10–1:00", type:"1:1",  currName:"키들러",
      students:[{name:"Evan"}] },
    { id:"wed2", time:"1:10–2:00",  type:"1:1",  currName:"키들러",
      students:[{name:"제이든"}] },
    { id:"wed3", time:"2:30–3:30",  type:"그룹", currName:"토들러",
      students:[{name:"하니"},{name:"라린"}] },
    { id:"wed4", time:"4:00–5:00",  type:"그룹", currName:"베이직 A",
      students:[{name:"페이지"},{name:"크리스틴"},{name:"지오"},{name:"올리버"},{name:"샬렛"}] },
    { id:"wed5", time:"5:30–6:30",  type:"그룹", currName:"표현법",
      students:[{name:"에밀리"},{name:"하엘"},{name:"도율"},{name:"강우"},{name:"하은"},{name:"이사벨"}] },
  ],
  목:[
    { id:"thu1", time:"2:30–3:20", type:"1:1",  currName:"발상편",
      students:[{name:"테리"}] },
    { id:"thu2", time:"4:00–5:00", type:"그룹", currName:"베이직 B",
      students:[{name:"이삭"},{name:"로아"},{name:"띠오"},{name:"채이스"},{name:"올리비아"},{name:"루카"}] },
  ],
  금:[
    { id:"fri1", time:"4:00–5:00", type:"그룹", currName:"표현법",
      students:[{name:"프리스튼"},{name:"연우"},{name:"세아"},{name:"일라이자"},{name:"하린"},{name:"해븐"}] },
    { id:"fri2", time:"5:30–6:30", type:"그룹", currName:"발상편",
      students:[{name:"로건"},{name:"에이든"},{name:"시우"},{name:"제이"},{name:"하윤"}] },
    { id:"fri3", time:"6:40–7:40", type:"그룹", currName:"베이직 A",
      students:[{name:"에드워드"},{name:"앤드류"}] },
  ],
  토:[
    { id:"sat1", time:"10:00–11:00", type:"그룹", currName:"베이직 A",
      students:[{name:"선우"},{name:"다니"},{name:"혜인"},{name:"서희"}] },
  ],
};

const dayOrder = ["월","화","수","목","금","토"];
const dayColors = {
  월:{main:"#7C5CBF",light:"#F0EEF8",grad:"linear-gradient(135deg,#7C5CBF,#A07FD6)"},
  화:{main:"#D4875E",light:"#FFF3EC",grad:"linear-gradient(135deg,#D4875E,#E8A882)"},
  수:{main:"#4A7C59",light:"#EEF6F1",grad:"linear-gradient(135deg,#4A7C59,#6B9F7A)"},
  목:{main:"#1565C0",light:"#E8F0FC",grad:"linear-gradient(135deg,#1565C0,#4285D4)"},
  금:{main:"#C62828",light:"#FDECEA",grad:"linear-gradient(135deg,#C62828,#E05454)"},
  토:{main:"#827717",light:"#FFFFF0",grad:"linear-gradient(135deg,#827717,#B0A020)"},
};

const allClasses = Object.entries(schedule).flatMap(([day,cls])=>cls.map(c=>({...c,day})));
const studentClassMap = {};
allClasses.forEach(cls=>cls.students.forEach(s=>{
  if(!studentClassMap[s.name]) studentClassMap[s.name]=[];
  studentClassMap[s.name].push({day:cls.day,time:cls.time,type:cls.type,id:cls.id,currName:cls.currName});
}));
const allStudents = [...new Set(allClasses.flatMap(c=>c.students.map(s=>s.name)))].sort((a,b)=>a.localeCompare(b,'ko'));

function generateNotice(month, theme, weeks, cls, day) {
  const names = cls.students.map(s=>s.name).join(", ");
  return `안녕하세요, ${names} 학부모님 🌟\n\n${month} 미술 수업 안내드립니다.\n\n📅 수업 일시: ${day}요일 ${cls.time}\n📌 이번 달 주제: ${theme}\n\n주차별 수업 내용:\n${weeks.map((w,i)=>`  ${i+1}주차: ${w}`).join("\n")}\n\n궁금하신 점은 언제든 연락 주세요 😊\n\n감사합니다.\n— 미술 선생님 드림`;
}
function LessonEditModal({ modal, customLessons, customCurricula, lessonEditKey, getCurrMonthData, getCombinedCurriculum, saveCustomLesson, clearCustomLesson, onClose }) {
  const { classId, month, currName, col: mcol } = modal;
  const existing = customLessons[lessonEditKey(classId, month)];
  const defaultData = getCurrMonthData(currName, month);
  const initData = existing || defaultData || { theme:"", weeks:["","","",""] };

  const [editTheme, setEditTheme] = useState(initData.theme||"");
  const [editWeeks, setEditWeeks] = useState([
    initData.weeks[0]||"", initData.weeks[1]||"",
    initData.weeks[2]||"", initData.weeks[3]||""
  ]);
  const [showPicker, setShowPicker] = useState(false);
  const [pickerCurr, setPickerCurr] = useState(currName);

  const allCurrNames = [...Object.keys(curriculum), ...Object.keys(customCurricula)];
  const pickerMonths = getCombinedCurriculum(pickerCurr);

  return(
    <div onClick={onClose} style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.55)",zIndex:2000,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:"20px 20px 0 0",padding:"20px 17px 40px",width:"100%",maxWidth:480,maxHeight:"90vh",overflowY:"auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <div>
            <div style={{fontSize:11,color:"#A89CC8"}}>{month} 수업 내용 설정</div>
            <div style={{fontSize:16,fontWeight:900,color:"#2C2440"}}>✏️ {currName}</div>
          </div>
          <button onClick={onClose} style={{background:"#F4F2F9",border:"none",borderRadius:20,width:30,height:30,fontSize:15,cursor:"pointer",color:"#666"}}>✕</button>
        </div>
        <button onClick={()=>setShowPicker(!showPicker)} style={{width:"100%",padding:"10px",borderRadius:11,border:`2px solid ${showPicker?mcol:"#E8E3F5"}`,background:showPicker?mcol+"11":"#F8F7FC",color:showPicker?mcol:"#888",fontSize:12,fontWeight:700,cursor:"pointer",marginBottom:10}}>
          📚 커리큘럼에서 불러오기 {showPicker?"▲":"▽"}
        </button>

        {showPicker&&(
          <div style={{background:"#F8F7FC",borderRadius:12,padding:"12px",marginBottom:12}}>
            <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:8}}>
              {allCurrNames.map(n=>{
                const c=currColors[n]||customCurricula[n]?.color||"#607D8B";
                return(
                  <button key={n} onClick={()=>setPickerCurr(n)} style={{padding:"4px 10px",borderRadius:15,border:"none",background:pickerCurr===n?c:c+"22",color:pickerCurr===n?"#fff":c,fontSize:10,fontWeight:700,cursor:"pointer"}}>{n}</button>
                );
              })}
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:5,maxHeight:180,overflowY:"auto"}}>
              {pickerMonths.map((m,i)=>(
                <button key={i} onClick={()=>{setEditTheme(m.theme);setEditWeeks([m.weeks[0]||"",m.weeks[1]||"",m.weeks[2]||"",m.weeks[3]||""]);setShowPicker(false);}} style={{
                  display:"flex",alignItems:"center",gap:8,padding:"8px 10px",borderRadius:9,
                  border:"1px solid #E8E3F5",background:"#fff",cursor:"pointer",textAlign:"left",
                }}>
                  <span style={{fontSize:10,fontWeight:700,color:currColors[pickerCurr]||"#607D8B",width:28,flexShrink:0}}>{m.month}</span>
                  <div>
                    <div style={{fontSize:12,fontWeight:700,color:"#2C2440"}}>{m.theme}</div>
                    <div style={{fontSize:10,color:"#aaa"}}>{m.weeks.filter(Boolean).slice(0,3).join(" · ")}{m.weeks.length>3?"…":""}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
        <div style={{marginBottom:12}}>
          <div style={{fontSize:11,fontWeight:700,color:"#666",marginBottom:5}}>이달 주제</div>
          <input value={editTheme} onChange={e=>setEditTheme(e.target.value)}
            placeholder="예: 꽃, 봄, 동물 등..."
            style={{width:"100%",padding:"10px 12px",borderRadius:10,border:`2px solid ${mcol}`,fontSize:14,fontWeight:700,outline:"none",boxSizing:"border-box",color:mcol}}
          />
        </div>
        <div style={{marginBottom:16}}>
          <div style={{fontSize:11,fontWeight:700,color:"#666",marginBottom:8}}>주차별 수업 내용</div>
          {[0,1,2,3].map(wi=>(
            <div key={wi} style={{display:"flex",alignItems:"center",gap:8,marginBottom:7}}>
              <div style={{width:24,height:24,borderRadius:"50%",background:mcol,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:900,color:"#fff",flexShrink:0}}>{wi+1}</div>
              <input value={editWeeks[wi]} onChange={e=>{const n=[...editWeeks];n[wi]=e.target.value;setEditWeeks(n);}}
                placeholder={`${wi+1}주차 수업 내용`}
                style={{flex:1,padding:"8px 11px",borderRadius:9,border:"1px solid #E8E3F5",fontSize:13,outline:"none"}}
              />
            </div>
          ))}
        </div>
        <div style={{display:"flex",gap:8}}>
          <button onClick={()=>{
            saveCustomLesson(classId, month, {theme:editTheme||"미정", weeks:editWeeks});
            onClose();
          }} style={{flex:2,padding:"13px",borderRadius:12,border:"none",background:mcol,color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer"}}>
            저장
          </button>
          {existing&&(
            <button onClick={()=>{clearCustomLesson(classId,month);onClose();}} style={{flex:1,padding:"13px",borderRadius:12,border:"2px solid #FFEBEE",background:"#fff",color:"#C62828",fontSize:12,fontWeight:700,cursor:"pointer"}}>
              초기화
            </button>
          )}
          <button onClick={onClose} style={{flex:1,padding:"13px",borderRadius:12,border:"2px solid #E8E3F5",background:"#fff",color:"#aaa",fontSize:12,fontWeight:700,cursor:"pointer"}}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
const _store = window.__appStore = window.__appStore || {};
const loadLS=(key,def)=>{
  try{
    const ls = localStorage.getItem(key);
    if(ls) return JSON.parse(ls);
  }catch{}
  return _store[key] !== undefined ? _store[key] : def;
};
const saveLS=(key,val)=>{
  _store[key] = val;
  try{ localStorage.setItem(key, JSON.stringify(val)); }catch{}
};

export default function AcademyPlanner() {
  const [tab, setTab] = useState("monthly");
  const [activeMonth, setActiveMonth] = useState(()=>{
    const m = new Date().getMonth()+1;
    return m+"월";
  });
  const [activeClassId, setActiveClassId] = useState(null);
  const [tuition, setTuition] = useState(()=>loadLS("ac_tuition",{}));
  const [tuitionAmounts, setTuitionAmounts] = useState(()=>loadLS("ac_tuitionAmounts",{}));
  const [paidAmounts, setPaidAmounts] = useState(()=>loadLS("ac_paidAmounts",{}));
  const [paymentMethods, setPaymentMethods] = useState(()=>loadLS("ac_paymentMethods",{}));
  const payMethodKey = (classId, name, month) => `${classId}|${name}|${month}`;
  const getPayMethod = (classId, name, month) => paymentMethods[payMethodKey(classId,name,month)]||"";
  const PAYMENT_METHODS = [
    {key:"venmo", label:"Venmo",  icon:"💜", color:"#3D95CE"},
    {key:"zelle", label:"Zelle",  icon:"💛", color:"#6B2D8B"},
    {key:"cash",  label:"Cash",   icon:"💵", color:"#2E7D32"},
    {key:"check", label:"Check",  icon:"📝", color:"#5D4037"},
  ];
  const [lessonDone, setLessonDone] = useState(()=>loadLS("ac_lessonDone",{}));
  const [attendance, setAttendance] = useState(()=>loadLS("ac_attendance",{}));
  const [makeupDates, setMakeupDates] = useState(()=>loadLS("ac_makeupDates",{}));
  const [memos, setMemos] = useState(()=>loadLS("ac_memos",{}));
  const [editingMemo, setEditingMemo] = useState(null);
  const [tuitionModal, setTuitionModal] = useState(null);
  const [attendanceModal, setAttendanceModal] = useState(null);

  const DEFAULT_TUITION = 195;
  const getTuitionAmount = (name) => tuitionAmounts[name] ?? DEFAULT_TUITION;
  const getPaidAmount = (classId, name, month) => paidAmounts[`${classId}|${name}|${month}`] || "";
  const getAttendance = (classId, name, month, wi) => attendance[`${classId}|${name}|${month}|${wi}`] || "none";
  const getMakeupDate = (classId, name, month, wi) => makeupDates[`${classId}|${name}|${month}|${wi}`] || "";

  const setAttendanceStatus = (classId, name, month, wi, status) => {
    const k = `${classId}|${name}|${month}|${wi}`;
    setAttendance(p=>({...p,[k]:status}));
  };
  const setMakeupDate = (classId, name, month, wi, date) => {
    const k = `${classId}|${name}|${month}|${wi}`;
    setMakeupDates(p=>({...p,[k]:date}));
  };
  const [activeDay, setActiveDay] = useState("월");
  const [expandedClass, setExpandedClass] = useState(null);
  const [activeCurr, setActiveCurr] = useState("베이직 A");
  const [activeCurrMonth, setActiveCurrMonth] = useState(null);
  const defaultMainTabs = [
    {key:"monthly", label:"📅 월별"},
    {key:"schedule", label:"🗓️ 시간표"},
    {key:"curriculum", label:"📚 커리큘럼"},
    {key:"students", label:"👦 학생"},
    {key:"enrollment", label:"📋 등록관리"},
    {key:"settings", label:"⚙️ 설정"},
  ];
  const [mainTabOrder, setMainTabOrder] = useState(()=>loadLS("ac_mainTabOrder",defaultMainTabs.map(t=>t.key)));

  const moveMainTab = (idx, dir) => {
    setMainTabOrder(prev => {
      const arr = [...prev];
      const target = idx + dir;
      if(target < 0 || target >= arr.length) return arr;
      [arr[idx], arr[target]] = [arr[target], arr[idx]];
      return arr;
    });
  };
  const [curriculumTabOrder, setCurriculumTabOrder] = useState(()=>loadLS("ac_curriculumTabOrder",["표현법","발상편","베이직 A","베이직 B","토들러","키들러","마미앤미","퍼포먼스 놀이"]));

  const moveCurrTab = (idx, dir) => {
    setCurriculumTabOrder(prev => {
      const arr = [...prev];
      const target = idx + dir;
      if(target < 0 || target >= arr.length) return arr;
      [arr[idx], arr[target]] = [arr[target], arr[idx]];
      return arr;
    });
  };
  const [customCurricula, setCustomCurricula] = useState(()=>loadLS("ac_customCurricula",{}));
  const [addCurrModal, setAddCurrModal] = useState(false);
  const [addMonthModal, setAddMonthModal] = useState(false);
  const [newCurrForm, setNewCurrForm] = useState({name:"", color:"#607D8B"});
  const [newMonthForm, setNewMonthForm] = useState({month:"", theme:"", w1:"", w2:"", w3:"", w4:""});
  const colorOptions = ["#E91E63","#FF5722","#FF9800","#4CAF50","#009688","#2196F3","#673AB7","#607D8B","#795548","#F44336"];

  const getCombinedCurriculum = (name) => {
    if(curriculum[name]) return curriculum[name];
    if(customCurricula[name]) return customCurricula[name].months||[];
    return [];
  };
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [stuSearch, setStuSearch] = useState("");
  const [noticeModal, setNoticeModal] = useState(null);
  const [copied, setCopied] = useState(false);
  const [editableNotice, setEditableNotice] = useState("");
  const [isEditingNotice, setIsEditingNotice] = useState(false);
  const [lessonModal, setLessonModal] = useState(null);
  const [lessonDetails, setLessonDetails] = useState(()=>loadLS("ac_lessonDetails",{}));
  const [ldModal, setLdModal] = useState(null);
  const [photoViewer, setPhotoViewer] = useState(null);
  const [statsModal, setStatsModal] = useState(null); // "students"|"paid"|"unpaid"|"classes" // {photos:[], idx:0}
  const getLd=(c,m,w)=>lessonDetails[c+"|"+m+"|"+w]||{content:"",materials:"",photos:[]};
  const setLd=(c,m,w,d)=>setLessonDetails(p=>({...p,[c+"|"+m+"|"+w]:d}));
  const [enrollments, setEnrollments] = useState(() => {
    const saved = loadLS("ac_enrollments", null);
    if(saved) return saved;
    const init = {};
    allStudents.forEach(name => {
      init[name] = { status:"active", joinDate:"2025-03", leftDate:null, note:"", history:[] };
    });
    return init;
  });
  const [enrollTab, setEnrollTab] = useState("active");
  const [enrollModal, setEnrollModal] = useState(null);
  const [enrollSearch, setEnrollSearch] = useState("");
  const [addStudentModal, setAddStudentModal] = useState(false);
  const [newStudentForm, setNewStudentForm] = useState({name:"",joinDate:"",note:"",status:"new"});

  const statusLabel  = {active:"재학중",new:"신규",left:"퇴원",returning:"재등록"};
  const statusColor  = {active:"#4A7C59",new:"#1565C0",left:"#C62828",returning:"#D4875E"};
  const statusBg     = {active:"#EEF6F1",new:"#E8F0FC",left:"#FDECEA",returning:"#FFF3EC"};
  const statusEmoji  = {active:"✅",new:"🆕",left:"👋",returning:"🔄"};

  const updateEnrollment = (name, updates) =>
    setEnrollments(p=>({...p,[name]:{...p[name],...updates}}));

  const changeStatus = (name, newStatus) => {
    const today = new Date().toISOString().slice(0,7);
    updateEnrollment(name, {
      status: newStatus,
      leftDate: newStatus==="left" ? today : enrollments[name]?.leftDate,
      joinDate: (newStatus==="new"||newStatus==="returning") ? today : enrollments[name]?.joinDate,
      history: [...(enrollments[name]?.history||[]),
        {type:newStatus, date:today, note:{active:"복귀",new:"신규등록",left:"퇴원",returning:"재등록"}[newStatus]||""}
      ]
    });
  };

  const enrollStats = Object.values(enrollments).reduce((acc,e)=>{
    acc[e.status]=(acc[e.status]||0)+1; return acc;
  },{active:0,new:0,left:0,returning:0});

  const tuitionKey = (classId, name, month) => `${classId}|${name}|${month}`;
  const lessonKey  = (classId, month, wi)  => `${classId}|${month}|${wi}`;
  const memoKey    = (classId, month)      => `${classId}|${month}`;

  const getTuition = (classId, name, month) => !!tuition[tuitionKey(classId,name,month)];
  const getLessonDone = (classId, month, wi) => !!lessonDone[lessonKey(classId,month,wi)];
  const getMemo = (classId, month) => memos[memoKey(classId,month)] || "";

  const toggleTuition = (classId, name, month) => {
    const k = tuitionKey(classId,name,month);
    setTuition(p=>({...p,[k]:!p[k]}));
  };
  const toggleLesson = (classId, month, wi) => {
    const k = lessonKey(classId,month,wi);
    setLessonDone(p=>({...p,[k]:!p[k]}));
  };
  const totalStudents = allStudents.length;
  const paidThisMonth = useMemo(()=>{
    const paid = new Set();
    allClasses.forEach(cls=>cls.students.forEach(s=>{
      if(getTuition(cls.id,s.name,activeMonth)) paid.add(s.name);
    }));
    return paid.size;
  },[tuition,activeMonth]);

  const classesThisMonth = allClasses;

  const currMonths = getCombinedCurriculum(activeCurr).map(m=>m.month)||[];

  const filteredStudents = useMemo(()=>{
    const q = stuSearch.toLowerCase();
    return allStudents.filter(s=>s.toLowerCase().includes(q));
  },[stuSearch]);
  const getCurrMonthData = (currName, month) =>
    curriculum[currName]?.find(m=>m.month===month);
  const [customLessons, setCustomLessons] = useState(()=>loadLS("ac_customLessons",{}));
  const [lessonEditModal, setLessonEditModal] = useState(null);

  const lessonEditKey = (classId, month) => `${classId}|${month}`;
  const getEffectiveLessonData = (classId, currName, month) => {
    const custom = customLessons[lessonEditKey(classId, month)];
    if(custom) return custom;
    return getCurrMonthData(currName, month) || null;
  };

  const saveCustomLesson = (classId, month, data) => {
    setCustomLessons(p=>({...p,[lessonEditKey(classId,month)]:data}));
  };
  const clearCustomLesson = (classId, month) => {
    setCustomLessons(p=>{const n={...p};delete n[lessonEditKey(classId,month)];return n;});
  };
  useEffect(()=>saveLS("ac_tuition",tuition),[tuition]);
  useEffect(()=>saveLS("ac_tuitionAmounts",tuitionAmounts),[tuitionAmounts]);
  useEffect(()=>saveLS("ac_paidAmounts",paidAmounts),[paidAmounts]);
  useEffect(()=>saveLS("ac_paymentMethods",paymentMethods),[paymentMethods]);
  useEffect(()=>saveLS("ac_lessonDone",lessonDone),[lessonDone]);
  useEffect(()=>saveLS("ac_attendance",attendance),[attendance]);
  useEffect(()=>saveLS("ac_makeupDates",makeupDates),[makeupDates]);
  useEffect(()=>saveLS("ac_memos",memos),[memos]);
  useEffect(()=>saveLS("ac_customLessons",customLessons),[customLessons]);
  useEffect(()=>saveLS("ac_customCurricula",customCurricula),[customCurricula]);
  useEffect(()=>saveLS("ac_mainTabOrder",mainTabOrder),[mainTabOrder]);
  useEffect(()=>saveLS("ac_curriculumTabOrder",curriculumTabOrder),[curriculumTabOrder]);
  useEffect(()=>saveLS("ac_enrollments",enrollments),[enrollments]);
  useEffect(()=>saveLS("ac_lessonDetails",lessonDetails),[lessonDetails]);

  return (
    <div style={{fontFamily:"Noto Sans KR",background:"#F4F2F9",minHeight:"100vh",padding:"0 0 60px",maxWidth:480,margin:"0 auto"}}>
      <div style={{background:"#2C2440",padding:"20px 16px 14px",color:"#fff"}}>
        <div style={{fontSize:11,letterSpacing:3,color:"#A89CC8",textTransform:"uppercase",marginBottom:4}}>Art Academy</div>
        <h1 style={{fontSize:21,fontWeight:900,margin:"0 0 12px"}}>수업 플래너 <span style={{color:"#A07FD6"}}>All-in-One</span></h1>
        <div style={{display:"flex",gap:7}}>
          {[
            {label:"전체학생",value:totalStudents+"명",icon:"👦"},
            {label:activeMonth+" 납부",value:paidThisMonth+"명",icon:"✅",color:"#81C784"},
            {label:"미납",value:(totalStudents-paidThisMonth)+"명",icon:"⚠️",color:"#EF9A9A"},
            {label:"클래스",value:allClasses.length+"개",icon:"🎨",color:"#CE93D8"},
          ].map((s,i)=>(
            <div key={i} onClick={()=>setStatsModal(["students","paid","unpaid","classes"][i])} style={{flex:1,background:"rgba(255,255,255,0.08)",borderRadius:10,padding:"8px 4px",textAlign:"center",cursor:"pointer"}}>
              <div style={{fontSize:13}}>{s.icon}</div>
              <div style={{fontSize:13,fontWeight:900,color:s.color||"#fff"}}>{s.value}</div>
              <div style={{fontSize:9,color:"#888"}}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{display:"flex",background:"#fff",borderBottom:"2px solid #F4F2F9",overflowX:"auto"}}>
        {mainTabOrder.map(key=>{
          const t = defaultMainTabs.find(t=>t.key===key);
          if(!t) return null;
          return(
            <button key={key} onClick={()=>setTab(key)} style={{flex:1,padding:"11px 4px",border:"none",background:"none",borderBottom:tab===key?"3px solid #7C5CBF":"3px solid transparent",color:tab===key?"#7C5CBF":"#aaa",fontSize:11,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap",minWidth:50}}>
              {t.label}
            </button>
          );
        })}
      </div>

      <div style={{padding:"14px"}}>
        {tab==="monthly"&&<>
          <div style={{display:"flex",gap:5,overflowX:"auto",marginBottom:14,paddingBottom:4}}>
            {monthOrder.map(m=>(
              <button key={m} onClick={()=>{setActiveMonth(m);setActiveClassId(null);}} style={{
                padding:"7px 12px",borderRadius:20,border:"none",flexShrink:0,
                background:activeMonth===m?"#2C2440":"#fff",
                color:activeMonth===m?"#fff":"#888",
                fontSize:12,fontWeight:700,cursor:"pointer",
                boxShadow:activeMonth===m?"0 2px 8px rgba(0,0,0,0.15)":"none",
              }}>{m}</button>
            ))}
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {allClasses.map(cls=>{
              const col = currColors[cls.currName]||"#7C5CBF";
              const currData = getEffectiveLessonData(cls.id, cls.currName, activeMonth);
              const isCustomLesson = !!customLessons[lessonEditKey(cls.id, activeMonth)];
              const isOpen = activeClassId===cls.id;
              const doneLessons = currData ? currData.weeks.filter((_,wi)=>getLessonDone(cls.id,activeMonth,wi)).length : 0;
              const paidCount = cls.students.filter(s=>getTuition(cls.id,s.name,activeMonth)).length;
              const unpaidCount = cls.students.length - paidCount;
              const memo = getMemo(cls.id, activeMonth);

              return (
                <div key={cls.id} style={{background:"#fff",borderRadius:14,overflow:"hidden",boxShadow:"0 2px 10px rgba(0,0,0,0.06)",border:cls.type==="1:1"?`2px solid ${col}`:"2px solid transparent"}}>
                  <button onClick={()=>setActiveClassId(isOpen?null:cls.id)} style={{width:"100%",background:"none",border:"none",padding:"12px 14px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <div style={{display:"flex",alignItems:"center",gap:9}}>
                      <div style={{background:dayColors[cls.day].main,color:"#fff",borderRadius:9,padding:"4px 9px",fontSize:11,fontWeight:900,whiteSpace:"nowrap",flexShrink:0}}>
                        {cls.day} {cls.time}
                      </div>
                      <div style={{textAlign:"left"}}>
                        <div style={{display:"flex",gap:4,marginBottom:3,alignItems:"center"}}>
                          <span style={{fontSize:10,background:col+"22",color:col,borderRadius:6,padding:"1px 7px",fontWeight:700}}>{cls.currName}</span>
                          {cls.type==="1:1"&&<span style={{fontSize:10,background:"#EDE7F6",color:"#7C5CBF",borderRadius:6,padding:"1px 6px",fontWeight:700}}>1:1</span>}
                        </div>
                        <div style={{fontSize:12,color:"#2C2440",fontWeight:700}}>{cls.students.map(s=>s.name).join(" · ")}</div>
                        <div style={{display:"flex",gap:5,marginTop:2}}>
                          {currData&&<span style={{fontSize:11,color:col,fontWeight:700,background:col+"15",borderRadius:6,padding:"2px 7px"}}>📖 {currData.theme}</span>}{currData&&<span style={{fontSize:10,color:"#aaa",marginLeft:3}}>({doneLessons}/{currData.weeks.length}주)</span>}
                          <span style={{fontSize:10,background:"#E8F5E9",color:"#2E7D32",borderRadius:5,padding:"1px 5px"}}>✅{paidCount}</span>
                          {unpaidCount>0&&<span style={{fontSize:10,background:"#FFEBEE",color:"#C62828",borderRadius:5,padding:"1px 5px"}}>⚠️{unpaidCount}</span>}
                        </div>
                      </div>
                    </div>
                    <span style={{color:"#ccc",fontSize:14}}>{isOpen?"▲":"▽"}</span>
                  </button>
                  {isOpen&&(
                    <div style={{borderTop:"1px solid #F4F2F9",padding:"12px 14px 14px"}}>
                      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
                        <button onClick={()=>setLessonEditModal({classId:cls.id,month:activeMonth,currName:cls.currName,col})} style={{
                          display:"flex",alignItems:"center",gap:5,background:"none",border:"none",padding:0,cursor:"pointer",textAlign:"left",flex:1,
                        }}>
                          <span style={{fontSize:12,fontWeight:700,color:col}}>
                            {currData ? `📖 ${currData.theme}` : "📖 수업 내용 입력"}
                          </span>
                          {isCustomLesson
                            ? <span style={{fontSize:9,background:col+"22",color:col,borderRadius:5,padding:"1px 5px",fontWeight:700}}>수정됨</span>
                            : <span style={{fontSize:9,color:"#bbb"}}>탭해서 수정</span>
                          }
                        </button>
                        <div style={{display:"flex",gap:5,flexShrink:0}}>
                          {currData&&<button onClick={()=>setNoticeModal({cls,currData,month:activeMonth})} style={{padding:"4px 8px",borderRadius:8,border:"none",background:col,color:"#fff",fontSize:10,fontWeight:700,cursor:"pointer"}}>📩</button>}
                          <button onClick={()=>setEditingMemo(memoKey(cls.id,activeMonth))} style={{padding:"4px 8px",borderRadius:8,border:"1px solid #E8E3F5",background:"#fff",color:"#888",fontSize:10,fontWeight:700,cursor:"pointer"}}>{memo?"✏️":"📝"}</button>
                        </div>
                      </div>
                      {editingMemo===memoKey(cls.id,activeMonth)&&(
                        <textarea
                          defaultValue={memo}
                          onBlur={e=>{setMemos(p=>({...p,[memoKey(cls.id,activeMonth)]:e.target.value}));setEditingMemo(null);}}
                          autoFocus placeholder="메모 입력..."
                          style={{width:"100%",padding:"8px",borderRadius:9,border:"2px solid "+col,fontSize:12,resize:"none",minHeight:50,boxSizing:"border-box",outline:"none",marginBottom:10}}
                        />
                      )}
                      {memo&&editingMemo!==memoKey(cls.id,activeMonth)&&(
                        <div onClick={()=>setEditingMemo(memoKey(cls.id,activeMonth))} style={{background:"#FFF8E1",borderRadius:8,padding:"6px 10px",fontSize:11,color:"#666",marginBottom:10,cursor:"pointer"}}>📝 {memo}</div>
                      )}
                      {currData&&(
                        <div style={{marginBottom:12,overflowX:"auto"}}>
                          <div style={{display:"grid",gridTemplateColumns:`80px repeat(${currData.weeks.length},1fr)`,gap:3,marginBottom:3}}>
                            <div style={{fontSize:10,color:"#aaa",padding:"4px 6px"}}></div>
                            {currData.weeks.map((week,wi)=>{
                              const det=getLd(cls.id,activeMonth,wi+1);
                              const has=!!(det.content||det.materials||(det.photos&&det.photos.length));
                              return(<div key={wi} onClick={()=>setLdModal({cId:cls.id,month:activeMonth,week:wi+1,wLabel:(wi+1)+"주차",cName:cls.name,col})} style={{fontSize:9,color:"#888",textAlign:"center",padding:"3px 2px",background:has?"#EDE7F6":"#F0EDE8",borderRadius:6,lineHeight:1.3,cursor:"pointer",position:"relative"}}>
                                <div style={{fontWeight:700,color:col}}>{wi+1}주</div>
                                <div style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{week.length>4?week.slice(0,4)+"…":week}</div>
                                {has&&<div style={{position:"absolute",top:-2,right:-2,width:6,height:6,borderRadius:"50%",background:col}}/>}
                              </div>);
                            })}
                          </div>
                          {cls.students.map(s=>{
                            const presentCount = currData.weeks.filter((_,wi)=>getAttendance(cls.id,s.name,activeMonth,wi)==="present").length;
                            const absentCount  = currData.weeks.filter((_,wi)=>getAttendance(cls.id,s.name,activeMonth,wi)==="absent").length;
                            const makeupCount  = currData.weeks.filter((_,wi)=>getAttendance(cls.id,s.name,activeMonth,wi)==="makeup").length;
                            return(
                              <div key={s.name}>
                                <div style={{display:"grid",gridTemplateColumns:`80px repeat(${currData.weeks.length},1fr)`,gap:3,marginBottom:2}}>
                                  <button onClick={()=>{setSelectedStudent(s.name);setTab("students");}} style={{display:"flex",alignItems:"center",gap:5,padding:"4px 4px",background:"none",border:"none",cursor:"pointer",textAlign:"left",width:"100%",minWidth:0}}>
                                    <div style={{width:20,height:20,borderRadius:"50%",background:col+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:900,color:col,flexShrink:0}}>{s.name[0]}</div>
                                    <span style={{fontSize:11,fontWeight:700,color:"#2C2440",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",textDecoration:"underline",textDecorationColor:col+"66"}}>{s.name}</span>
                                  </button>
                                  {currData.weeks.map((_,wi)=>{
                                    const att=getAttendance(cls.id,s.name,activeMonth,wi);
                                    const attColors={present:"#2E7D32",absent:"#C62828",makeup:"#D4875E",none:"#ccc"};
                                    const attBgs={present:"#E8F5E9",absent:"#FFEBEE",makeup:"#FFF3EC",none:"#F8F7FC"};
                                    const attLabels={present:"출",absent:"결",makeup:"보",none:"·"};
                                    const cycleAtt=(cur)=>({none:"present",present:"absent",absent:"makeup",makeup:"none"}[cur]||"none");
                                    return(
                                      <button key={wi} onClick={()=>setAttendanceStatus(cls.id,s.name,activeMonth,wi,cycleAtt(att))} style={{
                                        padding:"6px 2px",borderRadius:7,border:"none",
                                        background:attBgs[att],color:attColors[att],
                                        fontSize:12,fontWeight:900,cursor:"pointer",textAlign:"center",
                                      }}>{attLabels[att]}</button>
                                    );
                                  })}
                                </div>
                                {currData.weeks.map((_,wi)=>{
                                  const att=getAttendance(cls.id,s.name,activeMonth,wi);
                                  const mkDate=getMakeupDate(cls.id,s.name,activeMonth,wi);
                                  if(att!=="absent"&&att!=="makeup") return null;
                                  return(
                                    <div key={wi} style={{display:"flex",alignItems:"center",gap:5,padding:"2px 4px 4px 28px"}}>
                                      <span style={{fontSize:9,color:"#D4875E",flexShrink:0}}>{wi+1}주 보강일:</span>
                                      <input value={mkDate} onChange={e=>setMakeupDate(cls.id,s.name,activeMonth,wi,e.target.value)}
                                        placeholder="4/15 화" style={{flex:1,padding:"2px 6px",borderRadius:6,border:"1px solid #FFD0B0",fontSize:10,outline:"none",background:"#FFF8F5",color:"#D4875E"}}/>
                                    </div>
                                  );
                                })}
                              </div>
                            );
                          })}
                          <div style={{fontSize:9,color:"#bbb",marginTop:4}}>· 탭하면 출석→결석→보강→없음 순서로 변경</div>
                        </div>
                      )}
                      <div style={{background:"#F8F7FC",borderRadius:11,padding:"10px 12px"}}>
                        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                          <span style={{fontSize:11,fontWeight:700,color:"#A89CC8"}}>💰 {activeMonth} 튜이션</span>
                          <span style={{fontSize:9,color:"#bbb"}}>이름 탭 = 완납 · 다른 금액만 입력</span>
                        </div>
                        {cls.students.map(s=>{
                          const amount = getTuitionAmount(s.name);
                          const paidAmt = getPaidAmount(cls.id,s.name,activeMonth);
                          const paidNum = Number(paidAmt)||0;
                          const hasCustomAmt = paidAmt!=="";
                          const paid = !!tuition[tuitionKey(cls.id,s.name,activeMonth)];
                          const isFull = paid || (hasCustomAmt && paidNum>=amount);
                          const hasPartial = hasCustomAmt && paidNum>0 && paidNum<amount && !paid;
                          const payMethod = getPayMethod(cls.id,s.name,activeMonth);
                          const pm = PAYMENT_METHODS.find(p=>p.key===payMethod);
                          return(
                            <div key={s.name} style={{marginBottom:7,padding:"8px 10px",borderRadius:10,background:isFull?"#F0FBF0":hasPartial?"#FFFBF0":"#fff",border:`1.5px solid ${isFull?"#A5D6A7":hasPartial?"#FFCC80":"#E8E3F5"}`}}>
                              <div style={{display:"flex",alignItems:"center",gap:6}}>
                                <button onClick={()=>setTuition(p=>{const k=tuitionKey(cls.id,s.name,activeMonth);return{...p,[k]:!p[k]};})} style={{
                                  width:28,height:28,borderRadius:"50%",flexShrink:0,border:"none",cursor:"pointer",
                                  background:isFull?"#2E7D32":hasPartial?"#FF9800":"#E0E0E0",
                                  display:"flex",alignItems:"center",justifyContent:"center",
                                  fontSize:isFull?14:12,fontWeight:900,color:"#fff",
                                }}>
                                  {isFull?"✓":hasPartial?"½":s.name[0]}
                                </button>
                                <button onClick={()=>{setSelectedStudent(s.name);setTab("students");}} style={{flex:1,background:"none",border:"none",padding:0,cursor:"pointer",textAlign:"left",minWidth:0}}>
                                  <div style={{fontSize:13,fontWeight:700,color:"#2C2440",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s.name}</div>
                                  <div style={{fontSize:10,fontWeight:600,color:isFull?"#2E7D32":hasPartial?"#F57C00":"#aaa"}}>
                                    {isFull
                                      ? `완납 $${hasCustomAmt?paidNum:amount}${pm?" · "+pm.icon+" "+pm.label:""}`
                                      : hasPartial
                                        ? `$${paidNum} 납부 / 잔액 $${amount-paidNum}`
                                        : `$${amount} 미납`}
                                  </div>
                                </button>
                                <div style={{position:"relative",width:68,flexShrink:0}}>
                                  <span style={{position:"absolute",left:5,top:"50%",transform:"translateY(-50%)",fontSize:10,color:"#bbb",pointerEvents:"none"}}>$</span>
                                  <input type="number" value={paidAmt}
                                    onChange={e=>setPaidAmounts(p=>({...p,[`${cls.id}|${s.name}|${activeMonth}`]:e.target.value}))}
                                    placeholder={String(amount)}
                                    style={{width:"100%",padding:"5px 4px 5px 14px",borderRadius:7,border:`1.5px solid ${hasCustomAmt?"#FFCC80":"#E8E3F5"}`,fontSize:11,outline:"none",boxSizing:"border-box",background:"#fff"}}
                                  />
                                </div>
                                <button onClick={()=>setTuitionModal({classId:cls.id,studentName:s.name})} style={{padding:"5px",borderRadius:6,border:"1px solid #E8E3F5",background:"#fff",color:"#bbb",fontSize:10,cursor:"pointer",flexShrink:0}}>⚙️</button>
                              </div>
                              {isFull&&(
                                <div style={{display:"flex",gap:5,marginTop:7,paddingTop:7,borderTop:"1px solid #E8F5E9"}}>
                                  {PAYMENT_METHODS.map(pm2=>(
                                    <button key={pm2.key} onClick={()=>setPaymentMethods(p=>({...p,[payMethodKey(cls.id,s.name,activeMonth)]:pm2.key===payMethod?"":pm2.key}))
                                    } style={{
                                      flex:1,padding:"4px 2px",borderRadius:8,border:"none",cursor:"pointer",
                                      background:payMethod===pm2.key?pm2.color:pm2.color+"18",
                                      color:payMethod===pm2.key?"#fff":pm2.color,
                                      fontSize:10,fontWeight:700,
                                    }}>
                                      {pm2.icon} {pm2.label}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>}
        {tab==="schedule"&&<>
          <div style={{display:"flex",gap:6,marginBottom:12}}>
            {dayOrder.map(d=>{const dc2=dayColors[d];const a=activeDay===d;return(
              <button key={d} onClick={()=>{setActiveDay(d);setExpandedClass(null);}} style={{flex:1,padding:"9px 4px",borderRadius:11,border:"2px solid",borderColor:a?dc2.main:"transparent",background:a?dc2.main:"#fff",color:a?"#fff":"#888",fontSize:13,fontWeight:700,cursor:"pointer"}}>{d}</button>
            );})}
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:9}}>
            {(schedule[activeDay]||[]).map(cls=>{
              const col = currColors[cls.currName]||"#7C5CBF";
              const dc = dayColors[activeDay];
              const isOpen = expandedClass===cls.id;
              return(
                <div key={cls.id} style={{background:"#fff",borderRadius:13,overflow:"hidden",boxShadow:"0 2px 8px rgba(0,0,0,0.06)",border:cls.type==="1:1"?`2px solid ${col}`:"2px solid transparent"}}>
                  <button onClick={()=>setExpandedClass(isOpen?null:cls.id)} style={{width:"100%",background:"none",border:"none",padding:"12px 14px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <div style={{background:cls.type==="1:1"?col:dc.light,color:cls.type==="1:1"?"#fff":col,borderRadius:9,padding:"4px 9px",fontSize:12,fontWeight:900,whiteSpace:"nowrap"}}>{cls.time}</div>
                      <div>
                        <div style={{fontSize:12,fontWeight:700,color:"#2C2440"}}>{cls.students.map(s=>s.name).join(" · ")}</div>
                        <span style={{fontSize:10,background:col+"22",color:col,borderRadius:5,padding:"1px 7px",fontWeight:700}}>{cls.currName}</span>
                      </div>
                    </div>
                    <span style={{color:"#ccc"}}>{isOpen?"▲":"▽"}</span>
                  </button>
                  {isOpen&&(
                    <div style={{borderTop:"1px solid #F4F2F9",padding:"10px 14px 12px"}}>
                      <div style={{fontSize:11,fontWeight:700,color:"#A89CC8",marginBottom:8}}>학생 목록</div>
                      {cls.students.map(s=>(
                        <div key={s.name} style={{display:"flex",alignItems:"center",justifyContent:"space-between",background:"#F8F7FC",borderRadius:9,padding:"7px 11px",marginBottom:5}}>
                          <button onClick={()=>{setSelectedStudent(s.name);setTab("students");}} style={{background:"none",border:"none",fontSize:13,fontWeight:700,color:"#2C2440",cursor:"pointer",padding:0}}>{s.name}</button>
                          <span style={{fontSize:10,color:"#aaa"}}>{cls.type}</span>
                        </div>
                      ))}
                      <button onClick={()=>setTab("monthly")} style={{width:"100%",marginTop:8,padding:"9px",borderRadius:10,border:"none",background:col,color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer"}}>
                        📅 {activeMonth} 수업 기록 보기
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>}
        {tab==="curriculum"&&<>
          <div style={{display:"flex",gap:6,marginBottom:12,flexWrap:"wrap"}}>
            {[...curriculumTabOrder,...Object.keys(customCurricula).filter(k=>!curriculumTabOrder.includes(k))].map(name=>{
              const col=currColors[name]||customCurricula[name]?.color||"#607D8B";
              const active=activeCurr===name;
              return(
                <button key={name} onClick={()=>{setActiveCurr(name);setActiveCurrMonth(null);}} style={{padding:"7px 12px",borderRadius:20,border:"2px solid",borderColor:active?col:"transparent",background:active?col:"#fff",color:active?"#fff":"#888",fontSize:11,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:4}}>
                  {name}
                  {customCurricula[name]&&<span onClick={e=>{e.stopPropagation();if(window.confirm(name+"을 삭제할까요?")){setCustomCurricula(p=>{const n={...p};delete n[name];return n;});if(activeCurr===name)setActiveCurr(curriculumNames[0]);}}} style={{fontSize:10,opacity:0.7}}>✕</span>}
                </button>
              );
            })}
            <button onClick={()=>setAddCurrModal(true)} style={{padding:"7px 13px",borderRadius:20,border:"2px dashed #C8B8E8",background:"#F8F6FF",color:"#7C5CBF",fontSize:11,fontWeight:700,cursor:"pointer"}}>+ 추가</button>
          </div>
          <div style={{display:"flex",gap:5,marginBottom:13,overflowX:"auto",paddingBottom:4}}>
            <button onClick={()=>setActiveCurrMonth(null)} style={{padding:"5px 11px",borderRadius:20,border:"none",background:!activeCurrMonth?"#2C2440":"#F0EDE8",color:!activeCurrMonth?"#fff":"#888",fontSize:11,fontWeight:700,cursor:"pointer",flexShrink:0}}>전체</button>
            {currMonths.map(m=>(
              <button key={m} onClick={()=>setActiveCurrMonth(m===activeCurrMonth?null:m)} style={{padding:"5px 11px",borderRadius:20,border:"none",background:activeCurrMonth===m?"#2C2440":"#F0EDE8",color:activeCurrMonth===m?"#fff":"#888",fontSize:11,fontWeight:700,cursor:"pointer",flexShrink:0,whiteSpace:"nowrap"}}>{m}</button>
            ))}
          </div>
          <button onClick={()=>setAddMonthModal(true)} style={{width:"100%",padding:"10px",borderRadius:11,border:"2px dashed #C8B8E8",background:"#F8F6FF",color:"#7C5CBF",fontSize:12,fontWeight:700,cursor:"pointer",marginBottom:12}}>
            + {activeCurr} 월 추가
          </button>

          {(activeCurrMonth
            ? getCombinedCurriculum(activeCurr).filter(m=>m.month===activeCurrMonth)
            : getCombinedCurriculum(activeCurr)
          ).map((monthData)=>{
            const col=currColors[activeCurr]||customCurricula[activeCurr]?.color||"#607D8B";
            return(
              <div key={monthData.month} style={{background:"#fff",borderRadius:14,overflow:"hidden",marginBottom:12,boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}}>
                <div style={{background:col,padding:"10px 14px"}}>
                  <span style={{fontSize:13,fontWeight:900,color:"#fff"}}>{monthData.month}</span>
                  <span style={{fontSize:12,color:"rgba(255,255,255,0.8)",marginLeft:8}}>/ {monthData.theme}</span>
                </div>
                <div style={{padding:"10px 13px",display:"flex",flexDirection:"column",gap:6}}>
                  {monthData.weeks.map((week,wi)=>(
                    <div key={wi} style={{display:"flex",alignItems:"center",gap:9,background:"#F8F7FC",borderRadius:9,padding:"9px 11px"}}>
                      <div style={{width:22,height:22,borderRadius:"50%",background:col,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:900,color:"#fff",flexShrink:0}}>{wi+1}</div>
                      <div>
                        <div style={{fontSize:10,color:"#bbb"}}>{wi+1}주차</div>
                        <div style={{fontSize:13,fontWeight:600,color:"#2C2440"}}>{week}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </>}
        {tab==="students"&&<>
          <input value={stuSearch} onChange={e=>setStuSearch(e.target.value)} placeholder="🔍 학생 검색..." style={{width:"100%",padding:"10px 13px",borderRadius:12,border:"2px solid #E8E3F5",fontSize:13,outline:"none",boxSizing:"border-box",background:"#fff",marginBottom:12}}/>
          <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
            {filteredStudents.map(name=>{
              const clsList = studentClassMap[name]||[];
              return(
                <button key={name} onClick={()=>setSelectedStudent(name)} style={{padding:"7px 12px",borderRadius:11,border:"2px solid #E8E3F5",background:"#fff",color:"#2C2440",fontSize:13,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:5}}>
                  <span style={{fontSize:13,background:currColors[clsList[0]?.currName]+"22",color:currColors[clsList[0]?.currName],borderRadius:6,padding:"0 5px",fontSize:10}}>{clsList[0]?.currName||""}</span>
                  {name}
                  <span style={{fontSize:10,color:"#bbb"}}>{clsList[0]?.day}요</span>
                </button>
              );
            })}
          </div>
        </>}
        {tab==="enrollment"&&<>
          <div style={{display:"flex",gap:7,marginBottom:14}}>
            {Object.entries(statusLabel).map(([key,label])=>(
              <button key={key} onClick={()=>setEnrollTab(key)} style={{
                flex:1,background:enrollTab===key?statusColor[key]:statusBg[key],
                border:`2px solid ${enrollTab===key?statusColor[key]:"transparent"}`,
                borderRadius:12,padding:"9px 4px",cursor:"pointer",textAlign:"center",
              }}>
                <div style={{fontSize:16}}>{statusEmoji[key]}</div>
                <div style={{fontSize:15,fontWeight:900,color:enrollTab===key?"#fff":statusColor[key]}}>{enrollStats[key]||0}</div>
                <div style={{fontSize:9,color:enrollTab===key?"rgba(255,255,255,0.8)":statusColor[key]}}>{label}</div>
              </button>
            ))}
          </div>
          <input value={enrollSearch} onChange={e=>setEnrollSearch(e.target.value)}
            placeholder="🔍 학생 검색..."
            style={{width:"100%",padding:"10px 13px",borderRadius:12,border:"2px solid #E8E3F5",fontSize:13,outline:"none",boxSizing:"border-box",background:"#fff",marginBottom:12}}
          />
          <button onClick={()=>setAddStudentModal(true)} style={{
            width:"100%",padding:"12px",borderRadius:12,border:"2px dashed #C8B8E8",
            background:"#F8F6FF",color:"#7C5CBF",fontSize:13,fontWeight:700,cursor:"pointer",marginBottom:12,
          }}>+ 새 학생 추가</button>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {allStudents
              .filter(name=>{
                const q=enrollSearch.toLowerCase();
                const matchSearch=!q||name.toLowerCase().includes(q);
                const matchTab=enrollments[name]?.status===enrollTab;
                return matchSearch&&matchTab;
              })
              .map(name=>{
                const enr = enrollments[name]||{status:"active"};
                const clsList = studentClassMap[name]||[];
                const col = statusColor[enr.status];
                return(
                  <div key={name} style={{background:"#fff",borderRadius:13,padding:"12px 14px",boxShadow:"0 2px 8px rgba(0,0,0,0.06)",borderLeft:`4px solid ${col}`}}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                      <div style={{display:"flex",alignItems:"center",gap:9}}>
                        <div style={{width:36,height:36,borderRadius:"50%",background:statusBg[enr.status],display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,fontWeight:900,color:col}}>{name[0]}</div>
                        <div>
                          <div style={{fontSize:14,fontWeight:700,color:"#2C2440"}}>{name}</div>
                          <div style={{display:"flex",gap:5,marginTop:2,flexWrap:"wrap"}}>
                            {clsList[0]&&<span style={{fontSize:10,background:"#F0EDE8",color:"#888",borderRadius:5,padding:"1px 6px"}}>{clsList[0].day}요일 {clsList[0].time}</span>}
                            {clsList[0]&&<span style={{fontSize:10,background:col+"22",color:col,borderRadius:5,padding:"1px 6px",fontWeight:700}}>{clsList[0].currName}</span>}
                          </div>
                          {enr.joinDate&&<div style={{fontSize:10,color:"#aaa",marginTop:1}}>등록: {enr.joinDate}{enr.leftDate&&(" / 퇴원: "+enr.leftDate)}</div>}
                        </div>
                      </div>
                      <button onClick={()=>setEnrollModal(name)} style={{background:statusBg[enr.status],border:"none",borderRadius:20,padding:"5px 11px",fontSize:11,fontWeight:700,color:col,cursor:"pointer"}}>
                        {statusEmoji[enr.status]} {statusLabel[enr.status]}
                      </button>
                    </div>
                    {enr.note&&<div style={{marginTop:8,padding:"7px 9px",background:"#F8F7FC",borderRadius:8,fontSize:12,color:"#666"}}>📝 {enr.note}</div>}
                    {enr.history?.length>0&&(
                      <div style={{marginTop:8,display:"flex",gap:4,flexWrap:"wrap"}}>
                        {enr.history.slice(-3).map((h,i)=>(
                          <span key={i} style={{fontSize:10,background:statusBg[h.type]||"#F0EDE8",color:statusColor[h.type]||"#888",borderRadius:6,padding:"2px 7px"}}>
                            {statusEmoji[h.type]} {h.date} {h.note}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            }
            {allStudents.filter(n=>(enrollments[n]?.status||"active")===enrollTab&&(!enrollSearch||n.toLowerCase().includes(enrollSearch.toLowerCase()))).length===0&&(
              <div style={{textAlign:"center",padding:"30px",color:"#ccc",fontSize:13}}>
                {statusEmoji[enrollTab]} {statusLabel[enrollTab]} 학생이 없어요
              </div>
            )}
          </div>
        </>}
      </div>
      {enrollModal&&(()=>{
        const enr = enrollments[enrollModal]||{status:"active",note:"",history:[]};
        const col = statusColor[enr.status];
        return(
          <div onClick={()=>setEnrollModal(null)} style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.55)",zIndex:1000,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
            <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:"20px 20px 0 0",padding:"22px 18px 40px",width:"100%",maxWidth:480,maxHeight:"80vh",overflowY:"auto"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{width:40,height:40,borderRadius:"50%",background:statusBg[enr.status],display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,fontWeight:900,color:col}}>{enrollModal[0]}</div>
                  <div>
                    <div style={{fontSize:18,fontWeight:900,color:"#2C2440"}}>{enrollModal}</div>
                    <span style={{fontSize:11,background:statusBg[enr.status],color:col,borderRadius:7,padding:"2px 8px",fontWeight:700}}>{statusEmoji[enr.status]} {statusLabel[enr.status]}</span>
                  </div>
                </div>
                <button onClick={()=>setEnrollModal(null)} style={{background:"#F4F2F9",border:"none",borderRadius:20,width:30,height:30,fontSize:15,cursor:"pointer",color:"#666"}}>✕</button>
              </div>
              <div style={{fontSize:12,fontWeight:700,color:"#A89CC8",marginBottom:9}}>상태 변경</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}>
                {Object.entries(statusLabel).map(([key,label])=>(
                  <button key={key} onClick={()=>{changeStatus(enrollModal,key);}} style={{
                    padding:"12px 8px",borderRadius:12,border:`2px solid ${enr.status===key?statusColor[key]:"#E8E3F5"}`,
                    background:enr.status===key?statusColor[key]:statusBg[key],
                    color:enr.status===key?"#fff":statusColor[key],
                    fontSize:13,fontWeight:700,cursor:"pointer",
                  }}>
                    {statusEmoji[key]} {label}
                    {enr.status===key&&<div style={{fontSize:9,opacity:0.8,marginTop:2}}>현재 상태</div>}
                  </button>
                ))}
              </div>
              <div style={{fontSize:12,fontWeight:700,color:"#A89CC8",marginBottom:7}}>📝 메모</div>
              <textarea
                value={enr.note||""}
                onChange={e=>updateEnrollment(enrollModal,{note:e.target.value})}
                placeholder="특이사항, 상담 내용 등 자유롭게..."
                style={{width:"100%",padding:"10px",borderRadius:10,border:"2px solid #E8E3F5",fontSize:13,resize:"none",minHeight:70,boxSizing:"border-box",outline:"none",marginBottom:14}}
              />
              {enr.history?.length>0&&<>
                <div style={{fontSize:12,fontWeight:700,color:"#A89CC8",marginBottom:7}}>📋 등록 이력</div>
                <div style={{display:"flex",flexDirection:"column",gap:5,marginBottom:14}}>
                  {[...enr.history].reverse().map((h,i)=>(
                    <div key={i} style={{display:"flex",alignItems:"center",gap:8,background:statusBg[h.type]||"#F8F7FC",borderRadius:9,padding:"7px 11px"}}>
                      <span style={{fontSize:14}}>{statusEmoji[h.type]||"📌"}</span>
                      <div>
                        <div style={{fontSize:12,fontWeight:700,color:statusColor[h.type]||"#666"}}>{statusLabel[h.type]||h.type} — {h.note}</div>
                        <div style={{fontSize:10,color:"#aaa"}}>{h.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </>}

              <button onClick={()=>setEnrollModal(null)} style={{width:"100%",padding:"13px",borderRadius:12,border:"none",background:"#2C2440",color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer"}}>완료</button>
            </div>
          </div>
        );
      })()}
      {addStudentModal&&(
        <div onClick={()=>setAddStudentModal(false)} style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.55)",zIndex:1000,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
          <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:"20px 20px 0 0",padding:"22px 18px 40px",width:"100%",maxWidth:480,maxHeight:"75vh",overflowY:"auto"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <div style={{fontSize:17,fontWeight:900,color:"#2C2440"}}>+ 새 학생 추가</div>
              <button onClick={()=>setAddStudentModal(false)} style={{background:"#F4F2F9",border:"none",borderRadius:20,width:30,height:30,fontSize:15,cursor:"pointer",color:"#666"}}>✕</button>
            </div>

            {[
              {label:"학생 이름 *",key:"name",placeholder:"예: 김민준"},
              {label:"등록일",key:"joinDate",placeholder:"예: 2025-04"},
              {label:"메모",key:"note",placeholder:"특이사항, 소개 경로 등"},
            ].map(({label,key,placeholder})=>(
              <div key={key} style={{marginBottom:12}}>
                <div style={{fontSize:12,fontWeight:700,color:"#666",marginBottom:5}}>{label}</div>
                <input
                  value={newStudentForm[key]||""}
                  onChange={e=>setNewStudentForm(p=>({...p,[key]:e.target.value}))}
                  placeholder={placeholder}
                  style={{width:"100%",padding:"10px 13px",borderRadius:10,border:"2px solid #E8E3F5",fontSize:13,outline:"none",boxSizing:"border-box"}}
                />
              </div>
            ))}

            <div style={{marginBottom:16}}>
              <div style={{fontSize:12,fontWeight:700,color:"#666",marginBottom:7}}>등록 유형</div>
              <div style={{display:"flex",gap:7}}>
                {[["new","🆕 신규"],["returning","🔄 재등록"]].map(([key,label])=>(
                  <button key={key} onClick={()=>setNewStudentForm(p=>({...p,status:key}))} style={{
                    flex:1,padding:"10px",borderRadius:10,border:`2px solid ${newStudentForm.status===key?statusColor[key]:"#E8E3F5"}`,
                    background:newStudentForm.status===key?statusColor[key]:statusBg[key],
                    color:newStudentForm.status===key?"#fff":statusColor[key],
                    fontSize:13,fontWeight:700,cursor:"pointer",
                  }}>{label}</button>
                ))}
              </div>
            </div>

            <button
              onClick={()=>{
                if(!newStudentForm.name.trim()) return;
                const today = new Date().toISOString().slice(0,7);
                setEnrollments(p=>({
                  ...p,
                  [newStudentForm.name]: {
                    status: newStudentForm.status||"new",
                    joinDate: newStudentForm.joinDate||today,
                    leftDate: null,
                    note: newStudentForm.note||"",
                    history:[{type:newStudentForm.status||"new",date:newStudentForm.joinDate||today,note:"등록"}]
                  }
                }));
                setNewStudentForm({name:"",joinDate:"",note:"",status:"new"});
                setAddStudentModal(false);
                setEnrollTab(newStudentForm.status||"new");
              }}
              style={{width:"100%",padding:"13px",borderRadius:12,border:"none",background:"#7C5CBF",color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer"}}
            >등록 완료</button>
          </div>
        </div>
      )}
      {lessonEditModal&&(
        <LessonEditModal
          modal={lessonEditModal}
          customLessons={customLessons}
          customCurricula={customCurricula}
          lessonEditKey={lessonEditKey}
          getCurrMonthData={getCurrMonthData}
          getCombinedCurriculum={getCombinedCurriculum}
          saveCustomLesson={saveCustomLesson}
          clearCustomLesson={clearCustomLesson}
          onClose={()=>setLessonEditModal(null)}
        />
      )}
      {tuitionModal&&(
        <div onClick={()=>setTuitionModal(null)} style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.55)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 20px"}}>
          <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:20,padding:"22px 20px",width:"100%",maxWidth:360}}>
            <div style={{fontSize:16,fontWeight:900,color:"#2C2440",marginBottom:4}}>💰 튜이션 금액 설정</div>
            <div style={{fontSize:12,color:"#A89CC8",marginBottom:16}}>{tuitionModal.studentName}의 월 수업료</div>
            <div style={{position:"relative",marginBottom:16}}>
              <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",fontSize:16,color:"#888"}}>$</span>
              <input
                type="number"
                defaultValue={getTuitionAmount(tuitionModal.studentName)}
                id="tuitionAmountInput"
                style={{width:"100%",padding:"12px 12px 12px 28px",borderRadius:11,border:"2px solid #E8E3F5",fontSize:18,fontWeight:700,outline:"none",boxSizing:"border-box"}}
              />
            </div>
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>{
                const val = document.getElementById("tuitionAmountInput").value;
                setTuitionAmounts(p=>({...p,[tuitionModal.studentName]:Number(val)||DEFAULT_TUITION}));
                setTuitionModal(null);
              }} style={{flex:1,padding:"12px",borderRadius:11,border:"none",background:"#7C5CBF",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer"}}>저장</button>
              <button onClick={()=>{
                setTuitionAmounts(p=>{const n={...p};delete n[tuitionModal.studentName];return n;});
                setTuitionModal(null);
              }} style={{flex:1,padding:"12px",borderRadius:11,border:"2px solid #E8E3F5",background:"#fff",color:"#aaa",fontSize:13,fontWeight:700,cursor:"pointer"}}>기본값($195)</button>
            </div>
          </div>
        </div>
      )}
      {noticeModal&&(()=>{
        const autoText = generateNotice(noticeModal.month, noticeModal.currData.theme, noticeModal.currData.weeks, noticeModal.cls, noticeModal.cls.day);
        const displayText = editableNotice || autoText;
        const col = currColors[noticeModal.cls.currName]||"#7C5CBF";
        return(
          <div onClick={()=>{setNoticeModal(null);setIsEditingNotice(false);setEditableNotice("");}} style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.5)",zIndex:1000,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
            <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:"20px 20px 0 0",padding:"20px 17px 38px",width:"100%",maxWidth:480,maxHeight:"88vh",overflowY:"auto"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:13}}>
                <div>
                  <div style={{fontSize:11,color:"#A89CC8"}}>학부모 안내문</div>
                  <div style={{fontSize:15,fontWeight:900,color:"#2C2440"}}>{noticeModal.month} · {noticeModal.cls.day}요일 {noticeModal.cls.time}</div>
                </div>
                <button onClick={()=>{setNoticeModal(null);setIsEditingNotice(false);setEditableNotice("");}} style={{background:"#F4F2F9",border:"none",borderRadius:20,width:30,height:30,fontSize:15,cursor:"pointer",color:"#666"}}>✕</button>
              </div>
              <div style={{display:"flex",background:"#F0EDE8",borderRadius:10,padding:3,marginBottom:12}}>
                <button onClick={()=>setIsEditingNotice(false)} style={{flex:1,padding:"8px",borderRadius:8,border:"none",background:!isEditingNotice?"#fff":"transparent",color:!isEditingNotice?"#2C2440":"#aaa",fontSize:12,fontWeight:700,cursor:"pointer",boxShadow:!isEditingNotice?"0 1px 4px rgba(0,0,0,0.1)":"none"}}>
                  👁️ 미리보기
                </button>
                <button onClick={()=>{setIsEditingNotice(true);if(!editableNotice)setEditableNotice(autoText);}} style={{flex:1,padding:"8px",borderRadius:8,border:"none",background:isEditingNotice?"#fff":"transparent",color:isEditingNotice?"#2C2440":"#aaa",fontSize:12,fontWeight:700,cursor:"pointer",boxShadow:isEditingNotice?"0 1px 4px rgba(0,0,0,0.1)":"none"}}>
                  ✏️ 직접 수정
                </button>
              </div>
              {!isEditingNotice&&(
                <div style={{background:"#F8F7FC",borderRadius:11,padding:"14px",fontSize:13,color:"#2C2440",lineHeight:1.9,whiteSpace:"pre-wrap",marginBottom:13,border:"1px solid #E8E3F5",minHeight:120}}>
                  {displayText}
                </div>
              )}
              {isEditingNotice&&(
                <div style={{marginBottom:13}}>
                  <textarea
                    value={editableNotice}
                    onChange={e=>setEditableNotice(e.target.value)}
                    style={{width:"100%",padding:"13px",borderRadius:11,border:"2px solid "+col,fontSize:13,color:"#2C2440",lineHeight:1.9,resize:"none",minHeight:280,boxSizing:"border-box",outline:"none",background:"#FEFEFE"}}
                  />
                  <button onClick={()=>{setEditableNotice(autoText);}} style={{width:"100%",padding:"8px",borderRadius:9,border:"2px solid #E8E3F5",background:"#fff",color:"#aaa",fontSize:11,fontWeight:700,cursor:"pointer",marginTop:6}}>
                    🔄 원래 내용으로 되돌리기
                  </button>
                </div>
              )}
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>{navigator.clipboard?.writeText(displayText);setCopied(true);setTimeout(()=>setCopied(false),2000);}} style={{flex:2,padding:"12px",borderRadius:11,border:"none",background:copied?"#E8F5E9":`linear-gradient(135deg,${col},${col}bb)`,color:copied?"#2E7D32":"#fff",fontSize:13,fontWeight:700,cursor:"pointer"}}>
                  {copied?"✅ 복사됨!":"📋 복사하기"}
                </button>
                <button onClick={()=>{setNoticeModal(null);setIsEditingNotice(false);setEditableNotice("");}} style={{flex:1,padding:"12px",borderRadius:11,border:"2px solid #E8E3F5",background:"#fff",color:"#888",fontSize:13,fontWeight:700,cursor:"pointer"}}>
                  닫기
                </button>
              </div>
            </div>
          </div>
        );
      })()}
      {tab==="settings"&&<div style={{padding:"14px"}}>
        <div style={{background:"#fff",borderRadius:14,overflow:"hidden",boxShadow:"0 2px 8px rgba(0,0,0,0.06)",marginBottom:14}}>
          <div style={{padding:"12px 15px",background:"#2C2440",color:"#fff",fontSize:13,fontWeight:700}}>📱 메인 탭 순서</div>
          <div style={{padding:"10px 14px 14px",display:"flex",flexDirection:"column",gap:7}}>
            <div style={{fontSize:11,color:"#A89CC8",marginBottom:4}}>↑↓ 버튼으로 순서를 바꿀 수 있어요</div>
            {mainTabOrder.map((key,idx)=>{
              const t=defaultMainTabs.find(t=>t.key===key);
              if(!t)return null;
              return(
                <div key={key} style={{display:"flex",alignItems:"center",justifyContent:"space-between",background:"#F8F7FC",borderRadius:10,padding:"10px 13px"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontSize:14,color:"#ccc"}}>☰</span>
                    <span style={{fontSize:13,fontWeight:700,color:"#2C2440"}}>{t.label}</span>
                  </div>
                  <div style={{display:"flex",gap:4}}>
                    <button onClick={()=>moveMainTab(idx,-1)} disabled={idx===0} style={{width:28,height:28,borderRadius:8,border:"none",background:idx===0?"#F0EDE8":"#E8E3F5",color:idx===0?"#ccc":"#555",fontSize:14,cursor:idx===0?"default":"pointer",fontWeight:700}}>↑</button>
                    <button onClick={()=>moveMainTab(idx,1)} disabled={idx===mainTabOrder.length-1} style={{width:28,height:28,borderRadius:8,border:"none",background:idx===mainTabOrder.length-1?"#F0EDE8":"#E8E3F5",color:idx===mainTabOrder.length-1?"#ccc":"#555",fontSize:14,cursor:idx===mainTabOrder.length-1?"default":"pointer",fontWeight:700}}>↓</button>
                  </div>
                </div>
              );
            })}
            <button onClick={()=>setMainTabOrder(defaultMainTabs.map(t=>t.key))} style={{padding:"9px",borderRadius:10,border:"2px solid #E8E3F5",background:"#fff",color:"#aaa",fontSize:12,fontWeight:700,cursor:"pointer",marginTop:4}}>🔄 기본 순서로 되돌리기</button>
          </div>
        </div>
        <div style={{background:"#fff",borderRadius:14,overflow:"hidden",boxShadow:"0 2px 8px rgba(0,0,0,0.06)",marginBottom:14}}>
          <div style={{padding:"12px 15px",background:"#2C2440",color:"#fff",fontSize:13,fontWeight:700}}>📚 커리큘럼 순서</div>
          <div style={{padding:"10px 14px 14px",display:"flex",flexDirection:"column",gap:7}}>
            <div style={{fontSize:11,color:"#A89CC8",marginBottom:4}}>자주 쓰는 커리큘럼을 위로 올려보세요</div>
            {curriculumTabOrder.map((name,idx)=>{
              const col=currColors[name]||customCurricula[name]?.color||"#607D8B";
              return(
                <div key={name} style={{display:"flex",alignItems:"center",justifyContent:"space-between",background:"#F8F7FC",borderRadius:10,padding:"9px 13px",borderLeft:`4px solid ${col}`}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontSize:14,color:"#ccc"}}>☰</span>
                    <div>
                      <span style={{fontSize:13,fontWeight:700,color:"#2C2440"}}>{name}</span>
                      {customCurricula[name]&&<span style={{fontSize:9,background:col+"22",color:col,borderRadius:5,padding:"1px 5px",marginLeft:5,fontWeight:700}}>커스텀</span>}
                    </div>
                  </div>
                  <div style={{display:"flex",gap:4}}>
                    <button onClick={()=>moveCurrTab(idx,-1)} disabled={idx===0} style={{width:28,height:28,borderRadius:8,border:"none",background:idx===0?"#F0EDE8":"#E8E3F5",color:idx===0?"#ccc":"#555",fontSize:14,cursor:idx===0?"default":"pointer",fontWeight:700}}>↑</button>
                    <button onClick={()=>moveCurrTab(idx,1)} disabled={idx===curriculumTabOrder.length-1} style={{width:28,height:28,borderRadius:8,border:"none",background:idx===curriculumTabOrder.length-1?"#F0EDE8":"#E8E3F5",color:idx===curriculumTabOrder.length-1?"#ccc":"#555",fontSize:14,cursor:idx===curriculumTabOrder.length-1?"default":"pointer",fontWeight:700}}>↓</button>
                  </div>
                </div>
              );
            })}
            <button onClick={()=>setCurriculumTabOrder([...curriculumNames,...Object.keys(customCurricula)])} style={{padding:"9px",borderRadius:10,border:"2px solid #E8E3F5",background:"#fff",color:"#aaa",fontSize:12,fontWeight:700,cursor:"pointer",marginTop:4}}>🔄 기본 순서로 되돌리기</button>
          </div>
        </div>

        <div style={{background:"#fff",borderRadius:14,padding:"16px",boxShadow:"0 2px 8px rgba(0,0,0,0.06)",textAlign:"center"}}>
          <div style={{fontSize:22,marginBottom:6}}>🎨</div>
          <div style={{fontSize:13,fontWeight:700,color:"#2C2440",marginBottom:3}}>Art Academy Planner</div>
          <div style={{fontSize:11,color:"#aaa"}}>월별 수업 · 커리큘럼 · 학생 관리 · 등록 이력</div>
        </div>
      </div>}
      {addCurrModal&&(
        <div onClick={()=>setAddCurrModal(false)} style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.55)",zIndex:1000,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
          <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:"20px 20px 0 0",padding:"22px 18px 40px",width:"100%",maxWidth:480,maxHeight:"75vh",overflowY:"auto"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <div style={{fontSize:17,fontWeight:900,color:"#2C2440"}}>📚 새 커리큘럼 추가</div>
              <button onClick={()=>setAddCurrModal(false)} style={{background:"#F4F2F9",border:"none",borderRadius:20,width:30,height:30,fontSize:15,cursor:"pointer",color:"#666"}}>✕</button>
            </div>
            <div style={{marginBottom:14}}>
              <div style={{fontSize:12,fontWeight:700,color:"#666",marginBottom:6}}>커리큘럼 이름 *</div>
              <input value={newCurrForm.name} onChange={e=>setNewCurrForm(p=>({...p,name:e.target.value}))}
                placeholder="예: 마미앤미2, 특별반 등"
                style={{width:"100%",padding:"10px 13px",borderRadius:10,border:"2px solid #E8E3F5",fontSize:13,outline:"none",boxSizing:"border-box"}}/>
            </div>
            <div style={{marginBottom:20}}>
              <div style={{fontSize:12,fontWeight:700,color:"#666",marginBottom:8}}>색상 선택</div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {colorOptions.map(col=>(
                  <button key={col} onClick={()=>setNewCurrForm(p=>({...p,color:col}))} style={{
                    width:34,height:34,borderRadius:"50%",background:col,border:`3px solid ${newCurrForm.color===col?"#2C2440":"transparent"}`,cursor:"pointer",
                  }}/>
                ))}
              </div>
            </div>
            <button onClick={()=>{
              if(!newCurrForm.name.trim()) return;
              setCustomCurricula(p=>({...p,[newCurrForm.name]:{color:newCurrForm.color,months:[]}}));
              setActiveCurr(newCurrForm.name);
              setNewCurrForm({name:"",color:"#607D8B"});
              setAddCurrModal(false);
            }} style={{width:"100%",padding:"13px",borderRadius:12,border:"none",background:"#7C5CBF",color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer"}}>
              추가 완료
            </button>
          </div>
        </div>
      )}
      {addMonthModal&&(
        <div onClick={()=>setAddMonthModal(false)} style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.55)",zIndex:1000,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
          <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:"20px 20px 0 0",padding:"22px 18px 40px",width:"100%",maxWidth:480,maxHeight:"85vh",overflowY:"auto"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <div>
                <div style={{fontSize:11,color:"#A89CC8"}}>{activeCurr}</div>
                <div style={{fontSize:17,fontWeight:900,color:"#2C2440"}}>📅 월 & 주차 추가</div>
              </div>
              <button onClick={()=>setAddMonthModal(false)} style={{background:"#F4F2F9",border:"none",borderRadius:20,width:30,height:30,fontSize:15,cursor:"pointer",color:"#666"}}>✕</button>
            </div>
            <div style={{marginBottom:12}}>
              <div style={{fontSize:12,fontWeight:700,color:"#666",marginBottom:7}}>월 선택 *</div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"].map(m=>(
                  <button key={m} onClick={()=>setNewMonthForm(p=>({...p,month:m}))} style={{
                    padding:"6px 12px",borderRadius:20,border:"none",
                    background:newMonthForm.month===m?"#2C2440":"#F0EDE8",
                    color:newMonthForm.month===m?"#fff":"#888",
                    fontSize:12,fontWeight:700,cursor:"pointer",
                  }}>{m}</button>
                ))}
              </div>
            </div>
            <div style={{marginBottom:12}}>
              <div style={{fontSize:12,fontWeight:700,color:"#666",marginBottom:6}}>이달 큰 주제</div>
              <input value={newMonthForm.theme} onChange={e=>setNewMonthForm(p=>({...p,theme:e.target.value}))}
                placeholder="예: 봄꽃, 여름바다, 동물 등"
                style={{width:"100%",padding:"10px 13px",borderRadius:10,border:"2px solid #E8E3F5",fontSize:13,outline:"none",boxSizing:"border-box"}}/>
            </div>
            {[["w1","1주차"],["w2","2주차"],["w3","3주차"],["w4","4주차"]].map(([key,label])=>(
              <div key={key} style={{marginBottom:10}}>
                <div style={{fontSize:12,fontWeight:700,color:"#666",marginBottom:5}}>{label} 수업 내용</div>
                <input value={newMonthForm[key]} onChange={e=>setNewMonthForm(p=>({...p,[key]:e.target.value}))}
                  placeholder={`예: ${label} 주제...`}
                  style={{width:"100%",padding:"9px 13px",borderRadius:10,border:"2px solid #E8E3F5",fontSize:13,outline:"none",boxSizing:"border-box"}}/>
              </div>
            ))}

            <button onClick={()=>{
              if(!newMonthForm.month) return;
              const newEntry = {
                month: newMonthForm.month,
                theme: newMonthForm.theme||"미정",
                weeks: [newMonthForm.w1||"1주차",newMonthForm.w2||"2주차",newMonthForm.w3||"3주차",newMonthForm.w4||"4주차"]
              };
              if(curriculum[activeCurr]) {
                alert("기본 커리큘럼은 수정이 안 돼요. 커스텀 커리큘럼에서 추가해주세요!");
                return;
              }
              setCustomCurricula(p=>({
                ...p,
                [activeCurr]:{
                  ...p[activeCurr],
                  months:[...(p[activeCurr]?.months||[]).filter(m=>m.month!==newMonthForm.month), newEntry]
                    .sort((a,b)=>["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"].indexOf(a.month)-["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"].indexOf(b.month))
                }
              }));
              setNewMonthForm({month:"",theme:"",w1:"",w2:"",w3:"",w4:""});
              setAddMonthModal(false);
            }} style={{width:"100%",padding:"13px",borderRadius:12,border:"none",background:"#7C5CBF",color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer",marginTop:8}}>
              저장
            </button>
          </div>
        </div>
      )}
      {selectedStudent&&(
        <div onClick={()=>setSelectedStudent(null)} style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.5)",zIndex:1000,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
          <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:"20px 20px 0 0",padding:"20px 17px 40px",width:"100%",maxWidth:480,maxHeight:"85vh",overflowY:"auto"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:42,height:42,borderRadius:"50%",background:"#EDE7F6",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:900,color:"#7C5CBF"}}>{selectedStudent[0]}</div>
                <div>
                  <div style={{fontSize:11,color:"#A89CC8"}}>학생 프로필</div>
                  <div style={{fontSize:19,fontWeight:900,color:"#2C2440"}}>{selectedStudent}</div>
                  {(studentClassMap[selectedStudent]||[]).map((c,i)=>(
                    <span key={i} style={{fontSize:10,background:currColors[c.currName]+"22",color:currColors[c.currName],borderRadius:6,padding:"1px 7px",fontWeight:700,marginRight:4}}>{c.currName} · {c.day}요일 {c.time}</span>
                  ))}
                </div>
              </div>
              <button onClick={()=>setSelectedStudent(null)} style={{background:"#F4F2F9",border:"none",borderRadius:20,width:30,height:30,fontSize:15,cursor:"pointer",color:"#666"}}>✕</button>
            </div>
            <div style={{fontSize:12,fontWeight:700,color:"#A89CC8",marginBottom:8}}>💰 월별 납부 현황</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:16}}>
              {monthOrder.map(m=>{
                const clsList = studentClassMap[selectedStudent]||[];
                const paid = clsList.some(c=>getTuition(c.id,selectedStudent,m));
                return(
                  <div key={m} style={{padding:"5px 10px",borderRadius:10,background:paid?"#E8F5E9":"#FFEBEE",fontSize:11,fontWeight:700,color:paid?"#2E7D32":"#C62828"}}>
                    {m} {paid?"✅":"⚠️"}
                  </div>
                );
              })}
            </div>
            <div style={{fontSize:12,fontWeight:700,color:"#A89CC8",marginBottom:8}}>📖 월별 수업 기록</div>
            {(studentClassMap[selectedStudent]||[]).map(c=>{
              const col = currColors[c.currName]||"#7C5CBF";
              return monthOrder.map(m=>{
                const currData = getCurrMonthData(c.currName,m);
                if(!currData) return null;
                const doneCount = currData.weeks.filter((_,wi)=>getLessonDone(c.id,m,wi)).length;
                const paid = getTuition(c.id,selectedStudent,m);
                if(doneCount===0 && !paid) return null;
                return(
                  <div key={m+c.id} style={{background:"#F8F7FC",borderRadius:11,padding:"10px 12px",marginBottom:8,borderLeft:`4px solid ${col}`}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                      <div>
                        <span style={{fontSize:12,fontWeight:900,color:"#2C2440"}}>{m}</span>
                        <span style={{fontSize:11,color:"#aaa",marginLeft:6}}>{currData.theme}</span>
                      </div>
                      <div style={{display:"flex",gap:5}}>
                        <span style={{fontSize:10,background:col+"22",color:col,borderRadius:5,padding:"1px 6px",fontWeight:700}}>{doneCount}/{currData.weeks.length}주</span>
                        <span style={{fontSize:10,background:paid?"#E8F5E9":"#FFEBEE",color:paid?"#2E7D32":"#C62828",borderRadius:5,padding:"1px 6px",fontWeight:700}}>{paid?"납부":"미납"}</span>
                      </div>
                    </div>
                    <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                      {currData.weeks.map((week,wi)=>{
                        const done = getLessonDone(c.id,m,wi);
                        return(
                          <span key={wi} style={{fontSize:11,background:done?col:"#eee",color:done?"#fff":"#bbb",borderRadius:7,padding:"2px 8px",fontWeight:done?700:400}}>
                            {wi+1}주 {week}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                );
              });
            })}
          </div>
        </div>
      )}
      {ldModal&&(()=>{
        const {cId,month,week,wLabel,cName,col}=ldModal;
        const det=getLd(cId,month,week);
        return(
          <div onClick={()=>setLdModal(null)} style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.55)",zIndex:2000,display:"flex",alignItems:"flex-end"}}>
            <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:"20px 20px 0 0",padding:"20px 16px 40px",width:"100%",maxHeight:"90vh",overflowY:"auto"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:14}}>
                <div>
                  <div style={{fontSize:11,color:"#aaa"}}>{cName}</div>
                  <div style={{fontSize:18,fontWeight:900,color:"#2C2440"}}>{wLabel} 수업</div>
                </div>
                <button onClick={()=>setLdModal(null)} style={{background:"#F4F2F9",border:"none",borderRadius:20,width:30,height:30,fontSize:15,cursor:"pointer"}}>X</button>
              </div>
              <div style={{marginBottom:10}}>
                <div style={{fontSize:11,fontWeight:700,color:"#E65100",marginBottom:5}}>준비물</div>
                <textarea value={det.materials||""} onChange={e=>setLd(cId,month,week,{...det,materials:e.target.value})} placeholder="스케치북, 물감..." style={{width:"100%",padding:"9px",borderRadius:9,border:"2px solid #FFE0B2",fontSize:12,outline:"none",resize:"none",minHeight:60,boxSizing:"border-box"}}></textarea>
              </div>
              <div style={{marginBottom:10}}>
                <div style={{fontSize:11,fontWeight:700,color:col,marginBottom:5}}>수업 내용</div>
                <textarea value={det.content||""} onChange={e=>setLd(cId,month,week,{...det,content:e.target.value})} placeholder="수업 내용, 목표..." style={{width:"100%",padding:"9px",borderRadius:9,border:"2px solid #E8E3DC",fontSize:12,outline:"none",resize:"none",minHeight:100,boxSizing:"border-box"}}></textarea>
              </div>
              <div style={{marginBottom:12}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                  <div style={{fontSize:11,fontWeight:700,color:"#2E7D32"}}>사진</div>
                  <label style={{padding:"4px 10px",borderRadius:8,background:"#E8F5E9",color:"#2E7D32",fontSize:11,fontWeight:700,cursor:"pointer"}}>+ 추가
                    <input type="file" accept="image/*" multiple onChange={e=>{const files=[...e.target.files];const key=cId+"|"+month+"|"+week;files.forEach(file=>{const r=new FileReader();r.onload=ev=>{const img=new Image();img.onload=()=>{const cv=document.createElement("canvas");let w=img.width,h=img.height;if(w>800){h=h*800/w;w=800;}cv.width=w;cv.height=h;cv.getContext("2d").drawImage(img,0,0,w,h);const dataUrl=cv.toDataURL("image/jpeg",0.7);setLessonDetails(prev=>{const cur=prev[key]||{content:"",materials:"",photos:[]};return{...prev,[key]:{...cur,photos:[...(cur.photos||[]),dataUrl]}};});};img.src=ev.target.result;};r.readAsDataURL(file);});e.target.value="";}} style={{display:"none"}}/>
                  </label>
                </div>
                {(det.photos||[]).length>0?<div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:5}}>{(det.photos||[]).map((p,pi)=>(<div key={pi} style={{position:"relative",aspectRatio:"1"}}><img src={p} onClick={()=>setPhotoViewer({photos:det.photos,idx:pi})} style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:8,cursor:"pointer"}} alt=""/><button onClick={()=>setLd(cId,month,week,{...det,photos:det.photos.filter((_,i)=>i!==pi)})} style={{position:"absolute",top:2,right:2,width:16,height:16,borderRadius:"50%",border:"none",background:"rgba(0,0,0,0.5)",color:"#fff",fontSize:9,cursor:"pointer"}}>X</button></div>))}</div>:<div style={{textAlign:"center",padding:"12px",background:"#F8F7F4",borderRadius:8,color:"#ccc",fontSize:11}}>사진 없음</div>}
              </div>
              <div style={{display:"flex",gap:7}}>
                <button onClick={()=>setLdModal(null)} style={{flex:1,padding:"11px",background:"#2C2440",color:"#fff",border:"none",borderRadius:10,fontSize:13,fontWeight:700,cursor:"pointer"}}>완료</button>
                {(det.content||det.materials)&&<button onClick={()=>setLd(cId,month,week,{content:"",materials:"",photos:[]})} style={{flex:1,padding:"11px",background:"#fff",color:"#C62828",border:"2px solid #FFEBEE",borderRadius:10,fontSize:11,fontWeight:700,cursor:"pointer"}}>초기화</button>}
              </div>
            </div>
          </div>
        );
      })()}
      {photoViewer&&(()=>{
        const swipeStart={x:0};
        const handleTouchStart=e=>{swipeStart.x=e.touches[0].clientX;};
        const handleTouchEnd=e=>{
          const dx=e.changedTouches[0].clientX-swipeStart.x;
          if(dx<-50&&photoViewer.idx<photoViewer.photos.length-1) setPhotoViewer(p=>({...p,idx:p.idx+1}));
          if(dx>50&&photoViewer.idx>0) setPhotoViewer(p=>({...p,idx:p.idx-1}));
        };
        return(
          <div onClick={()=>setPhotoViewer(null)} style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.95)",zIndex:3000,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
            <button onClick={()=>setPhotoViewer(null)} style={{position:"absolute",top:16,right:16,background:"rgba(255,255,255,0.2)",border:"none",borderRadius:20,width:36,height:36,color:"#fff",fontSize:18,cursor:"pointer"}}>✕</button>
            <div style={{fontSize:11,color:"rgba(255,255,255,0.5)",marginBottom:10}}>{photoViewer.idx+1} / {photoViewer.photos.length}</div>
            <img
              src={photoViewer.photos[photoViewer.idx]} alt=""
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onClick={e=>e.stopPropagation()}
              style={{maxWidth:"95vw",maxHeight:"75vh",objectFit:"contain",borderRadius:8,userSelect:"none"}}/>
            <div style={{display:"flex",gap:12,marginTop:16}}>
              <button onClick={e=>{e.stopPropagation();setPhotoViewer(p=>({...p,idx:Math.max(0,p.idx-1)}));}} style={{width:40,height:40,borderRadius:"50%",border:"none",background:"rgba(255,255,255,0.2)",color:"#fff",fontSize:20,cursor:"pointer",opacity:photoViewer.idx===0?0.3:1}}>‹</button>
              <button onClick={e=>{e.stopPropagation();setPhotoViewer(p=>({...p,idx:Math.min(p.photos.length-1,p.idx+1)}));}} style={{width:40,height:40,borderRadius:"50%",border:"none",background:"rgba(255,255,255,0.2)",color:"#fff",fontSize:20,cursor:"pointer",opacity:photoViewer.idx===photoViewer.photos.length-1?0.3:1}}>›</button>
            </div>
            <div style={{display:"flex",gap:6,marginTop:12}}>
              {photoViewer.photos.map((_,i)=>(
                <div key={i} onClick={e=>{e.stopPropagation();setPhotoViewer(p=>({...p,idx:i}));}} style={{width:8,height:8,borderRadius:"50%",background:i===photoViewer.idx?"#fff":"rgba(255,255,255,0.3)",cursor:"pointer"}}/>
              ))}
            </div>
          </div>
        );
      })()}
      {statsModal&&(()=>{
        const month = activeMonth;
        const paidSet = new Set();
        allClasses.forEach(cls=>{cls.students.forEach(s=>{if(getTuition(cls.id,s.name,month)) paidSet.add(s.name);});});
        const unpaidStudents = allStudents.filter(s=>!paidSet.has(s));
        const paidStudents = allStudents.filter(s=>paidSet.has(s));

        let title="", items=[], color="#7C5CBF";
        if(statsModal==="students"){
          title="👦 전체 학생 "+allStudents.length+"명";
          items=allStudents.map(s=>({name:s, sub:allClasses.filter(c=>c.students.some(st=>st.name===s)).map(c=>c.name).join(", ")}));
          color="#A07FD6";
        } else if(statsModal==="paid"){
          title="✅ "+month+" 납부 완료 "+paidStudents.length+"명";
          items=paidStudents.map(s=>({name:s, sub:allClasses.filter(c=>c.students.some(st=>st.name===s)).map(c=>c.name).join(", ")}));
          color="#4CAF50";
        } else if(statsModal==="unpaid"){
          title="⚠️ 미납 "+unpaidStudents.length+"명";
          items=unpaidStudents.map(s=>({name:s, sub:allClasses.filter(c=>c.students.some(st=>st.name===s)).map(c=>c.name).join(", ")}));
          color="#EF5350";
        } else if(statsModal==="classes"){
          title="🎨 전체 클래스 "+allClasses.length+"개";
          items=allClasses.map(c=>({name:c.name, sub:c.students.map(s=>s.name).join(", ")+" ("+c.students.length+"명)"}));
          color="#CE93D8";
        }
        return(
          <div onClick={()=>setStatsModal(null)} style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.6)",zIndex:2000,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
            <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:"20px 20px 0 0",padding:"22px 18px 40px",width:"100%",maxWidth:480,maxHeight:"80vh",overflowY:"auto"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                <div style={{fontSize:17,fontWeight:900,color:"#2C2440"}}>{title}</div>
                <button onClick={()=>setStatsModal(null)} style={{background:"#F4F2F9",border:"none",borderRadius:20,width:30,height:30,fontSize:15,cursor:"pointer"}}>✕</button>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {items.map((item,i)=>(
                  <div key={i} style={{padding:"10px 14px",background:"#F8F7F4",borderRadius:10,borderLeft:"3px solid "+color}}>
                    <div style={{fontSize:14,fontWeight:700,color:"#2C2440"}}>{item.name}</div>
                    <div style={{fontSize:11,color:"#888",marginTop:2}}>{item.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}