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

// ── 미국 국립공원 63개 ─────────────────────────────────
const NATIONAL_PARKS = [
  // CALIFORNIA (프레즈노 근처 먼저)
  {id:1,name:"Yosemite",state:"CA",drive:"3h",est:1890,size:"1,169 sq mi",address:"Yosemite Valley, CA 95389",fee:"$35/차량",season:"연중",highlight:"하프돔, 요세미티 폭포, 글레이셔 포인트",website:"nps.gov/yose",lat:37.8651,lng:-119.5383,region:"West"},
  {id:2,name:"Sequoia",state:"CA",drive:"1.5h",est:1890,size:"631 sq mi",address:"47050 Generals Hwy, Three Rivers, CA 93271",fee:"$35/차량",season:"연중 (일부 겨울 폐쇄)",highlight:"세계 최대 나무 General Sherman, Moro Rock",website:"nps.gov/sequ",lat:36.4864,lng:-118.5658,region:"West"},
  {id:3,name:"Kings Canyon",state:"CA",drive:"2h",est:1940,size:"722 sq mi",address:"74485 CA-180, Sanger, CA 93657",fee:"$35/차량",season:"연중 (일부 겨울 폐쇄)",highlight:"킹스 캐니언 협곡, 제너럴 그랜트 트리",website:"nps.gov/kica",lat:36.8879,lng:-118.5551,region:"West"},
  {id:4,name:"Pinnacles",state:"CA",drive:"3.5h",est:2013,size:"42 sq mi",address:"5000 CA-146, Paicines, CA 95043",fee:"$30/차량",season:"연중 (여름 더움)",highlight:"암석 지형, 캘리포니아 콘도르, 동굴",website:"nps.gov/pinn",lat:36.4906,lng:-121.1825,region:"West"},
  {id:5,name:"Death Valley",state:"CA/NV",drive:"4h",est:1994,size:"5,270 sq mi",address:"Furnace Creek, CA 92328",fee:"$30/차량",season:"10~4월 권장 (여름 극열)",highlight:"Badwater Basin, Zabriskie Point, 사막 경관",website:"nps.gov/deva",lat:36.5054,lng:-117.0794,region:"West"},
  {id:6,name:"Joshua Tree",state:"CA",drive:"4.5h",est:1994,size:"1,235 sq mi",address:"74485 National Park Dr, Twentynine Palms, CA 92277",fee:"$30/차량",season:"10~5월 권장",highlight:"조슈아 트리, 암석 클라이밍, 별밤",website:"nps.gov/jotr",lat:33.8734,lng:-115.9010,region:"West"},
  {id:7,name:"Channel Islands",state:"CA",drive:"4h",est:1980,size:"390 sq mi",address:"1901 Spinnaker Dr, Ventura, CA 93001",fee:"보트 페리 별도",season:"연중",highlight:"산타크루즈 아일랜드, 바다사자, 스노클링",website:"nps.gov/chis",lat:34.0069,lng:-119.7785,region:"West"},
  {id:8,name:"Redwood",state:"CA",drive:"5h+",est:1968,size:"207 sq mi",address:"1111 2nd St, Crescent City, CA 95531",fee:"무료",season:"연중",highlight:"세계 최고 나무, 원시 해안선",website:"nps.gov/redw",lat:41.2132,lng:-124.0046,region:"West"},
  {id:9,name:"Lassen Volcanic",state:"CA",drive:"4.5h",est:1916,size:"166 sq mi",address:"Mineral, CA 96063",fee:"$30/차량",season:"6~10월 권장",highlight:"활화산 지형, 열수 웅덩이, Bumpass Hell",website:"nps.gov/lavo",lat:40.4977,lng:-121.4207,region:"West"},
  {id:10,name:"Point Reyes",state:"CA",drive:"4h",est:1962,size:"110 sq mi",address:"1 Bear Valley Rd, Point Reyes Station, CA 94956",fee:"무료",season:"연중",highlight:"등대, 철새 관찰, 해안 하이킹",website:"nps.gov/pore",lat:38.0554,lng:-122.8008,region:"West"},
  // SOUTHWEST
  {id:11,name:"Grand Canyon",state:"AZ",drive:"7h",est:1919,size:"1,904 sq mi",address:"Grand Canyon Village, AZ 86023",fee:"$35/차량",season:"연중 (South Rim), 5~11월 (North Rim)",highlight:"사우스 림, 노스 림, 래프팅, 림투림",website:"nps.gov/grca",lat:36.0544,lng:-112.1401,region:"Southwest"},
  {id:12,name:"Zion",state:"UT",drive:"7h",est:1919,size:"229 sq mi",address:"Springdale, UT 84767",fee:"$35/차량",season:"연중 (봄가을 최고)",highlight:"The Narrows, Angels Landing, Emerald Pools",website:"nps.gov/zion",lat:37.2982,lng:-113.0263,region:"Southwest"},
  {id:13,name:"Bryce Canyon",state:"UT",drive:"8h",est:1928,size:"56 sq mi",address:"Bryce Canyon City, UT 84764",fee:"$35/차량",season:"4~10월 (겨울 설경도 아름다움)",highlight:"후두 암석 지형, 별밤, Sunrise/Sunset Point",website:"nps.gov/brca",lat:37.5930,lng:-112.1871,region:"Southwest"},
  {id:14,name:"Arches",state:"UT",drive:"8h",est:1971,size:"119 sq mi",address:"Moab, UT 84532",fee:"$30/차량",season:"3~5월, 9~11월 최고",highlight:"Delicate Arch, Landscape Arch, 아치 군락",website:"nps.gov/arch",lat:38.7331,lng:-109.5925,region:"Southwest"},
  {id:15,name:"Canyonlands",state:"UT",drive:"9h",est:1964,size:"527 sq mi",address:"Moab, UT 84532",fee:"$30/차량",season:"3~5월, 9~11월 최고",highlight:"Island in the Sky, The Needles, 협곡 전망",website:"nps.gov/cany",lat:38.2000,lng:-109.9289,region:"Southwest"},
  {id:16,name:"Capitol Reef",state:"UT",drive:"9h",est:1971,size:"378 sq mi",address:"Torrey, UT 84775",fee:"$20/차량",season:"연중",highlight:"Waterpocket Fold, 과수원, 암석 지형",website:"nps.gov/care",lat:38.2896,lng:-111.2615,region:"Southwest"},
  {id:17,name:"Mesa Verde",state:"CO",drive:"10h",est:1906,size:"81 sq mi",address:"Mesa Verde, CO 81330",fee:"$25/차량",season:"연중 (주요 투어는 봄~가을)",highlight:"절벽 주거 유적, 푸에블로 문화",website:"nps.gov/meve",lat:37.1835,lng:-108.4912,region:"Southwest"},
  {id:18,name:"Saguaro",state:"AZ",drive:"8h",est:1994,size:"143 sq mi",address:"3693 S Old Spanish Trail, Tucson, AZ 85730",fee:"$25/차량",season:"10~4월 권장",highlight:"거대 사와로 선인장 숲, 사막 생태",website:"nps.gov/sagu",lat:32.2967,lng:-111.1666,region:"Southwest"},
  {id:19,name:"Petrified Forest",state:"AZ",drive:"8h",est:1962,size:"346 sq mi",address:"1 Park Rd, Petrified Forest, AZ 86028",fee:"$25/차량",season:"연중",highlight:"화석 나무, 페인티드 데저트",website:"nps.gov/pefo",lat:35.0655,lng:-109.7799,region:"Southwest"},
  {id:20,name:"White Sands",state:"NM",drive:"10h",est:2019,size:"227 sq mi",address:"19955 US-70, Alamogordo, NM 88310",fee:"$25/차량",season:"연중 (여름 이른 아침/저녁)",highlight:"흰 석고 모래 언덕, 일몰",website:"nps.gov/whsa",lat:32.7872,lng:-106.3256,region:"Southwest"},
  {id:21,name:"Carlsbad Caverns",state:"NM",drive:"11h",est:1930,size:"73 sq mi",address:"727 Carlsbad Caverns Hwy, Carlsbad, NM 88220",fee:"$15/인",season:"연중",highlight:"거대 석회동굴, 박쥐 비행",website:"nps.gov/cave",lat:32.1479,lng:-104.5567,region:"Southwest"},
  {id:22,name:"Guadalupe Mountains",state:"TX",drive:"12h",est:1966,size:"135 sq mi",address:"400 Pine Canyon Rd, Salt Flat, TX 79847",fee:"$15/인",season:"연중 (봄가을 최고)",highlight:"텍사스 최고봉, 화석 암초",website:"nps.gov/gumo",lat:31.9231,lng:-104.8714,region:"Southwest"},
  {id:23,name:"Big Bend",state:"TX",drive:"14h",est:1944,size:"1,252 sq mi",address:"Big Bend National Park, TX 79834",fee:"$30/차량",season:"10~4월 권장",highlight:"리오그란데 협곡, 사막+산악 조합",website:"nps.gov/bibe",lat:29.2498,lng:-103.2502,region:"Southwest"},
  // ROCKY MOUNTAINS
  {id:24,name:"Rocky Mountain",state:"CO",drive:"12h",est:1915,size:"415 sq mi",address:"1000 US-36, Estes Park, CO 80517",fee:"$35/차량",season:"6~9월 (Trail Ridge Rd)",highlight:"Trail Ridge Road, 무스, 알파인 초원",website:"nps.gov/romo",lat:40.3428,lng:-105.6836,region:"Rocky Mountains"},
  {id:25,name:"Great Sand Dunes",state:"CO",drive:"11h",est:2004,size:"149 sq mi",address:"11999 CO-150, Mosca, CO 81146",fee:"$25/차량",season:"연중 (봄 개울 있음)",highlight:"미국 최고 모래 언덕, 사막+산 배경",website:"nps.gov/grsa",lat:37.7331,lng:-105.5943,region:"Rocky Mountains"},
  {id:26,name:"Yellowstone",state:"WY/MT/ID",drive:"13h",est:1872,size:"3,468 sq mi",address:"Yellowstone National Park, WY 82190",fee:"$35/차량",season:"5~10월 (일부 연중)",highlight:"Old Faithful, 그랜드 프리즈매틱, 곰, 들소",website:"nps.gov/yell",lat:44.4280,lng:-110.5885,region:"Rocky Mountains"},
  {id:27,name:"Grand Teton",state:"WY",drive:"13h",est:1929,size:"484 sq mi",address:"Moose, WY 83012",fee:"$35/차량",season:"5~10월",highlight:"테톤 봉우리, 잭슨 레이크, 와일드라이프",website:"nps.gov/grte",lat:43.7904,lng:-110.6818,region:"Rocky Mountains"},
  {id:28,name:"Glacier",state:"MT",drive:"15h",est:1910,size:"1,013 sq mi",address:"West Glacier, MT 59936",fee:"$35/차량",season:"6~9월",highlight:"Going-to-the-Sun Road, 빙하, 로키산맥",website:"nps.gov/glac",lat:48.7596,lng:-113.7870,region:"Rocky Mountains"},
  {id:29,name:"Wind Cave",state:"SD",drive:"16h",est:1903,size:"53 sq mi",address:"26611 US-385, Hot Springs, SD 57747",fee:"$10/투어",season:"연중",highlight:"복잡한 석회동굴, 들소 초원",website:"nps.gov/wica",lat:43.5569,lng:-103.4783,region:"Rocky Mountains"},
  {id:30,name:"Badlands",state:"SD",drive:"17h",est:1978,size:"379 sq mi",address:"25216 Ben Reifel Rd, Interior, SD 57750",fee:"$30/차량",season:"연중 (여름 극열 주의)",highlight:"침식 지형, 화석, 들소, 별밤",website:"nps.gov/badl",lat:43.8554,lng:-102.3397,region:"Rocky Mountains"},
  // PACIFIC NORTHWEST
  {id:31,name:"Olympic",state:"WA",drive:"13h",est:1938,size:"1,442 sq mi",address:"3002 Mount Angeles Rd, Port Angeles, WA 98362",fee:"$30/차량",season:"연중 (우기 주의)",highlight:"온대우림, 후안데푸카 해안, 허리케인 릿지",website:"nps.gov/olym",lat:47.8021,lng:-123.6044,region:"Pacific Northwest"},
  {id:32,name:"Mount Rainier",state:"WA",drive:"13h",est:1899,size:"369 sq mi",address:"Ashford, WA 98304",fee:"$30/차량",season:"7~9월 (정상 등반)",highlight:"레이니어 화산, 고산 꽃밭, 빙하",website:"nps.gov/mora",lat:46.8800,lng:-121.7269,region:"Pacific Northwest"},
  {id:33,name:"North Cascades",state:"WA",drive:"13h",est:1968,size:"789 sq mi",address:"810 State Route 20, Sedro-Woolley, WA 98284",fee:"무료",season:"6~9월",highlight:"빙하, 알파인 레이크, 원시 자연",website:"nps.gov/noca",lat:48.7718,lng:-121.2985,region:"Pacific Northwest"},
  {id:34,name:"Crater Lake",state:"OR",drive:"5h",est:1902,size:"286 sq mi",address:"1 Sims Loop, Crater Lake, OR 97604",fee:"$30/차량",season:"7~9월 (Rim Drive)",highlight:"세계 가장 맑은 호수, 칼데라 전망",website:"nps.gov/crla",lat:42.9446,lng:-122.1090,region:"Pacific Northwest"},
  // ALASKA
  {id:35,name:"Denali",state:"AK",drive:"비행기",est:1917,size:"9,492 sq mi",address:"Denali Park Rd, Denali Park, AK 99755",fee:"$15/인",season:"5~9월",highlight:"미국 최고봉 20,310ft, 알래스카 야생동물",website:"nps.gov/dena",lat:63.1148,lng:-151.1926,region:"Alaska"},
  {id:36,name:"Glacier Bay",state:"AK",drive:"비행기",est:1980,size:"5,037 sq mi",address:"Gustavus, AK 99826",fee:"무료",season:"5~9월",highlight:"조수 빙하, 혹등고래, 빙하 트레킹",website:"nps.gov/glba",lat:58.6658,lng:-136.9000,region:"Alaska"},
  {id:37,name:"Kenai Fjords",state:"AK",drive:"비행기",est:1980,size:"1,047 sq mi",address:"1212 4th Ave, Seward, AK 99664",fee:"무료",season:"5~9월",highlight:"피요르드, 빙하, 바다 조류",website:"nps.gov/kefj",lat:59.9210,lng:-149.6511,region:"Alaska"},
  {id:38,name:"Katmai",state:"AK",drive:"비행기",est:1980,size:"6,395 sq mi",address:"King Salmon, AK 99613",fee:"무료",season:"7~9월 (곰 관찰)",highlight:"브룩스 폭포 곰 연어 사냥, 화산",website:"nps.gov/katm",lat:58.5,lng:-155.0,region:"Alaska"},
  {id:39,name:"Wrangell-St. Elias",state:"AK",drive:"비행기",est:1980,size:"20,587 sq mi",address:"Copper Center, AK 99573",fee:"무료",season:"6~9월",highlight:"미국 최대 국립공원, 빙하, 황야",website:"nps.gov/wrst",lat:61.7,lng:-142.9,region:"Alaska"},
  // HAWAII
  {id:40,name:"Hawaii Volcanoes",state:"HI",drive:"비행기",est:1916,size:"505 sq mi",address:"1 Crater Rim Dr, Hawaii National Park, HI 96718",fee:"$30/차량",season:"연중",highlight:"활화산, 용암 흐름, 킬라우에아",website:"nps.gov/havo",lat:19.4194,lng:-155.2885,region:"Hawaii"},
  {id:41,name:"Haleakala",state:"HI",drive:"비행기",est:1916,size:"52 sq mi",address:"Haleakala Hwy, Kula, HI 96790",fee:"$30/차량",season:"연중",highlight:"화산 분화구, 일출, 실버소드 식물",website:"nps.gov/hale",lat:20.7097,lng:-156.1548,region:"Hawaii"},
  // SOUTHEAST
  {id:42,name:"Great Smoky Mountains",state:"TN/NC",drive:"비행기+차",est:1934,size:"816 sq mi",address:"107 Park Headquarters Rd, Gatlinburg, TN 37738",fee:"무료 (미국 유일)",season:"연중",highlight:"안개 산, 가을 단풍, 흑곰, 폭포",website:"nps.gov/grsm",lat:35.6118,lng:-83.4895,region:"Southeast"},
  {id:43,name:"Shenandoah",state:"VA",drive:"비행기+차",est:1935,size:"311 sq mi",address:"3655 US-211 E, Luray, VA 22835",fee:"$30/차량",season:"연중",highlight:"스카이라인 드라이브, 가을 단풍, 폭포",website:"nps.gov/shen",lat:38.7006,lng:-78.2953,region:"Southeast"},
  {id:44,name:"Everglades",state:"FL",drive:"비행기+차",est:1934,size:"2,357 sq mi",address:"40001 FL-9336, Homestead, FL 33034",fee:"$35/차량",season:"11~4월 (우기 피하기)",highlight:"악어, 매너티, 독특한 습지 생태",website:"nps.gov/ever",lat:25.2866,lng:-80.8987,region:"Southeast"},
  {id:45,name:"Biscayne",state:"FL",drive:"비행기+차",est:1980,size:"270 sq mi",address:"9700 SW 328th St, Homestead, FL 33033",fee:"무료",season:"연중",highlight:"산호초, 스노클링, 클리어워터",website:"nps.gov/bisc",lat:25.4824,lng:-80.4382,region:"Southeast"},
  {id:46,name:"Dry Tortugas",state:"FL",drive:"비행기/보트",est:1992,size:"101 sq mi",address:"Key West, FL 33040",fee:"$15/인",season:"연중",highlight:"포트 제퍼슨 요새, 산호초, 고립된 아름다움",website:"nps.gov/drto",lat:24.6285,lng:-82.8732,region:"Southeast"},
  {id:47,name:"Congaree",state:"SC",drive:"비행기+차",est:2003,size:"41 sq mi",address:"100 National Park Rd, Hopkins, SC 29061",fee:"무료",season:"연중",highlight:"원시 침수림, 형광 반딧불이",website:"nps.gov/cong",lat:33.7948,lng:-80.7854,region:"Southeast"},
  {id:48,name:"Mammoth Cave",state:"KY",drive:"비행기+차",est:1941,size:"82 sq mi",address:"1 Mammoth Cave Pkwy, Mammoth Cave, KY 42259",fee:"$5~25/투어",season:"연중",highlight:"세계 최장 동굴 시스템",website:"nps.gov/maca",lat:37.1878,lng:-86.1006,region:"Southeast"},
  // NORTHEAST & MIDWEST
  {id:49,name:"Acadia",state:"ME",drive:"비행기+차",est:1919,size:"76 sq mi",address:"Eagle Lake Rd, Bar Harbor, ME 04609",fee:"$35/차량",season:"6~10월",highlight:"카디약 마운틴 일출, 해안 드라이브, 가을 단풍",website:"nps.gov/acad",lat:44.3386,lng:-68.2733,region:"Northeast"},
  {id:50,name:"Cuyahoga Valley",state:"OH",drive:"비행기+차",est:2000,size:"51 sq mi",address:"15610 Vaughn Rd, Brecksville, OH 44141",fee:"무료",season:"연중",highlight:"운하, 폭포, 기차 여행",website:"nps.gov/cuva",lat:41.2808,lng:-81.5678,region:"Northeast"},
  {id:51,name:"Indiana Dunes",state:"IN",drive:"비행기+차",est:2019,size:"24 sq mi",address:"1100 N Mineral Springs Rd, Porter, IN 46304",fee:"무료",season:"연중",highlight:"미시간 레이크 해변 모래 언덕",website:"nps.gov/indu",lat:41.6535,lng:-87.0524,region:"Northeast"},
  {id:52,name:"Isle Royale",state:"MI",drive:"비행기+보트",est:1940,size:"894 sq mi",address:"800 E Lakeshore Dr, Houghton, MI 49931",fee:"$7/일",season:"4~10월",highlight:"미시간 호 섬, 늑대·무스 생태",website:"nps.gov/isro",lat:48.0,lng:-88.8333,region:"Northeast"},
  {id:53,name:"Voyageurs",state:"MN",drive:"비행기+차",est:1975,size:"341 sq mi",address:"360 MN-11, International Falls, MN 56649",fee:"무료",season:"6~9월",highlight:"수상 국립공원, 보트 필수, 오로라",website:"nps.gov/voya",lat:48.4839,lng:-92.8282,region:"Northeast"},
  {id:54,name:"New River Gorge",state:"WV",drive:"비행기+차",est:2020,size:"113 sq mi",address:"104 Main St E, Glen Jean, WV 25846",fee:"무료",season:"연중",highlight:"웨스트버지니아 협곡, 암벽 등반, 래프팅",website:"nps.gov/neri",lat:37.8726,lng:-81.0798,region:"Northeast"},
  {id:55,name:"Shenandoah",state:"VA",drive:"비행기+차",est:1935,size:"311 sq mi",address:"3655 US-211 E, Luray, VA 22835",fee:"$30/차량",season:"연중",highlight:"스카이라인 드라이브, 폭포, 단풍",website:"nps.gov/shen",lat:38.7006,lng:-78.2953,region:"Northeast"},
  // MIDWEST PLAINS
  {id:56,name:"Theodore Roosevelt",state:"ND",drive:"비행기+차",est:1978,size:"110 sq mi",address:"315 2nd Ave, Medora, ND 58645",fee:"$30/차량",season:"연중",highlight:"배드랜즈, 들소, 루스벨트 오두막",website:"nps.gov/thro",lat:46.9791,lng:-103.5387,region:"Midwest"},
  {id:57,name:"Sleeping Bear Dunes",state:"MI",drive:"비행기+차",est:1970,size:"110 sq mi",address:"9922 Front St, Empire, MI 49630",fee:"$25/차량",season:"5~10월",highlight:"호수 위 모래 언덕, 미시간 호",website:"nps.gov/slbe",lat:44.8811,lng:-86.0567,region:"Midwest"},
  // US TERRITORIES
  {id:58,name:"Virgin Islands",state:"USVI",drive:"비행기",est:1956,size:"23 sq mi",address:"1300 Cruz Bay Creek, St. John, VI 00830",fee:"무료",season:"연중",highlight:"트렁크 베이 산호초, 카리브해 해변",website:"nps.gov/viis",lat:18.3417,lng:-64.7366,region:"Caribbean"},
  {id:59,name:"American Samoa",state:"AS",drive:"비행기",est:1988,size:"21 sq mi",address:"Pago Pago, AS 96799",fee:"무료",season:"연중",highlight:"남태평양 유일 국립공원, 산호초",website:"nps.gov/npsa",lat:-14.2592,lng:-170.6832,region:"Pacific Islands"},
  // ADDITIONAL PARKS
  {id:60,name:"Hot Springs",state:"AR",drive:"비행기+차",est:1921,size:"9 sq mi",address:"101 Reserve St, Hot Springs, AR 71901",fee:"무료",season:"연중",highlight:"천연 온천, 역사적 배스하우스",website:"nps.gov/hosp",lat:34.5217,lng:-93.0426,region:"Southeast"},
  {id:61,name:"Gateway Arch",state:"MO",drive:"비행기+차",est:2018,size:"0.14 sq mi",address:"11 N 4th St, St. Louis, MO 63102",fee:"$3~15",season:"연중",highlight:"게이트웨이 아치, 미시시피 강변",website:"nps.gov/jeff",lat:38.6247,lng:-90.1848,region:"Midwest"},
  {id:62,name:"Cuyahoga Valley",state:"OH",drive:"비행기+차",est:2000,size:"51 sq mi",address:"15610 Vaughn Rd, Brecksville, OH 44141",fee:"무료",season:"연중",highlight:"운하 역사, 폭포, 사이클링",website:"nps.gov/cuva",lat:41.2808,lng:-81.5678,region:"Midwest"},
  {id:63,name:"National Park of American Samoa",state:"AS",drive:"비행기",est:1988,size:"21 sq mi",address:"Pago Pago, AS 96799",fee:"무료",season:"연중",highlight:"남태평양 열대우림, 과일박쥐",website:"nps.gov/npsa",lat:-14.2592,lng:-170.6832,region:"Pacific Islands"},
];

const REGIONS = ["전체","West","Southwest","Rocky Mountains","Pacific Northwest","Alaska","Hawaii","Southeast","Northeast","Midwest","Caribbean","Pacific Islands"];
const REGION_COLORS = {"West":"#1565C0","Southwest":"#E65100","Rocky Mountains":"#6A1B9A","Pacific Northwest":"#2E7D32","Alaska":"#37474F","Hawaii":"#00695C","Southeast":"#C62828","Northeast":"#4E342E","Midwest":"#F57F17","Caribbean":"#006064","Pacific Islands":"#1B5E20"};


// ── 데이터 ─────────────────────────────────────────────

const STATE_PARKS = [
  {id:"sp1",name:"Big Sur State Parks",area:"Central Coast",drive:"4h",desc:"판도사폭포, 줄리아 파이퍼 번스, 절벽 해안선",highlight:"맥웨이 폭포, 해안 드라이브",fee:"$10",season:"연중",kids:true,tags:["자연","해안","하이킹"]},
  {id:"sp2",name:"Point Lobos State Reserve",area:"Carmel",drive:"4h",desc:"해달, 바다사자, 크리스탈 코브",highlight:"Sea Lion Point, Bird Island Trail",fee:"$10",season:"연중",kids:true,tags:["자연","해양","하이킹"]},
  {id:"sp3",name:"Pfeiffer Big Sur SP",area:"Big Sur",drive:"4h",desc:"레드우드 숲, 빅서 강변 캠핑",highlight:"Valley View Trail, 강수영",fee:"$10",season:"연중",kids:true,tags:["캠핑","자연","가족"]},
  {id:"sp4",name:"Hearst San Simeon SP",area:"San Simeon",drive:"4h",desc:"제브라와 들소가 사는 해안 목장",highlight:"무료 입장, 야생 제브라 관찰",fee:"무료",season:"연중",kids:true,tags:["가족","동물","해안"]},
  {id:"sp5",name:"Morro Bay SP",area:"Morro Bay",drive:"3.5h",desc:"모로 록 전망, 에스추어리 카약",highlight:"Morro Rock, 해달 관찰",fee:"$10",season:"연중",kids:true,tags:["해안","자연","가족"]},
  {id:"sp6",name:"Montana de Oro SP",area:"SLO County",drive:"4h",desc:"야생 절벽 해안, 블러프 트레일",highlight:"Spooner's Cove, 암석 해안",fee:"무료",season:"연중",kids:false,tags:["자연","하이킹","해안"]},
  {id:"sp7",name:"Crystal Cove SP",area:"Orange County",drive:"5h",desc:"수중 공원, 스노클링, 해변",highlight:"Crystal Cove, 빈티지 코티지",fee:"$15",season:"연중",kids:true,tags:["해변","스노클링","가족"]},
  {id:"sp8",name:"Torrey Pines SP",area:"San Diego",drive:"5h",desc:"희귀 소나무, 라군, 태평양 절벽",highlight:"Razor Point, Broken Hill Trail",fee:"$25",season:"연중",kids:true,tags:["하이킹","자연","해안"]},
  {id:"sp9",name:"Anza-Borrego Desert SP",area:"San Diego",drive:"5h",desc:"캘리포니아 최대 주립공원, 봄꽃",highlight:"야생화 시즌 (2~4월), 철조각상",fee:"무료",season:"10~4월",kids:true,tags:["사막","자연","사진"]},
  {id:"sp10",name:"Palomar Mountain SP",area:"San Diego County",drive:"5h",desc:"팔로마 천문대, 숲속 캠핑",highlight:"Palomar Observatory, 쿠야마카 트레일",fee:"$10",season:"연중",kids:true,tags:["천문","하이킹","캠핑"]},
  {id:"sp11",name:"Henry Cowell Redwoods SP",area:"Santa Cruz",drive:"3h",desc:"레드우드 숲, 기차 투어",highlight:"Redwood Loop Trail, 증기 기차",fee:"$10",season:"연중",kids:true,tags:["레드우드","가족","기차"]},
  {id:"sp12",name:"Año Nuevo SP",area:"San Mateo",drive:"4h",desc:"코끼리 바다표범 번식지",highlight:"코끼리 물범 투어 (12~3월)",fee:"$10",season:"12~3월 최고",kids:true,tags:["동물","해안","교육"]},
  {id:"sp13",name:"Julia Pfeiffer Burns SP",area:"Big Sur",drive:"4h",desc:"바다로 떨어지는 맥웨이 폭포",highlight:"Overlook Trail, 맥웨이 폭포",fee:"$10",season:"연중",kids:true,tags:["폭포","사진","자연"]},
  {id:"sp14",name:"Humboldt Redwoods SP",area:"Humboldt",drive:"5h",desc:"세계 최대 레드우드 숲, Avenue of the Giants",highlight:"Avenue of the Giants 드라이브",fee:"무료",season:"연중",kids:true,tags:["레드우드","드라이브","자연"]},
  {id:"sp15",name:"Salt Point SP",area:"Sonoma Coast",drive:"4.5h",desc:"전복 다이빙, 해안 암석 지형",highlight:"Stump Beach, 조개 채집",fee:"$8",season:"연중",kids:false,tags:["다이빙","해안","자연"]},
  {id:"sp16",name:"Calaveras Big Trees SP",area:"Arnold",drive:"2.5h",desc:"자이언트 세쿼이아 주립공원",highlight:"North Grove, 세쿼이아 속 터널",fee:"$10",season:"연중",kids:true,tags:["세쿼이아","가족","자연"]},
  {id:"sp17",name:"Grover Hot Springs SP",area:"Markleeville",drive:"4h",desc:"시에라 자연 온천, 야영",highlight:"천연 온천 수영 ($8)",fee:"$8",season:"연중",kids:true,tags:["온천","캠핑","가족"]},
  {id:"sp18",name:"Bodie State Historic Park",area:"Mono County",drive:"3h",desc:"유령 도시, 골드러시 시대 보존",highlight:"19세기 건물 그대로 보존",fee:"$8",season:"5~10월",kids:true,tags:["역사","사진","교육"]},
  {id:"sp19",name:"Emerald Bay SP",area:"Lake Tahoe",drive:"4.5h",desc:"타호 최고 뷰, 비킹 섬",highlight:"Vikingsholm Castle, 에메랄드 베이",fee:"$10",season:"5~10월",kids:true,tags:["호수","수영","가족"]},
  {id:"sp20",name:"Malibu Creek SP",area:"Malibu",drive:"5h",desc:"M*A*S*H 촬영지, 암벽 등반",highlight:"Rock Pool, Century Lake",fee:"$12",season:"연중",kids:true,tags:["수영","사진","하이킹"]},
];

const BEACHES = [
  {id:"b1",name:"Santa Monica Beach",area:"LA County",drive:"5h",desc:"아이코닉 퍼시픽 파크, 보드워크, 자전거",highlight:"퍼시픽 파크 놀이기구, 피어",fee:"주차 $3~",season:"연중",kids:true,tags:["가족","수영","놀이기구"]},
  {id:"b2",name:"Venice Beach",area:"LA",drive:"5h",desc:"스케이트보드, 거리 공연, 머슬 비치",highlight:"Ocean Front Walk, 스케이트 파크",fee:"주차 $3~",season:"연중",kids:true,tags:["문화","구경","가족"]},
  {id:"b3",name:"Manhattan Beach",area:"LA County",drive:"5h",desc:"깨끗한 해변, 배구, 피어",highlight:"Manhattan Pier, 조용한 가족 해변",fee:"무료",season:"연중",kids:true,tags:["수영","가족","조용"]},
  {id:"b4",name:"Laguna Beach",area:"Orange County",drive:"5h",desc:"아트 갤러리, 조수 웅덩이, 아름다운 해변",highlight:"Main Beach, Tide Pools",fee:"무료",season:"연중",kids:true,tags:["예술","조수웅덩이","가족"]},
  {id:"b5",name:"Coronado Beach",area:"San Diego",drive:"5.5h",desc:"호텔 델 코로나도, 은빛 모래",highlight:"Hotel del Coronado, 넓은 모래사장",fee:"무료",season:"연중",kids:true,tags:["가족","수영","사진"]},
  {id:"b6",name:"La Jolla Cove",area:"San Diego",drive:"5.5h",desc:"바다사자, 스노클링, 절벽 해안",highlight:"조개비치 바다사자, 스노클링",fee:"무료",season:"연중",kids:true,tags:["동물","스노클링","가족"]},
  {id:"b7",name:"Shell Beach",area:"Pismo Beach",drive:"4h",desc:"조개 해변, 모나크 버터플라이",highlight:"모나크 버터플라이 군락 (10~3월)",fee:"무료",season:"연중",kids:true,tags:["나비","자연","가족"]},
  {id:"b8",name:"Santa Cruz Beach",area:"Santa Cruz",drive:"3h",desc:"비치 보드워크, 놀이기구, 피어",highlight:"Santa Cruz Boardwalk 놀이공원",fee:"무료",season:"연중",kids:true,tags:["놀이공원","수영","가족"]},
  {id:"b9",name:"Carmel Beach",area:"Carmel",drive:"4h",desc:"화이트 파우더 샌드, 강아지 환영",highlight:"17-Mile Drive 근처, 동화 마을",fee:"무료",season:"연중",kids:true,tags:["가족","강아지","사진"]},
  {id:"b10",name:"Pfeiffer Beach",area:"Big Sur",drive:"4h",desc:"보라색 모래, 암석 아치, 석양",highlight:"보라색 모래 (독특!), Keyhole Arch",fee:"$12",season:"연중",kids:true,tags:["사진","석양","자연"]},
  {id:"b11",name:"Stinson Beach",area:"Marin County",drive:"4h",desc:"SF 근처 최고 해변, 파도 서핑",highlight:"골든 게이트 뷰, 서핑",fee:"무료",season:"연중",kids:true,tags:["서핑","가족","SF근처"]},
  {id:"b12",name:"Bodega Bay",area:"Sonoma County",drive:"4.5h",desc:"히치콕 '새' 촬영지, 신선한 해산물",highlight:"던젤리니스 크랩, 고래 관찰",fee:"무료",season:"연중",kids:true,tags:["해산물","역사","가족"]},
  {id:"b13",name:"Avila Beach",area:"SLO County",drive:"4h",desc:"따뜻한 물, 작은 마을, 피어",highlight:"캘리포니아 가장 따뜻한 중부 해변",fee:"무료",season:"연중",kids:true,tags:["수영","가족","조용"]},
  {id:"b14",name:"Huntington Beach",area:"Orange County",drive:"5h",desc:"서핑 수도 USA, 국제 서핑 박물관",highlight:"서핑 경기, 파이어피트",fee:"$1~5",season:"연중",kids:true,tags:["서핑","가족","활기"]},
  {id:"b15",name:"Glass Beach",area:"Fort Bragg",drive:"5h",desc:"유리 조각으로 만들어진 해변",highlight:"매끄러운 유리 조각, 독특한 경험",fee:"무료",season:"연중",kids:true,tags:["특이","사진","가족"]},
];

const ROAD_TRIPS = [
  {id:"rt1",name:"Pacific Coast Highway (PCH)",area:"LA → San Francisco",drive:"6~8h (중간 중간 정차)",desc:"캘리포니아 가장 아이코닉한 드라이브, 해안 절벽과 파도",stops:["Santa Monica Pier","Malibu","Santa Barbara","San Luis Obispo","Big Sur","Carmel","Monterey","Santa Cruz","San Francisco"],days:"3~5일",kids:true,tags:["드라이브","해안","아이코닉"]},
  {id:"rt2",name:"17-Mile Drive",area:"Monterey Peninsula",drive:"4h from Fresno",desc:"페블비치, 론 사이프레스, 해안 드라이브",stops:["Pacific Grove Gate","Spanish Bay","Lone Cypress","Ghost Tree","Pebble Beach"],days:"반나절",kids:true,tags:["드라이브","골프","사진"]},
  {id:"rt3",name:"Avenue of the Giants",area:"Humboldt",drive:"5h from Fresno",desc:"세계 최대 레드우드 숲 관통 드라이브 32마일",stops:["Pepperwood","Myers Flat","Founders Tree","Humboldt Redwoods SP"],days:"반나절~1일",kids:true,tags:["레드우드","드라이브","자연"]},
  {id:"rt4",name:"Death Valley Loop",area:"Death Valley",drive:"4h from Fresno",desc:"사막 드라이브, 별밤, 지질학적 경이로움",stops:["Zabriskie Point","Artist's Drive","Badwater Basin","Mesquite Dunes","Dante's View"],days:"1~2일",kids:true,tags:["사막","사진","드라이브"]},
  {id:"rt5",name:"Eastern Sierra Scenic Byway",area:"395 Highway",drive:"3h from Fresno",desc:"395번 도로, 모노 레이크, 매머드, 바이숍",stops:["Mammoth Lakes","Mono Lake","Bodie Ghost Town","Bishop","Ancient Bristlecone"],days:"2~3일",kids:true,tags:["시에라","드라이브","자연"]},
  {id:"rt6",name:"Wine Country Loop",area:"Napa & Sonoma",drive:"4h from Fresno",desc:"나파 발리, 소노마 와이너리 투어",stops:["Napa Valley","Yountville","Sonoma Plaza","Bodega Bay","Point Reyes"],days:"2~3일",kids:false,tags:["와인","드라이브","문화"]},
  {id:"rt7",name:"Gold Rush Country",area:"Sierra Foothills",drive:"2h from Fresno",desc:"49ers 골드러시 역사, 광산 마을",stops:["Sutter's Mill","Coloma","Placerville","Nevada City","Grass Valley"],days:"1~2일",kids:true,tags:["역사","교육","드라이브"]},
  {id:"rt8",name:"San Diego Zoo Safari Loop",area:"San Diego County",drive:"5h from Fresno",desc:"샌디에이고 동물원, 사파리 파크, 발보아 파크",stops:["San Diego Zoo","San Diego Safari Park","Balboa Park","Old Town","Coronado"],days:"2~3일",kids:true,tags:["동물원","가족","교육"]},
  {id:"rt9",name:"Redwood Highway (101)",area:"Northern CA Coast",drive:"5h from Fresno",desc:"북부 해안 레드우드 국립공원 루트",stops:["Leggett","Richardson Grove","Humboldt Redwoods","Eureka","Prairie Creek Redwoods"],days:"2~3일",kids:true,tags:["레드우드","드라이브","자연"]},
  {id:"rt10",name:"Yosemite Valley Loop",area:"Yosemite",drive:"3h from Fresno",desc:"요세미티 밸리부터 하이 시에라까지",stops:["Valley View","Yosemite Falls","Mirror Lake","Mariposa Grove","Glacier Point"],days:"2~3일",kids:true,tags:["요세미티","자연","사진"]},
];

const FAMILY_SPOTS = [
  {id:"f1",name:"Disneyland Resort",area:"Anaheim",drive:"5h",desc:"마법의 왕국, 픽사 피어, 스타워즈 갤럭시 엣지",highlight:"Star Wars: Galaxy's Edge, 퍼레이드",fee:"$104~",season:"연중",kids:true,ageGroup:"모든 연령",tags:["놀이공원","디즈니","가족"]},
  {id:"f2",name:"Universal Studios Hollywood",area:"Hollywood",drive:"5h",desc:"해리포터, 쥬라기 공원, 미니언즈",highlight:"The Wizarding World of Harry Potter",fee:"$109~",season:"연중",kids:true,ageGroup:"5세+",tags:["놀이공원","영화","가족"]},
  {id:"f3",name:"San Diego Zoo",area:"San Diego",drive:"5.5h",desc:"세계 최대 도시 동물원, 4,000마리+",highlight:"판다, 기린 먹이주기, 사파리 투어",fee:"$64",season:"연중",kids:true,ageGroup:"모든 연령",tags:["동물원","교육","가족"]},
  {id:"f4",name:"San Diego Zoo Safari Park",area:"Escondido",drive:"5.5h",desc:"오픈 에어 사파리, 아프리카 동물",highlight:"아프리카 트램 사파리, 기린 먹이주기",fee:"$64",season:"연중",kids:true,ageGroup:"모든 연령",tags:["동물원","사파리","가족"]},
  {id:"f5",name:"Monterey Bay Aquarium",area:"Monterey",drive:"4h",desc:"세계 최고 수족관, 해달, 상어, 해파리",highlight:"해달 전시, 오픈 씨 전시",fee:"$50",season:"연중",kids:true,ageGroup:"모든 연령",tags:["수족관","교육","가족"]},
  {id:"f6",name:"California Academy of Sciences",area:"San Francisco",drive:"3.5h",desc:"자연사 박물관+수족관+플라네타리움 올인원",highlight:"비바리움, 열대우림 돔, 플라네타리움",fee:"$40",season:"연중",kids:true,ageGroup:"모든 연령",tags:["박물관","과학","가족"]},
  {id:"f7",name:"Exploratorium",area:"San Francisco",drive:"3.5h",desc:"인터랙티브 과학 탐험관",highlight:"체험형 전시, Tactile Dome",fee:"$35",season:"연중",kids:true,ageGroup:"5세+",tags:["과학","체험","교육"]},
  {id:"f8",name:"Legoland California",area:"Carlsbad",drive:"5h",desc:"레고로 만든 테마파크, 워터 파크",highlight:"Miniland USA, 워터파크",fee:"$99~",season:"연중",kids:true,ageGroup:"2~12세",tags:["레고","놀이공원","가족"]},
  {id:"f9",name:"Six Flags Magic Mountain",area:"Valencia",drive:"5h",desc:"롤러코스터 세계 수도, 19개 코스터",highlight:"Twisted Colossus, Wonder Woman",fee:"$49~",season:"연중",kids:true,ageGroup:"10세+",tags:["롤러코스터","스릴","가족"]},
  {id:"f10",name:"Knott's Berry Farm",area:"Buena Park",drive:"5h",desc:"캘리포니아 최초 테마파크, 보이센베리",highlight:"Ghost Town, Snoopy's Kidzone",fee:"$49~",season:"연중",kids:true,ageGroup:"모든 연령",tags:["놀이공원","역사","가족"]},
  {id:"f11",name:"Santa Cruz Beach Boardwalk",area:"Santa Cruz",drive:"3h",desc:"1907년 오픈, 미국 최고 해변 놀이공원",highlight:"Giant Dipper (1924년 목재 코스터), 로그 라이드",fee:"라이드별 $",season:"연중 (주말)",kids:true,ageGroup:"모든 연령",tags:["놀이공원","해변","역사"]},
  {id:"f12",name:"Griffith Observatory",area:"LA",drive:"5h",desc:"LA 최고 전망, 천문관, 무료 입장",highlight:"LA 야경, 천문관 쇼, 무료",fee:"무료 (쇼 $8)",season:"연중",kids:true,ageGroup:"5세+",tags:["천문","무료","전망"]},
  {id:"f13",name:"Natural History Museum of LA",area:"LA",drive:"5h",desc:"공룡, 화석, 원석 전시",highlight:"Dinosaur Hall, Gem & Mineral Hall",fee:"$15",season:"연중",kids:true,ageGroup:"모든 연령",tags:["박물관","공룡","교육"]},
  {id:"f14",name:"Children's Discovery Museum",area:"San Jose",drive:"3h",desc:"어린이 전용 체험 박물관",highlight:"12세 이하 최고, 인터랙티브 전시",fee:"$14",season:"연중",kids:true,ageGroup:"0~12세",tags:["어린이","체험","교육"]},
  {id:"f15",name:"Fresno Chaffee Zoo",area:"Fresno",drive:"0",desc:"프레즈노 로컬 동물원",highlight:"아프리카 사바나, 호랑이",fee:"$15",season:"연중",kids:true,ageGroup:"모든 연령",tags:["동물원","로컬","가족"]},
];

const MUSEUMS = [
  {id:"m1",name:"Getty Center",area:"LA",drive:"5h",desc:"무료 세계 최고 미술관, LA 전망",highlight:"인상주의 컬렉션, 건축, 정원",fee:"무료 (주차 $20)",season:"연중",kids:true,tags:["미술","무료","건축"]},
  {id:"m2",name:"LACMA",area:"LA",drive:"5h",desc:"LA 카운티 미술관, 미국 서부 최대",highlight:"Chris Burden 가로등 설치, 한국 컬렉션",fee:"$25",season:"연중",kids:true,tags:["미술","역사","문화"]},
  {id:"m3",name:"California Science Center",area:"LA",drive:"5h",desc:"우주왕복선 엔데버, 항공 우주 전시",highlight:"Space Shuttle Endeavour, 무료",fee:"무료 (엔데버 $3~)",season:"연중",kids:true,tags:["우주","과학","무료"]},
  {id:"m4",name:"Griffith Observatory",area:"LA",drive:"5h",desc:"천문관, LA 전망, 무료 관람",highlight:"무료 입장, 야경 최고",fee:"무료",season:"연중",kids:true,tags:["천문","무료","전망"]},
  {id:"m5",name:"California Academy of Sciences",area:"SF",drive:"3.5h",desc:"자연사+수족관+플라네타리움",highlight:"살아있는 지붕, 열대우림 돔",fee:"$40",season:"연중",kids:true,tags:["자연사","과학","가족"]},
  {id:"m6",name:"Exploratorium",area:"SF",drive:"3.5h",desc:"인터랙티브 과학 체험관",highlight:"500개+ 체험 전시",fee:"$35",season:"연중",kids:true,tags:["과학","체험","교육"]},
  {id:"m7",name:"de Young Museum",area:"SF",drive:"3.5h",desc:"아메리칸 아트, 직물 디자인",highlight:"Observation Tower 무료, 조각 정원",fee:"$15",season:"연중",kids:true,tags:["미술","문화","SF"]},
  {id:"m8",name:"San Francisco MOMA",area:"SF",drive:"3.5h",desc:"현대미술관, 7층 규모",highlight:"마티스, 피카소, 사진 갤러리",fee:"$25",season:"연중",kids:false,tags:["현대미술","SF","문화"]},
  {id:"m9",name:"Computer History Museum",area:"Mountain View",drive:"3h",desc:"컴퓨터 역사 전시, 실리콘밸리",highlight:"Apple I, 최초 컴퓨터들",fee:"$20",season:"연중",kids:true,tags:["기술","역사","교육"]},
  {id:"m10",name:"San Diego Museum of Natural History",area:"San Diego",drive:"5.5h",desc:"공룡, 고생물학, 캘리포니아 자연",highlight:"Balboa Park 내 위치",fee:"$22",season:"연중",kids:true,tags:["자연사","공룡","가족"]},
  {id:"m11",name:"USS Midway Museum",area:"San Diego",drive:"5.5h",desc:"항공모함 박물관, 전투기 탑승",highlight:"F-14, F/A-18 조종석 체험",fee:"$26",season:"연중",kids:true,tags:["군사","역사","체험"]},
  {id:"m12",name:"Aerospace Museum of California",area:"Sacramento",drive:"2.5h",desc:"항공 우주 역사, 전투기 컬렉션",highlight:"실제 전투기 전시",fee:"$15",season:"연중",kids:true,tags:["우주","항공","역사"]},
  {id:"m13",name:"Monterey Bay Aquarium",area:"Monterey",drive:"4h",desc:"세계 최고 수족관",highlight:"해달, 상어, 해파리 전시",fee:"$50",season:"연중",kids:true,tags:["수족관","해양","교육"]},
  {id:"m14",name:"Fresno Art Museum",area:"Fresno",drive:"0",desc:"현대 미술, 지역 작가 전시",highlight:"로컬 전시, 조각 정원",fee:"$10",season:"연중",kids:true,tags:["미술","로컬","문화"]},
  {id:"m15",name:"Discovery Cube Orange County",area:"Santa Ana",drive:"5h",desc:"어린이 과학 체험관",highlight:"허리케인 시뮬레이터, 과학 실험",fee:"$19",season:"연중",kids:true,tags:["과학","어린이","체험"]},
];

const HISTORIC_SITES = [
  {id:"h1",name:"Alcatraz Island",area:"San Francisco",drive:"3.5h",desc:"악명 높은 연방 교도소 섬, 알 카포네 수감",highlight:"오디오 투어, 페리로 이동",fee:"$45 (페리 포함)",season:"연중",kids:true,tags:["역사","SF","투어"]},
  {id:"h2",name:"Hearst Castle",area:"San Simeon",drive:"4h",desc:"신문왕 허스트의 저택, 할리우드 역사",highlight:"오션 뷰 수영장, 유럽 예술품 컬렉션",fee:"$25~35",season:"연중",kids:true,tags:["역사","건축","투어"]},
  {id:"h3",name:"Mission San Juan Capistrano",area:"Orange County",drive:"5h",desc:"캘리포니아 미션 역사, 제비 귀환",highlight:"루인즈, 정원, 제비 축제 (3월)",fee:"$12",season:"연중",kids:true,tags:["미션","역사","교육"]},
  {id:"h4",name:"Old Town San Diego",area:"San Diego",drive:"5.5h",desc:"캘리포니아 발상지, 멕시코 문화",highlight:"멕시칸 음식, 역사 건물 무료 관람",fee:"무료",season:"연중",kids:true,tags:["역사","음식","문화"]},
  {id:"h5",name:"Sutter's Mill (Marshall Gold Discovery)",area:"Coloma",drive:"2.5h",desc:"1848년 골드 러시 발생지",highlight:"금 채취 체험, 역사 투어",fee:"$8",season:"연중",kids:true,tags:["골드러시","역사","체험"]},
  {id:"h6",name:"Columbia State Historic Park",area:"Columbia",drive:"2h",desc:"골드러시 마을 그대로 보존, 마차 투어",highlight:"살아있는 역사 마을, 마차 타기",fee:"무료",season:"연중",kids:true,tags:["역사","골드러시","가족"]},
  {id:"h7",name:"Bodie Ghost Town",area:"Mono County",drive:"3h",desc:"1870년대 광산 마을 그대로 보존",highlight:"800개 건물 폐허, 타임캡슐",fee:"$8",season:"5~10월",kids:true,tags:["유령마을","역사","사진"]},
  {id:"h8",name:"Missions of Central California",area:"Central CA",drive:"1~3h",desc:"캘리포니아 21개 미션 투어",highlight:"Mission San Miguel, Mission San Luis Obispo",fee:"$5~10",season:"연중",kids:true,tags:["미션","역사","교육"]},
  {id:"h9",name:"Winchester Mystery House",area:"San Jose",drive:"3h",desc:"이상한 계단, 비밀 통로의 저택",highlight:"야간 투어 (할로윈), 특이한 건축",fee:"$40",season:"연중",kids:true,tags:["미스터리","역사","투어"]},
  {id:"h10",name:"Rosicrucian Egyptian Museum",area:"San Jose",drive:"3h",desc:"이집트 유물, 미라, 고고학",highlight:"실제 이집트 미라, 히에로글리프",fee:"$10",season:"연중",kids:true,tags:["이집트","역사","교육"]},
  {id:"h11",name:"California State Railroad Museum",area:"Sacramento",drive:"2.5h",desc:"대륙 횡단 철도 역사, 실제 기차",highlight:"1860년대 기관차, 열차 타기",fee:"$12",season:"연중",kids:true,tags:["기차","역사","교육"]},
  {id:"h12",name:"Autry Museum of the American West",area:"LA",drive:"5h",desc:"아메리칸 웨스트, 원주민 문화",highlight:"총기 컬렉션, 카우보이 역사",fee:"$14",season:"연중",kids:true,tags:["서부","역사","문화"]},
  {id:"h13",name:"Manzanar National Historic Site",area:"Owens Valley",drive:"3h",desc:"2차 대전 일본계 미국인 수용소",highlight:"교육적, 박물관, 기념비",fee:"무료",season:"연중",kids:true,tags:["역사","교육","추모"]},
  {id:"h14",name:"Point Reyes Lighthouse",area:"Marin County",drive:"4h",desc:"1870년 등대, 고래 관찰",highlight:"300계단, 고래 철 (1~3월)",fee:"무료",season:"연중",kids:true,tags:["등대","역사","자연"]},
  {id:"h15",name:"Presidio of San Francisco",area:"SF",drive:"3.5h",desc:"1776년 요새, 현재 공원화",highlight:"Golden Gate Bridge 뷰, 무료",fee:"무료",season:"연중",kids:true,tags:["역사","공원","SF"]},
];

const CATEGORIES = [
  {id:"state_parks",label:"🌲 주립공원",color:"#2E7D32",data:STATE_PARKS},
  {id:"beaches",label:"🏖️ 해변",color:"#0277BD",data:BEACHES},
  {id:"road_trips",label:"🚗 로드트립",color:"#E65100",data:ROAD_TRIPS},
  {id:"family",label:"👨‍👩‍👧‍👦 가족여행",color:"#6A1B9A",data:FAMILY_SPOTS},
  {id:"museums",label:"🏛️ 뮤지엄",color:"#4E342E",data:MUSEUMS},
  {id:"historic",label:"🏰 역사",color:"#1565C0",data:HISTORIC_SITES},
];


function NationalParksTab() {
  const [search,setSearch]=useState("");
  const [regionFilter,setRegionFilter]=useState("전체");
  const [visitFilter,setVisitFilter]=useState("all");
  const [detailModal,setDetailModal]=useState(null);
  const [editMode,setEditMode]=useState(false);

  // 저장 데이터
  const [parkNotes,setParkNotes]=useState(()=>loadLS("np_notes",{}));
  const [parkPhotos,setParkPhotos]=useState(()=>loadLS("np_photos",{}));
  const [wishlist,setWishlist]=useState(()=>loadLS("np_wishlist",[]));

  useEffect(()=>saveLS("np_notes",parkNotes),[parkNotes]);
  useEffect(()=>saveLS("np_photos",parkPhotos),[parkPhotos]);
  useEffect(()=>saveLS("np_wishlist",wishlist),[wishlist]);

  const getNote=(id)=>parkNotes[id]||{visited:false,date:"",rating:0,note:"",customInfo:""};
  const updateNote=(id,updates)=>setParkNotes(p=>({...p,[id]:{...getNote(id),...updates}}));
  const isWishlisted=(id)=>wishlist.includes(id);
  const toggleWishlist=(id)=>setWishlist(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]);

  const handlePhoto=(id,file)=>{
    if(!file) return;
    const reader=new FileReader();
    reader.onload=e=>{
      const img=new Image();
      img.onload=()=>{
        const canvas=document.createElement("canvas");
        const max=900;
        let w=img.width,h=img.height;
        if(w>max){h=h*max/w;w=max;}
        canvas.width=w;canvas.height=h;
        canvas.getContext("2d").drawImage(img,0,0,w,h);
        setParkPhotos(p=>({...p,[id]:canvas.toDataURL("image/jpeg",0.75)}));
      };
      img.src=e.target.result;
    };
    reader.readAsDataURL(file);
  };

  // 방문한 공원 수
  const visitedCount=NATIONAL_PARKS.filter(p=>getNote(p.id).visited).length;

  const filtered=NATIONAL_PARKS.filter(p=>{
    const matchSearch=!search||p.name.toLowerCase().includes(search.toLowerCase())||p.state.toLowerCase().includes(search.toLowerCase())||p.highlight.includes(search);
    const matchRegion=regionFilter==="전체"||p.region===regionFilter;
    const matchVisit=visitFilter==="all"||(visitFilter==="visited"&&getNote(p.id).visited)||(visitFilter==="wishlist"&&isWishlisted(p.id))||(visitFilter==="notyet"&&!getNote(p.id).visited);
    return matchSearch&&matchRegion&&matchVisit;
  });

  return(
    <div style={{fontFamily:"'Noto Sans KR',sans-serif",background:"#F2F0EB",minHeight:"100vh",maxWidth:480,margin:"0 auto",paddingBottom:60}}>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900&display=swap" rel="stylesheet"/>

      {/* 헤더 */}
      <div style={{background:"linear-gradient(135deg,#1A237E,#283593)",padding:"20px 16px 16px",color:"#fff"}}>
        <div style={{fontSize:11,letterSpacing:3,color:"rgba(255,255,255,0.5)",textTransform:"uppercase",marginBottom:4}}>U.S. NATIONAL PARKS</div>
        <h1 style={{fontSize:22,fontWeight:900,margin:"0 0 4px"}}>🏞️ 국립공원 63개</h1>
        <div style={{fontSize:11,color:"rgba(255,255,255,0.7)"}}>
          방문 완료 <span style={{fontWeight:900,color:"#FFD54F"}}>{visitedCount}</span> / 63 · 가고 싶은 곳 <span style={{fontWeight:900,color:"#80CBC4"}}>{wishlist.length}</span>개
        </div>
        {/* 프로그레스 바 */}
        <div style={{background:"rgba(255,255,255,0.15)",borderRadius:6,height:6,marginTop:8,overflow:"hidden"}}>
          <div style={{background:"#FFD54F",height:6,borderRadius:6,width:(visitedCount/63*100)+"%",transition:"width 0.4s"}}/>
        </div>
      </div>

      <div style={{padding:"12px"}}>
        {/* 검색 */}
        <div style={{position:"relative",marginBottom:10}}>
          <span style={{position:"absolute",left:11,top:"50%",transform:"translateY(-50%)",color:"#bbb"}}>🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="공원명, 주, 하이라이트 검색..."
            style={{width:"100%",padding:"10px 12px 10px 32px",borderRadius:12,border:"2px solid #E0DBD4",fontSize:13,outline:"none",boxSizing:"border-box",background:"#fff"}}/>
        </div>

        {/* 방문 필터 */}
        <div style={{display:"flex",gap:6,marginBottom:10}}>
          {[["all","전체"],["visited","✅ 방문"],["wishlist","☆ 위시"],["notyet","미방문"]].map(([v,l])=>(
            <button key={v} onClick={()=>setVisitFilter(v)} style={{flex:1,padding:"7px 4px",borderRadius:10,border:"none",cursor:"pointer",background:visitFilter===v?"#283593":"#fff",color:visitFilter===v?"#fff":"#888",fontSize:10,fontWeight:700}}>{l}</button>
          ))}
        </div>

        {/* 지역 필터 */}
        <div style={{display:"flex",gap:5,overflowX:"auto",marginBottom:12,paddingBottom:3}}>
          {REGIONS.map(r=>{
            const col=REGION_COLORS[r]||"#283593";
            return(
              <button key={r} onClick={()=>setRegionFilter(r)} style={{padding:"5px 10px",borderRadius:15,border:"none",flexShrink:0,cursor:"pointer",background:regionFilter===r?col:"#fff",color:regionFilter===r?"#fff":"#666",fontSize:10,fontWeight:700}}>{r}</button>
            );
          })}
        </div>

        <div style={{fontSize:11,color:"#888",marginBottom:8}}>{filtered.length}개 표시</div>

        {/* 공원 목록 */}
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {filtered.map(p=>{
            const note=getNote(p.id);
            const col=REGION_COLORS[p.region]||"#283593";
            return(
              <div key={p.id} onClick={()=>setDetailModal(p)} style={{
                background:"#fff",borderRadius:13,overflow:"hidden",
                boxShadow:"0 1px 6px rgba(0,0,0,0.08)",cursor:"pointer",
                borderLeft:`5px solid ${note.visited?"#FFD54F":isWishlisted(p.id)?col:"#ddd"}`,
              }}>
                {/* 사진 썸네일 */}
                {parkPhotos[p.id]&&(
                  <img src={parkPhotos[p.id]} alt={p.name} style={{width:"100%",height:90,objectFit:"cover",display:"block"}}/>
                )}
                <div style={{padding:"11px 13px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                    <div style={{flex:1,minWidth:0,paddingRight:8}}>
                      <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}>
                        <span style={{fontSize:14,fontWeight:900,color:"#1A237E"}}>{p.name}</span>
                        {note.visited&&<span style={{fontSize:11}}>✅</span>}
                      </div>
                      <div style={{fontSize:10,color:"#888"}}>{p.state} · {p.est}년 지정{p.drive&&` · 🚗 ${p.drive}`}</div>
                    </div>
                    <div style={{display:"flex",gap:5,alignItems:"center",flexShrink:0}}>
                      {note.rating>0&&<span style={{fontSize:9,color:"#F57F17",fontWeight:700}}>{"⭐".repeat(note.rating)}</span>}
                      <button onClick={e=>{e.stopPropagation();toggleWishlist(p.id);}} style={{background:"none",border:"none",fontSize:17,cursor:"pointer",padding:0}}>{isWishlisted(p.id)?"🔖":"🔖"}</button>
                    </div>
                  </div>
                  <div style={{marginTop:5,display:"flex",gap:5,flexWrap:"wrap"}}>
                    <span style={{fontSize:10,background:col+"18",color:col,borderRadius:8,padding:"2px 7px",fontWeight:700}}>{p.region}</span>
                    <span style={{fontSize:10,background:"#F0EDE8",color:"#888",borderRadius:8,padding:"2px 7px"}}>{p.fee}</span>
                    {p.drive&&<span style={{fontSize:10,background:"#E3F2FD",color:"#1565C0",borderRadius:8,padding:"2px 7px"}}>🚗 {p.drive}</span>}
                  </div>
                  <div style={{fontSize:11,color:"#666",marginTop:5,lineHeight:1.4}}>{p.highlight}</div>
                  {note.note&&<div style={{fontSize:11,color:"#558B2F",background:"#F1F8E9",borderRadius:7,padding:"5px 8px",marginTop:6,lineHeight:1.5}}>📝 {note.note.slice(0,60)}{note.note.length>60?"...":""}</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ══ 공원 상세 모달 ══ */}
      {detailModal&&(()=>{
        const p=detailModal;
        const note=getNote(p.id);
        const col=REGION_COLORS[p.region]||"#283593";
        return(
          <div onClick={()=>{setDetailModal(null);setEditMode(false);}} style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.6)",zIndex:1000,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
            <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:"20px 20px 0 0",width:"100%",maxWidth:480,maxHeight:"94vh",overflowY:"auto"}}>

              {/* 헤더 사진 or 배경 */}
              {parkPhotos[p.id]?(
                <div style={{position:"relative"}}>
                  <img src={parkPhotos[p.id]} alt={p.name} style={{width:"100%",height:200,objectFit:"cover",display:"block"}}/>
                  <div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom,transparent 40%,rgba(0,0,0,0.6))"}}>
                    <div style={{position:"absolute",bottom:14,left:16,right:16}}>
                      <div style={{fontSize:22,fontWeight:900,color:"#fff"}}>{p.name} NP</div>
                      <div style={{fontSize:11,color:"rgba(255,255,255,0.8)"}}>{p.state} · {p.est}년 지정</div>
                    </div>
                  </div>
                  <button onClick={()=>setDetailModal(null)} style={{position:"absolute",top:12,right:12,background:"rgba(0,0,0,0.4)",border:"none",borderRadius:20,width:30,height:30,color:"#fff",fontSize:15,cursor:"pointer"}}>✕</button>
                </div>
              ):(
                <div style={{background:`linear-gradient(135deg,${col},${col}CC)`,padding:"22px 18px 16px",borderRadius:"20px 20px 0 0"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                    <div>
                      <div style={{fontSize:11,color:"rgba(255,255,255,0.6)",marginBottom:2}}>{p.region} · {p.state}</div>
                      <div style={{fontSize:20,fontWeight:900,color:"#fff"}}>{p.name} NP</div>
                      <div style={{fontSize:11,color:"rgba(255,255,255,0.7)",marginTop:2}}>{p.est}년 지정 · {p.size}</div>
                    </div>
                    <button onClick={()=>setDetailModal(null)} style={{background:"rgba(255,255,255,0.2)",border:"none",borderRadius:20,width:30,height:30,color:"#fff",fontSize:15,cursor:"pointer"}}>✕</button>
                  </div>
                </div>
              )}

              <div style={{padding:"16px 18px 40px"}}>
                {/* 사진 추가/변경 */}
                <label style={{display:"flex",alignItems:"center",gap:6,padding:"8px 12px",borderRadius:9,border:"2px dashed #ddd",background:"#F8F7F4",cursor:"pointer",marginBottom:14,fontSize:11,color:"#aaa",justifyContent:"center"}}>
                  {parkPhotos[p.id]?"📷 사진 변경":"📷 사진 추가"}
                  <input type="file" accept="image/*" onChange={e=>handlePhoto(p.id,e.target.files[0])} style={{display:"none"}}/>
                </label>
                {parkPhotos[p.id]&&<button onClick={()=>setParkPhotos(pr=>{const n={...pr};delete n[p.id];return n;})} style={{width:"100%",padding:"6px",borderRadius:8,border:"1px solid #FFEBEE",background:"#fff",color:"#C62828",fontSize:10,cursor:"pointer",marginTop:-10,marginBottom:12}}>사진 삭제</button>}

                {/* 기본 정보 카드 */}
                <div style={{background:"#F8F7F4",borderRadius:13,padding:"13px 14px",marginBottom:14}}>
                  <div style={{fontSize:12,fontWeight:700,color:"#1A237E",marginBottom:10}}>ℹ️ 기본 정보</div>
                  {[
                    ["📍 주소",p.address],
                    ["🎫 입장료",p.fee],
                    ["📅 최적 시기",p.season],
                    ["📐 면적",p.size],
                    ["🌐 웹사이트",p.website],
                  ].map(([label,val])=>(
                    <div key={label} style={{display:"flex",gap:8,marginBottom:7,alignItems:"flex-start"}}>
                      <span style={{fontSize:11,color:"#888",flexShrink:0,width:70}}>{label}</span>
                      <span style={{fontSize:12,color:"#333",flex:1,lineHeight:1.5}}>{val}</span>
                    </div>
                  ))}
                </div>

                {/* 하이라이트 */}
                <div style={{background:"#E8EAF6",borderRadius:12,padding:"11px 13px",marginBottom:14}}>
                  <div style={{fontSize:11,fontWeight:700,color:"#283593",marginBottom:6}}>⭐ 하이라이트</div>
                  <div style={{fontSize:12,color:"#333",lineHeight:1.6}}>{p.highlight}</div>
                </div>

                {/* 내 기록 섹션 */}
                <div style={{background:"#F1F8E9",borderRadius:13,padding:"13px",marginBottom:14}}>
                  <div style={{fontSize:12,fontWeight:700,color:"#2E7D32",marginBottom:10}}>📓 내 기록</div>

                  {/* 방문 여부 */}
                  <div style={{display:"flex",gap:10,marginBottom:10,alignItems:"center",flexWrap:"wrap"}}>
                    <label style={{display:"flex",alignItems:"center",gap:5,cursor:"pointer",fontSize:13}}>
                      <input type="checkbox" checked={!!note.visited} onChange={e=>updateNote(p.id,{visited:e.target.checked})} style={{accentColor:"#2E7D32",width:16,height:16}}/>
                      <span style={{fontWeight:700}}>✅ 방문 완료</span>
                    </label>
                    <input type="date" value={note.date||""} onChange={e=>updateNote(p.id,{date:e.target.value})}
                      style={{border:"1px solid #ccc",borderRadius:7,padding:"4px 8px",fontSize:11,outline:"none"}}/>
                  </div>

                  {/* 별점 */}
                  <div style={{display:"flex",gap:5,marginBottom:10,alignItems:"center"}}>
                    <span style={{fontSize:11,color:"#888",marginRight:4}}>평점:</span>
                    {[1,2,3,4,5].map(n=>(
                      <button key={n} onClick={()=>updateNote(p.id,{rating:note.rating===n?0:n})} style={{background:"none",border:"none",fontSize:22,cursor:"pointer",padding:0,opacity:n<=(note.rating||0)?1:0.2}}>⭐</button>
                    ))}
                  </div>

                  {/* 메모/일기 */}
                  <div style={{marginBottom:8}}>
                    <div style={{fontSize:11,fontWeight:700,color:"#555",marginBottom:5}}>📝 메모 / 일기 / 정보</div>
                    <textarea value={note.note||""} onChange={e=>updateNote(p.id,{note:e.target.value})}
                      placeholder={`${p.name} NP 기록을 자유롭게 남겨보세요...\n\n예시:\n- 베스트 트레일\n- 추천 캠핑 사이트\n- 날씨 / 혼잡도\n- 가족들 반응\n- 꼭 먹어야 할 음식\n- 다음에 올 때 팁`}
                      style={{width:"100%",padding:"10px 12px",borderRadius:10,border:"2px solid #C8E6C9",fontSize:12,outline:"none",resize:"none",minHeight:130,boxSizing:"border-box",lineHeight:1.7,fontFamily:"'Noto Sans KR',sans-serif",background:"#fff"}}/>
                  </div>

                  {/* 커스텀 추가 정보 */}
                  <div>
                    <div style={{fontSize:11,fontWeight:700,color:"#555",marginBottom:5}}>🔗 추가 정보 (블로그 링크, 예약 정보 등)</div>
                    <textarea value={note.customInfo||""} onChange={e=>updateNote(p.id,{customInfo:e.target.value})}
                      placeholder="예약 링크, 블로그 URL, 입장 팁 등..."
                      style={{width:"100%",padding:"9px 12px",borderRadius:10,border:"2px solid #C8E6C9",fontSize:12,outline:"none",resize:"none",minHeight:60,boxSizing:"border-box",lineHeight:1.6,fontFamily:"'Noto Sans KR',sans-serif",background:"#fff"}}/>
                  </div>

                  {(note.note||note.customInfo)&&<div style={{fontSize:10,color:"#aaa",marginTop:6,textAlign:"right"}}>자동 저장됨 ✓</div>}
                </div>

                {/* 위시리스트 + 닫기 */}
                <div style={{display:"flex",gap:8}}>
                  <button onClick={()=>toggleWishlist(p.id)} style={{flex:1,padding:"12px",borderRadius:11,border:"none",background:isWishlisted(p.id)?"#283593":"#E8EAF6",color:isWishlisted(p.id)?"#fff":"#666",fontSize:12,fontWeight:700,cursor:"pointer"}}>
                    {isWishlisted(p.id)?"🔖 위시리스트에 있음":"🔖 가고 싶어요"}
                  </button>
                  <button onClick={()=>setDetailModal(null)} style={{flex:1,padding:"12px",background:"#1A237E",color:"#fff",border:"none",borderRadius:11,fontSize:12,fontWeight:700,cursor:"pointer"}}>닫기</button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}


function CATravel() {
  const [tab,setTab]=useState("state_parks");
  const [search,setSearch]=useState("");
  const [kidsOnly,setKidsOnly]=useState(false);
  const [visitFilter,setVisitFilter]=useState("all");
  const [detailModal,setDetailModal]=useState(null);
  const [notes,setNotes]=useState(()=>loadLS("ca_notes",{}));
  const [photos,setPhotos]=useState(()=>loadLS("ca_photos",{}));
  const [wishlist,setWishlist]=useState(()=>loadLS("ca_wishlist",[]));

  useEffect(()=>saveLS("ca_notes",notes),[notes]);
  useEffect(()=>saveLS("ca_photos",photos),[photos]);
  useEffect(()=>saveLS("ca_wishlist",wishlist),[wishlist]);

  const getNote=(id)=>notes[id]||{visited:false,date:"",rating:0,note:""};
  const updateNote=(id,u)=>setNotes(p=>({...p,[id]:{...getNote(id),...u}}));
  const isWish=(id)=>wishlist.includes(id);
  const toggleWish=(id)=>setWishlist(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]);

  const handlePhoto=(id,file)=>{
    if(!file) return;
    const reader=new FileReader();
    reader.onload=e=>{
      const img=new Image();
      img.onload=()=>{
        const canvas=document.createElement("canvas");
        const max=900; let w=img.width,h=img.height;
        if(w>max){h=h*max/w;w=max;}
        canvas.width=w;canvas.height=h;
        canvas.getContext("2d").drawImage(img,0,0,w,h);
        setPhotos(p=>({...p,[id]:canvas.toDataURL("image/jpeg",0.75)}));
      };
      img.src=e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const activeCat=CATEGORIES.find(c=>c.id===tab);
  const allData=activeCat?.data||[];
  const totalVisited=CATEGORIES.flatMap(c=>c.data).filter(d=>getNote(d.id).visited).length;
  const totalAll=CATEGORIES.flatMap(c=>c.data).length;

  const filtered=allData.filter(d=>{
    const matchSearch=!search||d.name.toLowerCase().includes(search.toLowerCase())||d.area.toLowerCase().includes(search.toLowerCase())||(d.highlight||"").includes(search)||d.desc.includes(search);
    const matchKids=!kidsOnly||d.kids;
    const matchVisit=visitFilter==="all"||(visitFilter==="visited"&&getNote(d.id).visited)||(visitFilter==="wish"&&isWish(d.id))||(visitFilter==="notyet"&&!getNote(d.id).visited);
    return matchSearch&&matchKids&&matchVisit;
  });

  const col=activeCat?.color||"#333";

  return(
    <div style={{fontFamily:"'Noto Sans KR',sans-serif",background:"#F5F3EF",minHeight:"100vh",maxWidth:480,margin:"0 auto",paddingBottom:70}}>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900&display=swap" rel="stylesheet"/>

      {/* 헤더 */}
      <div style={{background:"linear-gradient(135deg,#B71C1C,#E53935)",padding:"20px 16px 14px",color:"#fff"}}>
        <div style={{fontSize:10,letterSpacing:3,color:"rgba(255,255,255,0.5)",textTransform:"uppercase",marginBottom:3}}>CALIFORNIA TRAVEL PLANNER</div>
        <h1 style={{fontSize:22,fontWeight:900,margin:"0 0 4px"}}>🌴 캘리포니아 여행</h1>
        <div style={{fontSize:11,color:"rgba(255,255,255,0.7)"}}>
          방문 완료 <span style={{fontWeight:900,color:"#FFD54F"}}>{totalVisited}</span> / {totalAll} · 위시 <span style={{fontWeight:900,color:"#B2EBF2"}}>{wishlist.length}</span>개
        </div>
        <div style={{background:"rgba(255,255,255,0.15)",borderRadius:5,height:5,marginTop:7,overflow:"hidden"}}>
          <div style={{background:"#FFD54F",height:5,borderRadius:5,width:(totalVisited/totalAll*100)+"%",transition:"width 0.4s"}}/>
        </div>
      </div>

      {/* 카테고리 탭 */}
      <div style={{display:"flex",gap:0,background:"#fff",borderBottom:"2px solid #F0EDE8",overflowX:"auto"}}>
        {CATEGORIES.map(c=>(
          <button key={c.id} onClick={()=>setTab(c.id)} style={{
            flex:1,padding:"11px 5px",border:"none",cursor:"pointer",flexShrink:0,
            background:tab===c.id?c.color+"15":"transparent",
            color:tab===c.id?c.color:"#888",
            fontSize:9,fontWeight:700,
            borderBottom:tab===c.id?`3px solid ${c.color}`:"3px solid transparent",
            whiteSpace:"nowrap",
          }}>{c.label}</button>
        ))}
      </div>

      <div style={{padding:"12px"}}>
        {/* 검색 + 필터 */}
        <div style={{position:"relative",marginBottom:9}}>
          <span style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:"#bbb"}}>🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="이름, 지역, 특징 검색..."
            style={{width:"100%",padding:"9px 12px 9px 30px",borderRadius:11,border:"2px solid #E8E3DC",fontSize:12,outline:"none",boxSizing:"border-box",background:"#fff"}}/>
        </div>

        <div style={{display:"flex",gap:6,marginBottom:12,flexWrap:"wrap"}}>
          {[["all","전체"],["visited","✅ 방문"],["wish","🔖 위시"],["notyet","미방문"]].map(([v,l])=>(
            <button key={v} onClick={()=>setVisitFilter(v)} style={{padding:"6px 11px",borderRadius:15,border:"none",cursor:"pointer",background:visitFilter===v?col:"#fff",color:visitFilter===v?"#fff":"#888",fontSize:10,fontWeight:700}}>{l}</button>
          ))}
          <button onClick={()=>setKidsOnly(!kidsOnly)} style={{padding:"6px 11px",borderRadius:15,border:"none",cursor:"pointer",background:kidsOnly?"#E91E63":"#fff",color:kidsOnly?"#fff":"#888",fontSize:10,fontWeight:700}}>👧 아이OK만</button>
          <span style={{fontSize:11,color:"#aaa",display:"flex",alignItems:"center",marginLeft:"auto"}}>{filtered.length}곳</span>
        </div>

        {/* 목록 */}
        <div style={{display:"flex",flexDirection:"column",gap:9}}>
          {filtered.map(d=>{
            const note=getNote(d.id);
            return(
              <div key={d.id} onClick={()=>setDetailModal(d)} style={{
                background:"#fff",borderRadius:13,overflow:"hidden",
                boxShadow:"0 1px 6px rgba(0,0,0,0.07)",cursor:"pointer",
                borderLeft:`5px solid ${note.visited?"#FFD54F":isWish(d.id)?col:"#ddd"}`,
              }}>
                {photos[d.id]&&<img src={photos[d.id]} alt={d.name} style={{width:"100%",height:90,objectFit:"cover",display:"block"}}/>}
                <div style={{padding:"11px 13px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
                    <div style={{flex:1,paddingRight:8}}>
                      <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:2}}>
                        <span style={{fontSize:14,fontWeight:900,color:"#2C2C2C"}}>{d.name}</span>
                        {note.visited&&<span style={{fontSize:11}}>✅</span>}
                        {d.kids&&<span style={{fontSize:10,background:"#FCE4EC",color:"#E91E63",borderRadius:7,padding:"1px 5px",fontWeight:700}}>👧 OK</span>}
                      </div>
                      <div style={{fontSize:10,color:"#888"}}>{d.area}{d.drive&&d.drive!=="0"?` · 🚗 ${d.drive}`:d.drive==="0"?" · 📍 프레즈노":""}</div>
                    </div>
                    <div style={{display:"flex",gap:4,alignItems:"center",flexShrink:0}}>
                      {note.rating>0&&<span style={{fontSize:9,color:"#F57F17"}}>{"⭐".repeat(note.rating)}</span>}
                      <button onClick={e=>{e.stopPropagation();toggleWish(d.id);}} style={{background:"none",border:"none",fontSize:16,cursor:"pointer",padding:0,color:isWish(d.id)?"#1565C0":"#ccc"}}>🔖</button>
                    </div>
                  </div>
                  <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:5}}>
                    {d.fee&&<span style={{fontSize:10,background:"#F3E5F5",color:"#6A1B9A",borderRadius:7,padding:"2px 6px"}}>{d.fee}</span>}
                    {d.ageGroup&&<span style={{fontSize:10,background:"#FCE4EC",color:"#C62828",borderRadius:7,padding:"2px 6px"}}>{d.ageGroup}</span>}
                    {(d.tags||[]).slice(0,3).map(t=><span key={t} style={{fontSize:10,background:col+"15",color:col,borderRadius:7,padding:"2px 6px",fontWeight:700}}>{t}</span>)}
                  </div>
                  {d.highlight&&<div style={{fontSize:11,color:"#555",lineHeight:1.4,marginBottom:3}}>⭐ {d.highlight}</div>}
                  {note.note&&<div style={{fontSize:11,color:"#558B2F",background:"#F1F8E9",borderRadius:7,padding:"4px 8px",marginTop:4,lineHeight:1.5}}>📝 {note.note.slice(0,60)}{note.note.length>60?"...":""}</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ══ 상세 모달 ══ */}
      {detailModal&&(()=>{
        const d=detailModal;
        const note=getNote(d.id);
        const catColor=CATEGORIES.find(c=>c.data.some(x=>x.id===d.id))?.color||"#333";
        return(
          <div onClick={()=>setDetailModal(null)} style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.6)",zIndex:1000,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
            <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:"20px 20px 0 0",width:"100%",maxWidth:480,maxHeight:"94vh",overflowY:"auto"}}>
              {/* 헤더 */}
              {photos[d.id]?(
                <div style={{position:"relative"}}>
                  <img src={photos[d.id]} alt={d.name} style={{width:"100%",height:190,objectFit:"cover",display:"block"}}/>
                  <div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom,transparent 40%,rgba(0,0,0,0.65))"}}>
                    <div style={{position:"absolute",bottom:14,left:16,right:50}}>
                      <div style={{fontSize:20,fontWeight:900,color:"#fff"}}>{d.name}</div>
                      <div style={{fontSize:11,color:"rgba(255,255,255,0.8)"}}>{d.area}{d.drive&&d.drive!=="0"?` · 🚗 ${d.drive}`:""}</div>
                    </div>
                  </div>
                  <button onClick={()=>setDetailModal(null)} style={{position:"absolute",top:12,right:12,background:"rgba(0,0,0,0.4)",border:"none",borderRadius:20,width:30,height:30,color:"#fff",fontSize:15,cursor:"pointer"}}>✕</button>
                </div>
              ):(
                <div style={{background:`linear-gradient(135deg,${catColor},${catColor}CC)`,padding:"22px 18px 16px",borderRadius:"20px 20px 0 0"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                    <div>
                      <div style={{fontSize:11,color:"rgba(255,255,255,0.6)",marginBottom:2}}>{d.area}{d.drive&&d.drive!=="0"?` · 🚗 ${d.drive}`:""}</div>
                      <div style={{fontSize:20,fontWeight:900,color:"#fff"}}>{d.name}</div>
                    </div>
                    <button onClick={()=>setDetailModal(null)} style={{background:"rgba(255,255,255,0.2)",border:"none",borderRadius:20,width:30,height:30,color:"#fff",fontSize:15,cursor:"pointer"}}>✕</button>
                  </div>
                </div>
              )}

              <div style={{padding:"16px 18px 40px"}}>
                {/* 사진 */}
                <label style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,padding:"8px",borderRadius:9,border:"2px dashed #ddd",background:"#F8F7F4",cursor:"pointer",marginBottom:12,fontSize:11,color:"#aaa"}}>
                  {photos[d.id]?"📷 사진 변경":"📷 사진 추가"}
                  <input type="file" accept="image/*" onChange={e=>handlePhoto(d.id,e.target.files[0])} style={{display:"none"}}/>
                </label>

                {/* 기본 정보 */}
                <div style={{background:"#F8F7F4",borderRadius:12,padding:"12px 14px",marginBottom:12}}>
                  <div style={{fontSize:12,fontWeight:700,color:catColor,marginBottom:9}}>ℹ️ 기본 정보</div>
                  <div style={{fontSize:12,color:"#333",lineHeight:1.7,marginBottom:6}}>{d.desc}</div>
                  {[
                    d.address&&["📍 주소",d.address],
                    d.fee&&["🎫 입장료",d.fee],
                    d.season&&["📅 시즌",d.season],
                    d.ageGroup&&["👧 연령",d.ageGroup],
                    d.days&&["🗓️ 권장 일수",d.days],
                    d.stops&&["📍 경유지",d.stops.join(" → ")],
                  ].filter(Boolean).map(([label,val])=>(
                    <div key={label} style={{display:"flex",gap:8,marginBottom:5,alignItems:"flex-start"}}>
                      <span style={{fontSize:10,color:"#888",flexShrink:0,width:65}}>{label}</span>
                      <span style={{fontSize:11,color:"#444",flex:1,lineHeight:1.5}}>{val}</span>
                    </div>
                  ))}
                </div>

                {/* 하이라이트 */}
                {d.highlight&&(
                  <div style={{background:"#FFF8E1",borderRadius:11,padding:"10px 13px",marginBottom:12,border:"1px solid #FFE082"}}>
                    <div style={{fontSize:11,fontWeight:700,color:"#F57F17",marginBottom:4}}>⭐ 하이라이트</div>
                    <div style={{fontSize:12,color:"#333",lineHeight:1.6}}>{d.highlight}</div>
                  </div>
                )}

                {/* 태그 */}
                <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:12}}>
                  {(d.tags||[]).map(t=><span key={t} style={{fontSize:11,background:catColor+"15",color:catColor,borderRadius:8,padding:"3px 9px",fontWeight:700}}>#{t}</span>)}
                  {d.kids&&<span style={{fontSize:11,background:"#FCE4EC",color:"#E91E63",borderRadius:8,padding:"3px 9px",fontWeight:700}}>👧 아이 OK</span>}
                </div>

                {/* 내 기록 */}
                <div style={{background:"#F1F8E9",borderRadius:13,padding:"13px",marginBottom:12}}>
                  <div style={{fontSize:12,fontWeight:700,color:"#2E7D32",marginBottom:10}}>📓 내 기록</div>
                  <div style={{display:"flex",gap:10,marginBottom:9,alignItems:"center",flexWrap:"wrap"}}>
                    <label style={{display:"flex",alignItems:"center",gap:5,cursor:"pointer",fontSize:13}}>
                      <input type="checkbox" checked={!!note.visited} onChange={e=>updateNote(d.id,{visited:e.target.checked})} style={{accentColor:"#2E7D32",width:16,height:16}}/>
                      <span style={{fontWeight:700}}>✅ 다녀왔어요</span>
                    </label>
                    <input type="date" value={note.date||""} onChange={e=>updateNote(d.id,{date:e.target.value})}
                      style={{border:"1px solid #ccc",borderRadius:7,padding:"4px 8px",fontSize:11,outline:"none"}}/>
                  </div>
                  <div style={{display:"flex",gap:4,marginBottom:9,alignItems:"center"}}>
                    <span style={{fontSize:11,color:"#888"}}>평점:</span>
                    {[1,2,3,4,5].map(n=>(
                      <button key={n} onClick={()=>updateNote(d.id,{rating:note.rating===n?0:n})} style={{background:"none",border:"none",fontSize:22,cursor:"pointer",padding:0,opacity:n<=(note.rating||0)?1:0.2}}>⭐</button>
                    ))}
                  </div>
                  <textarea value={note.note||""} onChange={e=>updateNote(d.id,{note:e.target.value})}
                    placeholder={`${d.name} 후기, 팁, 일기...\n\n- 주차 팁\n- 아이들 반응\n- 맛집 정보\n- 다음에 올 때 팁\n- 사진 찍기 좋은 곳`}
                    style={{width:"100%",padding:"10px 12px",borderRadius:10,border:"2px solid #C8E6C9",fontSize:12,outline:"none",resize:"none",minHeight:120,boxSizing:"border-box",lineHeight:1.7,fontFamily:"'Noto Sans KR',sans-serif",background:"#fff"}}/>
                  {note.note&&<div style={{fontSize:10,color:"#aaa",marginTop:4,textAlign:"right"}}>자동 저장됨 ✓</div>}
                </div>

                {/* 위시 + 닫기 */}
                <div style={{display:"flex",gap:8}}>
                  <button onClick={()=>toggleWish(d.id)} style={{flex:1,padding:"12px",borderRadius:11,border:"none",background:isWish(d.id)?catColor:"#F0EDE8",color:isWish(d.id)?"#fff":"#888",fontSize:12,fontWeight:700,cursor:"pointer"}}>
                    {isWish(d.id)?"🔖 위시리스트 있음":"🔖 가고 싶어요"}
                  </button>
                  <button onClick={()=>setDetailModal(null)} style={{flex:1,padding:"12px",background:"#2C2C2C",color:"#fff",border:"none",borderRadius:11,fontSize:12,fontWeight:700,cursor:"pointer"}}>닫기</button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}


// ── 메인 합산 컴포넌트 ──────────────────────────────────
export default function TravelPlanner() {
  const [mainTab, setMainTab] = useState("national");
  return (
    <div style={{fontFamily:"'Noto Sans KR',sans-serif",maxWidth:480,margin:"0 auto"}}>
      {/* 상단 탭 */}
      <div style={{display:"flex",background:"#1A1A2E",position:"sticky",top:0,zIndex:999}}>
        <button onClick={()=>setMainTab("national")} style={{
          flex:1,padding:"13px 8px",border:"none",cursor:"pointer",
          background:mainTab==="national"?"#1A237E":"transparent",
          color:mainTab==="national"?"#fff":"#888",
          fontSize:11,fontWeight:700,
          borderBottom:mainTab==="national"?"3px solid #FFD54F":"3px solid transparent",
        }}>🏞️ 국립공원</button>
        <button onClick={()=>setMainTab("ca")} style={{
          flex:1,padding:"13px 8px",border:"none",cursor:"pointer",
          background:mainTab==="ca"?"#B71C1C":"transparent",
          color:mainTab==="ca"?"#fff":"#888",
          fontSize:11,fontWeight:700,
          borderBottom:mainTab==="ca"?"3px solid #FFD54F":"3px solid transparent",
        }}>🌴 캘리포니아</button>
      </div>
      {mainTab==="national" && <NationalParksTab/>}
      {mainTab==="ca" && <CATravel/>}
    </div>
  );
}
