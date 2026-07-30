import fs from 'fs';
import path from 'path';

// Helper to format date as DD-MM-YYYY
function getTodayDateString() {
  const d = new Date();
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

const todayStr = getTodayDateString();

const agriDataPath = path.join(process.cwd(), 'src', 'data', 'agriData.js');

if (fs.existsSync(agriDataPath)) {
  let content = fs.readFileSync(agriDataPath, 'utf8');

  // Regex update updatedDate field to today's date
  content = content.replace(/updatedDate:\s*"[^"]*"/g, `updatedDate: "${todayStr}"`);

  fs.writeFileSync(agriDataPath, content, 'utf8');
  console.log(`[SUCCESS] Updated daily agricultural data timestamp to ${todayStr}`);
} else {
  console.error('[ERROR] agriData.js not found');
}
