import fs from 'fs';

const filePath = 'src/app/globals.css';
let content = fs.readFileSync(filePath, 'utf8');

// Remove @layer base { ... }
// This regex is a bit simplistic but should work for this file structure
content = content.replace(/@layer base \{([\s\S]*?)\n\}/g, '$1');

// Remove @layer components { ... }
content = content.replace(/@layer components \{([\s\S]*?)\n\}/g, '$1');

// Remove @layer utilities { ... }
content = content.replace(/@layer utilities \{([\s\S]*?)\n\}/g, '$1');

// Fix :root double braces if any
content = content.replace(/:root \{\s+:root \{/g, ':root {');

fs.writeFileSync(filePath, content);
console.log('globals.css updated for Tailwind v4');
