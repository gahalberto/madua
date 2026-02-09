'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || isMobileMenuOpen
          ? 'bg-black/80 backdrop-blur-md border-b border-white/10'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <img
              src="/logo/logo-somente-simbolo.png"
              alt="MADUA Logo"
              className="w-24 sm:w-24 h-24 sm:h-20"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/sobre"
              className="text-white/80 hover:text-amber-600 transition-colors font-medium"
            >
              Manifesto
            </Link>
            <Link
              href="/receitas"
              className="text-white/80 hover:text-amber-600 transition-colors font-medium"
            >
              Receitas
            </Link>
            <Link
              href="/blog"
              className="text-white/80 hover:text-amber-600 transition-colors font-medium"
            >
              Blog
            </Link>
          </div>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/login"
              className="px-6 py-2.5 border-2 border-amber-600 text-amber-600 font-semibold rounded-lg hover:bg-amber-600 hover:text-black transition-all"
            >
              Entrar
            </Link>
            <Link
              href="/register"
              className="px-6 py-2.5 bg-amber-600 text-black font-bold rounded-lg hover:bg-amber-500 transition-all shadow-lg shadow-amber-600/20"
            >
              Assinar Agora
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white p-2"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-black backdrop-blur-xl border-b border-white/10 shadow-2xl">
            <div className="px-6 py-6 space-y-6">
              {/* Navigation Links */}
              <div className="space-y-1">
                <Link
                  href="/sobre"
                  className="block text-white/90 hover:text-amber-600 hover:bg-white/5 transition-all font-medium py-3 px-4 rounded-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Manifesto
                </Link>
                <Link
                  href="/receitas"
                  className="block text-white/90 hover:text-amber-600 hover:bg-white/5 transition-all font-medium py-3 px-4 rounded-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Receitas
                </Link>
                <Link
                  href="/blog"
                  className="block text-white/90 hover:text-amber-600 hover:bg-white/5 transition-all font-medium py-3 px-4 rounded-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Blog
                </Link>
              </div>
              
              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
              
              {/* Action Buttons */}
              <div className="space-y-3">
                <Link
                  href="/login"
                  className="block w-full px-6 py-3.5 border-2 border-amber-600 text-amber-600 font-semibold rounded-lg hover:bg-amber-600 hover:text-black transition-all text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Entrar
                </Link>
                <Link
                  href="/register"
                  className="block w-full px-6 py-3.5 bg-gradient-to-r from-amber-600 to-amber-500 text-black font-bold rounded-lg hover:from-amber-500 hover:to-amber-400 transition-all text-center shadow-lg shadow-amber-600/30"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Assinar Agora
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
