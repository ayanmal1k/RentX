'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { getProviderServices, createService, updateService, deleteService, ServiceListing, ServicePackage, updateUserProfile } from '@/lib/firestore-helpers';
import {
  Package, Plus, Edit3, Trash2, Save, X, ArrowLeft, Eye, Check,
  LayoutDashboard, Calendar, BookOpen, CreditCard, Wallet, UserCircle,
  Menu, LogOut, AlertCircle, ShoppingBag, History
} from 'lucide-react';
import CustomModal from '@/components/rentx/CustomModal';

const CATEGORIES = ['DJ & Music', 'Photography', 'Design', 'Development', 'Logistics', 'Repair', 'Education', 'Wellness', 'Other'];

// US states list used when provider wants to offer service for whole state
const US_STATES = [
  'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia',
  'Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland',
  'Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey',
  'New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina',
  'South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming'
];

function ProviderServicesContent() {
  const { user, userProfile, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isNew = searchParams.get('new') === 'true';
  const [services, setServices] = useState<ServiceListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(isNew);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error' | 'confirm';
    onConfirm?: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [areaType, setAreaType] = useState<'city' | 'state'>('city');
  const [isRemote, setIsRemote] = useState(false);
  const [packages, setPackages] = useState<ServicePackage[]>([
    { name: 'Basic', description: '', price: 0, deliveryDays: 1, features: [] }
  ]);
  const [newFeature, setNewFeature] = useState('');
  const [providerEmail, setProviderEmail] = useState('');
  const [providerPhone, setProviderPhone] = useState('');
  const [countriesList, setCountriesList] = useState<any[]>([]);
  const [citiesForCountry, setCitiesForCountry] = useState<string[]>([]);
  const [selectedCountryMeta, setSelectedCountryMeta] = useState<{flag?:string; dialCode?:string; iso2?:string} | null>(null);

  useEffect(() => {
    if (!authLoading && !user) router.push('/marketplace/auth');
  }, [authLoading, user]);

  useEffect(() => {
    if (user) loadServices();
    if (userProfile) {
      setProviderEmail(userProfile.email || user?.email || '');
      setProviderPhone(userProfile.phone || '');
    } else {
      setProviderEmail(user?.email || '');
      setProviderPhone('');
    }

    // Fetch countries + cities and restcountries data to show flags and dial codes
    async function fetchCountriesAndCities() {
      try {
        const [countriesResp, restResp] = await Promise.all([
          fetch('https://countriesnow.space/api/v0.1/countries'),
          fetch('https://restcountries.com/v3.1/all')
        ]);
        const countriesJson = await countriesResp.json();
        const restJson = await restResp.json();

        const restArray = Array.isArray(restJson) ? restJson : (restJson?.data && Array.isArray(restJson.data) ? restJson.data : []);

        const restMap: Record<string, any> = {};
        for (const r of restArray) {
          if (!r || !r.name) continue;
          const name = (r.name.common || '').toString();
          if (!name) continue;
          restMap[name.toLowerCase()] = r;
          if (Array.isArray(r.altSpellings)) for (const a of r.altSpellings) if (a) restMap[a.toLowerCase()] = r;
          if (r.name && r.name.official) restMap[(r.name.official || '').toLowerCase()] = r;
        }

        const list: any[] = (countriesJson.data || []).map((c: any) => {
          const key = (c.country || '').toLowerCase();
          const r = restMap[key] || restMap[(c.country || '').replace(/\s+\(.*\)$/,'').toLowerCase()];
          let iso2, dialCode, flag;
          if (r) {
            iso2 = r.cca2;
            if (r.idd && r.idd.root) {
              const suffix = r.idd.suffixes && r.idd.suffixes.length ? r.idd.suffixes[0] : '';
              dialCode = `${r.idd.root}${suffix}`;
            }
            if (iso2) {
              flag = iso2.toUpperCase().replace(/./g, (ch: string) => String.fromCodePoint(127397 + ch.charCodeAt(0)));
            }
          }
          return { name: c.country, cities: c.cities || [], iso2, dialCode, flag };
        });

        const sorted = list.sort((a,b) => a.name.localeCompare(b.name));
        setCountriesList(sorted);
        // if a country is already selected, sync its meta
        const existingMeta = sorted.find((c: any) => c.name === country);
        if (existingMeta) {
          setCitiesForCountry(existingMeta.cities || []);
          setSelectedCountryMeta({ flag: existingMeta.flag, dialCode: existingMeta.dialCode, iso2: existingMeta.iso2 });
        }
      } catch (err) {
        console.error('Failed to load countries data', err);
      }
    }

    fetchCountriesAndCities();
  }, [user, userProfile]);

  // Keep selectedCountryMeta and cities in sync when countriesList loads or country changes
  useEffect(() => {
    if (!countriesList || countriesList.length === 0) return;
    const meta = countriesList.find(c => c.name === country);
    if (meta) {
      setCitiesForCountry(meta.cities || []);
      setSelectedCountryMeta({ flag: meta.flag, dialCode: meta.dialCode, iso2: meta.iso2 });
      // if the selected country is USA, keep areaType as-is; otherwise default to city
      if (meta.iso2 !== 'US') setAreaType('city');
    }
  }, [countriesList, country]);

  const loadServices = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const s = await getProviderServices(user.uid);
      setServices(s);
    } catch (err) {
      console.error("Failed to load services:", err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle(''); setDescription(''); setCategory(CATEGORIES[0]); setCountry(''); setCity(''); setAreaType('city'); setIsRemote(false);
    setPackages([{ name: 'Basic', description: '', price: 0, deliveryDays: 1, features: [] }]);
    setEditingId(null); setShowForm(false);
    setProviderEmail(user?.email || '');
    setProviderPhone('');
  };

  const editService = (s: ServiceListing) => {
    setTitle(s.title); setDescription(s.description); setCategory(s.category);
    setCountry(s.country || ''); setCity(s.city || ''); setIsRemote(s.isRemote || false);
    setPackages(s.packages || []); setEditingId(s.id || null); setShowForm(true);
    // set cities and country meta if available
    const meta = countriesList.find(c => c.name === (s.country || ''));
    if (meta) {
      setCitiesForCountry(meta.cities || []);
      setSelectedCountryMeta({ flag: meta.flag, dialCode: meta.dialCode, iso2: meta.iso2 });
      if (meta.dialCode && !providerPhone) setProviderPhone(meta.dialCode + ' ' + (s.providerContact?.phone || ''));
      // restore area type if present on listing
      if ((s as any).serviceArea && (s as any).serviceArea.type) {
        setAreaType((s as any).serviceArea.type);
        setCity((s as any).serviceArea.value || s.city || '');
      } else {
        setAreaType('city');
      }
    }
  };

  const handleSave = async () => {
    if (!user || !userProfile) return;
    setSaving(true);
    const data: Partial<ServiceListing> = {
      providerId: user.uid, providerName: userProfile.displayName, title, description,
      category, country, city, isRemote, packages, portfolio: [], status: 'active',
      providerContact: { email: providerEmail || user.email, phone: providerPhone || userProfile?.phone },
      // Record whether this listing targets a state or a specific city
      serviceArea: { type: areaType, value: city },
    };
    try {
      if (editingId) { await updateService(editingId, data); }
      else { await createService(data); }
      // If provider doesn't have phone saved yet, persist it to their profile
      if (!userProfile?.phone && providerPhone) {
        try { await updateUserProfile(user.uid, { phone: providerPhone }); } catch (err) { console.error('Failed to update profile phone', err); }
      }
      await loadServices(); resetForm();
    } catch (err) { console.error(err); }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    setModalConfig({
      isOpen: true,
      title: 'Delete Service',
      message: 'Are you sure you want to delete this listing? This action cannot be undone.',
      type: 'confirm',
      onConfirm: async () => {
        try {
          await deleteService(id);
          await loadServices();
        } catch (err) {
          console.error(err);
        }
      }
    });
  };

  const addPackage = () => {
    if (packages.length >= 3) return;
    setPackages([...packages, { name: packages.length === 1 ? 'Standard' : 'Premium', description: '', price: 0, deliveryDays: 1, features: [] }]);
  };

  const updatePackage = (idx: number, field: string, value: any) => {
    const updated = [...packages];
    (updated[idx] as any)[field] = value;
    setPackages(updated);
  };

  const addFeatureToPackage = (idx: number) => {
    if (!newFeature.trim()) return;
    const updated = [...packages];
    updated[idx].features = [...updated[idx].features, newFeature.trim()];
    setPackages(updated);
    setNewFeature('');
  };

  const NAV_ITEMS = [
    { label: 'Overview', icon: LayoutDashboard, href: '/marketplace/dashboard/provider' },
    { label: 'My Services', icon: Package, href: '/marketplace/dashboard/provider/services', active: true },
    { label: 'Bookings', icon: BookOpen, href: '/marketplace/dashboard/provider/bookings' },
    { label: 'Wallet', icon: Wallet, href: '/marketplace/dashboard/provider/wallet' },
    { label: 'History', icon: History, href: '/marketplace/dashboard/history' },
    { label: 'Profile', icon: UserCircle, href: '/marketplace/dashboard/provider/profile' },
  ];

  if (authLoading) return <div className="min-h-screen bg-black flex items-center justify-center"><div className="w-10 h-10 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-[#0a0a0a] border-r border-white/5 flex flex-col z-50 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 border-b border-white/5">
          <Link href="/marketplace" className="flex items-center gap-3"><div className="w-8 h-8"><img src="/rentx-coin.png" alt="RENTX" className="w-full h-full object-contain" /></div><div className="font-bold text-lg tracking-widest text-gradient-brand">RENTX</div></Link>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (<Link key={item.href} href={item.href} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${item.active ? 'bg-primary/10 text-primary border border-primary/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}><Icon className="w-4 h-4" />{item.label}</Link>);
          })}
        </nav>
        <div className="p-4 border-t border-white/5 space-y-2">
          <button 
            onClick={() => router.push('/marketplace')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-primary bg-primary/10 border border-primary/20 hover:bg-primary/20 text-xs w-full transition-all font-bold uppercase tracking-widest"
          >
            <ShoppingBag className="w-4 h-4" /> Switch to Buying
          </button>
          <button onClick={logout} className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-400 hover:text-red-400 text-xs w-full transition-all font-medium"><LogOut className="w-4 h-4" /> Sign Out</button>
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-30 bg-black/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-400"><Menu className="w-5 h-5" /></button>
            <div>
              <h1 className="text-lg font-bold">My Services</h1>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Provider Mode</span>
              </div>
            </div>
          </div>
          {services.length < 5 && !showForm && (
            <button onClick={() => setShowForm(true)} className="bg-primary text-black px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 hover:opacity-90 transition-all"><Plus className="w-3.5 h-3.5" /> New Listing</button>
          )}
        </header>

        <main className="p-6 overflow-y-auto">
          {showForm && (
            <div className="glass-card rounded-2xl p-6 mb-8 border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-lg">{editingId ? 'Edit Listing' : 'Create New Listing'}</h2>
                <button onClick={resetForm} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="text-gray-400 text-xs font-medium mb-2 block uppercase tracking-wider">Service Title</label>
                  <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Professional Event DJ" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-all" />
                </div>
                <div>
                  <label className="text-gray-400 text-xs font-medium mb-2 block uppercase tracking-wider">Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-all">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-gray-400 text-xs font-medium mb-2 block uppercase tracking-wider">Country</label>
                  <select value={country} onChange={async (e) => {
                    const val = e.target.value;
                    setCountry(val);
                    const meta = countriesList.find(c => c.name === val);
                    setCitiesForCountry(meta?.cities || []);
                    // if meta has dialCode, use it; otherwise try to fetch restcountries by name
                    if (meta && meta.dialCode) {
                      setSelectedCountryMeta({ flag: meta.flag, dialCode: meta.dialCode, iso2: meta.iso2 });
                      const stripped = (providerPhone || '').replace(/^\+?[0-9\s\-\(\)]+\s?/, '').trim();
                      setProviderPhone(`${meta.dialCode} ${stripped}`.trim());
                    } else {
                      try {
                        const resp = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(val)}?fullText=true`);
                        const j = await resp.json();
                        const r = Array.isArray(j) && j.length ? j[0] : null;
                        if (r) {
                          const iso2 = r.cca2;
                          let dialCode;
                          if (r.idd && r.idd.root) {
                            const suffix = r.idd.suffixes && r.idd.suffixes.length ? r.idd.suffixes[0] : '';
                            dialCode = `${r.idd.root}${suffix}`;
                          }
                          const flag = iso2 ? iso2.toUpperCase().replace(/./g, (ch: string) => String.fromCodePoint(127397 + ch.charCodeAt(0))) : undefined;
                          setSelectedCountryMeta({ flag, dialCode, iso2 });
                          if (dialCode) {
                            const stripped = (providerPhone || '').replace(/^\+?[0-9\s\-\(\)]+\s?/, '').trim();
                            setProviderPhone(`${dialCode} ${stripped}`.trim());
                          }
                        }
                      } catch (err) {
                        console.error('Failed to lookup country details', err);
                        setSelectedCountryMeta(meta ? { flag: meta.flag, dialCode: meta.dialCode, iso2: meta.iso2 } : null);
                      }
                    }
                  }} className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white" style={{backgroundColor: '#0a0a0a', color: '#fff'}}>
                    <option value="">Select country</option>
                    {countriesList.map((c) => (<option key={c.name} value={c.name} style={{backgroundColor: '#0a0a0a', color: '#fff'}}>{c.flag ? `${c.flag} ${c.name}` : c.name}</option>))}
                  </select>
                </div>
                <div>
                  <label className="text-gray-400 text-xs font-medium mb-2 block uppercase tracking-wider">City</label>
                  {/* If United States is selected, allow choosing between City or State coverage */}
                  {((selectedCountryMeta && selectedCountryMeta.iso2 === 'US') || /united states/i.test(country || '')) && (
                    <div className="flex items-center gap-2 mb-2">
                      <button type="button" onClick={() => setAreaType('city')} className={`px-3 py-1 rounded-xl text-xs ${areaType === 'city' ? 'bg-primary text-black' : 'bg-white/5 text-gray-300'}`}>City</button>
                      <button type="button" onClick={() => { setAreaType('state'); setCity(''); }} className={`px-3 py-1 rounded-xl text-xs ${areaType === 'state' ? 'bg-primary text-black' : 'bg-white/5 text-gray-300'}`}>State</button>
                      <div className="text-xs text-gray-400 ml-2">Choose service area type</div>
                    </div>
                  )}

                  {areaType === 'state' && ((selectedCountryMeta && selectedCountryMeta.iso2 === 'US') || /united states/i.test(country || '')) ? (
                    <select value={city} onChange={(e) => setCity(e.target.value)} className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white" style={{backgroundColor: '#0a0a0a', color: '#fff'}}>
                      <option value="">Select state</option>
                      {US_STATES.map((st) => <option key={st} value={st} style={{backgroundColor: '#0a0a0a', color: '#fff'}}>{st}</option>)}
                    </select>
                  ) : (
                    // city selection (regular behavior)
                    (citiesForCountry && citiesForCountry.length > 0) ? (
                      <select value={city} onChange={(e) => setCity(e.target.value)} className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white" style={{backgroundColor: '#0a0a0a', color: '#fff'}}>
                        <option value="">Select city</option>
                        {citiesForCountry.map((ct) => <option key={ct} value={ct} style={{backgroundColor: '#0a0a0a', color: '#fff'}}>{ct}</option>)}
                      </select>
                    ) : (
                      <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white" style={{backgroundColor: '#0a0a0a', color: '#fff'}} />
                    )
                  )}
                </div>
                <div>
                  <label className="text-gray-400 text-xs font-medium mb-2 block uppercase tracking-wider">Contact Email</label>
                  <input value={providerEmail} onChange={(e) => setProviderEmail(e.target.value)} placeholder="your@email.com" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm" />
                </div>
                <div>
                  <label className="text-gray-400 text-xs font-medium mb-2 block uppercase tracking-wider">Contact Number</label>
                  <div className="flex">
                    <div className="flex items-center gap-2 px-3 bg-white/5 border border-white/10 rounded-l-xl text-sm">
                      <span>{selectedCountryMeta?.flag}</span>
                      <span className="text-xs text-gray-300">{selectedCountryMeta?.dialCode || ''}</span>
                    </div>
                    <input value={providerPhone} onChange={(e) => setProviderPhone(e.target.value)} placeholder="50 123 4567" className="flex-1 bg-white/5 border border-white/10 rounded-r-xl px-4 py-3 text-sm" />
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="text-gray-400 text-xs font-medium mb-2 block uppercase tracking-wider">Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} placeholder="Describe your service in detail..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-all resize-none" />
              </div>

              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-sm">Pricing Packages</h3>
                  {packages.length < 3 && <button onClick={addPackage} className="text-primary text-xs font-bold flex items-center gap-1 hover:underline"><Plus className="w-3 h-3" /> Add Package</button>}
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {packages.map((pkg, i) => (
                    <div key={i} className="bg-white/5 rounded-xl p-5 border border-white/10">
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
                        <input value={pkg.name} onChange={(e) => updatePackage(i, 'name', e.target.value)} placeholder="Name (e.g. Basic)" className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm" />
                        <input type="number" value={pkg.price || ''} onChange={(e) => updatePackage(i, 'price', Number(e.target.value))} placeholder="RENTX Price" className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm" />
                        <input type="number" value={pkg.deliveryDays || ''} onChange={(e) => updatePackage(i, 'deliveryDays', Number(e.target.value))} placeholder="Delivery Days" className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm" />
                        <input value={pkg.description} onChange={(e) => updatePackage(i, 'description', e.target.value)} placeholder="Short description" className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm" />
                      </div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {pkg.features.map((f, j) => (
                          <span key={j} className="text-[10px] bg-primary/10 text-primary border border-primary/20 px-2 py-1 rounded-md flex items-center gap-2 font-bold uppercase tracking-tighter">
                            {f}
                            <button onClick={() => { const u = [...packages]; u[i].features = u[i].features.filter((_, k) => k !== j); setPackages(u); }} className="hover:text-white"><X className="w-3 h-3" /></button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input value={newFeature} onChange={(e) => setNewFeature(e.target.value)} placeholder="Add feature..." onKeyDown={(e) => e.key === 'Enter' && addFeatureToPackage(i)} className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs" />
                        <button onClick={() => addFeatureToPackage(i)} className="bg-white/10 px-4 py-2 rounded-lg text-xs font-bold hover:bg-white/20">Add</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <button onClick={handleSave} disabled={saving || !title} className="bg-primary text-black px-8 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:shadow-lg hover:shadow-primary/20 transition-all disabled:opacity-50">
                  {saving ? <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : <><Save className="w-4 h-4" /> {editingId ? 'Update Listing' : 'Publish Listing'}</>}
                </button>
                <button onClick={resetForm} className="px-8 py-3 rounded-xl text-gray-400 text-sm border border-white/10 hover:border-white/20 transition-colors">Cancel</button>
              </div>
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="glass-card rounded-2xl p-6 border border-white/10 animate-pulse">
                  <div className="flex justify-between mb-4">
                    <div className="h-4 w-20 bg-white/5 rounded" />
                    <div className="flex gap-2">
                      <div className="h-8 w-8 bg-white/5 rounded-lg" />
                      <div className="h-8 w-8 bg-white/5 rounded-lg" />
                    </div>
                  </div>
                  <div className="h-6 w-3/4 bg-white/5 rounded mb-2" />
                  <div className="h-4 w-full bg-white/5 rounded mb-1" />
                  <div className="h-4 w-5/6 bg-white/5 rounded mb-4" />
                  <div className="h-10 w-full bg-white/5 rounded mb-4" />
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <div className="h-3 w-16 bg-white/5 rounded" />
                      <div className="h-6 w-24 bg-white/5 rounded" />
                    </div>
                    <div className="h-10 w-10 bg-white/5 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : services.length === 0 && !showForm ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white/5 rounded-3xl border border-white/5">
              <Package className="w-16 h-16 text-white/10 mb-6" />
              <h3 className="text-xl font-bold mb-2">No active listings</h3>
              <p className="text-gray-400 text-sm mb-8 text-center max-w-xs">Start offering your services to the RENTX community by creating your first listing.</p>
              <button onClick={() => setShowForm(true)} className="bg-primary text-black px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2"><Plus className="w-4 h-4" /> Create My First Listing</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {services.map((s) => (
                <div key={s.id} className="glass-card rounded-2xl p-6 border border-white/10 hover:border-primary/30 transition-all group">
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 py-1 rounded border border-primary/20">{s.category}</span>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => editService(s)} className="p-2 bg-white/5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all"><Edit3 className="w-4 h-4" /></button>
                      <button onClick={() => s.id && handleDelete(s.id)} className="p-2 bg-white/5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold mb-1 truncate">{s.title}</h3>
                  <p className="text-gray-400 text-xs mb-4 line-clamp-2">{s.description}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-6 pb-6 border-b border-white/5">
                    <span className="flex items-center gap-1"><Check className="w-3 h-3 text-green-500" /> {s.status}</span>
                    <span>•</span>
                    <span>{s.city}, {s.country}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-xs">
                      <span className="text-gray-400">Starting from</span>
                      <div className="text-primary font-bold text-lg">{s.packages?.[0]?.price || 0} <span className="text-[10px] text-gray-500">RENTX</span></div>
                    </div>
                    <Link href={`/marketplace/service/${s.id}`} className="p-2 bg-white/5 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-all"><Eye className="w-5 h-5" /></Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
      <CustomModal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        onConfirm={modalConfig.onConfirm}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
      />
    </div>
  );
}

export default function ProviderServicesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center"><div className="w-10 h-10 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>}>
      <ProviderServicesContent />
    </Suspense>
  );
}
