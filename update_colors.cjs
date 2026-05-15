const fs = require('fs');
const path = require('path');
const dir = './src/components/landing/sections';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

const colorMap = {
  '#02E3FF': '#0047FF', // Celeste -> Vivid Blue
  '#0B1023': '#0A0F2D', // Legacy Navy -> Dark Navy
  '#0b1023': '#0A0F2D',
  'bg-navy': 'bg-[#0A0F2D]',
  'text-celeste': 'text-[#0047FF]',
  'bg-celeste': 'bg-[#0047FF]',
};

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  
  for (const [oldC, newC] of Object.entries(colorMap)) {
    const regex = new RegExp(oldC, 'gi');
    if (regex.test(content)) {
      content = content.replace(regex, newC);
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated colors in ' + file);
  }
}
