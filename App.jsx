import { useState } from "react";
import AcademyPlanner from "./AcademyPlanner";
import MealPlan from "./MealPlan";
import CampingPlanner from "./CampingPlanner";
import OutdoorPlanner from "./OutdoorPlanner";
import TravelPlanner from "./TravelPlanner";
import DiaryRoutine from "./DiaryRoutine";

export default function App() {
  const [tab, setTab] = useState("academy");
  const tabs = [
    {id:"academy", label:"🎨 학원", bg:"#7C5CBF"},
    {id:"meal",    label:"🍽️ 식단", bg:"#D4875E"},
    {id:"camping", label:"🏕️ 캠핑", bg:"#4A7C23"},
    {id:"outdoor", label:"🏔️ 아웃도어", bg:"#1B4332"},
    {id:"travel",  label:"🏞️ 여행", bg:"#1A237E"},
    {id:"diary",   label:"📔 다이어리", bg:"#2C2440"},
  ];
  const activeColor = tabs.find(t=>t.id===tab)?.bg || "#333";
  return (
    <div style={{fontFamily:"Noto Sans KR,sans-serif",maxWidth:480,margin:"0 auto",minHeight:"100vh",background:"#F5F3EF"}}>
      {/* 상단 탭 */}
      <div style={{display:"flex",background:"#1A1A2E",position:"sticky",top:0,zIndex:999,overflowX:"auto"}}>
        {tabs.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{
            flex:"0 0 auto",padding:"11px 10px",border:"none",cursor:"pointer",
            background:tab===t.id?t.bg:"transparent",
            color:tab===t.id?"#fff":"#888",
            fontSize:10,fontWeight:700,whiteSpace:"nowrap",
            borderBottom:tab===t.id?"3px solid rgba(255,255,255,0.5)":"3px solid transparent",
          }}>{t.label}</button>
        ))}
      </div>
      {tab==="academy" && <AcademyPlanner/>}
      {tab==="meal"    && <MealPlan/>}
      {tab==="camping" && <CampingPlanner/>}
      {tab==="outdoor" && <OutdoorPlanner/>}
      {tab==="travel"  && <TravelPlanner/>}
      {tab==="diary"   && <DiaryRoutine/>}
    </div>
  );
}
