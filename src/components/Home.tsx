import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  GraduationCap, Phone, MapPin, Mail, Clock, ShieldCheck, 
  BookOpen, Trophy, Globe, Users, Computer, Award, ChevronRight, 
  Menu, X, Sparkles, Star, Quote, ArrowUpRight, ArrowDown 
} from "lucide-react";

interface HomeProps {
  onNavigate: (view: "home" | "login" | "dashboard") => void;
}

const CAROUSEL_IMAGES = [
  { url: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1600&q=80", alt: "School Building" },
  { url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1600&q=80", alt: "Students in Classroom" },
  { url: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1600&q=80", alt: "Students Playing Sports" },
  { url: "https://images.unsplash.com/photo-1567168544813-cc03465b4fa8?w=1600&q=80", alt: "Science Laboratory" },
  { url: "https://images.unsplash.com/photo-1562774053-701939374585?w=1600&q=80", alt: "School Campus" },
  { url: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1600&q=80", alt: "Students Reading" },
  { url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1600&q=80", alt: "Students Group Activity" },
  { url: "https://images.unsplash.com/photo-1575783970733-1aaedde1db74?w=1600&q=80", alt: "School Playground" }
];

const WHY_CHOOSE_US = [
  {
    num: "01",
    icon: <Trophy className="w-8 h-8 text-amber-500" />,
    title: "Academic Excellence",
    desc: "Consistent 98%+ pass rates in 10th Board exams. Our structured curriculum and dedicated faculty ensure every student achieves their potential."
  },
  {
    num: "02",
    icon: <Globe className="w-8 h-8 text-sky-500" />,
    title: "English Medium Education",
    desc: "Full English medium instruction from Nursery onwards. Students develop strong communication skills essential for higher education and professional life."
  },
  {
    num: "03",
    icon: <Users className="w-8 h-8 text-rose-500" />,
    title: "Qualified Faculty",
    desc: "35+ experienced teachers, each a specialist in their subject. Personal attention and individual mentoring for every student throughout their journey."
  },
  {
    num: "04",
    icon: <Computer className="w-8 h-8 text-indigo-500" />,
    title: "Smart Classrooms",
    desc: "Technology-integrated learning with digital boards, projectors, and computer labs. Modern education for a modern world."
  },
  {
    num: "05",
    icon: <Award className="w-8 h-8 text-emerald-500" />,
    title: "Sports & Co-Curriculars",
    desc: "Cricket, kabaddi, athletics, cultural programs, debates, and science fairs. We believe in balanced development of mind and body."
  },
  {
    num: "06",
    icon: <ShieldCheck className="w-8 h-8 text-teal-500" />,
    title: "Safe Environment",
    desc: "CCTV-monitored campus, strict discipline, and a caring environment where every child feels safe, valued, and encouraged to grow."
  }
];

const FACILITIES = [
  {
    icon: "📚",
    title: "Central Library",
    desc: "Over 5,000 books spanning academics, literature, and general knowledge. Open to all students daily for self-study and research.",
    bg: "from-blue-900 to-indigo-950 text-blue-100"
  },
  {
    icon: "🔬",
    title: "Science Laboratory",
    desc: "Fully equipped Physics, Chemistry & Biology labs for hands-on experiments from Class 6 onwards.",
    bg: "from-indigo-900 to-indigo-950 text-indigo-100"
  },
  {
    icon: "💻",
    title: "Computer Lab",
    desc: "40-station computer lab with high-speed internet, enabling digital literacy from an early age.",
    bg: "from-teal-900 to-emerald-950 text-teal-100"
  },
  {
    icon: "🏅",
    title: "Sports Ground",
    desc: "Large playground with facilities for cricket, kabaddi, athletics, and indoor games.",
    bg: "from-amber-900 to-orange-950 text-amber-100"
  },
  {
    icon: "🎭",
    title: "Activity Hall",
    desc: "Multi-purpose hall for cultural programs, annual day celebrations, debates, and assemblies.",
    bg: "from-rose-900 to-purple-950 text-rose-100"
  }
];

const SUBJECTS_DATA = {
  primary: [
    { name: "English Language", desc: "Phonics, reading, writing, comprehension & spoken English from Nursery level", icon: "📖" },
    { name: "Mathematics", desc: "Numbers, arithmetic, shapes, patterns and foundational concepts with activity-based learning", icon: "🔢" },
    { name: "Environmental Studies", desc: "Nature, community, health, and basic science integrated in an engaging format", icon: "🌿" },
    { name: "Art & Craft", desc: "Creative expression through drawing, painting, clay modeling and paper crafts", icon: "🎨" },
    { name: "Music & Dance", desc: "Classical and folk arts enriching students' cultural sensibility and confidence", icon: "🎵" },
    { name: "Moral & Value Education", desc: "Character building, good manners, and ethical values from the very beginning", icon: "🧘" }
  ],
  middle: [
    { name: "English", desc: "Grammar, composition, prose, poetry and literature — advanced level", icon: "📘" },
    { name: "Mathematics", desc: "Algebra, geometry, mensuration, statistics and problem solving", icon: "➗" },
    { name: "Science", desc: "Physics, Chemistry, Biology — lab experiments and concept building", icon: "🔬" },
    { name: "Social Studies", desc: "Geography, History, Civics and economics — Indian and global contexts", icon: "🌍" },
    { name: "Telugu / Hindi", desc: "Second language development — reading, writing, grammar and literature", icon: "🗣️" },
    { name: "Computer Science", desc: "Basic programming, MS Office, internet literacy and digital safety", icon: "💻" }
  ],
  secondary: [
    { name: "English (Paper 1 & 2)", desc: "Board-level grammar, essay, letter writing and literature analysis", icon: "📗" },
    { name: "Mathematics", desc: "Complete 10th class board syllabus with intensive problem practice and mock exams", icon: "📐" },
    { name: "Physical Science", desc: "Physics & Chemistry with lab work, board paper practice and concept mastery", icon: "⚗️" },
    { name: "Biological Science", desc: "Botany and Zoology with diagrams, experiments, and board exam preparation", icon: "🧬" },
    { name: "Social Studies", desc: "History, Geography, Economics and Civics — comprehensive board syllabus coverage", icon: "🗺️" },
    { name: "Telugu / Sanskrit", desc: "Second language paper — poetry, prose, grammar and board exam strategies", icon: "🌸" }
  ]
};

const TESTIMONIALS = [
  {
    text: "My daughter joined Sri Chaithanya in Class 1 and now she's in Class 6 — the growth in her confidence and academic performance has been remarkable. The teachers genuinely care about each child.",
    author: "Ramaiah Goud",
    role: "Parent of Class 6 Student",
    avatar: "R"
  },
  {
    text: "The English medium foundation my son got here helped him clear his 10th boards with distinction. The teachers prepare students brilliantly for board exams. Highly recommend!",
    author: "Sudha Devi",
    role: "Parent of Class 10 Alumni",
    avatar: "S"
  },
  {
    text: "We enrolled our twins in Nursery class here. The way the school nurtures toddlers with play-based learning is amazing. Both children love coming to school every day!",
    author: "Venkat Reddy",
    role: "Parent of Nursery Students",
    avatar: "V"
  }
];

export default function Home({ onNavigate }: HomeProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTab, setActiveTab] = useState<"primary" | "middle" | "secondary">("primary");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Auto scroll logic for hero slideshow
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % CAROUSEL_IMAGES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Track scroll state
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f5]">
      {/* Dynamic Background Floating Elements for Playfulness */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-40">
        <div className="absolute w-72 h-72 rounded-full bg-amber-200/40 -top-16 -left-16 blur-2xl animate-float" style={{ animationDelay: "0s" }} />
        <div className="absolute w-96 h-96 rounded-full bg-blue-200/30 bottom-32 -right-16 blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute w-80 h-80 rounded-full bg-rose-200/30 top-1/2 left-10 blur-3xl animate-float" style={{ animationDelay: "4s" }} />
      </div>

      {/* Header / Navbar */}
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/90 backdrop-blur-md shadow-md py-3" : "bg-transparent py-5"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-brand-primary to-amber-400 flex items-center justify-center text-white shadow-lg shadow-red-100 hover:rotate-12 transition-transform duration-300">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div>
              <span className="block text-lg font-bold font-display leading-tight tracking-tight text-slate-800">
                SC Sri Chaithanya
              </span>
              <span className="block text-[11px] font-medium tracking-widest text-[#c08028] uppercase">
                English Medium School
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollToSection("about")} className="text-sm font-semibold text-slate-600 hover:text-brand-primary transition-colors">About</button>
            <button onClick={() => scrollToSection("why")} className="text-sm font-semibold text-slate-600 hover:text-brand-primary transition-colors">Why us</button>
            <button onClick={() => scrollToSection("facilities")} className="text-sm font-semibold text-slate-600 hover:text-brand-primary transition-colors">Facilities</button>
            <button onClick={() => scrollToSection("academics")} className="text-sm font-semibold text-slate-600 hover:text-brand-primary transition-colors">Academics</button>
            <button onClick={() => scrollToSection("admission")} className="text-sm font-semibold text-slate-600 hover:text-brand-primary transition-colors">Admissions</button>
            <button onClick={() => scrollToSection("contact")} className="text-sm font-semibold text-slate-600 hover:text-brand-primary transition-colors">Contact</button>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <button 
              onClick={() => onNavigate("login")} 
              className="px-4 py-2 text-sm font-bold text-slate-700 hover:text-brand-primary transition-colors border border-slate-200 hover:border-brand-primary bg-white/70 rounded-full cursor-pointer"
            >
              Principal Portal
            </button>
            <button 
              onClick={() => scrollToSection("admission")} 
              className="px-6 py-2.5 text-sm font-extrabold text-white bg-brand-primary hover:bg-[#fa5252] rounded-full shadow-lg shadow-red-100 group flex items-center gap-1 cursor-pointer transition-transform duration-100 hover:scale-105"
            >
              ⭐ Enroll Now
            </button>
          </div>

          {/* Mobile hamburger button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden h-10 w-10 flex items-center justify-center rounded-xl bg-slate-100 text-slate-700"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu panel */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-lg border-b border-slate-100 shadow-xl py-6 px-4 flex flex-col gap-4 z-40"
            >
              <button onClick={() => scrollToSection("about")} className="text-left py-2 text-base font-semibold text-slate-700">About</button>
              <button onClick={() => scrollToSection("why")} className="text-left py-2 text-base font-semibold text-slate-700">Why us</button>
              <button onClick={() => scrollToSection("facilities")} className="text-left py-2 text-base font-semibold text-slate-700">Facilities</button>
              <button onClick={() => scrollToSection("academics")} className="text-left py-2 text-base font-semibold text-slate-700">Academics</button>
              <button onClick={() => scrollToSection("admission")} className="text-left py-2 text-base font-semibold text-slate-700">Admissions</button>
              <button onClick={() => scrollToSection("contact")} className="text-left py-2 text-base font-semibold text-slate-700">Contact</button>
              <hr className="border-slate-100 my-1" />
              <div className="grid grid-cols-2 gap-4 pt-2">
                <button 
                  onClick={() => { setMobileMenuOpen(false); onNavigate("login"); }}
                  className="py-3 text-center text-sm font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  Principal Portal
                </button>
                <button 
                  onClick={() => scrollToSection("admission")} 
                  className="py-3 text-center text-sm font-bold text-white bg-brand-primary rounded-xl"
                >
                  Enroll Now
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-24 pb-16 lg:pt-28 md:pb-24 overflow-hidden" id="hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Main heading column */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 flex flex-col text-center lg:text-left z-10"
          >
            <div className="inline-flex items-center gap-2 bg-rose-50 border border-rose-100 text-[#ff6b6b] px-4 py-1.5 rounded-full text-xs font-bold self-center lg:self-start mb-5 shadow-sm animate-float">
              <Sparkles className="w-3.5 h-3.5 fill-[#ff6b6b]" />
              <span>Admissions Open for Year 2025–26</span>
            </div>
            
            <h1 className="text-4xl sm:text-5.5xl font-black font-display text-slate-800 leading-[1.1] tracking-tight mb-6">
              Sri Chaithanya <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-amber-500">
                English Medium
              </span> School
            </h1>
            
            <p className="text-lg font-semibold text-[#c08028] font-display mb-3">
              Where Excellence Meets Education
            </p>
            
            <p className="text-slate-600 font-medium leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0">
              Shaping young minds with excellence, values, and vision. From Nursery to 10th Class — your child's complete educational journey, right here in Garladinne.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button 
                onClick={() => scrollToSection("admission")} 
                className="w-full sm:w-auto px-8 py-4 bg-brand-primary hover:bg-[#fa5252] text-white font-extrabold rounded-2xl shadow-xl shadow-red-200 flex items-center justify-center gap-2 group transition-transform duration-100 hover:scale-[1.03] cursor-pointer"
              >
                Apply for Admission 
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <a 
                href="tel:+919876543210" 
                className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <Phone className="w-4.5 h-4.5 text-[#ff6b6b]" />
                Call Us Now
              </a>
            </div>

            <div className="mt-8 flex items-center justify-center lg:justify-start gap-5 text-sm text-slate-500 font-bold font-display">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-brand-green animate-ping" />
                <span>Nursery to 10th Grade</span>
              </div>
              <span className="text-slate-300">•</span>
              <div className="flex items-center gap-1.5">
                <span>📍 Garladinne, Anantapur</span>
              </div>
            </div>
          </motion.div>

          {/* Sliding Photos Carousel column */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 relative"
          >
            {/* Visual Frame */}
            <div className="relative aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-2xl border-[10px] border-white z-10 bg-slate-100">
              <AnimatePresence mode="wait">
                <motion.img 
                  key={currentSlide}
                  src={CAROUSEL_IMAGES[currentSlide].url}
                  alt={CAROUSEL_IMAGES[currentSlide].alt}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>

              {/* Decorative Banner overlaid */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 pt-16 text-white flex items-center justify-between">
                <div>
                  <span className="text-xs uppercase tracking-widest text-[#ffd43b] font-extrabold block mb-1">Interactive Facility</span>
                  <p className="text-base font-bold font-display">{CAROUSEL_IMAGES[currentSlide].alt}</p>
                </div>
                <div className="flex gap-1">
                  {CAROUSEL_IMAGES.map((_, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => setCurrentSlide(idx)}
                      className={`h-2.5 rounded-full transition-all duration-300 ${currentSlide === idx ? "w-6 bg-brand-accent" : "w-2 bg-white/40"}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Bubble decoration behind slide */}
            <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-brand-accent opacity-80 border-4 border-white shadow-xl flex items-center justify-center font-display text-4xl animate-bounce z-20" style={{ animationDuration: "3s" }}>
              🎈
            </div>
            <div className="absolute -top-6 right-6 w-16 h-16 rounded-full bg-[#4dadf7] opacity-90 border-4 border-white shadow-xl flex items-center justify-center font-display text-2xl animate-float z-20">
              🎒
            </div>
          </motion.div>

        </div>

        {/* Waves bottom separator */}
        <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-b from-transparent to-[#faf9f5] pointer-events-none" />
      </div>

      {/* Introduction Card & Animated Stats */}
      <section className="py-16 relative bg-[#f7f5ed]" id="about">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Main narrative card */}
            <div className="lg:col-span-7 bg-white p-8 sm:p-12 rounded-[2.5rem] shadow-xl shadow-slate-100 border border-slate-100">
              <span className="text-xs font-black tracking-widest text-brand-primary uppercase block mb-3 font-display">Welcome to Sri Chaithanya</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-display leading-tight text-slate-800 mb-6">
                Inspiring Minds. Shaping Futures. <span className="text-[#4dadf7]">Building Leaders</span>.
              </h2>
              <p className="text-slate-600 leading-relaxed font-medium mb-5">
                Sri Chaithanya English Medium School, Garladinne is a premier institution committed to holistic education from Nursery through 10th Class. Located in the heart of Garladinne, Anantapur District, we blend academic rigor with character development to prepare students for a bright future.
              </p>
              <p className="text-slate-600 leading-relaxed font-medium">
                Our school follows an English medium curriculum, ensuring students are equipped with strong language skills, scientific temper, and a love for lifelong learning.
              </p>
            </div>

            {/* Live Count statistics cards */}
            <div className="lg:col-span-5 space-y-6">
              {/* Stat card 1 */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="bg-white p-6 rounded-3xl shadow-lg border border-slate-50 flex items-center gap-5 relative overflow-hidden"
              >
                <div className="h-16 w-16 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 font-display text-3xl font-extrabold shadow-sm">
                  35+
                </div>
                <div>
                  <h4 className="text-base font-extrabold text-slate-800 font-display mb-1">Experienced &amp; Dedicated Faculty</h4>
                  <p className="text-xs text-slate-500 font-medium">35+ qualified teachers with deep subject expertise across all grade levels.</p>
                </div>
              </motion.div>

              {/* Stat card 2 */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="bg-white p-6 rounded-3xl shadow-lg border border-slate-50 flex items-center gap-5 relative overflow-hidden"
              >
                <div className="h-16 w-16 rounded-2xl bg-blue-50 flex items-center justify-center text-[#4dadf7] font-display text-3xl font-extrabold shadow-sm">
                  100%
                </div>
                <div>
                  <h4 className="text-base font-extrabold text-slate-800 font-display mb-1">English Medium Curriculum</h4>
                  <p className="text-xs text-slate-500 font-medium">Complete English medium instruction preparing students for board exams.</p>
                </div>
              </motion.div>

              {/* Stat card 3 */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="bg-white p-6 rounded-3xl shadow-lg border border-slate-50 flex items-center gap-5 relative overflow-hidden"
              >
                <div className="h-16 w-16 rounded-2xl bg-[#fff0f6] flex items-center justify-center text-brand-primary font-display text-2xl font-extrabold shadow-sm">
                  Modern
                </div>
                <div>
                  <h4 className="text-base font-extrabold text-slate-800 font-display mb-1">Modern Infrastructure</h4>
                  <p className="text-xs text-slate-500 font-medium">Smart classrooms, computer lab, library and large sports playground.</p>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* Nursery to 10th journey roadmap */}
      <section className="py-20 relative bg-[#faf9f5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-black tracking-widest text-[#c08028] uppercase font-display block mb-3">Academic Roadmap</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display leading-tight text-slate-800">
              Nursery to 10th — <span className="text-brand-primary">Complete Journey</span>
            </h2>
            <p className="text-slate-500 font-medium mt-3">
              Every stage of your child's academic journey, expertly guided from the very beginning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Early Years */}
            <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-100 border border-slate-100 group hover:-translate-y-2 transition-transform duration-300">
              <div className="text-4xl mb-5 group-hover:scale-110 transition-transform block">🧸</div>
              <h3 className="text-lg font-extrabold font-display text-slate-800 mb-2">Primary (Nursery–5th)</h3>
              <p className="text-sm font-semibold text-[#ffd43b] font-display mb-3">Foundational Years</p>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">Focusing on basic alphabet development, math numbers, phonics, playing-based educational games and creative crafts.</p>
            </div>

            {/* Middle School */}
            <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-100 border border-slate-100 group hover:-translate-y-2 transition-transform duration-300">
              <div className="text-4xl mb-5 group-hover:scale-110 transition-transform block">🔬</div>
              <h3 className="text-lg font-extrabold font-display text-slate-800 mb-2">Middle School (6th–8th)</h3>
              <p className="text-sm font-semibold text-sky-400 font-display mb-3">Concept Building Years</p>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">Shifting into active sciences, computer literacy, algebra definitions, second language literature, and social studies environments.</p>
            </div>

            {/* High School */}
            <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-100 border border-slate-100 group hover:-translate-y-2 transition-transform duration-300">
              <div className="text-4xl mb-5 group-hover:scale-110 transition-transform block">📐</div>
              <h3 className="text-lg font-extrabold font-display text-slate-800 mb-2">Secondary (9th–10th)</h3>
              <p className="text-sm font-semibold text-rose-400 font-display mb-3">Board Prep Years</p>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">Advanced laboratory experiments, rigorous geometry practices, mock tests, state boards exam preparation, and career coaching guidance.</p>
            </div>

            {/* Future leader */}
            <div className="bg-gradient-to-tr from-[#0a1128] to-[#1e3a8a] p-8 rounded-[2rem] shadow-xl text-white flex flex-col justify-between group hover:-translate-y-2 transition-transform duration-300">
              <div>
                <div className="text-4xl mb-5 group-hover:scale-110 transition-transform block">🚀</div>
                <h3 className="text-lg font-extrabold font-display mb-1 text-white">Shaping Leaders</h3>
                <p className="text-xs text-amber-300 font-extrabold font-display uppercase tracking-wider mb-4">The ultimate goal</p>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">Unlocking outstanding confidence, self-learning methodologies, active communication tools, and board exam awards.</p>
              </div>
              <button onClick={() => scrollToSection("admission")} className="text-xs text-amber-300 font-bold flex items-center gap-1 mt-6 hover:underline uppercase tracking-widest cursor-pointer">
                Join our family <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Sri Chaithanya? */}
      <section className="py-20 relative bg-[#f7f5ed]" id="why">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-black tracking-widest text-brand-primary uppercase font-display block mb-3">Why Choose Us</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display leading-tight text-slate-800">
              The Sri Chaithanya <span className="text-[#4dadf7]">Difference</span>
            </h2>
            <p className="text-slate-500 font-medium mt-3">
              We are more than just a school — we are a community committed to the holistic growth of every child.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {WHY_CHOOSE_US.map((item, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -6 }}
                className="bg-white p-8 rounded-3xl shadow-md border border-slate-50 relative overflow-hidden"
              >
                <span className="absolute top-4 right-6 text-5xl font-black text-slate-50 select-none font-display">
                  {item.num}
                </span>
                <div className="h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 relative z-10 border border-slate-100">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold font-display text-slate-800 mb-3 relative z-10">{item.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium relative z-10">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities Grid */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden" id="facilities">
        {/* Abstract background graphics */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-black tracking-widest text-amber-400 uppercase font-display block mb-3">Our Infrastructure</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display leading-tight text-white animate-pulse">
              World-Class <span className="text-amber-400">Facilities</span>
            </h2>
            <p className="text-slate-400 font-medium mt-3">
              State-of-the-art infrastructure designed to support every aspect of a student's educational journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FACILITIES.map((fac, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ scale: 1.02 }}
                className="group relative h-80 rounded-3xl overflow-hidden card border border-slate-800 bg-slate-950 flex flex-col justify-end p-8"
              >
                {/* Background decorative gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${fac.bg} opacity-20 group-hover:opacity-30 transition-opacity duration-300`} />
                <div className="absolute top-6 right-6 text-7xl font-sans select-none opacity-10 group-hover:opacity-15 transition-opacity">
                  {fac.icon}
                </div>
                
                <span className="text-3xl mb-4 group-hover:rotate-12 transition-transform duration-300 inline-block">
                  {fac.icon}
                </span>
                
                <h3 className="text-xl font-bold font-display text-white mb-2 relative z-10">{fac.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed font-medium relative z-10">{fac.desc}</p>
              </motion.div>
            ))}

            {/* Standard CTA placeholder in facilities block */}
            <div className="rounded-3xl border border-dashed border-slate-700 flex flex-col justify-center items-center text-center p-8 gap-4 bg-slate-950/40">
              <span className="h-14 w-14 rounded-full bg-slate-800 flex items-center justify-center text-2xl">🏫</span>
              <div>
                <h4 className="text-base font-bold font-display text-white mb-1">Want a Campus Tour?</h4>
                <p className="text-xs text-slate-400">Parents are welcome to visit and inspect our building facilities firsthand.</p>
              </div>
              <button 
                onClick={() => scrollToSection("contact")} 
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl cursor-pointer"
              >
                Schedule Visit
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Academic Programs (Tabbed) */}
      <section className="py-20 relative bg-[#faf9f5]" id="academics">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-black tracking-widest text-[#4dadf7] uppercase font-display block mb-3 font-display">Classes Curriculum</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display leading-tight text-slate-800">
              Academic <span className="text-[#4dadf7]">Programs</span>
            </h2>
            <p className="text-slate-500 font-medium mt-3 font-display">
              Structured learning pathways tailored for each stage — from early childhood to secondary board preparation.
            </p>
          </div>

          {/* Interactive Navigation Tabs */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex bg-slate-100 p-2 rounded-2xl md:rounded-full border border-slate-200 flex-col md:flex-row gap-2 w-full max-w-lg md:max-w-none">
              <button 
                onClick={() => setActiveTab("primary")}
                className={`px-6 py-3 text-xs md:text-sm font-bold rounded-xl md:rounded-full transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${activeTab === "primary" ? "bg-brand-primary text-white shadow-md shadow-red-200" : "text-slate-600 hover:bg-slate-200/50"}`}
              >
                🧸 Primary (Nursery–5th)
              </button>
              <button 
                onClick={() => setActiveTab("middle")}
                className={`px-6 py-3 text-xs md:text-sm font-bold rounded-xl md:rounded-full transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${activeTab === "middle" ? "bg-brand-primary text-white shadow-md shadow-red-200" : "text-slate-600 hover:bg-slate-200/50"}`}
              >
                📘 Middle School (6th–8th)
              </button>
              <button 
                onClick={() => setActiveTab("secondary")}
                className={`px-6 py-3 text-xs md:text-sm font-bold rounded-xl md:rounded-full transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${activeTab === "secondary" ? "bg-brand-primary text-white shadow-md shadow-red-200" : "text-slate-600 hover:bg-slate-200/50"}`}
              >
                🔬 Secondary (9th–10th)
              </button>
            </div>
          </div>

          {/* Animated Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {SUBJECTS_DATA[activeTab].map((subject, idx) => (
                <div 
                  key={idx} 
                  className="bg-white p-6 rounded-3xl border border-slate-150/80 shadow-md shadow-slate-100 flex items-start gap-4 hover:shadow-lg transition-all duration-300"
                >
                  <span className="text-3xl p-3 bg-slate-50 border border-slate-100 rounded-2xl block select-none">
                    {subject.icon}
                  </span>
                  <div>
                    <h3 className="text-base font-bold font-display text-slate-800 mb-1">{subject.name}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">{subject.desc}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>

          <div className="mt-12 text-center bg-amber-50 rounded-3xl border border-amber-100/60 p-6 max-w-xl mx-auto">
            <p className="text-xs text-[#c08028] font-bold font-display flex items-center justify-center gap-1.5 leading-relaxed">
              ⭐ State Board Preparation includes intensive mock examinations, laboratory projects, and syllabus coaching from Class 9.
            </p>
          </div>
        </div>
      </section>

      {/* Admission steps */}
      <section className="py-20 relative bg-[#f7f5ed]" id="admission">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Timeline process steps column */}
            <div className="lg:col-span-7 space-y-10">
              <div>
                <span className="text-xs font-black tracking-widest text-brand-primary uppercase font-display block mb-3">Enrolling Your Child</span>
                <h2 className="text-3xl sm:text-4xl font-extrabold font-display leading-tight text-slate-800">
                  Join the Sri Chaithanya <br/><span className="text-[#ff6b6b]">Family</span>
                </h2>
                <p className="text-slate-500 font-medium mt-3 leading-relaxed">
                  We welcome students of all backgrounds. Our admission process is simple, transparent, and guided by a student-first philosophy.
                </p>
              </div>

              {/* Steps */}
              <div className="relative border-l-2 border-dashed border-slate-200 pl-6 space-y-8">
                
                {/* Step 1 */}
                <div className="relative">
                  <div className="absolute -left-[35px] top-0 h-6 w-6 rounded-full bg-amber-400 border-4 border-white shadow-md flex items-center justify-center font-display text-[10px] text-slate-800 font-bold">1</div>
                  <h4 className="text-base font-bold font-display text-slate-800 mb-1">Contact the School</h4>
                  <p className="text-xs text-slate-500 font-medium">Call us or visit the school between 9 AM – 5 PM (Mon–Sat) to express interest and learn about available seats for your child's class.</p>
                </div>

                {/* Step 2 */}
                <div className="relative">
                  <div className="absolute -left-[35px] top-0 h-6 w-6 rounded-full bg-[#4dadf7] border-4 border-white shadow-md flex items-center justify-center font-display text-[10px] text-slate-800 font-bold">2</div>
                  <h4 className="text-base font-bold font-display text-slate-800 mb-1">School Visit &amp; Interaction</h4>
                  <p className="text-xs text-slate-500 font-medium">Tour our campus, meet the teachers, and let your child interact with our faculty. This helps both families and school assess mutual suitability.</p>
                </div>

                {/* Step 3 */}
                <div className="relative">
                  <div className="absolute -left-[35px] top-0 h-6 w-6 rounded-full bg-brand-primary border-4 border-white shadow-md flex items-center justify-center font-display text-[10px] text-slate-800 font-bold">3</div>
                  <h4 className="text-base font-bold font-display text-slate-800 mb-1">Submit Documents</h4>
                  <p className="text-xs text-slate-500 font-medium">Provide Birth Certificate, previous year's Marks Card/TC, Aadhar card, and 4 passport photos for admission registration.</p>
                </div>

                {/* Step 4 */}
                <div className="relative">
                  <div className="absolute -left-[35px] top-0 h-6 w-6 rounded-full bg-brand-green border-4 border-white shadow-md flex items-center justify-center font-display text-[10px] text-slate-800 font-bold">4</div>
                  <h4 className="text-base font-bold font-display text-slate-800 mb-1">Fee Payment &amp; Enrollment</h4>
                  <p className="text-xs text-slate-500 font-medium">Complete fee payment and receive your Welcome Kit. Your child is officially a Sri Chaithanya student — the journey begins!</p>
                </div>

              </div>
            </div>

            {/* Playful Admission CTA card */}
            <div className="lg:col-span-5">
              <div className="bg-gradient-to-tr from-[#ff6b6b] to-[#fc9c9c] p-8 sm:p-10 rounded-[2.5rem] shadow-xl text-center text-white relative overflow-hidden group">
                {/* Decorative floating cap behind */}
                <div className="absolute -top-10 -right-10 text-9xl font-sans select-none opacity-10 rotate-12">🎓</div>
                
                <span className="text-5xl mb-4 block animate-bounce" style={{ animationDuration: "2.5s" }}>🎓</span>
                <h3 className="text-2xl font-black font-display text-white mb-2">Admissions Open!</h3>
                <p className="text-xs text-rose-50 leading-relaxed font-semibold mb-8">
                  Secure your child's seat for the 2025–26 academic year at Sri Chaithanya English Medium School. Limited seats available — act now!
                </p>

                <div className="space-y-3 relative z-10">
                  <a 
                    href="tel:+919876543210" 
                    className="w-full py-4 bg-[#ffd43b] hover:bg-[#ffde59] text-slate-800 font-extrabold rounded-2xl shadow-xl flex items-center justify-center gap-2 uppercase tracking-wide text-xs cursor-pointer"
                  >
                    <Phone className="w-4 h-4 text-slate-800" />
                    Call Us Now
                  </a>
                  <button 
                    onClick={() => scrollToSection("contact")} 
                    className="w-full py-3 border border-white/50 hover:bg-white/10 text-white font-bold rounded-2xl flex items-center justify-center gap-2 text-xs uppercase tracking-wide cursor-pointer"
                  >
                    📍 Visit Campus
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 relative bg-[#faf9f5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-black tracking-widest text-[#ffd43b] uppercase font-display block mb-3">Parent Testimonials</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display leading-tight text-slate-800">
              What Our <span className="text-[#ffd43b]">Families Say</span>
            </h2>
            <p className="text-slate-500 font-medium mt-3 font-display">
              Hear from the parents who entrusted us with their children's future.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {TESTIMONIALS.map((testi, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -5 }}
                className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-100 border border-slate-100 flex flex-col justify-between"
              >
                <div>
                  <Quote className="w-8 h-8 text-slate-200 mb-4 fill-slate-50" />
                  <p className="text-sm font-semibold text-slate-600 leading-relaxed font-display italic mb-6">"{testi.text}"</p>
                </div>
                <div className="flex items-center gap-4 border-t border-slate-100 pt-5">
                  <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center font-display font-black text-slate-700 select-none">
                    {testi.avatar}
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-800 font-display mb-0.5">{testi.author}</h4>
                    <p className="text-[10px] text-slate-400 font-medium font-sans uppercase tracking-wider">{testi.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer & Contacts section */}
      <footer className="bg-slate-900 text-slate-300 relative pt-20 pb-8 overflow-hidden" id="contact">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 border-b border-slate-800 pb-16">
            
            {/* Header info block */}
            <div className="lg:col-span-5 space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-[#ff6b6b] to-amber-400 flex items-center justify-center text-white shadow-xl shadow-red-950">
                  <GraduationCap className="w-7 h-7" />
                </div>
                <div>
                  <span className="block text-lg font-bold font-display text-white">Sri Chaithanya</span>
                  <span className="block text-[11px] font-medium tracking-widest text-[#ffd43b] uppercase">English Medium School</span>
                </div>
              </div>
              
              <p className="text-xs text-slate-450 leading-relaxed font-medium">
                Shaping young minds with excellence, values, and vision. From Nursery to 10th Class — your child's complete educational journey, right here in Garladinne. 🌟
              </p>

              <div className="text-xs text-[#ffd43b] font-bold">
                Nursery to 10th Class | English Medium | Garladinne, Anantapur District, Andhra Pradesh – 515 731
              </div>
            </div>

            {/* Quick links block */}
            <div className="lg:col-span-3 space-y-4">
              <h4 className="text-white text-sm font-black uppercase tracking-wider font-display">Quick Links</h4>
              <ul className="space-y-2.5 text-xs">
                <li><button onClick={() => scrollToSection("hero")} className="hover:text-amber-400 font-bold transition-colors">About School</button></li>
                <li><button onClick={() => scrollToSection("academics")} className="hover:text-amber-400 font-bold transition-colors">Classes Offered</button></li>
                <li><button onClick={() => scrollToSection("academics")} className="hover:text-amber-400 font-bold transition-colors">Academics</button></li>
                <li><button onClick={() => scrollToSection("facilities")} className="hover:text-amber-400 font-bold transition-colors">Facilities</button></li>
                <li><button onClick={() => scrollToSection("admission")} className="hover:text-amber-400 font-bold transition-colors">Admissions</button></li>
                <li><button onClick={() => scrollToSection("contact")} className="hover:text-amber-400 font-bold transition-colors">Contact Us</button></li>
              </ul>
            </div>

            {/* Direct Contacts column */}
            <div className="lg:col-span-4 space-y-5">
              <h4 className="text-white text-sm font-black uppercase tracking-wider font-display">Contact Channels</h4>
              
              <div className="space-y-4 text-xs">
                <div className="flex gap-3">
                  <MapPin className="w-5 h-5 text-[#ff6b6b] shrink-0" />
                  <div>
                    <strong className="block text-white mb-0.5 font-display">School Address</strong>
                    <span className="text-slate-400 font-medium">Garladinne (V &amp; M), Anantapur District, Andhra Pradesh – 515 731</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Phone className="w-5 h-5 text-sky-400 shrink-0" />
                  <div>
                    <strong className="block text-white mb-0.5 font-display">Phone / WhatsApp</strong>
                    <div className="space-y-0.5 text-slate-400 font-medium">
                      <a href="tel:+919876543210" className="hover:text-white transition-colors block">+91 98765 43210</a>
                      <a href="tel:+918099887766" className="hover:text-white transition-colors block">+91 80998 87766</a>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Mail className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <strong className="block text-white mb-0.5 font-display">Email Support</strong>
                    <div className="space-y-0.5 text-slate-400 font-medium">
                      <a href="mailto:info@srichaithanya.edu.in" className="hover:text-white transition-colors block">info@srichaithanya.edu.in</a>
                      <a href="mailto: admissions@srichaithanya.edu.in" className="hover:text-white transition-colors block">admissions@srichaithanya.edu.in</a>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Clock className="w-5 h-5 text-amber-450 shrink-0" />
                  <div>
                    <strong className="block text-white mb-0.5 font-display">Office Hours</strong>
                    <span className="text-slate-400 font-medium">Mon–Sat: 8:30AM–4:30PM (Sunday General Holiday)</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Copyright and portal entry */}
          <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-[11px] text-slate-500 font-bold font-display">
            <p className="text-center md:text-left mb-4 md:mb-0">
              © 2026 Sri Chaithanya English Medium School, Garladinne. All rights reserved. | Crafted for the students of Anantapur District
            </p>
            <div className="flex items-center gap-4">
              <button onClick={() => onNavigate("login")} className="hover:text-white transition-colors flex items-center gap-1 uppercase tracking-widest leading-none cursor-pointer">
                Admin Entry <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
}
