import fs from 'fs';
import path from 'path';

const dirs = [
  'src/views',
  'src/sections',
  'src/components'
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  let modified = false;

  // Regex to match <a ... href="/..." ...> or <a ... href="#..." ...>
  // It needs to handle multiline <a ...> tags.
  // This is tricky. Let's use a simple approach:
  // Find all <a ...> tags. If they contain href="/..." or href="#...", replace <a with <Link and </a> with </Link>.
  
  // A simpler regex: match <a ...> where href starts with / or #
  // and doesn't have target="_blank"
  
  const aTagRegex = /<a(\s+[^>]*?href=(?:'|")(\/|#)[^>]*?)>/g;
  
  content = content.replace(aTagRegex, (match, p1, p2) => {
    return `<Link${p1}>`;
  });

  if (content !== originalContent) {
    // Also need to replace </a> with </Link> for the ones we changed.
    // Since it's hard to track which </a> matches which <a>, 
    // a safe bet is to replace all </a> if the file has any <Link
    // BUT what if there are external <a> tags? They still need </a>.
    // This is why AST is better, but since it's Next.js, we can just replace ALL internal links manually or use a slightly smarter approach.
  }
}

console.log("Script created.");
