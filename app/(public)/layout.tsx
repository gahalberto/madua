import { ReactNode } from "react";
import Link from "next/link";
import { Instagram } from "lucide-react";
import { Navbar } from "@/components/public/Navbar";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Conteúdo Principal */}
      <main className="flex-1 pt-20">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-[#121212] border-t border-[#1F1F1F] mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Coluna 1 - Sobre */}
            <div>
              <h3 className="text-accent font-bold text-xl mb-4">MADUA</h3>
              <p className="text-foreground-muted text-sm">
                Resgate sua saúde ancestral através da alimentação tradicional e práticas atemporais.
              </p>
            </div>

            {/* Coluna 2 - Links Rápidos */}
            <div>
              <h4 className="text-foreground font-semibold mb-4">Links Rápidos</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/sobre" className="text-foreground-muted hover:text-accent transition-colors text-sm">
                    Sobre Nós
                  </Link>
                </li>
                <li>
                  <Link href="/receitas" className="text-foreground-muted hover:text-accent transition-colors text-sm">
                    Receitas
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-foreground-muted hover:text-accent transition-colors text-sm">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/termos" className="text-foreground-muted hover:text-accent transition-colors text-sm">
                    Termos de Uso
                  </Link>
                </li>
              </ul>
            </div>

            {/* Coluna 3 - Redes Sociais */}
            <div>
              <h4 className="text-foreground font-semibold mb-4">Siga-nos</h4>
              <div className="flex items-center space-x-4">
                <a
                  href="https://instagram.com/madua"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-foreground-muted hover:text-accent transition-colors"
                >
                  <Instagram size={20} />
                  <span className="text-sm">@madua</span>
                </a>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-8 pt-8 border-t border-[#1F1F1F] text-center">
            <p className="text-foreground-muted text-sm">
              © {new Date().getFullYear()} MADUA. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
