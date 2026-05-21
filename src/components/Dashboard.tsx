import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  collection, query, onSnapshot, doc, addDoc, updateDoc, deleteDoc, getDocs, where, orderBy, serverTimestamp 
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { db, auth, COLUMNS, ALL_CLASSES } from "../firebase";
import { Student, Teacher, Admission, FeeRecord, AttendanceRecord } from "../types";
import { 
  LayoutDashboard, Users, UserPlus, ClipboardCheck, Wallet, 
  BookOpen, FolderOpen, FileBarChart, LogOut, Loader2, Search, 
  Plus, Edit, Trash2, Check, X, FileText, Share2, Phone, Calendar 
} from "lucide-react";

interface DashboardProps {
  onNavigate: (view: "home" | "login" | "dashboard") => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const [activePanel, setActivePanel] = useState("overview");

  // State Caching
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [fees, setFees] = useState<FeeRecord[]>([]);
  const [attendance, setAttendance] = useState<{ [studentId: string]: "Present" | "Absent" }>({});
  const [attDate, setAttDate] = useState(new Date().toISOString().split("T")[0]);
  const [attClassFilter, setAttClassFilter] = useState("Nursery");

  // Filtering / Search States
  const [studentSearch, setStudentSearch] = useState("");
  const [studentClassFilter, setStudentClassFilter] = useState("");
  const [admissionSearch, setAdmissionSearch] = useState("");
  const [admissionStatusFilter, setAdmissionStatusFilter] = useState("");
  const [feeSearch, setFeeSearch] = useState("");
  const [feeStatusFilter, setFeeStatusFilter] = useState("");
  const [teacherSearch, setTeacherSearch] = useState("");

  // Create/Edit Form Medals/States
  const [modalType, setModalType] = useState<string | null>(null); // "student" | "teacher" | "fee" | "admission"
  const [editId, setEditId] = useState<string | null>(null);

  // Form Field States
  const [sForm, setSForm] = useState({ name: "", dob: "", gender: "Male", class: "Nursery", roll: "", parent: "", phone: "", address: "", aadhaar: "", prevSchool: "" });
  const [tForm, setTForm] = useState({ name: "", phone: "", email: "", qualification: "", experience: "", subjects: "", joinDate: "", salary: "", classes: [] as string[] });
  const [admForm, setAdmForm] = useState({ name: "", dob: "", gender: "Male", class: "Nursery", parent: "", phone: "", date: new Date().toISOString().split("T")[0], status: "Pending" as "Pending" | "Approved" | "Rejected", prevSchool: "", remarks: "" });
  const [feeForm, setFeeForm] = useState({ studentId: "", amount: "", feeType: "Tuition", month: "June", date: new Date().toISOString().split("T")[0], status: "Paid" as "Paid" | "Pending", notes: "" });

  // Reporting preview
  const [reportPreview, setReportPreview] = useState<{ title: string; html: string } | null>(null);

  // Firebase Realtime Subscriptions
  useEffect(() => {
    const unsubStudents = onSnapshot(query(collection(db, COLUMNS.STUDENTS), orderBy("createdAt", "desc")), (snap) => {
      const data: Student[] = [];
      snap.forEach(d => data.push({ id: d.id, ...d.data() } as Student));
      setStudents(data);
    });

    const unsubTeachers = onSnapshot(query(collection(db, COLUMNS.TEACHERS), orderBy("createdAt", "desc")), (snap) => {
      const data: Teacher[] = [];
      snap.forEach(d => data.push({ id: d.id, ...d.data() } as Teacher));
      setTeachers(data);
    });

    const unsubAdmissions = onSnapshot(query(collection(db, COLUMNS.ADMISSIONS), orderBy("createdAt", "desc")), (snap) => {
      const data: Admission[] = [];
      snap.forEach(d => data.push({ id: d.id, ...d.data() } as Admission));
      setAdmissions(data);
    });

    const unsubFees = onSnapshot(query(collection(db, COLUMNS.FEES), orderBy("createdAt", "desc")), (snap) => {
      const data: FeeRecord[] = [];
      snap.forEach(d => data.push({ id: d.id, ...d.data() } as FeeRecord));
      setFees(data);
    });

    return () => {
      unsubStudents();
      unsubTeachers();
      unsubAdmissions();
      unsubFees();
    };
  }, []);

  // Sync Attendance data when filters change
  useEffect(() => {
    if (activePanel === "attendance") {
      getAttendanceData();
    }
  }, [attDate, attClassFilter, activePanel]);

  const getAttendanceData = async () => {
    try {
      const snap = await getDocs(query(collection(db, COLUMNS.ATTENDANCE), where("date", "==", attDate)));
      const data: { [studentId: string]: "Present" | "Absent" } = {};
      snap.forEach(d => {
        const item = d.data();
        data[item.studentId] = item.status;
      });
      setAttendance(data);
    } catch (err) {
      console.error("Error loaded attendance:", err);
    }
  };

  const saveAttendance = async () => {
    try {
      const existSnap = await getDocs(query(collection(db, COLUMNS.ATTENDANCE), where("date", "==", attDate)));
      const delPromises = existSnap.docs.map(d => deleteDoc(doc(db, COLUMNS.ATTENDANCE, d.id)));
      await Promise.all(delPromises);

      const addPromises = Object.entries(attendance).map(([studentId, status]) => {
        const student = students.find(s => s.id === studentId);
        return addDoc(collection(db, COLUMNS.ATTENDANCE), {
          studentId,
          status,
          date: attDate,
          studentName: student?.name || "",
          class: student?.class || "",
          createdAt: serverTimestamp()
        });
      });
      await Promise.all(addPromises);
      alert("✅ Attendance saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Error saving attendance");
    }
  };

  const handleLogout = () => {
    if (window.confirm("Logout from Sri Chaithanya School Admin?")) {
      signOut(auth).then(() => onNavigate("home"));
    }
  };

  // Helper selectors
  const totalStudents = students.length;
  const totalTeachers = teachers.length;
  const pendingAdmissions = admissions.filter(a => a.status === "Pending").length;
  
  let collectedFees = 0;
  let pendingFees = 0;
  fees.forEach(f => {
    if (f.status === "Paid") collectedFees += f.amount || 0;
    else pendingFees += f.amount || 0;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0">
        {/* Core Header */}
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-[#ff6b6b] to-[#ffd43b] flex items-center justify-center text-white font-extrabold select-none">
            SC
          </div>
          <div>
            <h2 className="text-sm font-black font-display text-white tracking-wide">Sri Chaithanya</h2>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Admin Portal</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {[
            { id: "overview", label: "Overview", icon: <LayoutDashboard className="w-4 h-4" /> },
            { id: "students", label: "Students", icon: <Users className="w-4 h-4" />, count: students.length },
            { id: "admissions", label: "Admissions", icon: <UserPlus className="w-4 h-4" />, count: admissions.length },
            { id: "attendance", label: "Attendance", icon: <ClipboardCheck className="w-4 h-4" /> },
            { id: "fees", label: "Fees", icon: <Wallet className="w-4 h-4" /> },
            { id: "teachers", label: "Teachers", icon: <BookOpen className="w-4 h-4" />, count: teachers.length },
            { id: "reports", label: "Reports & Analytics", icon: <FileBarChart className="w-4 h-4" /> }
          ].map(it => (
            <button
              key={it.id}
              onClick={() => setActivePanel(it.id)}
              className={`w-full flex items-center justify-between px-4 py-3 text-xs font-bold font-display rounded-xl tracking-wide transition-all cursor-pointer ${activePanel === it.id ? "bg-amber-400 text-slate-900 shadow-md" : "hover:bg-slate-850 text-slate-400 hover:text-white"}`}
            >
              <div className="flex items-center gap-3">
                {it.icon}
                <span>{it.label}</span>
              </div>
              {it.count !== undefined && (
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${activePanel === it.id ? "bg-slate-950 text-white" : "bg-slate-800 text-slate-400"}`}>
                  {it.count}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Footer Logout */}
        <div className="p-4 border-t border-slate-800">
          <div className="px-4 py-2 bg-slate-950/40 rounded-xl mb-4">
            <span className="block text-[10px] font-black text-slate-600 uppercase tracking-wider">Active Admin</span>
            <span className="block text-xs font-bold text-slate-300 truncate">{auth.currentUser?.email || "Principal"}</span>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3 bg-red-600/10 hover:bg-red-600/20 text-red-400 rounded-xl text-xs font-bold border border-red-500/10 hover:border-red-500/2 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Panel Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-w-7xl mx-auto w-full">
        <header className="flex justify-between items-center mb-8 border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-2xl font-black font-display text-slate-850 tracking-tight leading-none mb-1">
              {activePanel === "overview" && "Dashboard Overview"}
              {activePanel === "students" && "Student Directory"}
              {activePanel === "admissions" && "Admissions Desk"}
              {activePanel === "attendance" && "Attendance Registry"}
              {activePanel === "fees" && "Fee Records Ledger"}
              {activePanel === "teachers" && "Faculty Management"}
              {activePanel === "reports" && "Analytic Reports"}
            </h1>
            <p className="text-xs text-slate-400 font-bold font-sans uppercase tracking-widest">Garladinne Parent Branch</p>
          </div>
          <div className="px-4 py-2 bg-white rounded-full border border-slate-200 text-xs font-bold text-slate-500 select-none shadow-sm flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            {new Date().toLocaleDateString("en-IN", { weekday: "short", day: "2-digit", month: "short", year: "numeric" })}
          </div>
        </header>

        {/* Dashboard Panels */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activePanel}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* PANELS OVERVIEW */}
            {activePanel === "overview" && (
              <div className="space-y-6">
                {/* Stats row cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Card 1 */}
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200/80 flex justify-between items-center">
                    <div>
                      <span className="block text-[11px] font-black text-slate-400 uppercase tracking-wider mb-2">Total Students</span>
                      <h3 className="text-3xl font-black font-display text-slate-800 leading-none mb-2">{totalStudents}</h3>
                      <span className="text-[10px] bg-sky-50 text-[#4dadf7] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Across 13 Classes
                      </span>
                    </div>
                    <span className="text-4xl bg-slate-50 p-4 border border-slate-100 rounded-2xl block select-none">🎓</span>
                  </div>

                  {/* Card 2 */}
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200/80 flex justify-between items-center">
                    <div>
                      <span className="block text-[11px] font-black text-slate-400 uppercase tracking-wider mb-2">Fee Collections</span>
                      <h3 className="text-3xl font-black font-display text-slate-800 leading-none mb-2">₹{collectedFees.toLocaleString("en-IN")}</h3>
                      <span className="text-[10px] bg-[#e8f8ee] text-emerald-500 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        ₹{pendingFees.toLocaleString("en-IN")} Pending
                      </span>
                    </div>
                    <span className="text-4xl bg-slate-50 p-4 border border-slate-100 rounded-2xl block select-none">💰</span>
                  </div>

                  {/* Card 3 */}
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200/80 flex justify-between items-center">
                    <div>
                      <span className="block text-[11px] font-black text-slate-400 uppercase tracking-wider mb-2">Admissions Queue</span>
                      <h3 className="text-3xl font-black font-display text-slate-800 leading-none mb-2">{pendingAdmissions}</h3>
                      <span className="text-[10px] bg-amber-50 text-amber-500 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Awaiting Decisions
                      </span>
                    </div>
                    <span className="text-4xl bg-slate-50 p-4 border border-slate-100 rounded-2xl block select-none">📋</span>
                  </div>

                  {/* Card 4 */}
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200/80 flex justify-between items-center">
                    <div>
                      <span className="block text-[11px] font-black text-slate-400 uppercase tracking-wider mb-2">Faculty Strength</span>
                      <h3 className="text-3xl font-black font-display text-slate-800 leading-none mb-2">{totalTeachers}</h3>
                      <span className="text-[10px] bg-[#fff0f6] text-brand-primary font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Mentoring Daily
                      </span>
                    </div>
                    <span className="text-4xl bg-slate-50 p-4 border border-slate-100 rounded-2xl block select-none">👨‍🏫</span>
                  </div>
                </div>

                {/* Sub row - Recent Enrollees */}
                <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-200/80 shadow-sm">
                  <h3 className="text-lg font-black font-display text-slate-800 mb-6 flex items-center justify-between">
                    <span>Recent Students Registered</span>
                    <button onClick={() => setActivePanel("students")} className="text-xs text-sky-500 hover:underline">View Student Directory</button>
                  </h3>
                  
                  {students.length === 0 ? (
                    <div className="text-center py-10">
                      <span className="text-4xl block mb-2">🎓</span>
                      <span className="text-slate-400 text-sm font-semibold">No students yet. Ready to start boarding?</span>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-slate-100 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                            <th className="pb-3 text-slate-500">Student Name</th>
                            <th className="pb-3 text-slate-500">Class</th>
                            <th className="pb-3 text-slate-500">Parent / Guardian</th>
                            <th className="pb-3 text-slate-500 text-right">Mobile No</th>
                          </tr>
                        </thead>
                        <tbody>
                          {students.slice(0, 5).map((s) => (
                            <tr key={s.id} className="border-b border-slate-50 last:border-none hover:bg-slate-50/50">
                              <td className="py-3.5 font-bold text-slate-800">{s.name}</td>
                              <td className="py-3.5">
                                <span className="bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide">
                                  {s.class}
                                </span>
                              </td>
                              <td className="py-3.5 font-semibold text-slate-500">{s.parent}</td>
                              <td className="py-3.5 text-right font-semibold text-[#4dadf7]">{s.phone}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* PANEL STUDENTS */}
            {activePanel === "students" && (
              <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-200/80 shadow-sm space-y-6">
                {/* Search filters header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex flex-1 flex-col sm:flex-row gap-3">
                    {/* Input search */}
                    <div className="relative flex-1">
                      <Search className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
                      <input 
                        type="text" 
                        value={studentSearch}
                        onChange={(e) => setStudentSearch(e.target.value)}
                        placeholder="Search student by name or parent..."
                        className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-3 rounded-2xl text-xs outline-none focus:border-[#4dadf7] transition"
                      />
                    </div>
                    {/* Select class */}
                    <select
                      value={studentClassFilter}
                      onChange={(e) => setStudentClassFilter(e.target.value)}
                      className="bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl text-xs outline-none cursor-pointer"
                    >
                      <option value="">All Classes</option>
                      {ALL_CLASSES.map(cls => <option key={cls} value={cls}>{cls}</option>)}
                    </select>
                  </div>

                  <button 
                    onClick={() => {
                      setEditId(null);
                      setSForm({ name: "", dob: "", gender: "Male", class: "Nursery", roll: "", parent: "", phone: "", address: "", aadhaar: "", prevSchool: "" });
                      setModalType("student");
                    }}
                    className="py-3 px-5 bg-[#4dadf7] text-white hover:bg-sky-500 font-bold rounded-2xl text-xs flex items-center gap-1 cursor-pointer transition shadow-lg shadow-sky-100"
                  >
                    <Plus className="w-4 h-4" /> Add Student
                  </button>
                </div>

                {/* Table Data */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <th className="pb-3 text-slate-500 font-extrabold pb-3 w-12">No</th>
                        <th className="pb-3 text-slate-500 font-extrabold pb-3">Name</th>
                        <th className="pb-3 text-slate-500 font-extrabold pb-3">Class</th>
                        <th className="pb-3 text-slate-500 font-extrabold pb-3">Gender</th>
                        <th className="pb-3 text-slate-500 font-extrabold pb-3">Parent</th>
                        <th className="pb-3 text-slate-500 font-extrabold pb-3">Contact</th>
                        <th className="pb-3 text-slate-500 font-extrabold pb-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students
                        .filter(s => {
                          const queryMatch = s.name?.toLowerCase().includes(studentSearch.toLowerCase()) || s.parent?.toLowerCase().includes(studentSearch.toLowerCase());
                          const classMatch = studentClassFilter ? s.class === studentClassFilter : true;
                          return queryMatch && classMatch;
                        })
                        .map((s, idx) => (
                          <tr key={s.id} className="border-b border-slate-50 last:border-none hover:bg-slate-50/50">
                            <td className="py-3.5 font-bold text-slate-400">{idx + 1}</td>
                            <td className="py-3.5 font-bold text-slate-800">
                              <div>{s.name}</div>
                              <div className="text-[10px] text-slate-400 font-medium">Roll No: {s.roll || "—"}</div>
                            </td>
                            <td className="py-3.5">
                              <span className="bg-sky-50 text-[#4dadf7] font-black uppercase tracking-wide text-[10px] px-2.5 py-0.5 rounded-full">
                                {s.class}
                              </span>
                            </td>
                            <td className="py-3.5">
                              <span className={`font-bold py-0.5 px-2 rounded-full text-[10px] ${s.gender === "Male" ? "bg-amber-50 text-amber-500" : "bg-purple-50 text-purple-500"}`}>
                                {s.gender}
                              </span>
                            </td>
                            <td className="py-3.5 text-slate-600 font-semibold">{s.parent}</td>
                            <td className="py-3.5 text-[#4dadf7] font-bold">
                              <a href={`tel:${s.phone}`} className="flex items-center gap-1">
                                <Phone className="w-3 h-3" /> {s.phone}
                              </a>
                            </td>
                            <td className="py-3.5 text-right flex items-center justify-end gap-2">
                              <button 
                                onClick={() => {
                                  setEditId(s.id);
                                  setSForm({
                                    name: s.name, dob: s.dob, gender: s.gender, class: s.class,
                                    roll: s.roll || "", parent: s.parent, phone: s.phone,
                                    address: s.address || "", aadhaar: s.aadhaar || "", prevSchool: s.prevSchool || ""
                                  });
                                  setModalType("student");
                                }}
                                className="h-8 w-8 rounded-lg bg-sky-50 text-[#4dadf7] flex items-center justify-center border border-sky-100 hover:bg-sky-100 cursor-pointer"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button 
                                onClick={async () => {
                                  if (window.confirm(`Are you sure you want to delete ${s.name}?`)) {
                                    await deleteDoc(doc(db, COLUMNS.STUDENTS, s.id));
                                    alert("Deleted Student.");
                                  }
                                }}
                                className="h-8 w-8 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center border border-rose-100 hover:bg-rose-100 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* PANEL ADMISSIONS */}
            {activePanel === "admissions" && (
              <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-200/80 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex flex-1 flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
                      <input 
                        type="text" 
                        value={admissionSearch}
                        onChange={(e) => setAdmissionSearch(e.target.value)}
                        placeholder="Search applicants..."
                        className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-3 rounded-2xl text-xs outline-none focus:border-[#4dadf7] transition"
                      />
                    </div>
                    <select
                      value={admissionStatusFilter}
                      onChange={(e) => setAdmissionStatusFilter(e.target.value)}
                      className="bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl text-xs outline-none cursor-pointer"
                    >
                      <option value="">All Statuses</option>
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>

                  <button 
                    onClick={() => {
                      setEditId(null);
                      setAdmForm({ name: "", dob: "", gender: "Male", class: "Nursery", parent: "", phone: "", date: new Date().toISOString().split("T")[0], status: "Pending", prevSchool: "", remarks: "" });
                      setModalType("admission");
                    }}
                    className="py-3 px-5 bg-amber-400 text-slate-950 hover:bg-amber-500 font-bold rounded-2xl text-xs flex items-center gap-1 cursor-pointer transition shadow-lg shadow-amber-100"
                  >
                    <Plus className="w-4 h-4" /> Record Admission
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <th className="pb-3 text-slate-500 font-extrabold pb-3 w-12">No</th>
                        <th className="pb-3 text-slate-500 font-extrabold pb-3">Applicant</th>
                        <th className="pb-3 text-slate-500 font-extrabold pb-3">Class</th>
                        <th className="pb-3 text-slate-500 font-extrabold pb-3">Parent</th>
                        <th className="pb-3 text-slate-500 font-extrabold pb-3">Contact</th>
                        <th className="pb-3 text-slate-500 font-extrabold pb-3">Date</th>
                        <th className="pb-3 text-slate-500 font-extrabold pb-3">Status</th>
                        <th className="pb-3 text-slate-500 font-extrabold pb-3 text-right">Decisions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {admissions
                        .filter(a => {
                          const queryMatch = a.name?.toLowerCase().includes(admissionSearch.toLowerCase()) || a.parent?.toLowerCase().includes(admissionSearch.toLowerCase());
                          const statusMatch = admissionStatusFilter ? a.status === admissionStatusFilter : true;
                          return queryMatch && statusMatch;
                        })
                        .map((a, idx) => (
                          <tr key={a.id} className="border-b border-slate-50 last:border-none hover:bg-slate-50/50">
                            <td className="py-3.5 font-bold text-slate-400">{idx + 1}</td>
                            <td className="py-3.5 font-bold text-slate-800">{a.name}</td>
                            <td className="py-3.5">
                              <span className="bg-sky-50 text-[#4dadf7] font-black uppercase tracking-wide text-[10px] px-2.5 py-0.5 rounded-full">
                                {a.class}
                              </span>
                            </td>
                            <td className="py-3.5 font-semibold text-slate-600">{a.parent}</td>
                            <td className="py-3.5 text-[#4dadf7] font-bold">
                              <a href={`tel:${a.phone}`} className="flex items-center gap-1">
                                <Phone className="w-3 h-3" /> {a.phone}
                              </a>
                            </td>
                            <td className="py-3.5 font-semibold text-slate-500">{a.date}</td>
                            <td className="py-3.5">
                              <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black tracking-wider uppercase ${a.status === "Approved" ? "bg-emerald-50 text-emerald-500" : a.status === "Rejected" ? "bg-rose-50 text-rose-500" : "bg-amber-50 text-amber-500"}`}>
                                {a.status}
                              </span>
                            </td>
                            <td className="py-3.5 text-right flex items-center justify-end gap-1.5">
                              <button 
                                onClick={async () => {
                                  await updateDoc(doc(db, COLUMNS.ADMISSIONS, a.id), { status: "Approved", updatedAt: serverTimestamp() });
                                  alert("System: Admission Approved! ✅");
                                }}
                                className="h-7 w-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 hover:bg-emerald-100 cursor-pointer"
                                title="Approve"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button 
                                onClick={async () => {
                                  await updateDoc(doc(db, COLUMNS.ADMISSIONS, a.id), { status: "Rejected", updatedAt: serverTimestamp() });
                                  alert("System: Admission Rejected. ❌");
                                }}
                                className="h-7 w-7 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center border border-rose-100 hover:bg-rose-100 cursor-pointer"
                                title="Reject"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                              <button 
                                onClick={() => {
                                  setEditId(a.id);
                                  setAdmForm({
                                    name: a.name, dob: a.dob, gender: a.gender, class: a.class,
                                    parent: a.parent, phone: a.phone, date: a.date, status: a.status,
                                    prevSchool: a.prevSchool || "", remarks: a.remarks || ""
                                  });
                                  setModalType("admission");
                                }}
                                className="h-7 w-7 rounded-lg bg-sky-50 text-sky-500 flex items-center justify-center border border-sky-100 hover:bg-sky-100 cursor-pointer"
                                title="Edit"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button 
                                onClick={async () => {
                                  if (window.confirm("Delete record?")) {
                                    await deleteDoc(doc(db, COLUMNS.ADMISSIONS, a.id));
                                  }
                                }}
                                className="h-7 w-7 rounded-lg bg-slate-50 text-slate-500 flex items-center justify-center border border-slate-100 hover:bg-slate-100 cursor-pointer"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* PANEL ATTENDANCE */}
            {activePanel === "attendance" && (
              <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-200/80 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input 
                      type="date" 
                      value={attDate}
                      onChange={(e) => setAttDate(e.target.value)}
                      className="bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl text-sm font-bold outline-none cursor-pointer"
                    />
                    <select
                      value={attClassFilter}
                      onChange={(e) => setAttClassFilter(e.target.value)}
                      className="bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl text-xs font-bold outline-none cursor-pointer"
                    >
                      {ALL_CLASSES.map(cls => <option key={cls} value={cls}>{cls}</option>)}
                    </select>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        const next: { [studentId: string]: "Present" | "Absent" } = {};
                        students.filter(s => s.class === attClassFilter).forEach(s => next[s.id] = "Present");
                        setAttendance(next);
                      }}
                      className="py-3 px-4 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 text-xs font-bold rounded-2xl cursor-pointer"
                    >
                      Mark All Present
                    </button>
                    <button 
                      onClick={() => {
                        const next: { [studentId: string]: "Present" | "Absent" } = {};
                        students.filter(s => s.class === attClassFilter).forEach(s => next[s.id] = "Absent");
                        setAttendance(next);
                      }}
                      className="py-3 px-4 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 text-xs font-bold rounded-2xl cursor-pointer"
                    >
                      Mark All Absent
                    </button>
                    <button 
                      onClick={saveAttendance}
                      className="py-3 px-5 bg-slate-900 border border-slate-950 text-white font-extrabold text-xs rounded-2xl shadow shadow-slate-100 flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="w-4 h-4" /> Save Attendance
                    </button>
                  </div>
                </div>

                {/* Grid list of target class enrollees */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {students.filter(s => s.class === attClassFilter).length === 0 ? (
                    <div className="col-span-full text-center py-12">
                      <span className="text-4xl block mb-2">📬</span>
                      <span className="text-sm font-bold text-slate-400">No students found in {attClassFilter} class.</span>
                    </div>
                  ) : (
                    students.filter(s => s.class === attClassFilter).map(s => {
                      const status = attendance[s.id];
                      return (
                        <div key={s.id} className="p-5 rounded-2xl border border-slate-200/80 bg-white shadow-sm flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-black font-display text-slate-800 leading-snug">{s.name}</h4>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">{s.class} class {s.roll ? `· Roll ${s.roll}` : ""}</p>
                          </div>
                          
                          <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200">
                            <button
                              onClick={() => setAttendance(prev => ({ ...prev, [s.id]: "Present" }))}
                              className={`px-3 py-1.5 text-[10px] font-black rounded-lg transition-all cursor-pointer ${status === "Present" ? "bg-emerald-500 text-white shadow-sm" : "hover:bg-slate-200/50 text-slate-500"}`}
                            >
                              Present
                            </button>
                            <button
                              onClick={() => setAttendance(prev => ({ ...prev, [s.id]: "Absent" }))}
                              className={`px-3 py-1.5 text-[10px] font-black rounded-lg transition-all cursor-pointer ${status === "Absent" ? "bg-rose-500 text-white shadow-sm" : "hover:bg-slate-200/50 text-slate-500"}`}
                            >
                              Absent
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* PANEL FEES */}
            {activePanel === "fees" && (
              <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-200/80 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex flex-1 flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
                      <input 
                        type="text" 
                        value={feeSearch}
                        onChange={(e) => setFeeSearch(e.target.value)}
                        placeholder="Search student fee records..."
                        className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-3 rounded-2xl text-xs outline-none focus:border-[#4dadf7] transition"
                      />
                    </div>
                    <select
                      value={feeStatusFilter}
                      onChange={(e) => setFeeStatusFilter(e.target.value)}
                      className="bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl text-xs outline-none cursor-pointer"
                    >
                      <option value="">All Statuses</option>
                      <option value="Paid">Paid</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </div>

                  <button 
                    onClick={() => {
                      setEditId(null);
                      setFeeForm({ studentId: "", amount: "", feeType: "Tuition", month: "June", date: new Date().toISOString().split("T")[0], status: "Paid", notes: "" });
                      setModalType("fee");
                    }}
                    className="py-3 px-5 bg-emerald-500 text-white hover:bg-emerald-600 font-bold rounded-2xl text-xs flex items-center gap-1 cursor-pointer transition shadow-lg shadow-emerald-100"
                  >
                    <Plus className="w-4 h-4" /> Add Fee Record
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <th className="pb-3 text-slate-500 font-extrabold pb-3 w-12">No</th>
                        <th className="pb-3 text-slate-500 font-extrabold pb-3">Student Name</th>
                        <th className="pb-3 text-slate-500 font-extrabold pb-3">Class</th>
                        <th className="pb-3 text-slate-500 font-extrabold pb-3">Fee Type</th>
                        <th className="pb-3 text-slate-500 font-extrabold pb-3">Period</th>
                        <th className="pb-3 text-slate-500 font-extrabold pb-3">Amount</th>
                        <th className="pb-3 text-slate-500 font-extrabold pb-3">Status</th>
                        <th className="pb-3 text-slate-500 font-extrabold pb-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fees
                        .filter(f => {
                          const queryMatch = f.studentName?.toLowerCase().includes(feeSearch.toLowerCase());
                          const statusMatch = feeStatusFilter ? f.status === feeStatusFilter : true;
                          return queryMatch && statusMatch;
                        })
                        .map((f, idx) => (
                          <tr key={f.id} className="border-b border-slate-50 last:border-none hover:bg-slate-50/50">
                            <td className="py-3.5 font-bold text-slate-400">{idx + 1}</td>
                            <td className="py-3.5 font-bold text-slate-800">{f.studentName}</td>
                            <td className="py-3.5">
                              <span className="bg-sky-50 text-[#4dadf7] font-black uppercase tracking-wide text-[10px] px-2.5 py-0.5 rounded-full">
                                {f.class}
                              </span>
                            </td>
                            <td className="py-3.5 font-semibold text-slate-600">{f.feeType}</td>
                            <td className="py-3.5 font-semibold text-slate-550">{f.month || "—"}</td>
                            <td className="py-3.5 font-extrabold text-slate-800">₹{(f.amount || 0).toLocaleString("en-IN")}</td>
                            <td className="py-3.5">
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-black tracking-wider uppercase border ${f.status === "Paid" ? "bg-emerald-50 text-emerald-500 border-emerald-100" : "bg-rose-50 text-[#ff6b6b] border-rose-100"}`}>
                                {f.status}
                              </span>
                            </td>
                            <td className="py-3.5 text-right flex items-center justify-end gap-1.5">
                              {f.status === "Pending" && (
                                <button 
                                  onClick={async () => {
                                    await updateDoc(doc(db, COLUMNS.FEES, f.id), { status: "Paid", updatedAt: serverTimestamp() });
                                    alert("Fee Marked Paid!");
                                  }}
                                  className="h-7 px-2.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-100 font-bold text-[9px] uppercase tracking-wide flex items-center gap-0.5 cursor-pointer"
                                >
                                  <Check className="w-3 h-3" /> Mark Paid
                                </button>
                              )}
                              <button 
                                onClick={async () => {
                                  if (window.confirm("Delete record?")) {
                                    await deleteDoc(doc(db, COLUMNS.FEES, f.id));
                                  }
                                }}
                                className="h-7 w-7 rounded-lg bg-slate-50 text-slate-500 flex items-center justify-center border border-slate-100 hover:bg-slate-100 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* PANEL TEACHERS */}
            {activePanel === "teachers" && (
              <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-200/80 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
                    <input 
                      type="text" 
                      value={teacherSearch}
                      onChange={(e) => setTeacherSearch(e.target.value)}
                      placeholder="Search faculty by name or subject..."
                      className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-3 rounded-2xl text-xs outline-none focus:border-[#4dadf7] transition"
                    />
                  </div>

                  <button 
                    onClick={() => {
                      setEditId(null);
                      setTForm({ name: "", phone: "", email: "", qualification: "", experience: "", subjects: "", joinDate: "", salary: "", classes: [] });
                      setModalType("teacher");
                    }}
                    className="py-3 px-5 bg-brand-primary text-white hover:bg-[#fa5252] font-bold rounded-2xl text-xs flex items-center gap-1 cursor-pointer transition shadow-lg shadow-red-100"
                  >
                    <Plus className="w-4 h-4" /> Add Teacher
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <th className="pb-3 text-slate-500 font-extrabold pb-3 w-12">No</th>
                        <th className="pb-3 text-slate-500 font-extrabold pb-3">Faculty Name</th>
                        <th className="pb-3 text-slate-500 font-extrabold pb-3">Qualification</th>
                        <th className="pb-3 text-slate-500 font-extrabold pb-3">Primary Subjects</th>
                        <th className="pb-3 text-slate-500 font-extrabold pb-3">Classes Assigned</th>
                        <th className="pb-3 text-slate-500 font-extrabold pb-3">Contact No</th>
                        <th className="pb-3 text-slate-500 font-extrabold pb-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teachers
                        .filter(t => t.name?.toLowerCase().includes(teacherSearch.toLowerCase()) || t.subjects?.toLowerCase().includes(teacherSearch.toLowerCase()))
                        .map((t, idx) => (
                          <tr key={t.id} className="border-b border-slate-50 last:border-none hover:bg-slate-50/50">
                            <td className="py-3.5 font-bold text-slate-400">{idx + 1}</td>
                            <td className="py-3.5 font-bold text-slate-800">{t.name}</td>
                            <td className="py-3.5 font-semibold text-slate-550">{t.qualification}</td>
                            <td className="py-3.5 font-semibold text-slate-600">{t.subjects}</td>
                            <td className="py-3.5 flex flex-wrap gap-1 max-w-xs pt-4">
                              {(t.classes || []).map(cls => (
                                <span key={cls} className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[8px] font-black tracking-wide uppercase">
                                  {cls}
                                </span>
                              ))}
                            </td>
                            <td className="py-3.5 text-[#4dadf7] font-bold">
                              <a href={`tel:${t.phone}`} className="flex items-center gap-1">
                                <Phone className="w-3 h-3" /> {t.phone}
                              </a>
                            </td>
                            <td className="py-3.5 text-right flex items-center justify-end gap-1.5">
                              <button 
                                onClick={() => {
                                  setEditId(t.id);
                                  setTForm({
                                    name: t.name, phone: t.phone, email: t.email || "",
                                    qualification: t.qualification, experience: t.experience || "",
                                    subjects: t.subjects, joinDate: t.joinDate || "", salary: t.salary || "",
                                    classes: t.classes || []
                                  });
                                  setModalType("teacher");
                                }}
                                className="h-7 w-7 rounded-lg bg-sky-50 text-[#4dadf7] flex items-center justify-center border border-sky-100 hover:bg-sky-100 cursor-pointer"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button 
                                onClick={async () => {
                                  if (window.confirm("Remove teacher from roster?")) {
                                    await deleteDoc(doc(db, COLUMNS.TEACHERS, t.id));
                                  }
                                }}
                                className="h-7 w-7 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center border border-rose-100 hover:bg-rose-100 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* PANEL REPORTS */}
            {activePanel === "reports" && (
              <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-[#faf9f5]/80 shadow-sm space-y-6">
                <div>
                  <h3 className="text-sm font-black font-display text-slate-850 uppercase tracking-widest mb-2">School Records Reports generator</h3>
                  <p className="text-xs text-slate-500">Pick any ledger item type below to prompt compile summary records in printable preview frames.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                    <h4 className="text-xs font-black font-display uppercase text-slate-700 tracking-wider mb-4">Financial Statements</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button 
                        onClick={() => {
                          const html = `
                            <div style="font-family:sans-serif;padding:10px;">
                              <h2 style="font-family:serif;color:#c08028;">💰 Complete Fees Ledger</h2>
                              <p style="font-size:12px;color:#666;">Generated on: ${new Date().toLocaleDateString("en-IN")}</p>
                              <hr style="border-color:#eee;margin:15px 0;">
                              <div style="display:flex;justify-content:space-between;font-weight:bold;font-size:13px;background:#f5f5f5;padding:10px;border-radius:6px;margin-bottom:10px;">
                                <span>Collected Fees: ₹${collectedFees.toLocaleString("en-IN")}</span>
                                <span>Pending Receivables: ₹${pendingFees.toLocaleString("en-IN")}</span>
                              </div>
                              <p style="font-size:11px;color:#888;">Total billing active logs database logs: ${fees.length} entries matching record index keys.</p>
                            </div>
                          `;
                          setReportPreview({ title: "Fees Balance Sheet Report Summary", html });
                        }}
                        className="py-3 px-4 bg-white border border-slate-200 hover:border-emerald-500 rounded-xl text-xs font-bold text-slate-700 hover:text-emerald-600 transition tracking-wide shadow-sm text-center cursor-pointer"
                      >
                        Collected &amp; Pending Invoice
                      </button>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                    <h4 className="text-xs font-black font-display uppercase text-slate-700 tracking-wider mb-4">Registrar Ledger Analytics</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button 
                        onClick={() => {
                          const html = `
                            <div style="font-family:sans-serif;padding:5px;">
                              <h3 style="font-family:serif;color:#ff6b6b;font-size:18px;">📋 Academic Strength Audit</h3>
                              <p style="font-size:11px;color:#666;margin-bottom:15px;">Audit registry log completed: ${new Date().toLocaleDateString()}</p>
                              <div style="background:#fff;border:1px solid #ddd;border-radius:12px;padding:15px;">
                                <div style="font-size:14px;font-weight:bold;margin-bottom:10px;text-align:center;">Class-wise Enrolment Distribution</div>
                                ${ALL_CLASSES.map(cls => {
                                  const count = students.filter(s => s.class === cls).length;
                                  return `<div style="display:flex;justify-content:space-between;font-size:11px;padding:5px 0;border-bottom:1px solid #f1f1f1;"><strong>${cls}:</strong> <span>${count} Active Student${count !== 1 ? 's' : ''}</span></div>`;
                                }).join("")}
                                <div style="margin-top:14px;padding-top:10px;border-top:1.5px solid #eaeaea;display:flex;justify-content:space-between;font-weight:bold;font-size:12px;">
                                  <span>Total Enrolled Volume System-wide:</span>
                                  <span>${students.length} Students</span>
                                </div>
                              </div>
                            </div>
                          `;
                          setReportPreview({ title: "Class Population Audit", html });
                        }}
                        className="py-3 px-4 bg-white border border-slate-200 hover:border-brand-primary rounded-xl text-xs font-bold text-slate-700 hover:text-[#ff6b6b] transition tracking-wide shadow-sm text-center cursor-pointer"
                      >
                        Class-wise Student Volume
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* REPORT PREVIEW MODAL LIGHTBOX */}
      <AnimatePresence>
        {reportPreview && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden"
            >
              <h3 className="text-base font-black font-display text-slate-850 tracking-tight flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                <span>{reportPreview.title}</span>
                <button onClick={() => setReportPreview(null)} className="h-6 w-6 text-slate-400 hover:text-slate-800">
                  <X className="w-5 h-5" />
                </button>
              </h3>
              
              <div 
                className="max-h-96 overflow-y-auto border border-slate-200 rounded-2xl bg-white p-5 shadow-inner"
                dangerouslySetInnerHTML={{ __html: reportPreview.html }}
              />

              <div className="flex gap-3 justify-end mt-6">
                <button 
                  onClick={() => setReportPreview(null)}
                  className="px-5 py-2.5 bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Close Preview
                </button>
                <button 
                  onClick={() => {
                    const printWin = window.open("", "_blank");
                    if (printWin) {
                      printWin.document.write(`<html><head><title>${reportPreview.title}</title></head><body>${reportPreview.html}</body></html>`);
                      printWin.document.close();
                      printWin.print();
                    }
                  }}
                  className="px-5 py-2.5 bg-slate-900 text-white hover:bg-slate-800 text-xs font-extrabold rounded-xl shadow cursor-pointer flex items-center gap-1"
                >
                  <FileText className="w-4 h-4" /> Download PDF / Print
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CREATE / EDIT DYNAMIC DIALOG MODALS OVERLAYS */}
      <AnimatePresence>
        {modalType && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[2rem] max-w-lg w-full p-6 sm:p-8 shadow-2xl relative"
            >
              <h3 className="text-base font-black font-display text-slate-800 flex items-center justify-between border-b border-slate-50 pb-4 mb-6">
                <span>
                  {editId ? "Update File" : "Register Records"}: {modalType.toUpperCase()}
                </span>
                <button onClick={() => setModalType(null)} className="h-6 w-6 text-slate-400 hover:text-slate-800">
                  <X className="w-5 h-5" />
                </button>
              </h3>

              {/* Form 1: Student registry */}
              {modalType === "student" && (
                <form 
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!sForm.name || !sForm.dob || !sForm.parent || !sForm.phone) return;
                    try {
                      const payload = { ...sForm, updatedAt: serverTimestamp() };
                      if (editId) {
                        await updateDoc(doc(db, COLUMNS.STUDENTS, editId), payload);
                        alert("Student updated! ✅");
                      } else {
                        const createPayload = { ...payload, createdAt: serverTimestamp() };
                        await addDoc(collection(db, COLUMNS.STUDENTS), createPayload);
                        alert("Student added! 🎓");
                      }
                      setModalType(null);
                    } catch (err) {
                      console.error(err);
                      alert("Error writing records");
                    }
                  }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Student Name</label>
                      <input type="text" value={sForm.name} onChange={e => setSForm(p => ({ ...p, name: e.target.value }))} required className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl text-xs font-semibold" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Date of Birth</label>
                      <input type="date" value={sForm.dob} onChange={e => setSForm(p => ({ ...p, dob: e.target.value }))} required className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl text-xs font-semibold" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Class</label>
                      <select value={sForm.class} onChange={e => setSForm(p => ({ ...p, class: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl text-xs font-semibold">
                        {ALL_CLASSES.map(cls => <option key={cls} value={cls}>{cls}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Gender</label>
                      <select value={sForm.gender} onChange={e => setSForm(p => ({ ...p, gender: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl text-xs font-semibold">
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Roll No</label>
                      <input type="text" value={sForm.roll} onChange={e => setSForm(p => ({ ...p, roll: e.target.value }))} placeholder="e.g. 14" className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl text-xs font-semibold" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Parent Name</label>
                      <input type="text" value={sForm.parent} onChange={e => setSForm(p => ({ ...p, parent: e.target.value }))} required className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl text-xs font-semibold" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Contact Phone</label>
                      <input type="tel" value={sForm.phone} onChange={e => setSForm(p => ({ ...p, phone: e.target.value }))} required className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl text-xs font-semibold" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Address Location (Village/Mandal)</label>
                    <input type="text" value={sForm.address} onChange={e => setSForm(p => ({ ...p, address: e.target.value }))} placeholder="Town" className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl text-xs font-semibold" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Aadhaar ID</label>
                      <input type="text" value={sForm.aadhaar} onChange={e => setSForm(p => ({ ...p, aadhaar: e.target.value }))} placeholder="XXXX" className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl text-xs font-semibold" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Previous School</label>
                      <input type="text" value={sForm.prevSchool} onChange={e => setSForm(p => ({ ...p, prevSchool: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl text-xs font-semibold" />
                    </div>
                  </div>
                  <div className="flex gap-3 justify-end pt-5 border-t border-slate-50">
                    <button type="button" onClick={() => setModalType(null)} className="px-5 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-xl text-xs">Cancel</button>
                    <button type="submit" className="px-5 py-2.5 bg-gradient-to-r from-sky-400 to-[#122e54] text-white font-black rounded-xl text-xs">Commit Registry</button>
                  </div>
                </form>
              )}

              {/* Form 2: Teacher Registry */}
              {modalType === "teacher" && (
                <form 
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!tForm.name || !tForm.phone || !tForm.qualification || !tForm.subjects) return;
                    try {
                      const payload = { ...tForm, updatedAt: serverTimestamp() };
                      if (editId) {
                        await updateDoc(doc(db, COLUMNS.TEACHERS, editId), payload);
                        alert("Teacher records revised! ✅");
                      } else {
                        const createPayload = { ...payload, createdAt: serverTimestamp() };
                        await addDoc(collection(db, COLUMNS.TEACHERS), createPayload);
                        alert("Teacher added to roster! 👨‍🏫");
                      }
                      setModalType(null);
                    } catch (err) {
                      console.error(err);
                      alert("System writing failed");
                    }
                  }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Teacher Name</label>
                      <input type="text" value={tForm.name} onChange={e => setTForm(p => ({ ...p, name: e.target.value }))} required className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl text-xs font-semibold" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Contact Phone</label>
                      <input type="tel" value={tForm.phone} onChange={e => setTForm(p => ({ ...p, phone: e.target.value }))} required className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl text-xs font-semibold" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Qualification Badge</label>
                      <input type="text" value={tForm.qualification} onChange={e => setTForm(p => ({ ...p, qualification: e.target.value }))} placeholder="M.Sc, B.Ed" required className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl text-xs font-semibold" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Primary Subjects</label>
                      <input type="text" value={tForm.subjects} onChange={e => setTForm(p => ({ ...p, subjects: e.target.value }))} placeholder="Science, Telugu" required className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl text-xs font-semibold" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Joining Date</label>
                      <input type="date" value={tForm.joinDate} onChange={e => setTForm(p => ({ ...p, joinDate: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl text-xs font-semibold" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Salary Bracket</label>
                      <input type="text" value={tForm.salary} onChange={e => setTForm(p => ({ ...p, salary: e.target.value }))} placeholder="e.g. 24000" className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl text-xs font-semibold" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Classes Assigned To Mentor</label>
                    <div className="grid grid-cols-4 gap-2 pt-1">
                      {ALL_CLASSES.map(cls => {
                        const checked = tForm.classes.includes(cls);
                        return (
                          <label key={cls} className={`flex items-center gap-1 p-2 rounded-lg border text-[10px] font-bold cursor-pointer transition select-none ${checked ? "bg-amber-100/50 border-amber-400 text-slate-900" : "bg-slate-50 border-slate-200 text-slate-500"}`}>
                            <input 
                              type="checkbox"
                              checked={checked}
                              onChange={(e) => {
                                const next = e.target.checked 
                                  ? [...tForm.classes, cls]
                                  : tForm.classes.filter(x => x !== cls);
                                setTForm(p => ({ ...p, classes: next }));
                              }}
                              className="sr-only"
                            />
                            {cls}
                          </label>
                        );
                      })}
                    </div>
                  </div>
                  <div className="flex gap-3 justify-end pt-5 border-t border-slate-50">
                    <button type="button" onClick={() => setModalType(null)} className="px-5 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-xl text-xs">Cancel</button>
                    <button type="submit" className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-[#122e54] text-white font-black rounded-xl text-xs">Commit Teacher</button>
                  </div>
                </form>
              )}

              {/* Form 3: Admissions open application file ledger */}
              {modalType === "admission" && (
                <form 
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!admForm.name || !admForm.dob || !admForm.parent || !admForm.phone) return;
                    try {
                      const payload = { ...admForm, updatedAt: serverTimestamp() };
                      if (editId) {
                        await updateDoc(doc(db, COLUMNS.ADMISSIONS, editId), payload);
                        alert("Admission record modified! ✅");
                      } else {
                        const createPayload = { ...payload, createdAt: serverTimestamp() };
                        await addDoc(collection(db, COLUMNS.ADMISSIONS), createPayload);
                        alert("Admission applicant recorded! 📋");
                      }
                      setModalType(null);
                    } catch (err) {
                      console.error(err);
                      alert("Error writing admission records");
                    }
                  }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Applicant Name</label>
                      <input type="text" value={admForm.name} onChange={e => setAdmForm(p => ({ ...p, name: e.target.value }))} required className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl text-xs font-semibold" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Date of Birth</label>
                      <input type="date" value={admForm.dob} onChange={e => setAdmForm(p => ({ ...p, dob: e.target.value }))} required className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl text-xs font-semibold" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Applying Class</label>
                      <select value={admForm.class} onChange={e => setAdmForm(p => ({ ...p, class: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl text-xs font-semibold">
                        {ALL_CLASSES.map(cls => <option key={cls} value={cls}>{cls}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Gender</label>
                      <select value={admForm.gender} onChange={e => setAdmForm(p => ({ ...p, gender: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl text-xs font-semibold">
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Parent / Guardian Name</label>
                      <input type="text" value={admForm.parent} onChange={e => setAdmForm(p => ({ ...p, parent: e.target.value }))} required className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl text-xs font-semibold" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Contact Phone No</label>
                      <input type="tel" value={admForm.phone} onChange={e => setAdmForm(p => ({ ...p, phone: e.target.value }))} required className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl text-xs font-semibold" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Application Date</label>
                      <input type="date" value={admForm.date} onChange={e => setAdmForm(p => ({ ...p, date: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl text-xs font-semibold" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Status Choice</label>
                      <select value={admForm.status} onChange={e => setAdmForm(p => ({ ...p, status: e.target.value as any }))} className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl text-xs font-semibold">
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-3 justify-end pt-5 border-t border-slate-50">
                    <button type="button" onClick={() => setModalType(null)} className="px-5 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-xl text-xs">Cancel</button>
                    <button type="submit" className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-[#122e54] text-slate-900 font-black rounded-xl text-xs">Submit Application</button>
                  </div>
                </form>
              )}

              {/* Form 4: Fee record billing creation */}
              {modalType === "fee" && (
                <form 
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!feeForm.studentId || !feeForm.amount) return;
                    try {
                      const student = students.find(s => s.id === feeForm.studentId);
                      const payload = {
                        ...feeForm,
                        studentName: student?.name || "",
                        class: student?.class || "",
                        amount: Number(feeForm.amount),
                        updatedAt: serverTimestamp()
                      };
                      if (editId) {
                        await updateDoc(doc(db, COLUMNS.FEES, editId), payload);
                        alert("Fees updated! ✅");
                      } else {
                        const createPayload = { ...payload, createdAt: serverTimestamp() };
                        await addDoc(collection(db, COLUMNS.FEES), createPayload);
                        alert("Fee billing generated! 💰");
                      }
                      setModalType(null);
                    } catch (err) {
                      console.error(err);
                    }
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Select Student</label>
                    <select
                      value={feeForm.studentId}
                      onChange={e => setFeeForm(p => ({ ...p, studentId: e.target.value }))}
                      required
                      className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl text-xs font-semibold"
                    >
                      <option value="">Choose Active Student...</option>
                      {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.class})</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Billing Amount (INR)</label>
                      <input type="number" min="1" value={feeForm.amount} onChange={e => setFeeForm(p => ({ ...p, amount: e.target.value }))} placeholder="e.g. 5000" required className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl text-xs font-semibold" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Billing Date</label>
                      <input type="date" value={feeForm.date} onChange={e => setFeeForm(p => ({ ...p, date: e.target.value }))} required className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl text-xs font-semibold" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Fee Type</label>
                      <select value={feeForm.feeType} onChange={e => setFeeForm(p => ({ ...p, feeType: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl text-xs font-semibold">
                        <option value="Tuition">Tuition</option>
                        <option value="Transport">Transport</option>
                        <option value="Uniform">Uniform</option>
                        <option value="Books">Books</option>
                        <option value="Exam">Exam</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Target Billing Month</label>
                      <select value={feeForm.month} onChange={e => setFeeForm(p => ({ ...p, month: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl text-xs font-semibold">
                        {["June","July","August","September","October","November","December","January","February","March","April","May"].map(m => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Status</label>
                      <select value={feeForm.status} onChange={e => setFeeForm(p => ({ ...p, status: e.target.value as any }))} className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl text-xs font-semibold">
                        <option value="Paid">Paid</option>
                        <option value="Pending">Pending</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Internal Ledger Notes</label>
                    <input type="text" value={feeForm.notes} onChange={e => setFeeForm(p => ({ ...p, notes: e.target.value }))} placeholder="Optional memo..." className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl text-xs font-semibold" />
                  </div>
                  <div className="flex gap-3 justify-end pt-5 border-t border-slate-50">
                    <button type="button" onClick={() => setModalType(null)} className="px-5 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-xl text-xs">Cancel</button>
                    <button type="submit" className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-[#122e54] text-white font-black rounded-xl text-xs">Generate Billing record</button>
                  </div>
                </form>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
