const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);
require('dotenv').config();

async function applyFix() {
  try {
    console.log('Building the shared package...');
    await execAsync('pnpm build', { 
      cwd: 'c:\\Users\\Sinap\\OneDrive\\WORK\\MACHINE LEARNING\\MACHINE LEARNING\\Website\\ZOROASTERVERSE\\packages\\shared',
      shell: 'powershell.exe'
    });
    console.log('Shared package built successfully');

    console.log('Applying database migration...');
    const { stdout, stderr } = await execAsync('supabase migration up', {
      cwd: 'c:\\Users\\Sinap\\OneDrive\\WORK\\MACHINE LEARNING\\MACHINE LEARNING\\Website\\ZOROASTERVERSE',
      shell: 'powershell.exe'
    });
    
    console.log('Migration output:', stdout);
    if (stderr) {
      console.error('Migration errors:', stderr);
    }
    
    console.log('Database migration applied successfully');
    console.log('Please restart your development server for the changes to take effect');
  } catch (error) {
    console.error('Error applying fix:', error);
    process.exit(1);
  }
}

applyFix();
