import React from 'react';

export const Footer = () => (
  <footer className="w-full border-t border-outline-variant/10 bg-surface-container-lowest">
    <div className="flex flex-col md:flex-row justify-between items-center px-12 py-8 max-w-7xl mx-auto w-full">
      <p className="text-xs text-on-surface-variant">© 2024 The Mindful InternShiphai Portal</p>
      <div className="flex gap-8 mt-4 md:mt-0">
        <a href="#" className="text-xs text-on-surface-variant hover:text-primary transition-colors">Privacy Policy</a>
        <a href="#" className="text-xs text-on-surface-variant hover:text-primary transition-colors">Terms of Service</a>
        <a href="#" className="text-xs text-on-surface-variant hover:text-primary transition-colors">University Career Center</a>
        <a href="#" className="text-xs text-on-surface-variant hover:text-primary transition-colors">Support</a>
      </div>
    </div>
  </footer>
);
