import { useState, useEffect, useRef } from "react";

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

const DEFAULT_ROUTINES = {
  daily: [
    {id:"d1", task:"강아지 패드 갈기", icon:"🐶", time:"아침"},
    {id:"d2", task:"영수증 및 지출 내역 정리", icon:"💰", time:"저녁"},
    {id:"d3", task:"설거지 & 싱크대 정리", icon:"🍽️", time:"식후"},
    {id:"d4", task:"식탁 닦기", icon:"🧹", time:"식후"},
  ],
  weekday: [
    {id:"wd1", task:"아이들 수업 사진 밴드에 올리기", icon:"📸", time:"수업 후"},
  ],
  mon: [{id:"m1", task:"다이닝룸 정리", icon:"🪑", time:"오전"}],
  tue: [{id:"t1", task:"아이들 화장실 청소", icon:"🚿", time:"오전"}],
  wed: [
    {id:"w1", task:"안방 화장실 청소", icon:"🛁", time:"오전"},
    {id:"w2", task:"빨래하기", icon:"🧺", time:"오전"},
  ],
  thu: [{id:"th1", task:"2층 아이들 방 정리", icon:"🛏️", time:"오전"}],
  fri: [
    {id:"f1", task:"학원 다음주 스케줄 확인 및 준비물 사기", icon:"📚", time:"오후"},
    {id:"f2", task:"1층 화장실 청소", icon:"🚽", time:"오전"},
  ],
  sat: [
    {id:"s1", task:"일주일 식단 짜기", icon:"🍽️", time:"오전"},
    {id:"s2", task:"거실 정리", icon:"🛋️", time:"오전"},
  ],
  sun: [
    {id:"su1", task:"냉장고 정리 및 재고 정리", icon:"🧊", time:"오전"},
    {id:"su2", task:"부엌 대청소", icon:"🍳", time:"오전"},
    {id:"su3", task:"빨래하기", icon:"🧺", time:"오전"},
  ],
};

const DAY_MAP = {0:"sun",1:"mon",2:"tue",3:"wed",4:"thu",5:"fri",6:"sat"};
const DAY_LABEL = {mon:"월요일",tue:"화요일",wed:"수요일",thu:"목요일",fri:"금요일",sat:"토요일",sun:"일요일",daily:"매일",weekday:"매일 (월~토)"};
const DAY_COLOR = {mon:"#1565C0",tue:"#6A1B9A",wed:"#00695C",thu:"#E65100",fri:"#C62828",sat:"#2E7D32",sun:"#4E342E",daily:"#37474F",weekday:"#0277BD"};
const ICONS = ["✅","🐶","💰","🧹","🛁","🚿","🚽","🧺","👕","🍽️","🛋️","🛏️","🪑","🗑️","📸","📚","🧊","🍳","🌿","💊","🐱","🌱","💡","📦","🔧","🪟","🧽","🫧","🪣","🌸"];


const CALENDAR_DATA = [
  {month:4,name:"4월",days:30,weeks:{
    1:[{day:1,dow:"수",date:"2026-04-01",dowIdx:2},{day:2,dow:"목",date:"2026-04-02",dowIdx:3},{day:3,dow:"금",date:"2026-04-03",dowIdx:4},{day:4,dow:"토",date:"2026-04-04",dowIdx:5},{day:5,dow:"일",date:"2026-04-05",dowIdx:6},{day:6,dow:"월",date:"2026-04-06",dowIdx:0},{day:7,dow:"화",date:"2026-04-07",dowIdx:1}],
    2:[{day:8,dow:"수",date:"2026-04-08",dowIdx:2},{day:9,dow:"목",date:"2026-04-09",dowIdx:3},{day:10,dow:"금",date:"2026-04-10",dowIdx:4},{day:11,dow:"토",date:"2026-04-11",dowIdx:5},{day:12,dow:"일",date:"2026-04-12",dowIdx:6},{day:13,dow:"월",date:"2026-04-13",dowIdx:0},{day:14,dow:"화",date:"2026-04-14",dowIdx:1}],
    3:[{day:15,dow:"수",date:"2026-04-15",dowIdx:2},{day:16,dow:"목",date:"2026-04-16",dowIdx:3},{day:17,dow:"금",date:"2026-04-17",dowIdx:4},{day:18,dow:"토",date:"2026-04-18",dowIdx:5},{day:19,dow:"일",date:"2026-04-19",dowIdx:6},{day:20,dow:"월",date:"2026-04-20",dowIdx:0},{day:21,dow:"화",date:"2026-04-21",dowIdx:1}],
    4:[{day:22,dow:"수",date:"2026-04-22",dowIdx:2},{day:23,dow:"목",date:"2026-04-23",dowIdx:3},{day:24,dow:"금",date:"2026-04-24",dowIdx:4},{day:25,dow:"토",date:"2026-04-25",dowIdx:5},{day:26,dow:"일",date:"2026-04-26",dowIdx:6},{day:27,dow:"월",date:"2026-04-27",dowIdx:0},{day:28,dow:"화",date:"2026-04-28",dowIdx:1}],
    5:[{day:29,dow:"수",date:"2026-04-29",dowIdx:2},{day:30,dow:"목",date:"2026-04-30",dowIdx:3}],
  }},
  {month:5,name:"5월",days:31,weeks:{
    1:[{day:1,dow:"금",date:"2026-05-01",dowIdx:4},{day:2,dow:"토",date:"2026-05-02",dowIdx:5},{day:3,dow:"일",date:"2026-05-03",dowIdx:6},{day:4,dow:"월",date:"2026-05-04",dowIdx:0},{day:5,dow:"화",date:"2026-05-05",dowIdx:1},{day:6,dow:"수",date:"2026-05-06",dowIdx:2},{day:7,dow:"목",date:"2026-05-07",dowIdx:3}],
    2:[{day:8,dow:"금",date:"2026-05-08",dowIdx:4},{day:9,dow:"토",date:"2026-05-09",dowIdx:5},{day:10,dow:"일",date:"2026-05-10",dowIdx:6},{day:11,dow:"월",date:"2026-05-11",dowIdx:0},{day:12,dow:"화",date:"2026-05-12",dowIdx:1},{day:13,dow:"수",date:"2026-05-13",dowIdx:2},{day:14,dow:"목",date:"2026-05-14",dowIdx:3}],
    3:[{day:15,dow:"금",date:"2026-05-15",dowIdx:4},{day:16,dow:"토",date:"2026-05-16",dowIdx:5},{day:17,dow:"일",date:"2026-05-17",dowIdx:6},{day:18,dow:"월",date:"2026-05-18",dowIdx:0},{day:19,dow:"화",date:"2026-05-19",dowIdx:1},{day:20,dow:"수",date:"2026-05-20",dowIdx:2},{day:21,dow:"목",date:"2026-05-21",dowIdx:3}],
    4:[{day:22,dow:"금",date:"2026-05-22",dowIdx:4},{day:23,dow:"토",date:"2026-05-23",dowIdx:5},{day:24,dow:"일",date:"2026-05-24",dowIdx:6},{day:25,dow:"월",date:"2026-05-25",dowIdx:0},{day:26,dow:"화",date:"2026-05-26",dowIdx:1},{day:27,dow:"수",date:"2026-05-27",dowIdx:2},{day:28,dow:"목",date:"2026-05-28",dowIdx:3}],
    5:[{day:29,dow:"금",date:"2026-05-29",dowIdx:4},{day:30,dow:"토",date:"2026-05-30",dowIdx:5},{day:31,dow:"일",date:"2026-05-31",dowIdx:6}],
  }},
  {month:6,name:"6월",days:30,weeks:{
    1:[{day:1,dow:"월",date:"2026-06-01",dowIdx:0},{day:2,dow:"화",date:"2026-06-02",dowIdx:1},{day:3,dow:"수",date:"2026-06-03",dowIdx:2},{day:4,dow:"목",date:"2026-06-04",dowIdx:3},{day:5,dow:"금",date:"2026-06-05",dowIdx:4},{day:6,dow:"토",date:"2026-06-06",dowIdx:5},{day:7,dow:"일",date:"2026-06-07",dowIdx:6}],
    2:[{day:8,dow:"월",date:"2026-06-08",dowIdx:0},{day:9,dow:"화",date:"2026-06-09",dowIdx:1},{day:10,dow:"수",date:"2026-06-10",dowIdx:2},{day:11,dow:"목",date:"2026-06-11",dowIdx:3},{day:12,dow:"금",date:"2026-06-12",dowIdx:4},{day:13,dow:"토",date:"2026-06-13",dowIdx:5},{day:14,dow:"일",date:"2026-06-14",dowIdx:6}],
    3:[{day:15,dow:"월",date:"2026-06-15",dowIdx:0},{day:16,dow:"화",date:"2026-06-16",dowIdx:1},{day:17,dow:"수",date:"2026-06-17",dowIdx:2},{day:18,dow:"목",date:"2026-06-18",dowIdx:3},{day:19,dow:"금",date:"2026-06-19",dowIdx:4},{day:20,dow:"토",date:"2026-06-20",dowIdx:5},{day:21,dow:"일",date:"2026-06-21",dowIdx:6}],
    4:[{day:22,dow:"월",date:"2026-06-22",dowIdx:0},{day:23,dow:"화",date:"2026-06-23",dowIdx:1},{day:24,dow:"수",date:"2026-06-24",dowIdx:2},{day:25,dow:"목",date:"2026-06-25",dowIdx:3},{day:26,dow:"금",date:"2026-06-26",dowIdx:4},{day:27,dow:"토",date:"2026-06-27",dowIdx:5},{day:28,dow:"일",date:"2026-06-28",dowIdx:6}],
    5:[{day:29,dow:"월",date:"2026-06-29",dowIdx:0},{day:30,dow:"화",date:"2026-06-30",dowIdx:1}],
  }},
  {month:7,name:"7월",days:31,weeks:{
    1:[{day:1,dow:"수",date:"2026-07-01",dowIdx:2},{day:2,dow:"목",date:"2026-07-02",dowIdx:3},{day:3,dow:"금",date:"2026-07-03",dowIdx:4},{day:4,dow:"토",date:"2026-07-04",dowIdx:5},{day:5,dow:"일",date:"2026-07-05",dowIdx:6},{day:6,dow:"월",date:"2026-07-06",dowIdx:0},{day:7,dow:"화",date:"2026-07-07",dowIdx:1}],
    2:[{day:8,dow:"수",date:"2026-07-08",dowIdx:2},{day:9,dow:"목",date:"2026-07-09",dowIdx:3},{day:10,dow:"금",date:"2026-07-10",dowIdx:4},{day:11,dow:"토",date:"2026-07-11",dowIdx:5},{day:12,dow:"일",date:"2026-07-12",dowIdx:6},{day:13,dow:"월",date:"2026-07-13",dowIdx:0},{day:14,dow:"화",date:"2026-07-14",dowIdx:1}],
    3:[{day:15,dow:"수",date:"2026-07-15",dowIdx:2},{day:16,dow:"목",date:"2026-07-16",dowIdx:3},{day:17,dow:"금",date:"2026-07-17",dowIdx:4},{day:18,dow:"토",date:"2026-07-18",dowIdx:5},{day:19,dow:"일",date:"2026-07-19",dowIdx:6},{day:20,dow:"월",date:"2026-07-20",dowIdx:0},{day:21,dow:"화",date:"2026-07-21",dowIdx:1}],
    4:[{day:22,dow:"수",date:"2026-07-22",dowIdx:2},{day:23,dow:"목",date:"2026-07-23",dowIdx:3},{day:24,dow:"금",date:"2026-07-24",dowIdx:4},{day:25,dow:"토",date:"2026-07-25",dowIdx:5},{day:26,dow:"일",date:"2026-07-26",dowIdx:6},{day:27,dow:"월",date:"2026-07-27",dowIdx:0},{day:28,dow:"화",date:"2026-07-28",dowIdx:1}],
    5:[{day:29,dow:"수",date:"2026-07-29",dowIdx:2},{day:30,dow:"목",date:"2026-07-30",dowIdx:3},{day:31,dow:"금",date:"2026-07-31",dowIdx:4}],
  }},
  {month:8,name:"8월",days:31,weeks:{
    1:[{day:1,dow:"토",date:"2026-08-01",dowIdx:5},{day:2,dow:"일",date:"2026-08-02",dowIdx:6},{day:3,dow:"월",date:"2026-08-03",dowIdx:0},{day:4,dow:"화",date:"2026-08-04",dowIdx:1},{day:5,dow:"수",date:"2026-08-05",dowIdx:2},{day:6,dow:"목",date:"2026-08-06",dowIdx:3},{day:7,dow:"금",date:"2026-08-07",dowIdx:4}],
    2:[{day:8,dow:"토",date:"2026-08-08",dowIdx:5},{day:9,dow:"일",date:"2026-08-09",dowIdx:6},{day:10,dow:"월",date:"2026-08-10",dowIdx:0},{day:11,dow:"화",date:"2026-08-11",dowIdx:1},{day:12,dow:"수",date:"2026-08-12",dowIdx:2},{day:13,dow:"목",date:"2026-08-13",dowIdx:3},{day:14,dow:"금",date:"2026-08-14",dowIdx:4}],
    3:[{day:15,dow:"토",date:"2026-08-15",dowIdx:5},{day:16,dow:"일",date:"2026-08-16",dowIdx:6},{day:17,dow:"월",date:"2026-08-17",dowIdx:0},{day:18,dow:"화",date:"2026-08-18",dowIdx:1},{day:19,dow:"수",date:"2026-08-19",dowIdx:2},{day:20,dow:"목",date:"2026-08-20",dowIdx:3},{day:21,dow:"금",date:"2026-08-21",dowIdx:4}],
    4:[{day:22,dow:"토",date:"2026-08-22",dowIdx:5},{day:23,dow:"일",date:"2026-08-23",dowIdx:6},{day:24,dow:"월",date:"2026-08-24",dowIdx:0},{day:25,dow:"화",date:"2026-08-25",dowIdx:1},{day:26,dow:"수",date:"2026-08-26",dowIdx:2},{day:27,dow:"목",date:"2026-08-27",dowIdx:3},{day:28,dow:"금",date:"2026-08-28",dowIdx:4}],
    5:[{day:29,dow:"토",date:"2026-08-29",dowIdx:5},{day:30,dow:"일",date:"2026-08-30",dowIdx:6},{day:31,dow:"월",date:"2026-08-31",dowIdx:0}],
  }},
  {month:9,name:"9월",days:30,weeks:{
    1:[{day:1,dow:"화",date:"2026-09-01",dowIdx:1},{day:2,dow:"수",date:"2026-09-02",dowIdx:2},{day:3,dow:"목",date:"2026-09-03",dowIdx:3},{day:4,dow:"금",date:"2026-09-04",dowIdx:4},{day:5,dow:"토",date:"2026-09-05",dowIdx:5},{day:6,dow:"일",date:"2026-09-06",dowIdx:6},{day:7,dow:"월",date:"2026-09-07",dowIdx:0}],
    2:[{day:8,dow:"화",date:"2026-09-08",dowIdx:1},{day:9,dow:"수",date:"2026-09-09",dowIdx:2},{day:10,dow:"목",date:"2026-09-10",dowIdx:3},{day:11,dow:"금",date:"2026-09-11",dowIdx:4},{day:12,dow:"토",date:"2026-09-12",dowIdx:5},{day:13,dow:"일",date:"2026-09-13",dowIdx:6},{day:14,dow:"월",date:"2026-09-14",dowIdx:0}],
    3:[{day:15,dow:"화",date:"2026-09-15",dowIdx:1},{day:16,dow:"수",date:"2026-09-16",dowIdx:2},{day:17,dow:"목",date:"2026-09-17",dowIdx:3},{day:18,dow:"금",date:"2026-09-18",dowIdx:4},{day:19,dow:"토",date:"2026-09-19",dowIdx:5},{day:20,dow:"일",date:"2026-09-20",dowIdx:6},{day:21,dow:"월",date:"2026-09-21",dowIdx:0}],
    4:[{day:22,dow:"화",date:"2026-09-22",dowIdx:1},{day:23,dow:"수",date:"2026-09-23",dowIdx:2},{day:24,dow:"목",date:"2026-09-24",dowIdx:3},{day:25,dow:"금",date:"2026-09-25",dowIdx:4},{day:26,dow:"토",date:"2026-09-26",dowIdx:5},{day:27,dow:"일",date:"2026-09-27",dowIdx:6},{day:28,dow:"월",date:"2026-09-28",dowIdx:0}],
    5:[{day:29,dow:"화",date:"2026-09-29",dowIdx:1},{day:30,dow:"수",date:"2026-09-30",dowIdx:2}],
  }},
  {month:10,name:"10월",days:31,weeks:{
    1:[{day:1,dow:"목",date:"2026-10-01",dowIdx:3},{day:2,dow:"금",date:"2026-10-02",dowIdx:4},{day:3,dow:"토",date:"2026-10-03",dowIdx:5},{day:4,dow:"일",date:"2026-10-04",dowIdx:6},{day:5,dow:"월",date:"2026-10-05",dowIdx:0},{day:6,dow:"화",date:"2026-10-06",dowIdx:1},{day:7,dow:"수",date:"2026-10-07",dowIdx:2}],
    2:[{day:8,dow:"목",date:"2026-10-08",dowIdx:3},{day:9,dow:"금",date:"2026-10-09",dowIdx:4},{day:10,dow:"토",date:"2026-10-10",dowIdx:5},{day:11,dow:"일",date:"2026-10-11",dowIdx:6},{day:12,dow:"월",date:"2026-10-12",dowIdx:0},{day:13,dow:"화",date:"2026-10-13",dowIdx:1},{day:14,dow:"수",date:"2026-10-14",dowIdx:2}],
    3:[{day:15,dow:"목",date:"2026-10-15",dowIdx:3},{day:16,dow:"금",date:"2026-10-16",dowIdx:4},{day:17,dow:"토",date:"2026-10-17",dowIdx:5},{day:18,dow:"일",date:"2026-10-18",dowIdx:6},{day:19,dow:"월",date:"2026-10-19",dowIdx:0},{day:20,dow:"화",date:"2026-10-20",dowIdx:1},{day:21,dow:"수",date:"2026-10-21",dowIdx:2}],
    4:[{day:22,dow:"목",date:"2026-10-22",dowIdx:3},{day:23,dow:"금",date:"2026-10-23",dowIdx:4},{day:24,dow:"토",date:"2026-10-24",dowIdx:5},{day:25,dow:"일",date:"2026-10-25",dowIdx:6},{day:26,dow:"월",date:"2026-10-26",dowIdx:0},{day:27,dow:"화",date:"2026-10-27",dowIdx:1},{day:28,dow:"수",date:"2026-10-28",dowIdx:2}],
    5:[{day:29,dow:"목",date:"2026-10-29",dowIdx:3},{day:30,dow:"금",date:"2026-10-30",dowIdx:4},{day:31,dow:"토",date:"2026-10-31",dowIdx:5}],
  }},
  {month:11,name:"11월",days:30,weeks:{
    1:[{day:1,dow:"일",date:"2026-11-01",dowIdx:6},{day:2,dow:"월",date:"2026-11-02",dowIdx:0},{day:3,dow:"화",date:"2026-11-03",dowIdx:1},{day:4,dow:"수",date:"2026-11-04",dowIdx:2},{day:5,dow:"목",date:"2026-11-05",dowIdx:3},{day:6,dow:"금",date:"2026-11-06",dowIdx:4},{day:7,dow:"토",date:"2026-11-07",dowIdx:5}],
    2:[{day:8,dow:"일",date:"2026-11-08",dowIdx:6},{day:9,dow:"월",date:"2026-11-09",dowIdx:0},{day:10,dow:"화",date:"2026-11-10",dowIdx:1},{day:11,dow:"수",date:"2026-11-11",dowIdx:2},{day:12,dow:"목",date:"2026-11-12",dowIdx:3},{day:13,dow:"금",date:"2026-11-13",dowIdx:4},{day:14,dow:"토",date:"2026-11-14",dowIdx:5}],
    3:[{day:15,dow:"일",date:"2026-11-15",dowIdx:6},{day:16,dow:"월",date:"2026-11-16",dowIdx:0},{day:17,dow:"화",date:"2026-11-17",dowIdx:1},{day:18,dow:"수",date:"2026-11-18",dowIdx:2},{day:19,dow:"목",date:"2026-11-19",dowIdx:3},{day:20,dow:"금",date:"2026-11-20",dowIdx:4},{day:21,dow:"토",date:"2026-11-21",dowIdx:5}],
    4:[{day:22,dow:"일",date:"2026-11-22",dowIdx:6},{day:23,dow:"월",date:"2026-11-23",dowIdx:0},{day:24,dow:"화",date:"2026-11-24",dowIdx:1},{day:25,dow:"수",date:"2026-11-25",dowIdx:2},{day:26,dow:"목",date:"2026-11-26",dowIdx:3},{day:27,dow:"금",date:"2026-11-27",dowIdx:4},{day:28,dow:"토",date:"2026-11-28",dowIdx:5}],
    5:[{day:29,dow:"일",date:"2026-11-29",dowIdx:6},{day:30,dow:"월",date:"2026-11-30",dowIdx:0}],
  }},
  {month:12,name:"12월",days:31,weeks:{
    1:[{day:1,dow:"화",date:"2026-12-01",dowIdx:1},{day:2,dow:"수",date:"2026-12-02",dowIdx:2},{day:3,dow:"목",date:"2026-12-03",dowIdx:3},{day:4,dow:"금",date:"2026-12-04",dowIdx:4},{day:5,dow:"토",date:"2026-12-05",dowIdx:5},{day:6,dow:"일",date:"2026-12-06",dowIdx:6},{day:7,dow:"월",date:"2026-12-07",dowIdx:0}],
    2:[{day:8,dow:"화",date:"2026-12-08",dowIdx:1},{day:9,dow:"수",date:"2026-12-09",dowIdx:2},{day:10,dow:"목",date:"2026-12-10",dowIdx:3},{day:11,dow:"금",date:"2026-12-11",dowIdx:4},{day:12,dow:"토",date:"2026-12-12",dowIdx:5},{day:13,dow:"일",date:"2026-12-13",dowIdx:6},{day:14,dow:"월",date:"2026-12-14",dowIdx:0}],
    3:[{day:15,dow:"화",date:"2026-12-15",dowIdx:1},{day:16,dow:"수",date:"2026-12-16",dowIdx:2},{day:17,dow:"목",date:"2026-12-17",dowIdx:3},{day:18,dow:"금",date:"2026-12-18",dowIdx:4},{day:19,dow:"토",date:"2026-12-19",dowIdx:5},{day:20,dow:"일",date:"2026-12-20",dowIdx:6},{day:21,dow:"월",date:"2026-12-21",dowIdx:0}],
    4:[{day:22,dow:"화",date:"2026-12-22",dowIdx:1},{day:23,dow:"수",date:"2026-12-23",dowIdx:2},{day:24,dow:"목",date:"2026-12-24",dowIdx:3},{day:25,dow:"금",date:"2026-12-25",dowIdx:4},{day:26,dow:"토",date:"2026-12-26",dowIdx:5},{day:27,dow:"일",date:"2026-12-27",dowIdx:6},{day:28,dow:"월",date:"2026-12-28",dowIdx:0}],
    5:[{day:29,dow:"화",date:"2026-12-29",dowIdx:1},{day:30,dow:"수",date:"2026-12-30",dowIdx:2},{day:31,dow:"목",date:"2026-12-31",dowIdx:3}],
  }},
];

const DOW_COLORS = {
  "월":"#1565C0","화":"#6A1B9A","수":"#00695C",
  "목":"#E65100","금":"#C62828","토":"#2E7D32","일":"#B71C1C"
};
const MONTH_COLORS = ["","","","","#E53935","#E91E63","#9C27B0","#3F51B5","#2196F3","#009688","#FF9800","#795548","#607D8B"];


function RoutineTab({routines,setRoutines,checked,setChecked,todos,setTodos}) {
  const [tab, setTab] = useState("today");
  const [dayOffset, setDayOffset] = useState(0);   // 날짜 오프셋 (0=오늘)
  const [monthViewMonth, setMonthViewMonth] = useState(new Date().getMonth()+1); // 월별 보기
  const [todoInput, setTodoInput] = useState("");
  const [addModal, setAddModal] = useState(null);
  const [addForm, setAddForm] = useState({task:"",icon:"✅",time:""});
  const [editItem, setEditItem] = useState(null);
  const [editForm, setEditForm] = useState({task:"",icon:"",time:""});


  const today = new Date();
  const todayStr = today.toISOString().slice(0,10);
  const todayDayKey = DAY_MAP[today.getDay()];
  const isWeekday = today.getDay()!==0;

  const todayRoutines = [
    ...routines.daily.map(r=>({...r,dayKey:"daily"})),
    ...(isWeekday ? routines.weekday.map(r=>({...r,dayKey:"weekday"})) : []),
    ...(routines[todayDayKey]||[]).map(r=>({...r,dayKey:todayDayKey})),
  ];

  const checkKey=(id)=>`${todayStr}_${id}`;
  const isChecked=(id)=>!!checked[checkKey(id)];
  const toggleCheck=(id)=>setChecked(p=>({...p,[checkKey(id)]:!p[checkKey(id)]}));
  const doneCount=todayRoutines.filter(r=>isChecked(r.id)).length;

  const addRoutineItem=(dayKey)=>{
    if(!addForm.task.trim()) return;
    const item={id:dayKey+"_"+Date.now(),task:addForm.task,icon:addForm.icon||"✅",time:addForm.time};
    setRoutines(p=>({...p,[dayKey]:[...(p[dayKey]||[]),item]}));
    setAddForm({task:"",icon:"✅",time:""});
    setAddModal(null);
  };

  const deleteRoutineItem=(dayKey,id)=>setRoutines(p=>({...p,[dayKey]:(p[dayKey]||[]).filter(x=>x.id!==id)}));

  const saveEdit=()=>{
    if(!editItem||!editForm.task.trim()) return;
    setRoutines(p=>({...p,[editItem.dayKey]:(p[editItem.dayKey]||[]).map(x=>x.id===editItem.item.id?{...x,...editForm}:x)}));
    setEditItem(null);
  };

  const addTodo=()=>{
    if(!todoInput.trim()) return;
    setTodos(p=>[...p,{id:Date.now().toString(),text:todoInput.trim(),done:false}]);
    setTodoInput("");
  };

  const DayBlock=({dayKey,items})=>(
    <div style={{background:"#fff",borderRadius:13,overflow:"hidden",marginBottom:10,boxShadow:"0 1px 6px rgba(0,0,0,0.07)"}}>
      <div style={{padding:"10px 14px",background:DAY_COLOR[dayKey],display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span style={{fontSize:13,fontWeight:700,color:"#fff"}}>{DAY_LABEL[dayKey]}</span>
        <button onClick={()=>{setAddModal(dayKey);setAddForm({task:"",icon:"✅",time:""}); }} style={{padding:"4px 10px",borderRadius:8,border:"none",background:"rgba(255,255,255,0.2)",color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer"}}>+ 추가</button>
      </div>
      <div style={{padding:"8px 10px",display:"flex",flexDirection:"column",gap:5}}>
        {(items||[]).length===0&&<div style={{fontSize:11,color:"#ccc",padding:"4px"}}>항목 없음</div>}
        {(items||[]).map(item=>(
          <div key={item.id} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 10px",background:"#F8F7F4",borderRadius:9}}>
            <span style={{fontSize:16}}>{item.icon}</span>
            <div style={{flex:1}}>
              <div style={{fontSize:13,fontWeight:600,color:"#2C2C2C"}}>{item.task}</div>
              {item.time&&<div style={{fontSize:10,color:"#aaa"}}>{item.time}</div>}
            </div>
            <button onClick={()=>{setEditItem({dayKey,item});setEditForm({task:item.task,icon:item.icon,time:item.time||""});}} style={{width:26,height:26,borderRadius:7,border:"none",background:"#E3F2FD",color:"#1565C0",fontSize:12,cursor:"pointer"}}>✎</button>
            <button onClick={()=>deleteRoutineItem(dayKey,item.id)} style={{width:26,height:26,borderRadius:7,border:"none",background:"#FFEBEE",color:"#C62828",fontSize:14,cursor:"pointer",fontWeight:900}}>×</button>
          </div>
        ))}
      </div>
    </div>
  );

  const IconPicker=({value,onChange})=>(
    <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:10}}>
      {ICONS.map(ic=>(
        <button key={ic} onClick={()=>onChange(ic)} style={{width:36,height:36,borderRadius:9,border:`2px solid ${value===ic?"#37474F":"#E8E3DC"}`,background:value===ic?"#ECEFF1":"#fff",fontSize:18,cursor:"pointer"}}>{ic}</button>
      ))}
    </div>
  );

  return(
    <div style={{fontFamily:"'Noto Sans KR',sans-serif",background:"#F5F3EF",minHeight:"100vh",maxWidth:480,margin:"0 auto",paddingBottom:70}}>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900&display=swap" rel="stylesheet"/>

            {/* 날짜 카드 */}
      <div style={{background:"#fff",borderBottom:"2px solid #F0EDE8"}}>
        <div style={{padding:"14px 16px 10px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <div style={{fontSize:10,color:"#aaa",letterSpacing:2,marginBottom:2}}>TODAY</div>
            <div style={{fontSize:21,fontWeight:900,color:"#2C2440",display:"flex",alignItems:"baseline",gap:8}}>
              {today.getMonth()+1}월 {today.getDate()}일
              <span style={{fontSize:16,fontWeight:700,color:{0:"#B71C1C",1:"#1565C0",2:"#6A1B9A",3:"#00695C",4:"#E65100",5:"#C62828",6:"#2E7D32"}[today.getDay()]}}>
                {["일","월","화","수","목","금","토"][today.getDay()]}요일
              </span>
            </div>
            <div style={{fontSize:11,color:"#888",marginTop:2}}>2026년 · 오늘 <span style={{fontWeight:700,color:"#4CAF50"}}>{doneCount}</span> / {todayRoutines.length} 완료</div>
          </div>
          <div style={{width:52,height:52,borderRadius:"50%",background:`conic-gradient(#4CAF50 ${todayRoutines.length>0?doneCount/todayRoutines.length*360:0}deg,#F0EDE8 0deg)`,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <div style={{width:40,height:40,borderRadius:"50%",background:"#fff",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <span style={{fontSize:12,fontWeight:900,color:"#2C2440"}}>{todayRoutines.length>0?Math.round(doneCount/todayRoutines.length*100):0}%</span>
            </div>
          </div>
        </div>
        <div style={{margin:"0 16px 0",background:"#F0EDE8",borderRadius:4,height:4,overflow:"hidden"}}>
          <div style={{background:"#4CAF50",height:4,borderRadius:4,width:todayRoutines.length>0?(doneCount/todayRoutines.length*100)+"%":"0%",transition:"width 0.4s"}}/>
        </div>
        <div style={{display:"flex"}}>
          {[["today","📋 일별"],["monthly","📆 월별"],["todo","✅ 투두"],["weekly","⚙️ 관리"]].map(([k,l])=>(
            <button key={k} onClick={()=>setTab(k)} style={{flex:1,padding:"10px 3px",border:"none",cursor:"pointer",background:"transparent",color:tab===k?"#2C2440":"#aaa",fontSize:10,fontWeight:700,borderBottom:tab===k?"3px solid #4CAF50":"3px solid transparent"}}>{l}</button>
          ))}
        </div>
      </div>

      <div style={{padding:"14px"}}>

        {tab==="today"&&(()=>{
          // 날짜 계산 (dayOffset 기준)
          const getDateInfo=(offset)=>{
            const d=new Date(); d.setDate(d.getDate()+offset);
            const str=d.toISOString().slice(0,10);
            const dayKey=["sun","mon","tue","wed","thu","fri","sat"][d.getDay()];
            const isWd=d.getDay()!==0;
            const rts=[
              ...routines.daily.map(r=>({...r,dayKey:"daily"})),
              ...(isWd?routines.weekday.map(r=>({...r,dayKey:"weekday"})):[]),
              ...(routines[dayKey]||[]).map(r=>({...r,dayKey})),
            ];
            const ck=(id)=>`${str}_${id}`;
            const done=rts.filter(r=>!!checked[ck(r.id)]).length;
            const dow=["일","월","화","수","목","금","토"][d.getDay()];
            return {d,str,dayKey,rts,ck,done,
              label:offset===0?"오늘":offset===-1?"어제":offset===1?"내일":`${offset>0?"+":""}${offset}일`,
              month:d.getMonth()+1, date:d.getDate(),
              dow, dowColor:{0:"#B71C1C",1:"#1565C0",2:"#6A1B9A",3:"#00695C",4:"#E65100",5:"#C62828",6:"#2E7D32"}[d.getDay()],
            };
          };

          const sel = getDateInfo(dayOffset);
          const prev = getDateInfo(dayOffset-1);
          const next = getDateInfo(dayOffset+1);

          return(
          <div>
            {/* 날짜 네비게이션 */}
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
              <button onClick={()=>setDayOffset(p=>p-1)} style={{width:36,height:36,borderRadius:"50%",border:"none",background:"#fff",boxShadow:"0 1px 4px rgba(0,0,0,0.1)",fontSize:18,cursor:"pointer",fontWeight:700,flexShrink:0}}>‹</button>
              {/* 이전 날 미리보기 */}
              <div onClick={()=>setDayOffset(p=>p-1)} style={{flex:1,padding:"8px 10px",borderRadius:11,background:"#F8F7F4",cursor:"pointer",textAlign:"center",opacity:0.6}}>
                <div style={{fontSize:10,color:"#aaa"}}>{prev.month}/{prev.date} {prev.dow}</div>
                <div style={{fontSize:11,color:"#888"}}>{prev.done}/{prev.rts.length}</div>
              </div>
              {/* 오늘/선택 날 — 탭하면 날짜 직접 선택 */}
              <div style={{flex:2,position:"relative"}}>
                <div onClick={()=>document.getElementById("routine-date-picker").showPicker?document.getElementById("routine-date-picker").showPicker():document.getElementById("routine-date-picker").click()} style={{padding:"10px 12px",borderRadius:13,background:"#2C2440",textAlign:"center",boxShadow:"0 3px 10px rgba(44,36,64,0.2)",cursor:"pointer"}}>
                  <div style={{fontSize:10,color:"rgba(255,255,255,0.5)",marginBottom:1}}>{sel.label} 📅</div>
                  <div style={{fontSize:16,fontWeight:900,color:"#fff"}}>{sel.month}월 {sel.date}일</div>
                  <div style={{fontSize:12,fontWeight:700,color:sel.dowColor}}>{sel.dow}요일</div>
                  <div style={{background:"rgba(255,255,255,0.15)",borderRadius:4,height:4,overflow:"hidden",marginTop:6}}>
                    <div style={{background:"#4CAF50",height:4,borderRadius:4,width:sel.rts.length>0?(sel.done/sel.rts.length*100)+"%":"0%",transition:"width 0.3s"}}/>
                  </div>
                  <div style={{fontSize:10,color:"rgba(255,255,255,0.6)",marginTop:3}}>{sel.done}/{sel.rts.length} 완료</div>
                </div>
                <input id="routine-date-picker" type="date"
                  defaultValue={sel.str}
                  min="2026-01-01" max="2027-12-31"
                  onChange={e=>{
                    if(!e.target.value) return;
                    const picked=new Date(e.target.value+"T12:00:00");
                    const todayD=new Date(); todayD.setHours(12,0,0,0);
                    const diff=Math.round((picked-todayD)/(1000*60*60*24));
                    setDayOffset(diff);
                  }}
                  style={{position:"absolute",opacity:0,width:"100%",height:"100%",top:0,left:0,cursor:"pointer",fontSize:0}}/>
              </div>
              {/* 다음 날 미리보기 */}
              <div onClick={()=>setDayOffset(p=>p+1)} style={{flex:1,padding:"8px 10px",borderRadius:11,background:"#F8F7F4",cursor:"pointer",textAlign:"center",opacity:0.6}}>
                <div style={{fontSize:10,color:"#aaa"}}>{next.month}/{next.date} {next.dow}</div>
                <div style={{fontSize:11,color:"#888"}}>{next.done}/{next.rts.length}</div>
              </div>
              <button onClick={()=>setDayOffset(p=>p+1)} style={{width:36,height:36,borderRadius:"50%",border:"none",background:"#fff",boxShadow:"0 1px 4px rgba(0,0,0,0.1)",fontSize:18,cursor:"pointer",fontWeight:700,flexShrink:0}}>›</button>
            </div>

            {/* 오늘로 돌아가기 */}
            {dayOffset!==0&&(
              <button onClick={()=>setDayOffset(0)} style={{width:"100%",padding:"7px",borderRadius:9,border:"2px solid #A89CC8",background:"#fff",color:"#7C5CBF",fontSize:11,fontWeight:700,cursor:"pointer",marginBottom:10}}>
                📅 오늘로 돌아가기
              </button>
            )}

            {/* 루틴 목록 */}
            {sel.rts.length===0?(
              <div style={{textAlign:"center",padding:"30px",color:"#ccc"}}>
                <div style={{fontSize:32,marginBottom:8}}>🎉</div>
                <div style={{fontSize:13,fontWeight:700}}>{sel.label} 루틴이 없어요!</div>
              </div>
            ):(
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {sel.rts.map(item=>{
                  const done=!!checked[sel.ck(item.id)];
                  const col=DAY_COLOR[item.dayKey]||"#555";
                  return(
                    <div key={item.id} onClick={()=>setChecked(p=>({...p,[sel.ck(item.id)]:!p[sel.ck(item.id)]}))} style={{
                      display:"flex",alignItems:"center",gap:10,padding:"12px 14px",
                      background:done?"#F1F8E9":"#fff",
                      borderRadius:12,boxShadow:"0 1px 5px rgba(0,0,0,0.07)",cursor:"pointer",
                      borderLeft:`4px solid ${done?"#4CAF50":col}`,
                      opacity:done?0.75:1,transition:"all 0.2s",
                    }}>
                      <div style={{width:26,height:26,borderRadius:"50%",background:done?"#4CAF50":col+"22",border:`2px solid ${done?"#4CAF50":col}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:"#fff",fontSize:14,fontWeight:900}}>
                        {done?"✓":""}
                      </div>
                      <span style={{fontSize:18,flexShrink:0}}>{item.icon}</span>
                      <div style={{flex:1}}>
                        <div style={{fontSize:13,fontWeight:600,color:done?"#aaa":"#2C2C2C",textDecoration:done?"line-through":"none"}}>{item.task}</div>
                        <div style={{fontSize:10,color:"#bbb"}}>{DAY_LABEL[item.dayKey]}{item.time&&` · ${item.time}`}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {sel.done>0&&(
              <button onClick={()=>{const n={...checked};sel.rts.forEach(r=>{delete n[sel.ck(r.id)];});setChecked(n);}} style={{width:"100%",marginTop:12,padding:"10px",borderRadius:11,border:"2px solid #E8E3DC",background:"#fff",color:"#aaa",fontSize:12,fontWeight:700,cursor:"pointer"}}>
                🔄 {sel.label} 체크 초기화
              </button>
            )}
          </div>
          );
        })()}

        {/* ══ 월별 루틴 현황 ══ */}
        {tab==="monthly"&&(()=>{
          const MONTHS = ["4월","5월","6월","7월","8월","9월","10월","11월","12월"];
          const MONTH_NUMS = [4,5,6,7,8,9,10,11,12];
          const getDaysInMonth=(y,m)=>new Date(y,m,0).getDate();
          const allDaysInMonth=(month)=>{
            const days=[];
            const dim=getDaysInMonth(2026,month);
            for(let d=1;d<=dim;d++){
              const date=`2026-${String(month).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
              const dayObj=new Date(2026,month-1,d);
              const dow=["일","월","화","수","목","금","토"][dayObj.getDay()];
              const dayKey=["sun","mon","tue","wed","thu","fri","sat"][dayObj.getDay()];
              const isWd=dayObj.getDay()!==0;
              const rts=[
                ...routines.daily.map(r=>({...r,dayKey:"daily"})),
                ...(isWd?routines.weekday.map(r=>({...r,dayKey:"weekday"})):[]),
                ...(routines[dayKey]||[]).map(r=>({...r,dayKey})),
              ];
              const ck=(id)=>`${date}_${id}`;
              const done=rts.filter(r=>!!checked[ck(r.id)]).length;
              days.push({date,day:d,dow,rts,ck,done});
            }
            return days;
          };

          const monthDays=allDaysInMonth(monthViewMonth);
          const totalDone=monthDays.reduce((s,d)=>s+d.done,0);
          const totalPossible=monthDays.reduce((s,d)=>s+d.rts.length,0);
          const completedDays=monthDays.filter(d=>d.rts.length>0&&d.done===d.rts.length).length;
          const activeDays=monthDays.filter(d=>d.rts.length>0).length;

          return(
          <div>
            {/* 월 선택 */}
            <div style={{display:"flex",gap:5,overflowX:"auto",marginBottom:12,paddingBottom:3}}>
              {MONTH_NUMS.map((m,i)=>(
                <button key={m} onClick={()=>setMonthViewMonth(m)} style={{padding:"6px 11px",borderRadius:15,border:"none",flexShrink:0,cursor:"pointer",background:monthViewMonth===m?"#2C2440":"#fff",color:monthViewMonth===m?"#fff":"#888",fontSize:11,fontWeight:700}}>{MONTHS[i]}</button>
              ))}
            </div>

            {/* 월 요약 카드 */}
            <div style={{background:"linear-gradient(135deg,#2C2440,#4A3860)",borderRadius:14,padding:"14px 16px",marginBottom:14,color:"#fff"}}>
              <div style={{fontSize:13,fontWeight:700,marginBottom:8}}>2026년 {monthViewMonth}월 루틴 현황</div>
              <div style={{display:"flex",gap:12}}>
                <div style={{textAlign:"center"}}>
                  <div style={{fontSize:22,fontWeight:900,color:"#80CBC4"}}>{completedDays}</div>
                  <div style={{fontSize:10,color:"rgba(255,255,255,0.6)"}}>완료일</div>
                </div>
                <div style={{textAlign:"center"}}>
                  <div style={{fontSize:22,fontWeight:900,color:"#FFD54F"}}>{activeDays>0?Math.round(totalDone/totalPossible*100):0}%</div>
                  <div style={{fontSize:10,color:"rgba(255,255,255,0.6)"}}>달성률</div>
                </div>
                <div style={{textAlign:"center"}}>
                  <div style={{fontSize:22,fontWeight:900,color:"#CE93D8"}}>{totalDone}</div>
                  <div style={{fontSize:10,color:"rgba(255,255,255,0.6)"}}>완료 항목</div>
                </div>
                <div style={{flex:1,display:"flex",alignItems:"center"}}>
                  <div style={{width:"100%"}}>
                    <div style={{background:"rgba(255,255,255,0.15)",borderRadius:5,height:8,overflow:"hidden"}}>
                      <div style={{background:"#4CAF50",height:8,borderRadius:5,width:(totalPossible>0?totalDone/totalPossible*100:0)+"%",transition:"width 0.4s"}}/>
                    </div>
                    <div style={{fontSize:10,color:"rgba(255,255,255,0.5)",marginTop:3,textAlign:"right"}}>{totalDone}/{totalPossible}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 날짜별 루틴 현황 — 주차로 묶기 */}
            {(()=>{
              const weeks=[];
              for(let i=0;i<monthDays.length;i+=7){
                weeks.push(monthDays.slice(i,i+7));
              }
              return weeks.map((week,wi)=>(
                <div key={wi} style={{background:"#fff",borderRadius:13,overflow:"hidden",marginBottom:10,boxShadow:"0 1px 6px rgba(0,0,0,0.07)"}}>
                  <div style={{padding:"8px 13px",background:"#F4F2F9",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <span style={{fontSize:11,fontWeight:700,color:"#7C5CBF"}}>{wi+1}주차</span>
                    <span style={{fontSize:10,color:"#aaa"}}>{week[0].day}일 ~ {week[week.length-1].day}일</span>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:`repeat(${week.length},1fr)`,padding:"8px 6px",gap:4}}>
                    {week.map(d=>{
                      const pct=d.rts.length>0?d.done/d.rts.length:0;
                      const isToday=d.date===new Date().toISOString().slice(0,10);
                      const allDone=d.rts.length>0&&d.done===d.rts.length;
                      return(
                        <div key={d.date} onClick={()=>{setTab("today");const today=new Date();const target=new Date(d.date);const diff=Math.round((target-today)/(1000*60*60*24));setDayOffset(diff);}} style={{cursor:"pointer",textAlign:"center",padding:"5px 2px"}}>
                          <div style={{fontSize:10,color:d.dow==="일"?"#C62828":d.dow==="토"?"#1565C0":"#888",fontWeight:600}}>{d.dow}</div>
                          <div style={{fontSize:14,fontWeight:900,color:isToday?"#7C5CBF":d.dow==="일"?"#C62828":d.dow==="토"?"#1565C0":"#2C2C2C"}}>{d.day}</div>
                          {d.rts.length>0?(
                            <div style={{marginTop:3}}>
                              <div style={{background:"#F0EDE8",borderRadius:3,height:4,overflow:"hidden"}}>
                                <div style={{background:allDone?"#4CAF50":pct>0?"#80CBC4":"transparent",height:4,borderRadius:3,width:(pct*100)+"%"}}/>
                              </div>
                              <div style={{fontSize:9,color:allDone?"#4CAF50":"#aaa",marginTop:1}}>{d.done}/{d.rts.length}</div>
                            </div>
                          ):(
                            <div style={{fontSize:9,color:"#ddd",marginTop:6}}>-</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ));
            })()}
          </div>
          );
        })()}

        {tab==="todo"&&(
          <div>
            <div style={{display:"flex",gap:8,marginBottom:14}}>
              <input
                  value={todoInput}
                  onChange={e=>setTodoInput(e.target.value)}
                  onKeyDown={e=>{if(e.key==="Enter"){e.preventDefault();addTodo();} }}
                  onKeyUp={e=>{if(e.key==="Enter"){e.preventDefault();} }}
                  placeholder="할 일 입력 후 엔터 ↵"
                  enterKeyHint="done"
                  style={{flex:1,padding:"11px 14px",borderRadius:12,border:"2px solid #E8E3DC",fontSize:13,outline:"none",background:"#fff"}}/>
              <button onClick={addTodo} style={{padding:"11px 16px",borderRadius:12,border:"none",background:"#37474F",color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer",flexShrink:0}}>+</button>
            </div>
            {todos.length===0?(
              <div style={{textAlign:"center",padding:"30px",color:"#ccc"}}>
                <div style={{fontSize:32,marginBottom:8}}>📝</div>
                <div style={{fontSize:13}}>오늘 할 일을 추가해보세요!</div>
              </div>
            ):(
              <div>
                <div style={{display:"flex",flexDirection:"column",gap:7,marginBottom:12}}>
                  {todos.filter(t=>!t.done).map(t=>(
                    <div key={t.id} style={{display:"flex",alignItems:"center",gap:9,padding:"12px 13px",background:"#fff",borderRadius:12,boxShadow:"0 1px 5px rgba(0,0,0,0.07)"}}>
                      <button onClick={()=>setTodos(p=>p.map(x=>x.id===t.id?{...x,done:true}:x))} style={{width:24,height:24,borderRadius:"50%",border:"2px solid #90A4AE",background:"#fff",cursor:"pointer",flexShrink:0}}/>
                      <span style={{flex:1,fontSize:13,fontWeight:500,color:"#2C2C2C"}}>{t.text}</span>
                      <button onClick={()=>setTodos(p=>p.filter(x=>x.id!==t.id))} style={{width:24,height:24,borderRadius:"50%",border:"none",background:"#FFEBEE",color:"#C62828",fontSize:13,cursor:"pointer",fontWeight:900,flexShrink:0}}>×</button>
                    </div>
                  ))}
                </div>
                {todos.filter(t=>t.done).length>0&&(
                  <div>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:7}}>
                      <div style={{fontSize:11,fontWeight:700,color:"#4CAF50"}}>✅ 완료 ({todos.filter(t=>t.done).length})</div>
                      <button onClick={()=>setTodos(p=>p.filter(x=>!x.done))} style={{fontSize:10,color:"#aaa",background:"none",border:"none",cursor:"pointer",fontWeight:700}}>전체 삭제</button>
                    </div>
                    {todos.filter(t=>t.done).map(t=>(
                      <div key={t.id} style={{display:"flex",alignItems:"center",gap:9,padding:"9px 13px",background:"#F1F8E9",borderRadius:10,opacity:0.65,marginBottom:5}}>
                        <button onClick={()=>setTodos(p=>p.map(x=>x.id===t.id?{...x,done:false}:x))} style={{width:22,height:22,borderRadius:"50%",border:"none",background:"#4CAF50",color:"#fff",fontSize:13,cursor:"pointer",flexShrink:0}}>✓</button>
                        <span style={{flex:1,fontSize:12,color:"#aaa",textDecoration:"line-through"}}>{t.text}</span>
                        <button onClick={()=>setTodos(p=>p.filter(x=>x.id!==t.id))} style={{width:22,height:22,borderRadius:"50%",border:"none",background:"#FFEBEE",color:"#C62828",fontSize:11,cursor:"pointer",fontWeight:900,flexShrink:0}}>×</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            <div style={{background:"#E8F5E9",borderRadius:13,padding:"13px",marginTop:16,border:"1px solid #A5D6A7"}}>
              <div style={{fontSize:12,fontWeight:700,color:"#2E7D32",marginBottom:8}}>💡 추가하면 유용한 기능</div>
              {["🛒 장보기 목록 연동 — 재고 부족시 자동 추가","⏰ 알림 설정 — 루틴 시간에 폰 알림","📊 주간 완료율 통계 — 꾸준함 체크","👨‍👩‍👧‍👦 가족 역할 분담 — 누가 어떤 걸","🏆 연속 달성 스트릭 — 며칠 연속 완료","📸 청소 전후 사진 기록","📅 월별 캘린더 — 언제 어떤 청소 했는지"].map((tip,i)=>(
                <div key={i} style={{fontSize:11,color:"#333",padding:"4px 0",borderBottom:i<6?"1px solid #C8E6C9":"none"}}>{tip}</div>
              ))}
            </div>
          </div>
        )}

        {tab==="weekly"&&(
          <div>
            <div style={{fontSize:11,color:"#888",marginBottom:12,background:"#fff",borderRadius:10,padding:"9px 12px"}}>✎ 수정 · × 삭제 · + 추가 버튼으로 편집</div>
            {["daily","weekday","mon","tue","wed","thu","fri","sat","sun"].map(k=><DayBlock key={k} dayKey={k} items={routines[k]}/>)}
            <button onClick={()=>{if(window.confirm("기본 루틴으로 초기화할까요?"))setRoutines(DEFAULT_ROUTINES);}} style={{width:"100%",padding:"11px",borderRadius:11,border:"2px solid #FFEBEE",background:"#fff",color:"#C62828",fontSize:12,fontWeight:700,cursor:"pointer",marginTop:4}}>🔄 기본값으로 초기화</button>
          </div>
        )}
      </div>

      {addModal&&(
        <div onClick={()=>setAddModal(null)} style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.55)",zIndex:1000,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
          <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:"20px 20px 0 0",padding:"22px 18px 40px",width:"100%",maxWidth:480,maxHeight:"85vh",overflowY:"auto"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <div style={{fontSize:17,fontWeight:900}}>+ {DAY_LABEL[addModal]} 추가</div>
              <button onClick={()=>setAddModal(null)} style={{background:"#F4F2F9",border:"none",borderRadius:20,width:30,height:30,fontSize:15,cursor:"pointer"}}>✕</button>
            </div>
            <div style={{fontSize:11,fontWeight:700,color:"#666",marginBottom:6}}>아이콘</div>
            <IconPicker value={addForm.icon} onChange={ic=>setAddForm(p=>({...p,icon:ic}))}/>
            <div style={{marginBottom:10}}>
              <div style={{fontSize:11,fontWeight:700,color:"#666",marginBottom:5}}>할 일 *</div>
              <input value={addForm.task} onChange={e=>setAddForm(p=>({...p,task:e.target.value}))} placeholder="예: 거실 청소"
                style={{width:"100%",padding:"10px 12px",borderRadius:10,border:"2px solid #E8E3DC",fontSize:14,outline:"none",boxSizing:"border-box"}}/>
            </div>
            <div style={{marginBottom:14}}>
              <div style={{fontSize:11,fontWeight:700,color:"#666",marginBottom:5}}>시간 (선택)</div>
              <input value={addForm.time} onChange={e=>setAddForm(p=>({...p,time:e.target.value}))} placeholder="예: 오전, 저녁"
                style={{width:"100%",padding:"9px 12px",borderRadius:10,border:"2px solid #E8E3DC",fontSize:13,outline:"none",boxSizing:"border-box"}}/>
            </div>
            <button onClick={()=>addRoutineItem(addModal)} style={{width:"100%",padding:"13px",borderRadius:12,border:"none",background:"#37474F",color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer"}}>저장</button>
          </div>
        </div>
      )}

      {editItem&&(
        <div onClick={()=>setEditItem(null)} style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.55)",zIndex:1000,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
          <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:"20px 20px 0 0",padding:"22px 18px 40px",width:"100%",maxWidth:480,maxHeight:"85vh",overflowY:"auto"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <div style={{fontSize:17,fontWeight:900}}>✎ 수정</div>
              <button onClick={()=>setEditItem(null)} style={{background:"#F4F2F9",border:"none",borderRadius:20,width:30,height:30,fontSize:15,cursor:"pointer"}}>✕</button>
            </div>
            <div style={{fontSize:11,fontWeight:700,color:"#666",marginBottom:6}}>아이콘</div>
            <IconPicker value={editForm.icon} onChange={ic=>setEditForm(p=>({...p,icon:ic}))}/>
            <div style={{marginBottom:10}}>
              <div style={{fontSize:11,fontWeight:700,color:"#666",marginBottom:5}}>할 일</div>
              <input value={editForm.task} onChange={e=>setEditForm(p=>({...p,task:e.target.value}))}
                style={{width:"100%",padding:"10px 12px",borderRadius:10,border:"2px solid #E8E3DC",fontSize:14,outline:"none",boxSizing:"border-box"}}/>
            </div>
            <div style={{marginBottom:14}}>
              <div style={{fontSize:11,fontWeight:700,color:"#666",marginBottom:5}}>시간</div>
              <input value={editForm.time} onChange={e=>setEditForm(p=>({...p,time:e.target.value}))}
                style={{width:"100%",padding:"9px 12px",borderRadius:10,border:"2px solid #E8E3DC",fontSize:13,outline:"none",boxSizing:"border-box"}}/>
            </div>
            <div style={{display:"flex",gap:8}}>
              <button onClick={saveEdit} style={{flex:2,padding:"13px",borderRadius:12,border:"none",background:"#37474F",color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer"}}>저장</button>
              <button onClick={()=>setEditItem(null)} style={{flex:1,padding:"13px",borderRadius:12,border:"2px solid #E8E3DC",background:"#fff",color:"#aaa",fontSize:12,fontWeight:700,cursor:"pointer"}}>취소</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


function DiaryTab({entries,setEntries,routines,checked,setChecked,todos,setTodos}) {
  // 24h → 12h AM/PM 변환
  const fmt12=(t)=>{
    if(!t) return "";
    const [h,m]=t.split(":").map(Number);
    const ampm=h<12?"AM":"PM";
    const h12=h===0?12:h>12?h-12:h;
    return `${h12}:${String(m).padStart(2,"0")} ${ampm}`;
  };
  const [calTab, setCalTab] = useState("month"); // month | week | day
  const [calViewMonth, setCalViewMonth] = useState(new Date().getMonth()+1);
  const [calViewDate, setCalViewDate] = useState(new Date().toISOString().slice(0,10));
  const [weeklyViewWeek, setWeeklyViewWeek] = useState(1);
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventModal, setEventModal] = useState(null); // {date, event or null}
  const [eventForm, setEventForm] = useState({title:"",startTime:"09:00",endTime:"10:00",desc:"",color:"#7C5CBF",allDay:false});

  // entries 구조: {"2026-04-01": {diary:"...", events:[{id,title,startTime,endTime,desc,color,allDay}]}}
  const getDayData = (date) => {
    const raw = entries[date];
    if(!raw) return {diary:"", events:[]};
    if(typeof raw === "string") return {diary:raw, events:[]};
    return {diary: raw.diary||"", events: raw.events||[]};
  };
  const setDayData = (date, data) => setEntries(p=>({...p,[date]:data}));
  const getEntry = (date) => getDayData(date).diary;
  const getEvents = (date) => getDayData(date).events;

  const addEvent = (date, ev) => {
    const d = getDayData(date);
    setDayData(date, {...d, events:[...d.events, {...ev, id:Date.now().toString()}]});
  };
  const updateEvent = (date, id, ev) => {
    const d = getDayData(date);
    setDayData(date, {...d, events: d.events.map(e=>e.id===id?{...e,...ev}:e)});
  };
  const deleteEvent = (date, id) => {
    const d = getDayData(date);
    setDayData(date, {...d, events: d.events.filter(e=>e.id!==id)});
  };

  const EVENT_COLORS = ["#7C5CBF","#D4875E","#2E7D32","#1565C0","#C62828","#E65100","#00695C","#F57F17","#37474F","#AD1457"];

  // 오늘 루틴 연동
  const todayStr2 = new Date().toISOString().slice(0,10);
  const todayDayKey2 = ["sun","mon","tue","wed","thu","fri","sat"][new Date().getDay()];
  const isWeekday2 = new Date().getDay()!==0;
  const todayRoutines = [
    ...routines.daily.map(r=>({...r,dayKey:"daily"})),
    ...(isWeekday2 ? routines.weekday.map(r=>({...r,dayKey:"weekday"})) : []),
    ...(routines[todayDayKey2]||[]).map(r=>({...r,dayKey:todayDayKey2})),
  ];
  const checkKey=(id)=>`${todayStr2}_${id}`;

  // 달력 그리기 (일요일 시작)
  const renderMonthCal = () => {
    const m = CALENDAR_DATA.find(x=>x.month===calViewMonth);
    if(!m) return null;
    const firstDayIdx = (m.weeks[1][0].dowIdx + 1) % 7;
    const allDays = Object.values(m.weeks).flat();
    const cells = [];
    for(let i=0;i<firstDayIdx;i++) cells.push(null);
    allDays.forEach(d=>cells.push(d));
    return(
      <div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",marginBottom:2}}>
          {["일","월","화","수","목","금","토"].map(d=>(
            <div key={d} style={{textAlign:"center",fontSize:10,fontWeight:700,padding:"5px 0",color:d==="일"?"#C62828":d==="토"?"#1565C0":"#888"}}>{d}</div>
          ))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:1}}>
          {cells.map((d,i)=>{
            if(!d) return <div key={"e"+i}/>;
            const events = getEvents(d.date);
            const diary = getEntry(d.date);
            const today = new Date().toISOString().slice(0,10);
            const isToday = d.date===today;
            const isSel = d.date===selectedDate;
            const hasContent = events.length>0||!!diary;
            return(
              <div key={d.date} onClick={()=>setSelectedDate(d.date)} style={{
                height:44,padding:"3px 2px",borderRadius:6,cursor:"pointer",
                background:isSel?"#EDE7F6":isToday?"#F3F0FF":"transparent",
                border:isToday?"2px solid #7C5CBF":"2px solid transparent",
                overflow:"hidden",display:"flex",flexDirection:"column",alignItems:"center",
              }}>
                <span style={{
                  display:"inline-flex",alignItems:"center",justifyContent:"center",
                  width:22,height:22,borderRadius:"50%",fontSize:11,fontWeight:isToday?900:600,
                  flexShrink:0,
                  background:isToday?"#7C5CBF":"transparent",
                  color:isToday?"#fff":d.dow==="일"?"#C62828":d.dow==="토"?"#1565C0":"#2C2C2C",
                }}>{d.day}</span>
                {/* 일정 — 컬러 바 탭하면 수정 모달 */}
                {events.slice(0,1).map(ev=>(
                  <div key={ev.id}
                    onClick={e=>{
                      e.stopPropagation();
                      setSelectedDate(d.date);
                      setEventForm({...ev});
                      setEventModal({date:d.date,event:ev});
                    }}
                    style={{
                      width:"90%",height:5,borderRadius:3,
                      background:ev.color||"#7C5CBF",
                      marginTop:2,flexShrink:0,cursor:"pointer",
                    }}/>
                ))}
                {events.length>1&&(
                  <div
                    onClick={e=>{
                      e.stopPropagation();
                      setSelectedDate(d.date);
                      setEventForm({...events[1]});
                      setEventModal({date:d.date,event:events[1]});
                    }}
                    style={{width:"90%",height:5,borderRadius:3,background:events[1].color||"#ccc",marginTop:1,flexShrink:0,cursor:"pointer"}}/>
                )}
                {events.length>2&&<div style={{fontSize:8,color:"#888",marginTop:1}}>+{events.length-2}</div>}
                {diary&&events.length===0&&<div style={{width:4,height:4,borderRadius:"50%",background:"#4CAF50",marginTop:2,flexShrink:0}}/>}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // 선택된 날 상세 패널
  const renderDayPanel = () => {
    if(!selectedDate) return null;
    const d = CALENDAR_DATA.flatMap(m=>Object.values(m.weeks).flat()).find(x=>x.date===selectedDate);
    const events = getEvents(selectedDate);
    const diary = getEntry(selectedDate);
    const HOURS = Array.from({length:24},(_,i)=>{
      const ampm=i<12?"AM":"PM";
      const h=i===0?12:i>12?i-12:i;
      return {h24:`${String(i).padStart(2,"0")}:00`, label:`${h}:00 ${ampm}`};
    });
    const sortedEvents = [...events].sort((a,b)=>{
      if(a.allDay&&!b.allDay) return -1;
      if(!a.allDay&&b.allDay) return 1;
      return (a.startTime||"").localeCompare(b.startTime||"");
    });
    return(
      <div style={{background:"#fff",borderRadius:14,overflow:"hidden",marginTop:10,boxShadow:"0 2px 10px rgba(0,0,0,0.1)"}}>
        {/* 날짜 헤더 */}
        <div style={{padding:"12px 14px",background:"#2C2440",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontSize:11,color:"rgba(255,255,255,0.5)"}}>{selectedDate}</div>
            <div style={{fontSize:16,fontWeight:900,color:"#fff"}}>
              {d?.month||parseInt(selectedDate.slice(5,7))}월 {parseInt(selectedDate.slice(8))}일
              <span style={{marginLeft:6,fontSize:13,color:DOW_COLORS[d?.dow]||"#aaa"}}>{d?.dow}요일</span>
            </div>
          </div>
          <button onClick={()=>{setEventForm({title:"",startTime:"09:00",endTime:"10:00",desc:"",color:"#7C5CBF",allDay:false});setEventModal({date:selectedDate,event:null});}} style={{padding:"7px 12px",borderRadius:9,border:"none",background:"rgba(255,255,255,0.15)",color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer"}}>+ 일정 추가</button>
        </div>

        {/* 시간대별 일정 */}
        <div style={{maxHeight:350,overflowY:"auto"}}>
          {/* 종일 일정 */}
          {sortedEvents.filter(e=>e.allDay).map(ev=>(
            <div key={ev.id} onClick={()=>{setEventForm({...ev});setEventModal({date:selectedDate,event:ev});}} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 14px",borderBottom:"1px solid #F0EDE8",cursor:"pointer"}}>
              <div style={{width:10,height:10,borderRadius:"50%",background:ev.color,flexShrink:0}}/>
              <div style={{fontSize:10,color:"#888",width:32,flexShrink:0}}>종일</div>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:700,color:"#2C2C2C"}}>{ev.title}</div>
                {ev.desc&&<div style={{fontSize:11,color:"#888"}}>{ev.desc}</div>}
              </div>
              <button onClick={e=>{e.stopPropagation();deleteEvent(selectedDate,ev.id);}} style={{width:22,height:22,borderRadius:"50%",border:"none",background:"#FFEBEE",color:"#C62828",fontSize:11,cursor:"pointer",fontWeight:900}}>×</button>
            </div>
          ))}
          {/* 시간별 */}
          {HOURS.map(hour=>{
            const hourEvents = sortedEvents.filter(e=>!e.allDay&&e.startTime&&e.startTime.startsWith(hour.h24.slice(0,2)));
            return(
              <div key={hour} style={{display:"flex",minHeight:hourEvents.length>0?48:28,borderBottom:"1px solid #F8F7F4"}}>
                <div onClick={()=>{
                  const endH=String(Math.min(23,parseInt(hour.h24)+1)).padStart(2,"0");
                  setEventForm({title:"",startTime:hour.h24,endTime:endH+":00",desc:"",color:"#7C5CBF",allDay:false});
                  setEventModal({date:selectedDate,event:null});
                }} style={{width:44,padding:"4px 6px",fontSize:9,color:"#bbb",flexShrink:0,textAlign:"right",cursor:"pointer",borderRadius:4,lineHeight:1.3}}
                  onMouseEnter={e=>e.currentTarget.style.color="#7C5CBF"}
                  onMouseLeave={e=>e.currentTarget.style.color="#bbb"}
                >{hour.label}</div>
                <div onClick={()=>{
                  const endH=String(Math.min(23,parseInt(hour.h24)+1)).padStart(2,"0");
                  setEventForm({title:"",startTime:hour.h24,endTime:endH+":00",desc:"",color:"#7C5CBF",allDay:false});
                  setEventModal({date:selectedDate,event:null});
                }} style={{flex:1,padding:"2px 4px",borderLeft:"1px solid #F0EDE8",cursor:"pointer",position:"relative"}}
                  onMouseEnter={e=>{if(!e.currentTarget.querySelector(":hover ~ *"))e.currentTarget.style.background="#F8F6FF";}}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}
                >
                  {hourEvents.map(ev=>(
                    <div key={ev.id} onClick={e=>{e.stopPropagation();setEventForm({...ev});setEventModal({date:selectedDate,event:ev});}} style={{
                      display:"flex",alignItems:"center",gap:6,padding:"4px 8px",
                      borderRadius:7,background:ev.color+"18",borderLeft:`3px solid ${ev.color}`,
                      marginBottom:2,cursor:"pointer",
                    }}>
                      <div style={{flex:1}}>
                        <div style={{fontSize:12,fontWeight:700,color:"#2C2C2C"}}>{ev.title}</div>
                        <div style={{fontSize:10,color:"#888"}}>{fmt12(ev.startTime)} ~ {fmt12(ev.endTime)}{ev.desc&&` · ${ev.desc.slice(0,20)}`}</div>
                      </div>
                      <button onClick={e=>{e.stopPropagation();deleteEvent(selectedDate,ev.id);}} style={{width:20,height:20,borderRadius:"50%",border:"none",background:"#FFEBEE",color:"#C62828",fontSize:10,cursor:"pointer",fontWeight:900,flexShrink:0}}>×</button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* 다이어리 메모 */}
        <div style={{padding:"10px 14px",borderTop:"2px solid #F0EDE8"}}>
          <div style={{fontSize:11,fontWeight:700,color:"#888",marginBottom:5}}>📓 메모 / 일기</div>
          <textarea value={diary} onChange={e=>{const d=getDayData(selectedDate);setDayData(selectedDate,{...d,diary:e.target.value});}}
            placeholder="이 날의 메모나 일기를 자유롭게..."
            style={{width:"100%",padding:"8px 10px",borderRadius:9,border:"2px solid #E8E3DC",fontSize:12,outline:"none",resize:"none",minHeight:70,boxSizing:"border-box",lineHeight:1.6,fontFamily:"'Noto Sans KR',sans-serif"}}/>
        </div>
      </div>
    );
  };

  return(
    <div style={{fontFamily:"'Noto Sans KR',sans-serif",background:"#FAF9F6",minHeight:"100vh",maxWidth:480,margin:"0 auto",paddingBottom:70}}>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900&display=swap" rel="stylesheet"/>

      {/* 탭 */}
      <div style={{display:"flex",background:"#fff",borderBottom:"2px solid #F0EDE8",position:"sticky",top:0,zIndex:100}}>
        <button onClick={()=>setCalTab("month")} style={{flex:1,padding:"11px 5px",border:"none",cursor:"pointer",background:"transparent",color:calTab==="month"?"#7C5CBF":"#888",fontSize:11,fontWeight:700,borderBottom:calTab==="month"?"3px solid #7C5CBF":"3px solid transparent"}}>📅 월별</button>
        <button onClick={()=>setCalTab("all")} style={{flex:1,padding:"11px 5px",border:"none",cursor:"pointer",background:"transparent",color:calTab==="all"?"#7C5CBF":"#888",fontSize:11,fontWeight:700,borderBottom:calTab==="all"?"3px solid #7C5CBF":"3px solid transparent"}}>📝 전체</button>
      </div>

      <div style={{padding:"12px"}}>
        {calTab==="month"&&(
          <div>
            {/* 월 이동 */}
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
              <button onClick={()=>setCalViewMonth(p=>Math.max(1,p-1))} style={{width:32,height:32,borderRadius:"50%",border:"none",background:"#F0EDE8",fontSize:18,cursor:"pointer",fontWeight:700}}>‹</button>
              <div style={{fontSize:17,fontWeight:900,color:"#2C2440"}}>2026년 {calViewMonth}월</div>
              <button onClick={()=>setCalViewMonth(p=>Math.min(12,p+1))} style={{width:32,height:32,borderRadius:"50%",border:"none",background:"#F0EDE8",fontSize:18,cursor:"pointer",fontWeight:700}}>›</button>
            </div>
            <div style={{background:"#fff",borderRadius:14,padding:"10px",boxShadow:"0 2px 8px rgba(0,0,0,0.07)",marginBottom:10}}>
              {renderMonthCal()}
            </div>
            {renderDayPanel()}
          </div>
        )}

        {calTab==="all"&&(
          <div>
            <div style={{fontSize:11,color:"#888",marginBottom:10}}>총 {Object.values(entries).filter(v=>{const d=typeof v==="string"?v:v?.diary||"";const e=typeof v==="object"?v?.events||[]:[];return d||e.length>0;}).length}개 날짜 기록</div>
            {Object.entries(entries).filter(([k,v])=>{const d=typeof v==="string"?v:v?.diary||"";const e=typeof v==="object"?v?.events||[]:[];return k&&k.length===10&&(d||e.length>0);}).sort().reverse().map(([date,raw])=>{
              const data=typeof raw==="string"?{diary:raw,events:[]}:{diary:raw?.diary||"",events:raw?.events||[]};
              const month=parseInt(date.slice(5,7));
              const m=CALENDAR_DATA.find(x=>x.month===month);
              const dayObj=m&&Object.values(m.weeks||{}).flat().find(x=>x.date===date);
              return(
                <div key={date} onClick={()=>{setCalTab("month");setCalViewMonth(month);setSelectedDate(date);}} style={{background:"#fff",borderRadius:12,padding:"11px 14px",marginBottom:8,cursor:"pointer",boxShadow:"0 1px 5px rgba(0,0,0,0.07)",borderLeft:`4px solid ${MONTH_COLORS[month]||"#888"}`}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
                    <div style={{fontSize:12,fontWeight:700,color:MONTH_COLORS[month]||"#888"}}>{date} {dayObj&&`(${dayObj.dow}요일)`}</div>
                    <div style={{display:"flex",gap:5,alignItems:"center"}}>
                      {data.events.length>0&&<span style={{fontSize:10,background:"#EDE7F6",color:"#7C5CBF",borderRadius:7,padding:"2px 6px",fontWeight:700}}>{data.events.length}개 일정</span>}
                      <button onClick={e=>{e.stopPropagation();setEntries(p=>{const n={...p};delete n[date];return n;});}} style={{width:22,height:22,borderRadius:"50%",border:"none",background:"#FFEBEE",color:"#C62828",fontSize:11,cursor:"pointer",fontWeight:900}}>×</button>
                    </div>
                  </div>
                  {data.events.slice(0,3).map(ev=>(
                    <div key={ev.id} style={{display:"flex",alignItems:"center",gap:5,marginBottom:3}}>
                      <div style={{width:6,height:6,borderRadius:"50%",background:ev.color,flexShrink:0}}/>
                      <span style={{fontSize:11,color:"#2C2C2C",fontWeight:600}}>{ev.allDay?"종일":ev.startTime} {ev.title}</span>
                    </div>
                  ))}
                  {data.diary&&<div style={{fontSize:11,color:"#666",lineHeight:1.5,marginTop:data.events.length?4:0}}>{data.diary.slice(0,60)}{data.diary.length>60?"...":""}</div>}
                </div>
              );
            })}
            {Object.keys(entries).length===0&&<div style={{textAlign:"center",padding:"40px",color:"#ccc"}}><div style={{fontSize:36,marginBottom:8}}>📔</div><div style={{fontSize:13,fontWeight:700}}>아직 기록이 없어요</div></div>}
          </div>
        )}
      </div>

      {/* ══ 일정 추가/수정 모달 ══ */}
      {eventModal&&(
        <div onClick={()=>setEventModal(null)} style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.6)",zIndex:1000,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
          <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:"20px 20px 0 0",padding:"22px 18px 40px",width:"100%",maxWidth:480,maxHeight:"90vh",overflowY:"auto"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <div style={{fontSize:17,fontWeight:900,color:"#2C2440"}}>{eventModal.event?"✏️ 일정 수정":"+ 새 일정"}</div>
              <button onClick={()=>setEventModal(null)} style={{background:"#F4F2F9",border:"none",borderRadius:20,width:30,height:30,fontSize:15,cursor:"pointer"}}>✕</button>
            </div>
            <div style={{fontSize:11,color:"#888",marginBottom:12}}>📅 {eventModal.date}</div>

            {/* 제목 */}
            <div style={{marginBottom:12}}>
              <div style={{fontSize:11,fontWeight:700,color:"#666",marginBottom:5}}>제목 *</div>
              <input value={eventForm.title} onChange={e=>setEventForm(p=>({...p,title:e.target.value}))}
                placeholder="일정 제목..."
                style={{width:"100%",padding:"11px 13px",borderRadius:10,border:"2px solid #E8E3DC",fontSize:14,fontWeight:700,outline:"none",boxSizing:"border-box"}}/>
            </div>

            {/* 종일 토글 */}
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
              <label style={{display:"flex",alignItems:"center",gap:6,cursor:"pointer",fontSize:13}}>
                <input type="checkbox" checked={!!eventForm.allDay} onChange={e=>setEventForm(p=>({...p,allDay:e.target.checked}))} style={{accentColor:"#7C5CBF",width:16,height:16}}/>
                종일 일정
              </label>
            </div>

            {/* 시간 */}
            {!eventForm.allDay&&(
              <div style={{display:"flex",gap:10,marginBottom:12}}>
                <div style={{flex:1}}>
                  <div style={{fontSize:11,fontWeight:700,color:"#666",marginBottom:5}}>⏰ 시작</div>
                  <input type="time" value={eventForm.startTime||"09:00"} onChange={e=>setEventForm(p=>({...p,startTime:e.target.value}))}
                    style={{width:"100%",padding:"9px 12px",borderRadius:10,border:"2px solid #E8E3DC",fontSize:13,outline:"none",boxSizing:"border-box"}}/>
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:11,fontWeight:700,color:"#666",marginBottom:5}}>⏰ 종료</div>
                  <input type="time" value={eventForm.endTime||"10:00"} onChange={e=>setEventForm(p=>({...p,endTime:e.target.value}))}
                    style={{width:"100%",padding:"9px 12px",borderRadius:10,border:"2px solid #E8E3DC",fontSize:13,outline:"none",boxSizing:"border-box"}}/>
                </div>
              </div>
            )}

            {/* 설명 */}
            <div style={{marginBottom:12}}>
              <div style={{fontSize:11,fontWeight:700,color:"#666",marginBottom:5}}>📝 설명</div>
              <textarea value={eventForm.desc||""} onChange={e=>setEventForm(p=>({...p,desc:e.target.value}))}
                placeholder="상세 설명, 장소, 메모..."
                style={{width:"100%",padding:"9px 12px",borderRadius:10,border:"2px solid #E8E3DC",fontSize:12,outline:"none",resize:"none",minHeight:70,boxSizing:"border-box",lineHeight:1.6}}/>
            </div>

            {/* 색상 */}
            <div style={{marginBottom:16}}>
              <div style={{fontSize:11,fontWeight:700,color:"#666",marginBottom:7}}>🎨 색상</div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {EVENT_COLORS.map(c=>(
                  <button key={c} onClick={()=>setEventForm(p=>({...p,color:c}))} style={{width:28,height:28,borderRadius:"50%",background:c,border:`3px solid ${eventForm.color===c?"#2C2C2C":"transparent"}`,cursor:"pointer"}}/>
                ))}
              </div>
            </div>

            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>{
                if(!eventForm.title.trim()) return;
                if(eventModal.event) updateEvent(eventModal.date, eventModal.event.id, eventForm);
                else addEvent(eventModal.date, eventForm);
                setEventModal(null);
              }} style={{flex:2,padding:"13px",borderRadius:12,border:"none",background:"#7C5CBF",color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer"}}>저장</button>
              {eventModal.event&&<button onClick={()=>{deleteEvent(eventModal.date,eventModal.event.id);setEventModal(null);}} style={{flex:1,padding:"13px",borderRadius:12,border:"2px solid #FFEBEE",background:"#fff",color:"#C62828",fontSize:12,fontWeight:700,cursor:"pointer"}}>삭제</button>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


// ══ 메인 통합 컴포넌트 ══════════════════════════════════
export default function DiaryRoutine() {
  const [mainTab, setMainTab] = useState("diary");

  // ── 공유 상태 (다이어리 + 루틴 연동) ──
  const [entries,   setEntries]   = useState(()=>loadLS("dr_entries",  {}));
  const [routines,  setRoutines]  = useState(()=>loadLS("dr_routines", DEFAULT_ROUTINES));
  const [checked,   setChecked]   = useState(()=>loadLS("dr_checked",  {}));
  const [todos,     setTodos]     = useState(()=>loadLS("dr_todos",    []));

  // 자동 저장
  useEffect(()=>saveLS("dr_entries",  entries),  [entries]);
  useEffect(()=>saveLS("dr_routines", routines), [routines]);
  useEffect(()=>saveLS("dr_checked",  checked),  [checked]);
  useEffect(()=>saveLS("dr_todos",    todos),     [todos]);

  // 오늘 날짜
  const todayStr = new Date().toISOString().slice(0,10);
  const todayDayKey = ["sun","mon","tue","wed","thu","fri","sat"][new Date().getDay()];
  const isWeekday = new Date().getDay() !== 0;
  const todayRoutines = [
    ...routines.daily.map(r=>({...r,dayKey:"daily"})),
    ...(isWeekday ? routines.weekday.map(r=>({...r,dayKey:"weekday"})) : []),
    ...(routines[todayDayKey]||[]).map(r=>({...r,dayKey:todayDayKey})),
  ];
  const checkKey=(id)=>`${todayStr}_${id}`;
  const doneCount = todayRoutines.filter(r=>!!checked[checkKey(r.id)]).length;

  return(
    <div style={{fontFamily:"'Noto Sans KR',sans-serif",background:"#FAF9F6",minHeight:"100vh",maxWidth:480,margin:"0 auto",paddingBottom:70}}>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900&display=swap" rel="stylesheet"/>

      {/* 헤더 */}
      <div style={{background:"linear-gradient(135deg,#2C2440,#4A3860)",padding:"18px 16px 0",color:"#fff"}}>
        <div style={{fontSize:10,letterSpacing:3,color:"rgba(255,255,255,0.4)",marginBottom:2}}>MY DIARY & ROUTINE 2026</div>
        <div style={{fontSize:21,fontWeight:900,marginBottom:3}}>📔 다이어리 & 루틴</div>
        <div style={{display:"flex",gap:12,fontSize:11,color:"rgba(255,255,255,0.6)",marginBottom:10}}>
          <span>📝 {Object.values(entries).filter(Boolean).length}개 기록</span>
          <span>✅ 오늘 {doneCount}/{todayRoutines.length} 완료</span>
        </div>
        {/* 오늘 루틴 진행바 */}
        <div style={{background:"rgba(255,255,255,0.12)",borderRadius:4,height:4,overflow:"hidden",marginBottom:0}}>
          <div style={{background:"#80CBC4",height:4,borderRadius:4,width:todayRoutines.length>0?(doneCount/todayRoutines.length*100)+"%":"0%",transition:"width 0.3s"}}/>
        </div>
        {/* 탭 전환 */}
        <div style={{display:"flex",marginTop:10}}>
          <button onClick={()=>setMainTab("diary")} style={{flex:1,padding:"10px 5px",border:"none",cursor:"pointer",background:"transparent",color:mainTab==="diary"?"#fff":"rgba(255,255,255,0.45)",fontSize:11,fontWeight:700,borderBottom:mainTab==="diary"?"3px solid #CE93D8":"3px solid transparent"}}>📔 다이어리</button>
          <button onClick={()=>setMainTab("routine")} style={{flex:1,padding:"10px 5px",border:"none",cursor:"pointer",background:"transparent",color:mainTab==="routine"?"#fff":"rgba(255,255,255,0.45)",fontSize:11,fontWeight:700,borderBottom:mainTab==="routine"?"3px solid #80CBC4":"3px solid transparent"}}>🏠 루틴</button>
        </div>
      </div>

      {mainTab==="diary"&&(
        <DiaryTab
          entries={entries} setEntries={setEntries}
          routines={routines} checked={checked} setChecked={setChecked}
          todos={todos} setTodos={setTodos}
        />
      )}
      {mainTab==="routine"&&(
        <RoutineTab
          routines={routines} setRoutines={setRoutines}
          checked={checked} setChecked={setChecked}
          todos={todos} setTodos={setTodos}
        />
      )}
    </div>
  );
}
