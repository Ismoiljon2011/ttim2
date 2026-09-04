import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import {
  Search, Menu, X, Sun, Moon, GraduationCap, ChevronDown,
} from 'lucide-react';
import { useTheme } from '@/lib/theme';
import { NavItem, SiteSettings } from '@/lib/supabase';

interface HeaderProps {
  settings: SiteSettings | null;
  navItems: NavItem[];
}

export default function Header({ settings, navItems }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const isActive = (url: string) => {
    if (url === '/') return location.pathname === '/';
    return location.pathname.startsWith(url);
  };

  const schoolName = settings?.school_short_name || 'TTIM';
  const schoolFullName = settings?.school_name || "To'raqo'rg'on tuman ixtisoslashtirilgan maktabi";

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-md'
            : 'bg-white dark:bg-slate-900 shadow-sm'
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-[72px] items-center justify-between gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 shrink-0 group">
              {settings?.logo_url ? (
                <img src={settings.logo_url} alt={schoolName} className="h-11 w-11 rounded-xl object-cover shadow-md group-hover:shadow-lg transition-shadow" />
              ) : (
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-700 text-white shadow-md group-hover:shadow-lg transition-shadow">
                  <GraduationCap className="h-6 w-6" />
                </div>
              )}
              <div className="hidden sm:block">
                <div className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                  {schoolName}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight max-w-[200px] truncate">
                  {schoolFullName}
                </div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.slice(0, 7).map((item) => (
                <Link
                  key={item.id}
                  to={item.url}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                    isActive(item.url)
                      ? 'text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-900/30'
                      : 'text-slate-700 dark:text-slate-300 hover:text-primary-700 dark:hover:text-primary-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              {navItems.length > 7 && (
                <div className="relative group">
                  <button className="px-3 py-2 text-sm font-medium rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1 whitespace-nowrap">
                    Boshqa <ChevronDown className="h-4 w-4" />
                  </button>
                  <div className="absolute right-0 top-full pt-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 min-w-[200px]">
                      {navItems.slice(7).map((item) => (
                        <Link
                          key={item.id}
                          to={item.url}
                          className={`block px-4 py-2 text-sm whitespace-nowrap transition-colors ${
                            isActive(item.url)
                              ? 'text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-900/30'
                              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                          }`}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </button>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Menu"
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Search bar dropdown */}
          {searchOpen && (
            <div className="absolute left-0 right-0 top-full bg-white dark:bg-slate-900 shadow-lg border-t border-slate-200 dark:border-slate-700 animate-slide-down">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
                <form onSubmit={handleSearch} className="flex gap-2">
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Qidirish: yangiliklar, o'qituvchilar, kutubxona..."
                    className="flex-1 px-4 py-3 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-transparent focus:border-primary-500 focus:outline-none text-base"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-lg bg-primary-700 text-white font-medium hover:bg-primary-800 transition-colors"
                  >
                    Qidirish
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 max-h-[calc(100vh-72px)] overflow-y-auto animate-slide-down">
            <nav className="px-4 py-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.url}
                  className={`block px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive(item.url)
                      ? 'text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-900/30'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>
      <div className="h-[72px]" />
    </>
  );
}
