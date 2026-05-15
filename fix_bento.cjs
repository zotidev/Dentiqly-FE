const fs = require('fs');
const path = require('path');
const file = './src/components/landing/sections/BentoGridSection.tsx';

let content = fs.readFileSync(file, 'utf8');

// Replace sky and blue accents with brand blue/navy
content = content.replace(/text-blue-500/g, 'text-[#0047FF]');
content = content.replace(/text-blue-600/g, 'text-[#0A0F2D]');
content = content.replace(/text-sky-600/g, 'text-[#0047FF]');
content = content.replace(/bg-blue-50/g, 'bg-[#0047FF]/10');
content = content.replace(/bg-sky-50/g, 'bg-[#0047FF]/10');

fs.writeFileSync(file, content, 'utf8');
console.log('Updated BentoGridSection colors');
