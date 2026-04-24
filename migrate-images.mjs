import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        const dirPath = path.join(dir, f);
        if (fs.statSync(dirPath).isDirectory()) walkDir(dirPath, callback);
        else callback(dirPath);
    });
}

const extractAttributes = (tag) => {
    const srcMatch = tag.match(/src=\{([^}]+)\}/) || tag.match(/src="([^"]+)"/);
    const altMatch = tag.match(/alt=\{([^}]+)\}/) || tag.match(/alt="([^"]+)"/);
    const clsMatch = tag.match(/className=\{([^}]+)\}/) || tag.match(/className="([^"]+)"/);
    
    // priority is important for Hero
    const priorityMatch = tag.match(/fetchPriority="high"/);
    
    return {
        srcRaw: srcMatch ? srcMatch[0] : '',
        altRaw: altMatch ? altMatch[0] : 'alt=""',
        clsRaw: clsMatch ? clsMatch[0] : 'className="object-cover"',
        hasPriority: !!priorityMatch
    };
};

let filesChanged = 0;

walkDir('./src', (filePath) => {
    if (!filePath.endsWith('.tsx') && !filePath.endsWith('.jsx')) return;
    let content = fs.readFileSync(filePath, 'utf8');

    if (content.includes('<img')) {
        let modified = false;
        
        // Regex to match <img ... /> or <img ...>
        content = content.replace(/<img[\s\S]*?(?:\/>|>)/g, (match) => {
            if (match.includes('next/image')) return match; // skip if already next/image visually?
            
            const attrs = extractAttributes(match);
            
            const sizeProp = 'sizes="(max-width: 768px) 100vw, 100vw"';
            const priorityProp = attrs.hasPriority ? 'priority' : '';
            
            modified = true;
            return `<Image ${attrs.srcRaw} ${attrs.altRaw} fill ${sizeProp} ${priorityProp} ${attrs.clsRaw} />`;
        });

        if (modified) {
            // inject import Image from 'next/image'; if not present
            if (!content.includes("from 'next/image'") && !content.includes('from "next/image"')) {
                // Insert after the last import, or at the top
                const lines = content.split('\n');
                const lastImportIndex = lines.reduce((acc, line, i) => line.startsWith('import ') ? i : acc, -1);
                if (lastImportIndex !== -1) {
                    lines.splice(lastImportIndex + 1, 0, "import Image from 'next/image';");
                } else {
                    lines.unshift("import Image from 'next/image';");
                }
                content = lines.join('\n');
            }
            fs.writeFileSync(filePath, content, 'utf8');
            filesChanged++;
            console.log(`Updated ${filePath}`);
        }
    }
});

console.log(`Total files updated: ${filesChanged}`);
