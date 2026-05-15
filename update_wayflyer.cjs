const fs = require('fs');
const path = require('path');
const dirs = ['./src/components/landing/sections', './src/components/landing'];

function processDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));
  for (const file of files) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    let changed = false;
    
    // Update button classes
    const oldClasses = ['btn-premium-primary', 'btn-premium-secondary', 'btn-premium-accent', 'btn-premium-celeste'];
    oldClasses.forEach(c => {
      const regex = new RegExp(c, 'g');
      if (regex.test(content)) {
        if (c === 'btn-premium-primary') {
           content = content.replace(regex, 'btn-wayflyer-primary');
        } else {
           content = content.replace(regex, 'btn-wayflyer-secondary');
        }
        changed = true;
      }
    });

    // Update tracking and weight for headings
    const headingRegex = /className="([^"]*(?:text-(?:3xl|4xl|5xl|6xl|7xl|\[[0-9.]+rem\]|\[[0-9]+px\]))[^"]*)"/g;
    content = content.replace(headingRegex, (match, classNames) => {
      let newClassNames = classNames;
      
      // Weight 600
      newClassNames = newClassNames.replace(/\bfont-(normal|extrabold|bold|medium)\b/g, 'font-semibold');
      if (!newClassNames.includes('font-semibold')) {
          newClassNames += ' font-semibold';
      }

      // Tracking -3px for large, -2px for medium
      if (newClassNames.includes('text-5xl') || newClassNames.includes('text-6xl') || newClassNames.includes('text-7xl') || newClassNames.includes('rem]') || newClassNames.includes('56px')) {
          newClassNames = newClassNames.replace(/\btracking-[a-z0-9.\[\]-]+\b/g, 'tracking-[-3px]');
          if (!newClassNames.includes('tracking-[-3px]')) newClassNames += ' tracking-[-3px]';
      } else {
          newClassNames = newClassNames.replace(/\btracking-[a-z0-9.\[\]-]+\b/g, 'tracking-[-2px]');
          if (!newClassNames.includes('tracking-[-2px]')) newClassNames += ' tracking-[-2px]';
      }

      if (newClassNames !== classNames) {
        changed = true;
        return `className="${newClassNames}"`;
      }
      return match;
    });

    if (changed) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Updated ' + file);
    }
  }
}

dirs.forEach(processDir);
