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
        isScrolled
          ? 'bg-black/80 backdrop-blur-md border-b border-white/10'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl sm:text-2xl font-bold text-amber-600">MADUA</span>
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
          <div className="md:hidden py-4 border-t border-white/10 bg-black/95 backdrop-blur-md">
            <div className="flex flex-col space-y-4">
              <Link
                href="/sobre"
                className="text-white/80 hover:text-amber-600 transition-colors font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Manifesto
              </Link>
              <Link
                href="/receitas"
                className="text-white/80 hover:text-amber-600 transition-colors font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Receitas
              </Link>
              <Link
                href="/blog"
                className="text-white/80 hover:text-amber-600 transition-colors font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Blog
              </Link>
              
              <div className="flex flex-col space-y-3 pt-4">
                <Link
                  href="/login"
                  className="px-6 py-2.5 border-2 border-amber-600 text-amber-600 font-semibold rounded-lg hover:bg-amber-600 hover:text-black transition-all text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Entrar
                </Link>
                <Link
                  href="/register"
                  className="px-6 py-2.5 bg-amber-600 text-black font-bold rounded-lg hover:bg-amber-500 transition-all text-center shadow-lg shadow-amber-600/20"
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
