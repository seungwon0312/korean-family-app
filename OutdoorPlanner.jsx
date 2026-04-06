import { useState, useEffect } from "react";

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

// ── 백패킹 100곳 (프레즈노 5시간 이내) ─────────────────
const BACKPACKING = [
  // ── SIERRA NEVADA (1~40) ──
  {id:1,name:"John Muir Trail (Full)",area:"Sierra Nevada",drive:"2h",duration:"21일",miles:211,type:"thru",difficulty:"hard",permit:"required",desc:"Mt. Whitney → Yosemite Valley, 캘리포니아 최고 장거리 트레일"},
  {id:2,name:"JMT Section: Reds Meadow → Tuolumne",area:"Sierra Nevada",drive:"2.5h",duration:"4일",miles:40,type:"section",difficulty:"moderate",permit:"required",desc:"레인보우 폴스, 아이작월폭포 등 경유"},
  {id:3,name:"Rae Lakes Loop",area:"Kings Canyon NP",drive:"1.5h",duration:"4-5일",miles:41,type:"loop",difficulty:"hard",permit:"required",desc:"4개의 에메랄드빛 호수, 시에라 네바다 대표 백패킹"},
  {id:4,name:"Tablelands & Big Arroyo",area:"Sequoia NP",drive:"1.5h",duration:"3-4일",miles:30,type:"loop",difficulty:"hard",permit:"required",desc:"자이언트 세쿼이아 숲 관통, 광활한 고원 지대"},
  {id:5,name:"Mineral King to Sawtooth Peak",area:"Sequoia NP",drive:"2h",duration:"2-3일",miles:22,type:"out-back",difficulty:"hard",permit:"required",desc:"해발 12,343ft 소투스 피크, 광산 마을 출발"},
  {id:6,name:"High Sierra Trail",area:"Sequoia NP",drive:"1.5h",duration:"7-10일",miles:72,type:"one-way",difficulty:"hard",permit:"required",desc:"크레센트 메도우 → Mt. Whitney, 시에라 횡단"},
  {id:7,name:"Evolution Valley Loop",area:"Sierra NF",drive:"2h",duration:"5-7일",miles:55,type:"loop",difficulty:"hard",permit:"required",desc:"에볼루션 레이크 시리즈, JMT 하이라이트"},
  {id:8,name:"Palisades Glacier Base Camp",area:"Inyo NF",drive:"3h",duration:"2-3일",miles:18,type:"out-back",difficulty:"hard",permit:"required",desc:"캘리포니아 최대 빙하 근접, 팰리세이즈 봉우리"},
  {id:9,name:"Cottonwood Lakes Loop",area:"Inyo NF",drive:"3h",duration:"2-3일",miles:25,type:"loop",difficulty:"moderate",permit:"required",desc:"Southern Sierra 입구, Mt. Whitney 남쪽 루트"},
  {id:10,name:"Chicken Spring Lake",area:"Inyo NF",drive:"3h",duration:"1-2일",miles:10,type:"out-back",difficulty:"moderate",permit:"none",desc:"해발 11,242ft, 비교적 쉬운 고산 호수 백패킹"},
  {id:11,name:"Bishop Pass Trail",area:"Inyo NF",drive:"3h",duration:"2-3일",miles:22,type:"out-back",difficulty:"hard",permit:"required",desc:"비숍에서 출발, 4개의 고산 호수 경유"},
  {id:12,name:"Dusy Basin",area:"Kings Canyon NP",drive:"3h",duration:"2-3일",miles:18,type:"out-back",difficulty:"hard",permit:"required",desc:"비숍 패스를 통해 진입, 에메랄드 호수 군락"},
  {id:13,name:"LeConte Canyon",area:"Kings Canyon NP",drive:"2h",duration:"3-4일",miles:28,type:"out-back",difficulty:"moderate",permit:"required",desc:"Middle Fork Kings River 협곡, JMT 구간"},
  {id:14,name:"Goddard Canyon",area:"Sierra NF",drive:"2h",duration:"4-5일",miles:38,type:"loop",difficulty:"hard",permit:"required",desc:"원격 지역, 인적 드문 아름다운 캐니언"},
  {id:15,name:"Mono Creek to Lake Edison",area:"Sierra NF",drive:"2.5h",duration:"3-4일",miles:30,type:"one-way",difficulty:"moderate",permit:"required",desc:"모노 핫스프링스 경유, 레이크 에디슨 도착"},
  {id:16,name:"Silver Pass Loop",area:"Inyo NF",drive:"2.5h",duration:"3-4일",miles:32,type:"loop",difficulty:"moderate",permit:"required",desc:"실버 패스 5개 호수, 멋진 전망대"},
  {id:17,name:"Duck Pass to Barney Lake",area:"Inyo NF",drive:"2.5h",duration:"2일",miles:16,type:"out-back",difficulty:"moderate",permit:"none",desc:"매머드 레이크스 근처, 인기 있는 주말 백패킹"},
  {id:18,name:"Thousand Island Lake",area:"Inyo NF",drive:"2.5h",duration:"2일",miles:14,type:"out-back",difficulty:"moderate",permit:"required",desc:"아이콘적인 뱅크스 봉우리 반영, JMT 하이라이트"},
  {id:19,name:"Garnet Lake",area:"Inyo NF",drive:"2.5h",duration:"2일",miles:12,type:"out-back",difficulty:"moderate",permit:"required",desc:"썬셋 포인트 최고, 뱅크스 봉우리 뷰"},
  {id:20,name:"Shadow Lake Loop",area:"Inyo NF",drive:"2.5h",duration:"2-3일",miles:20,type:"loop",difficulty:"moderate",permit:"required",desc:"폭포와 호수 연속, 매머드 출발"},
  {id:21,name:"Ansel Adams Wilderness Loop",area:"Sierra NF",drive:"2h",duration:"4-5일",miles:42,type:"loop",difficulty:"hard",permit:"required",desc:"안셀 아담스 사진 배경, 아이코닉 뷰"},
  {id:22,name:"Kaiser Wilderness",area:"Sierra NF",drive:"1.5h",duration:"2-3일",miles:22,type:"loop",difficulty:"moderate",permit:"none",desc:"프레즈노 가장 가까운 시에라 백패킹"},
  {id:23,name:"Dinkey Lakes Wilderness",area:"Sierra NF",drive:"1.5h",duration:"2일",miles:18,type:"loop",difficulty:"easy",permit:"none",desc:"가족 백패킹 추천, 여러 아름다운 호수"},
  {id:24,name:"Ten Lakes Basin",area:"Yosemite NP",drive:"3h",duration:"2-3일",miles:22,type:"out-back",difficulty:"hard",permit:"required",desc:"10개 호수 분지, 요세미티 북쪽 숨겨진 보석"},
  {id:25,name:"Grand Canyon of the Tuolumne",area:"Yosemite NP",drive:"3h",duration:"3-4일",miles:30,type:"one-way",difficulty:"hard",permit:"required",desc:"투올럼니 강 협곡, 폭포 연속"},
  {id:26,name:"Yosemite Valley to Tuolumne",area:"Yosemite NP",drive:"3h",duration:"3-4일",miles:28,type:"one-way",difficulty:"hard",permit:"required",desc:"하프돔 경유 가능, 요세미티 종단"},
  {id:27,name:"Half Dome via JMT",area:"Yosemite NP",drive:"3h",duration:"2일",miles:16,type:"out-back",difficulty:"hard",permit:"required",desc:"하프돔 정상, 요세미티 상징적 백패킹"},
  {id:28,name:"Cloud's Rest Overnight",area:"Yosemite NP",drive:"3h",duration:"2일",miles:14,type:"out-back",difficulty:"moderate",permit:"required",desc:"클라우드레스트 정상 일출, 360도 파노라마"},
  {id:29,name:"Vogelsang High Sierra Camp Loop",area:"Yosemite NP",drive:"3h",duration:"3일",miles:27,type:"loop",difficulty:"hard",permit:"required",desc:"요세미티 하이 시에라 캠프 경유"},
  {id:30,name:"Young Lakes Loop",area:"Yosemite NP",drive:"3h",duration:"2-3일",miles:20,type:"loop",difficulty:"moderate",permit:"required",desc:"투올럼니 메도우 출발, 3개 호수"},
  // ── COASTAL & OTHER CA (31~55) ──
  {id:31,name:"Lost Coast Trail",area:"Humboldt County",drive:"5h",duration:"3-4일",miles:25,type:"one-way",difficulty:"moderate",permit:"required",desc:"캘리포니아 유일 원시 해안, 해변 백패킹"},
  {id:32,name:"Skyline-to-Sea Trail",area:"Big Basin SP",drive:"4h",duration:"2-3일",miles:30,type:"one-way",difficulty:"easy",permit:"required",desc:"산타크루즈 산맥에서 해변까지"},
  {id:33,name:"Ventana Wilderness Loop",area:"Los Padres NF",drive:"4h",duration:"3-4일",miles:35,type:"loop",difficulty:"hard",permit:"required",desc:"빅서 내륙 원시 지역, 적송 숲"},
  {id:34,name:"Pine Ridge Trail to Big Sur",area:"Los Padres NF",drive:"4h",duration:"2-3일",miles:22,type:"out-back",difficulty:"moderate",permit:"required",desc:"빅서 강변 캠핑, 해안 산맥 뷰"},
  {id:35,name:"Ohlone Wilderness Trail",area:"East Bay",drive:"3.5h",duration:"2일",miles:28,type:"one-way",difficulty:"moderate",permit:"required",desc:"베이 에어리어 최고 백패킹 트레일"},
  {id:36,name:"Hoover Wilderness",area:"Toiyabe NF",drive:"3.5h",duration:"3-4일",miles:30,type:"loop",difficulty:"hard",permit:"none",desc:"이스턴 시에라 최북단, 인적 드문 지역"},
  {id:37,name:"Emigrant Wilderness",area:"Stanislaus NF",drive:"3h",duration:"3-4일",miles:35,type:"loop",difficulty:"moderate",permit:"none",desc:"요세미티 서쪽, 접근성 좋은 시에라 백패킹"},
  {id:38,name:"Desolation Wilderness",area:"Lake Tahoe",drive:"4.5h",duration:"2-3일",miles:25,type:"loop",difficulty:"moderate",permit:"required",desc:"레이크 타호 남서쪽, 화강암 경관"},
  {id:39,name:"Granite Chief Wilderness",area:"Lake Tahoe",drive:"4.5h",duration:"2일",miles:18,type:"loop",difficulty:"moderate",permit:"none",desc:"타호 남쪽 덜 알려진 구역"},
  {id:40,name:"Mokelumne Wilderness",area:"El Dorado NF",drive:"4h",duration:"2-3일",miles:22,type:"loop",difficulty:"moderate",permit:"none",desc:"시에라 북쪽, 아름다운 고산 호수"},
  // ── DESERT & SOUTHERN CA (41~60) ──
  {id:41,name:"Mt. Whitney Summit",area:"Inyo NF",drive:"3h",duration:"2일",miles:22,type:"out-back",difficulty:"hard",permit:"required",desc:"미국 본토 최고봉 14,505ft, 최고의 달성감"},
  {id:42,name:"Whitney Portal to Cottonwood",area:"Inyo NF",drive:"3h",duration:"3-4일",miles:35,type:"one-way",difficulty:"hard",permit:"required",desc:"휘트니 포털 → 코튼우드 패스 종단"},
  {id:43,name:"Kearsarge Pass to Rae Lakes",area:"Inyo NF",drive:"3h",duration:"3일",miles:30,type:"out-back",difficulty:"hard",permit:"required",desc:"키어사지 패스로 JMT 진입"},
  {id:44,name:"Golden Trout Wilderness",area:"Inyo NF",drive:"3h",duration:"3-4일",miles:32,type:"loop",difficulty:"hard",permit:"required",desc:"황금 송어 서식지, 원격 시에라"},
  {id:45,name:"Domeland Wilderness",area:"Sequoia NF",drive:"2.5h",duration:"2일",miles:16,type:"loop",difficulty:"moderate",permit:"none",desc:"화강암 돔 군락, 커른 강변"},
  {id:46,name:"Sespe Wilderness",area:"Los Padres NF",drive:"4h",duration:"2-3일",miles:24,type:"loop",difficulty:"moderate",permit:"none",desc:"캘리포니아 콘도르 서식지"},
  {id:47,name:"San Gorgonio Wilderness",area:"San Bernardino NF",drive:"5h",duration:"2일",miles:20,type:"loop",difficulty:"hard",permit:"required",desc:"서던 CA 최고봉 11,503ft"},
  {id:48,name:"San Jacinto Wilderness",area:"San Bernardino NF",drive:"5h",duration:"2일",miles:18,type:"loop",difficulty:"hard",permit:"required",desc:"팜스프링스 케이블카로 진입 가능"},
  {id:49,name:"Death Valley: Telescope Peak",area:"Death Valley NP",drive:"4h",duration:"2일",miles:14,type:"out-back",difficulty:"hard",permit:"none",desc:"데스밸리 최고봉 11,049ft, 사막 전망"},
  {id:50,name:"Joshua Tree: Boy Scout Trail",area:"Joshua Tree NP",drive:"4.5h",duration:"2일",miles:16,type:"one-way",difficulty:"moderate",permit:"none",desc:"조슈아 트리 횡단, 사막 별밤 캠핑"},
  // ── PACIFIC CREST TRAIL SECTIONS (51~65) ──
  {id:51,name:"PCT: Tehachapi to Kennedy Meadows",area:"Sequoia NF",drive:"3h",duration:"5-7일",miles:65,type:"section",difficulty:"hard",permit:"none",desc:"PCT 사막→시에라 전환 구간"},
  {id:52,name:"PCT: Kennedy Meadows to Forester Pass",area:"Sequoia/Inyo NF",drive:"3h",duration:"7-10일",miles:75,type:"section",difficulty:"hard",permit:"required",desc:"PCT 하이 시에라 시작 구간, 포레스터 패스"},
  {id:53,name:"PCT: Sonora Pass to Yosemite",area:"Stanislaus NF",drive:"3h",duration:"4-5일",miles:40,type:"section",difficulty:"hard",permit:"required",desc:"소노라 패스에서 요세미티까지"},
  {id:54,name:"PCT: Lake Tahoe Section",area:"El Dorado NF",drive:"4h",duration:"3-4일",miles:35,type:"section",difficulty:"moderate",permit:"none",desc:"타호 레이크 주변 PCT 구간"},
  {id:55,name:"PCT: Etna Summit to Seiad Valley",area:"Klamath NF",drive:"5h",duration:"3-4일",miles:32,type:"section",difficulty:"moderate",permit:"none",desc:"북부 CA PCT, 클래머스 산맥"},
  // ── NORTHERN CA (56~70) ──
  {id:56,name:"Trinity Alps Wilderness",area:"Trinity NF",drive:"5h",duration:"3-4일",miles:28,type:"loop",difficulty:"hard",permit:"none",desc:"CA 북부 알프스, 크리스탈 클리어 호수"},
  {id:57,name:"Marble Mountain Wilderness",area:"Klamath NF",drive:"5h",duration:"3-4일",miles:30,type:"loop",difficulty:"moderate",permit:"none",desc:"석회암 동굴, 희귀 꽃 군락"},
  {id:58,name:"Russian Wilderness",area:"Klamath NF",drive:"5h",duration:"2-3일",miles:20,type:"loop",difficulty:"moderate",permit:"none",desc:"소규모 원시 구역, 고산 호수"},
  {id:59,name:"Mt. Shasta Summit Attempt",area:"Shasta-Trinity NF",drive:"4.5h",duration:"2일",miles:11,type:"out-back",difficulty:"extreme",permit:"required",desc:"14,179ft 화산, 클라이밍 필요"},
  {id:60,name:"Lassen Volcanic Backcountry",area:"Lassen NP",drive:"4.5h",duration:"2-3일",miles:22,type:"loop",difficulty:"moderate",permit:"required",desc:"활화산 지역, 열수 웅덩이 주변"},
  // ── MORE SIERRA & SPECIAL (61~80) ──
  {id:61,name:"Enchanted Gorge",area:"Kings Canyon NP",drive:"2h",duration:"5-7일",miles:50,type:"cross-country",difficulty:"extreme",permit:"required",desc:"비공식 루트, 탐험적 백패킹"},
  {id:62,name:"Ionian Basin",area:"Kings Canyon NP",drive:"2h",duration:"4-5일",miles:40,type:"cross-country",difficulty:"extreme",permit:"required",desc:"가장 원격한 시에라 지역 중 하나"},
  {id:63,name:"Tehipite Valley",area:"Kings Canyon NP",drive:"2h",duration:"3-4일",miles:25,type:"out-back",difficulty:"hard",permit:"required",desc:"비공개 협곡, 600ft 화강암 돔"},
  {id:64,name:"Kern River Canyon",area:"Sequoia NF",drive:"2.5h",duration:"3-4일",miles:32,type:"out-back",difficulty:"moderate",permit:"none",desc:"커른 강 따라 걷는 야생 강변 트레일"},
  {id:65,name:"Rincon Trail (Los Padres)",area:"Los Padres NF",drive:"4.5h",duration:"2-3일",miles:24,type:"loop",difficulty:"moderate",permit:"none",desc:"빅서 내륙, 봄꽃 군락"},
  {id:66,name:"Mt. Ritter & Banner Peak",area:"Ansel Adams Wilderness",drive:"2.5h",duration:"3일",miles:24,type:"out-back",difficulty:"hard",permit:"required",desc:"클래식 클라이머 목적지"},
  {id:67,name:"Matterhorn Peak",area:"Hoover Wilderness",drive:"3.5h",duration:"2일",miles:12,type:"out-back",difficulty:"extreme",permit:"none",desc:"이스턴 시에라 클래식 클라이밍"},
  {id:68,name:"Yosemite: Waterwheel Falls",area:"Yosemite NP",drive:"3h",duration:"3일",miles:26,type:"out-back",difficulty:"hard",permit:"required",desc:"요세미티 최고 폭포 중 하나"},
  {id:69,name:"Yosemite: Hetch Hetchy to Tiltill Valley",area:"Yosemite NP",drive:"3h",duration:"2-3일",miles:22,type:"out-back",difficulty:"moderate",permit:"required",desc:"헤치헤치 저수지 주변, 덜 붐비는 구역"},
  {id:70,name:"Yosemite: Benson Lake",area:"Yosemite NP",drive:"3h",duration:"3-4일",miles:32,type:"out-back",difficulty:"hard",permit:"required",desc:"요세미티 최고의 수영 호수"},
  {id:71,name:"Pine Creek to Italy Pass",area:"Inyo NF",drive:"3h",duration:"2-3일",miles:20,type:"out-back",difficulty:"hard",permit:"required",desc:"이탈리 패스 via 파인 크릭"},
  {id:72,name:"Lamarck Col to Darwin Bench",area:"Inyo NF",drive:"3h",duration:"3일",miles:22,type:"cross-country",difficulty:"extreme",permit:"required",desc:"크로스컨트리 루트, 다윈 벤치"},
  {id:73,name:"Red's Meadow to Devil's Postpile",area:"Inyo NF",drive:"2.5h",duration:"1-2일",miles:10,type:"loop",difficulty:"easy",permit:"none",desc:"데빌스 포스트파일 국가 기념물"},
  {id:74,name:"Convict Lake to Genevieve Lake",area:"Inyo NF",drive:"3h",duration:"2일",miles:14,type:"out-back",difficulty:"moderate",permit:"none",desc:"아름다운 컨빅트 레이크 출발"},
  {id:75,name:"Rock Creek to Ruby Lake",area:"Inyo NF",drive:"3h",duration:"2일",miles:12,type:"out-back",difficulty:"moderate",permit:"none",desc:"록 크릭 레이크 출발, 루비 레이크"},
  {id:76,name:"Sabrina Basin",area:"Inyo NF",drive:"3h",duration:"2일",miles:14,type:"out-back",difficulty:"moderate",permit:"none",desc:"레이크 사브리나 출발, 다중 호수"},
  {id:77,name:"North Lake to South Lake Loop",area:"Inyo NF",drive:"3h",duration:"3-4일",miles:34,type:"loop",difficulty:"hard",permit:"required",desc:"비숍 패스 + 피나클 패스 연결"},
  {id:78,name:"Big Pine Lakes",area:"Inyo NF",drive:"3h",duration:"2일",miles:14,type:"out-back",difficulty:"moderate",permit:"none",desc:"1~7호 호수, 팰리세이즈 빙하 뷰"},
  {id:79,name:"Taboose Pass to Kings Canyon",area:"Inyo NF/Kings Canyon",drive:"3h",duration:"3-4일",miles:28,type:"out-back",difficulty:"extreme",permit:"required",desc:"급경사 패스, 웅장한 킹스 캐니언 진입"},
  {id:80,name:"Sawmill Pass",area:"Inyo NF",drive:"3h",duration:"2-3일",miles:20,type:"out-back",difficulty:"hard",permit:"required",desc:"인적 드문 루트, 솔로 백패킹 추천"},
  // ── BONUS SPOTS (81~100) ──
  {id:81,name:"Mt. Whitney via Mountaineer's Route",area:"Inyo NF",drive:"3h",duration:"2일",miles:16,type:"out-back",difficulty:"extreme",permit:"required",desc:"일반 루트보다 험난, 클라이밍 경험 권장"},
  {id:82,name:"Pate Valley",area:"Yosemite NP",drive:"3h",duration:"3일",miles:26,type:"out-back",difficulty:"hard",permit:"required",desc:"요세미티 저지대 협곡, 여름 수영"},
  {id:83,name:"Glen Aulin",area:"Yosemite NP",drive:"3h",duration:"2일",miles:12,type:"out-back",difficulty:"easy",permit:"required",desc:"투올럼니 메도우 출발, 폭포 연속"},
  {id:84,name:"Lyell Canyon",area:"Yosemite NP",drive:"3h",duration:"2-3일",miles:22,type:"out-back",difficulty:"easy",permit:"required",desc:"요세미티 가장 편안한 백패킹"},
  {id:85,name:"Illilouette Basin",area:"Yosemite NP",drive:"3h",duration:"2일",miles:16,type:"out-back",difficulty:"moderate",permit:"required",desc:"이리루엣 폭포 경유, 덜 알려진 구역"},
  {id:86,name:"Huckleberry Lake",area:"Emigrant Wilderness",drive:"3h",duration:"2일",miles:14,type:"out-back",difficulty:"moderate",permit:"none",desc:"허클베리 레이크, 낚시 천국"},
  {id:87,name:"Relief Reservoir",area:"Emigrant Wilderness",drive:"3h",duration:"2-3일",miles:20,type:"loop",difficulty:"moderate",permit:"none",desc:"이미그런트 와일더니스 서쪽"},
  {id:88,name:"Kerrick Canyon Loop",area:"Yosemite/Toiyabe",drive:"3.5h",duration:"4-5일",miles:38,type:"loop",difficulty:"hard",permit:"required",desc:"케릭 캐니언, 인적 드문 요세미티 북쪽"},
  {id:89,name:"Virginia Lakes to Green Creek",area:"Toiyabe NF",drive:"3.5h",duration:"2-3일",miles:22,type:"one-way",difficulty:"moderate",permit:"none",desc:"버지니아 레이크스 → 그린 크릭"},
  {id:90,name:"Twin Lakes to Barney Lake",area:"Toiyabe NF",drive:"3.5h",duration:"2일",miles:16,type:"out-back",difficulty:"moderate",permit:"none",desc:"매머드 레이크스 근처 후버 와일더니스"},
  {id:91,name:"Pine Valley (Anza-Borrego)",area:"Anza-Borrego SP",drive:"5h",duration:"2-3일",miles:20,type:"loop",difficulty:"moderate",permit:"none",desc:"사막 오아시스, 야자수 협곡"},
  {id:92,name:"Cuyamaca Rancho Loop",area:"Cuyamaca SP",drive:"5h",duration:"2일",miles:22,type:"loop",difficulty:"moderate",permit:"none",desc:"서던 CA 산악 백패킹"},
  {id:93,name:"Cucamonga Wilderness",area:"San Bernardino NF",drive:"5h",duration:"2일",miles:14,type:"out-back",difficulty:"hard",permit:"required",desc:"Ontario Peak, LA 인근 최고 백패킹"},
  {id:94,name:"Plumas Eureka SP Backcountry",area:"Plumas NF",drive:"4.5h",duration:"2일",miles:16,type:"loop",difficulty:"moderate",permit:"none",desc:"금광 역사 지역, 시에라 북쪽"},
  {id:95,name:"Snow Mountain Wilderness",area:"Mendocino NF",drive:"4.5h",duration:"2-3일",miles:22,type:"loop",difficulty:"moderate",permit:"none",desc:"코스트 레인지 최고봉"},
  {id:96,name:"Dick Smith Wilderness",area:"Los Padres NF",drive:"4h",duration:"3-4일",miles:28,type:"loop",difficulty:"hard",permit:"none",desc:"산타바바라 내륙 원시 지역"},
  {id:97,name:"Pinnacles: High Peaks Loop",area:"Pinnacles NP",drive:"3.5h",duration:"1-2일",miles:12,type:"loop",difficulty:"moderate",permit:"required",desc:"암석 지형, 콘도르 서식지"},
  {id:98,name:"Yolla Bolly Wilderness",area:"Shasta-Trinity NF",drive:"4.5h",duration:"3일",miles:24,type:"loop",difficulty:"moderate",permit:"none",desc:"완전히 잊혀진 와일더니스"},
  {id:99,name:"Humbug Valley Loop",area:"Plumas NF",drive:"4.5h",duration:"2일",miles:18,type:"loop",difficulty:"easy",permit:"none",desc:"가족 백패킹 적합, 초원 지대"},
  {id:100,name:"Caribou Wilderness",area:"Lassen NF",drive:"4.5h",duration:"2-3일",miles:20,type:"loop",difficulty:"easy",permit:"none",desc:"화산 고원 호수 군락, 초보자 추천"},
];

// ── 캠핑 100곳 ─────────────────────────────────────────
const CAMPGROUNDS = [
  {id:1,name:"Glacier Point Road Campground",area:"Yosemite NP",drive:"3h",type:"tent",hookup:false,reserve:true,desc:"요세미티 글레이셔 포인트 근처, 숲속 캠핑"},
  {id:2,name:"Tuolumne Meadows Campground",area:"Yosemite NP",drive:"3h",type:"tent",hookup:false,reserve:true,desc:"서브알파인 메도우, 별밤 최고"},
  {id:3,name:"Porcupine Flat Campground",area:"Yosemite NP",drive:"3h",type:"tent",hookup:false,reserve:false,desc:"퍼스트컴 퍼스트서브, 숲속 소형 사이트"},
  {id:4,name:"Crane Flat Campground",area:"Yosemite NP",drive:"3h",type:"tent/rv",hookup:false,reserve:true,desc:"세쿼이아 근처, 가족 캠핑"},
  {id:5,name:"Hodgdon Meadow",area:"Yosemite NP",drive:"3h",type:"tent/rv",hookup:false,reserve:true,desc:"빅오크 플랫 입구 근처"},
  {id:6,name:"Upper Pines Campground",area:"Yosemite Valley",drive:"3h",type:"tent",hookup:false,reserve:true,desc:"요세미티 밸리, 하프돔 뷰"},
  {id:7,name:"Lodgepole Campground",area:"Sequoia NP",drive:"1.5h",type:"tent/rv",hookup:false,reserve:true,desc:"자이언트 포레스트 근처, 가장 큰 캠핑장"},
  {id:8,name:"Dorst Creek Campground",area:"Sequoia NP",drive:"1.5h",type:"tent/rv",hookup:false,reserve:true,desc:"세쿼이아 서쪽, 조용한 캠핑"},
  {id:9,name:"Potwisha Campground",area:"Sequoia NP",drive:"1.5h",type:"tent/rv",hookup:false,reserve:true,desc:"카웨아 강변, 수영 가능"},
  {id:10,name:"South Fork Campground",area:"Sequoia NP",drive:"1.5h",type:"tent",hookup:false,reserve:false,desc:"소규모, 조용한 사우스 포크"},
  {id:11,name:"Sheep Creek Campground",area:"Kings Canyon NP",drive:"2h",type:"tent/rv",hookup:false,reserve:true,desc:"킹스 캐니언 밸리 입구"},
  {id:12,name:"Sentinel Campground",area:"Kings Canyon NP",drive:"2h",type:"tent/rv",hookup:false,reserve:true,desc:"킹스 리버 강변"},
  {id:13,name:"Canyon View Campground",area:"Kings Canyon NP",drive:"2h",type:"tent",hookup:false,reserve:true,desc:"킹스 캐니언 뷰, 소규모"},
  {id:14,name:"Hume Lake Campground",area:"Kings Canyon NP",drive:"2h",type:"tent/rv",hookup:false,reserve:true,desc:"휴 레이크 호숫가 캠핑"},
  {id:15,name:"Azalea Campground",area:"Kings Canyon NP",drive:"2h",type:"tent/rv",hookup:false,reserve:true,desc:"그랜트 그로브 세쿼이아 근처"},
  {id:16,name:"Mono Hot Springs",area:"Sierra NF",drive:"2.5h",type:"tent/rv",hookup:false,reserve:true,desc:"천연 온천 바로 옆 캠핑"},
  {id:17,name:"Vermilion Campground",area:"Sierra NF",drive:"2.5h",type:"tent/rv",hookup:false,reserve:true,desc:"에디슨 레이크 근처"},
  {id:18,name:"Eastwood Campground",area:"Sierra NF",drive:"2h",type:"tent",hookup:false,reserve:false,desc:"헌팅턴 레이크 근처"},
  {id:19,name:"Upper Rancheria",area:"Sierra NF",drive:"1.5h",type:"tent",hookup:false,reserve:true,desc:"카이저 와일더니스 입구"},
  {id:20,name:"Shaver Lake Campground",area:"Sierra NF",drive:"1h",type:"tent/rv",hookup:true,reserve:true,desc:"샤버 레이크, 수상스포츠 캠핑"},
  {id:21,name:"Wishon Village RV Resort",area:"Kings River",drive:"1.5h",type:"rv",hookup:true,reserve:true,desc:"풀 훅업, 수영장 시설"},
  {id:22,name:"Pine Flat Lake Campground",area:"Kings River",drive:"1h",type:"tent/rv",hookup:false,reserve:false,desc:"파인 플랫 레이크 보트 캠핑"},
  {id:23,name:"Kirch Flat Campground",area:"Kings River",drive:"1.5h",type:"tent",hookup:false,reserve:false,desc:"킹스 리버 급류 근처"},
  {id:24,name:"Mammoth Lakes Campgrounds",area:"Inyo NF",drive:"2.5h",type:"tent/rv",hookup:false,reserve:true,desc:"매머드 레이크스 주변 다수"},
  {id:25,name:"Twin Lakes Campground",area:"Inyo NF",drive:"2.5h",type:"tent/rv",hookup:false,reserve:true,desc:"트윈 레이크스 호숫가"},
  {id:26,name:"Lake Mary Campground",area:"Inyo NF",drive:"2.5h",type:"tent/rv",hookup:false,reserve:true,desc:"레이크 메리 수변"},
  {id:27,name:"Convict Lake Campground",area:"Inyo NF",drive:"3h",type:"tent/rv",hookup:false,reserve:true,desc:"아름다운 컨빅트 레이크 뷰"},
  {id:28,name:"Rock Creek Lake Campground",area:"Inyo NF",drive:"3h",type:"tent",hookup:false,reserve:true,desc:"록 크릭 레이크 수변"},
  {id:29,name:"Bishop Creek Campgrounds",area:"Inyo NF",drive:"3h",type:"tent/rv",hookup:false,reserve:true,desc:"비숍 크릭 계곡 다수 캠핑장"},
  {id:30,name:"Sabrina Lake Campground",area:"Inyo NF",drive:"3h",type:"tent",hookup:false,reserve:true,desc:"레이크 사브리나 수변"},
  {id:31,name:"June Lake Loop Campgrounds",area:"Inyo NF",drive:"3h",type:"tent/rv",hookup:false,reserve:true,desc:"준 레이크 루프 4개 호수"},
  {id:32,name:"Lundy Lake Campground",area:"Mono County",drive:"3h",type:"tent/rv",hookup:false,reserve:false,desc:"런디 레이크, 가을 단풍 최고"},
  {id:33,name:"Bodie State Park Campground",area:"Mono County",drive:"3h",type:"tent",hookup:false,reserve:false,desc:"유령 도시 인근, 역사 캠핑"},
  {id:34,name:"Lee Vining Creek Campground",area:"Mono Lake",drive:"3h",type:"tent/rv",hookup:false,reserve:true,desc:"모노 레이크 근처"},
  {id:35,name:"Buckeye Campground",area:"Toiyabe NF",drive:"3.5h",type:"tent/rv",hookup:false,reserve:false,desc:"벅아이 핫스프링스 근처"},
  {id:36,name:"Sonora Bridge Campground",area:"Toiyabe NF",drive:"3.5h",type:"tent",hookup:false,reserve:false,desc:"이스트 워커 리버 낚시"},
  {id:37,name:"Silver Creek Campground",area:"Eldorado NF",drive:"4h",type:"tent/rv",hookup:false,reserve:false,desc:"실버 크릭 계곡"},
  {id:38,name:"Wrights Lake Campground",area:"Eldorado NF",drive:"4.5h",type:"tent",hookup:false,reserve:true,desc:"데솔레이션 와일더니스 입구"},
  {id:39,name:"Loon Lake Campground",area:"Eldorado NF",drive:"4.5h",type:"tent/rv",hookup:false,reserve:true,desc:"룬 레이크 수변"},
  {id:40,name:"Upper Hell Hole",area:"Eldorado NF",drive:"4.5h",type:"tent",hookup:false,reserve:false,desc:"원격 저수지 캠핑"},
  {id:41,name:"Donner Memorial SP",area:"Lake Tahoe",drive:"4.5h",type:"tent/rv",hookup:false,reserve:true,desc:"도너 레이크, 역사적 장소"},
  {id:42,name:"D.L. Bliss SP",area:"Lake Tahoe",drive:"4.5h",type:"tent",hookup:false,reserve:true,desc:"타호 레이크 최고 해변 캠핑"},
  {id:43,name:"Emerald Bay SP",area:"Lake Tahoe",drive:"4.5h",type:"tent",hookup:false,reserve:true,desc:"에메랄드 베이 오버룩"},
  {id:44,name:"Fallen Leaf Lake Campground",area:"Lake Tahoe",drive:"4.5h",type:"tent/rv",hookup:false,reserve:true,desc:"작은 호수, 타호 남쪽"},
  {id:45,name:"Sand Harbor SP",area:"Lake Tahoe NV",drive:"5h",type:"tent",hookup:false,reserve:true,desc:"네바다 주립공원, 크리스탈 물"},
  {id:46,name:"Kirk Creek Campground",area:"Big Sur",drive:"4.5h",type:"tent",hookup:false,reserve:true,desc:"절벽 위 오션뷰 캠핑"},
  {id:47,name:"Pfeiffer Big Sur SP",area:"Big Sur",drive:"4h",type:"tent/rv",hookup:false,reserve:true,desc:"빅서 레드우드, 강변 캠핑"},
  {id:48,name:"Julia Pfeiffer Burns SP",area:"Big Sur",drive:"4h",type:"tent",hookup:false,reserve:true,desc:"맥웨이 폭포 근처"},
  {id:49,name:"Plaskett Creek Campground",area:"Big Sur",drive:"4.5h",type:"tent/rv",hookup:false,reserve:true,desc:"소규모, 해안 근접"},
  {id:50,name:"Andrew Molera SP",area:"Big Sur",drive:"4h",type:"tent",hookup:false,reserve:false,desc:"도보 전용, 해변 캠핑"},
  {id:51,name:"Portola Redwoods SP",area:"Santa Cruz Mtns",drive:"4h",type:"tent",hookup:false,reserve:true,desc:"레드우드 숲속 캠핑"},
  {id:52,name:"Henry Cowell Redwoods SP",area:"Santa Cruz",drive:"3.5h",type:"tent/rv",hookup:false,reserve:true,desc:"산타크루즈 레드우드"},
  {id:53,name:"New Brighton Beach SP",area:"Capitola",drive:"3.5h",type:"tent/rv",hookup:false,reserve:true,desc:"해변 바로 위, 오션뷰"},
  {id:54,name:"Sunset State Beach",area:"Watsonville",drive:"3.5h",type:"tent/rv",hookup:false,reserve:true,desc:"샌드 듄 해변 캠핑"},
  {id:55,name:"Pinnacles NP Campground",area:"Pinnacles NP",drive:"3.5h",type:"tent/rv",hookup:false,reserve:true,desc:"암석 지형, 콘도르 관찰"},
  {id:56,name:"Lake San Antonio",area:"Monterey County",drive:"3.5h",type:"tent/rv",hookup:true,reserve:true,desc:"수상스포츠, 독수리 관찰"},
  {id:57,name:"Lake Nacimiento",area:"SLO County",drive:"4h",type:"tent/rv",hookup:true,reserve:true,desc:"하우스보트 렌탈 가능"},
  {id:58,name:"Morro Bay SP",area:"Morro Bay",drive:"4h",type:"tent/rv",hookup:false,reserve:true,desc:"모로 락 뷰, 해안 캠핑"},
  {id:59,name:"Montana de Oro SP",area:"SLO County",drive:"4h",type:"tent",hookup:false,reserve:true,desc:"절벽 해안, 야생 분위기"},
  {id:60,name:"Pismo State Beach",area:"Pismo Beach",drive:"4h",type:"tent/rv",hookup:true,reserve:true,desc:"오션프런트 RV 파크"},
  {id:61,name:"Lake Kaweah COE",area:"Visalia",drive:"45m",type:"tent/rv",hookup:true,reserve:true,desc:"프레즈노 가장 가까운 호수 캠핑"},
  {id:62,name:"Terminus Dam Campground",area:"Lake Kaweah",drive:"45m",type:"tent/rv",hookup:false,reserve:false,desc:"카웨아 레이크 무료 캠핑"},
  {id:63,name:"Balch Park Campground",area:"Mountain Home SF",drive:"1.5h",type:"tent",hookup:false,reserve:true,desc:"자이언트 세쿼이아 개인 숲"},
  {id:64,name:"Doyle Springs Campground",area:"Mountain Home SF",drive:"1.5h",type:"tent",hookup:false,reserve:true,desc:"세쿼이아 숲속 소형 캠핑장"},
  {id:65,name:"Wishon Reservoir",area:"Sierra NF",drive:"1.5h",type:"tent",hookup:false,reserve:false,desc:"위숀 저수지 수변 캠핑"},
  {id:66,name:"Courtright Reservoir",area:"Sierra NF",drive:"2h",type:"tent",hookup:false,reserve:false,desc:"코트라이트 저수지 고산"},
  {id:67,name:"Florence Lake Campground",area:"Sierra NF",drive:"2.5h",type:"tent",hookup:false,reserve:false,desc:"플로렌스 레이크 수변"},
  {id:68,name:"Dinkey Creek Campground",area:"Sierra NF",drive:"1.5h",type:"tent/rv",hookup:false,reserve:true,desc:"딩키 크릭 계곡"},
  {id:69,name:"Rancheria Campground",area:"Sierra NF",drive:"2h",type:"tent",hookup:false,reserve:true,desc:"카이저 와일더니스 근처"},
  {id:70,name:"College Campground",area:"Sierra NF",drive:"2h",type:"tent/rv",hookup:false,reserve:false,desc:"헌팅턴 레이크 근처"},
  {id:71,name:"Glass Creek Campground",area:"Inyo NF",drive:"2.5h",type:"tent",hookup:false,reserve:false,desc:"오버룩 뷰포인트 근처"},
  {id:72,name:"Deadman Campground",area:"Inyo NF",drive:"2.5h",type:"tent",hookup:false,reserve:false,desc:"화산 지형 캠핑"},
  {id:73,name:"Obsidian Dome Campground",area:"Inyo NF",drive:"2.5h",type:"tent",hookup:false,reserve:false,desc:"흑요석 지형 독특"},
  {id:74,name:"Whitney Portal Campground",area:"Inyo NF",drive:"3h",type:"tent",hookup:false,reserve:true,desc:"휘트니 포털 출발점 캠핑"},
  {id:75,name:"Horseshoe Meadow Campground",area:"Inyo NF",drive:"3h",type:"tent",hookup:false,reserve:true,desc:"11,000ft 고산 캠핑"},
  {id:76,name:"Tuttle Creek Campground",area:"BLM Lone Pine",drive:"3h",type:"tent/rv",hookup:false,reserve:false,desc:"시에라 뷰, 무료 BLM"},
  {id:77,name:"Alabama Hills BLM",area:"Lone Pine",drive:"3h",type:"dispersed",hookup:false,reserve:false,desc:"무비 세트 지형, 무료 분산 캠핑"},
  {id:78,name:"Crowley Lake Campground",area:"Mono County",drive:"3h",type:"tent/rv",hookup:false,reserve:false,desc:"크로울리 레이크 낚시"},
  {id:79,name:"Tuff Campground",area:"Inyo NF",drive:"3h",type:"tent/rv",hookup:false,reserve:true,desc:"크로울리 레이크 뷰"},
  {id:80,name:"Devils Postpile Campground",area:"Inyo NF",drive:"2.5h",type:"tent",hookup:false,reserve:true,desc:"데빌스 포스트파일 국가 기념물"},
  {id:81,name:"Furnace Creek Campground",area:"Death Valley NP",drive:"4h",type:"tent/rv",hookup:true,reserve:true,desc:"데스밸리 메인 캠핑장"},
  {id:82,name:"Mesquite Spring Campground",area:"Death Valley NP",drive:"4.5h",type:"tent/rv",hookup:false,reserve:false,desc:"데스밸리 북쪽, 덜 붐빔"},
  {id:83,name:"Stovepipe Wells Campground",area:"Death Valley NP",drive:"4h",type:"tent/rv",hookup:true,reserve:false,desc:"샌드 듄 근처"},
  {id:84,name:"Panamint Springs",area:"Death Valley NP",drive:"4.5h",type:"tent/rv",hookup:true,reserve:false,desc:"파나민트 밸리, 조용"},
  {id:85,name:"Joshua Tree: Jumbo Rocks",area:"Joshua Tree NP",drive:"4.5h",type:"tent",hookup:false,reserve:true,desc:"점보 록 지형, 볼더링"},
  {id:86,name:"Joshua Tree: Hidden Valley",area:"Joshua Tree NP",drive:"4.5h",type:"tent",hookup:false,reserve:true,desc:"클라이머 메카"},
  {id:87,name:"Joshua Tree: Belle Campground",area:"Joshua Tree NP",drive:"4.5h",type:"tent",hookup:false,reserve:false,desc:"소규모, 조용"},
  {id:88,name:"Idyllwild Campground",area:"San Bernardino NF",drive:"5h",type:"tent/rv",hookup:false,reserve:true,desc:"이딜와일드 마을 근처"},
  {id:89,name:"Lake Perris SRA",area:"Riverside County",drive:"5h",type:"tent/rv",hookup:true,reserve:true,desc:"수상스포츠 캠핑"},
  {id:90,name:"Big Bear Lake Campgrounds",area:"San Bernardino NF",drive:"5h",type:"tent/rv",hookup:true,reserve:true,desc:"빅베어 레이크 다수 캠핑장"},
  {id:91,name:"Chilao Campground",area:"Angeles NF",drive:"4.5h",type:"tent/rv",hookup:false,reserve:true,desc:"산가브리엘 산맥"},
  {id:92,name:"Crystal Lake Campground",area:"Angeles NF",drive:"4.5h",type:"tent/rv",hookup:false,reserve:true,desc:"LA 인근 유일 자연 호수"},
  {id:93,name:"Cachuma Lake",area:"Santa Barbara County",drive:"4h",type:"tent/rv",hookup:true,reserve:true,desc:"독수리 투어, 수상스포츠"},
  {id:94,name:"Lake Casitas",area:"Ventura County",drive:"4h",type:"tent/rv",hookup:true,reserve:true,desc:"올림픽 카누 경기장"},
  {id:95,name:"Carpinteria State Beach",area:"Carpinteria",drive:"4h",type:"tent/rv",hookup:false,reserve:true,desc:"세계에서 가장 안전한 해변"},
  {id:96,name:"Plaskett Ridge BLM",area:"Monterey County",drive:"4.5h",type:"dispersed",hookup:false,reserve:false,desc:"오션뷰 무료 BLM 캠핑"},
  {id:97,name:"Fremont Peak SP",area:"San Juan Bautista",drive:"3.5h",type:"tent",hookup:false,reserve:true,desc:"천문 관측 최고"},
  {id:98,name:"Henry W. Coe SP",area:"Morgan Hill",drive:"3.5h",type:"tent",hookup:false,reserve:true,desc:"베이 에어리어 최대 주립공원"},
  {id:99,name:"Caswell Memorial SP",area:"Riverbank",drive:"1.5h",type:"tent/rv",hookup:false,reserve:true,desc:"스탠슬로스 강변, 수영"},
  {id:100,name:"McConnell SRA",area:"Turlock",drive:"1.5h",type:"tent/rv",hookup:false,reserve:true,desc:"프레즈노 인근 강변 캠핑"},
];

// ── 하이킹 100곳 ───────────────────────────────────────
const HIKING = [
  {id:1,name:"Half Dome",area:"Yosemite NP",drive:"3h",trailhead:"Happy Isles TH",miles:16,gain:4800,difficulty:"hard",desc:"요세미티 상징, 케이블 구간 포함"},
  {id:2,name:"Vernal & Nevada Falls Loop",area:"Yosemite NP",drive:"3h",trailhead:"Happy Isles TH",miles:6,gain:2000,difficulty:"moderate",desc:"미스트 트레일, 두 개의 폭포"},
  {id:3,name:"Yosemite Falls Trail",area:"Yosemite NP",drive:"3h",trailhead:"Yosemite Falls TH",miles:7.2,gain:2700,difficulty:"hard",desc:"북미 최고 폭포 정상"},
  {id:4,name:"Sentinel Dome",area:"Yosemite NP",drive:"3h",trailhead:"Sentinel Dome TH",miles:2.2,gain:400,difficulty:"easy",desc:"360도 파노라마, 짧고 쉬운 최고 뷰"},
  {id:5,name:"Taft Point & Fissures",area:"Yosemite NP",drive:"3h",trailhead:"Taft Point TH",miles:2.2,gain:200,difficulty:"easy",desc:"절벽 끝 전망대, 협곡 균열"},
  {id:6,name:"Cloud's Rest",area:"Yosemite NP",drive:"3h",trailhead:"Sunrise Lakes TH",miles:14,gain:1775,difficulty:"hard",desc:"하프돔보다 더 좋은 뷰, 덜 붐빔"},
  {id:7,name:"Four Mile Trail",area:"Yosemite NP",drive:"3h",trailhead:"Four Mile TH",miles:9.6,gain:3200,difficulty:"hard",desc:"글레이셔 포인트 왕복"},
  {id:8,name:"Mirror Lake Loop",area:"Yosemite NP",drive:"3h",trailhead:"Mirror Lake TH",miles:5,gain:100,difficulty:"easy",desc:"하프돔 반영, 가족 하이킹"},
  {id:9,name:"May Lake to Mt. Hoffmann",area:"Yosemite NP",drive:"3h",trailhead:"May Lake TH",miles:6,gain:1000,difficulty:"moderate",desc:"요세미티 지리적 중심, 사방 뷰"},
  {id:10,name:"Cathedral Lakes",area:"Yosemite NP",drive:"3h",trailhead:"Tuolumne Meadows TH",miles:7,gain:1000,difficulty:"moderate",desc:"대성당 모양 봉우리와 호수"},
  {id:11,name:"Lembert Dome",area:"Yosemite NP",drive:"3h",trailhead:"Dog Lake TH",miles:2.8,gain:850,difficulty:"moderate",desc:"투올럼니 메도우 오버룩"},
  {id:12,name:"Mist Trail to Vernal Fall",area:"Yosemite NP",drive:"3h",trailhead:"Happy Isles TH",miles:3,gain:1000,difficulty:"moderate",desc:"폭포 물보라 맞으며 등산"},
  {id:13,name:"General Sherman Tree Loop",area:"Sequoia NP",drive:"1.5h",trailhead:"Sherman Tree TH",miles:2,gain:200,difficulty:"easy",desc:"세계 최대 나무, 가족 코스"},
  {id:14,name:"Congress Trail",area:"Sequoia NP",drive:"1.5h",trailhead:"Sherman Tree TH",miles:2,gain:300,difficulty:"easy",desc:"대형 세쿼이아 군락 루프"},
  {id:15,name:"Alta Peak",area:"Sequoia NP",drive:"1.5h",trailhead:"Wolverton TH",miles:13,gain:4000,difficulty:"hard",desc:"해발 11,204ft, 시에라 파노라마"},
  {id:16,name:"Marble Falls",area:"Sequoia NP",drive:"1.5h",trailhead:"Potwisha TH",miles:8,gain:1500,difficulty:"moderate",desc:"흰 대리석 폭포, 카웨아 캐니언"},
  {id:17,name:"Tokopah Falls",area:"Sequoia NP",drive:"1.5h",trailhead:"Lodgepole TH",miles:3.4,gain:500,difficulty:"easy",desc:"화강암 협곡 폭포, 어린이도 OK"},
  {id:18,name:"Twin Lakes",area:"Sequoia NP",drive:"1.5h",trailhead:"Lodgepole TH",miles:13,gain:2800,difficulty:"hard",desc:"아름다운 알파인 쌍둥이 호수"},
  {id:19,name:"Moro Rock",area:"Sequoia NP",drive:"1.5h",trailhead:"Moro Rock TH",miles:0.5,gain:300,difficulty:"easy",desc:"360도 뷰 화강암 돔, 매우 짧음"},
  {id:20,name:"Big Baldy Ridge",area:"Kings Canyon NP",drive:"2h",trailhead:"Big Baldy TH",miles:4,gain:600,difficulty:"easy",desc:"세쿼이아 숲 뷰포인트"},
  {id:21,name:"Zumwalt Meadow Loop",area:"Kings Canyon NP",drive:"2h",trailhead:"Zumwalt TH",miles:1.5,gain:50,difficulty:"easy",desc:"킹스 캐니언 밸리 평원 루프"},
  {id:22,name:"Roaring River Falls",area:"Kings Canyon NP",drive:"2h",trailhead:"Roaring River TH",miles:0.4,gain:50,difficulty:"easy",desc:"킹스 캐니언 가장 쉬운 폭포"},
  {id:23,name:"Hotel Creek to Cedar Grove Overlook",area:"Kings Canyon NP",drive:"2h",trailhead:"Hotel Creek TH",miles:5,gain:1200,difficulty:"moderate",desc:"킹스 캐니언 전망대"},
  {id:24,name:"Mitchell Peak",area:"Jennie Lakes Wilderness",drive:"2h",trailhead:"Big Meadow TH",miles:9,gain:1700,difficulty:"hard",desc:"시에라 네바다 파노라마"},
  {id:25,name:"Mt. Whitney (Day Hike)",area:"Inyo NF",drive:"3h",trailhead:"Whitney Portal TH",miles:22,gain:6100,difficulty:"extreme",desc:"미국 본토 최고봉 14,505ft 당일 등반"},
  {id:26,name:"Kearsarge Pass",area:"Inyo NF",drive:"3h",trailhead:"Onion Valley TH",miles:10,gain:2800,difficulty:"hard",desc:"킹스 캐니언 JMT 진입로"},
  {id:27,name:"Bishop Pass",area:"Inyo NF",drive:"3h",trailhead:"South Lake TH",miles:12,gain:2900,difficulty:"hard",desc:"4개 호수 경유 패스"},
  {id:28,name:"Big Pine Lakes (First Lake)",area:"Inyo NF",drive:"3h",trailhead:"Big Pine Creek TH",miles:9,gain:2600,difficulty:"moderate",desc:"팰리세이즈 빙하 전망"},
  {id:29,name:"Duck Pass",area:"Inyo NF",drive:"2.5h",trailhead:"Lake Mary TH",miles:9,gain:1600,difficulty:"moderate",desc:"덕 레이크 고산 뷰"},
  {id:30,name:"Convict Lake to Genevieve",area:"Inyo NF",drive:"3h",trailhead:"Convict Lake TH",miles:8,gain:1900,difficulty:"moderate",desc:"에메랄드빛 알파인 호수"},
  {id:31,name:"Crystal Lake (Mammoth)",area:"Inyo NF",drive:"2.5h",trailhead:"Coldwater TH",miles:6.4,gain:1100,difficulty:"moderate",desc:"매머드 크리스탈 레이크"},
  {id:32,name:"Emerald Lake (Mammoth)",area:"Inyo NF",drive:"2.5h",trailhead:"Coldwater TH",miles:4.5,gain:600,difficulty:"easy",desc:"에메랄드 컬러 고산 호수"},
  {id:33,name:"Mammoth Mountain Summit",area:"Inyo NF",drive:"2.5h",trailhead:"Mammoth Mtn TH",miles:7,gain:2000,difficulty:"hard",desc:"곤돌라 또는 도보로 정상"},
  {id:34,name:"Rainbow Falls",area:"Inyo NF",drive:"2.5h",trailhead:"Reds Meadow TH",miles:2.5,gain:100,difficulty:"easy",desc:"레인보우 폭포, 이지 패밀리 하이크"},
  {id:35,name:"Garnet Lake via JMT",area:"Inyo NF",drive:"2.5h",trailhead:"Agnew Meadows TH",miles:13,gain:1600,difficulty:"hard",desc:"뱅크스 봉우리 반영 호수"},
  {id:36,name:"Thousand Island Lake",area:"Inyo NF",drive:"2.5h",trailhead:"Agnew Meadows TH",miles:14,gain:1800,difficulty:"hard",desc:"섬처럼 솟은 화강암 고산 호수"},
  {id:37,name:"San Joaquin Ridge",area:"Inyo NF",drive:"2.5h",trailhead:"Minaret Vista TH",miles:5,gain:800,difficulty:"moderate",desc:"미나렛 봉우리 뷰"},
  {id:38,name:"Devils Postpile to Rainbow Falls",area:"Inyo NF",drive:"2.5h",trailhead:"Devils Postpile TH",miles:5,gain:200,difficulty:"easy",desc:"육각기둥 용암 + 폭포"},
  {id:39,name:"Parker Lake",area:"Inyo NF",drive:"3h",trailhead:"Parker Lake TH",miles:3.8,gain:400,difficulty:"easy",desc:"이스턴 시에라 소규모 알파인 호수"},
  {id:40,name:"Virginia Lakes to Summit Lake",area:"Toiyabe NF",drive:"3.5h",trailhead:"Virginia Lakes TH",miles:7,gain:1200,difficulty:"moderate",desc:"서밋 레이크 고산 뷰"},
  {id:41,name:"Lundy Canyon",area:"Mono County",drive:"3h",trailhead:"Lundy Lake TH",miles:4.4,gain:800,difficulty:"moderate",desc:"가을 단풍 최고 협곡"},
  {id:42,name:"Mono Pass",area:"Yosemite NP",drive:"3h",trailhead:"Tioga Road TH",miles:8.4,gain:1000,difficulty:"moderate",desc:"모노 패스 역사적 루트"},
  {id:43,name:"North Dome",area:"Yosemite NP",drive:"3h",trailhead:"Porcupine Creek TH",miles:8.8,gain:500,difficulty:"moderate",desc:"하프돔 정면 뷰, 덜 알려진 뷰포인트"},
  {id:44,name:"Glen Aulin",area:"Yosemite NP",drive:"3h",trailhead:"Tuolumne TH",miles:12,gain:250,difficulty:"moderate",desc:"폭포 연속, 투올럼니 강"},
  {id:45,name:"Elizabeth Lake",area:"Yosemite NP",drive:"3h",trailhead:"Tuolumne TH",miles:4.8,gain:1000,difficulty:"moderate",desc:"투올럼니 출발 인기 호수"},
  {id:46,name:"Gaylor Lakes",area:"Yosemite NP",drive:"3h",trailhead:"Tioga Pass TH",miles:4,gain:800,difficulty:"moderate",desc:"티오가 패스 근처 고산 호수"},
  {id:47,name:"Pothole Dome",area:"Yosemite NP",drive:"3h",trailhead:"Pothole Dome TH",miles:1.6,gain:200,difficulty:"easy",desc:"투올럼니 메도우 오버룩, 초쉬움"},
  {id:48,name:"Wapama Falls",area:"Yosemite NP",drive:"3h",trailhead:"O'Shaughnessy Dam TH",miles:5,gain:200,difficulty:"easy",desc:"헤치헤치 저수지 폭포"},
  {id:49,name:"Chilnualna Falls",area:"Yosemite NP",drive:"3h",trailhead:"Wawona TH",miles:8.2,gain:2400,difficulty:"hard",desc:"와워나 근처 폭포 시리즈"},
  {id:50,name:"Mariposa Grove of Giant Sequoias",area:"Yosemite NP",drive:"3h",trailhead:"Mariposa Grove TH",miles:6.5,gain:500,difficulty:"easy",desc:"요세미티 최대 세쿨이아 숲"},
  {id:51,name:"Dinkey Lakes Loop",area:"Sierra NF",drive:"1.5h",trailhead:"First Dinkey Lake TH",miles:12,gain:1200,difficulty:"moderate",desc:"5개 호수 루프, 프레즈노 가까움"},
  {id:52,name:"Kaiser Peak",area:"Sierra NF",drive:"1.5h",trailhead:"Potter Pass TH",miles:10,gain:2600,difficulty:"hard",desc:"카이저 와일더니스 최고봉"},
  {id:53,name:"Twin Lakes (Kaiser)",area:"Sierra NF",drive:"1.5h",trailhead:"Sample Meadow TH",miles:6,gain:1000,difficulty:"moderate",desc:"카이저 구역 쌍둥이 호수"},
  {id:54,name:"Rancheria Falls",area:"Sierra NF",drive:"2h",trailhead:"Rancheria TH",miles:5,gain:600,difficulty:"easy",desc:"헌팅턴 레이크 근처 폭포"},
  {id:55,name:"Courtright to Maxson Meadow",area:"Sierra NF",drive:"2h",trailhead:"Courtright TH",miles:8,gain:1200,difficulty:"moderate",desc:"고산 초원 하이킹"},
  {id:56,name:"Windy Cliffs",area:"Sierra NF",drive:"2h",trailhead:"Maxson TH",miles:12,gain:1800,difficulty:"hard",desc:"킹스 리버 캐니언 뷰포인트"},
  {id:57,name:"Grouse Lake",area:"Sierra NF",drive:"2h",trailhead:"Wishon TH",miles:7,gain:1400,difficulty:"moderate",desc:"위숀 저수지 출발 호수"},
  {id:58,name:"Tehipite Dome Viewpoint",area:"Sierra NF",drive:"2h",trailhead:"Crown Valley TH",miles:14,gain:2000,difficulty:"hard",desc:"테히피테 돔 전망"},
  {id:59,name:"Balch Park Peak",area:"Mountain Home SF",drive:"1.5h",trailhead:"Balch Park TH",miles:6,gain:1200,difficulty:"moderate",desc:"세쿼이아 숲 정상"},
  {id:60,name:"North Fork Tule River",area:"Sequoia NF",drive:"1.5h",trailhead:"Wishon Drive TH",miles:8,gain:800,difficulty:"easy",desc:"강변 하이킹, 수영 포인트"},
  {id:61,name:"Dome Land Wilderness",area:"Sequoia NF",drive:"2.5h",trailhead:"Fish Creek TH",miles:10,gain:1500,difficulty:"moderate",desc:"화강암 돔 군락"},
  {id:62,name:"Bald Mountain Lookout",area:"Sequoia NF",drive:"2h",trailhead:"Bald Mountain TH",miles:2,gain:400,difficulty:"easy",desc:"파이어 룩아웃 타워 뷰"},
  {id:63,name:"Kern River Trail",area:"Sequoia NF",drive:"2.5h",trailhead:"Kernville TH",miles:10,gain:300,difficulty:"easy",desc:"커른 강변 하이킹, 낚시"},
  {id:64,name:"Horeshoe Meadow to Mulkey Pass",area:"Inyo NF",drive:"3h",trailhead:"Horseshoe Meadow TH",miles:8,gain:1400,difficulty:"moderate",desc:"11,000ft 출발 고산 하이킹"},
  {id:65,name:"Owens Valley to Lone Pine Peak",area:"Inyo NF",drive:"3h",trailhead:"Tuttle Creek TH",miles:14,gain:5500,difficulty:"extreme",desc:"론파인 피크 12,944ft"},
  {id:66,name:"Alabama Hills Arch Loop",area:"BLM Lone Pine",drive:"3h",trailhead:"Arch Loop TH",miles:2.8,gain:100,difficulty:"easy",desc:"무비 세트 지형, 아치 군락"},
  {id:67,name:"Ancient Bristlecone Pine Forest",area:"Inyo NF",drive:"3.5h",trailhead:"Schulman Grove TH",miles:4.5,gain:1000,difficulty:"moderate",desc:"세계 최고령 나무 4,000년"},
  {id:68,name:"White Mountain Peak",area:"Inyo NF",drive:"3.5h",trailhead:"White Mountain TH",miles:14,gain:2600,difficulty:"hard",desc:"캘리포니아 3위 봉우리 14,252ft"},
  {id:69,name:"Sardine Falls",area:"Stanislaus NF",drive:"3h",trailhead:"Sardine Falls TH",miles:2.4,gain:400,difficulty:"easy",desc:"소노라 패스 근처 폭포"},
  {id:70,name:"Sonora Peak",area:"Stanislaus NF",drive:"3h",trailhead:"Sonora Pass TH",miles:5.5,gain:1600,difficulty:"hard",desc:"PCT 근처 11,459ft"},
  {id:71,name:"Burst Rock",area:"Stanislaus NF",drive:"3h",trailhead:"Burst Rock TH",miles:6,gain:1000,difficulty:"moderate",desc:"이미그런트 와일더니스 뷰"},
  {id:72,name:"Columns of the Giants",area:"Stanislaus NF",drive:"3h",trailhead:"Columns TH",miles:0.5,gain:50,difficulty:"easy",desc:"데빌스 포스트파일 미니버전"},
  {id:73,name:"Grouse Ridge",area:"Tahoe NF",drive:"4.5h",trailhead:"Grouse Ridge TH",miles:8,gain:800,difficulty:"moderate",desc:"타호 북쪽 호수 군락"},
  {id:74,name:"Mt. Tallac",area:"Lake Tahoe",drive:"4.5h",trailhead:"Echo Lake TH",miles:9.4,gain:3300,difficulty:"hard",desc:"타호 레이크 뷰 9,735ft"},
  {id:75,name:"Fallen Leaf Lake Loop",area:"Lake Tahoe",drive:"4.5h",trailhead:"Fallen Leaf TH",miles:5,gain:200,difficulty:"easy",desc:"폴른 리프 레이크 수변"},
  {id:76,name:"Eagle Lake (Tahoe)",area:"Lake Tahoe",drive:"4.5h",trailhead:"Eagle Falls TH",miles:2,gain:400,difficulty:"easy",desc:"에머랄드 베이 오버룩"},
  {id:77,name:"Galena Creek to Mt. Rose",area:"Humboldt-Toiyabe NF",drive:"5h",trailhead:"Mt. Rose TH",miles:12,gain:2500,difficulty:"hard",desc:"네바다 최고봉 트레일"},
  {id:78,name:"Point Reyes: Coast Trail",area:"Point Reyes NS",drive:"4h",trailhead:"Bear Valley TH",miles:14,gain:500,difficulty:"moderate",desc:"태평양 절벽 해안 하이킹"},
  {id:79,name:"Muir Woods Loop",area:"Marin County",drive:"4h",trailhead:"Muir Woods TH",miles:6,gain:800,difficulty:"moderate",desc:"뮤어 우즈 레드우드 숲"},
  {id:80,name:"Mt. Tamalpais East Peak",area:"Marin County",drive:"4h",trailhead:"East Ridgecrest TH",miles:6,gain:1200,difficulty:"moderate",desc:"베이 에어리어 뷰 최고"},
  {id:81,name:"Mission Peak",area:"East Bay",drive:"3h",trailhead:"Stanford Ave TH",miles:6.4,gain:2100,difficulty:"hard",desc:"베이 에어리어 인기 피크"},
  {id:82,name:"Mt. Diablo Summit",area:"Mt. Diablo SP",drive:"3h",trailhead:"Mitchell Canyon TH",miles:7,gain:2600,difficulty:"hard",desc:"베이 에어리어 조망 최고"},
  {id:83,name:"Pinnacles: High Peaks Trail",area:"Pinnacles NP",drive:"3.5h",trailhead:"Bear Gulch TH",miles:9.4,gain:1300,difficulty:"hard",desc:"암석 지형 등반, 콘도르 서식"},
  {id:84,name:"Fremont Peak",area:"San Benito County",drive:"3.5h",trailhead:"Fremont Peak SP TH",miles:1.5,gain:300,difficulty:"easy",desc:"베이 에어리어 & 몬터레이 뷰"},
  {id:85,name:"Andrew Molera Bluff Trail",area:"Big Sur",drive:"4h",trailhead:"Andrew Molera TH",miles:4,gain:500,difficulty:"easy",desc:"빅서 해안 절벽 뷰"},
  {id:86,name:"Pine Ridge Trail to Sykes Hot Springs",area:"Los Padres NF",drive:"4h",trailhead:"Big Sur Station TH",miles:20,gain:3000,difficulty:"hard",desc:"빅서 천연 온천, 2일 권장"},
  {id:87,name:"Cone Peak",area:"Los Padres NF",drive:"4h",trailhead:"Cone Peak TH",miles:5.5,gain:1700,difficulty:"hard",desc:"태평양에서 가장 가파른 경사"},
  {id:88,name:"Lassen Peak",area:"Lassen NP",drive:"4.5h",trailhead:"Lassen Peak TH",miles:5,gain:2000,difficulty:"hard",desc:"활화산 정상 10,457ft"},
  {id:89,name:"Bumpass Hell",area:"Lassen NP",drive:"4.5h",trailhead:"Bumpass Hell TH",miles:3,gain:300,difficulty:"easy",desc:"열수 웅덩이 지열 지형"},
  {id:90,name:"Cinder Cone",area:"Lassen NP",drive:"4.5h",trailhead:"Butte Lake TH",miles:4,gain:700,difficulty:"moderate",desc:"화산 분화구 정상"},
  {id:91,name:"McArthur-Burney Falls",area:"McArthur-Burney",drive:"4.5h",trailhead:"Burney Falls TH",miles:1,gain:100,difficulty:"easy",desc:"루즈벨트 '세계 8대 불가사의' 폭포"},
  {id:92,name:"Black Butte (Shasta)",area:"Shasta-Trinity NF",drive:"4.5h",trailhead:"Black Butte TH",miles:5,gain:1850,difficulty:"hard",desc:"마운트 샤스타 뷰 화산 봉우리"},
  {id:93,name:"Gray Butte (Shasta)",area:"Shasta-Trinity NF",drive:"4.5h",trailhead:"Gray Butte TH",miles:5,gain:1500,difficulty:"moderate",desc:"샤스타 & 래슨 뷰"},
  {id:94,name:"Telescope Peak (Death Valley)",area:"Death Valley NP",drive:"4h",trailhead:"Mahogany Flat TH",miles:14,gain:3000,difficulty:"hard",desc:"데스밸리 최고봉, 사막 파노라마"},
  {id:95,name:"Mosaic Canyon (Death Valley)",area:"Death Valley NP",drive:"4h",trailhead:"Mosaic Canyon TH",miles:4,gain:400,difficulty:"easy",desc:"대리석 협곡, 독특한 지형"},
  {id:96,name:"Zabriskie Point Loop",area:"Death Valley NP",drive:"4h",trailhead:"Zabriskie TH",miles:2.5,gain:300,difficulty:"easy",desc:"데스밸리 대표 지형 뷰"},
  {id:97,name:"Fortynine Palms Oasis",area:"Joshua Tree NP",drive:"4.5h",trailhead:"Fortynine Palms TH",miles:3,gain:400,difficulty:"moderate",desc:"야자수 오아시스, 사막 하이킹"},
  {id:98,name:"Ryan Mountain",area:"Joshua Tree NP",drive:"4.5h",trailhead:"Ryan Mountain TH",miles:3,gain:1050,difficulty:"moderate",desc:"조슈아 트리 전망 최고"},
  {id:99,name:"Lost Palms Oasis",area:"Joshua Tree NP",drive:"4.5h",trailhead:"Cottonwood Spring TH",miles:8,gain:600,difficulty:"moderate",desc:"JT 최대 야자수 오아시스"},
  {id:100,name:"Tahquitz Peak (Lily Rock)",area:"San Bernardino NF",drive:"5h",trailhead:"Humber Park TH",miles:8,gain:2300,difficulty:"hard",desc:"이딜와일드 수호 봉우리 8,828ft"},
];

// ── 백패킹 마른 음식 ────────────────────────────────────
const DEHYDRATED_MEALS = [
  {cat:"🌅 아침", color:"#FF6F00", items:[
    {name:"오버나이트 오트밀",prep:"찬물 불리기",time:"0분 (전날 저녁)",recipe:"오트밀+파우더밀크+건포도+씨앗+꿀 팩"},
    {name:"그래놀라+파우더밀크",prep:"물 붓기",time:"2분",recipe:"그래놀라 100g + 파우더밀크 + 건조 베리"},
    {name:"인스턴트 오트밀",prep:"끓는물 붓기",time:"5분",recipe:"인스턴트 오트밀 팩 + 건조 과일 + 넛버터"},
    {name:"백패킹 스크램블에그",prep:"끓는물 섞기",time:"5분",recipe:"파우더 에그 2큰술 + 건조 채소 + 소금"},
    {name:"코코넛 치아 푸딩",prep:"찬물 불리기",time:"0분",recipe:"치아씨드+코코넛밀크파우더+건조망고"},
    {name:"누텔라 또띠아",prep:"없음",time:"0분",recipe:"또띠아+누텔라+건포도 — 초간단"},
    {name:"피넛버터 또띠아",prep:"없음",time:"0분",recipe:"또띠아+피넛버터+꿀+바나나칩"},
    {name:"인스턴트 커피+에너지바",prep:"뜨거운물",time:"2분",recipe:"스타벅스 VIA + 클리프바"},
  ]},
  {cat:"☀️ 점심", color:"#2E7D32", items:[
    {name:"참치+크래커",prep:"없음",time:"0분",recipe:"참치팩+크래커+핫소스 — 무게 최소화"},
    {name:"살라미+치즈+크래커",prep:"없음",time:"0분",recipe:"살라미+하드치즈+크래커+올리브"},
    {name:"피넛버터 랩",prep:"없음",time:"0분",recipe:"또띠아+PB+잼+오트밀+건포도"},
    {name:"후무스+피타+채소스틱",prep:"없음",time:"0분",recipe:"파우더 후무스 팩+피타칩+건조채소"},
    {name:"인스턴트 미소수프+라이스크래커",prep:"끓는물",time:"3분",recipe:"미소 스프 팩+라이스 크래커"},
    {name:"트레일 믹스 랩",prep:"없음",time:"0분",recipe:"또띠아+땅콩버터+트레일믹스"},
    {name:"누들 수프 컵",prep:"끓는물",time:"3분",recipe:"컵라면 종류 — 경량화 점심"},
    {name:"라이스 케이크+아몬드버터",prep:"없음",time:"0분",recipe:"라이스케이크+아몬드버터+꿀"},
  ]},
  {cat:"🌙 저녁", color:"#1565C0", items:[
    {name:"백패킹 리조또",prep:"끓는물 후 5분",time:"15분",recipe:"아르보리오쌀+파우더치즈+건조버섯+올리브오일"},
    {name:"코코넛 커리 라이스",prep:"끓는물",time:"15분",recipe:"인스턴트라이스+코코넛밀크파우더+커리파우더+건조채소"},
    {name:"백패킹 파스타 알리오올리오",prep:"끓는물",time:"12분",recipe:"엔젤헤어파스타+올리브오일팩+마늘파우더+파마산"},
    {name:"건조 비프 스트로가노프",prep:"끓는물",time:"15분",recipe:"에그누들+건조비프+사워크림파우더+파프리카"},
    {name:"렌틸 수프",prep:"끓는물",time:"20분",recipe:"레드렌틸+토마토파우더+쿠민+건조양파+올리브오일"},
    {name:"인스턴트 라면 업그레이드",prep:"끓는물",time:"5분",recipe:"신라면+파우더에그+건조채소+참기름팩"},
    {name:"퀴노아 채소 볼",prep:"끓는물",time:"15분",recipe:"퀴노아+건조채소+올리브오일+레몬파우더+소금"},
    {name:"맥앤치즈 (백패킹)",prep:"끓는물",time:"10분",recipe:"엘보우파스타+파우더치즈+파우더밀크+버터팩"},
    {name:"건조 콩 타코",prep:"끓는물 후 불리기",time:"15분",recipe:"인스턴트리프라이드빈+또띠아+살사팩+치즈파우더"},
    {name:"일본식 건조 카레",prep:"끓는물",time:"10분",recipe:"인스턴트라이스+S&B 골든커리 큐브+건조감자"},
    {name:"폴렌타+건조토마토소스",prep:"끓는물",time:"10분",recipe:"인스턴트폴렌타+건조토마토소스+파마산"},
    {name:"미역국+즉석밥",prep:"끓는물",time:"5분",recipe:"건미역+파우더다시+된장파우더+즉석밥"},
    {name:"건조 비빔밥",prep:"끓는물",time:"10분",recipe:"즉석밥+건조나물+고추장팩+참기름팩"},
    {name:"치킨 누들 수프",prep:"끓는물",time:"10분",recipe:"라면면+치킨파우더+건조채소+파우더에그"},
  ]},
  {cat:"🍫 스낵 & 에너지", color:"#7B1FA2", items:[
    {name:"트레일 믹스 (홈메이드)",prep:"없음",time:"0분",recipe:"아몬드+캐슈+건포도+다크초콜릿+코코넛플레이크"},
    {name:"홈메이드 에너지볼",prep:"사전 제작",time:"0분",recipe:"오트밀+PB+꿀+초코칩+치아씨드"},
    {name:"비프 저키",prep:"없음",time:"0분",recipe:"시판 저키 or 집에서 건조기로 제작"},
    {name:"건조 과일 믹스",prep:"없음",time:"0분",recipe:"망고+파인애플+크랜베리+바나나칩"},
    {name:"넛버터 스퀴즈팩",prep:"없음",time:"0분",recipe:"저스틴스 아몬드버터 팩 — 1회용"},
    {name:"프로틴 바",prep:"없음",time:"0분",recipe:"클리프바/RX바/킨드바 선호대로"},
    {name:"엠앤엠+땅콩",prep:"없음",time:"0분",recipe:"클래식 트레일 스낵, 카페인 필요시 초코"},
    {name:"팝콘 (지퍼백)",prep:"없음",time:"0분",recipe:"가볍고 부피감, 소금+버터파우더"},
  ]},
];

// ── 캠핑 음식 ────────────────────────────────────────────
const CAMP_FOODS = [
  { cat:"🔥 그릴", color:"#C62828", foods:[
    {name:"소갈비구이",time:"20분",recipe:"소갈비를 간장+설탕+마늘+배즙에 1시간 재운 뒤 그릴에 굽기. 숯불이면 더 맛있음"},
    {name:"삼겹살 구이",time:"15분",recipe:"소금+후추만으로 간단하게. 쌈채소+마늘+쌈장과 함께. 캠핑의 기본"},
    {name:"불고기",time:"20분",recipe:"집에서 미리 양념해 지퍼백에 담아오기. 그릴팬 or 불판에 볶기"},
    {name:"LA 갈비",time:"15분",recipe:"미리 재워온 LA갈비 그릴에 굽기. 불맛이 핵심"},
    {name:"치킨 윙",time:"25분",recipe:"소금+올리브오일+허브 밑간. 직화 그릴 중불 앞뒤 12분씩"},
    {name:"새우 꼬치",time:"10분",recipe:"새우+파프리카+양파 꼬치에 꿰어 버터+마늘+레몬 소스 발라 굽기"},
    {name:"가리비 버터구이",time:"8분",recipe:"가리비 위에 버터+마늘+파슬리 올려 직화. 껍질째 그릴 위에"},
    {name:"옥수수 버터 구이",time:"15분",recipe:"옥수수 껍질 벗기고 버터+소금 발라 포일에 싸서 그릴 위 15분"},
    {name:"감자 포일구이",time:"30분",recipe:"감자 반으로 잘라 버터+치즈+사워크림 올려 포일로 싸서 숯불 가장자리"},
    {name:"바베큐 립",time:"2h",recipe:"스페어립 소금+후추+파프리카+갈릭파우더 러브. 로우앤슬로우 2시간"},
  ]},
  { cat:"🍳 원팬 요리", color:"#E65100", foods:[
    {name:"부대찌개",time:"20분",recipe:"소시지+스팸+햄+김치+라면사리+고추장+된장. 캠핑 냄비에 물 붓고 끓이기"},
    {name:"캠핑 파스타",time:"20분",recipe:"원팬에 물+파스타+마늘+올리브오일+소금 한번에 끓이기. 물이 졸면 완성"},
    {name:"김치볶음밥",time:"15분",recipe:"즉석밥+묵은지+계란+참기름+간장. 캠핑 프라이팬에 볶기"},
    {name:"짜파구리",time:"10분",recipe:"짜파게티+너구리 같이 끓이기. 면수 살짝 남기고 볶기. 올리브오일 추가"},
    {name:"스팸 무스비",time:"15분",recipe:"스팸 구워 밥+김으로 말기. 간장+설탕 소스. 캠핑 아침으로 최고"},
    {name:"떡볶이",time:"15분",recipe:"떡+어묵+고추장+설탕+간장+물. 캠핑 냄비에 끓이기"},
    {name:"라볶이",time:"15분",recipe:"라면+떡+어묵+고추장. 국물 자작하게"},
    {name:"계란 베이컨 볶음밥",time:"10분",recipe:"베이컨 먼저 바삭하게, 계란 스크램블, 즉석밥 넣고 볶기. 간장 마무리"},
    {name:"닭갈비",time:"25분",recipe:"미리 양념한 닭+양배추+고구마. 캠핑 그릴팬에 볶기"},
    {name:"해물 나베",time:"20분",recipe:"해물모둠+두부+채소+다시육수. 캠핑 냄비에 끓여 폰즈소스 찍어먹기"},
  ]},
  { cat:"🥘 더치오븐", color:"#6A1B9A", foods:[
    {name:"더치오븐 찜닭",time:"50분",recipe:"닭+감자+당근+양파+간장+설탕+마늘. 더치오븐 뚜껑 덮고 숯불 위아래로"},
    {name:"더치오븐 로스트 치킨",time:"1h",recipe:"통닭에 허브버터 발라 더치오븐에. 숯 위아래 배치, 1시간"},
    {name:"더치오븐 감자 수프",time:"35분",recipe:"감자+양파+베이컨+크림+치킨스톡. 더치오븐에 끓여 으깨기"},
    {name:"더치오븐 갈비찜",time:"1.5h",recipe:"미리 재워온 갈비+당근+밤+버섯. 더치오븐 저온 장시간"},
    {name:"더치오븐 비프 스튜",time:"1h",recipe:"소고기+감자+당근+양파+레드와인+토마토페이스트"},
    {name:"더치오븐 피자",time:"20분",recipe:"시판 피자도우+소스+치즈+토핑. 더치오븐 180도 15~20분"},
    {name:"더치오븐 애플 크럼블",time:"35분",recipe:"사과+계피+설탕+버터+귀리+밀가루. 디저트로 최고"},
    {name:"더치오븐 콘브레드",time:"30분",recipe:"콘브레드 믹스+버터+꿀. 더치오븐 빵굽기"},
  ]},
  { cat:"🍕 피자 & 빵", color:"#F57F17", foods:[
    {name:"캠핑 또띠아 피자",time:"10분",recipe:"또띠아+피자소스+모차렐라+토핑. 그릴팬에 뚜껑 덮고 3분"},
    {name:"스틱 빵 (모닥불)",time:"15분",recipe:"비스킷 반죽을 긴 나무 막대에 감아 모닥불 주변에서 굽기"},
    {name:"캠핑 갈릭브레드",time:"10분",recipe:"바게트 반으로 잘라 버터+마늘+파슬리 발라 포일에 싸서 그릴"},
    {name:"스모어",time:"5분",recipe:"마시멜로 구워 그래함 크래커+초콜릿 사이에 끼우기. 미국 캠핑 필수"},
    {name:"캠핑 시나몬 또띠아",time:"5분",recipe:"또띠아에 버터+설탕+계피 발라 팬에 굽기. 디저트로 최고"},
    {name:"바나나 초코 포일구이",time:"10분",recipe:"바나나 반 갈라 초콜릿+마시멜로 채워 포일로 싸서 숯불 가장자리"},
  ]},
  { cat:"☕ 아침 & 음료", color:"#4E342E", foods:[
    {name:"캠핑 베이컨 에그",time:"10분",recipe:"베이컨 먼저 바삭하게, 기름에 계란 프라이. 토스트와 함께"},
    {name:"팬케이크",time:"15분",recipe:"팬케이크 믹스+계란+우유. 버터 두른 팬에 굽기. 메이플시럽"},
    {name:"캠핑 드립 커피",time:"5분",recipe:"드리퍼+필터+원두. 끓인 물 천천히 붓기. 모닥불 아침커피"},
    {name:"카우보이 커피",time:"5분",recipe:"냄비에 물 끓이고 원두 직접 넣어 2분. 가라앉히고 따르기"},
    {name:"핫초코",time:"5분",recipe:"핫초코 파우더+뜨거운 물+마시멜로. 모닥불 옆에서"},
    {name:"과일 꼬치",time:"5분",recipe:"딸기+포도+파인애플+멜론 꼬치에 꿰어. 요거트 딥소스"},
    {name:"그래놀라+요거트",time:"0분",recipe:"컵에 요거트+그래놀라+건과일+꿀. 아침 간편식"},
  ]},
];

export default function OutdoorPlanner() {
  const [tab,setTab]=useState("backpacking");
  const [bpSearch,setBpSearch]=useState("");
  const [bpFilter,setBpFilter]=useState("all");
  const [campSearch,setCampSearch]=useState("");
  const [campFilter,setCampFilter]=useState("all");
  const [hikeSearch,setHikeSearch]=useState("");
  const [hikeDiff,setHikeDiff]=useState("all");
  const [hikeSort,setHikeSort]=useState("id");
  const [savedBP,setSavedBP]=useState(()=>loadLS("op_savedBP",[]));
  const [savedCamp,setSavedCamp]=useState(()=>loadLS("op_savedCamp",[]));
  const [savedHike,setSavedHike]=useState(()=>loadLS("op_savedHike",[]));
  const [detailModal,setDetailModal]=useState(null);

  // 캠핑 장소 메모/일기/정보 { campId: {note, visited, date, rating} }
  const [campNotes,setCampNotes]=useState(()=>loadLS("op_campNotes",{}));
  // 내가 추가한 캠핑장소
  const [myPlaces,setMyPlaces]=useState(()=>loadLS("op_myPlaces",[]));
  // 프리셋 장소 수정 overrides { campId: {...fields} }
  const [campEdits,setCampEdits]=useState(()=>loadLS("op_campEdits",{}));
  // 모달 상태
  const [campDetailModal,setCampDetailModal]=useState(null); // camp object
  const [addPlaceModal,setAddPlaceModal]=useState(false);
  const [editPlaceModal,setEditPlaceModal]=useState(null);
  const [placeForm,setPlaceForm]=useState({name:"",area:"",drive:"",type:"tent/rv",hookup:false,reserve:false,desc:""});
  const [campFoodCat,setCampFoodCat]=useState("🔥 그릴");
  const [campFoodModal,setCampFoodModal]=useState(null);

  // 백패킹 메모/일기/사진
  const [bpNotes,setBpNotes]=useState(()=>loadLS("op_bpNotes",{}));
  const [bpDetailModal,setBpDetailModal]=useState(null);
  const [bpEditModal,setBpEditModal]=useState(null);
  const [bpEdits,setBpEdits]=useState(()=>loadLS("op_bpEdits",{}));

  // 장소 사진 { "camp_id": dataURL, "bp_id": dataURL }
  const [placePics,setPlacePics]=useState(()=>loadLS("op_placePics",{}));

  // 커스텀 음식/레시피 { "campfood": [{cat,name,time,recipe}], "backpackfood": [...] }
  const [customFoodItems,setCustomFoodItems]=useState(()=>loadLS("op_customFoodItems",{}));
  // 레시피 수정 overrides { "foodname": {time,recipe} }
  const [recipeEdits,setRecipeEdits]=useState(()=>loadLS("op_recipeEdits",{}));
  const [addFoodModal,setAddFoodModal]=useState(null); // "campfood" or "backpackfood"
  const [foodForm,setFoodForm]=useState({name:"",time:"",recipe:"",cat:""});
  const [editRecipeModal,setEditRecipeModal]=useState(null); // {name,time,recipe,color}
  const [editRecipeForm,setEditRecipeForm]=useState({time:"",recipe:""});

  const getRecipe=(name)=>recipeEdits[name]||null;
  const handlePlacePic=(id,file)=>{
    if(!file) return;
    const reader=new FileReader();
    reader.onload=e=>{
      const img=new Image();
      img.onload=()=>{
        const canvas=document.createElement("canvas");
        const max=800;
        let w=img.width,h=img.height;
        if(w>max){h=h*max/w;w=max;}
        canvas.width=w;canvas.height=h;
        canvas.getContext("2d").drawImage(img,0,0,w,h);
        setPlacePics(p=>({...p,[id]:canvas.toDataURL("image/jpeg",0.7)}));
      };
      img.src=e.target.result;
    };
    reader.readAsDataURL(file);
  };
  const [mealCat,setMealCat]=useState(DEHYDRATED_MEALS[0].cat);
  const [mealModal,setMealModal]=useState(null);

  useEffect(()=>saveLS("op_savedBP",savedBP),[savedBP]);
  useEffect(()=>saveLS("op_savedCamp",savedCamp),[savedCamp]);
  useEffect(()=>saveLS("op_savedHike",savedHike),[savedHike]);
  useEffect(()=>saveLS("op_campNotes",campNotes),[campNotes]);
  useEffect(()=>saveLS("op_myPlaces",myPlaces),[myPlaces]);
  useEffect(()=>saveLS("op_campEdits",campEdits),[campEdits]);
  useEffect(()=>saveLS("op_bpNotes",bpNotes),[bpNotes]);
  useEffect(()=>saveLS("op_bpEdits",bpEdits),[bpEdits]);
  useEffect(()=>saveLS("op_placePics",placePics),[placePics]);
  useEffect(()=>saveLS("op_customFoodItems",customFoodItems),[customFoodItems]);
  useEffect(()=>saveLS("op_recipeEdits",recipeEdits),[recipeEdits]);

  const toggleBP=(id)=>setSavedBP(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]);
  const toggleCamp=(id)=>setSavedCamp(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]);
  const toggleHike=(id)=>setSavedHike(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]);

  const diffColor={easy:"#2E7D32",moderate:"#F57F17",hard:"#C62828",extreme:"#6A1B9A"};
  const diffLabel={easy:"쉬움",moderate:"보통",hard:"어려움",extreme:"익스트림"};
  const typeLabel={"out-back":"왕복","loop":"루프","one-way":"편도","thru":"종주","section":"구간","cross-country":"크로스컨트리","dispersed":"분산"};

  // 필터링
  const filteredBP = BACKPACKING.filter(b=>{
    const matchSearch=!bpSearch||b.name.toLowerCase().includes(bpSearch.toLowerCase())||b.area.toLowerCase().includes(bpSearch.toLowerCase())||b.desc.includes(bpSearch);
    const matchFilter=bpFilter==="all"||(bpFilter==="saved"&&savedBP.includes(b.id))||(bpFilter==="easy"&&b.difficulty==="easy")||(bpFilter==="moderate"&&b.difficulty==="moderate")||(bpFilter==="hard"&&(b.difficulty==="hard"||b.difficulty==="extreme"))||(bpFilter==="1day"&&b.duration.includes("1"))||(bpFilter==="week"&&(b.duration.includes("7")||b.duration.includes("10")||b.duration.includes("21")||b.duration.includes("14")));
    return matchSearch&&matchFilter;
  });

  const filteredCamp = CAMPGROUNDS.filter(c=>{
    const matchSearch=!campSearch||c.name.toLowerCase().includes(campSearch.toLowerCase())||c.area.toLowerCase().includes(campSearch.toLowerCase());
    const matchFilter=campFilter==="all"||(campFilter==="saved"&&savedCamp.includes(c.id))||(campFilter==="free"&&!c.reserve)||(campFilter==="hookup"&&c.hookup)||(campFilter==="beach"&&(c.area.includes("Big Sur")||c.area.includes("Beach")||c.area.includes("Tahoe")))||(campFilter==="lake"&&(c.name.toLowerCase().includes("lake")||c.desc.includes("호수")||c.desc.includes("레이크")));
    return matchSearch&&matchFilter;
  });

  const filteredHike = HIKING.filter(h=>{
    const matchSearch=!hikeSearch||h.name.toLowerCase().includes(hikeSearch.toLowerCase())||h.area.toLowerCase().includes(hikeSearch.toLowerCase())||h.trailhead.toLowerCase().includes(hikeSearch.toLowerCase());
    const matchDiff=hikeDiff==="all"||h.difficulty===hikeDiff||(hikeDiff==="saved"&&savedHike.includes(h.id));
    return matchSearch&&matchDiff;
  }).sort((a,b)=>{
    if(hikeSort==="miles") return a.miles-b.miles;
    if(hikeSort==="gain") return a.gain-b.gain;
    if(hikeSort==="drive") return a.drive.localeCompare(b.drive);
    return a.id-b.id;
  });

  const CardBadge=({text,color})=>(
    <span style={{fontSize:10,fontWeight:700,padding:"2px 7px",borderRadius:10,background:color+"22",color}}>{text}</span>
  );

  return(
    <div style={{fontFamily:"'Noto Sans KR',sans-serif",background:"#F0F4EE",minHeight:"100vh",maxWidth:480,margin:"0 auto",paddingBottom:60}}>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900&display=swap" rel="stylesheet"/>

      {/* 헤더 */}
      <div style={{background:"linear-gradient(135deg,#1B4332,#2D6A4F)",padding:"20px 16px 0",color:"#fff"}}>
        <div style={{fontSize:11,letterSpacing:3,color:"rgba(255,255,255,0.5)",marginBottom:4}}>FRESNO, CA · 5HR RANGE</div>
        <h1 style={{fontSize:22,fontWeight:900,margin:"0 0 12px"}}>🏔️ 아웃도어 플래너</h1>
        <div style={{display:"flex",gap:0,borderBottom:"2px solid rgba(255,255,255,0.1)"}}>
          {[["backpacking","🎒 백패킹"],["camping","⛺ 캠핑"],["hiking","🥾 하이킹"],["campfood","🔥 캠핑 음식"],["food","🎒 마른음식"]].map(([key,label])=>(
            <button key={key} onClick={()=>setTab(key)} style={{
              flex:1,padding:"10px 4px",border:"none",cursor:"pointer",background:"transparent",
              color:tab===key?"#fff":"rgba(255,255,255,0.5)",
              fontSize:10,fontWeight:700,
              borderBottom:tab===key?"3px solid #95D5B2":"3px solid transparent",
            }}>{label}</button>
          ))}
        </div>
      </div>

      <div style={{padding:"12px"}}>

        {/* ══ 백패킹 탭 ══ */}
        {tab==="backpacking"&&(
          <div>
            <div style={{display:"flex",gap:6,marginBottom:10,alignItems:"center"}}>
              <div style={{position:"relative",flex:1}}>
                <span style={{position:"absolute",left:9,top:"50%",transform:"translateY(-50%)",color:"#bbb",fontSize:13}}>🔍</span>
                <input value={bpSearch} onChange={e=>setBpSearch(e.target.value)} placeholder="지역, 이름 검색..."
                  style={{width:"100%",padding:"9px 10px 9px 28px",borderRadius:10,border:"2px solid #D8E8D4",fontSize:12,outline:"none",boxSizing:"border-box",background:"#fff"}}/>
              </div>
              <span style={{fontSize:11,color:"#666",flexShrink:0}}>{filteredBP.length}곳</span>
            </div>
            <div style={{display:"flex",gap:5,overflowX:"auto",marginBottom:12,paddingBottom:3}}>
              {[["all","전체"],["saved","⭐저장"],["easy","쉬움"],["moderate","보통"],["hard","어려움"],["1day","1~2일"],["week","7일+"]].map(([v,l])=>(
                <button key={v} onClick={()=>setBpFilter(v)} style={{padding:"5px 10px",borderRadius:15,border:"none",flexShrink:0,cursor:"pointer",background:bpFilter===v?"#2D6A4F":"#fff",color:bpFilter===v?"#fff":"#666",fontSize:10,fontWeight:700}}>{l}</button>
              ))}
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {filteredBP.map(b=>(
                <div key={b.id} onClick={()=>setBpDetailModal(b)} style={{background:"#fff",borderRadius:12,padding:"12px 14px",boxShadow:"0 1px 6px rgba(0,0,0,0.07)",borderLeft:`4px solid ${diffColor[b.difficulty]}`,cursor:"pointer"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                    <div style={{flex:1,minWidth:0,paddingRight:8}}>
                      <div style={{fontSize:13,fontWeight:700,color:"#1B4332",marginBottom:3}}>{b.name}</div>
                      <div style={{fontSize:11,color:"#888"}}>{b.area} · 🚗 {b.drive}</div>
                    </div>
                    <div style={{display:"flex",gap:5,alignItems:"center"}}>
                      {bpNotes[b.id]?.visited&&<span style={{fontSize:11}}>✅</span>}
                      {bpNotes[b.id]?.rating>0&&<span style={{fontSize:10,color:"#F57F17",fontWeight:700}}>{"⭐".repeat(bpNotes[b.id].rating)}</span>}
                      <button onClick={e=>{e.stopPropagation();toggleBP(b.id);}} style={{background:"none",border:"none",fontSize:18,cursor:"pointer",flexShrink:0,padding:0}}>{savedBP.includes(b.id)?"⭐":"☆"}</button>
                    </div>
                  </div>
                  <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:bpNotes[b.id]?.note?6:0}}>
                    <CardBadge text={diffLabel[b.difficulty]} color={diffColor[b.difficulty]}/>
                    <CardBadge text={b.duration} color="#1565C0"/>
                    <CardBadge text={`${b.miles}mi`} color="#555"/>
                    <CardBadge text={typeLabel[b.type]||b.type} color="#888"/>
                    {b.permit==="required"&&<CardBadge text="퍼밋필요" color="#C62828"/>}
                  </div>
                  {bpNotes[b.id]?.note&&<div style={{fontSize:11,color:"#558B2F",background:"#F1F8E9",borderRadius:7,padding:"5px 8px",marginTop:5,lineHeight:1.5}}>📝 {bpNotes[b.id].note.slice(0,60)}...</div>}
                  {placePics["bp_"+b.id]&&<img src={placePics["bp_"+b.id]} alt={b.name} style={{width:"100%",height:80,objectFit:"cover",borderRadius:8,marginTop:7}}/>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ 캠핑 탭 ══ */}
        {tab==="camping"&&(
          <div>
            {/* 검색 + 내 장소 추가 */}
            <div style={{display:"flex",gap:7,marginBottom:10}}>
              <div style={{position:"relative",flex:1}}>
                <span style={{position:"absolute",left:9,top:"50%",transform:"translateY(-50%)",color:"#bbb",fontSize:13}}>🔍</span>
                <input value={campSearch} onChange={e=>setCampSearch(e.target.value)} placeholder="캠핑장, 지역 검색..."
                  style={{width:"100%",padding:"9px 10px 9px 28px",borderRadius:10,border:"2px solid #D8E8D4",fontSize:12,outline:"none",boxSizing:"border-box",background:"#fff"}}/>
              </div>
              <button onClick={()=>{setPlaceForm({name:"",area:"",drive:"",type:"tent/rv",hookup:false,reserve:false,desc:""});setAddPlaceModal(true);}} style={{padding:"9px 13px",borderRadius:10,border:"none",background:"#2D6A4F",color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer",flexShrink:0}}>+ 추가</button>
            </div>
            {/* 필터 */}
            <div style={{display:"flex",gap:5,overflowX:"auto",marginBottom:12,paddingBottom:3}}>
              {[["all","전체"],["saved","⭐저장"],["mine","내장소"],["free","예약불필요"],["hookup","훅업"],["lake","호수"],["beach","해변/타호"]].map(([v,l])=>(
                <button key={v} onClick={()=>setCampFilter(v)} style={{padding:"5px 10px",borderRadius:15,border:"none",flexShrink:0,cursor:"pointer",background:campFilter===v?"#2D6A4F":"#fff",color:campFilter===v?"#fff":"#666",fontSize:10,fontWeight:700}}>{l}</button>
              ))}
              <span style={{fontSize:11,color:"#888",display:"flex",alignItems:"center",flexShrink:0,marginLeft:4}}>{filteredCamp.length}곳</span>
            </div>

            {/* 내가 추가한 장소 */}
            {myPlaces.length>0&&campFilter!=="mine"&&(
              <div style={{marginBottom:10}}>
                <div style={{fontSize:11,fontWeight:700,color:"#2D6A4F",marginBottom:6}}>📍 내가 추가한 장소 ({myPlaces.length})</div>
                <div style={{display:"flex",flexDirection:"column",gap:6}}>
                  {myPlaces.map((p,i)=>(
                    <div key={p.id} onClick={()=>setCampDetailModal({...p,isMine:true})} style={{background:"#F1F8E9",borderRadius:12,padding:"11px 14px",boxShadow:"0 1px 6px rgba(0,0,0,0.07)",cursor:"pointer",borderLeft:"4px solid #2D6A4F"}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                        <div>
                          <div style={{fontSize:13,fontWeight:700,color:"#1B4332"}}>{p.name}</div>
                          <div style={{fontSize:11,color:"#888"}}>{p.area}{p.drive&&` · 🚗 ${p.drive}`}</div>
                        </div>
                        <span style={{fontSize:10,background:"#2D6A4F",color:"#fff",borderRadius:8,padding:"2px 7px",fontWeight:700}}>MY</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 캠핑장 목록 */}
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {(campFilter==="mine"?myPlaces:filteredCamp).map(c=>{
                const note=campNotes[c.id]||{};
                const edits=campEdits[c.id]||{};
                const display={...c,...edits};
                return(
                  <div key={c.id} onClick={()=>setCampDetailModal({...display,isMine:!!c.isMine})} style={{background:"#fff",borderRadius:12,padding:"12px 14px",boxShadow:"0 1px 6px rgba(0,0,0,0.07)",cursor:"pointer",borderLeft:`4px solid ${note.visited?"#FFD54F":savedCamp.includes(c.id)?"#2D6A4F":"#ddd"}`}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                      <div style={{flex:1,minWidth:0,paddingRight:8}}>
                        <div style={{fontSize:13,fontWeight:700,color:"#1B4332",marginBottom:2}}>{display.name}</div>
                        <div style={{fontSize:11,color:"#888"}}>{display.area}{display.drive&&` · 🚗 ${display.drive}`}</div>
                      </div>
                      <div style={{display:"flex",gap:5,alignItems:"center"}}>
                        {note.visited&&<span style={{fontSize:12}}>✅</span>}
                        {note.rating&&<span style={{fontSize:11,fontWeight:700,color:"#F57F17"}}>{"⭐".repeat(note.rating)}</span>}
                        <button onClick={e=>{e.stopPropagation();toggleCamp(c.id);}} style={{background:"none",border:"none",fontSize:18,cursor:"pointer",padding:0}}>{savedCamp.includes(c.id)?"⭐":"☆"}</button>
                      </div>
                    </div>
                    <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:note.note?6:0}}>
                      <CardBadge text={display.type||"tent"} color="#2D6A4F"/>
                      {display.hookup&&<CardBadge text="훅업" color="#1565C0"/>}
                      {display.reserve?<CardBadge text="예약필요" color="#F57F17"/>:<CardBadge text="예약불필요" color="#2E7D32"/>}
                      {Object.keys(edits).length>0&&<CardBadge text="수정됨" color="#7C5CBF"/>}
                    </div>
                    {note.note&&<div style={{fontSize:11,color:"#558B2F",background:"#F1F8E9",borderRadius:7,padding:"5px 8px",marginTop:5,lineHeight:1.5}}>📝 {note.note.slice(0,60)}{note.note.length>60?"...":""}</div>}
                    {placePics["camp_"+c.id]&&<img src={placePics["camp_"+c.id]} alt={c.name} style={{width:"100%",height:70,objectFit:"cover",borderRadius:8,marginTop:6}}/>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ══ 하이킹 탭 ══ */}
        {tab==="hiking"&&(
          <div>
            <div style={{display:"flex",gap:6,marginBottom:10,alignItems:"center"}}>
              <div style={{position:"relative",flex:1}}>
                <span style={{position:"absolute",left:9,top:"50%",transform:"translateY(-50%)",color:"#bbb",fontSize:13}}>🔍</span>
                <input value={hikeSearch} onChange={e=>setHikeSearch(e.target.value)} placeholder="트레일, 지역, 출발지 검색..."
                  style={{width:"100%",padding:"9px 10px 9px 28px",borderRadius:10,border:"2px solid #D8E8D4",fontSize:12,outline:"none",boxSizing:"border-box",background:"#fff"}}/>
              </div>
              <span style={{fontSize:11,color:"#666",flexShrink:0}}>{filteredHike.length}곳</span>
            </div>
            {/* 난이도 필터 */}
            <div style={{display:"flex",gap:5,overflowX:"auto",marginBottom:8,paddingBottom:3}}>
              {[["all","전체"],["saved","⭐저장"],["easy","쉬움"],["moderate","보통"],["hard","어려움"],["extreme","익스트림"]].map(([v,l])=>(
                <button key={v} onClick={()=>setHikeDiff(v)} style={{padding:"5px 10px",borderRadius:15,border:"none",flexShrink:0,cursor:"pointer",background:hikeDiff===v?(v==="all"?"#2D6A4F":diffColor[v]||"#2D6A4F"):"#fff",color:hikeDiff===v?"#fff":"#666",fontSize:10,fontWeight:700}}>{l}</button>
              ))}
            </div>
            {/* 정렬 */}
            <div style={{display:"flex",gap:5,marginBottom:12,alignItems:"center"}}>
              <span style={{fontSize:10,color:"#aaa"}}>정렬:</span>
              {[["id","기본"],["miles","거리"],["gain","고도"],["drive","드라이브"]].map(([v,l])=>(
                <button key={v} onClick={()=>setHikeSort(v)} style={{padding:"4px 9px",borderRadius:12,border:"none",cursor:"pointer",background:hikeSort===v?"#2D6A4F":"#fff",color:hikeSort===v?"#fff":"#888",fontSize:10,fontWeight:700}}>{l}</button>
              ))}
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {filteredHike.map(h=>(
                <div key={h.id} style={{background:"#fff",borderRadius:12,padding:"12px 14px",boxShadow:"0 1px 6px rgba(0,0,0,0.07)",borderLeft:`4px solid ${diffColor[h.difficulty]}`}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:5}}>
                    <div style={{flex:1,minWidth:0,paddingRight:8}}>
                      <div style={{fontSize:13,fontWeight:700,color:"#1B4332",marginBottom:2}}>{h.name}</div>
                      <div style={{fontSize:10,color:"#888"}}>{h.area} · 🚗 {h.drive}</div>
                    </div>
                    <button onClick={()=>toggleHike(h.id)} style={{background:"none",border:"none",fontSize:18,cursor:"pointer",flexShrink:0,padding:0}}>{savedHike.includes(h.id)?"⭐":"☆"}</button>
                  </div>
                  {/* 출발지 */}
                  <div style={{fontSize:10,color:"#4CAF50",fontWeight:700,marginBottom:5}}>📍 {h.trailhead}</div>
                  {/* 스탯 배지 */}
                  <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:5}}>
                    <CardBadge text={diffLabel[h.difficulty]} color={diffColor[h.difficulty]}/>
                    <CardBadge text={`${h.miles}mi`} color="#1565C0"/>
                    <CardBadge text={`+${h.gain.toLocaleString()}ft`} color="#E65100"/>
                  </div>
                  <div style={{fontSize:11,color:"#666",lineHeight:1.5}}>{h.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ 캠핑 음식 탭 ══ */}
        {tab==="campfood"&&(
          <div>
            <div style={{background:"linear-gradient(135deg,#B71C1C,#C62828)",borderRadius:13,padding:"13px 15px",marginBottom:12,color:"#fff",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{fontSize:13,fontWeight:700,marginBottom:2}}>🔥 캠핑 음식 레시피</div>
                <div style={{fontSize:11,color:"rgba(255,255,255,0.7)"}}>그릴부터 더치오븐까지</div>
              </div>
              <button onClick={()=>{setAddFoodModal("campfood");setFoodForm({name:"",time:"",recipe:"",cat:campFoodCat});}} style={{padding:"7px 12px",borderRadius:9,border:"none",background:"rgba(255,255,255,0.2)",color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer"}}>+ 추가</button>
            </div>
            <div style={{display:"flex",gap:6,overflowX:"auto",marginBottom:12,paddingBottom:3}}>
              {CAMP_FOODS.map(c=>(
                <button key={c.cat} onClick={()=>setCampFoodCat(c.cat)} style={{padding:"6px 11px",borderRadius:20,border:"none",flexShrink:0,cursor:"pointer",background:campFoodCat===c.cat?c.color:"#fff",color:campFoodCat===c.cat?"#fff":"#666",fontSize:11,fontWeight:700}}>{c.cat}</button>
              ))}
            </div>
            {/* 커스텀 추가 음식 */}
            {(customFoodItems["campfood"]||[]).length>0&&(
              <div style={{marginBottom:10}}>
                <div style={{fontSize:11,fontWeight:700,color:"#C62828",marginBottom:7}}>✏️ 내가 추가한 음식</div>
                <div style={{display:"flex",flexDirection:"column",gap:6}}>
                  {(customFoodItems["campfood"]||[]).map((item,i)=>(
                    <div key={i} onClick={()=>setCampFoodModal({...item,color:"#C62828",isCustom:true})} style={{background:"#FFF3F0",borderRadius:11,padding:"11px 13px",cursor:"pointer",borderLeft:"4px solid #C62828"}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        <span style={{fontSize:13,fontWeight:700,color:"#1B4332"}}>{item.name}</span>
                        <div style={{display:"flex",gap:5,alignItems:"center"}}>
                          <span style={{fontSize:10,background:"#FFEBEE",color:"#C62828",borderRadius:7,padding:"2px 7px",fontWeight:700}}>⏱ {item.time}</span>
                          <button onClick={e=>{e.stopPropagation();setCustomFoodItems(p=>({...p,campfood:(p.campfood||[]).filter((_,j)=>j!==i)}));}} style={{background:"none",border:"none",color:"#ddd",fontSize:15,cursor:"pointer",padding:0}}>×</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {CAMP_FOODS.filter(c=>c.cat===campFoodCat).map(c=>(
              <div key={c.cat} style={{display:"flex",flexDirection:"column",gap:8}}>
                {c.foods.map((item,i)=>(
                  <div key={i} onClick={()=>{const override=recipeEdits[item.name];setCampFoodModal({...item,...(override||{}),color:c.color,isCustom:!!(customFoodItems["campfood"]||[]).find(x=>x.name===item.name)});}} style={{background:"#fff",borderRadius:12,padding:"12px 14px",boxShadow:"0 1px 6px rgba(0,0,0,0.07)",cursor:"pointer",borderLeft:`4px solid ${c.color}`}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                      <div style={{fontSize:13,fontWeight:700,color:"#1B4332"}}>{item.name}</div>
                      <div style={{display:"flex",gap:5,alignItems:"center"}}>
                        {recipeEdits[item.name]&&<span style={{fontSize:9,background:"#EDE7F6",color:"#7C5CBF",borderRadius:6,padding:"1px 5px",fontWeight:700}}>수정됨</span>}
                        <span style={{fontSize:10,background:"#FFEBEE",color:"#C62828",borderRadius:8,padding:"2px 7px",fontWeight:700}}>⏱ {recipeEdits[item.name]?.time||item.time}</span>
                        <span style={{fontSize:11,color:"#ccc"}}>›</span>
                      </div>
                    </div>
                    <div style={{fontSize:11,color:"#888",lineHeight:1.4}}>{(recipeEdits[item.name]?.recipe||item.recipe).slice(0,50)}...</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* ══ 백패킹 음식 탭 ══ */}
        {tab==="food"&&(
          <div>
            <div style={{background:"linear-gradient(135deg,#1B4332,#2D6A4F)",borderRadius:13,padding:"13px 15px",marginBottom:12,color:"#fff",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{fontSize:13,fontWeight:700,marginBottom:2}}>🎒 백패킹 마른 음식 가이드</div>
                <div style={{fontSize:11,color:"rgba(255,255,255,0.7)"}}>가볍게, 영양있게, 맛있게</div>
              </div>
              <button onClick={()=>{setAddFoodModal("backpackfood");setFoodForm({name:"",time:"",recipe:"",cat:mealCat});}} style={{padding:"7px 12px",borderRadius:9,border:"none",background:"rgba(255,255,255,0.2)",color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer"}}>+ 추가</button>
            </div>
            {/* 카테고리 탭 */}
            <div style={{display:"flex",gap:6,marginBottom:12}}>
              {DEHYDRATED_MEALS.map(c=>(
                <button key={c.cat} onClick={()=>setMealCat(c.cat)} style={{flex:1,padding:"8px 4px",borderRadius:10,border:"none",cursor:"pointer",background:mealCat===c.cat?c.color:"#fff",color:mealCat===c.cat?"#fff":"#666",fontSize:11,fontWeight:700}}>{c.cat}</button>
              ))}
            </div>
            {/* 커스텀 추가 음식 */}
            {(customFoodItems["backpackfood"]||[]).length>0&&(
              <div style={{marginBottom:10}}>
                <div style={{fontSize:11,fontWeight:700,color:"#2D6A4F",marginBottom:7}}>✏️ 내가 추가한 음식</div>
                <div style={{display:"flex",flexDirection:"column",gap:6}}>
                  {(customFoodItems["backpackfood"]||[]).map((item,i)=>(
                    <div key={i} onClick={()=>setMealModal({...item})} style={{background:"#F1F8E9",borderRadius:11,padding:"11px 13px",cursor:"pointer",borderLeft:"4px solid #2D6A4F"}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        <span style={{fontSize:13,fontWeight:700,color:"#1B4332"}}>{item.name}</span>
                        <div style={{display:"flex",gap:5,alignItems:"center"}}>
                          <span style={{fontSize:10,background:"#E8F5E9",color:"#2E7D32",borderRadius:7,padding:"2px 7px",fontWeight:700}}>⏱ {item.time}</span>
                          <button onClick={e=>{e.stopPropagation();setCustomFoodItems(p=>({...p,backpackfood:(p.backpackfood||[]).filter((_,j)=>j!==i)}));}} style={{background:"none",border:"none",color:"#ddd",fontSize:15,cursor:"pointer",padding:0}}>×</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {DEHYDRATED_MEALS.filter(c=>c.cat===mealCat).map(c=>(
              <div key={c.cat} style={{display:"flex",flexDirection:"column",gap:8}}>
                {c.items.map((item,i)=>(
                  <div key={i} onClick={()=>setMealModal(item)} style={{background:"#fff",borderRadius:12,padding:"12px 14px",boxShadow:"0 1px 6px rgba(0,0,0,0.07)",cursor:"pointer",borderLeft:`4px solid ${c.color}`}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                      <div style={{fontSize:13,fontWeight:700,color:"#1B4332"}}>{item.name}</div>
                      <div style={{display:"flex",gap:5}}>
                        <span style={{fontSize:10,background:"#E8F5E9",color:"#2E7D32",borderRadius:8,padding:"2px 7px",fontWeight:700}}>⏱ {item.time}</span>
                        <span style={{fontSize:11,color:"#ccc"}}>›</span>
                      </div>
                    </div>
                    <div style={{fontSize:11,color:"#888"}}>{item.prep} · {item.recipe.slice(0,40)}...</div>
                  </div>
                ))}
              </div>
            ))}

            {/* 백패킹 음식 팁 */}
            <div style={{background:"#fff",borderRadius:12,padding:"13px 14px",marginTop:12,boxShadow:"0 1px 6px rgba(0,0,0,0.07)"}}>
              <div style={{fontSize:12,fontWeight:700,color:"#1B4332",marginBottom:8}}>💡 백패킹 음식 팁</div>
              {["하루 칼로리 목표: 체중(lbs) × 100 = kcal","무게 목표: 하루 1.5~2lbs (680~900g)","가스캐니스터: 3일 = 100g 캐니스터 1개","물은 필터/정수약으로 현장 조달","냄새 차단 베어 캐니스터 필수 (시에라)","고도 높을수록 조리 시간 길어짐 (+20%)","지퍼백으로 재포장 → 쓰레기 최소화"].map((tip,i)=>(
                <div key={i} style={{fontSize:11,color:"#555",padding:"5px 0",borderBottom:i<6?"1px solid #F3F0EA":"none",display:"flex",gap:7}}>
                  <span style={{color:"#2D6A4F",fontWeight:700,flexShrink:0}}>{i+1}.</span>
                  {tip}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ══ 캠핑장 상세/일기 모달 ══ */}
      {campDetailModal&&(()=>{
        const c=campDetailModal;
        const note=campNotes[c.id]||{note:"",visited:false,date:"",rating:0};
        const isEditing=editPlaceModal===c.id;
        return(
          <div onClick={()=>{setCampDetailModal(null);setEditPlaceModal(null);}} style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.55)",zIndex:1000,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
            <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:"20px 20px 0 0",padding:"22px 18px 40px",width:"100%",maxWidth:480,maxHeight:"90vh",overflowY:"auto"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
                <div style={{flex:1,minWidth:0,paddingRight:10}}>
                  <div style={{fontSize:11,color:"#aaa"}}>{c.area} · 🚗 {c.drive}</div>
                  <div style={{fontSize:19,fontWeight:900,color:"#1B4332"}}>{c.name}</div>
                </div>
                <div style={{display:"flex",gap:6}}>
                  <button onClick={()=>setEditPlaceModal(isEditing?null:c.id)} style={{padding:"5px 10px",borderRadius:9,border:"2px solid #2D6A4F",background:"#fff",color:"#2D6A4F",fontSize:11,fontWeight:700,cursor:"pointer"}}>{isEditing?"취소":"✏️ 수정"}</button>
                  <button onClick={()=>setCampDetailModal(null)} style={{background:"#F0EDE8",border:"none",borderRadius:20,width:30,height:30,fontSize:15,cursor:"pointer"}}>✕</button>
                </div>
              </div>

              {/* 수정 폼 */}
              {isEditing&&(()=>{
                const edits=campEdits[c.id]||{};
                const [ef,setEf]=useState({name:c.name||"",area:c.area||"",drive:c.drive||"",desc:c.desc||"",hookup:!!c.hookup,reserve:!!c.reserve});
                return(
                  <div style={{background:"#F1F8E9",borderRadius:12,padding:"12px",marginBottom:12}}>
                    {[["name","이름"],["area","지역"],["drive","드라이브"]].map(([k,l])=>(
                      <div key={k} style={{marginBottom:8}}>
                        <div style={{fontSize:10,color:"#888",marginBottom:3}}>{l}</div>
                        <input value={ef[k]} onChange={e=>setEf(p=>({...p,[k]:e.target.value}))}
                          style={{width:"100%",padding:"7px 10px",borderRadius:8,border:"1px solid #ccc",fontSize:12,outline:"none",boxSizing:"border-box"}}/>
                      </div>
                    ))}
                    <textarea value={ef.desc} onChange={e=>setEf(p=>({...p,desc:e.target.value}))} placeholder="설명..."
                      style={{width:"100%",padding:"7px 10px",borderRadius:8,border:"1px solid #ccc",fontSize:12,outline:"none",resize:"none",minHeight:60,boxSizing:"border-box",marginBottom:8}}/>
                    <div style={{display:"flex",gap:10,marginBottom:8}}>
                      <label style={{display:"flex",alignItems:"center",gap:4,fontSize:12,cursor:"pointer"}}>
                        <input type="checkbox" checked={ef.hookup} onChange={e=>setEf(p=>({...p,hookup:e.target.checked}))} style={{accentColor:"#2D6A4F"}}/>훅업
                      </label>
                      <label style={{display:"flex",alignItems:"center",gap:4,fontSize:12,cursor:"pointer"}}>
                        <input type="checkbox" checked={ef.reserve} onChange={e=>setEf(p=>({...p,reserve:e.target.checked}))} style={{accentColor:"#2D6A4F"}}/>예약필요
                      </label>
                    </div>
                    <button onClick={()=>{
                      if(c.isMine) setMyPlaces(p=>p.map(x=>x.id===c.id?{...x,...ef}:x));
                      else setCampEdits(p=>({...p,[c.id]:ef}));
                      setCampDetailModal({...c,...ef});
                      setEditPlaceModal(null);
                    }} style={{width:"100%",padding:"9px",borderRadius:9,border:"none",background:"#2D6A4F",color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer"}}>저장</button>
                  </div>
                );
              })()}

              {/* 사진 */}
              {placePics["camp_"+c.id]?(
                <div style={{position:"relative",marginBottom:12}}>
                  <img src={placePics["camp_"+c.id]} alt={c.name} style={{width:"100%",height:180,objectFit:"cover",borderRadius:12}}/>
                  <button onClick={()=>setPlacePics(p=>{const n={...p};delete n["camp_"+c.id];return n;})} style={{position:"absolute",top:6,right:6,width:26,height:26,borderRadius:"50%",border:"none",background:"rgba(0,0,0,0.5)",color:"#fff",fontSize:13,cursor:"pointer"}}>✕</button>
                </div>
              ):(
                <label style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,padding:"10px",borderRadius:10,border:"2px dashed #ccc",background:"#F8F7F4",cursor:"pointer",marginBottom:12,fontSize:12,color:"#aaa"}}>
                  📷 사진 추가
                  <input type="file" accept="image/*" onChange={e=>handlePlacePic("camp_"+c.id,e.target.files[0])} style={{display:"none"}}/>
                </label>
              )}
              {/* 설명 */}
              {!isEditing&&c.desc&&<div style={{background:"#F1F8E9",borderRadius:11,padding:"10px 13px",marginBottom:12,fontSize:12,color:"#333",lineHeight:1.6}}>{c.desc}</div>}

              {/* 배지 */}
              <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:14}}>
                <CardBadge text={c.type||"tent"} color="#2D6A4F"/>
                {c.hookup&&<CardBadge text="훅업" color="#1565C0"/>}
                {c.reserve?<CardBadge text="예약필요" color="#F57F17"/>:<CardBadge text="예약불필요" color="#2E7D32"/>}
              </div>

              {/* 메모/일기 */}
              <div style={{background:"#F8F7F4",borderRadius:13,padding:"13px",marginBottom:12}}>
                <div style={{fontSize:12,fontWeight:700,color:"#2D6A4F",marginBottom:10}}>📓 내 메모 & 일기</div>
                <div style={{display:"flex",gap:8,marginBottom:10,alignItems:"center"}}>
                  <label style={{display:"flex",alignItems:"center",gap:5,cursor:"pointer",fontSize:12}}>
                    <input type="checkbox" checked={!!note.visited} onChange={e=>setCampNotes(p=>({...p,[c.id]:{...note,visited:e.target.checked}}))} style={{accentColor:"#2D6A4F",width:15,height:15}}/>
                    <span style={{fontWeight:600}}>✅ 다녀왔어요</span>
                  </label>
                  <input type="date" value={note.date||""} onChange={e=>setCampNotes(p=>({...p,[c.id]:{...note,date:e.target.value}}))}
                    style={{border:"1px solid #ddd",borderRadius:7,padding:"3px 7px",fontSize:11,outline:"none"}}/>
                </div>
                <div style={{display:"flex",gap:4,marginBottom:10}}>
                  {[1,2,3,4,5].map(n=>(
                    <button key={n} onClick={()=>setCampNotes(p=>({...p,[c.id]:{...note,rating:note.rating===n?0:n}}))} style={{background:"none",border:"none",fontSize:22,cursor:"pointer",padding:0,opacity:n<=(note.rating||0)?1:0.25}}>⭐</button>
                  ))}
                </div>
                <textarea value={note.note||""} onChange={e=>setCampNotes(p=>({...p,[c.id]:{...note,note:e.target.value}}))}
                  placeholder={`${c.name} 정보, 후기, 일기...

- 좋았던 사이트 번호
- 화장실/샤워 상태
- 아이들 반응
- 다음에 올 때 팁`}
                  style={{width:"100%",padding:"10px 12px",borderRadius:10,border:"2px solid #E0E0E0",fontSize:12,outline:"none",resize:"none",minHeight:120,boxSizing:"border-box",lineHeight:1.7,fontFamily:"'Noto Sans KR',sans-serif"}}/>
                {note.note&&<div style={{fontSize:10,color:"#aaa",marginTop:4,textAlign:"right"}}>자동 저장됨 ✓</div>}
              </div>

              <div style={{display:"flex",gap:8,marginBottom:8}}>
                <button onClick={()=>toggleCamp(c.id)} style={{flex:1,padding:"11px",borderRadius:11,border:"none",background:savedCamp.includes(c.id)?"#FFD54F":"#F0EDE8",color:savedCamp.includes(c.id)?"#2C2C2C":"#888",fontSize:12,fontWeight:700,cursor:"pointer"}}>
                  {savedCamp.includes(c.id)?"⭐ 저장됨":"☆ 가고 싶어요"}
                </button>
                {c.isMine&&<button onClick={()=>{if(window.confirm("삭제할까요?")){setMyPlaces(p=>p.filter(x=>x.id!==c.id));setCampDetailModal(null);}}} style={{padding:"11px 13px",borderRadius:11,border:"2px solid #FFEBEE",background:"#fff",color:"#C62828",fontSize:12,fontWeight:700,cursor:"pointer"}}>🗑️</button>}
              </div>
              <button onClick={()=>setCampDetailModal(null)} style={{width:"100%",padding:"12px",background:"#1B4332",color:"#fff",border:"none",borderRadius:11,fontSize:13,fontWeight:700,cursor:"pointer"}}>닫기</button>
            </div>
          </div>
        );
      })()}

      {/* ══ 새 캠핑장소 추가 모달 ══ */}
      {addPlaceModal&&(
        <div onClick={()=>setAddPlaceModal(false)} style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.55)",zIndex:1000,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
          <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:"20px 20px 0 0",padding:"22px 18px 40px",width:"100%",maxWidth:480,maxHeight:"85vh",overflowY:"auto"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <div style={{fontSize:17,fontWeight:900,color:"#1B4332"}}>📍 새 장소 추가</div>
              <button onClick={()=>setAddPlaceModal(false)} style={{background:"#F4F2F9",border:"none",borderRadius:20,width:30,height:30,fontSize:15,cursor:"pointer"}}>✕</button>
            </div>
            {[["name","장소 이름 *","예: 나만 아는 캠핑 스팟"],["area","지역","예: Sequoia NP"],["drive","드라이브 시간","예: 2h"]].map(([key,label,ph])=>(
              <div key={key} style={{marginBottom:10}}>
                <div style={{fontSize:11,fontWeight:700,color:"#666",marginBottom:4}}>{label}</div>
                <input value={placeForm[key]||""} onChange={e=>setPlaceForm(p=>({...p,[key]:e.target.value}))} placeholder={ph}
                  style={{width:"100%",padding:"9px 12px",borderRadius:9,border:"2px solid #E8E3DC",fontSize:13,outline:"none",boxSizing:"border-box"}}/>
              </div>
            ))}
            <div style={{marginBottom:10}}>
              <div style={{fontSize:11,fontWeight:700,color:"#666",marginBottom:4}}>설명/메모</div>
              <textarea value={placeForm.desc||""} onChange={e=>setPlaceForm(p=>({...p,desc:e.target.value}))} placeholder="자유롭게 메모..."
                style={{width:"100%",padding:"9px 12px",borderRadius:9,border:"2px solid #E8E3DC",fontSize:12,outline:"none",resize:"none",minHeight:70,boxSizing:"border-box"}}/>
            </div>
            <div style={{display:"flex",gap:12,marginBottom:14}}>
              <label style={{display:"flex",alignItems:"center",gap:5,cursor:"pointer",fontSize:12}}>
                <input type="checkbox" checked={!!placeForm.hookup} onChange={e=>setPlaceForm(p=>({...p,hookup:e.target.checked}))} style={{accentColor:"#2D6A4F"}}/>훅업
              </label>
              <label style={{display:"flex",alignItems:"center",gap:5,cursor:"pointer",fontSize:12}}>
                <input type="checkbox" checked={!!placeForm.reserve} onChange={e=>setPlaceForm(p=>({...p,reserve:e.target.checked}))} style={{accentColor:"#2D6A4F"}}/>예약필요
              </label>
            </div>
            <button onClick={()=>{
              if(!placeForm.name.trim()) return;
              const newPlace={...placeForm,id:"my_"+Date.now(),isMine:true};
              setMyPlaces(p=>[...p,newPlace]);
              setAddPlaceModal(false);
              setPlaceForm({name:"",area:"",drive:"",type:"tent/rv",hookup:false,reserve:false,desc:""});
            }} style={{width:"100%",padding:"13px",borderRadius:12,border:"none",background:"#2D6A4F",color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer"}}>저장</button>
          </div>
        </div>
      )}

      {/* ══ 캠핑 음식 상세+수정 모달 ══ */}
      {campFoodModal&&(()=>{
        const isEditing=editRecipeModal===campFoodModal.name;
        return(
          <div onClick={()=>{setCampFoodModal(null);setEditRecipeModal(null);}} style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.55)",zIndex:1000,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
            <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:"20px 20px 0 0",padding:"22px 18px 40px",width:"100%",maxWidth:480,maxHeight:"88vh",overflowY:"auto"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                <div>
                  <div style={{fontSize:11,color:"#aaa"}}>캠핑 레시피</div>
                  <div style={{fontSize:20,fontWeight:900,color:"#1B4332"}}>{campFoodModal.name}</div>
                </div>
                <div style={{display:"flex",gap:6}}>
                  <button onClick={()=>{
                    if(isEditing){setEditRecipeModal(null);}
                    else{setEditRecipeModal(campFoodModal.name);setEditRecipeForm({time:campFoodModal.time,recipe:campFoodModal.recipe});}
                  }} style={{padding:"5px 10px",borderRadius:9,border:"2px solid #C62828",background:"#fff",color:"#C62828",fontSize:11,fontWeight:700,cursor:"pointer"}}>{isEditing?"취소":"✏️ 수정"}</button>
                  <button onClick={()=>{setCampFoodModal(null);setEditRecipeModal(null);}} style={{background:"#F0EDE8",border:"none",borderRadius:20,width:30,height:30,fontSize:15,cursor:"pointer"}}>✕</button>
                </div>
              </div>

              {/* 사진 */}
              {placePics["food_"+campFoodModal.name]?(
                <div style={{position:"relative",marginBottom:12}}>
                  <img src={placePics["food_"+campFoodModal.name]} alt={campFoodModal.name} style={{width:"100%",height:160,objectFit:"cover",borderRadius:12}}/>
                  <button onClick={()=>setPlacePics(p=>{const n={...p};delete n["food_"+campFoodModal.name];return n;})} style={{position:"absolute",top:6,right:6,width:24,height:24,borderRadius:"50%",border:"none",background:"rgba(0,0,0,0.5)",color:"#fff",fontSize:12,cursor:"pointer"}}>✕</button>
                </div>
              ):(
                <label style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,padding:"10px",borderRadius:10,border:"2px dashed #ddd",background:"#F8F7F4",cursor:"pointer",marginBottom:12,fontSize:12,color:"#aaa"}}>
                  📷 사진 추가
                  <input type="file" accept="image/*" onChange={e=>handlePlacePic("food_"+campFoodModal.name,e.target.files[0])} style={{display:"none"}}/>
                </label>
              )}

              {/* 보기/수정 */}
              {!isEditing?(
                <>
                  <span style={{fontSize:11,background:"#FFEBEE",color:"#C62828",borderRadius:8,padding:"3px 10px",fontWeight:700}}>⏱ {campFoodModal.time}</span>
                  <div style={{background:"#F1F8E9",borderRadius:12,padding:"13px 14px",marginTop:10,marginBottom:14}}>
                    <div style={{fontSize:11,fontWeight:700,color:"#2D6A4F",marginBottom:6}}>👨‍🍳 레시피</div>
                    <div style={{fontSize:13,color:"#333",lineHeight:1.8}}>{campFoodModal.recipe}</div>
                  </div>
                  {recipeEdits[campFoodModal.name]&&(
                    <button onClick={()=>{setRecipeEdits(p=>{const n={...p};delete n[campFoodModal.name];return n;});setCampFoodModal(p=>p?{...p,...{time:CAMP_FOODS.flatMap(c=>c.foods).find(f=>f.name===p.name)||p}}:null);}} style={{width:"100%",padding:"9px",borderRadius:9,border:"2px solid #E8E3DC",background:"#fff",color:"#aaa",fontSize:11,fontWeight:700,cursor:"pointer",marginBottom:8}}>🔄 원래 레시피로</button>
                  )}
                </>
              ):(
                <div>
                  <div style={{marginBottom:10}}>
                    <div style={{fontSize:11,fontWeight:700,color:"#666",marginBottom:4}}>⏱ 조리 시간</div>
                    <input value={editRecipeForm.time} onChange={e=>setEditRecipeForm(p=>({...p,time:e.target.value}))}
                      style={{width:"100%",padding:"9px 12px",borderRadius:9,border:"2px solid #E8E3DC",fontSize:13,outline:"none",boxSizing:"border-box"}}/>
                  </div>
                  <div style={{marginBottom:12}}>
                    <div style={{fontSize:11,fontWeight:700,color:"#666",marginBottom:4}}>👨‍🍳 레시피</div>
                    <textarea value={editRecipeForm.recipe} onChange={e=>setEditRecipeForm(p=>({...p,recipe:e.target.value}))}
                      style={{width:"100%",padding:"9px 12px",borderRadius:9,border:"2px solid #E8E3DC",fontSize:12,outline:"none",resize:"none",minHeight:100,boxSizing:"border-box",lineHeight:1.7}}/>
                  </div>
                  <button onClick={()=>{
                    setRecipeEdits(p=>({...p,[campFoodModal.name]:editRecipeForm}));
                    setCampFoodModal(p=>p?{...p,...editRecipeForm}:null);
                    setEditRecipeModal(null);
                  }} style={{width:"100%",padding:"11px",borderRadius:10,border:"none",background:"#C62828",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer"}}>저장</button>
                </div>
              )}
              <button onClick={()=>{setCampFoodModal(null);setEditRecipeModal(null);}} style={{width:"100%",padding:"12px",background:"#1B4332",color:"#fff",border:"none",borderRadius:11,fontSize:13,fontWeight:700,cursor:"pointer",marginTop:6}}>닫기</button>
            </div>
          </div>
        );
      })()}

      {/* ══ BP 음식 상세+수정 모달 ══ */}
      {mealModal&&(()=>{
        const isEditing=editRecipeModal===("bp_"+mealModal.name);
        return(
          <div onClick={()=>{setMealModal(null);setEditRecipeModal(null);}} style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.55)",zIndex:1000,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
            <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:"20px 20px 0 0",padding:"22px 18px 40px",width:"100%",maxWidth:480,maxHeight:"88vh",overflowY:"auto"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                <div>
                  <div style={{fontSize:11,color:"#aaa"}}>백패킹 마른 음식</div>
                  <div style={{fontSize:19,fontWeight:900,color:"#1B4332"}}>{mealModal.name}</div>
                </div>
                <div style={{display:"flex",gap:6}}>
                  <button onClick={()=>{
                    if(isEditing){setEditRecipeModal(null);}
                    else{setEditRecipeModal("bp_"+mealModal.name);setEditRecipeForm({time:mealModal.time,recipe:mealModal.recipe});}
                  }} style={{padding:"5px 10px",borderRadius:9,border:"2px solid #2D6A4F",background:"#fff",color:"#2D6A4F",fontSize:11,fontWeight:700,cursor:"pointer"}}>{isEditing?"취소":"✏️ 수정"}</button>
                  <button onClick={()=>{setMealModal(null);setEditRecipeModal(null);}} style={{background:"#F0EDE8",border:"none",borderRadius:20,width:30,height:30,fontSize:15,cursor:"pointer"}}>✕</button>
                </div>
              </div>
              <div style={{display:"flex",gap:7,marginBottom:12}}>
                <span style={{fontSize:11,background:"#E8F5E9",color:"#2E7D32",borderRadius:8,padding:"3px 9px",fontWeight:700}}>⏱ {mealModal.time}</span>
                <span style={{fontSize:11,background:"#E3F2FD",color:"#1565C0",borderRadius:8,padding:"3px 9px",fontWeight:700}}>🥄 {mealModal.prep}</span>
                {recipeEdits["bp_"+mealModal.name]&&<span style={{fontSize:10,background:"#EDE7F6",color:"#7C5CBF",borderRadius:7,padding:"3px 8px",fontWeight:700}}>✏️ 수정됨</span>}
              </div>
              {!isEditing?(
                <>
                  <div style={{background:"#F1F8E9",borderRadius:12,padding:"12px 14px",marginBottom:10}}>
                    <div style={{fontSize:11,fontWeight:700,color:"#2D6A4F",marginBottom:5}}>📦 재료 & 준비</div>
                    <div style={{fontSize:13,color:"#333",lineHeight:1.7}}>{mealModal.recipe}</div>
                  </div>
                  {recipeEdits["bp_"+mealModal.name]&&(
                    <button onClick={()=>{setRecipeEdits(p=>{const n={...p};delete n["bp_"+mealModal.name];return n;});}} style={{width:"100%",padding:"8px",borderRadius:9,border:"2px solid #eee",background:"#fff",color:"#aaa",fontSize:11,fontWeight:700,cursor:"pointer",marginBottom:8}}>🔄 원래 레시피로</button>
                  )}
                </>
              ):(
                <div>
                  <div style={{marginBottom:10}}>
                    <div style={{fontSize:11,fontWeight:700,color:"#666",marginBottom:4}}>⏱ 조리 시간</div>
                    <input value={editRecipeForm.time} onChange={e=>setEditRecipeForm(p=>({...p,time:e.target.value}))}
                      style={{width:"100%",padding:"9px 12px",borderRadius:9,border:"2px solid #E8E3DC",fontSize:13,outline:"none",boxSizing:"border-box"}}/>
                  </div>
                  <div style={{marginBottom:12}}>
                    <div style={{fontSize:11,fontWeight:700,color:"#666",marginBottom:4}}>📦 레시피</div>
                    <textarea value={editRecipeForm.recipe} onChange={e=>setEditRecipeForm(p=>({...p,recipe:e.target.value}))}
                      style={{width:"100%",padding:"9px 12px",borderRadius:9,border:"2px solid #E8E3DC",fontSize:12,outline:"none",resize:"none",minHeight:100,boxSizing:"border-box",lineHeight:1.7}}/>
                  </div>
                  <button onClick={()=>{
                    setRecipeEdits(p=>({...p,["bp_"+mealModal.name]:editRecipeForm}));
                    setMealModal(p=>p?{...p,...editRecipeForm}:null);
                    setEditRecipeModal(null);
                  }} style={{width:"100%",padding:"11px",borderRadius:10,border:"none",background:"#2D6A4F",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer"}}>저장</button>
                </div>
              )}
              <button onClick={()=>{setMealModal(null);setEditRecipeModal(null);}} style={{width:"100%",padding:"12px",background:"#1B4332",color:"#fff",border:"none",borderRadius:11,fontSize:13,fontWeight:700,cursor:"pointer",marginTop:6}}>닫기</button>
            </div>
          </div>
        );
      })()}

      {/* ══ 백패킹 장소 상세/일기 모달 ══ */}
      {bpDetailModal&&(()=>{
        const b=bpDetailModal;
        const note=bpNotes[b.id]||{note:"",visited:false,date:"",rating:0};
        return(
          <div onClick={()=>setBpDetailModal(null)} style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.55)",zIndex:1000,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
            <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:"20px 20px 0 0",padding:"22px 18px 40px",width:"100%",maxWidth:480,maxHeight:"92vh",overflowY:"auto"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                <div style={{flex:1,paddingRight:10}}>
                  <div style={{fontSize:10,color:"#aaa"}}>{b.area} · 🚗 {b.drive} · {b.miles}mi</div>
                  <div style={{fontSize:18,fontWeight:900,color:"#1B4332"}}>{b.name}</div>
                </div>
                <button onClick={()=>setBpDetailModal(null)} style={{background:"#F0EDE8",border:"none",borderRadius:20,width:30,height:30,fontSize:15,cursor:"pointer"}}>✕</button>
              </div>

              {/* 장소 사진 */}
              {placePics["bp_"+b.id]?(
                <div style={{position:"relative",marginBottom:12}}>
                  <img src={placePics["bp_"+b.id]} alt={b.name} onClick={()=>setPlacePics(p=>({...p,["bp_"+b.id+"_view"]:true}))} style={{width:"100%",height:180,objectFit:"cover",borderRadius:12,cursor:"pointer"}}/>
                  <button onClick={()=>setPlacePics(p=>{const n={...p};delete n["bp_"+b.id];return n;})} style={{position:"absolute",top:6,right:6,width:26,height:26,borderRadius:"50%",border:"none",background:"rgba(0,0,0,0.5)",color:"#fff",fontSize:13,cursor:"pointer"}}>✕</button>
                </div>
              ):(
                <label style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,padding:"11px",borderRadius:10,border:"2px dashed #ccc",background:"#F8F7F4",cursor:"pointer",marginBottom:12,fontSize:12,color:"#aaa"}}>
                  📷 사진 추가
                  <input type="file" accept="image/*" onChange={e=>handlePlacePic("bp_"+b.id,e.target.files[0])} style={{display:"none"}}/>
                </label>
              )}

              {/* 배지 */}
              <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:12}}>
                <CardBadge text={diffLabel[b.difficulty]} color={diffColor[b.difficulty]}/>
                <CardBadge text={b.duration} color="#1565C0"/>
                <CardBadge text={`${b.miles}mi`} color="#555"/>
                {b.permit==="required"&&<CardBadge text="퍼밋필요" color="#C62828"/>}
              </div>

              {/* 기본 설명 */}
              <div style={{background:"#F1F8E9",borderRadius:11,padding:"10px 13px",marginBottom:14,fontSize:12,color:"#333",lineHeight:1.6}}>{b.desc}</div>

              {/* 일기/메모 */}
              <div style={{background:"#F8F7F4",borderRadius:13,padding:"13px",marginBottom:12}}>
                <div style={{fontSize:12,fontWeight:700,color:"#2D6A4F",marginBottom:10}}>📓 내 메모 & 일기</div>
                <div style={{display:"flex",gap:8,marginBottom:10,alignItems:"center",flexWrap:"wrap"}}>
                  <label style={{display:"flex",alignItems:"center",gap:5,cursor:"pointer",fontSize:12}}>
                    <input type="checkbox" checked={!!note.visited} onChange={e=>setBpNotes(p=>({...p,[b.id]:{...note,visited:e.target.checked}}))} style={{accentColor:"#2D6A4F",width:15,height:15}}/>
                    <span style={{fontWeight:600}}>✅ 다녀왔어요</span>
                  </label>
                  <input type="date" value={note.date||""} onChange={e=>setBpNotes(p=>({...p,[b.id]:{...note,date:e.target.value}}))}
                    style={{border:"1px solid #ddd",borderRadius:7,padding:"3px 7px",fontSize:11,outline:"none"}}/>
                </div>
                <div style={{display:"flex",gap:4,marginBottom:10}}>
                  {[1,2,3,4,5].map(n=>(
                    <button key={n} onClick={()=>setBpNotes(p=>({...p,[b.id]:{...note,rating:note.rating===n?0:n}}))} style={{background:"none",border:"none",fontSize:22,cursor:"pointer",padding:0,opacity:n<=(note.rating||0)?1:0.25}}>⭐</button>
                  ))}
                </div>
                <textarea value={note.note||""} onChange={e=>setBpNotes(p=>({...p,[b.id]:{...note,note:e.target.value}}))}
                  placeholder={`${b.name} 백패킹 일기...

- 트레일 상태
- 캠핑 스팟 추천
- 날씨 / 곰 통 필요 여부
- 같이 간 사람들
- 잊지 못할 순간`}
                  style={{width:"100%",padding:"10px 12px",borderRadius:10,border:"2px solid #E0E0E0",fontSize:12,outline:"none",resize:"none",minHeight:130,boxSizing:"border-box",lineHeight:1.7,fontFamily:"'Noto Sans KR',sans-serif"}}/>
                {note.note&&<div style={{fontSize:10,color:"#aaa",marginTop:4,textAlign:"right"}}>자동 저장됨 ✓</div>}
              </div>

              <button onClick={()=>{toggleBP(b.id);}} style={{width:"100%",padding:"11px",borderRadius:11,border:"none",background:savedBP.includes(b.id)?"#FFD54F":"#F0EDE8",color:savedBP.includes(b.id)?"#2C2C2C":"#888",fontSize:12,fontWeight:700,cursor:"pointer",marginBottom:8}}>
                {savedBP.includes(b.id)?"⭐ 저장됨":"☆ 가고 싶어요"}
              </button>
              <button onClick={()=>setBpDetailModal(null)} style={{width:"100%",padding:"12px",background:"#1B4332",color:"#fff",border:"none",borderRadius:11,fontSize:13,fontWeight:700,cursor:"pointer"}}>닫기</button>
            </div>
          </div>
        );
      })()}

      {/* ══ 음식 추가 모달 ══ */}
      {addFoodModal&&(
        <div onClick={()=>setAddFoodModal(null)} style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.55)",zIndex:1000,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
          <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:"20px 20px 0 0",padding:"22px 18px 40px",width:"100%",maxWidth:480,maxHeight:"88vh",overflowY:"auto"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <div style={{fontSize:17,fontWeight:900,color:"#1B4332"}}>{addFoodModal==="campfood"?"🔥 캠핑 음식 추가":"🎒 백패킹 음식 추가"}</div>
              <button onClick={()=>setAddFoodModal(null)} style={{background:"#F4F2F9",border:"none",borderRadius:20,width:30,height:30,fontSize:15,cursor:"pointer"}}>✕</button>
            </div>
            <div style={{marginBottom:10}}>
              <div style={{fontSize:11,fontWeight:700,color:"#666",marginBottom:4}}>음식 이름 *</div>
              <input value={foodForm.name} onChange={e=>setFoodForm(p=>({...p,name:e.target.value}))} placeholder="예: 된장 파스타"
                style={{width:"100%",padding:"10px 12px",borderRadius:9,border:"2px solid #E8E3DC",fontSize:14,fontWeight:700,outline:"none",boxSizing:"border-box"}}/>
            </div>
            <div style={{marginBottom:10}}>
              <div style={{fontSize:11,fontWeight:700,color:"#666",marginBottom:4}}>조리 시간</div>
              <input value={foodForm.time} onChange={e=>setFoodForm(p=>({...p,time:e.target.value}))} placeholder="예: 15분"
                style={{width:"100%",padding:"9px 12px",borderRadius:9,border:"2px solid #E8E3DC",fontSize:13,outline:"none",boxSizing:"border-box"}}/>
            </div>
            <div style={{marginBottom:14}}>
              <div style={{fontSize:11,fontWeight:700,color:"#666",marginBottom:4}}>레시피 / 준비 방법</div>
              <textarea value={foodForm.recipe} onChange={e=>setFoodForm(p=>({...p,recipe:e.target.value}))} placeholder="재료, 만드는 방법을 자유롭게..."
                style={{width:"100%",padding:"9px 12px",borderRadius:9,border:"2px solid #E8E3DC",fontSize:12,outline:"none",resize:"none",minHeight:80,boxSizing:"border-box",lineHeight:1.7}}/>
            </div>
            <button onClick={()=>{
              if(!foodForm.name.trim()) return;
              const newItem={name:foodForm.name,time:foodForm.time||"?",recipe:foodForm.recipe||"직접 레시피 입력",prep:"직접 준비"};
              setCustomFoodItems(p=>({...p,[addFoodModal]:[...(p[addFoodModal]||[]),newItem]}));
              setFoodForm({name:"",time:"",recipe:"",cat:""});
              setAddFoodModal(null);
            }} style={{width:"100%",padding:"13px",borderRadius:12,border:"none",background:"#2D6A4F",color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer"}}>저장</button>
          </div>
        </div>
      )}
    </div>
  );
}
