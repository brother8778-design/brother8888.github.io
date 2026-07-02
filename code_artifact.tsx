import React, { useState, useEffect } from 'react';

// 國定假日與補假資料庫 (年-月-日)
const NATIONAL_HOLIDAYS = {
  // 2026年 國定假日與連假
  '2026-01-01': '元旦',
  '2026-02-16': '春節(除夕)',
  '2026-02-17': '春節(初一)',
  '2026-02-18': '春節(初二)',
  '2026-02-19': '春節(初三)',
  '2026-02-20': '春節(初四)',
  '2026-02-21': '春節(初五)', // 假設連假到初五
  '2026-02-28': '228和平紀念日',
  '2026-04-03': '清明節/兒童節連假',
  '2026-04-04': '兒童節',
  '2026-04-05': '清明節',
  '2026-04-06': '清明補假', // 假設遇假日補假
  '2026-05-01': '勞動節',
  '2026-06-19': '端午節',
  '2026-09-25': '中秋節',
  '2026-10-10': '國慶日',
  // 可以持續往下擴充未來的年份
  '2027-01-01': '元旦',
  '2027-02-05': '春節(除夕)',
  '2027-02-06': '春節(初一)'
};

const Icons = {
  Users: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Calendar: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>,
  Clock: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Settings: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>,
  ChevronLeft: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>,
  ChevronRight: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>,
  Plus: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>,
  Trash: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>,
  Check: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  Eye: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>,
  Dumbbell: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.4 14.4 9.6 9.6"/><path d="M18.657 21.485a2 2 0 1 1-2.829-2.828l-1.767 1.768a2 2 0 1 1-2.829-2.829l6.364-6.364a2 2 0 1 1 2.829 2.829l-1.768 1.767a2 2 0 1 1 2.828 2.829z"/><path d="m21.5 21.5-1.4-1.4"/><path d="M3.9 3.9 2.5 2.5"/><path d="M6.404 2.515a2 2 0 0 0-2.829 2.828l1.768 1.767a2 2 0 0 0-2.829 2.829l-6.364-6.364a2 2 0 0 0 2.829-2.829l1.767 1.768a2 2 0 0 0 2.829-2.828z"/></svg>,
  Printer: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>,
  Brush: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08"/><path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z"/></svg>,
  Eraser: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"/><path d="M22 21H7"/><path d="m5 11 9 9"/></svg>,
  LogOut: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
};

export default function App() {
  const [viewMode, setViewMode] = useState('login'); // 'login', 'admin' 或 'employee'
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  const [currentTab, setCurrentTab] = useState('weekly'); // 'weekly', 'daily', 'employees'
  const [baseDate, setBaseDate] = useState(new Date()); // 用於計算四週排班的基準日
  const [quickShift, setQuickShift] = useState(null); // 快速排班筆刷狀態 ('M', 'CLEAR', null 等)
  
  // 預設員工資料
  const [employees, setEmployees] = useState([
    { id: 'c1', name: '教練 A', role: 'coach', type: 'fulltime' },
    { id: 'c2', name: '教練 B', role: 'coach', type: 'fulltime' },
    { id: 'c3', name: '教練 C', role: 'coach', type: 'fulltime' },
    { id: 'c4', name: '教練 D', role: 'coach', type: 'fulltime' },
    { id: 'c5', name: '教練 E', role: 'coach', type: 'fulltime' },
    { id: 'c6', name: '教練 F', role: 'coach', type: 'fulltime' },
    { id: 'f1', name: '櫃台正職', role: 'frontdesk', type: 'fulltime' },
    { id: 'p1', name: '工讀生 甲', role: 'parttime', type: 'parttime' },
    { id: 'p2', name: '工讀生 乙', role: 'parttime', type: 'parttime' },
    { id: 'p3', name: '工讀生 丙', role: 'parttime', type: 'parttime' },
    { id: 'p4', name: '工讀生 丁', role: 'parttime', type: 'parttime' },
  ]);

  const SHIFTS = {
    MORNING: { id: 'M', name: '早班', shortName: '早', start: 7, end: 16, color: 'bg-emerald-100 text-emerald-800 border-emerald-300', barColor: 'bg-emerald-400' },
    AFTERNOON: { id: 'A', name: '中班', shortName: '中', start: 12, end: 21, color: 'bg-amber-100 text-amber-800 border-amber-300', barColor: 'bg-amber-400' },
    NIGHT: { id: 'N', name: '晚班', shortName: '晚', start: 14, end: 23, color: 'bg-indigo-100 text-indigo-800 border-indigo-300', barColor: 'bg-indigo-400' },
    PARTTIME: { id: 'P', name: '工讀', shortName: '工', start: 16, end: 23, color: 'bg-sky-100 text-sky-800 border-sky-300', barColor: 'bg-sky-400' },
    OFF: { id: 'O', name: '排休', shortName: '休', start: 7, end: 23, color: 'bg-slate-200 text-slate-600 border-slate-300', barColor: 'bg-slate-300' },
    ANNUAL_LEAVE: { id: 'AL', name: '特休', shortName: '特', start: 7, end: 23, color: 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-300', barColor: 'bg-fuchsia-300' },
  };

  // 排班資料結構: { "YYYY-MM-DD": { employeeId: shiftId } }
  const [schedule, setSchedule] = useState({});

  // 狀態：目前選取的格子 (用於排班彈出視窗)
  const [selectedCell, setSelectedCell] = useState(null); // { date: 'YYYY-MM-DD', empId: '...' }
  
  // 狀態：單日時間軸的日期
  const [timelineDate, setTimelineDate] = useState(new Date());
  
  // 狀態：新增員工的表單
  const [newEmpName, setNewEmpName] = useState('');
  const [newEmpRole, setNewEmpRole] = useState('coach');

  // 取得四週的日期陣列 (從 baseDate 所在的週一開始算 28 天)
  const getFourWeeksDays = (date) => {
    const days = [];
    const current = new Date(date);
    // 調整到星期一
    const day = current.getDay();
    const diff = current.getDate() - day + (day === 0 ? -6 : 1); // 如果是週日，往前推6天
    current.setDate(diff);

    const todayStr = new Date().toLocaleDateString('en-CA'); // 取得本地的今天 YYYY-MM-DD

    for (let i = 0; i < 28; i++) {
      const d = new Date(current);
      // 使用 local timezone 格式化日期為 YYYY-MM-DD，避免時區偏差
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const dateStr = `${yyyy}-${mm}-${dd}`;
      
      const isWeekend = d.getDay() === 0 || d.getDay() === 6;
      const isMonday = d.getDay() === 1;
      const holidayName = NATIONAL_HOLIDAYS[dateStr]; // 檢查完整日期
      const isHoliday = !!holidayName;
      const isToday = dateStr === todayStr;
      
      days.push({
        date: d,
        dateStr: dateStr,
        dayOfWeek: ['日', '一', '二', '三', '四', '五', '六'][d.getDay()],
        isWeekend,
        isMonday,
        isHoliday,
        holidayName,
        isToday,
        dayIndex: d.getDay()
      });
      current.setDate(current.getDate() + 1);
    }
    return days;
  };

  const fourWeeksDays = getFourWeeksDays(baseDate);

  const changeFourWeeks = (direction) => {
    const newDate = new Date(baseDate);
    newDate.setDate(newDate.getDate() + (direction * 28));
    setBaseDate(newDate);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'A12345') {
      setViewMode('admin');
      setPassword('');
      setLoginError('');
    } else if (password === 'B12345') {
      setViewMode('employee');
      setPassword('');
      setLoginError('');
    } else {
      setLoginError('密碼錯誤，請重新確認');
    }
  };

  const handleLogout = () => {
    setViewMode('login');
    setCurrentTab('weekly');
    setQuickShift(null);
  };

  const handleShiftAssign = (shiftId) => {
    if (!selectedCell || viewMode === 'employee') return;
    
    setSchedule(prev => {
      const newSchedule = { ...prev };
      if (!newSchedule[selectedCell.date]) {
        newSchedule[selectedCell.date] = {};
      }
      
      if (shiftId === null) {
        // 清除班表
        delete newSchedule[selectedCell.date][selectedCell.empId];
      } else {
        newSchedule[selectedCell.date][selectedCell.empId] = shiftId;
      }
      return newSchedule;
    });
    
    setSelectedCell(null);
  };

  // 點擊畫面其他地方關閉彈出視窗
  useEffect(() => {
    const handleClickOutside = () => setSelectedCell(null);
    if (selectedCell) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [selectedCell]);

  const handleAddEmployee = () => {
    if (!newEmpName.trim()) return;
    const newId = `emp_${Date.now()}`;
    setEmployees([...employees, { id: newId, name: newEmpName.trim(), role: newEmpRole, type: newEmpRole === 'parttime' ? 'parttime' : 'fulltime' }]);
    setNewEmpName('');
  };

  const handleDeleteEmployee = (id) => {
    // 實務上刪除員工，其歷史排班資料仍會存在 schedule 物件中，確保紀錄不流失
    setEmployees(employees.filter(e => e.id !== id));
  };

  const renderEmployeeManager = () => {
    return (
      <div className="flex flex-col h-full bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden relative p-4 md:p-6 animate-in fade-in zoom-in-95 duration-300">
        <h2 className="text-xl font-extrabold text-slate-800 mb-6 flex items-center gap-2">
            <Icons.Users /> 員工與團隊管理
        </h2>
        
        <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200 mb-6 flex flex-col md:flex-row gap-3 items-end shadow-sm">
            <div className="flex-1 w-full">
                <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">員工姓名</label>
                <input 
                    type="text" 
                    value={newEmpName} 
                    onChange={e => setNewEmpName(e.target.value)} 
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold text-slate-700 shadow-inner"
                    placeholder="輸入新進員工姓名..."
                />
            </div>
            <div className="w-full md:w-1/3">
                <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">職務崗位</label>
                <select 
                    value={newEmpRole} 
                    onChange={e => setNewEmpRole(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold text-slate-700 shadow-inner cursor-pointer"
                >
                    <option value="coach">健身教練 (Coach)</option>
                    <option value="frontdesk">櫃台正職 (Front Desk)</option>
                    <option value="parttime">工讀生 (Part-time)</option>
                </select>
            </div>
            <button 
                onClick={handleAddEmployee}
                className="w-full md:w-auto px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 active:scale-95 transition-all shadow-md shadow-indigo-600/20 whitespace-nowrap flex items-center justify-center gap-2"
            >
                <Icons.Plus /> 新增員工
            </button>
        </div>

        <div className="flex-1 overflow-auto custom-scrollbar border border-slate-200 rounded-xl bg-white shadow-sm">
            <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-slate-50/95 backdrop-blur-sm z-10 shadow-[0_1px_0_0_#e2e8f0]">
                    <tr className="text-sm text-slate-500">
                        <th className="py-3 px-4 font-extrabold w-16 text-center">編號</th>
                        <th className="py-3 px-4 font-extrabold">員工姓名</th>
                        <th className="py-3 px-4 font-extrabold">職位</th>
                        <th className="py-3 px-4 font-extrabold text-right">操作</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {employees.map((emp, index) => (
                        <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors group">
                            <td className="py-3 px-4 text-xs font-bold text-slate-400 text-center">
                                {(index + 1).toString().padStart(2, '0')}
                            </td>
                            <td className="py-3 px-4 text-sm font-extrabold text-slate-700">
                                {emp.name}
                            </td>
                            <td className="py-3 px-4">
                                <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-bold border
                                    ${emp.role === 'coach' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                                      emp.role === 'frontdesk' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                                      'bg-amber-50 text-amber-700 border-amber-200'}`}>
                                    {emp.role === 'coach' ? '教練' : emp.role === 'frontdesk' ? '櫃台' : '工讀生'}
                                </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                                <button 
                                    onClick={() => handleDeleteEmployee(emp.id)}
                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100 active:scale-95"
                                    title="刪除此員工"
                                >
                                    <Icons.Trash />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    );
  };

  const changeTimelineDate = (days) => {
    const newDate = new Date(timelineDate);
    newDate.setDate(newDate.getDate() + days);
    setTimelineDate(newDate);
  };

  const renderDailyTimeline = () => {
    // 營業時間 07:00 ~ 23:00 (共16個小時區塊)
    const hours = Array.from({ length: 17 }, (_, i) => i + 7);
    
    // 處理日期格式
    const d = timelineDate;
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const targetDateStr = `${yyyy}-${mm}-${dd}`;
    const dayOfWeek = ['日', '一', '二', '三', '四', '五', '六'][d.getDay()];
    const daySchedule = schedule[targetDateStr] || {};
    
    const holidayName = NATIONAL_HOLIDAYS[targetDateStr];
    
    return (
      <div className="flex flex-col h-full bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden relative animate-in fade-in zoom-in-95 duration-300">
        {/* 日期控制列 */}
        <div className="flex items-center justify-between p-3 border-b border-slate-100 bg-slate-50/80 backdrop-blur-md z-20">
          <div className="flex items-center gap-1">
            <button onClick={() => changeTimelineDate(-1)} className="p-2 hover:bg-white rounded-lg text-slate-600 shadow-sm border border-transparent hover:border-slate-200 transition-all active:scale-95"><Icons.ChevronLeft /></button>
            <h2 className="text-base font-extrabold text-slate-800 min-w-[200px] text-center tracking-wide flex flex-col">
              <span>{yyyy}年 {mm}/{dd} ({dayOfWeek})</span>
              {holidayName && <span className="text-[10px] text-red-500 mt-0.5">{holidayName}</span>}
            </h2>
            <button onClick={() => changeTimelineDate(1)} className="p-2 hover:bg-white rounded-lg text-slate-600 shadow-sm border border-transparent hover:border-slate-200 transition-all active:scale-95"><Icons.ChevronRight /></button>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setTimelineDate(new Date())} className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-lg shadow-sm hover:bg-slate-50 active:scale-95 transition-all">
                回到今天
            </button>
            <div className="px-3 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-100 shadow-sm hidden sm:block">
                Gantt 時間軸視角
            </div>
          </div>
        </div>

        {/* 時間軸畫布 */}
        <div className="flex-1 overflow-auto custom-scrollbar p-3">
            <div className="relative w-full min-w-[900px] bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                {/* 表頭：時間刻度 */}
                <div className="flex border-b border-slate-200 bg-slate-50/50">
                    <div className="w-28 shrink-0 font-extrabold text-xs text-slate-500 py-3 text-center border-r border-slate-200">員工</div>
                    <div className="flex-1 flex relative">
                        {hours.map((h, i) => (
                            <div key={h} className="flex-1 text-center flex flex-col justify-end pb-1 border-l border-slate-100 relative">
                                <span className="font-extrabold text-[10px] text-slate-400 -ml-5">{h}:00</span>
                                {i === hours.length - 1 && <span className="font-extrabold text-[10px] text-slate-400 absolute right-0 bottom-1">23:00</span>}
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* 內容：員工橫條 */}
                <div className="p-2">
                    {employees.map(emp => {
                        const shiftId = daySchedule[emp.id];
                        const shift = shiftId ? Object.values(SHIFTS).find(s => s.id === shiftId) : null;
                        
                        let leftPct = 0;
                        let widthPct = 0;
                        
                        if (shift && typeof shift.start === 'number' && typeof shift.end === 'number') {
                            const totalHours = 16; // 7 到 23 總共 16 小時
                            leftPct = ((shift.start - 7) / totalHours) * 100;
                            widthPct = ((shift.end - shift.start) / totalHours) * 100;
                        }
                        
                        return (
                            <div key={emp.id} className="flex items-center mb-1.5 group hover:bg-slate-50 p-1.5 rounded-lg transition-colors">
                                <div className="w-28 shrink-0 flex flex-col justify-center px-2">
                                    <span className="text-xs font-extrabold text-slate-700 truncate">{emp.name}</span>
                                    <span className="text-[9px] text-slate-400 font-bold">{emp.role === 'coach' ? '教練' : emp.role === 'frontdesk' ? '櫃台' : '工讀生'}</span>
                                </div>
                                <div className="flex-1 flex relative h-10 bg-slate-50/50 rounded-lg overflow-hidden border border-slate-100 shadow-inner">
                                    {/* 背景格線 */}
                                    <div className="absolute inset-0 flex">
                                        {hours.slice(0, -1).map((h) => (
                                            <div key={h} className="flex-1 border-l border-white/80 h-full"></div>
                                        ))}
                                    </div>
                                    
                                    {/* 班表色塊 (會根據時間自動變長變短) */}
                                    {shift && shift.id !== 'O' && shift.id !== 'AL' && shift.start !== undefined && (
                                        <div 
                                            className={`absolute top-1 bottom-1 rounded-md shadow-md flex items-center justify-center text-xs font-bold text-white transition-all duration-500 ease-out hover:-translate-y-0.5 hover:shadow-lg ${shift.barColor || 'bg-slate-400'}`}
                                            style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                                            title={`${shift.name} (${shift.start}:00 - ${shift.end}:00)`}
                                        >
                                            <span className="truncate px-2 drop-shadow-sm">{shift.name} ({shift.start}:00-{shift.end}:00)</span>
                                        </div>
                                    )}
                                    {/* 假單/排休色塊 */}
                                    {(shift?.id === 'O' || shift?.id === 'AL') && (
                                        <div className={`absolute inset-1.5 rounded-md flex items-center justify-center text-xs font-extrabold tracking-[0.3em] shadow-inner border border-white/50
                                            ${shift.id === 'O' ? 'bg-slate-200/70 text-slate-500' : 'bg-fuchsia-100/70 text-fuchsia-500'}`}>
                                            {shift.name}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
      </div>
    );
  };

  const renderFourWeekRoster = () => {
    return (
      <div className="flex flex-col h-full bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden relative print:border-none print:shadow-none print:bg-white print:h-auto print:overflow-visible">
        
        {/* 專屬列印標題 (平常隱藏，列印時才顯示) */}
        <div className="hidden print:block text-center mb-4">
           <h1 className="text-2xl font-extrabold text-slate-800">FITNESS SCHEDULE 班表與簽到確認表</h1>
           <p className="text-sm font-bold text-slate-500 mt-1">
             {(() => {
               const startYear = fourWeeksDays[0].dateStr.substring(0, 4);
               const endYear = fourWeeksDays[27].dateStr.substring(0, 4);
               const startMD = fourWeeksDays[0].dateStr.substring(5).replace('-', '/');
               const endMD = fourWeeksDays[27].dateStr.substring(5).replace('-', '/');
               return startYear === endYear 
                 ? `${startYear}年 ${startMD} ~ ${endMD}` 
                 : `${startYear}年 ${startMD} ~ ${endYear}年 ${endMD}`;
             })()}
           </p>
        </div>

        {/* 控制列 */}
        <div className="flex items-center justify-between p-2 border-b border-slate-100 bg-slate-50/50 print:hidden">
          <div className="flex items-center gap-1">
            <button onClick={() => changeFourWeeks(-1)} className="p-1.5 hover:bg-white rounded-md text-slate-600 shadow-sm border border-transparent hover:border-slate-200 transition-all"><Icons.ChevronLeft /></button>
            <h2 className="text-sm font-bold text-slate-800 min-w-[180px] text-center tracking-wide">
              {(() => {
                const startYear = fourWeeksDays[0].dateStr.substring(0, 4);
                const endYear = fourWeeksDays[27].dateStr.substring(0, 4);
                const startMD = fourWeeksDays[0].dateStr.substring(5).replace('-', '/');
                const endMD = fourWeeksDays[27].dateStr.substring(5).replace('-', '/');
                return startYear === endYear 
                  ? `${startYear}年 ${startMD} ~ ${endMD}` 
                  : `${startYear}年 ${startMD} ~ ${endYear}年 ${endMD}`;
              })()}
            </h2>
            <button onClick={() => changeFourWeeks(1)} className="p-1.5 hover:bg-white rounded-md text-slate-600 shadow-sm border border-transparent hover:border-slate-200 transition-all"><Icons.ChevronRight /></button>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => window.print()} className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition-colors shadow-sm active:scale-95">
              <Icons.Printer /> 列印與簽到
            </button>
            <div className="text-xs text-slate-500 font-medium bg-slate-100/80 px-2.5 py-1 rounded-full border border-slate-200/60 shadow-inner hidden sm:block">四週極限全覽模式</div>
          </div>
        </div>

        {/* 快速排班刷 (僅管理員顯示) */}
        {viewMode === 'admin' && (
          <div className="flex items-center gap-2 p-2.5 border-b border-indigo-100 bg-indigo-50/60 print:hidden overflow-x-auto shadow-inner transition-all">
            <span className="text-xs font-bold text-indigo-800 whitespace-nowrap flex items-center gap-1.5">
              <Icons.Brush /> 快速排班刷：
            </span>
            {Object.values(SHIFTS).map(shift => (
              <button
                key={shift.id}
                onClick={() => setQuickShift(quickShift === shift.id ? null : shift.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all whitespace-nowrap shadow-sm hover:scale-105 active:scale-95
                  ${quickShift === shift.id ? 'ring-2 ring-indigo-500 ring-offset-1 ' + shift.color : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'}`}
              >
                {shift.name}
              </button>
            ))}
            <div className="w-px h-5 bg-slate-300 mx-1"></div>
            <button
              onClick={() => setQuickShift(quickShift === 'CLEAR' ? null : 'CLEAR')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all whitespace-nowrap shadow-sm hover:scale-105 active:scale-95
                ${quickShift === 'CLEAR' ? 'ring-2 ring-red-500 ring-offset-1 bg-red-100 text-red-700 border-red-200' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'}`}
            >
              <Icons.Eraser /> 橡皮擦
            </button>
            {quickShift && (
               <div className="ml-auto flex items-center gap-2 px-3 py-1 bg-indigo-600 text-white rounded-full text-[10px] font-bold animate-pulse">
                 ✓ 點擊下方格子即可直接填寫！(再次點擊筆刷可取消)
               </div>
            )}
          </div>
        )}

        {/* 橫向排班矩陣 (28天) */}
        <div className="flex-1 overflow-auto relative custom-scrollbar print:overflow-visible">
          <table className="w-full min-w-max border-collapse table-fixed">
            <thead className="sticky top-0 z-20 shadow-[0_1px_0_0_#e2e8f0] print:static print:shadow-none">
              <tr>
                <th className="sticky left-0 z-30 bg-slate-50/95 backdrop-blur-md p-1.5 text-left font-extrabold text-slate-700 border-b border-r border-slate-200 w-24 text-xs shadow-[1px_0_0_0_#e2e8f0] print:static print:shadow-none print:w-28 print:bg-white print:border-slate-400">
                  員工 / 日期
                </th>
                {fourWeeksDays.map((day, i) => (
                  <th key={day.dateStr} 
                      className={`p-1 border-b border-r border-slate-200 text-center relative group
                        ${day.isHoliday ? 'bg-red-50/90' : 
                          day.isToday ? 'bg-sky-50/90' : 
                          day.isMonday ? 'bg-purple-50/90' : 
                          day.isWeekend ? 'bg-amber-50/40' : 'bg-slate-50/95 backdrop-blur-md'}
                        ${day.dayOfWeek === '日' ? 'border-r-2 border-r-slate-300/80' : ''}
                        w-8 min-w-[2rem] print:bg-white print:border-slate-400 print:border-r`}>
                    
                    {/* Tooltip for Holidays / Meetings */}
                    {(day.isHoliday || day.isMonday) && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block z-50 w-max">
                        <div className={`px-2 py-1 text-[10px] text-white rounded shadow-lg backdrop-blur-sm
                          ${day.isHoliday ? 'bg-red-600/90' : 'bg-purple-600/90'}`}>
                          {day.isHoliday ? day.holidayName : '週一例行會議'}
                        </div>
                        <div className={`w-2 h-2 rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2 
                          ${day.isHoliday ? 'bg-red-600/90' : 'bg-purple-600/90'}`}></div>
                      </div>
                    )}

                    <div className={`text-[9px] font-black tracking-tighter ${day.isHoliday ? 'text-red-500' : day.isToday ? 'text-sky-500' : 'text-slate-400'}`}>
                      {day.dateStr.substring(5).replace('-','/')}
                    </div>
                    <div className={`text-[11px] font-extrabold mt-0.5
                      ${day.isHoliday ? 'text-red-600' :
                        day.isToday ? 'text-sky-600' :
                        day.dayOfWeek === '日' || day.dayOfWeek === '六' ? 'text-amber-500' : 'text-slate-700'}`}>
                      {day.dayOfWeek}
                    </div>
                    
                    {/* 節日或會議標示 */}
                    {day.isHoliday && (
                       <div className="text-[7px] font-bold bg-gradient-to-br from-red-400 to-red-500 text-white rounded-sm mt-1 leading-tight w-full truncate px-0.5 shadow-[0_2px_4px_rgba(239,68,68,0.3)] transform scale-90" title={day.holidayName}>
                         {day.holidayName}
                       </div>
                    )}
                    {day.isMonday && !day.isHoliday && (
                      <div className="text-[8px] font-bold bg-gradient-to-br from-purple-400 to-purple-500 text-white rounded-sm mt-1 leading-tight w-fit mx-auto px-1 shadow-[0_2px_4px_rgba(168,85,247,0.3)] transform scale-90">
                        會
                      </div>
                    )}
                  </th>
                ))}
                {/* 列印用的簽名欄位 (表頭) - 平常隱藏，列印時才顯示 */}
                <th className="hidden print:table-cell p-1.5 text-center font-extrabold text-slate-700 border-b border-l border-slate-400 w-24 bg-white">
                  簽名確認
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {employees.map(emp => (
                <tr key={emp.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="sticky left-0 z-10 bg-white group-hover:bg-slate-50/50 p-1.5 border-b border-r border-slate-100 shadow-[1px_0_0_0_#e2e8f0] transition-colors print:static print:shadow-none print:bg-white print:border-slate-400">
                    <div className="text-[11px] font-bold text-slate-800 truncate">{emp.name}</div>
                    <div className="text-[9px] text-slate-400 font-medium truncate">
                      {emp.role === 'coach' ? '教練' : emp.role === 'frontdesk' ? '櫃台' : '工讀'}
                    </div>
                  </td>
                  
                  {fourWeeksDays.map(day => {
                    const shiftId = schedule[day.dateStr]?.[emp.id];
                    const shift = shiftId ? Object.values(SHIFTS).find(s => s.id === shiftId) : null;
                    const isSelected = selectedCell?.date === day.dateStr && selectedCell?.empId === emp.id;
                    
                    return (
                      <td key={`${emp.id}-${day.dateStr}`} 
                          className={`p-0.5 border-b border-r border-slate-100 h-9 relative cursor-pointer
                            ${day.isHoliday ? 'bg-red-50/40' : 
                              day.isToday ? 'bg-sky-50/40' : 
                              day.isMonday ? 'bg-purple-50/40' : 
                              day.isWeekend ? 'bg-yellow-50/60' : ''}
                            ${day.dayOfWeek === '日' ? 'border-r-2 border-r-slate-300/80' : ''}
                            ${quickShift ? 'hover:bg-indigo-100/80 cursor-cell' : 'hover:bg-indigo-50/80'} transition-colors print:border-slate-400 print:bg-white`}
                          onClick={(e) => {
                            if (viewMode === 'admin') {
                              e.stopPropagation();
                              if (quickShift) {
                                // 啟動筆刷模式，直接賦值
                                setSchedule(prev => {
                                  const newSchedule = { ...prev };
                                  if (!newSchedule[day.dateStr]) newSchedule[day.dateStr] = {};
                                  if (quickShift === 'CLEAR') {
                                    delete newSchedule[day.dateStr][emp.id];
                                  } else {
                                    newSchedule[day.dateStr][emp.id] = quickShift;
                                  }
                                  return newSchedule;
                                });
                              } else {
                                // 一般模式，開啟選單
                                setSelectedCell({ date: day.dateStr, empId: emp.id });
                              }
                            }
                          }}>
                        
                        {shift ? (
                          <div className={`w-full h-full rounded border ${shift.color} flex items-center justify-center text-[10px] font-bold shadow-sm ${shiftId === 'O' || shiftId === 'AL' ? 'opacity-80 border-dashed' : ''} print:border-slate-400 print:shadow-none print:bg-none print:text-black`}>
                            {shift.shortName}
                          </div>
                        ) : (
                          <div className="w-full h-full rounded border border-transparent flex items-center justify-center">
                             {viewMode === 'admin' && <span className="text-indigo-300 opacity-0 group-hover:opacity-100 scale-50 transition-opacity"><Icons.Plus /></span>}
                          </div>
                        )}
                      </td>
                    );
                  })}
                  {/* 列印用的簽名欄位 (內容) - 平常隱藏，列印時才顯示 */}
                  <td className="hidden print:table-cell p-1.5 border-b border-l border-slate-400 bg-white">
                    <div className="w-full h-5 border-b border-dashed border-slate-500 mt-2"></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 彈出排班選單 */}
        {selectedCell && viewMode === 'admin' && (
          <div className="absolute z-50 bg-white rounded-xl shadow-xl border border-slate-200 p-2 animate-in fade-in zoom-in-95 duration-200 print:hidden" 
               style={{ 
                 top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                 width: 'max-content'
               }}
               onClick={(e) => e.stopPropagation()}>
            <div className="text-xs font-bold text-slate-500 mb-2 px-1 text-center border-b pb-1">
              {selectedCell.date.substring(5).replace('-','/')} - {employees.find(e => e.id === selectedCell.empId)?.name}
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {Object.values(SHIFTS).map(shift => (
                <button
                  key={shift.id}
                  onClick={() => handleShiftAssign(shift.id)}
                  className={`px-3 py-2 rounded-lg text-xs font-bold border transition-all hover:scale-105 active:scale-95 ${shift.color}`}
                >
                  {shift.name}
                </button>
              ))}
            </div>
            <button
              onClick={() => handleShiftAssign(null)}
              className="mt-2 w-full px-3 py-1.5 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-100 transition-colors border border-slate-200"
            >
              清除排班 (留白)
            </button>
          </div>
        )}
      </div>
    );
  };

  // 登入畫面渲染
  if (viewMode === 'login') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-4 font-sans">
        <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-white/50 p-8 w-full max-w-sm animate-in fade-in zoom-in-95 duration-500">
          <div className="flex justify-center mb-6">
            <div className="bg-indigo-600 p-4 rounded-2xl text-white shadow-xl shadow-indigo-600/30">
              <Icons.Dumbbell />
            </div>
          </div>
          <h1 className="text-2xl font-extrabold text-center text-slate-800 mb-1">FITNESS SCHEDULE</h1>
          <p className="text-sm font-bold text-center text-slate-500 mb-8 tracking-wider">智能排班系統</p>
          
          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="請輸入系統密碼..."
                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-center tracking-[0.2em] text-lg font-bold text-slate-700 shadow-inner"
                autoFocus
              />
              {loginError && <p className="text-red-500 text-xs mt-2 text-center font-bold animate-pulse">{loginError}</p>}
            </div>
            <button type="submit" className="w-full py-3.5 bg-indigo-600 text-white rounded-xl font-extrabold tracking-widest shadow-md shadow-indigo-600/20 hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all">
              安 全 登 入
            </button>
          </form>
          
          <div className="mt-8 text-center text-[10px] text-slate-400 font-bold space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
            <p className="text-slate-500 mb-1">【 測試專用帳密 】</p>
            <p>管理員 (排班權限)：A12345</p>
            <p>員工 (預覽權限)：B12345</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 text-slate-900 font-sans p-2 md:p-3 flex justify-center print:p-0 print:bg-none print:bg-white">
      {/* 加入列印專屬的樣式 */}
      <style>{`
        @media print {
          @page { size: landscape; margin: 10mm; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background: white !important; }
          .custom-scrollbar::-webkit-scrollbar { display: none; }
        }
      `}</style>
      
      <div className="w-full max-w-full h-[97vh] flex flex-col gap-3 print:h-auto print:block">
        
        {/* 頂部導航欄 (質感升級) */}
        <header className="flex flex-col md:flex-row items-center justify-between bg-white/80 backdrop-blur-md px-5 py-3.5 rounded-2xl shadow-sm border border-slate-200/80 print:hidden">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-600/20">
              <Icons.Dumbbell />
            </div>
            <div>
              <h1 className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600 tracking-tight">
                FITNESS SCHEDULE
              </h1>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">智能排班系統 Pro</p>
            </div>
          </div>
          
          <div className="mt-3 md:mt-0 flex items-center gap-3">
            <div className={`px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm border ${viewMode === 'admin' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-slate-50 text-slate-700 border-slate-200'}`}>
              <span className="opacity-70 font-normal mr-1">目前身分:</span> 
              {viewMode === 'admin' ? '管理員 (可編輯)' : '一般員工 (僅預覽)'}
            </div>
            <button 
              onClick={handleLogout}
              className="px-3 py-1.5 flex items-center gap-1.5 rounded-lg text-xs font-bold transition-all duration-300 bg-white border border-slate-200 text-slate-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50 shadow-sm active:scale-95"
            >
              <Icons.LogOut /> 登出系統
            </button>
          </div>
        </header>

        {/* 導航分頁籤 (蘋果風格 Segmented Control) */}
        <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between px-1 print:hidden">
          <div className="flex bg-slate-200/60 p-1 rounded-xl shadow-inner border border-slate-200/50">
            <button onClick={() => setCurrentTab('weekly')} className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${currentTab === 'weekly' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
              <Icons.Calendar /> 四週總表
            </button>
            <button onClick={() => setCurrentTab('daily')} className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${currentTab === 'daily' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
              <Icons.Clock /> 單日時間軸
            </button>
            {viewMode === 'admin' && (
              <button onClick={() => setCurrentTab('employees')} className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${currentTab === 'employees' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                <Icons.Users /> 員工管理
              </button>
            )}
          </div>
        </div>

        {/* 員工視角提醒 */}
        {viewMode === 'employee' && (
          <div className="bg-indigo-50/80 backdrop-blur-sm border border-indigo-100 text-indigo-800 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm animate-in fade-in print:hidden">
            <Icons.Eye /> 這是預覽模式，您正在查看最新的班表狀態，無法進行修改。
          </div>
        )}

        {/* 主內容區 */}
        <main className="flex-1 overflow-hidden pb-1 print:overflow-visible">
          {currentTab === 'weekly' && renderFourWeekRoster()}
          {currentTab === 'daily' && renderDailyTimeline()}
          {currentTab === 'employees' && renderEmployeeManager()}
        </main>

      </div>
    </div>
  );
}