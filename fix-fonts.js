import fs from 'fs';
import path from 'path';

const dir = path.join(process.cwd(), 'components/templates');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Remove all @import urls for fonts
  content = content.replace(/@import url\('https:\/\/fonts\.googleapis\.com[^)]+'\);/g, '');

  // Replace font families
  content = content.replace(/fontFamily:\s*["']'Great Vibes',cursive["']/g, "fontFamily: 'var(--font-great-vibes), cursive'");
  content = content.replace(/fontFamily:\s*["']'Cormorant Garamond',serif["']/g, "fontFamily: 'var(--font-cormorant), serif'");
  content = content.replace(/fontFamily:\s*["']'Lato',sans-serif["']/g, "fontFamily: 'var(--font-lato), sans-serif'");
  content = content.replace(/fontFamily:\s*["']'Cinzel',serif["']/g, "fontFamily: 'var(--font-cinzel), serif'");
  content = content.replace(/fontFamily:\s*["']'Dancing Script',cursive["']/g, "fontFamily: 'var(--font-dancing), cursive'");
  content = content.replace(/fontFamily:\s*["']'Montserrat',sans-serif["']/g, "fontFamily: 'var(--font-montserrat), sans-serif'");
  content = content.replace(/fontFamily:\s*["']'Quicksand',sans-serif["']/g, "fontFamily: 'var(--font-quicksand), sans-serif'");
  content = content.replace(/fontFamily:\s*["']'Inter',sans-serif["']/g, "fontFamily: 'var(--font-inter), sans-serif'");
  content = content.replace(/fontFamily:\s*["']'Space Grotesk',sans-serif["']/g, "fontFamily: 'var(--font-space), sans-serif'");
  content = content.replace(/fontFamily:\s*["']'Lilita One',cursive["']/g, "fontFamily: 'var(--font-lilita), cursive'");
  content = content.replace(/fontFamily:\s*["']'Pacifico',cursive["']/g, "fontFamily: 'var(--font-pacifico), cursive'");
  content = content.replace(/fontFamily:\s*["']'Playfair Display',serif["']/g, "fontFamily: 'var(--font-playfair), serif'");
  content = content.replace(/fontFamily:\s*["']'Nunito',sans-serif["']/g, "fontFamily: 'var(--font-nunito), sans-serif'");

  // Add the classNames to the root if not present
  // This is a bit tricky, so we'll just inject all variables into the root div or just export them from layout
  
  fs.writeFileSync(filePath, content, 'utf-8');
}

console.log('Fonts replaced.');
