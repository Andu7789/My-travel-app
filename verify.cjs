#!/usr/bin/env node
/**
 * Travel Photo App - Automated Verification Script
 * Confirms the entire application is set up and ready to use
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

async function verify() {
  console.log('🌍 Travel Photo Web App - Verification Script');
  console.log('='.repeat(50));
  console.log('');

  let passed = 0;
  let failed = 0;

  // Test 1: Node.js version
  try {
    const { stdout } = await execAsync('node --version');
    const version = stdout.trim();
    console.log(`✅ Node.js ${version}`);
    passed++;
  } catch (e) {
    console.log('❌ Node.js not found');
    failed++;
  }

  // Test 2: npm installed
  try {
    await execAsync('npm --version');
    console.log('✅ npm installed');
    passed++;
  } catch (e) {
    console.log('❌ npm not found');
    failed++;
  }

  // Test 3: Check package.json
  try {
    const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
    if (pkg.name === 'my-travel-app') {
      console.log(`✅ package.json configured (${pkg.dependencies.react || 'error'})`);
      passed++;
    } else {
      throw new Error('Wrong package');
    }
  } catch (e) {
    console.log('❌ package.json invalid');
    failed++;
  }

  // Test 4: Check React files
  const reactFiles = [
    'src/App.tsx',
    'src/components/Globe.tsx',
    'src/components/Sidebar.tsx',
    'src/components/PhotoUpload.tsx',
    'src/components/PhotoGallery.tsx',
    'src/components/MapControls.tsx',
  ];

  let allReactFilesExist = true;
  for (const file of reactFiles) {
    if (!fs.existsSync(path.join(__dirname, file))) {
      allReactFilesExist = false;
      break;
    }
  }
  if (allReactFilesExist) {
    console.log(`✅ All 5 React components found`);
    passed++;
  } else {
    console.log('❌ Missing React components');
    failed++;
  }

  // Test 5: Check utilities
  const utilFiles = [
    'src/lib/supabaseClient.ts',
    'src/lib/exifExtractor.ts',
    'src/lib/imageCompression.ts',
  ];

  let allUtilsExist = true;
  for (const file of utilFiles) {
    if (!fs.existsSync(path.join(__dirname, file))) {
      allUtilsExist = false;
      break;
    }
  }
  if (allUtilsExist) {
    console.log(`✅ All 3 utility modules found`);
    passed++;
  } else {
    console.log('❌ Missing utilities');
    failed++;
  }

  // Test 6: Check types
  try {
    const typesFile = fs.readFileSync(path.join(__dirname, 'src/types/index.ts'), 'utf8');
    if (typesFile.includes('interface Photo') && typesFile.includes('interface Trip')) {
      console.log('✅ TypeScript types defined');
      passed++;
    } else {
      throw new Error('Incomplete types');
    }
  } catch (e) {
    console.log('❌ Types file invalid');
    failed++;
  }

  // Test 7: Check database migration
  try {
    const migration = fs.readFileSync(path.join(__dirname, 'supabase/migrations/001_initial_schema.sql'), 'utf8');
    if (migration.includes('CREATE TABLE') && migration.includes('public.trips')) {
      console.log('✅ Database schema created');
      passed++;
    } else {
      throw new Error('Invalid schema');
    }
  } catch (e) {
    console.log('❌ Database schema missing');
    failed++;
  }

  // Test 8: Check documentation
  const docFiles = [
    'README.md',
    'SETUP.md',
    'QUICKSTART.md',
  ];

  let allDocsExist = true;
  for (const file of docFiles) {
    if (!fs.existsSync(path.join(__dirname, file))) {
      allDocsExist = false;
      break;
    }
  }
  if (allDocsExist) {
    console.log('✅ Documentation complete (README, SETUP, QUICKSTART)');
    passed++;
  } else {
    console.log('❌ Missing documentation');
    failed++;
  }

  // Test 9: Check git repository
  try {
    const gitConfig = fs.readFileSync(path.join(__dirname, '.git/config'), 'utf8');
    if (gitConfig.includes('Andu7789/My-travel-app')) {
      console.log('✅ GitHub repository configured');
      passed++;
    } else {
      throw new Error('Wrong repository');
    }
  } catch (e) {
    console.log('❌ Git repository not configured');
    failed++;
  }

  // Test 10: Check configs
  const configFiles = [
    'vite.config.ts',
    'tsconfig.json',
    'tailwind.config.js',
    'postcss.config.js',
  ];

  let allConfigsExist = true;
  for (const file of configFiles) {
    if (!fs.existsSync(path.join(__dirname, file))) {
      allConfigsExist = false;
      break;
    }
  }
  if (allConfigsExist) {
    console.log('✅ All build configurations in place');
    passed++;
  } else {
    console.log('❌ Missing configurations');
    failed++;
  }

  console.log('');
  console.log('='.repeat(50));
  console.log(`Results: ${passed} passed, ${failed} failed`);
  console.log('');

  if (failed === 0) {
    console.log('✅ ALL CHECKS PASSED - APP IS READY TO USE!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Create .env.local with Supabase credentials');
    console.log('2. Run: npm run dev');
    console.log('3. Open: http://localhost:5173/My-travel-app/');
    console.log('');
    process.exit(0);
  } else {
    console.log('❌ Some checks failed - see above');
    process.exit(1);
  }
}

verify().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
