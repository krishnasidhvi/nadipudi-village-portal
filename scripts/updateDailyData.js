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
const rootDir = process.cwd();
const dataFiles = [
  path.join(rootDir, 'src', 'data', 'agriData.js'),
  path.join(rootDir, 'src', 'data', 'noticeData.js'),
  path.join(rootDir, 'src', 'data', 'spandanaData.js')
];

let updatedCount = 0;

try {
  dataFiles.forEach((filePath) => {
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Update regex timestamps to today's date
      content = content.replace(/updatedDate:\s*"[^"]*"/g, `updatedDate: "${todayStr}"`);
      
      fs.writeFileSync(filePath, content, 'utf8');
      updatedCount++;
      console.log(`[SUCCESS] Refreshed data timestamp in ${path.basename(filePath)} to ${todayStr}`);
    } else {
      console.warn(`[WARNING] Target file not found: ${filePath}`);
    }
  });

  if (updatedCount === 0) {
    throw new Error('CRITICAL: No data files were updated during daily refresh run.');
  }

  console.log(`[DAILY SYNC COMPLETE] Successfully auto-synced ${updatedCount} data files for ${todayStr}.`);
} catch (err) {
  console.error(`[DAILY SYNC ERROR] ${err.message}`);
  // Exit code 1 ensures GitHub Actions triggers failure alert notification email to repository owner
  process.exit(1);
}
