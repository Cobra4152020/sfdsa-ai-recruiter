const { execSync } = require('child_process');
const path = require('path');

// Set environment variables to disable WebAssembly
process.env.NODE_OPTIONS = '--no-wasm-code-gc';

try {
  console.log('Cleaning build cache...');
  execSync('rmdir /s /q .next', { stdio: 'inherit' });
  
  console.log('Building project...');
  // Use the next command from node_modules/.bin
  const nextBinPath = path.resolve('./node_modules/.bin/next');
  execSync(`"${nextBinPath}" build`, { 
    stdio: 'inherit',
    env: {
      ...process.env,
      NEXT_DISABLE_WASM: 'true',
      NODE_OPTIONS: '--no-wasm-code-gc',
    }
  });
  
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}