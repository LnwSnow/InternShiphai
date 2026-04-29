import React, { useState } from 'react';
import { Search, Bell, Settings, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Navbar = ({ currentPage, onPageChange, user, onLogin, onLogout, searchQuery, onSearchChange, reminderCount }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'applications', label: 'Applications' },
    { id: 'resources', label: 'Resources' },
  ];

  const handlePageChange = (pageId) => {
    onPageChange(pageId);
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-surface-container-lowest/80 backdrop-blur-xl border-b border-outline-variant/5">
      <nav className="flex justify-between items-center px-6 md:px-8 py-4 max-w-screen-3xl mx-auto">
        <div className="flex items-center gap-8 md:gap-12">
          <button onClick={() => handlePageChange('landing')} className="text-2xl font-bold tracking-tighter text-on-surface font-headline">
            Intern<span className="text-primary">Shiphai</span>
          </button>
          
          {/* Desktop Nav */}
          {currentPage !== 'landing' && (
            <div className="hidden md:flex items-center gap-8 font-headline text-sm font-medium tracking-tight">
              {navLinks.map(link => (
                <button 
                  key={link.id}
                  onClick={() => onPageChange(link.id)}
                  className={`${currentPage === link.id ? 'text-primary font-semibold border-b-2 border-primary pb-1' : 'text-on-surface-variant hover:text-primary transition-colors'}`}
                >
                  {link.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          {/* Desktop Search */}
          {currentPage === 'dashboard' && (
            <div className="relative hidden lg:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search internships..." 
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-full text-sm focus:ring-2 focus:ring-primary/20 w-48 xl:w-64 outline-none transition-all"
              />
            </div>
          )}
          
          {user ? (
            <div className="flex items-center gap-2 md:gap-4">
              <button 
                onClick={() => {
                  onPageChange('dashboard');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setIsMenuOpen(false);
                }}
                className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-all relative"
              >
                <Bell className="w-5 h-5" />
                {reminderCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {reminderCount}
                  </span>
                )}
              </button>
              <div className="hidden md:flex items-center gap-3 pl-2 border-l border-outline-variant/20">
                <img 
                  src={user.photoURL} 
                  alt={user.displayName} 
                  className="w-8 h-8 rounded-full border border-outline-variant/10"
                  referrerPolicy="no-referrer"
                />
                <button 
                  onClick={() => { onLogout(); setIsMenuOpen(false); }}
                  className="text-xs font-bold text-on-surface-variant hover:text-primary transition-colors pl-1"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <button 
              onClick={onLogin}
              className="bg-primary text-on-primary px-6 py-2 rounded-full font-bold text-sm hover:opacity-90 transition-all"
            >
              Login
            </button>
          )}

          {/* Hamburger Toggle */}
          {currentPage !== 'landing' && (
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-on-surface-variant hover:bg-surface-container-low rounded-xl transition-all"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          )}
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden bg-surface-container-lowest border-t border-outline-variant/5 overflow-hidden shadow-2xl"
          >
            <div className="px-6 py-8 space-y-6">
              {currentPage === 'dashboard' && (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-4 h-4" />
                  <input 
                    type="text" 
                    placeholder="Search internships..." 
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-surface-container-low border-none rounded-2xl text-sm outline-none"
                  />
                </div>
              )}
              
              <div className="flex flex-col gap-2">
                {navLinks.map(link => (
                  <button 
                    key={link.id}
                    onClick={() => handlePageChange(link.id)}
                    className={`text-left py-4 px-5 rounded-2xl transition-all font-headline font-semibold text-lg ${currentPage === link.id ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:bg-surface-container-low'}`}
                  >
                    {link.label}
                  </button>
                ))}
              </div>

              {user && (
                <div className="pt-6 border-t border-outline-variant/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img 
                      src={user.photoURL} 
                      alt={user.displayName} 
                      className="w-10 h-10 rounded-full"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-on-surface">{user.displayName}</span>
                      <span className="text-xs text-on-surface-variant truncate max-w-[150px]">{user.email}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => { onLogout(); setIsMenuOpen(false); }}
                    className="text-xs font-bold text-on-surface-variant py-2 px-4 hover:bg-surface-container-low rounded-xl transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

