'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { MarketplaceNavbar } from '@/components/rentx/MarketplaceNavbar';
import { MarketplaceFooter } from '@/components/rentx/MarketplaceFooter';
import { useAuth } from '@/lib/auth-context';
import { getAllServices, ServiceListing } from '@/lib/firestore-helpers';
import {
  Search, MapPin, Star, Clock, Zap, Shield, Filter, ChevronDown,
  Music, Camera, Palette, Code, Truck, Wrench, GraduationCap, Heart,
  Sparkles, ArrowRight, Users, TrendingUp
} from 'lucide-react';

const CATEGORIES = [
  { name: 'All', icon: Sparkles, color: 'primary' },
  { name: 'DJ & Music', icon: Music, color: 'secondary' },
  { name: 'Photography', icon: Camera, color: 'tertiary' },
  { name: 'Design', icon: Palette, color: 'primary' },
  { name: 'Development', icon: Code, color: 'secondary' },
  { name: 'Logistics', icon: Truck, color: 'tertiary' },
  { name: 'Repair', icon: Wrench, color: 'primary' },
  { name: 'Education', icon: GraduationCap, color: 'secondary' },
  { name: 'Wellness', icon: Heart, color: 'tertiary' },
];

// Demo services for display
const DEMO_SERVICES: Partial<ServiceListing>[] = [
  {
    id: 'demo-1',
    title: 'Professional DJ for Events & Weddings',
    providerName: 'DJ Blaze',
    category: 'DJ & Music',
    city: 'Dubai',
    country: 'UAE',
    description: 'Professional DJ with 10+ years of experience in weddings, corporate events, and private parties. Top-of-the-line equipment included.',
    packages: [{ name: 'Basic', description: '3 hour set', price: 500, deliveryDays: 1, features: ['Sound System', 'Basic Lighting'] }],
    averageRating: 4.9,
    reviewCount: 47,
    totalBookings: 120,
    status: 'active',
    isRemote: false,
    coverImage: '',
    portfolio: [],
    featured: true,
  },
  {
    id: 'demo-2',
    title: 'Cinematic Wedding Photography',
    providerName: 'Studio Luxe',
    category: 'Photography',
    city: 'London',
    country: 'UK',
    description: 'Award-winning wedding photography with a cinematic, editorial style. Full day coverage with a team of 2 photographers.',
    packages: [{ name: 'Full Day', description: '12 hour coverage', price: 1200, deliveryDays: 14, features: ['2 Photographers', '500+ Photos', 'Online Gallery'] }],
    averageRating: 5.0,
    reviewCount: 23,
    totalBookings: 65,
    status: 'active',
    isRemote: false,
    coverImage: '',
    portfolio: [],
    featured: true,
  },
  {
    id: 'demo-3',
    title: 'Full-Stack Web Application Development',
    providerName: 'CodeForge Labs',
    category: 'Development',
    city: 'San Francisco',
    country: 'USA',
    description: 'End-to-end web application development using React, Node.js, and cloud technologies. From MVP to production.',
    packages: [{ name: 'MVP', description: 'Minimum viable product', price: 3000, deliveryDays: 30, features: ['React Frontend', 'API Backend', 'Database', 'Deployment'] }],
    averageRating: 4.8,
    reviewCount: 31,
    totalBookings: 89,
    status: 'active',
    isRemote: true,
    coverImage: '',
    portfolio: [],
    featured: false,
  },
  {
    id: 'demo-4',
    title: 'Brand Identity & Logo Design',
    providerName: 'Artisan Studio',
    category: 'Design',
    city: 'Paris',
    country: 'France',
    description: 'Complete brand identity design including logo, color palette, typography, and brand guidelines document.',
    packages: [{ name: 'Complete Brand', description: 'Full identity package', price: 800, deliveryDays: 7, features: ['Logo Variations', 'Brand Guide', 'Social Kit'] }],
    averageRating: 4.7,
    reviewCount: 18,
    totalBookings: 42,
    status: 'active',
    isRemote: true,
    coverImage: '',
    portfolio: [],
    featured: false,
  },
  {
    id: 'demo-5',
    title: 'Personal Fitness & Nutrition Coaching',
    providerName: 'FitLife Pro',
    category: 'Wellness',
    city: 'New York',
    country: 'USA',
    description: 'Customized fitness programs and nutrition plans tailored to your goals. Weekly check-ins and progress tracking.',
    packages: [{ name: 'Monthly', description: '4-week program', price: 200, deliveryDays: 30, features: ['Custom Workout Plan', 'Nutrition Guide', 'Weekly Calls'] }],
    averageRating: 4.6,
    reviewCount: 56,
    totalBookings: 200,
    status: 'active',
    isRemote: true,
    coverImage: '',
    portfolio: [],
    featured: false,
  },
  {
    id: 'demo-6',
    title: 'Premium Event Decoration & Setup',
    providerName: 'Elegance Events',
    category: 'DJ & Music',
    city: 'Riyadh',
    country: 'Saudi Arabia',
    description: 'Luxury event decoration and setup for weddings, corporate galas, and private celebrations. Custom themes available.',
    packages: [{ name: 'Premium', description: 'Full venue setup', price: 2500, deliveryDays: 3, features: ['Custom Theme', 'Floral Arrangements', 'Lighting', 'Setup & Teardown'] }],
    averageRating: 4.9,
    reviewCount: 12,
    totalBookings: 30,
    status: 'active',
    isRemote: false,
    coverImage: '',
    portfolio: [],
    featured: true,
  },
];

const categoryColors: Record<string, string> = {
  'DJ & Music': 'from-purple-500/20 to-pink-500/20 border-purple-500/30',
  'Photography': 'from-amber-500/20 to-orange-500/20 border-amber-500/30',
  'Development': 'from-blue-500/20 to-cyan-500/20 border-blue-500/30',
  'Design': 'from-pink-500/20 to-rose-500/20 border-pink-500/30',
  'Wellness': 'from-green-500/20 to-emerald-500/20 border-green-500/30',
  'Logistics': 'from-yellow-500/20 to-amber-500/20 border-yellow-500/30',
  'Repair': 'from-gray-500/20 to-slate-500/20 border-gray-500/30',
  'Education': 'from-indigo-500/20 to-blue-500/20 border-indigo-500/30',
};

const categoryIcons: Record<string, React.ElementType> = {
  'DJ & Music': Music,
  'Photography': Camera,
  'Development': Code,
  'Design': Palette,
  'Wellness': Heart,
  'Logistics': Truck,
  'Repair': Wrench,
  'Education': GraduationCap,
};

export default function MarketplacePage() {
  const { user, userProfile } = useAuth();
  const [services, setServices] = useState<Partial<ServiceListing>[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [locationFilter, setLocationFilter] = useState('');

  useEffect(() => {
    // Load real services from Firestore
    getAllServices().then((realServices) => {
      setServices(realServices);
    }).catch((err) => {
      console.error("Failed to load services:", err);
      // Fallback to demo services only on error if desired, 
      // but the user wants to see "No services" if none exist in DB.
      // For now, let's just stop loading.
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  const filteredServices = services.filter((s) => {
    const matchSearch = !searchQuery ||
      s.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.providerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = selectedCategory === 'All' || s.category === selectedCategory;
    const matchLocation = !locationFilter ||
      s.city?.toLowerCase().includes(locationFilter.toLowerCase()) ||
      s.country?.toLowerCase().includes(locationFilter.toLowerCase());
    return matchSearch && matchCategory && matchLocation;
  });

  return (
    <main className="min-h-screen bg-sparkle overflow-clip flex flex-col">
      <MarketplaceNavbar />

      {/* Hero Section */}
      <section className="relative pt-24 pb-12 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_60%,transparent_100%)] pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/8 blur-[150px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-container-low/80 border border-secondary/30 backdrop-blur-md mb-6">
            <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <span className="text-secondary text-[11px] tracking-[0.2em] uppercase font-bold" style={{ fontFamily: 'var(--font-mono)' }}>
              Live Marketplace
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.1] mb-4 text-white tracking-wide" style={{ fontFamily: 'var(--font-heading)' }}>
            Find & Book{' '}
            <span className="text-gradient-brand">Services</span>
          </h1>
          <p className="text-on-surface-variant mb-8 max-w-2xl mx-auto text-sm sm:text-base">
            Browse verified service providers. Book instantly. Pay with RENTX tokens on Solana.
          </p>

          {/* Search Bar */}
          <div className="w-full max-w-4xl mx-auto bg-surface/60 backdrop-blur-xl border border-white/10 rounded-2xl p-3 sm:p-4 shadow-2xl shadow-black/30 flex flex-col sm:flex-row items-center gap-3 hover:border-primary/20 transition-colors duration-500">
            <div className="flex-grow flex items-center gap-3 w-full bg-surface-dim/50 rounded-xl px-4 py-3 border border-white/5">
              <Search className="text-on-surface-variant w-5 h-5 flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search services, providers..."
                className="bg-transparent border-none outline-none text-on-surface placeholder:text-on-surface-variant/50 w-full text-sm"
              />
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto bg-surface-dim/50 rounded-xl px-4 py-3 border border-white/5">
              <MapPin className="text-on-surface-variant w-5 h-5 flex-shrink-0" />
              <input
                type="text"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                placeholder="City or Country"
                className="bg-transparent border-none outline-none text-on-surface placeholder:text-on-surface-variant/50 w-full text-sm"
              />
            </div>
            <button className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary-container text-white px-8 py-3 rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 flex items-center justify-center gap-2">
              <Search className="w-4 h-4" />
              Search
            </button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-8">
            <div className="flex items-center gap-2 text-on-surface-variant">
              <Users className="w-4 h-4 text-primary" />
              <span className="text-sm"><strong className="text-white">200+</strong> Providers</span>
            </div>
            <div className="flex items-center gap-2 text-on-surface-variant">
              <TrendingUp className="w-4 h-4 text-secondary" />
              <span className="text-sm"><strong className="text-white">1,500+</strong> Bookings</span>
            </div>
            <div className="flex items-center gap-2 text-on-surface-variant">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-sm"><strong className="text-white">4.8</strong> Avg Rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="px-6 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
                    selectedCategory === cat.name
                      ? 'bg-primary text-on-primary shadow-lg shadow-primary/20'
                      : 'bg-surface-container border border-white/10 text-on-surface-variant hover:text-white hover:border-white/20'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="px-6 pb-20 flex-grow">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>
              {selectedCategory === 'All' ? 'All Services' : selectedCategory}
              <span className="text-on-surface-variant text-sm font-normal ml-3">({filteredServices.length} found)</span>
            </h2>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-container border border-white/10 text-on-surface-variant text-xs hover:border-white/20 transition-colors">
                <Filter className="w-3.5 h-3.5" />
                Filters
              </button>
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-container border border-white/10 text-on-surface-variant text-xs hover:border-white/20 transition-colors">
                Sort by
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="glass-card rounded-2xl overflow-hidden border border-white/5 animate-pulse">
                  <div className="h-40 bg-white/5" />
                  <div className="p-5 space-y-4">
                    <div className="flex gap-2">
                      <div className="h-4 w-20 bg-white/5 rounded" />
                      <div className="h-4 w-24 bg-white/5 rounded" />
                    </div>
                    <div className="h-6 w-3/4 bg-white/5 rounded" />
                    <div className="space-y-2">
                      <div className="h-3 w-full bg-white/5 rounded" />
                      <div className="h-3 w-5/6 bg-white/5 rounded" />
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-white/5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-white/5" />
                        <div className="h-3 w-16 bg-white/5 rounded" />
                      </div>
                      <div className="h-4 w-12 bg-white/5 rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/5">
              <Search className="w-12 h-12 text-on-surface-variant/30 mx-auto mb-4" />
              <h3 className="text-white font-bold text-lg mb-2">No services found</h3>
              <p className="text-on-surface-variant text-sm">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service) => {
                const CatIcon = categoryIcons[service.category || ''] || Sparkles;
                const gradientClass = categoryColors[service.category || ''] || 'from-primary/20 to-primary/10 border-primary/30';
                return (
                  <Link
                    key={service.id}
                    href={`/marketplace/service/${service.id}`}
                    className="glass-card-hover rounded-2xl overflow-hidden group cursor-pointer border border-white/5"
                  >
                    {/* Cover Image / Category Banner */}
                    <div className={`h-40 bg-gradient-to-br ${gradientClass} border-b border-white/5 relative flex items-center justify-center overflow-hidden`}>
                      <CatIcon className="w-16 h-16 text-white/10 group-hover:text-white/20 transition-colors duration-500 group-hover:scale-110 transform" />
                      {service.featured && (
                        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-secondary/90 text-on-secondary px-3 py-1 rounded-full text-xs font-bold">
                          <Sparkles className="w-3 h-3" />
                          Featured
                        </div>
                      )}
                      {service.isRemote && (
                        <div className="absolute top-3 right-3 bg-surface/80 backdrop-blur-sm text-primary px-2.5 py-1 rounded-full text-xs font-semibold border border-primary/20">
                          Remote
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[11px] text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded-md font-medium">
                          {service.category}
                        </span>
                        <span className="text-[11px] text-on-surface-variant/60">
                          {service.city}, {service.country}
                        </span>
                      </div>

                      <h3 className="text-white font-bold text-base mb-1.5 group-hover:text-primary transition-colors line-clamp-2">
                        {service.title}
                      </h3>

                      <p className="text-on-surface-variant text-xs mb-4 line-clamp-2">
                        {service.description}
                      </p>

                      {/* Provider & Stats */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                            {service.providerName?.charAt(0)}
                          </div>
                          <span className="text-on-surface-variant text-xs font-medium">{service.providerName}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-on-surface-variant">
                          <div className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                            <span className="text-white font-semibold">{service.averageRating}</span>
                            <span>({service.reviewCount})</span>
                          </div>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                        <div>
                          <span className="text-on-surface-variant text-[10px] uppercase tracking-wider">From</span>
                          <div className="text-white font-bold text-lg">
                            {service.packages?.[0]?.price || 0} <span className="text-primary text-xs font-semibold">RENTX</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-primary text-xs font-semibold group-hover:translate-x-1 transition-transform">
                          View Details <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <MarketplaceFooter />

      {/* Global ambient glow layer */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/[0.03] blur-[150px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-secondary-container/[0.03] blur-[120px] rounded-full" />
      </div>
    </main>
  );
}
