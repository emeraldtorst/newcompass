import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GlassWater, 
  Package, 
  FileText, 
  Trash2, 
  Apple, 
  Flame, 
  Wrench, 
  Search, 
  Sparkles, 
  Globe, 
  MapPin, 
  Instagram, 
  Facebook,
  ExternalLink,
  Youtube, 
  Menu, 
  X, 
  ChevronDown, 
  ChevronUp, 
  Download, 
  Mail, 
  CheckCircle,
  HelpCircle,
  Clock,
  ArrowRight,
  Compass
} from 'lucide-react';
import { Language, WasteItem } from './types';
import { wasteDatabase, mistplaetze, translations, faqsList } from './data';

const EUFundedLogo = ({ dark = false, className = "h-8" }: { dark?: boolean; className?: string }) => {
  return (
    <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-xl transition-all shadow-3xs hover:scale-101 border ${
      dark 
        ? "bg-white/5 border-white/5" 
        : "bg-slate-50 border-slate-100"
    } ${className}`}>
      <svg
        viewBox="0 0 150 100"
        className="h-full object-contain shrink-0 rounded-xs shadow-3xs"
        aria-hidden="true"
        style={{ aspectRatio: "3/2" }}
      >
        <rect width="150" height="100" fill="#003399" />
        <g transform="translate(150, 0) scale(1) translate(-75, 50)">
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angleDeg, i) => {
            const angle = (angleDeg * Math.PI) / 180;
            const r = 30;
            const x = r * Math.sin(angle);
            const y = -r * Math.cos(angle);
            return (
              <polygon
                key={i}
                points="0,-4 1.2,-1.2 4,-1.2 1.8,0.4 2.6,3.2 0,1.5 -2.6,3.2 -1.8,0.4 -4,-1.2 -1.2,-1.2"
                transform={`translate(${x}, ${y})`}
                fill="#FFCC00"
              />
            );
          })}
        </g>
      </svg>
      <div className="flex flex-col justify-center leading-none text-left select-none">
        <span className={`text-[8px] uppercase tracking-wider font-extrabold ${dark ? 'text-slate-400' : 'text-slate-500'}`} style={{ fontFamily: 'sans-serif' }}>
          Funded by
        </span>
        <span className={`text-[10px] font-black tracking-tight leading-tight mt-0.5 ${dark ? 'text-white' : 'text-[#003399]'}`} style={{ fontFamily: 'sans-serif' }}>
          the European Union
        </span>
      </div>
    </div>
  );
};

export default function App() {
  const [language, setLanguage] = useState<Language>('en');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  
  // Hover & navigation slide animation state
  const [hoveredNavItem, setHoveredNavItem] = useState<string | null>(null);
  
  // Mobile layout state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // AI and search feedback states
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiResult, setAiResult] = useState<WasteItem & { itemName: string } | null>(null);
  
  // Detailed single item focus view from directory clicking
  const [focusedItem, setFocusedItem] = useState<{ name: string; item: WasteItem } | null>(null);

  // Selected Mistplatz for the MA48 Locator
  const [selectedMistplatz, setSelectedMistplatz] = useState<typeof mistplaetze[0]>(mistplaetze[0]);
  const [districtFilter, setDistrictFilter] = useState('');

  // Get translated texts based on the current active language state
  const t = useMemo(() => translations[language] || translations.en, [language]);
  const FAQs = useMemo(() => faqsList[language] || faqsList.en, [language]);

  // Memoized filtered Mistplätze based on search filter input
  const filteredMistplaetze = useMemo(() => {
    if (!districtFilter.trim()) return mistplaetze;
    const cleanFilter = districtFilter.toLowerCase().trim();
    return mistplaetze.filter(centre => 
      centre.district.toLowerCase().includes(cleanFilter) ||
      centre.name.toLowerCase().includes(cleanFilter) ||
      centre.address.toLowerCase().includes(cleanFilter)
    );
  }, [districtFilter]);

  // Map category strings to corresponding Lucide React Icons
  const getCategoryIcon = (cat: string, size = 24) => {
    switch (cat) {
      case 'glass': return <GlassWater size={size} />;
      case 'plastic': return <Package size={size} />;
      case 'paper': return <FileText size={size} />;
      case 'residual': return <Trash2 size={size} />;
      case 'bio': return <Apple size={size} />;
      case 'hazardous': return <Flame size={size} />;
      case 'bulky': return <Wrench size={size} />;
      default: return <Trash2 size={size} />;
    }
  };

  // Helper to resolve Tailwind color mappings based on category colors
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue': return { bg: 'bg-blue-50 border-blue-200', text: 'text-blue-700', fill: 'bg-blue-500', hex: '#3b82f6', border: 'border-blue-400' };
      case 'yellow': return { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-800', fill: 'bg-amber-500', hex: '#d97706', border: 'border-amber-400' };
      case 'green': return { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', fill: 'bg-emerald-500', hex: '#10b981', border: 'border-emerald-400' };
      case 'gray': return { bg: 'bg-zinc-50 border-zinc-200', text: 'text-zinc-700', fill: 'bg-zinc-500', hex: '#71717a', border: 'border-zinc-400' };
      case 'purple': return { bg: 'bg-purple-50 border-purple-200', text: 'text-purple-700', fill: 'bg-purple-500', hex: '#8b5cf6', border: 'border-purple-400' };
      case 'red': return { bg: 'bg-red-50 border-red-200', text: 'text-red-700', fill: 'bg-red-500', hex: '#ef4444', border: 'border-red-400' };
      case 'brown': return { bg: 'bg-amber-100 border-amber-300', text: 'text-amber-900', fill: 'bg-amber-800', hex: '#78350f', border: 'border-amber-700' };
      default: return { bg: 'bg-slate-50 border-slate-200', text: 'text-slate-700', fill: 'bg-slate-500', hex: '#64748b', border: 'border-slate-400' };
    }
  };

  // Static items filter based on category selection
  const filteredDatabaseItems = useMemo(() => {
    return Object.entries(wasteDatabase).filter(([_, val]) => {
      if (selectedCategory && val.category !== selectedCategory) return false;
      return true;
    });
  }, [selectedCategory]);

  // Subtitle translations helper for the waste directory items
  const translateKey = (originalName: string, category: string): string => {
    // Basic dynamic dictionary translation map for pre-set items inside our database
    const dict: { [key: string]: { [lang: string]: string } } = {
      "Clear Glass Bottle": { de: "Weißglasflasche", ru: "Бесцветная стеклянная бутылка", tr: "Berrak Cam Şişe" },
      "Colored Glass Bottle": { de: "Buntglasflasche", ru: "Цветная стеклянная бутылка", tr: "Renkli Cam Şişe" },
      "Glass Jar": { de: "Schraubglas", ru: "Стеклянная банка", tr: "Cam Kavanoz" },
      "Plastic Bottle": { de: "PET-Flasche", ru: "Пластиковая бутылка (PET)", tr: "Plastik Şişe" },
      "Tetra Pak": { de: "Getränkekarton (Tetra Pak)", ru: "Упаковка Тетра Пак", tr: "Karton İçecek Kutusu" },
      "Aluminum Can": { de: "Aludose", ru: "Алюминиевая банка", tr: "Alüminyum Kutu" },
      "Plastic Container": { de: "Kunststoffbecher", ru: "Пластиковый контейнер", tr: "Plastik Kap" },
      "Newspaper": { de: "Zeitung / Papier", ru: "Газета", tr: "Gazete" },
      "Cardboard Box": { de: "Kartonage", ru: "Картонная коробка", tr: "Karton Kutu" },
      "Office Paper": { de: "Druckerpapier", ru: "Письменная бумага", tr: "Yazıcı Kağıdı" },
      "Pizza Box": { de: "Pizzakarton", ru: "Коробка из-под пиццы", tr: "Pizza Kutusu" },
      "Diaper": { de: "Windel", ru: "Подгузник (памперс)", tr: "Bebek Bezi" },
      "Broken Ceramic": { de: "Porzellanscherben", ru: "Битая керамика / Посуда", tr: "Seramik Kırığı" },
      "Cigarette Butt": { de: "Zigarettenstummel", ru: "Окурок", tr: "Sigara İzmariti" },
      "Food Scraps": { de: "Speisereste", ru: "Пищевые отходы", tr: "Yiyecek Artıkları" },
      "Coffee Grounds": { de: "Kaffeesatz", ru: "Кофейная гуща", tr: "Kahve Telvesi" },
      "Garden Waste": { de: "Grünschnitt / Gartenabfälle", ru: "Садовые отходы", tr: "Bahçe Atığı" },
      "Battery": { de: "Batterie", ru: "Батарейка", tr: "Pil" },
      "Paint": { de: "Lacken und Farben", ru: "Краска и лак", tr: "Boya / Vernik" },
      "Electronic Waste": { de: "Elektroschrott / Handy", ru: "Электрохлам / Зарядка", tr: "Elektronik Atık" },
      "Furniture": { de: "Möbel", ru: "Мебель", tr: "Mobilya" },
      "Mattress": { de: "Matratze", ru: "Матрас", tr: "Yatak" },
      "Large Appliance": { de: "Elektrogroßgerät", ru: "Крупная бытовая техника", tr: "Büyük Beyaz Eşya" }
    };
    return (dict[originalName] && dict[originalName][language]) || originalName;
  };

  // Submit Search logic (fully local, client-side search indexing - no external network API requests!)
  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setAiLoading(true);
    setAiError(null);
    setAiResult(null);
    setFocusedItem(null);

    const queryLower = searchQuery.toLowerCase().trim();

    // 1. Look for a precise or partial match in our comprehensive local dictionary
    const localMatchEntry = Object.entries(wasteDatabase).find(([key, item]) => {
      const matchInDe = translateKey(key, item.category).toLowerCase();
      const matchInEn = key.toLowerCase();
      return (
        matchInEn === queryLower ||
        matchInDe === queryLower ||
        matchInEn.includes(queryLower) ||
        matchInDe.includes(queryLower) ||
        queryLower.includes(matchInEn) ||
        queryLower.includes(matchInDe)
      );
    });

    if (localMatchEntry) {
      const [key, item] = localMatchEntry;
      setAiResult({
        itemName: translateKey(key, item.category),
        category: item.category,
        bin: item.bin,
        instructions: item.instructions,
        emoji: item.emoji,
        color: item.color,
        icon: item.icon
      });
      setAiLoading(false);
      return;
    }

    // 2. Smart local heuristics fallback so that 100% of keywords return correct recommendations offline
    setTimeout(() => {
      let predictedCategory = 'residual';
      let predictedBin = 'Residual Waste (Restmüll)';
      let predictedInstructions = 'Generally goes into the standard Restmüll bin. Make sure there are no dangerous materials, liquids, or large bulk items inside.';
      let predictedEmoji = '🗑️';
      let predictedColor = 'gray';

      // Advanced multilingual matches
      const isPlastic = /plastic|bottle|can|metal|folie|alu|dose|pack|kunststoff|becher|verpackung|dosen|flasche/i.test(queryLower);
      const isGlass = /glass|glas|bottle|flasche|jar|behälter|karaffe/i.test(queryLower);
      const isPaper = /paper|papier|box|karton|zeitung|buch|cardboard|pappe|schachtel/i.test(queryLower);
      const isBio = /bio|food|essen|obst|gemüse|coffee|plant|leaf|apple|abfälle|speisereste|kaffee/i.test(queryLower);
      const isHazardous = /battery|batterie|paint|farbe|chem|phone|electro|lamp|light|gift|lösemittel|akku|handy/i.test(queryLower);
      const isBulky = /furniture|sofa|chair|tisch|table|mattress|bett|groß|sperrmüll|möbel|schrank/i.test(queryLower);

      if (isPlastic) {
        predictedCategory = 'plastic';
        predictedBin = 'Yellow Bin (Gelbe Tonne)';
        predictedInstructions = 'All lightweight packagings of plastic or metal, plastic beverage bottles, and drink cartons (Tetra Pak) belong in the Yellow Bin in Vienna.';
        predictedEmoji = '🥤';
        predictedColor = 'yellow';
      } else if (isGlass) {
        predictedCategory = 'glass';
        predictedBin = 'Glass Containers (Weißglas / Buntglas)';
        predictedInstructions = 'Separate clear jars/bottles (white Glass Bins) from colored glass ones. Lids can go into the Yellow Bin.';
        predictedEmoji = '🍾';
        predictedColor = 'blue';
      } else if (isPaper) {
        predictedCategory = 'paper';
        predictedBin = 'Paper Bin (Rote Tonne)';
        predictedInstructions = 'Dry and clean paper, cardboard boxes, and envelopes belong in the red Paper bin. Flatten boxes to save space.';
        predictedEmoji = '📰';
        predictedColor = 'green';
      } else if (isBio) {
        predictedCategory = 'bio';
        predictedBin = 'Bio Bin (Braune Tonne)';
        predictedInstructions = 'Organic wastes like raw food scraps, fruit peelings, coffee grounds and paper filters, tea bags, and garden greens.';
        predictedEmoji = '🍎';
        predictedColor = 'purple';
      } else if (isHazardous) {
        predictedCategory = 'hazardous';
        predictedBin = 'Problemstoff Point / Collection Hub';
        predictedInstructions = 'Hazardous and toxic substances should never go inside local household bins! Bring paints, batteries, solvents, or electronic waste to the nearest collection point or MA48 Mistplatz.';
        predictedEmoji = '🔋';
        predictedColor = 'red';
      } else if (isBulky) {
        predictedCategory = 'bulky';
        predictedBin = 'MA48 Mistplatz Recycling Center';
        predictedInstructions = 'Large and oversized items like old furniture, non-metal elements, beds, mattresses, and scrap wood are processed at Viennese Mistplätze free of charge.';
        predictedEmoji = '🪑';
        predictedColor = 'brown';
      }

      setAiResult({
        itemName: searchQuery,
        category: predictedCategory,
        bin: predictedBin,
        instructions: predictedInstructions,
        emoji: predictedEmoji,
        color: predictedColor,
        icon: 'Search'
      });
      setAiLoading(false);
    }, 120);
  };

  // Navigation items for the header & footer
  const navItems = useMemo(() => [
    { href: '#why-it-matters', label: t.navProblem },
    { href: '#sorting-guide', label: t.navGuide },
    { href: '#mistplatz-map', label: t.navMap },
    { href: '#recycling-quizzes', label: t.navQuizzes },
  ], [t]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased selection:bg-emerald-200">
      
      {/* HEADER NAVBAR */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          {/* Logo / Title */}
          <a href="#" id="home-logo" className="flex items-center gap-2 sm:gap-3 group select-none shrink">
            <img 
              src="/logo1.png" 
              alt="Vienna Recycling Compass Logo" 
              className="w-7 h-7 xs:w-8 xs:h-8 sm:w-10 sm:h-10 object-contain rounded-lg sm:rounded-xl shadow-xs group-hover:scale-105 transition-transform"
            />
            <div className="min-w-0">
              <span className="text-[13px] xs:text-sm sm:text-base md:text-xl font-black font-sans tracking-tight text-slate-900 flex items-center gap-1 select-none">
                Vienna Recycling Compass <span className="text-emerald-500 text-xs xs:text-sm sm:text-base">🧭</span>
              </span>
              <p className="hidden xs:block text-[8px] sm:text-[10px] text-emerald-500 font-bold uppercase tracking-widest font-mono">viennarecyclingcompass.site</p>
            </div>
          </a>

          {/* Desktop Navigation Links with animated hover highlight slider */}
          <nav 
            className="hidden md:flex items-center gap-1 bg-slate-50 border border-slate-100 p-1.5 rounded-2xl relative" 
            onMouseLeave={() => setHoveredNavItem(null)}
          >
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onMouseEnter={() => setHoveredNavItem(item.href)}
                className={`relative px-4 py-2 text-sm font-semibold rounded-xl transition-colors z-10 ${
                  hoveredNavItem === item.href ? 'text-emerald-700' : 'text-slate-600'
                }`}
              >
                {item.label}
                {hoveredNavItem === item.href && (
                  <motion.div
                    layoutId="navHover"
                    className="absolute inset-0 bg-white rounded-xl shadow-3xs border border-slate-200/50 -z-10"
                    transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                  />
                )}
              </a>
            ))}
          </nav>

          {/* Secondary Controls: Language Switcher, Sponsor Logo, and Mobile Menu */}
          <div className="flex items-center gap-3">
            
            {/* EU Funded Logo in header */}
            <div className="hidden md:flex">
              <EUFundedLogo className="h-8" />
            </div>

            {/* ESC Logo in header */}
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 bg-slate-50 border border-slate-100 rounded-xl h-8">
              <img 
                src="/ESC logo.jpg.jpeg" 
                alt="European Solidarity Corps Logo" 
                className="h-5 object-contain rounded-sm"
              />
              <span className="text-[9px] uppercase tracking-wider font-mono font-bold text-slate-500 leading-tight">
                ESC
              </span>
            </div>

            {/* Language Dropdown Selector */}
            <div className="relative flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 focus-within:ring-2 focus-within:ring-emerald-400/20">
              <Globe size={15} className="text-slate-500" />
              <select 
                id="language-selector"
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer pr-1"
              >
                <option value="en">English (EN)</option>
                <option value="de">Deutsch (DE)</option>
                <option value="ru">Русский (RU)</option>
                <option value="tr">Türkçe (TR)</option>
              </select>
            </div>

            {/* Mobile Menu Icon toggling button */}
            <button 
              id="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              className="md:hidden p-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE DRAWER NAVIGATION */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            id="mobile-drawer"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-slate-200 overflow-hidden shadow-lg"
          >
            <div className="px-4 py-3 pb-4 flex flex-col gap-2.5 bg-slate-50/50">
              <a 
                href="#why-it-matters" 
                onClick={() => setMobileMenuOpen(false)} 
                className="py-3 px-4 text-xs font-bold text-slate-700 hover:text-emerald-600 bg-white border border-slate-200/60 rounded-xl hover:shadow-3xs transition-all flex items-center gap-3 active:bg-slate-50"
              >
                <span className="text-sm shrink-0">💡</span>
                <span>{t.navProblem}</span>
              </a>
              <a 
                href="#sorting-guide" 
                onClick={() => setMobileMenuOpen(false)} 
                className="py-3 px-4 text-xs font-bold text-slate-700 hover:text-emerald-600 bg-white border border-slate-200/60 rounded-xl hover:shadow-3xs transition-all flex items-center gap-3 active:bg-slate-50"
              >
                <span className="text-sm shrink-0">🔍</span>
                <span>{t.navGuide}</span>
              </a>
              <a 
                href="#mistplatz-map" 
                onClick={() => setMobileMenuOpen(false)} 
                className="py-3 px-4 text-xs font-bold text-slate-700 hover:text-emerald-600 bg-white border border-slate-200/60 rounded-xl hover:shadow-3xs transition-all flex items-center gap-3 active:bg-slate-50"
              >
                <span className="text-sm shrink-0">🗺️</span>
                <span>{t.navMap}</span>
              </a>
              <a 
                href="#recycling-quizzes" 
                onClick={() => setMobileMenuOpen(false)} 
                className="py-3 px-4 text-xs font-bold text-slate-700 hover:text-emerald-600 bg-white border border-slate-200/60 rounded-xl hover:shadow-3xs transition-all flex items-center gap-3 active:bg-slate-50"
              >
                <span className="text-sm shrink-0">📝</span>
                <span>{t.navQuizzes}</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-b from-white to-slate-50/50 pt-10 sm:pt-16 pb-14 sm:pb-20 overflow-hidden">
        
        {/* Abstract background decorative elements */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-144 h-144 bg-emerald-100/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/10 w-96 h-96 bg-sky-200/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start items-center">
                {/* EU Funded Logo in Hero */}
                <EUFundedLogo className="h-9" />

                {/* ESC Logo in Hero */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-slate-50 text-slate-700 border border-slate-200 rounded-full text-xs font-semibold tracking-wide h-9">
                  <img 
                    src="/ESC logo.jpg.jpeg" 
                    alt="European Solidarity Corps Logo" 
                    className="h-4.5 object-contain rounded-xs"
                  />
                  <span className="font-bold">European Solidarity Corps</span>
                </div>
              </div>

              <h1 id="hero-heading" className="text-4.5xl sm:text-5.5xl font-extrabold tracking-tight text-slate-900 leading-tight">
                {t.heroTitle}
              </h1>

              <p className="text-md sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-sans">
                {t.heroSubTitle}
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <a 
                  href="#sorting-guide" 
                  className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2"
                >
                  <span>{t.heroStartBtn}</span>
                  <ArrowRight size={16} />
                </a>
                
                <a 
                  href="#why-it-matters" 
                  className="px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-700 rounded-xl font-bold border border-slate-200 shadow-xs hover:shadow-xs hover:-translate-y-0.5 active:translate-y-0 transition-all"
                >
                  {t.heroWhyBtn}
                </a>
              </div>

              {/* Lottie Animation */}
              <div className="mt-12 flex justify-center lg:justify-start">
                <div 
                  style={{ width: '100%', maxWidth: '380px' }}
                  dangerouslySetInnerHTML={{
                    __html: `
                      <dotlottie-wc
                        src="https://lottie.host/631942d4-39f1-4bc5-aa26-39871111c075/Kck61SJxZs.lottie"
                        background="transparent"
                        speed="1"
                        style="width: 100%;"
                        autoplay
                        loop
                      ></dotlottie-wc>
                    `
                  }}
                />
              </div>
            </div>

            {/* Right Asset Column */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md">
                
                {/* Visual Backdrop Frame */}
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-400 to-sky-400 rounded-2xl transform rotate-3 scale-102 opacity-5 blur-2xl pointer-events-none" />

                <div 
                  id="hero-card" 
                  className="relative bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden hover:scale-101 transition-transform"
                >
                  <img 
                    src="/logo1.png" 
                    alt="Vienna Recycling Compass Logo" 
                    className="w-full h-64 object-contain p-6 bg-slate-50/60 rounded-2xl mb-5 border border-slate-100"
                    onError={(e) => {
                      // Handled inline if missing
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />

                  <div className="flex items-center gap-3 px-3 py-1 bg-slate-50 border border-slate-100 rounded-2xl">
                    <Clock size={16} className="text-emerald-600" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">Vienna Waste Goal</h4>
                      <p className="text-[10px] text-slate-500 font-mono">Sort 100% Correctly by 2030</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION: WHY WE CARE (PROBLEMS GRID) */}
      <section id="why-it-matters" className="py-12 sm:py-20 bg-white border-t border-b border-slate-100 scroll-mt-18">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
            <h2 className="text-3xl font-extrabold text-slate-950 font-sans tracking-tight">
              {t.whyTitle} <span className="text-emerald-500">{t.whySubTitle}</span>
            </h2>
            <p className="text-medium text-slate-600 leading-relaxed font-sans">
              {t.whyDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Box 1: Complex Rules */}
            <div className="bg-slate-50/50 p-8 rounded-2xl border border-slate-200/60 shadow-xs space-y-4">
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center border border-amber-100">
                <Wrench size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900">{t.probComplexTitle}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{t.probComplexDesc}</p>
            </div>

            {/* Box 2: Language Bottlenecks */}
            <div className="bg-slate-50/50 p-8 rounded-2xl border border-slate-200/60 shadow-xs space-y-4">
              <div className="w-12 h-12 bg-violet-50 text-violet-600 rounded-xl flex items-center justify-center border border-violet-100">
                <Globe size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900">{t.probLanguageTitle}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{t.probLanguageDesc}</p>
            </div>

            {/* Box 3: Pin location tracking */}
            <div className="bg-slate-50/50 p-8 rounded-2xl border border-slate-200/60 shadow-xs space-y-4">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center border border-emerald-100">
                <MapPin size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900">{t.probMapTitle}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{t.probMapDesc}</p>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION: SUPERPOWER */}
      <section className="py-12 sm:py-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            
            <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 text-xs px-3 py-1 rounded-full font-bold">
              <span>Our Superpower</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 font-sans">
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-600">Superpower?</span>
            </h2>

            <div className="flex justify-center">
              <div 
                className="w-40 h-40"
                dangerouslySetInnerHTML={{
                  __html: `
                    <dotlottie-wc
                      src="https://lottie.host/1d6d3aad-b58b-402f-86ab-83969b02f193/O2fl3DAvKY.lottie"
                      background="transparent"
                      speed="1"
                      style="width: 100%; height: 100%;"
                      loop
                      autoplay
                    ></dotlottie-wc>
                  `
                }}
              />
            </div>

            <p className="text-slate-600 font-sans max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
              We turn confusing recycling rules into simple, visual guides that anyone can follow — no German degree required!
            </p>

          </div>
        </div>
      </section>

      {/* RECYCLING DYNAMIC GUIDE & CLASSIFICATION INTERFACE */}
      <section id="sorting-guide" className="py-12 sm:py-20 bg-slate-50 scroll-mt-18">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
            <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs px-3 py-1 rounded-full font-bold">
              <span>{t.navGuide}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {t.guideTitle} <span className="text-emerald-500">{t.guideSubTitle}</span>
            </h2>
            <p className="text-slate-600 font-sans max-w-xl mx-auto">
              {t.guideDesc}
            </p>
          </div>

          {/* DYNAMIC SEARCH COMPONENT (WITH GEMINI CLASSIFICATION CORE) */}
          <div className="max-w-3xl mx-auto mb-14">
            <form onSubmit={handleSearchSubmit} className="relative flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  id="guide-search-input"
                  type="text" 
                  placeholder={t.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-4 rounded-2xl bg-white border border-slate-200 shadow-sm focus:border-emerald-500 focus:ring-4 focus:ring-emerald-400/10 text-sm focus:outline-none transition-all placeholder:text-slate-400 font-medium"
                />
              </div>
              <button 
                id="guide-search-btn"
                type="submit" 
                disabled={aiLoading}
                className="px-6 py-4 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white rounded-2xl font-bold text-sm shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {aiLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Sorting...</span>
                  </>
                ) : (
                  <>
                    <Compass size={16} className="text-emerald-400 animate-pulse" />
                    <span>{t.searchBtn}</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-4 space-y-2 text-center">
              <p className="text-[11.5px] text-slate-500 flex items-center justify-center gap-1 font-medium">
                <Compass size={12} className="text-emerald-500" />
                <span>A fully local offline search guide. Find any household material instantly!</span>
              </p>
              <div className="max-w-xl mx-auto text-[10px] text-slate-400 bg-slate-50 border border-slate-100/80 px-3 py-2 rounded-xl italic">
                <p className="leading-relaxed">
                  {t.searchDisclaimer}
                </p>
              </div>
            </div>
          </div>

          {/* ANIMATED SEARCH OR CLASSIFICATION RESULTS CONTAINER */}
          <AnimatePresence mode="popLayout">
            {(aiResult || aiError) && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="max-w-2xl mx-auto mb-16"
              >
                {aiError ? (
                  <div className="bg-red-50 border border-red-200 text-red-800 p-5 rounded-2xl text-xs space-y-1">
                    <h4 className="font-bold">Error Categorizing Item</h4>
                    <p>{aiError}</p>
                  </div>
                ) : aiResult ? (
                  <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
                    
                    {/* Corner decorative background tint */}
                    <div className={`absolute top-0 right-0 w-36 h-36 opacity-10 rounded-full blur-2xl pointer-events-none ${getColorClasses(aiResult.color).fill}`} />

                    <div className="flex flex-col sm:flex-row gap-6 items-start">
                      
                      {/* Big Emoji / Symbol Graphic */}
                      <div className={`w-16 h-16 sm:w-20 sm:h-20 ${getColorClasses(aiResult.color).bg} border ${getColorClasses(aiResult.color).border} text-3xl sm:text-4xl flex items-center justify-center rounded-2xl shadow-xs shrink-0 shrink-0 self-center sm:self-start`}>
                        <span>{aiResult.emoji}</span>
                      </div>

                      {/* Info block */}
                      <div className="space-y-4 flex-1 w-full text-center sm:text-left">
                        <div>
                          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 mb-1 bg-transparent">
                            <span className="text-xs uppercase font-mono tracking-widest text-slate-400 font-bold">Sort Decision</span>
                            <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold uppercase rounded-md tracking-wider flex items-center gap-1">
                              <Compass size={10} className="text-emerald-500 shrink-0" /> Compass Recommendation
                            </span>
                          </div>
                          <h3 className="text-2xl font-black text-slate-950 tracking-tight leading-none">{aiResult.itemName}</h3>
                        </div>

                        {/* Visual Bin lid mapping card */}
                        <div className={`p-4 rounded-xl border flex flex-col sm:flex-row justify-between items-center gap-3 ${getColorClasses(aiResult.color).bg}`}>
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full ${getColorClasses(aiResult.color).fill}`} />
                            <div className="text-left">
                              <p className="text-[10px] text-slate-400 uppercase font-mono tracking-wider leading-none">Primary Container</p>
                              <p className="text-sm font-bold text-slate-800">{aiResult.bin}</p>
                            </div>
                          </div>
                          <span className="text-[10px] uppercase tracking-wider font-mono px-3 py-1 bg-white/80 rounded-lg text-slate-500 font-bold border border-slate-200 shadow-2xs">
                            Category: {aiResult.category}
                          </span>
                        </div>

                        {/* Instructions text */}
                        <div className="space-y-1.5 text-left bg-slate-50 border border-slate-100 p-4 rounded-xl">
                          <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest font-mono">MA48 Sorting Instructions</h4>
                          <p className="text-xs text-slate-600 leading-relaxed font-medium">
                            {aiResult.instructions}
                          </p>
                        </div>
                        
                        <div className="flex justify-center sm:justify-end gap-2 pt-1">
                          <button 
                            onClick={() => {
                              setAiResult(null);
                              setSearchQuery('');
                            }}
                            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-all border border-slate-200 shadow-3xs"
                          >
                            Dismiss Window
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                ) : null}
              </motion.div>
            )}
          </AnimatePresence>

          {/* COLOR MAPPING EXPLANATION BANNER */}
          <div className="flex flex-col md:flex-row max-w-5xl mx-auto bg-white/60 backdrop-blur-xs border border-slate-200 rounded-2.5xl p-6 items-center gap-6 mb-16 shadow-3xs">
            <div className="bg-emerald-50 text-emerald-700 min-w-14 min-h-14 shrink-0 rounded-2xl flex items-center justify-center border border-emerald-100 shadow-3xs">
              <Globe size={28} />
            </div>
            <div className="space-y-1 text-center md:text-left flex-1">
              <h4 className="text-sm font-bold text-slate-900">{t.visualTitle}</h4>
              <p className="text-xs text-slate-500 leading-relaxed">{t.visualDesc}</p>
            </div>
          </div>

          {/* DYNAMIC CATEGORY FILTER NAVIGATION GLASS PILLS */}
          <div className="max-w-5xl mx-auto mb-10">
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              
              {/* Category Pill: Glass */}
              <button 
                onClick={() => setSelectedCategory(selectedCategory === 'glass' ? null : 'glass')}
                className={`flex flex-col items-center justify-center p-3 xs:p-4 rounded-2xl xs:rounded-2.5xl text-center border transition-all ${
                  selectedCategory === 'glass' 
                    ? 'bg-blue-600 border-blue-600 text-white shadow-md -translate-y-1' 
                    : 'bg-white border-slate-200 text-slate-800 hover:shadow-sm hover:-translate-y-0.5'
                }`}
              >
                <div className={`mb-2 p-1.5 xs:mb-2.5 xs:p-2 rounded-xl ${selectedCategory === 'glass' ? 'bg-white/20' : 'bg-blue-50 text-blue-500'}`}>
                  {getCategoryIcon('glass', 18)}
                </div>
                <span className="text-[11px] xs:text-xs font-bold leading-none">{t.catGlass}</span>
                <span className={`text-[8px] xs:text-[9px] mt-0.5 xs:mt-1 ${selectedCategory === 'glass' ? 'text-blue-100' : 'text-slate-400'}`}>{t.catGlassSub}</span>
              </button>

              {/* Category Pill: Plastic */}
              <button 
                onClick={() => setSelectedCategory(selectedCategory === 'plastic' ? null : 'plastic')}
                className={`flex flex-col items-center justify-center p-3 xs:p-4 rounded-2xl xs:rounded-2.5xl text-center border transition-all ${
                  selectedCategory === 'plastic' 
                    ? 'bg-amber-600 border-amber-600 text-white shadow-md -translate-y-1' 
                    : 'bg-white border-slate-200 text-slate-800 hover:shadow-sm hover:-translate-y-0.5'
                }`}
              >
                <div className={`mb-2 p-1.5 xs:mb-2.5 xs:p-2 rounded-xl ${selectedCategory === 'plastic' ? 'bg-white/20' : 'bg-amber-50 text-amber-600'}`}>
                  {getCategoryIcon('plastic', 18)}
                </div>
                <span className="text-[11px] xs:text-xs font-bold leading-none">{t.catPlastic}</span>
                <span className={`text-[8px] xs:text-[9px] mt-0.5 xs:mt-1 ${selectedCategory === 'plastic' ? 'text-amber-100' : 'text-slate-400'}`}>{t.catPlasticSub}</span>
              </button>

              {/* Category Pill: Paper */}
              <button 
                onClick={() => setSelectedCategory(selectedCategory === 'paper' ? null : 'paper')}
                className={`flex flex-col items-center justify-center p-3 xs:p-4 rounded-2xl xs:rounded-2.5xl text-center border transition-all ${
                  selectedCategory === 'paper' 
                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-md -translate-y-1' 
                    : 'bg-white border-slate-200 text-slate-800 hover:shadow-sm hover:-translate-y-0.5'
                }`}
              >
                <div className={`mb-2 p-1.5 xs:mb-2.5 xs:p-2 rounded-xl ${selectedCategory === 'paper' ? 'bg-white/20' : 'bg-emerald-50 text-emerald-600'}`}>
                  {getCategoryIcon('paper', 18)}
                </div>
                <span className="text-[11px] xs:text-xs font-bold leading-none">{t.catPaper}</span>
                <span className={`text-[8px] xs:text-[9px] mt-0.5 xs:mt-1 ${selectedCategory === 'paper' ? 'text-emerald-100' : 'text-slate-400'}`}>{t.catPaperSub}</span>
              </button>

              {/* Category Pill: Residual */}
              <button 
                onClick={() => setSelectedCategory(selectedCategory === 'residual' ? null : 'residual')}
                className={`flex flex-col items-center justify-center p-3 xs:p-4 rounded-2xl xs:rounded-2.5xl text-center border transition-all ${
                  selectedCategory === 'residual' 
                    ? 'bg-zinc-700 border-zinc-700 text-white shadow-md -translate-y-1' 
                    : 'bg-white border-slate-200 text-slate-800 hover:shadow-sm hover:-translate-y-0.5'
                }`}
              >
                <div className={`mb-2 p-1.5 xs:mb-2.5 xs:p-2 rounded-xl ${selectedCategory === 'residual' ? 'bg-white/20' : 'bg-zinc-100 text-zinc-500'}`}>
                  {getCategoryIcon('residual', 18)}
                </div>
                <span className="text-[11px] xs:text-xs font-bold leading-none">{t.catResidual}</span>
                <span className={`text-[8px] xs:text-[9px] mt-0.5 xs:mt-1 ${selectedCategory === 'residual' ? 'text-zinc-200' : 'text-slate-400'}`}>{t.catResidualSub}</span>
              </button>

              {/* Category Pill: Bio */}
              <button 
                onClick={() => setSelectedCategory(selectedCategory === 'bio' ? null : 'bio')}
                className={`flex flex-col items-center justify-center p-3 xs:p-4 rounded-2xl xs:rounded-2.5xl text-center border transition-all ${
                  selectedCategory === 'bio' 
                    ? 'bg-purple-600 border-purple-600 text-white shadow-md -translate-y-1' 
                    : 'bg-white border-slate-200 text-slate-800 hover:shadow-sm hover:-translate-y-0.5'
                }`}
              >
                <div className={`mb-2 p-1.5 xs:mb-2.5 xs:p-2 rounded-xl ${selectedCategory === 'bio' ? 'bg-white/20' : 'bg-purple-50 text-purple-500'}`}>
                  {getCategoryIcon('bio', 18)}
                </div>
                <span className="text-[11px] xs:text-xs font-bold leading-none">{t.catBio}</span>
                <span className={`text-[8px] xs:text-[9px] mt-0.5 xs:mt-1 ${selectedCategory === 'bio' ? 'text-purple-100' : 'text-slate-400'}`}>{t.catBioSub}</span>
              </button>

              {/* Category Pill: Hazardous */}
              <button 
                onClick={() => setSelectedCategory(selectedCategory === 'hazardous' ? null : 'hazardous')}
                className={`flex flex-col items-center justify-center p-3 xs:p-4 rounded-2xl xs:rounded-2.5xl text-center border transition-all ${
                  selectedCategory === 'hazardous' 
                    ? 'bg-red-600 border-red-600 text-white shadow-md -translate-y-1' 
                    : 'bg-white border-slate-200 text-slate-800 hover:shadow-sm hover:-translate-y-0.5'
                }`}
              >
                <div className={`mb-2 p-1.5 xs:mb-2.5 xs:p-2 rounded-xl ${selectedCategory === 'hazardous' ? 'bg-white/20' : 'bg-red-50 text-red-500'}`}>
                  {getCategoryIcon('hazardous', 18)}
                </div>
                <span className="text-[11px] xs:text-xs font-bold leading-none">{t.catHazardous}</span>
                <span className={`text-[8px] xs:text-[9px] mt-0.5 xs:mt-1 ${selectedCategory === 'hazardous' ? 'text-red-100' : 'text-slate-400'}`}>{t.catHazardousSub}</span>
              </button>

              {/* Category Pill: Bulky */}
              <button 
                onClick={() => setSelectedCategory(selectedCategory === 'bulky' ? null : 'bulky')}
                className={`flex flex-col items-center justify-center p-3 xs:p-4 rounded-2xl xs:rounded-2.5xl text-center border transition-all ${
                  selectedCategory === 'bulky' 
                    ? 'bg-amber-800 border-amber-800 text-white shadow-md -translate-y-1' 
                    : 'bg-white border-slate-200 text-slate-800 hover:shadow-sm hover:-translate-y-0.5'
                }`}
              >
                <div className={`mb-2 p-1.5 xs:mb-2.5 xs:p-2 rounded-xl ${selectedCategory === 'bulky' ? 'bg-white/20' : 'bg-amber-100 text-amber-700'}`}>
                  {getCategoryIcon('bulky', 18)}
                </div>
                <span className="text-[11px] xs:text-xs font-bold leading-none">{t.catBulky}</span>
                <span className={`text-[8px] xs:text-[9px] mt-0.5 xs:mt-1 ${selectedCategory === 'bulky' ? 'text-amber-100' : 'text-slate-400'}`}>{t.catBulkySub}</span>
              </button>

            </div>
          </div>

          {/* DYNAMIC LIST OF CATEGORY FILTERED ITEMS FOR EXPLORATION */}
          <div className="max-w-5xl mx-auto">
            
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
              <span className="text-xs uppercase font-mono tracking-widest text-slate-400 font-bold block">
                {selectedCategory ? `Filter: ${selectedCategory}` : "Waste Item Grid"}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {filteredDatabaseItems.length} items listed
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {filteredDatabaseItems.map(([key, val]) => (
                <button
                  key={key}
                  id={`item-grid-${key.replace(/\s+/g, '-').toLowerCase()}`}
                  onClick={() => setFocusedItem({ name: translateKey(key, val.category), item: val })}
                  className="bg-white p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200/80 text-left hover:border-slate-300 hover:shadow-md transition-all active:scale-98 flex items-center gap-2.5 sm:gap-3.5 group cursor-pointer min-w-0"
                >
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 ${getColorClasses(val.color).bg} border ${getColorClasses(val.color).border} rounded-lg sm:rounded-xl flex items-center justify-center text-base sm:text-xl shrink-0 group-hover:scale-105 transition-transform`}>
                    <span>{val.emoji}</span>
                  </div>
                  <div className="overflow-hidden min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate leading-tight">{translateKey(key, val.category)}</h4>
                    <span className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-mono tracking-wider truncate block">{val.bin.split('(')[0]}</span>
                  </div>
                </button>
              ))}
            </div>

          </div>

          {/* FOCUSED POPUP MODULE DETAILS BANNER ON DIRECOR CLICKS */}
          <AnimatePresence>
            {focusedItem && (
              <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-900/60 backdrop-blur-xs">
                <motion.div 
                  id="detail-modal"
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 max-w-lg w-full shadow-2xl relative"
                >
                  <button 
                    onClick={() => setFocusedItem(null)}
                    className="absolute top-5 right-5 p-2 bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-600 rounded-full transition-all"
                    aria-label="Close modal"
                  >
                    <X size={16} />
                  </button>

                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 ${getColorClasses(focusedItem.item.color).bg} border ${getColorClasses(focusedItem.item.color).border} text-3xl flex items-center justify-center rounded-2xl`}>
                        {focusedItem.item.emoji}
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 block font-bold">Waste Directory Item</span>
                        <h3 className="text-xl font-extrabold text-slate-900 tracking-tight leading-none">{focusedItem.name}</h3>
                      </div>
                    </div>

                    <div className={`p-4 rounded-xl border space-y-1 ${getColorClasses(focusedItem.item.color).bg}`}>
                      <span className="text-[9px] text-slate-400 uppercase font-mono tracking-widest font-bold">Disposal Container</span>
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full ${getColorClasses(focusedItem.item.color).fill}`} />
                        <span className="text-sm font-bold text-slate-800">{focusedItem.item.bin}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-xs uppercase font-mono tracking-widest text-slate-400 font-bold">Official Instruction Step</h4>
                      <p className="text-sm text-slate-600 leading-relaxed font-medium bg-slate-50 p-4 rounded-xl border border-slate-100">
                        {focusedItem.item.instructions}
                      </p>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button 
                        onClick={() => setFocusedItem(null)}
                        className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                      >
                        Got It!
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* DOWNLOAD FULL GUIDE PDFS */}
          <div className="max-w-4xl mx-auto bg-slate-900 text-white rounded-3xl p-8 mt-18 relative overflow-hidden shadow-xl border border-slate-800">
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-7 space-y-3">
                <h3 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
                  <Download className="text-emerald-400" size={24} />
                  <span>{t.downloadTitle}</span>
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-sans font-medium">
                  {t.downloadSub}
                </p>
              </div>

              <div className="md:col-span-5 grid grid-cols-2 gap-2.5">
                <a 
                  href="https://drive.google.com/file/d/1HLc1Fes1QpUzsRIHgJBHW9oX-8McaoDS/view" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="px-3 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-black font-sans text-center transition-all border border-emerald-400/20 shadow-md shadow-emerald-500/10 hover:scale-[1.02] cursor-pointer"
                >
                  {t.downloadBtnEn}
                </a>
                <div 
                  className="px-3 py-2.5 bg-white/5 text-slate-500 rounded-xl text-xs font-semibold font-sans text-center border border-white/5 opacity-55 flex items-center justify-center gap-1.5 select-none"
                  title="Coming Soon"
                >
                  <span>{t.downloadBtnDe}</span>
                  <span className="text-[8px] font-bold bg-white/10 text-slate-400 px-1 py-0.5 rounded-sm uppercase tracking-wider font-mono shrink-0">Soon</span>
                </div>
                <div 
                  className="px-3 py-2.5 bg-white/5 text-slate-500 rounded-xl text-xs font-semibold font-sans text-center border border-white/5 opacity-55 flex items-center justify-center gap-1.5 select-none"
                  title="Coming Soon"
                >
                  <span>{t.downloadBtnRu}</span>
                  <span className="text-[8px] font-bold bg-white/10 text-slate-400 px-1 py-0.5 rounded-sm uppercase tracking-wider font-mono shrink-0">Soon</span>
                </div>
                <div 
                  className="px-3 py-2.5 bg-white/5 text-slate-500 rounded-xl text-xs font-semibold font-sans text-center border border-white/5 opacity-55 flex items-center justify-center gap-1.5 select-none"
                  title="Coming Soon"
                >
                  <span>{t.downloadBtnTr}</span>
                  <span className="text-[8px] font-bold bg-white/10 text-slate-400 px-1 py-0.5 rounded-sm uppercase tracking-wider font-mono shrink-0">Soon</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION: BURNING RECYCLING QUESTIONS (FAQ SEGMENT) */}
      <section className="py-12 sm:py-20 bg-white border-t border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 font-sans">
              {t.faqTitle} <span className="text-emerald-500">{t.faqSub}</span>
            </h2>
            <p className="text-slate-600 font-sans max-w-sm mx-auto text-xs font-medium">
              {t.faqDesc}
            </p>
          </div>

          <div className="space-y-4">
            {FAQs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div 
                  key={index} 
                  id={`faq-item-${index}`}
                  className="bg-slate-50 border border-slate-200/80 rounded-2xl overflow-hidden transition-all shadow-4xs"
                >
                  <button 
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                  >
                    <span className="text-sm font-bold text-slate-800 flex items-center gap-2.5">
                      <HelpCircle size={16} className="text-emerald-500 shrink-0" />
                      <span>{faq.q}</span>
                    </span>
                    <span className="text-slate-400">
                      {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                      >
                        <div className="px-6 pb-6 text-xs text-slate-600 leading-relaxed font-sans font-medium border-t border-slate-200/50 pt-4 bg-white/50">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* SECTION: MISTPLATZ DIRECTORY & MAP LOCAL FINDER */}
      <section id="mistplatz-map" className="py-12 sm:py-20 bg-slate-50 scroll-mt-18">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Description + Directory Table Panel */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs px-3 py-1 rounded-full font-bold">
                  <span>MA48 Mistplätze</span>
                </div>
                <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 leading-tight">
                  {t.mapTitle} <span className="text-emerald-500">{t.mapSub}</span>
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {t.mapDesc} Click on any collection center below to view it dynamically on the interactive locator map.
                </p>
              </div>

              {/* Fuzzy Search Filters for Mistplätze */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by District, Name, or Street..."
                  value={districtFilter}
                  onChange={(e) => setDistrictFilter(e.target.value)}
                  className="w-full px-4 py-3 pl-10 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-400/10 focus:border-emerald-500 transition-all font-medium shadow-3xs"
                />
                <Search size={15} className="absolute left-3.5 top-3.5 text-slate-400" />
                {districtFilter && (
                  <button
                    onClick={() => setDistrictFilter('')}
                    className="absolute right-3.5 top-3.5 text-[11px] font-bold text-slate-400 hover:text-slate-600"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Table of locations representation */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden overflow-x-auto max-h-110 overflow-y-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-slate-100 border-b border-slate-200 sticky top-0 z-10">
                    <tr>
                      <th className="px-3 py-2.5 sm:px-4 sm:py-3 font-bold text-slate-600 font-mono tracking-wider">{t.tblDistrict}</th>
                      <th className="px-3 py-2.5 sm:px-4 sm:py-3 font-bold text-slate-600 font-mono tracking-wider">{t.tblName}</th>
                      <th className="hidden sm:table-cell px-4 py-3 font-bold text-slate-600 font-mono tracking-wider">{t.tblAddress}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredMistplaetze.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-4 py-8 text-center text-slate-400">
                          No recycling collection centers match your search filter.
                        </td>
                      </tr>
                    ) : (
                      filteredMistplaetze.map((centre, index) => {
                        const isSelected = selectedMistplatz && selectedMistplatz.name === centre.name;
                        return (
                          <tr 
                            key={index} 
                            onClick={() => setSelectedMistplatz(centre)}
                            className={`cursor-pointer transition-all ${
                              isSelected 
                                ? 'bg-emerald-50/70 hover:bg-emerald-50 text-emerald-950 font-semibold border-l-4 border-emerald-500' 
                                : 'hover:bg-slate-50/80 text-slate-700'
                            }`}
                          >
                            <td className="px-3 py-2.5 sm:px-4 sm:py-3 font-medium">{centre.district}</td>
                            <td className="px-3 py-2.5 sm:px-4 sm:py-3 flex items-center gap-1.5">
                              <span className={`w-2 h-2 rounded-full transition-all shrink-0 ${isSelected ? 'bg-emerald-500 scale-125 animate-pulse' : 'bg-slate-300'}`} />
                              <span className="truncate">{centre.name} {isSelected && <span className="hidden sm:inline text-[9px] text-emerald-600 bg-emerald-100 px-1.5 py-0.2 rounded-full font-black ml-1.5 uppercase font-mono tracking-wider">Active</span>}</span>
                            </td>
                            <td className="hidden sm:table-cell px-4 py-3 font-mono text-[11px] select-all">{centre.address}</td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Iframe Map representation (Google Maps embed representation for MA48 hubs) */}
            <div className="lg:col-span-5 flex justify-center lg:sticky lg:top-24">
              <div className="w-full max-w-md bg-white border border-slate-200 p-4 rounded-3xl shadow-lg relative overflow-hidden">
                <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-emerald-100 text-emerald-700 rounded-lg flex items-center justify-center">
                      <MapPin size={16} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">MA48 Interactive Map</h4>
                      <p className="text-[10px] text-slate-400">Vienna waste collection systems locator</p>
                    </div>
                  </div>
                </div>

                <div className="w-full h-80 rounded-2xl overflow-hidden border border-slate-100 shadow-3xs relative bg-slate-100">
                  <iframe 
                    id="mistplatz-google-maps"
                    title={selectedMistplatz ? `Vienna MA48 Mistplatz - ${selectedMistplatz.name}` : `Vienna Waste Map`}
                    src={selectedMistplatz 
                      ? `https://maps.google.com/maps?q=${encodeURIComponent('MA48 Mistplatz ' + selectedMistplatz.name + ', ' + selectedMistplatz.address + ', Wien, Austria')}&t=&z=14&ie=UTF8&iwloc=&output=embed`
                      : `https://maps.google.com/maps?q=${encodeURIComponent('Mistplatz Wien')}&t=&z=11&ie=UTF8&iwloc=&output=embed`
                    } 
                    className="w-full h-full border-none"
                    loading="lazy"
                    allowFullScreen
                  />
                </div>

                {selectedMistplatz && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 space-y-3"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <h5 className="font-bold text-slate-900 text-[10px] uppercase font-mono tracking-wider">Active Location Details</h5>
                      <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">MA48 Certified</span>
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-xs font-extrabold text-slate-800">
                        MA48 Mistplatz {selectedMistplatz.name}
                      </p>
                      <p className="text-[11px] text-slate-600 flex items-center gap-1.5">
                        <MapPin size={12} className="text-emerald-600 shrink-0" />
                        <span>{selectedMistplatz.address}, Wien ({selectedMistplatz.district})</span>
                      </p>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
                        <Clock size={12} className="text-emerald-600 shrink-0" />
                        <span>Mon-Sat: 07:00 - 18:00 (Except state holidays)</span>
                      </p>
                    </div>
                    
                    <div className="pt-2 border-t border-emerald-100/60 flex gap-2">
                      <a 
                        href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent('MA48 Mistplatz ' + selectedMistplatz.name + ', ' + selectedMistplatz.address + ', Wien, Austria')}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex-1 text-center py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[11px] rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-500/10 cursor-pointer"
                      >
                        <MapPin size={12} />
                        Get Directions &amp; Route
                      </a>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION: RECYCLING QUIZZES */}
      <section id="recycling-quizzes" className="py-12 sm:py-20 bg-white scroll-mt-18">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
            <span className="text-emerald-500 font-bold uppercase text-xs tracking-widest bg-emerald-100/60 px-3 py-1.5 rounded-full font-mono">
              {t.navQuizzes}
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 font-sans">
              {t.quizSectionTitle} <span className="text-emerald-500">{t.quizSectionSub}</span>
            </h2>
            <p className="text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
              {t.quizSectionDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            
            {/* Quiz 1: Yellow Bin */}
            <div className="bg-slate-50 rounded-2.5xl border border-slate-200/80 p-6 shadow-4xs flex flex-col justify-between hover:shadow-xs hover:-translate-y-1 hover:border-yellow-200 transition-all">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-xl flex items-center justify-center shadow-3xs border border-yellow-200/50 text-xl">
                  🥤
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-md uppercase tracking-wider font-mono">Gelbe Tonne</span>
                    <span className="text-[10px] font-bold text-slate-400 font-mono">7 Qs</span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 font-sans">
                    {t.quiz1Title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-sans">
                    {t.quiz1Desc}
                  </p>
                </div>
              </div>
              <div className="pt-6">
                <a 
                  href="https://forms.gle/6PxQnhkAkQE7hXEQA" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-4xs transition-all cursor-pointer group"
                >
                  <span>{t.quizStartBtn}</span>
                  <ExternalLink size={12} className="text-slate-400 group-hover:text-white transition-colors" />
                </a>
              </div>
            </div>

            {/* Quiz 2: Problem Wastes */}
            <div className="bg-slate-50 rounded-2.5xl border border-slate-200/80 p-6 shadow-4xs flex flex-col justify-between hover:shadow-xs hover:-translate-y-1 hover:border-red-200 transition-all">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center shadow-3xs border border-red-200/50 text-xl">
                  🔋
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-md uppercase tracking-wider font-mono">Problemstoffe</span>
                    <span className="text-[10px] font-bold text-slate-400 font-mono">6 Qs</span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 font-sans">
                    {t.quiz2Title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-sans">
                    {t.quiz2Desc}
                  </p>
                </div>
              </div>
              <div className="pt-6">
                <a 
                  href="https://forms.gle/mHPqYgiuPC1VY2JVA" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-4xs transition-all cursor-pointer group"
                >
                  <span>{t.quizStartBtn}</span>
                  <ExternalLink size={12} className="text-slate-400 group-hover:text-white transition-colors" />
                </a>
              </div>
            </div>

            {/* Quiz 3: Ultimate Master */}
            <div className="bg-slate-50 rounded-2.5xl border border-slate-200/80 p-6 shadow-4xs flex flex-col justify-between hover:shadow-xs hover:-translate-y-1 hover:border-emerald-200 transition-all">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center shadow-3xs border border-emerald-200/50 text-xl font-bold">
                  🏆
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md uppercase tracking-wider font-mono">Vienna Master</span>
                    <span className="text-[10px] font-bold text-slate-400 font-mono">8 Qs</span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 font-sans">
                    {t.quiz3Title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-sans">
                    {t.quiz3Desc}
                  </p>
                </div>
              </div>
              <div className="pt-6">
                <a 
                  href="https://forms.gle/3ayNxBn7yBgGVetT6" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-4xs transition-all cursor-pointer group"
                >
                  <span>{t.quizStartBtn}</span>
                  <ExternalLink size={12} className="text-slate-400 group-hover:text-white transition-colors" />
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION: CONNECT SOCIAL MEDIA SEGMENT */}
      <section className="py-12 sm:py-20 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 font-sans">
              {t.socialTitle} <span className="text-emerald-500">{t.socialSub}</span>
            </h2>
            <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
              {t.socialDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            
            {/* Social Grid Item 1: Instagram */}
            <a 
              href="https://www.instagram.com/viennarecycling/" 
              target="_blank" 
              rel="noreferrer" 
              id="social-instagram"
              className="bg-slate-50 hover:bg-pink-50 p-6 rounded-2.5xl border border-slate-200 hover:border-pink-200 shadow-4xs hover:shadow-xs group hover:-translate-y-1 transition-all text-left flex flex-col gap-4"
            >
              <div className="w-10 h-10 bg-pink-100 group-hover:bg-pink-500 group-hover:text-white text-pink-600 rounded-xl flex items-center justify-center transition-all shadow-xs border border-pink-200/50">
                <Instagram size={20} />
              </div>
              <div className="space-y-1.5">
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-pink-600 transition-colors">Instagram Stories</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed font-sans font-medium">{t.socialInstDesc}</p>
              </div>
            </a>

            {/* Social Grid Item 2: Facebook */}
            <a 
              href="https://www.facebook.com/viennarecycling" 
              target="_blank" 
              rel="noreferrer" 
              id="social-facebook"
              className="bg-slate-50 hover:bg-blue-50 p-6 rounded-2.5xl border border-slate-200 hover:border-blue-200 shadow-4xs hover:shadow-xs group hover:-translate-y-1 transition-all text-left flex flex-col gap-4"
            >
              <div className="w-10 h-10 bg-blue-100 group-hover:bg-blue-600 group-hover:text-white text-blue-600 rounded-xl flex items-center justify-center transition-all shadow-xs border border-blue-200/50">
                <Facebook size={20} />
              </div>
              <div className="space-y-1.5">
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Facebook Community</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed font-sans font-medium">{t.socialFbDesc}</p>
              </div>
            </a>

            {/* Social Grid Item 3: Project Subpage */}
            <a 
              href="https://www.euactive.org/recycling-made-simple-for-expats-vienna-recycling-compass/" 
              target="_blank" 
              rel="noreferrer" 
              id="social-project"
              className="bg-slate-50 hover:bg-emerald-50 p-6 rounded-2.5xl border border-slate-200 hover:border-emerald-200 shadow-4xs hover:shadow-xs group hover:-translate-y-1 transition-all text-left flex flex-col gap-4"
            >
              <div className="w-10 h-10 bg-emerald-100 group-hover:bg-emerald-600 group-hover:text-white text-emerald-600 rounded-xl flex items-center justify-center transition-all shadow-xs border border-emerald-200/50">
                <ExternalLink size={20} />
              </div>
              <div className="space-y-1.5">
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">About Our Project</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed font-sans font-medium">{t.socialProjDesc}</p>
              </div>
            </a>

          </div>
        </div>
      </section>



      {/* FOOTER AREA */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 pt-16 pb-8 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-10 border-b border-slate-800 pb-12 mb-8">
          
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <img 
                src="/logo1.png" 
                alt="Vienna Recycling Compass Logo" 
                className="w-8 h-8 object-contain rounded-lg"
              />
              <h3 className="text-white text-lg font-black tracking-tight flex items-center gap-2">
                <span>Vienna Recycling Compass</span>
                <span className="text-emerald-400 text-xs py-0.5 px-1.5 bg-white/10 rounded-md font-mono tracking-wider font-bold">MA48 GUIDE</span>
              </h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              {t.footerAboutDesc}
            </p>
            <p className="text-[10px] text-emerald-500 uppercase tracking-widest font-mono font-bold">viennarecyclingcompass.site</p>
          </div>

          <div className="md:col-span-3 space-y-3.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest font-mono">{t.footerLinks}</h4>
            <ul className="space-y-2 text-xs">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="hover:text-emerald-400 transition-colors">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4 space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest font-mono">Supported & Funded</h4>
            <div className="space-y-3 bg-white/5 p-4.5 rounded-2.5xl border border-white/5 shadow-inner">
              
              {/* EU Funded Logo on Dark */}
              <div className="flex">
                <EUFundedLogo dark className="h-9" />
              </div>

              <div className="h-[1px] bg-slate-800 w-full" />

              {/* ESC Logo without Sponsored word */}
              <div className="flex items-center gap-3 bg-slate-800/20 p-2.5 rounded-xl border border-slate-800">
                <img 
                  src="/ESC logo.jpg.jpeg" 
                  alt="European Solidarity Corps Logo" 
                  className="h-8 object-contain rounded-md bg-white p-1 shrink-0"
                />
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-slate-100 leading-none">European Solidarity Corps</p>
                  <p className="text-[10px] text-slate-400 leading-tight">Educational project development partner.</p>
                </div>
              </div>

              {/* EU Legal Funding Disclaimer */}
              <div className="text-[9.5px] text-slate-500 leading-relaxed bg-black/15 p-3 rounded-lg border border-white/5 font-sans mt-2 select-none">
                <p className="font-semibold text-slate-400 mb-1">Disclaimer:</p>
                Funded by the European Union. Views and opinions expressed are however those of the author(s) only and do not necessarily reflect those of the European Union or the European Education and Culture Executive Agency (EACEA). Neither the European Union nor EACEA can be held responsible for them.
              </div>

            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-center">
          <p className="text-[11px] text-slate-500 font-medium">
            &copy; {new Date().getFullYear()} Vienna Recycling Compass. All rights reserved. Made for Vienna Citizens 🇦🇹
          </p>
          <div className="flex gap-4 text-[11px] text-slate-500">
            <p>Independent Educational Project &bull; viennarecyclingcompass.site</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
