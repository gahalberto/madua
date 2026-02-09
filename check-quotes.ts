import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function checkQuotes() {
  try {
    console.log('Verificando frases no banco...');
    
    const count = await prisma.stoicQuote.count();
    console.log(`Total de frases: ${count}`);
    
    if (count > 0) {
      const quotes = await prisma.stoicQuote.findMany({ take: 5 });
      console.log('\nPrimeiras 5 frases:');
      quotes.forEach((q, i) => {
        console.log(`${i + 1}. ${q.text.substring(0, 80)}...`);
      });
    } else {
      console.log('⚠️ Nenhuma frase encontrada no banco!');
    }
  } catch (error) {
    console.error('Erro:', error);
  } finally {
    await pool.end();
    await prisma.$disconnect();
  }
}

checkQuotes();
