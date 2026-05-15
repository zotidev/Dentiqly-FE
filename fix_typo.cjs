const fs = require('fs');
const path = require('path');
const dir = './src/components/landing/sections';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes(']]')) {
    content = content.replace(/\]\]/g, ']');
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed typo in ' + file);
  }
}
