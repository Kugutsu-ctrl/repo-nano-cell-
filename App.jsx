import React, { useEffect, useState, useRef } from 'react';
import { 
  Check, Mail, Shield, X, LogOut, Home, ShoppingBag, 
  Wrench, User, Search, Bell, Battery, Zap, Smartphone, 
  Cpu, MessageCircle, Image as ImageIcon, LayoutDashboard, 
  TrendingUp, Users, ChevronLeft, ShieldCheck, MapPin, 
  ChevronRight, History, Clock, Star, Plus, Tag, DollarSign, 
  Package, Send, KeyRound, Phone, Camera, UploadCloud, Truck, 
  FileText, Hash, CheckCircle2, AlertCircle, Loader2, Info,
  Receipt, WrenchIcon, PenTool, CheckSquare, FileWarning, Wallet,
  QrCode, Printer, Share2, Palette, Plug, Headset, Store, Lock, Terminal
} from 'lucide-react';

export default function App() {
  // ----------------------------------------------------
  // 1. TOP-LEVEL HOOKS (Mencegah Error React)
  // ----------------------------------------------------
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('home'); 
  const [subPage, setSubPage] = useState(null); 
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '' });
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  // STATE UNTUK AUTO-GENERATE ID REALTIME
  const [currentDraftResi, setCurrentDraftResi] = useState('');

  const [products, setProducts] = useState([
    { id: 1, name: 'Baterai Ori Samsung S22', category: 'Sparepart', price: 299000, originalPrice: 350000, rating: 4.9, sold: '1rb+', isPromo: true },
    { id: 2, name: 'LCD iPhone 11 Pro Max', category: 'Sparepart', price: 1250000, originalPrice: 1500000, rating: 4.8, sold: '500+', isPromo: true },
    { id: 3, name: 'Adaptor Charger 20W', category: 'Aksesoris', price: 150000, originalPrice: 0, rating: 5.0, sold: '2rb+', isPromo: false },
    { id: 4, name: 'Kabel Data Type-C 5A', category: 'Aksesoris', price: 45000, originalPrice: 0, rating: 4.7, sold: '5rb+', isPromo: false },
  ]);

  const [serviceOrders, setServiceOrders] = useState([
    { 
      resi: 'INV-NANO-001', 
      type: 'LCD',
      wa: '085715053337', 
      customerName: 'Ahmad Pengguna',
      address: 'Jl. Raya Tajur No. 15, Bogor',
      brand: 'Samsung',
      model: 'S22 Ultra',
      imei: '358912345678901',
      color: 'Phantom Black',
      issue: 'LCD Pecah, Touch Error',
      status: 'Sedang dikerjakan', 
      date: '10 Mei 2026',
      techNotes: ['Frame bengkok'],
      cost: { lcd: 2500000, jasa: 150000, total: 2650000 },
      warranty: 'Berlaku 30 Hari (Syarat & Ketentuan Berlaku)',
      lcdType: 'Original',
      timeline: [
        { status: 'Masuk', time: '10 Mei, 09:00', desc: 'Perangkat diterima & didata.', done: true },
        { status: 'Pengecekan', time: '10 Mei, 09:30', desc: 'Diagnosa teknisi selesai.', done: true },
        { status: 'Menunggu sparepart', time: '', desc: 'Sparepart tersedia.', done: true, skipped: true },
        { status: 'Sedang dikerjakan', time: '10 Mei, 10:15', desc: 'Proses penggantian LCD.', done: true, active: true },
        { status: 'QC', time: '', desc: 'Testing menyeluruh.', done: false },
        { status: 'Selesai', time: '', desc: 'Siap diambil / dikirim.', done: false }
      ],
      images: { front: null, back: null, damage: null }
    }
  ]);

  const [messages, setMessages] = useState([
    { id: 1, text: 'Halo kak! Layanan Nano Cell siap membantu. Ada yang bisa kami bantu perihal kerusakan HP-nya?', sender: 'tech', time: '14:02' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef(null);

  const [searchResi, setSearchResi] = useState('INV-NANO-001'); 
  const [searchWa, setSearchWa] = useState('085715053337'); 
  const [trackedOrder, setTrackedOrder] = useState(null);
  const [isTracking, setIsTracking] = useState(false);

  // States untuk Auth
  const [loginStep, setLoginStep] = useState(1); 
  const [loginPhone, setLoginPhone] = useState('');
  const [loginOtp, setLoginOtp] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [rememberMe, setRememberMe] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const otpInputRef = useRef(null);

  // States untuk Overlay LCD Form
  const [lcdIsSubmitting, setLcdIsSubmitting] = useState(false);
  const [lcdShowTicket, setLcdShowTicket] = useState(null);
  const [lcdForm, setLcdForm] = useState({
    customerName: '', wa: '', address: '', brand: 'Samsung', model: '', 
    imei: '', color: '', issues: [], conditions: [], 
    priceLcd: '', priceJasa: '', notes: ''
  });
  const [lcdFormImages, setLcdFormImages] = useState({ front: null, back: null, damage: null });

  // States untuk Overlay FRP Form (Software/Unlock)
  const [frpIsSubmitting, setFrpIsSubmitting] = useState(false);
  const [frpShowTicket, setFrpShowTicket] = useState(null);
  const [frpForm, setFrpForm] = useState({
    customerName: '', wa: '', brand: 'Samsung', model: '', 
    androidVer: '', chipset: '', imei: '', sn: '',
    deviceStatus: ['FRP Aktif'], workMethod: [], 
    priceJasa: '', estimatedTime: '', notes: ''
  });
  const [frpFormImages, setFrpFormImages] = useState({ device: null, back: null, screen: null });

  // States untuk Delivery Overlay
  const [isDeliverySubmitting, setIsDeliverySubmitting] = useState(false);
  const [deliveryForm, setDeliveryForm] = useState({
    name: '', wa: '', address: '', brand: '', model: '', imei: '', issue: '', shippingOption: 'Jemput Kurir Nano Cell', notes: ''
  });

  // State untuk Admin Dashboard
  const [adminTab, setAdminTab] = useState('dashboard');

  // ----------------------------------------------------
  // 2. EFFECTS
  // ----------------------------------------------------
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, subPage]);

  useEffect(() => {
    let timer;
    if (countdown > 0) timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  useEffect(() => {
    if (loginStep === 2) setTimeout(() => { otpInputRef.current?.focus(); }, 300);
  }, [loginStep]);

  useEffect(() => {
    if (user && user.role !== 'guest') {
      if (!lcdForm.customerName) setLcdForm(prev => ({...prev, customerName: user.displayName}));
      if (!frpForm.customerName) setFrpForm(prev => ({...prev, customerName: user.displayName}));
      if (!deliveryForm.name) setDeliveryForm(prev => ({...prev, name: user.displayName}));
    }
  }, [user]);

  // ----------------------------------------------------
  // 3. UTILS & HANDLERS
  // ----------------------------------------------------
  
  // Fungsi Cerdas Auto-Generate ID ke dalam Formulir
  const openSubPage = (page) => {
    const isAdmin = user?.role === 'admin';
    if (page === 'form_lcd') {
      setCurrentDraftResi(`${isAdmin ? 'INV' : 'REQ'}-NANO-${Math.floor(1000 + Math.random() * 9000)}`);
    } else if (page === 'form_frp') {
      setCurrentDraftResi(`${isAdmin ? 'INV-FRP' : 'REQ-FRP'}-${Math.floor(1000 + Math.random() * 9000)}`);
    } else if (page === 'delivery') {
      setCurrentDraftResi(`NANO-${Math.floor(100000 + Math.random() * 900000)}`);
    } else {
      setCurrentDraftResi('');
    }
    setSubPage(page);
  };

  const formatRp = (angka) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
  };

  const handleFormatPhone = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.startsWith('0')) val = val.substring(1);
    if (val.startsWith('62')) val = val.substring(2);
    setLoginPhone(val);
  };

  const handleRequestOTP = (e) => {
    e.preventDefault();
    if (loginPhone.length < 9) {
      setModal({ isOpen: true, title: 'Nomor Tidak Valid', message: 'Silakan masukkan nomor WhatsApp yang valid.' });
      return;
    }
    setIsAuthenticating(true);
    setTimeout(() => {
      setIsAuthenticating(false);
      setCountdown(60); 
      setLoginStep(2);
    }, 1200);
  };

  const handleVerifyOTP = (e) => {
    e.preventDefault();
    if (loginOtp.length !== 6) return;
    setIsAuthenticating(true);
    const isAdmin = loginPhone.endsWith('000') || loginPhone === '85715053337'; 
    
    setTimeout(() => {
      if (loginOtp === '123456') {
        setUser({
          displayName: isAdmin ? 'Administrator' : 'Customer Nano Cell',
          email: isAdmin ? 'admin@nanocell.com' : `+62${loginPhone}@user.nanocell`,
          photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          role: isAdmin ? 'admin' : 'member'
        });
      } else {
        setModal({ isOpen: true, title: 'OTP Salah', message: 'Kode OTP yang Anda masukkan salah. (Gunakan: 123456)' });
      }
      setIsAuthenticating(false);
    }, 1500);
  };

  const handleGoogleLogin = () => {
    setIsAuthenticating(true);
    setTimeout(() => {
      setUser({
        displayName: 'Google User (Admin)',
        email: 'admin@nanocell.com',
        photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        role: 'admin' 
      });
      setIsAuthenticating(false);
    }, 1500);
  };

  const handleGuestLogin = () => {
    setIsAuthenticating(true);
    setTimeout(() => {
      setUser({ displayName: 'Tamu', email: 'guest@nanocell', photoURL: '', role: 'guest' });
      setIsAuthenticating(false);
    }, 1000);
  };

  const handleLogout = () => {
    setUser(null); setLoginStep(1); setLoginPhone(''); setLoginOtp(''); setCountdown(0); setActiveTab('home'); setSubPage(null);
  };

  // ----------------------------------------------------
  // 4. TAB RENDERS
  // ----------------------------------------------------
  const renderHomeTab = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-blue-400 text-xs font-medium uppercase tracking-wider mb-1">Selamat Datang</p>
          <h2 className="text-2xl font-bold text-white line-clamp-1">{user?.displayName || 'Pengguna'}</h2>
        </div>
        <div className="relative bg-white/10 p-2 rounded-full border border-white/10 backdrop-blur-md">
          <Bell size={20} className="text-white" />
          <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#000814]"></span>
        </div>
      </div>

      <div className="relative w-full h-40 rounded-3xl overflow-hidden mb-8 shadow-lg border border-white/5">
        <img src="https://i.ibb.co.com/bMf9TMm2/file-0000000057fc71f885c2f242e1bcd0a5.png" alt="Promo" className="w-full h-full object-cover" />
      </div>

      <h3 className="text-white font-semibold mb-4 text-lg">Kategori Layanan</h3>
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { icon: <Smartphone size={26} strokeWidth={1.5} className="text-white drop-shadow-md" />, color: 'from-blue-500 to-blue-400', label: 'Ganti LCD', onClick: () => openSubPage('form_lcd') },
          { icon: <Plug size={26} strokeWidth={1.5} className="text-white drop-shadow-md" />, color: 'from-purple-500 to-purple-400', label: 'Aksesoris', onClick: () => { setActiveTab('products'); setSelectedCategory('Aksesoris'); } },
          { icon: <ShieldCheck size={26} strokeWidth={1.5} className="text-white drop-shadow-md" />, color: 'from-cyan-500 to-cyan-400', label: 'Unlock FRP', onClick: () => openSubPage('form_frp') },
          { icon: <Truck size={26} strokeWidth={1.5} className="text-white drop-shadow-md" />, color: 'from-emerald-500 to-emerald-400', label: 'Kirim HP', onClick: () => openSubPage('delivery') },
          { icon: <Headset size={26} strokeWidth={1.5} className="text-white drop-shadow-md" />, color: 'from-indigo-500 to-indigo-400', label: 'Konsultasi', onClick: () => openSubPage('chat') },
          { icon: <Store size={26} strokeWidth={1.5} className="text-white drop-shadow-md" />, color: 'from-amber-500 to-amber-400', label: 'Lokasi Kami', onClick: () => openSubPage('location') },
        ].map((cat, i) => (
          <div key={i} onClick={cat.onClick} className="flex flex-col items-center gap-2.5 cursor-pointer active:scale-95 transition-transform group">
            <div className={`w-[60px] h-[60px] rounded-[20px] bg-gradient-to-br ${cat.color} flex items-center justify-center shadow-lg transition-all duration-300 group-hover:brightness-110`}>
               {cat.icon}
            </div>
            <span className="text-[11px] text-white/80 font-medium text-center leading-tight tracking-wide">{cat.label}</span>
          </div>
        ))}
      </div>

      <h3 className="text-white font-semibold mb-4 text-lg">Tracking Servis Aktif</h3>
      <div onClick={() => setActiveTab('service')} className="bg-[#0a192f] border border-blue-500/30 rounded-3xl p-5 shadow-[0_10px_30px_rgba(21,101,192,0.15)] relative overflow-hidden cursor-pointer active:scale-95 transition-transform">
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl"></div>
        <div className="flex justify-between items-center mb-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#1565c0]/20 rounded-xl text-blue-400 border border-[#1565c0]/30">
              <Wrench size={20} />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Samsung S22 Ultra</h4>
              <p className="text-white/50 text-xs">INV-NANO-001</p>
            </div>
          </div>
          <span className="px-3 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
            <Loader2 size={10} className="animate-spin" /> Proses
          </span>
        </div>
        <div className="w-full bg-black/40 rounded-full h-2 mb-2 relative z-10 border border-white/5">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-400 h-2 rounded-full w-[60%] shadow-[0_0_10px_#1565c0]"></div>
        </div>
        <div className="flex justify-between items-center text-[10px] text-white/50 relative z-10">
          <span>Tahap 4 dari 6</span>
          <span>Sedang dikerjakan</span>
        </div>
      </div>
    </div>
  );

  const renderProductsTab = () => {
    const filteredProducts = selectedCategory === 'Semua' ? products : products.filter(p => p.category === selectedCategory);
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
        <div className="sticky top-0 z-20 bg-[#000814]/95 backdrop-blur-xl pt-2 pb-4 -mx-6 px-6 border-b border-white/5">
          <h2 className="text-2xl font-bold text-white mb-4">Marketplace</h2>
          <div className="bg-white/5 border border-white/10 rounded-2xl flex items-center px-4 py-3 shadow-inner focus-within:border-blue-500/50 transition-colors">
            <Search size={18} className="text-white/40" />
            <input type="text" placeholder="Cari suku cadang..." className="bg-transparent border-none outline-none text-white text-sm w-full ml-3 placeholder:text-white/30" />
          </div>
          <div className="flex gap-2 mt-4 overflow-x-auto no-scrollbar pb-1">
            {['Semua', 'Sparepart', 'Aksesoris'].map((tab, i) => (
              <button key={i} onClick={() => setSelectedCategory(tab)} className={`px-5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${selectedCategory === tab ? 'bg-[#1565c0] text-white shadow-md' : 'bg-white/5 text-white/50 border border-white/10'}`}>
                {tab}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-6">
          {filteredProducts.length === 0 && <p className="col-span-2 text-center text-white/40 text-sm mt-10">Produk tidak ditemukan.</p>}
          {filteredProducts.map((item) => (
            <div key={item.id} onClick={() => setModal({isOpen: true, title: item.name, message: 'Fungsionalitas keranjang belanja akan segera hadir.'})} className="bg-[#0a192f] border border-white/10 rounded-3xl p-3 backdrop-blur-md relative overflow-hidden group cursor-pointer active:scale-95 transition-transform shadow-sm">
              {item.isPromo && <div className="absolute top-2 left-2 z-10 px-2 py-0.5 bg-red-600 rounded-lg text-[9px] font-bold text-white shadow-sm">PROMO</div>}
              <div className="w-full h-32 bg-[#000814] border border-white/5 rounded-2xl mb-3 flex items-center justify-center relative overflow-hidden">
                <ImageIcon size={30} className="text-white/20" />
              </div>
              <p className="text-[9px] text-blue-400 font-medium uppercase tracking-wider mb-0.5">{item.category}</p>
              <h4 className="text-white text-sm font-semibold mb-1 line-clamp-1">{item.name}</h4>
              <div className="flex items-center gap-1 mb-2">
                <Star size={10} className="text-yellow-400 fill-yellow-400" />
                <span className="text-[10px] text-white/60">{item.rating} | Terjual {item.sold}</span>
              </div>
              <div className="flex justify-between items-end mt-3">
                <div>
                  {item.originalPrice > 0 && <span className="text-[10px] text-white/40 line-through block">{formatRp(item.originalPrice)}</span>}
                  <span className="text-blue-400 font-bold text-sm">{formatRp(item.price)}</span>
                </div>
                <button className="w-8 h-8 rounded-full bg-[#1565c0] flex items-center justify-center text-white shadow-md"><ShoppingBag size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderServiceTab = () => {
    const handleTrack = (e) => {
      e.preventDefault();
      setIsTracking(true);
      setTimeout(() => {
        const found = serviceOrders.find(o => o.resi === searchResi && o.wa === searchWa);
        setTrackedOrder(found || 'NOT_FOUND');
        setIsTracking(false);
      }, 1000);
    };

    const showWarrantyPolicy = () => {
      setModal({ isOpen: true, title: 'Kebijakan Garansi', message: 'SYARAT KLAIM GARANSI:\n• Nota/Invoice asli tidak hilang.\n• Segel garansi utuh.\n• Kerusakan bukan karena human error (jatuh, kena air).\n• Untuk FRP/Software, garansi berlaku jika bootloop kembali karena sistem (bukan update mandiri OTA/Root).' });
    };

    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
        <h2 className="text-2xl font-bold text-white mb-6">Tracking Realtime</h2>
        
        <div className="bg-[#0a192f] border border-[#1565c0]/20 rounded-3xl p-6 shadow-lg mb-8 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl"></div>
          <h3 className="text-white font-semibold text-sm mb-4 relative z-10">Lacak Perangkat Anda</h3>
          <form onSubmit={handleTrack} className="space-y-4 relative z-10">
            <div className="bg-black/40 border border-white/10 rounded-xl py-3 px-4 flex items-center focus-within:border-[#1565c0] transition-colors">
              <Receipt size={18} className="text-white/40 mr-3" />
              <input type="text" placeholder="No Invoice/Tiket (Cth: INV-NANO-001)" required value={searchResi} onChange={e=>setSearchResi(e.target.value.toUpperCase())} className="bg-transparent border-none outline-none text-white text-sm w-full placeholder:text-white/30 uppercase" />
            </div>
            <div className="bg-black/40 border border-white/10 rounded-xl py-3 px-4 flex items-center focus-within:border-[#1565c0] transition-colors">
              <Phone size={18} className="text-white/40 mr-3" />
              <input type="tel" placeholder="Nomor WhatsApp" required value={searchWa} onChange={e=>setSearchWa(e.target.value)} className="bg-transparent border-none outline-none text-white text-sm w-full placeholder:text-white/30" />
            </div>
            <button type="submit" disabled={isTracking} className="w-full bg-gradient-to-r from-[#1565c0] to-blue-700 hover:brightness-110 py-3.5 rounded-xl text-white font-bold shadow-md active:scale-[0.98] transition-all flex justify-center items-center">
              {isTracking ? <Loader2 size={18} className="animate-spin" /> : 'Lacak Status Service'}
            </button>
          </form>
        </div>

        {trackedOrder === 'NOT_FOUND' && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5 flex flex-col items-center justify-center text-center animate-in zoom-in duration-300">
            <AlertCircle size={32} className="text-red-400 mb-2" />
            <h4 className="text-white font-semibold mb-1">Data Tidak Ditemukan</h4>
            <p className="text-white/60 text-xs">Pastikan Nomor Tiket dan Nomor WhatsApp yang Anda masukkan sesuai.</p>
          </div>
        )}

        {trackedOrder && trackedOrder !== 'NOT_FOUND' && (
          <div className="animate-in slide-in-from-bottom-8 duration-500 space-y-6">
            <div className={`bg-gradient-to-br ${trackedOrder.type === 'FRP' ? 'from-[#001122] to-cyan-950/20 border-cyan-500/40' : 'from-[#0a192f] to-[#000814] border-[#1565c0]/40'} border rounded-3xl p-6 shadow-2xl relative overflow-hidden`}>
              <div className={`absolute top-0 right-0 px-4 py-1.5 ${trackedOrder.type === 'FRP' ? 'bg-cyan-600' : 'bg-[#1565c0]'} rounded-bl-2xl text-[10px] font-bold text-white tracking-wider`}>
                {trackedOrder.resi}
              </div>
              <div className="flex items-center gap-4 mb-5 mt-2">
                <div className={`w-14 h-14 rounded-2xl bg-black/50 border border-white/10 flex items-center justify-center shadow-inner ${trackedOrder.type === 'FRP' ? 'text-cyan-400' : 'text-blue-400'}`}>
                  {trackedOrder.type === 'FRP' ? <Terminal size={28} /> : <Smartphone size={28} />}
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">{trackedOrder.brand} {trackedOrder.model}</h3>
                  <p className="text-white/60 text-xs">{trackedOrder.customerName} • {trackedOrder.wa}</p>
                </div>
              </div>

              <div className={`bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-5`}>
                <p className="text-red-400 text-[10px] font-semibold mb-1 flex items-center gap-1"><FileWarning size={12}/> {trackedOrder.type === 'FRP' ? 'Kasus Software:' : 'Kerusakan Terdaftar:'}</p>
                <p className="text-white text-sm font-medium">{trackedOrder.issue}</p>
              </div>

              {trackedOrder.cost && (
                <div className="bg-black/30 rounded-2xl p-4 border border-white/5 mb-6">
                   <h4 className={`text-white text-sm font-semibold mb-3 flex items-center gap-2`}><Wallet size={16} className={trackedOrder.type === 'FRP' ? 'text-cyan-400' : 'text-green-400'}/> Rincian Biaya</h4>
                   <div className="space-y-2 text-xs">
                      {trackedOrder.type === 'LCD' && <div className="flex justify-between text-white/70"><span>Harga Sparepart (LCD)</span><span>{formatRp(trackedOrder.cost.lcd)}</span></div>}
                      <div className="flex justify-between text-white/70"><span>Biaya Jasa Eksekusi</span><span>{formatRp(trackedOrder.cost.jasa)}</span></div>
                      <div className="h-[1px] w-full bg-white/10 my-2"></div>
                      <div className="flex justify-between text-white font-bold text-sm"><span>Total Biaya</span><span className={trackedOrder.type === 'FRP' ? 'text-cyan-400' : 'text-blue-400'}>{formatRp(trackedOrder.cost.total)}</span></div>
                   </div>
                </div>
              )}

              <h4 className={`text-white text-sm font-semibold mb-4 flex items-center gap-2`}><CheckSquare size={16} className={trackedOrder.type === 'FRP' ? 'text-cyan-400' : 'text-[#1565c0]'}/> Progress {trackedOrder.type === 'FRP' ? 'Unlock/Flash' : 'Service'}</h4>
              <div className={`relative pl-5 border-l-2 ${trackedOrder.type === 'FRP' ? 'border-cyan-500/30' : 'border-[#1565c0]/30'} space-y-6 mb-6`}>
                {trackedOrder.timeline.map((step, idx) => {
                  if(step.skipped) return null; 
                  return (
                  <div key={idx} className="relative">
                    {step.done ? (
                      <div className={`absolute -left-[29px] top-0.5 w-4 h-4 rounded-full flex items-center justify-center ${step.active ? (trackedOrder.type === 'FRP' ? 'bg-cyan-500 shadow-[0_0_12px_#06b6d4]' : 'bg-[#1565c0] shadow-[0_0_12px_#1565c0]') : 'bg-green-500'}`}>
                        {step.active ? <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> : <Check size={10} className="text-[#000814]" strokeWidth={4} />}
                      </div>
                    ) : (
                      <div className="absolute -left-[25px] top-1.5 w-2 h-2 rounded-full bg-white/20"></div>
                    )}
                    <h4 className={`text-sm font-semibold ${step.done ? 'text-white' : 'text-white/40'}`}>{step.status}</h4>
                    <p className={`text-xs mt-1 leading-relaxed ${step.active ? 'text-white/80' : 'text-white/40'}`}>{step.desc}</p>
                    {step.time && <p className={`text-[10px] mt-1.5 font-medium ${step.active ? (trackedOrder.type==='FRP'?'text-cyan-400':'text-blue-400') : 'text-white/30'}`}>{step.time}</p>}
                  </div>
                )})}
              </div>

              {trackedOrder.techNotes && trackedOrder.techNotes.length > 0 && (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-4">
                  <p className="text-amber-400 text-xs font-semibold mb-2 flex items-center gap-1.5"><PenTool size={14}/> Catatan Teknisi:</p>
                  <ul className="list-disc pl-4 space-y-1 text-white/80 text-xs">
                    {trackedOrder.techNotes.map((note, i) => (<li key={i}>{note}</li>))}
                  </ul>
                </div>
              )}

              {trackedOrder.cost && (
                <div onClick={showWarrantyPolicy} className={`flex items-center justify-between p-3 ${trackedOrder.type==='FRP'?'bg-cyan-500/10 border-cyan-500/20 hover:bg-cyan-500/20':'bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/20'} border rounded-xl cursor-pointer transition-colors`}>
                   <div className="flex items-center gap-2"><ShieldCheck size={18} className={trackedOrder.type==='FRP'?'text-cyan-400':'text-blue-400'} /><div><p className="text-white text-xs font-semibold">Status Garansi</p><p className={trackedOrder.type==='FRP'?'text-cyan-200 text-[10px]':'text-blue-200 text-[10px]'}>{trackedOrder.warranty}</p></div></div>
                   <ChevronRight size={16} className={trackedOrder.type==='FRP'?'text-cyan-400/50':'text-blue-400/50'} />
                </div>
              )}
            </div>
            <div className="flex gap-4">
              <button onClick={() => openSubPage('chat')} className="flex-1 bg-white/5 border border-white/10 py-3.5 rounded-2xl text-white text-sm font-semibold flex justify-center items-center gap-2 hover:bg-white/10 transition-colors shadow-sm">
                <MessageCircle size={18} /> Tanya Teknisi
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderProfileTab = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <div className="relative -mx-6 -mt-10 mb-20">
        <div className="h-40 bg-gradient-to-br from-[#0a192f] to-[#000814] border-b border-white/10 relative overflow-hidden"></div>
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center">
          <div className="relative w-24 h-24 rounded-full p-1 bg-[#1565c0] mb-2 shadow-lg">
            <img src={user?.photoURL || ''} alt="Profile" className="w-full h-full rounded-full object-cover border-2 border-[#000814]" />
            <div className="absolute bottom-0 right-0 bg-[#1565c0] text-white p-1 rounded-full border-2 border-[#000814]">
              <ShieldCheck size={12} />
            </div>
          </div>
          <h2 className="text-xl font-bold text-white">{user?.displayName || 'Pengguna'}</h2>
          <p className="text-blue-400 text-xs font-medium">{user?.role === 'admin' ? 'Administrator' : user?.role === 'guest' ? 'Akun Tamu' : 'Premium Member'}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Servis', val: user?.role === 'guest' ? '0' : '1' },
          { label: 'Pesanan', val: '0' },
          { label: 'Poin', val: user?.role === 'guest' ? '0' : '120' },
        ].map((s, i) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
            <h4 className="text-white text-xl font-bold mb-1">{s.val}</h4>
            <p className="text-white/50 text-[10px] uppercase tracking-wider">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#0a192f] border border-white/5 rounded-3xl overflow-hidden shadow-sm">
        <MenuListItem icon={<User size={18}/>} label="Edit Profil" onClick={() => setModal({isOpen: true, title: 'Edit Profil', message: 'Fitur pengaturan profil sedang disempurnakan.'})} />
        <MenuListItem icon={<History size={18}/>} label="Riwayat Tiket & Servis" onClick={() => setActiveTab('service')} />
        
        {user?.role === 'admin' && (
          <MenuListItem icon={<LayoutDashboard size={18}/>} label="Admin Dashboard" onClick={() => openSubPage('admin')} color="text-blue-400" />
        )}
        
        <div className="h-[1px] bg-white/5 my-1"></div>
        <div onClick={handleLogout} className="flex items-center justify-between p-4 hover:bg-red-500/10 cursor-pointer transition-colors">
          <div className="flex items-center gap-3 text-red-400">
            <LogOut size={18} />
            <span className="font-semibold text-sm">Keluar Akun</span>
          </div>
        </div>
      </div>
    </div>
  );

  const MenuListItem = ({ icon, label, onClick, color="text-white/70" }) => (
    <div onClick={onClick} className="flex items-center justify-between p-4 border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors">
      <div className={`flex items-center gap-3 ${color}`}>
        {icon}
        <span className="font-medium text-sm">{label}</span>
      </div>
      <ChevronRight size={18} className="text-white/30" />
    </div>
  );

  // ----------------------------------------------------
  // 5. OVERLAYS (SUB PAGES)
  // ----------------------------------------------------

  // 🔥 OVERLAY FRP FORM (TEKNISI SOFTWARE)
  const renderFrpFormOverlay = () => {
    const isAdmin = user?.role === 'admin';
    const statusList = ['FRP Aktif', 'Bootloop', 'Fastboot', 'Recovery', 'Mati Total', 'Pola/Sandi', 'Mi Cloud', 'iCloud'];
    const methodList = ['EDL Mode', 'Test Point', 'Fastboot Mode', 'Odin Flash', 'SP Flash Tool', 'Direct eMMC/UFS', 'Server Auth', 'Bypass Senam Jari'];

    const toggleArrayItem = (arrayName, item) => {
      setFrpForm(prev => ({
        ...prev,
        [arrayName]: prev[arrayName].includes(item) ? prev[arrayName].filter(i => i !== item) : [...prev[arrayName], item]
      }));
    };

    const handleImageUpload = (e, type) => {
      const file = e.target.files[0];
      if (file) setFrpFormImages(prev => ({...prev, [type]: URL.createObjectURL(file)}));
    };

    const handleSubmitFrpForm = (e) => {
      e.preventDefault();
      if (frpForm.deviceStatus.length === 0) {
        setModal({isOpen: true, title:'Data Belum Lengkap', message:'Silakan pilih minimal 1 Status Device.'});
        return;
      }
      setFrpIsSubmitting(true);
      
      setTimeout(() => {
        const newResi = currentDraftResi;
        const timeNow = new Date().toLocaleTimeString('id-ID', {hour:'2-digit', minute:'2-digit'});

        const newOrder = {
          resi: newResi,
          type: 'FRP',
          wa: frpForm.wa,
          customerName: frpForm.customerName,
          brand: frpForm.brand,
          model: frpForm.model,
          imei: frpForm.imei,
          issue: frpForm.deviceStatus.join(', '),
          status: isAdmin ? 'Proses Eksekusi' : 'Antrean Masuk',
          date: new Date().toLocaleDateString('id-ID', {day:'numeric', month:'short', year:'numeric'}),
          techNotes: isAdmin ? [`Chipset: ${frpForm.chipset}`, `Metode: ${frpForm.workMethod.join(', ')}`, frpForm.notes] : [],
          cost: isAdmin ? { jasa: parseInt(frpForm.priceJasa||0), total: parseInt(frpForm.priceJasa||0) } : null,
          warranty: 'Garansi 7 Hari (Software Only)',
          timeline: [
            { status: isAdmin ? 'Antrean Masuk' : 'Tiket Dibuat', time: timeNow, desc: 'Perangkat masuk antrean software.', done: true, active: !isAdmin },
            { status: 'Proses Eksekusi', time: isAdmin ? timeNow : '', desc: 'Sedang dilakukan flashing/bypass/unlock.', done: isAdmin, active: isAdmin },
            { status: 'Testing (QC)', time: '', desc: 'Pengecekan fungsi & jaringan setelah unlock.', done: false },
            { status: 'Selesai', time: '', desc: 'Perangkat siap digunakan.', done: false }
          ],
          images: frpFormImages
        };

        setServiceOrders([newOrder, ...serviceOrders]);
        setFrpIsSubmitting(false);
        setFrpShowTicket(newOrder); 
      }, 1500);
    };

    const closeInvoice = () => {
      setFrpShowTicket(null);
      setSubPage(null);
      if(!isAdmin) setActiveTab('service');
    };

    if (frpShowTicket) {
      return (
        <div className="fixed inset-0 z-[60] flex flex-col justify-center items-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in zoom-in-95 duration-300">
          <div className="bg-[#000d1a] border border-cyan-500/30 w-full max-w-sm rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(6,182,212,0.2)] flex flex-col max-h-[90vh]">
            <div className="bg-gradient-to-br from-[#001f3f] to-cyan-950 p-6 text-center relative border-b border-cyan-500/20">
              {isAdmin && <div className="absolute top-4 right-4 cursor-pointer" onClick={closeInvoice}><X size={20} className="text-cyan-400 hover:text-white" /></div>}
              <div className="w-12 h-12 bg-black rounded-xl mx-auto flex items-center justify-center mb-3 border border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                 <Terminal size={24} className="text-cyan-400" />
              </div>
              <h2 className="text-white font-bold text-lg mb-1">{isAdmin ? 'Invoice Software' : 'Tiket Antrean Software'}</h2>
              <p className="text-cyan-200 text-xs">Nano Cell Tech Dept.</p>
            </div>

            <div className="p-6 flex-1 overflow-y-auto bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] bg-blend-overlay">
              <div className="flex justify-between items-end mb-6 pb-4 border-b border-cyan-500/20 border-dashed">
                <div>
                   <p className="text-cyan-500/70 text-[10px] uppercase font-bold tracking-widest">No. {isAdmin ? 'Invoice' : 'Tiket'}</p>
                   <p className="text-cyan-50 font-bold text-sm tracking-wider">{frpShowTicket.resi}</p>
                </div>
                <div className="text-right">
                   <p className="text-cyan-500/70 text-[10px] uppercase font-bold tracking-widest">Tanggal</p>
                   <p className="text-cyan-50 text-xs">{frpShowTicket.date}</p>
                </div>
              </div>

              <div className="mb-6 space-y-3">
                <div className="flex justify-between"><span className="text-cyan-100/60 text-xs">Pelanggan</span><span className="text-cyan-50 text-xs font-semibold">{frpShowTicket.customerName}</span></div>
                <div className="flex justify-between"><span className="text-cyan-100/60 text-xs">WhatsApp</span><span className="text-cyan-50 text-xs font-semibold">{frpShowTicket.wa}</span></div>
                <div className="flex justify-between"><span className="text-cyan-100/60 text-xs">Perangkat</span><span className="text-cyan-50 text-xs font-semibold">{frpShowTicket.brand} {frpShowTicket.model}</span></div>
              </div>

              <div className="bg-cyan-950/30 rounded-xl p-4 border border-cyan-500/20 mb-6">
                <p className="text-cyan-500/70 text-[10px] uppercase font-bold mb-2 tracking-widest">Status Terdata</p>
                <p className="text-cyan-50 text-xs leading-relaxed font-mono">{frpShowTicket.issue}</p>
              </div>

              {isAdmin ? (
                <div className="flex justify-between items-center mb-6 border-t border-cyan-500/20 pt-4">
                   <span className="text-cyan-50 font-bold">Biaya Service</span>
                   <span className="text-cyan-400 font-bold text-xl">{formatRp(frpShowTicket.cost.total)}</span>
                </div>
              ) : (
                <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-3 mb-6 text-center">
                  <p className="text-cyan-300 text-[10px] font-semibold">Tunjukkan tiket ini kepada teknisi software untuk pengecekan harga & eksekusi.</p>
                </div>
              )}

              <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl shadow-[0_0_20px_rgba(6,182,212,0.3)] mx-auto w-32 border-2 border-cyan-500">
                 <QrCode size={64} className="text-black mb-1" strokeWidth={1.5} />
                 <p className="text-black/70 text-[8px] font-extrabold tracking-[0.2em] uppercase">Scan Lacak</p>
              </div>
            </div>

            <div className="p-4 bg-[#000814] grid grid-cols-2 gap-3 border-t border-cyan-500/20">
              {isAdmin ? (
                 <>
                   <button className="flex items-center justify-center gap-2 bg-cyan-950/50 hover:bg-cyan-900 border border-cyan-500/30 py-3 rounded-xl text-cyan-400 text-xs font-semibold transition-colors"><Printer size={16} /> Print</button>
                   <a href={`https://wa.me/62${frpShowTicket.wa}?text=Halo%20${frpShowTicket.customerName},%20berikut%20nota%20service%20software%20anda:%20${frpShowTicket.resi}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 bg-cyan-600 hover:brightness-110 py-3 rounded-xl text-white text-xs font-bold shadow-[0_0_10px_rgba(6,182,212,0.4)] transition-all"><Share2 size={16} /> Kirim WA</a>
                 </>
              ) : (
                 <>
                   <button onClick={closeInvoice} className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 py-3 rounded-xl text-white text-xs font-semibold transition-colors border border-white/10">Tutup</button>
                   <button onClick={closeInvoice} className="flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-500 py-3 rounded-xl text-white text-xs font-bold shadow-[0_0_10px_rgba(6,182,212,0.4)]"><Search size={16} /> Lacak Tiket</button>
                 </>
              )}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="fixed inset-0 bg-[#000814] z-50 flex flex-col animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between p-5 border-b border-cyan-900/50 bg-[#000d1a] shadow-md z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => setSubPage(null)} className="p-2 rounded-full bg-cyan-950 text-cyan-400 active:scale-90 border border-cyan-900"><ChevronLeft size={20}/></button>
            <div>
              <h2 className="text-xl font-bold text-cyan-50">{isAdmin ? 'Tech: Input FRP/Software' : 'Form Bantuan Software'}</h2>
              <p className="text-[10px] text-cyan-500 tracking-wider font-mono uppercase">{isAdmin ? 'Mode Teknisi Aktif' : 'Layanan Flashing & Unlock'}</p>
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-5 pb-28 no-scrollbar bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] bg-blend-overlay">
          <form id="frpServiceForm" onSubmit={handleSubmitFrpForm} className="space-y-6">
            
            {/* UI AUTO GENERATE ID */}
            <div className="bg-[#001122]/80 backdrop-blur-sm border border-cyan-900/50 rounded-3xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.5)] flex justify-between items-center">
              <div>
                <p className="text-cyan-500/70 text-[10px] uppercase font-bold tracking-wider mb-1">
                  Nomor {isAdmin ? 'Invoice' : 'Tiket'} (Auto Generate)
                </p>
                <h3 className="text-cyan-400 font-bold text-xl tracking-widest font-mono">{currentDraftResi}</h3>
              </div>
              <div className="w-12 h-12 bg-cyan-900/30 border border-cyan-500/30 rounded-full flex items-center justify-center">
                <Hash size={20} className="text-cyan-400" />
              </div>
            </div>

            <div className="bg-[#001122]/80 backdrop-blur-sm border border-cyan-900/50 rounded-3xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
              <h3 className="text-cyan-400 font-semibold text-sm mb-4 border-b border-cyan-900/50 pb-3 flex items-center gap-2 tracking-wide"><User size={16}/> 1. Data Customer</h3>
              <div className="space-y-4">
                <input required type="text" value={frpForm.customerName} onChange={e=>setFrpForm({...frpForm, customerName: e.target.value})} className="bg-black/50 border border-cyan-900/50 rounded-xl px-4 py-3 text-cyan-50 text-sm w-full outline-none focus:border-cyan-400 transition-colors font-mono" placeholder="Nama Pemilik" />
                <input required type="tel" value={frpForm.wa} onChange={e=>setFrpForm({...frpForm, wa: e.target.value})} className="bg-black/50 border border-cyan-900/50 rounded-xl px-4 py-3 text-cyan-50 text-sm w-full outline-none focus:border-cyan-400 transition-colors font-mono" placeholder="Nomor WhatsApp" />
              </div>
            </div>

            <div className="bg-[#001122]/80 backdrop-blur-sm border border-cyan-900/50 rounded-3xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
              <h3 className="text-cyan-400 font-semibold text-sm mb-4 border-b border-cyan-900/50 pb-3 flex items-center gap-2 tracking-wide"><Cpu size={16}/> 2. Identifikasi Perangkat</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-black/50 border border-cyan-900/50 rounded-xl px-3 focus-within:border-cyan-400 transition-colors">
                    <select required value={frpForm.brand} onChange={e=>setFrpForm({...frpForm, brand: e.target.value})} className="bg-transparent border-none outline-none text-cyan-50 text-sm w-full py-3.5 appearance-none font-mono">
                      <option value="Samsung" className="bg-[#001122]">Samsung</option>
                      <option value="Xiaomi" className="bg-[#001122]">Xiaomi / Poco</option>
                      <option value="Oppo" className="bg-[#001122]">Oppo</option>
                      <option value="Vivo" className="bg-[#001122]">Vivo</option>
                      <option value="Realme" className="bg-[#001122]">Realme</option>
                      <option value="Infinix" className="bg-[#001122]">Infinix</option>
                      <option value="Apple" className="bg-[#001122]">Apple</option>
                      <option value="Lainnya" className="bg-[#001122]">Lainnya</option>
                    </select>
                  </div>
                  <input required type="text" value={frpForm.model} onChange={e=>setFrpForm({...frpForm, model: e.target.value})} className="bg-black/50 border border-cyan-900/50 rounded-xl px-4 py-3 text-cyan-50 text-sm w-full outline-none focus:border-cyan-400 transition-colors font-mono uppercase" placeholder="Tipe / Model" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" value={frpForm.androidVer} onChange={e=>setFrpForm({...frpForm, androidVer: e.target.value})} className="bg-black/50 border border-cyan-900/50 rounded-xl px-4 py-3 text-cyan-50 text-sm w-full outline-none focus:border-cyan-400 transition-colors font-mono" placeholder="Android Ver / iOS" />
                  <input type="text" value={frpForm.chipset} onChange={e=>setFrpForm({...frpForm, chipset: e.target.value})} className="bg-black/50 border border-cyan-900/50 rounded-xl px-4 py-3 text-cyan-50 text-sm w-full outline-none focus:border-cyan-400 transition-colors font-mono uppercase" placeholder="Chipset (MTK/QCOM)" />
                </div>
                <input type="text" value={frpForm.imei} onChange={e=>setFrpForm({...frpForm, imei: e.target.value})} className="bg-black/50 border border-cyan-900/50 rounded-xl px-4 py-3 text-cyan-50 text-sm w-full outline-none focus:border-cyan-400 transition-colors font-mono tracking-widest" placeholder="IMEI / SN Device" />
              </div>
            </div>

            <div className="bg-[#001122]/80 backdrop-blur-sm border border-cyan-900/50 rounded-3xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
              <h3 className="text-cyan-400 font-semibold text-sm mb-4 border-b border-cyan-900/50 pb-3 flex items-center gap-2 tracking-wide"><Lock size={16}/> 3. Status Device Saat Ini</h3>
              <div className="flex flex-wrap gap-2">
                {statusList.map(status => (
                  <button type="button" key={status} onClick={() => toggleArrayItem('deviceStatus', status)} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 font-mono uppercase tracking-wider ${frpForm.deviceStatus.includes(status) ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.6)]' : 'bg-black/50 border border-cyan-900/50 text-cyan-600 hover:border-cyan-400'}`}>
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {isAdmin && (
              <>
                <div className="bg-[#001122]/80 backdrop-blur-sm border border-cyan-900/50 rounded-3xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
                  <h3 className="text-cyan-400 font-semibold text-sm mb-4 border-b border-cyan-900/50 pb-3 flex items-center gap-2 tracking-wide"><Terminal size={16}/> 4. Metode Eksekusi (Tech Only)</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {methodList.map(method => (
                      <button type="button" key={method} onClick={() => toggleArrayItem('workMethod', method)} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 font-mono uppercase tracking-wider ${frpForm.workMethod.includes(method) ? 'bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.6)] border-indigo-400' : 'bg-black/50 border border-cyan-900/50 text-indigo-300 hover:border-indigo-400'}`}>
                        {method}
                      </button>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <input type="text" value={frpForm.estimatedTime} onChange={e=>setFrpForm({...frpForm, estimatedTime: e.target.value})} className="bg-black/50 border border-cyan-900/50 rounded-xl px-4 py-3 text-cyan-50 text-sm w-full outline-none focus:border-cyan-400 transition-colors font-mono" placeholder="Estimasi Waktu (ex: 2 Jam)" />
                    <input required type="number" value={frpForm.priceJasa} onChange={e=>setFrpForm({...frpForm, priceJasa: e.target.value})} className="bg-black/50 border border-cyan-900/50 rounded-xl px-4 py-3 text-cyan-400 font-bold text-sm w-full outline-none focus:border-cyan-400 transition-colors font-mono placeholder:text-cyan-800" placeholder="Biaya (Rp)" />
                  </div>
                  <textarea value={frpForm.notes} onChange={e=>setFrpForm({...frpForm, notes: e.target.value})} placeholder="Catatan kendala / risiko software..." className="bg-black/50 border border-cyan-900/50 rounded-xl p-3 text-cyan-50 text-sm w-full h-16 resize-none outline-none focus:border-cyan-400 transition-colors font-mono"></textarea>
                </div>

                <div className="bg-[#001122]/80 backdrop-blur-sm border border-cyan-900/50 rounded-3xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
                  <h3 className="text-cyan-400 font-semibold text-sm mb-4 border-b border-cyan-900/50 pb-3 flex items-center gap-2 tracking-wide"><Camera size={16}/> 5. Dokumentasi Foto</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {[{ key: 'device', label: 'Device/Layar' }, { key: 'back', label: 'Belakang/Imei' }, { key: 'screen', label: 'Layar Terkunci' }].map((imgBox) => (
                      <div key={imgBox.key}>
                        <label className="flex flex-col items-center justify-center w-full h-24 bg-black/50 border border-cyan-900/50 border-dashed rounded-2xl cursor-pointer hover:border-cyan-400 transition-colors overflow-hidden relative">
                          {frpFormImages[imgBox.key] ? <img src={frpFormImages[imgBox.key]} alt="Preview" className="w-full h-full object-cover opacity-80" /> : <><UploadCloud size={20} className="text-cyan-700 mb-1" /><span className="text-[8px] text-cyan-500 font-bold uppercase tracking-widest text-center px-1">{imgBox.label}</span></>}
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, imgBox.key)} />
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </form>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-5 bg-[#000814]/95 backdrop-blur-xl border-t border-cyan-900/50 z-10">
          <button form="frpServiceForm" type="submit" disabled={frpIsSubmitting} className="w-full bg-cyan-600 hover:bg-cyan-500 py-4 rounded-2xl text-[#000814] font-extrabold tracking-widest uppercase shadow-[0_0_20px_rgba(6,182,212,0.4)] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
            {frpIsSubmitting ? <Loader2 size={20} className="animate-spin text-[#000814]" /> : (isAdmin ? 'Simpan Data Teknisi' : 'Buat Request Software')}
          </button>
        </div>
      </div>
    );
  };

  // Overlay LCD Form
  const renderLcdFormOverlay = () => {
    const isAdmin = user?.role === 'admin';
    const issueList = ['LCD Pecah', 'Touch Error', 'Blank Hitam', 'Greenline', 'Shadow', 'Ghost Touch', 'Layar Berkedip', 'Fleksibel Rusak'];
    const conditionList = ['Frame Bengkok', 'Bekas Air', 'Backdoor Retak', 'Mesin Normal', 'Face Unlock Normal', 'Fingerprint Normal'];

    const totalEstimasi = (parseInt(lcdForm.priceLcd||0) + parseInt(lcdForm.priceJasa||0));

    const toggleArrayItem = (arrayName, item) => {
      setLcdForm(prev => ({
        ...prev,
        [arrayName]: prev[arrayName].includes(item) ? prev[arrayName].filter(i => i !== item) : [...prev[arrayName], item]
      }));
    };

    const handleImageUpload = (e, type) => {
      const file = e.target.files[0];
      if (file) setLcdFormImages(prev => ({...prev, [type]: URL.createObjectURL(file)}));
    };

    const handleSubmitLcdForm = (e) => {
      e.preventDefault();
      if (lcdForm.issues.length === 0) {
        setModal({isOpen: true, title:'Data Belum Lengkap', message:'Silakan pilih minimal 1 Kendala / Kerusakan LCD.'});
        return;
      }
      setLcdIsSubmitting(true);
      
      setTimeout(() => {
        const newResi = currentDraftResi;

        const newOrder = {
          resi: newResi,
          type: 'LCD',
          wa: lcdForm.wa,
          customerName: lcdForm.customerName,
          address: lcdForm.address,
          brand: lcdForm.brand,
          model: lcdForm.model,
          imei: lcdForm.imei,
          color: lcdForm.color,
          issue: lcdForm.issues.join(', '),
          status: isAdmin ? 'Sedang dikerjakan' : 'Menunggu Pengecekan',
          date: new Date().toLocaleDateString('id-ID', {day:'numeric', month:'short', year:'numeric'}),
          techNotes: isAdmin ? lcdForm.conditions : [],
          cost: isAdmin ? { lcd: parseInt(lcdForm.priceLcd||0), jasa: parseInt(lcdForm.priceJasa||0), total: totalEstimasi } : null,
          warranty: 'Pending Pengecekan',
          timeline: [
            { status: isAdmin ? 'Masuk' : 'Tiket Dibuat', time: new Date().toLocaleTimeString('id-ID', {hour:'2-digit', minute:'2-digit'}), desc: isAdmin ? 'Perangkat diterima' : 'Request berhasil, menunggu teknisi.', done: true, active: !isAdmin },
            { status: 'Pengecekan', time: isAdmin ? new Date().toLocaleTimeString('id-ID', {hour:'2-digit', minute:'2-digit'}) : '', desc: 'Diagnosa teknisi.', done: isAdmin, active: false },
            { status: 'Menunggu sparepart', time: '', desc: 'Sparepart tersedia.', done: isAdmin, skipped: true },
            { status: 'Sedang dikerjakan', time: isAdmin ? new Date().toLocaleTimeString('id-ID', {hour:'2-digit', minute:'2-digit'}) : '', desc: 'Proses penggantian LCD.', done: isAdmin, active: isAdmin },
            { status: 'QC', time: '', desc: 'Testing menyeluruh.', done: false },
            { status: 'Selesai', time: '', desc: 'Siap diambil.', done: false }
          ],
          images: lcdFormImages
        };

        setServiceOrders([newOrder, ...serviceOrders]);
        setLcdIsSubmitting(false);
        setLcdShowTicket(newOrder); 
      }, 1500);
    };

    const closeInvoice = () => {
      setLcdShowTicket(null);
      setSubPage(null);
      if(!isAdmin) setActiveTab('service');
    };

    if (lcdShowTicket) {
      return (
        <div className="fixed inset-0 z-[60] flex flex-col justify-center items-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in zoom-in-95 duration-300">
          <div className="bg-[#0a192f] w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex flex-col max-h-[90vh]">
            <div className="bg-gradient-to-br from-[#1565c0] to-blue-900 p-6 text-center relative">
              {isAdmin && <div className="absolute top-4 right-4 cursor-pointer" onClick={closeInvoice}><X size={20} className="text-white/50 hover:text-white" /></div>}
              <div className="w-12 h-12 bg-white rounded-xl mx-auto flex items-center justify-center mb-3 shadow-md">
                 {isAdmin ? <Receipt size={28} className="text-[#1565c0]" /> : <Wrench size={28} className="text-[#1565c0]" />}
              </div>
              <h2 className="text-white font-bold text-lg mb-1">{isAdmin ? 'Invoice Service' : 'Tiket Booking Service'}</h2>
              <p className="text-blue-200 text-xs">Nano Cell Repair Center</p>
            </div>

            <div className="p-6 flex-1 overflow-y-auto bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-blend-overlay">
              <div className="flex justify-between items-end mb-6 pb-4 border-b border-white/10 border-dashed">
                <div>
                   <p className="text-white/40 text-[10px] uppercase font-bold">No. {isAdmin ? 'Invoice' : 'Tiket'}</p>
                   <p className="text-white font-bold text-sm tracking-wider">{lcdShowTicket.resi}</p>
                </div>
                <div className="text-right">
                   <p className="text-white/40 text-[10px] uppercase font-bold">Tanggal</p>
                   <p className="text-white text-xs">{lcdShowTicket.date}</p>
                </div>
              </div>

              <div className="mb-6 space-y-3">
                <div className="flex justify-between"><span className="text-white/60 text-xs">Pelanggan</span><span className="text-white text-xs font-semibold">{lcdShowTicket.customerName}</span></div>
                <div className="flex justify-between"><span className="text-white/60 text-xs">WhatsApp</span><span className="text-white text-xs font-semibold">{lcdShowTicket.wa}</span></div>
                <div className="flex justify-between"><span className="text-white/60 text-xs">Perangkat</span><span className="text-white text-xs font-semibold">{lcdShowTicket.brand} {lcdShowTicket.model}</span></div>
              </div>

              <div className="bg-black/30 rounded-xl p-4 border border-white/5 mb-6">
                <p className="text-white/40 text-[10px] uppercase font-bold mb-2">Kerusakan Terdata</p>
                <p className="text-white text-xs leading-relaxed">{lcdShowTicket.issue}</p>
              </div>

              {isAdmin ? (
                <div className="flex justify-between items-center mb-6 border-t border-white/10 pt-4">
                   <span className="text-white font-bold">Total Estimasi</span>
                   <span className="text-green-400 font-bold text-xl">{formatRp(lcdShowTicket.cost.total)}</span>
                </div>
              ) : (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 mb-6 text-center">
                  <p className="text-amber-400 text-[10px] font-semibold">Bawa HP dan tunjukkan tiket ini ke Toko Nano Cell untuk pengecekan harga.</p>
                </div>
              )}

              <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl shadow-inner mx-auto w-32">
                 <QrCode size={64} className="text-black mb-1" strokeWidth={1.5} />
                 <p className="text-black/50 text-[8px] font-bold tracking-widest uppercase">Scan Lacak</p>
              </div>
            </div>

            <div className="p-4 bg-[#000814] grid grid-cols-2 gap-3 border-t border-white/10">
              {isAdmin ? (
                 <>
                   <button className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 py-3 rounded-xl text-white text-xs font-semibold transition-colors"><Printer size={16} /> Print</button>
                   <a href={`https://wa.me/62${lcdShowTicket.wa}?text=Halo%20${lcdShowTicket.customerName},%20berikut%20nota%20anda:%20${lcdShowTicket.resi}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 bg-[#25D366] hover:brightness-110 py-3 rounded-xl text-white text-xs font-semibold shadow-md"><Share2 size={16} /> Kirim WA</a>
                 </>
              ) : (
                 <>
                   <button onClick={closeInvoice} className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 py-3 rounded-xl text-white text-xs font-semibold transition-colors">Tutup</button>
                   <button onClick={closeInvoice} className="flex items-center justify-center gap-2 bg-[#1565c0] hover:bg-blue-700 py-3 rounded-xl text-white text-xs font-semibold shadow-md"><Search size={16} /> Lacak Tiket</button>
                 </>
              )}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="fixed inset-0 bg-[#000814] z-50 flex flex-col animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-[#0a192f] shadow-md z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => setSubPage(null)} className="p-2 rounded-full bg-white/5 text-white active:scale-90"><ChevronLeft size={20}/></button>
            <div>
              <h2 className="text-xl font-bold text-white">{isAdmin ? 'Input Service LCD' : 'Form Ganti LCD'}</h2>
              <p className="text-[10px] text-white/50">{isAdmin ? 'Mode Admin / Kasir' : 'Layanan Service & Penggantian Layar'}</p>
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-5 pb-28 no-scrollbar">
          <form id="lcdServiceForm" onSubmit={handleSubmitLcdForm} className="space-y-6">
            
            {/* UI AUTO GENERATE ID */}
            <div className="bg-[#0a192f] border border-white/5 rounded-3xl p-5 shadow-sm flex justify-between items-center">
              <div>
                <p className="text-white/50 text-[10px] uppercase font-bold tracking-wider mb-1">
                  Nomor {isAdmin ? 'Invoice' : 'Tiket'} (Auto Generate)
                </p>
                <h3 className="text-white font-bold text-xl tracking-widest text-[#1565c0]">{currentDraftResi}</h3>
              </div>
              <div className="w-12 h-12 bg-[#1565c0]/10 border border-[#1565c0]/20 rounded-full flex items-center justify-center">
                <Hash size={20} className="text-[#1565c0]" />
              </div>
            </div>

            <div className="bg-[#0a192f] border border-white/5 rounded-3xl p-5 shadow-sm">
              <h3 className="text-white font-semibold text-sm mb-4 border-b border-white/5 pb-3 flex items-center gap-2"><User size={16} className="text-[#1565c0]"/> 1. Data Anda</h3>
              <div className="space-y-4">
                <input required type="text" value={lcdForm.customerName} onChange={e=>setLcdForm({...lcdForm, customerName: e.target.value})} className="bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white text-sm w-full outline-none focus:border-[#1565c0] transition-colors" placeholder="Nama Lengkap" />
                <input required type="tel" value={lcdForm.wa} onChange={e=>setLcdForm({...lcdForm, wa: e.target.value})} className="bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white text-sm w-full outline-none focus:border-[#1565c0] transition-colors" placeholder="Nomor WhatsApp Aktif" />
                <textarea required value={lcdForm.address} onChange={e=>setLcdForm({...lcdForm, address: e.target.value})} className="bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white text-sm w-full h-16 resize-none outline-none focus:border-[#1565c0] transition-colors" placeholder="Alamat Lengkap"></textarea>
              </div>
            </div>

            <div className="bg-[#0a192f] border border-white/5 rounded-3xl p-5 shadow-sm">
              <h3 className="text-white font-semibold text-sm mb-4 border-b border-white/5 pb-3 flex items-center gap-2"><Smartphone size={16} className="text-[#1565c0]"/> 2. Data Perangkat</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-black/30 border border-white/10 rounded-xl px-3 focus-within:border-[#1565c0] transition-colors">
                    <select required value={lcdForm.brand} onChange={e=>setLcdForm({...lcdForm, brand: e.target.value})} className="bg-transparent border-none outline-none text-white text-sm w-full py-3.5 appearance-none">
                      <option value="Samsung" className="bg-[#0a192f]">Samsung</option>
                      <option value="Apple" className="bg-[#0a192f]">Apple / iPhone</option>
                      <option value="Xiaomi" className="bg-[#0a192f]">Xiaomi</option>
                      <option value="Oppo" className="bg-[#0a192f]">Oppo</option>
                      <option value="Vivo" className="bg-[#0a192f]">Vivo</option>
                      <option value="Lainnya" className="bg-[#0a192f]">Lainnya</option>
                    </select>
                  </div>
                  <input required type="text" value={lcdForm.model} onChange={e=>setLcdForm({...lcdForm, model: e.target.value})} className="bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white text-sm w-full outline-none focus:border-[#1565c0] transition-colors" placeholder="Tipe / Model" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" value={lcdForm.imei} onChange={e=>setLcdForm({...lcdForm, imei: e.target.value})} className="bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white text-sm w-full outline-none focus:border-[#1565c0] transition-colors" placeholder="IMEI (Opsional)" />
                  <input required type="text" value={lcdForm.color} onChange={e=>setLcdForm({...lcdForm, color: e.target.value})} className="bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white text-sm w-full outline-none focus:border-[#1565c0] transition-colors" placeholder="Warna HP" />
                </div>
              </div>
            </div>

            <div className="bg-[#0a192f] border border-white/5 rounded-3xl p-5 shadow-sm">
              <h3 className="text-white font-semibold text-sm mb-4 border-b border-white/5 pb-3 flex items-center gap-2"><AlertCircle size={16} className="text-[#1565c0]"/> 3. Kendala LCD</h3>
              <p className="text-white/50 text-[10px] uppercase font-bold tracking-wider mb-3">Pilih Kerusakan (Bisa lebih dari 1)</p>
              <div className="flex flex-wrap gap-2">
                {issueList.map(issue => (
                  <button type="button" key={issue} onClick={() => toggleArrayItem('issues', issue)} className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 ${lcdForm.issues.includes(issue) ? 'bg-[#1565c0] text-white shadow-[0_0_10px_rgba(21,101,192,0.5)] border border-[#1565c0]' : 'bg-black/30 border border-white/10 text-white/50 hover:bg-white/5'}`}>
                    {issue}
                  </button>
                ))}
              </div>
            </div>

            {isAdmin && (
              <>
                <div className="bg-[#0a192f] border border-amber-500/20 rounded-3xl p-5 shadow-sm">
                  <h3 className="text-white font-semibold text-sm mb-4 border-b border-white/5 pb-3 flex items-center gap-2"><WrenchIcon size={16} className="text-amber-500"/> 4. Kondisi Fisik Tambahan</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {conditionList.map(cond => (
                      <button type="button" key={cond} onClick={() => toggleArrayItem('conditions', cond)} className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 ${lcdForm.conditions.includes(cond) ? 'bg-amber-600 text-white shadow-[0_0_10px_rgba(216,134,11,0.4)] border border-amber-600' : 'bg-black/30 border border-white/10 text-white/50 hover:bg-white/5'}`}>
                        {cond}
                      </button>
                    ))}
                  </div>
                  <textarea value={lcdForm.notes} onChange={e=>setLcdForm({...lcdForm, notes: e.target.value})} placeholder="Catatan internal teknisi..." className="bg-black/30 border border-white/10 rounded-xl p-3 text-white text-sm w-full h-16 resize-none outline-none focus:border-amber-500 transition-colors"></textarea>
                </div>

                <div className="bg-gradient-to-br from-[#0a192f] to-[#000814] border border-green-500/30 rounded-3xl p-5 shadow-lg relative overflow-hidden">
                  <div className="absolute right-0 bottom-0 w-32 h-32 bg-green-500/5 rounded-full blur-3xl"></div>
                  <h3 className="text-white font-semibold text-sm mb-4 border-b border-white/5 pb-3 flex items-center gap-2 relative z-10"><Wallet size={16} className="text-green-400"/> 5. Estimasi Harga Service</h3>
                  <div className="space-y-3 relative z-10 mb-5">
                    <div className="flex items-center justify-between"><span className="text-xs text-white/60">Harga LCD</span><input required type="number" value={lcdForm.priceLcd} onChange={e=>setLcdForm({...lcdForm, priceLcd: e.target.value})} className="bg-black/50 border border-white/10 rounded-lg px-3 py-1.5 w-32 text-white text-sm text-right outline-none focus:border-green-500 transition-colors" placeholder="Rp" /></div>
                    <div className="flex items-center justify-between"><span className="text-xs text-white/60">Jasa Pasang & Risiko</span><input required type="number" value={lcdForm.priceJasa} onChange={e=>setLcdForm({...lcdForm, priceJasa: e.target.value})} className="bg-black/50 border border-white/10 rounded-lg px-3 py-1.5 w-32 text-white text-sm text-right outline-none focus:border-green-500 transition-colors" placeholder="Rp" /></div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-white/10 relative z-10">
                     <span className="text-white font-bold text-sm">TOTAL</span>
                     <span className="text-green-400 font-bold text-xl">{formatRp(totalEstimasi)}</span>
                  </div>
                </div>

                <div className="bg-[#0a192f] border border-white/5 rounded-3xl p-5 shadow-sm">
                  <h3 className="text-white font-semibold text-sm mb-4 border-b border-white/5 pb-3 flex items-center gap-2"><Camera size={16} className="text-[#1565c0]"/> 6. Upload Dokumentasi</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {[{ key: 'front', label: 'Depan (LCD)' }, { key: 'back', label: 'Belakang' }, { key: 'damage', label: 'Kerusakan' }].map((imgBox) => (
                      <div key={imgBox.key}>
                        <label className="flex flex-col items-center justify-center w-full h-24 bg-black/30 border border-white/10 border-dashed rounded-2xl cursor-pointer hover:bg-white/5 transition-colors overflow-hidden relative">
                          {lcdFormImages[imgBox.key] ? <img src={lcdFormImages[imgBox.key]} alt="Preview" className="w-full h-full object-cover" /> : <><UploadCloud size={20} className="text-white/30 mb-1" /><span className="text-[9px] text-white/40">{imgBox.label}</span></>}
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, imgBox.key)} />
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </form>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-5 bg-[#000814]/95 backdrop-blur-md border-t border-white/10 z-10">
          <button form="lcdServiceForm" type="submit" disabled={lcdIsSubmitting} className="w-full bg-[#1565c0] hover:bg-blue-700 py-4 rounded-2xl text-white font-bold shadow-[0_5px_20px_rgba(21,101,192,0.4)] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
            {lcdIsSubmitting ? <Loader2 size={20} className="animate-spin" /> : (isAdmin ? 'Simpan & Buat Invoice' : 'Buat Tiket Booking')}
          </button>
        </div>
      </div>
    );
  };

  const renderAdminOverlay = () => (
    <div className="fixed inset-0 bg-[#000814] z-50 flex flex-col animate-in slide-in-from-right duration-300">
      <div className="flex items-center justify-between p-6 border-b border-white/10 bg-[#0a192f] shadow-md z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => setSubPage(null)} className="p-2 rounded-full bg-white/5 text-white active:scale-90"><ChevronLeft size={20}/></button>
          <div>
            <h2 className="text-xl font-bold text-white">Dashboard Admin</h2>
            <p className="text-[10px] text-white/50">Statistik & Antrean Servis</p>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-6 pb-20 no-scrollbar">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#0a192f] border border-white/10 rounded-2xl p-4 shadow-sm">
            <WrenchIcon size={24} className="text-blue-400 mb-2" />
            <p className="text-white/60 text-xs mb-1">Service Masuk</p>
            <h3 className="text-white font-bold text-lg">{serviceOrders.length + 12} Unit</h3>
          </div>
          <div className="bg-[#0a192f] border border-white/10 rounded-2xl p-4 shadow-sm">
            <CheckSquare size={24} className="text-green-400 mb-2" />
            <p className="text-white/60 text-xs mb-1">Total Selesai</p>
            <h3 className="text-white font-bold text-lg">9 Unit</h3>
          </div>
        </div>
        <div className="bg-gradient-to-br from-[#1565c0] to-blue-900 border border-[#1565c0]/50 rounded-2xl p-5 shadow-lg relative overflow-hidden">
           <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
           <TrendingUp size={24} className="text-blue-200 mb-2 relative z-10" />
           <p className="text-blue-100/80 text-xs mb-1 relative z-10">Pendapatan Harian (Estimasi)</p>
           <h3 className="text-white font-bold text-2xl relative z-10">Rp 2.850.000</h3>
        </div>

        <button onClick={() => openSubPage('form_lcd')} className="w-full bg-[#1565c0]/20 border border-[#1565c0]/50 hover:bg-[#1565c0]/30 py-4 rounded-2xl text-blue-400 font-bold active:scale-[0.98] transition-all flex items-center justify-center gap-2">
           <Plus size={18}/> Input Service Ganti LCD Baru
        </button>
        <button onClick={() => openSubPage('form_frp')} className="w-full mt-2 bg-cyan-900/30 border border-cyan-500/50 hover:bg-cyan-900/50 py-4 rounded-2xl text-cyan-400 font-bold active:scale-[0.98] transition-all flex items-center justify-center gap-2">
           <Terminal size={18}/> Input Service FRP / Software
        </button>
        
        <h3 className="text-white font-semibold text-sm pt-2">Daftar Antrean Terkini</h3>
        <div className="space-y-3">
          {serviceOrders.map((ord, i) => (
            <div key={i} className="bg-[#0a192f] border border-white/5 rounded-2xl p-4 flex justify-between items-center shadow-sm">
              <div>
                <h4 className="text-white font-semibold text-sm">{ord.brand} {ord.model}</h4>
                <p className="text-white/50 text-[10px] mb-1.5">{ord.customerName} • {ord.resi}</p>
                <span className={`text-[9px] px-2 py-0.5 ${ord.type==='FRP'?'bg-cyan-500/20 text-cyan-400':'bg-[#1565c0]/20 text-blue-400'} rounded-md`}>{ord.status}</span>
              </div>
              <button onClick={() => setModal({isOpen:true, title:'Update Status', message:'Fitur update status tracking akan membuka pop-up pilihan status.'})} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-semibold text-white transition-colors">Update</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDeliveryOverlay = () => {
    const handleOrderCourier = (e) => {
      e.preventDefault();
      setIsDeliverySubmitting(true);
      setTimeout(() => {
        const newResi = currentDraftResi;
        setModal({ isOpen: true, title: 'Permintaan Berhasil!', message: `Nomor Resi Anda: ${newResi}\n\nPermintaan pengiriman telah diterima. Silakan cek menu Lacak Servis untuk memantau status perangkat Anda.` });
        setIsDeliverySubmitting(false);
        setSubPage(null); setActiveTab('service'); 
      }, 2000);
    };

    return (
      <div className="fixed inset-0 bg-[#000814] z-50 flex flex-col animate-in slide-in-from-right duration-300">
        <div className="flex items-center gap-4 p-5 border-b border-white/10 bg-[#0a192f] shadow-md z-10">
          <button onClick={() => setSubPage(null)} className="p-2 rounded-full bg-white/5 text-white active:scale-90"><ChevronLeft size={20}/></button>
          <div>
            <h2 className="text-xl font-bold text-white">Kirim Perangkat</h2>
            <p className="text-[10px] text-white/50">Form Ekspedisi & Pick-up Servis HP</p>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
          <form id="deliveryForm" onSubmit={handleOrderCourier} className="p-5 space-y-6">

            {/* UI AUTO GENERATE ID PENGIRIMAN */}
            <div className="bg-[#0a192f] border border-white/5 rounded-3xl p-5 shadow-sm flex justify-between items-center">
              <div>
                <p className="text-white/50 text-[10px] uppercase font-bold tracking-wider mb-1">
                  Nomor Resi Pengiriman (Auto Generate)
                </p>
                <h3 className="text-white font-bold text-xl tracking-widest text-[#1565c0]">{currentDraftResi}</h3>
              </div>
              <div className="w-12 h-12 bg-[#1565c0]/10 border border-[#1565c0]/20 rounded-full flex items-center justify-center">
                <Hash size={20} className="text-[#1565c0]" />
              </div>
            </div>

            <div className="bg-[#0a192f] border border-white/5 rounded-3xl p-5 shadow-sm">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2 border-b border-white/5 pb-3">
                <User size={18} className="text-[#1565c0]" /> Data Pengirim
              </h3>
              <div className="space-y-4">
                <input required type="text" value={deliveryForm.name} onChange={e=>setDeliveryForm({...deliveryForm, name: e.target.value})} className="bg-black/30 border border-white/10 rounded-xl p-3 text-white text-sm w-full outline-none focus:border-[#1565c0]" placeholder="Nama Lengkap" />
                <input required type="tel" value={deliveryForm.wa} onChange={e=>setDeliveryForm({...deliveryForm, wa: e.target.value})} className="bg-black/30 border border-white/10 rounded-xl p-3 text-white text-sm w-full outline-none focus:border-[#1565c0]" placeholder="No WhatsApp (08...)" />
                <textarea required value={deliveryForm.address} onChange={e=>setDeliveryForm({...deliveryForm, address: e.target.value})} placeholder="Alamat lengkap jemput..." className="bg-black/30 border border-white/10 rounded-xl p-3 text-white text-sm w-full h-20 resize-none outline-none focus:border-[#1565c0]"></textarea>
              </div>
            </div>
            <div className="bg-[#0a192f] border border-white/5 rounded-3xl p-5 shadow-sm text-center text-white/50 text-xs">
              Sistem form perangkat & foto sama seperti Form Ganti LCD.
            </div>
          </form>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-5 bg-[#000814]/95 backdrop-blur-md border-t border-white/10">
          <button form="deliveryForm" type="submit" disabled={isDeliverySubmitting} className="w-full bg-[#1565c0] hover:bg-blue-700 py-4 rounded-2xl text-white font-bold shadow-[0_5px_20px_rgba(21,101,192,0.4)] active:scale-[0.98] transition-all flex items-center justify-center">
            {isDeliverySubmitting ? <Loader2 size={20} className="animate-spin" /> : 'Pesan Kurir Sekarang'}
          </button>
        </div>
      </div>
    );
  };

  const renderChatOverlay = () => {
    const handleSendMessage = (e) => {
      e.preventDefault();
      if (!chatInput.trim()) return;
      const newMsg = { id: Date.now(), text: chatInput, sender: 'user', time: new Date().toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'}) };
      setMessages([...messages, newMsg]);
      setChatInput('');
      setTimeout(() => {
        setMessages(prev => [...prev, { id: Date.now()+1, text: 'Baik kak, teknisi kami sedang membaca pesan Anda.', sender: 'tech', time: new Date().toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'}) }]);
      }, 1500);
    };

    return (
      <div className="fixed inset-0 bg-[#000814] z-50 flex flex-col animate-in slide-in-from-bottom duration-300">
        <div className="flex items-center gap-4 p-4 border-b border-white/10 bg-[#0a192f]">
          <button onClick={() => setSubPage(null)} className="p-2 rounded-full bg-white/5 text-white active:scale-90"><ChevronLeft size={20}/></button>
          <div className="flex items-center gap-3 flex-1">
            <h2 className="text-base font-bold text-white">Teknisi Nano Cell</h2>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#000814]">
          <div className="relative z-10 flex flex-col gap-4">
            {messages.map(msg => (
              <div key={msg.id} className={`p-3 max-w-[80%] text-sm shadow-md ${msg.sender === 'user' ? 'self-end bg-[#1565c0] text-white rounded-2xl rounded-tr-sm' : 'self-start bg-white/10 border border-white/10 text-white rounded-2xl rounded-tl-sm'}`}>
                {msg.text}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
        </div>
        <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10 bg-[#0a192f] flex items-center gap-2">
          <input type="text" placeholder="Ketik pesan..." value={chatInput} onChange={(e) => setChatInput(e.target.value)} className="bg-white/5 border border-white/10 rounded-full px-4 py-3 outline-none text-white text-sm w-full" />
          <button type="submit" className="p-3 bg-[#1565c0] text-white rounded-full"><Send size={18}/></button>
        </form>
      </div>
    );
  };

  const renderLocationOverlay = () => {
    return (
      <div className="fixed inset-0 bg-[#000814] z-50 flex flex-col animate-in slide-in-from-bottom duration-300">
        <div className="flex items-center gap-4 p-5 border-b border-white/10 bg-[#0a192f] shadow-md z-10">
          <button onClick={() => setSubPage(null)} className="p-2 rounded-full bg-white/5 text-white active:scale-90"><ChevronLeft size={20}/></button>
          <div>
            <h2 className="text-xl font-bold text-white">Lokasi Toko</h2>
            <p className="text-[10px] text-white/50">Kunjungi Nano Cell Store</p>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto pb-24">
          {/* Embed Google Maps */}
          <div className="w-full h-72 bg-white/5 relative border-b border-white/10">
            <iframe 
              src="https://maps.google.com/maps?q=Jl.%20Raya%20Cipaku%20No.02%2C%20RT.01%2FRW.10%2C%20Cipaku%2C%20Kec.%20Bogor%20Sel.%2C%20Kota%20Bogor%2C%20Jawa%20Barat%2016133&t=&z=16&ie=UTF8&iwloc=&output=embed" 
              width="100%" 
              height="100%" 
              style={{border:0}} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="opacity-90 grayscale-[15%] filter contrast-125"
            ></iframe>
          </div>
          
          <div className="p-6">
            <div className="bg-[#0a192f] border border-white/5 rounded-3xl p-5 shadow-sm mb-6">
              <h3 className="text-white font-bold text-lg mb-3 flex items-center gap-2 border-b border-white/5 pb-3">
                <Store size={20} className="text-[#1565c0]"/> Nano Cell
              </h3>
              <p className="text-white/80 text-sm leading-relaxed mb-4">
                Jl. Raya Cipaku No.02, RT.01/RW.10, Cipaku, Kec. Bogor Sel., Kota Bogor, Jawa Barat 16133
              </p>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center"><Phone size={14} className="text-white/60" /></div>
                <span className="text-white/90 text-sm font-medium">0857-1505-3337</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center"><Clock size={14} className="text-white/60" /></div>
                <span className="text-white/90 text-sm font-medium">Buka Setiap Hari: 09.00 - 21.00 WIB</span>
              </div>
            </div>

            <a href="https://maps.google.com/maps?q=Jl.+Raya+Cipaku+No.02,+RT.01/RW.10,+Cipaku,+Kec.+Bogor+Sel.,+Kota+Bogor,+Jawa+Barat+16133" target="_blank" rel="noreferrer" className="w-full bg-[#1565c0] hover:bg-blue-700 py-4 rounded-2xl text-white font-bold shadow-[0_5px_20px_rgba(21,101,192,0.4)] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
              <MapPin size={18} /> Buka di Google Maps
            </a>
          </div>
        </div>
      </div>
    );
  };

  // ----------------------------------------------------
  // RENDER UTAMA LOGIN & APP
  // ----------------------------------------------------
  if (!user) {
    return (
      <>
        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
            @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
            .font-poppins { font-family: 'Poppins', sans-serif; }
            .no-scrollbar::-webkit-scrollbar { display: none; }
            .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            input:-webkit-autofill, input:-webkit-autofill:hover, 
            input:-webkit-autofill:focus, input:-webkit-autofill:active {
                transition: background-color 5000s ease-in-out 0s !important;
                -webkit-text-fill-color: white !important;
                background-color: transparent !important;
            }
          `}
        </style>
        <div className="w-full h-[100dvh] overflow-hidden bg-[#000814] text-white font-poppins relative selection:bg-[#1565c0]/30 antialiased flex flex-col justify-center items-center">
          <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#0a192f] via-[#000814] to-[#000814]">
             <div className="absolute top-0 right-0 w-96 h-96 bg-[#1565c0]/10 rounded-full blur-[100px]"></div>
             <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#1565c0]/10 rounded-full blur-[100px]"></div>
          </div>
          <div className="relative z-20 w-full max-w-md px-6">
            <div className="text-center flex flex-col items-center mb-8 animate-in slide-in-from-bottom-4 duration-500">
              <div className="w-[72px] h-[72px] mb-4 bg-gradient-to-tr from-[#1565c0] to-cyan-500 rounded-[20px] p-[2px] shadow-[0_0_20px_rgba(21,101,192,0.3)]">
                 <div className="w-full h-full bg-[#000814] rounded-[18px] flex items-center justify-center">
                    <ShieldCheck size={36} className="text-white" />
                 </div>
              </div>
              <h1 className="m-0 text-2xl font-bold tracking-tight text-white drop-shadow-md">Selamat Datang di Nano Cell</h1>
              <p className="mt-2 text-sm text-white/50 font-light leading-relaxed max-w-[280px]">
                Login untuk mengakses layanan service & manajemen perangkat
              </p>
            </div>

            <div className="bg-[#0a192f]/90 backdrop-blur-xl rounded-[32px] p-7 border border-white/5 shadow-2xl animate-in fade-in duration-700">
              {loginStep === 1 ? (
                <form onSubmit={handleRequestOTP}>
                  <button type="button" onClick={handleGoogleLogin} disabled={isAuthenticating} className="relative w-full h-[52px] rounded-2xl border border-white/10 flex justify-center items-center cursor-pointer font-poppins text-sm font-medium gap-3 bg-white text-gray-900 shadow-md hover:bg-gray-100 transition-colors mb-5">
                    <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                    Masuk dengan Google
                  </button>

                  <div className="flex items-center justify-center gap-4 text-white/40 text-[10px] uppercase font-semibold tracking-wider mb-5">
                    <div className="h-[1px] w-full bg-white/10"></div>
                    <span className="whitespace-nowrap">ATAU NOMOR WHATSAPP</span>
                    <div className="h-[1px] w-full bg-white/10"></div>
                  </div>

                  <div className="bg-black/40 rounded-2xl border border-white/10 py-1.5 px-2 flex items-center mb-5 focus-within:border-[#25D366]">
                    <div className="pl-3 pr-2 border-r border-white/10 text-white/60 font-medium text-sm">+62</div>
                    <input type="tel" placeholder="812 3456 7890" value={loginPhone} onChange={handleFormatPhone} className="bg-transparent border-none outline-none text-white text-sm flex-grow px-3 w-full placeholder:text-white/30" required/>
                  </div>

                  <div className="flex items-center justify-between mb-6 px-1">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <div className={`w-4 h-4 rounded-[4px] border flex items-center justify-center ${rememberMe ? 'bg-[#1565c0] border-[#1565c0]' : 'border-white/30'}`}>
                         {rememberMe && <Check size={12} strokeWidth={4} className="text-white" />}
                      </div>
                      <span className="text-xs text-white/70 select-none">Ingat Saya</span>
                      <input type="checkbox" className="hidden" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} />
                    </label>
                    <button type="button" onClick={handleGuestLogin} className="text-xs text-blue-400 font-medium hover:text-blue-300">Masuk sebagai Tamu</button>
                  </div>

                  <button type="submit" disabled={isAuthenticating} className="w-full h-[52px] rounded-2xl font-semibold text-white bg-[#25D366] shadow-[0_5px_15px_rgba(37,211,102,0.2)] mb-4 flex items-center justify-center gap-2 active:scale-[0.98]">
                    {isAuthenticating ? <Loader2 size={20} className="animate-spin" /> : 'Lanjutkan'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOTP} className="animate-in slide-in-from-right-4 duration-300">
                  <button type="button" onClick={() => setLoginStep(1)} className="text-white/50 hover:text-white flex items-center gap-1 text-xs mb-6 transition-colors">
                    <ChevronLeft size={14}/> Kembali
                  </button>
                  <h2 className="m-0 mb-2 text-2xl font-bold text-white">Verifikasi OTP</h2>
                  <p className="m-0 mb-8 text-sm text-white/60 font-light">Kode dikirim ke <span className="text-[#25D366] font-medium">+62 {loginPhone}</span></p>

                  <div className="bg-black/50 rounded-2xl border border-white/10 py-4 px-4 flex items-center mb-6 focus-within:border-[#1565c0]">
                    <input ref={otpInputRef} type="text" inputMode="numeric" placeholder="• • • • • •" value={loginOtp} onChange={(e) => setLoginOtp(e.target.value.replace(/\D/g, ''))} className="bg-transparent border-none outline-none text-white text-2xl w-full tracking-[0.5em] text-center font-bold" required maxLength={6}/>
                  </div>

                  <button type="submit" disabled={isAuthenticating || loginOtp.length !== 6} className="w-full h-[52px] rounded-2xl font-semibold text-white bg-[#1565c0] shadow-[0_5px_15px_rgba(21,101,192,0.3)] mb-6 flex justify-center items-center active:scale-[0.98] disabled:opacity-50">
                     {isAuthenticating ? <Loader2 size={20} className="animate-spin" /> : 'Verifikasi'}
                  </button>
                  
                  <p className="text-center text-xs text-white/50">
                    Belum menerima kode?{' '}
                    {countdown > 0 ? (
                      <span className="text-white/40 ml-1">00:{countdown.toString().padStart(2, '0')}</span>
                    ) : (
                      <button type="button" onClick={() => setCountdown(60)} className="text-blue-400 font-medium ml-1">Kirim Ulang</button>
                    )}
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');
          @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
          html, body { margin: 0; padding: 0; overscroll-behavior-y: none; -webkit-tap-highlight-color: transparent; user-select: none; }
          .font-poppins { font-family: 'Poppins', sans-serif; }
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}
      </style>

      <div className="w-full h-[100dvh] bg-[#000814] text-white font-poppins relative overflow-hidden flex flex-col antialiased">
        <div className="absolute inset-0 bg-[#000814] pointer-events-none z-0"></div>

        <div className="flex-1 overflow-y-auto no-scrollbar relative z-10 px-6 pt-12">
          {activeTab === 'home' && renderHomeTab()}
          {activeTab === 'products' && renderProductsTab()}
          {activeTab === 'service' && renderServiceTab()}
          {activeTab === 'profile' && renderProfileTab()}
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-40 bg-[#000814]/95 border-t border-white/5 pb-safe pt-2 px-6">
          <div className="flex justify-between items-center pb-6">
            <NavItem icon={<Home size={22}/>} label="Beranda" isActive={activeTab === 'home'} onClick={() => setActiveTab('home')} />
            <NavItem icon={<ShoppingBag size={22}/>} label="Produk" isActive={activeTab === 'products'} onClick={() => setActiveTab('products')} />
            <NavItem icon={<Wrench size={22}/>} label="Servis" isActive={activeTab === 'service'} onClick={() => setActiveTab('service')} />
            <NavItem icon={<User size={22}/>} label="Profil" isActive={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
          </div>
        </div>

        {subPage === 'form_lcd' && renderLcdFormOverlay()}
        {subPage === 'form_frp' && renderFrpFormOverlay()}
        {subPage === 'delivery' && renderDeliveryOverlay()}
        {subPage === 'chat' && renderChatOverlay()}
        {subPage === 'location' && renderLocationOverlay()}
        {subPage === 'admin' && renderAdminOverlay()}
        
        {modal.isOpen && (
          <div className="fixed inset-0 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm z-[100] animate-in fade-in duration-200">
            <div className="bg-[#0a192f] border border-[#1565c0]/30 rounded-3xl p-6 w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200">
              <h3 className="text-xl font-bold text-white mb-2 whitespace-pre-wrap">{modal.title}</h3>
              <p className="text-white/70 text-sm mb-6 whitespace-pre-wrap leading-relaxed">{modal.message}</p>
              <button onClick={() => setModal({ isOpen: false, title: '', message: '' })} className="w-full py-3 rounded-2xl bg-[#1565c0] text-white font-semibold">Tutup</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

const NavItem = ({ icon, label, isActive, onClick }) => (
  <div onClick={onClick} className="flex flex-col items-center gap-1 cursor-pointer transition-transform active:scale-90 w-16">
    <div className={`transition-colors ${isActive ? 'text-[#1565c0]' : 'text-white/40'}`}>
      {icon}
    </div>
    <span className={`text-[10px] font-medium transition-colors ${isActive ? 'text-[#1565c0]' : 'text-white/40'}`}>
      {label}
    </span>
    {isActive && <div className="w-1 h-1 bg-[#1565c0] rounded-full mt-0.5 shadow-[0_0_8px_#1565c0]"></div>}
  </div>
);
