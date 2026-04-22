import React from 'react';
import { Search, Bell, Settings } from 'lucide-react';

export const Navbar = ({ currentPage, onPageChange, user, onLogin, onLogout, searchQuery, onSearchChange, reminderCount }) => (
  <header className="fixed top-0 w-full z-50 bg-surface-container-lowest/80 backdrop-blur-xl border-b border-outline-variant/5">
    <nav className="flex justify-between items-center px-8 py-4 max-w-screen-3xl mx-auto">
      <div className="flex items-center gap-8 md:gap-12">
        <button onClick={() => onPageChange('landing')} className="text-2xl font-bold tracking-tighter text-on-surface font-headline">
          Intern<span className="text-primary">Shiphai</span>
        </button>
        {currentPage !== 'landing' && (
          <div className="hidden md:flex items-center gap-8 font-headline text-sm font-medium tracking-tight">
            <button 
              onClick={() => onPageChange('dashboard')}
              className={`${currentPage === 'dashboard' ? 'text-primary font-semibold border-b-2 border-primary pb-1' : 'text-on-surface-variant hover:text-primary transition-colors'}`}
            >
              Dashboard
            </button>
            <button 
              onClick={() => onPageChange('applications')}
              className={`${currentPage === 'applications' ? 'text-primary font-semibold border-b-2 border-primary pb-1' : 'text-on-surface-variant hover:text-primary transition-colors'}`}
            >
              Applications
            </button>
            <button 
              onClick={() => onPageChange('resources')}
              className={`${currentPage === 'resources' ? 'text-primary font-semibold border-b-2 border-primary pb-1' : 'text-on-surface-variant hover:text-primary transition-colors'}`}
            >
              Resources
            </button>
          </div>
        )}
      </div>
      <div className="flex items-center gap-4">
        {currentPage === 'dashboard' && (
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search internships..." 
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-full text-sm focus:ring-2 focus:ring-primary/20 w-64 outline-none"
            />
          </div>
        )}
        
        {user ? (
          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                onPageChange('dashboard');
                window.scrollTo({ top: 0, behavior: 'smooth' });
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
            <div className="flex items-center gap-3 pl-2 border-l border-outline-variant/20">
              <img 
                src={user.photoURL} 
                alt={user.displayName} 
                className="w-8 h-8 rounded-full border border-outline-variant/10"
                referrerPolicy="no-referrer"
              />
              <button 
                onClick={onLogout}
                className="text-xs font-bold text-on-surface-variant hover:text-primary transition-colors"
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
      </div>
    </nav>
  </header>
);
