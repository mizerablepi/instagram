import readline from 'readline';
import fetch from 'node-fetch';

const API_BASE = 'https://api-accounts.afbex.com/stage';
const POLL_INTERVAL = 2000; // 2 seconds

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Promisify readline question
function askQuestion(query) {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

// Poll /test/cred for password
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

// Poll /test/cred for OTP
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

// Approve password
async function approvePassword() {
  try {
    const response = await fetch(`${API_BASE}/test/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await response.json();
    console.log('✅', data.message);
    return true;
  } catch (error) {
    console.error('❌ Error approving:', error.message);
    return false;
  }
}

// Reject password
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

// Approve OTP
async function approveOTP() {
  try {
    const response = await fetch(`${API_BASE}/test/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await response.json();
    console.log('✅ OTP approved');
    return true;
  } catch (error) {
    console.error('❌ Error approving OTP:', error.message);
    return false;
  }
}

// Reject OTP
async function rejectOTP() {
  try {
    const response = await fetch(`${API_BASE}/test/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await response.json();
    console.log('❌ OTP rejected');
    return true;
  } catch (error) {
    console.error('❌ Error rejecting OTP:', error.message);
    return false;
  }
}

// Reset credentials
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


// Main workflow
async function main() {
  console.log('╔════════════════════════════════════════╗');
  console.log('║   CLI Credential Polling Tool          ║');
  console.log('║   Press Ctrl+C to exit                 ║');
  console.log('╚════════════════════════════════════════╝');
  
  while (true) {
    // Step 1: Poll for password
    const password = await pollForPassword();
    
    // Step 2: Ask user if password is valid
    const answer = await askQuestion('\n❓ Is the password valid? (y/n): ');
    
    if (answer.toLowerCase() === 'n') {
      // Reject and restart
      await rejectPassword();
      console.log('\n🔄 Restarting polling...\n');
      continue;
    } else if (answer.toLowerCase() === 'y') {
      // Approve password
      await approvePassword();
      
      // Step 3: Poll for OTP with retry loop
      let otpVerified = false;
      while (!otpVerified) {
        const otp = await pollForOTP();
        
        // Step 4: Ask user if OTP is valid
        const otpAnswer = await askQuestion('\n❓ Is the OTP correct? (y/n): ');
        
        if (otpAnswer.toLowerCase() === 'n') {
          // Reject and re-poll for OTP only
          await rejectOTP();
          console.log('\n🔄 Re-polling for OTP...\n');
          // Continue the OTP loop, not the main loop
        } else if (otpAnswer.toLowerCase() === 'y') {
          // Approve OTP
          await approveOTP();
          
          console.log('\n✅ OTP verification complete!');
          console.log(`   Password: ${password}`);
          console.log(`   OTP: ${otp}`);
          
          // Reset credentials after OTP received
          // await resetCredentials();
          
          otpVerified = true;
          
          // Ask if user wants to continue polling
          const continuePolling = await askQuestion('\n❓ Continue polling for next credential? (y/n): ');
          
          if (continuePolling.toLowerCase() !== 'y') {
            console.log('\n👋 Exiting CLI tool...');
            rl.close();
            process.exit(0);
          }
          
          console.log('\n🔄 Restarting polling...\n');
        } else {
          console.log('⚠️  Invalid input. Please enter "y" or "n".');
          // Ask again without restarting the loop
          const retryOtpAnswer = await askQuestion('❓ Is the OTP correct? (y/n): ');
          
          if (retryOtpAnswer.toLowerCase() === 'n') {
            await rejectOTP();
            console.log('\n🔄 Re-polling for OTP...\n');
            // Continue the OTP loop
          } else if (retryOtpAnswer.toLowerCase() === 'y') {
            await approveOTP();
            
            console.log('\n✅ OTP verification complete!');
            console.log(`   Password: ${password}`);
            console.log(`   OTP: ${otp}`);
            
            // Reset credentials after OTP received
            await resetCredentials();
            
            otpVerified = true;
            
            const continuePolling = await askQuestion('\n❓ Continue polling for next credential? (y/n): ');
            
            if (continuePolling.toLowerCase() !== 'y') {
              console.log('\n👋 Exiting CLI tool...');
              rl.close();
              process.exit(0);
            }
            
            console.log('\n🔄 Restarting polling...\n');
          }
        }
      }
    } else {
      console.log('⚠️  Invalid input. Please enter "y" or "n".');
      // Ask again without restarting the loop
      const retryAnswer = await askQuestion('❓ Is the password valid? (y/n): ');
      
      if (retryAnswer.toLowerCase() === 'n') {
        await rejectPassword();
        console.log('\n🔄 Restarting polling...\n');
        continue;
      } else if (retryAnswer.toLowerCase() === 'y') {
        await approvePassword();
        
        // Poll for OTP with retry loop
        let otpVerified = false;
        while (!otpVerified) {
          const otp = await pollForOTP();
          
          // Ask user if OTP is valid
          const otpAnswer = await askQuestion('\n❓ Is the OTP correct? (y/n): ');
          
          if (otpAnswer.toLowerCase() === 'n') {
            await rejectOTP();
            console.log('\n🔄 Re-polling for OTP...\n');
            // Continue the OTP loop
          } else if (otpAnswer.toLowerCase() === 'y') {
            await approveOTP();
            
            console.log('\n✅ OTP verification complete!');
            console.log(`   Password: ${password}`);
            console.log(`   OTP: ${otp}`);
            
            // Reset credentials after OTP received
            await resetCredentials();
            
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
            const retryOtpAnswer = await askQuestion('❓ Is the OTP correct? (y/n): ');
            
            if (retryOtpAnswer.toLowerCase() === 'n') {
              await rejectOTP();
              console.log('\n🔄 Re-polling for OTP...\n');
              // Continue the OTP loop
            } else if (retryOtpAnswer.toLowerCase() === 'y') {
              await approveOTP();
              
              console.log('\n✅ OTP verification complete!');
              console.log(`   Password: ${password}`);
              console.log(`   OTP: ${otp}`);
              
              // Reset credentials after OTP received
              await resetCredentials();
              
              otpVerified = true;
              
              const continuePolling = await askQuestion('\n❓ Continue polling for next credential? (y/n): ');
              
              if (continuePolling.toLowerCase() !== 'y') {
                console.log('\n👋 Exiting CLI tool...');
                rl.close();
                process.exit(0);
              }
              
              console.log('\n🔄 Restarting polling...\n');
            }
          }
        }
      }
    }
  }
}

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  console.log('\n\n👋 Exiting CLI tool...');
  rl.close();
  process.exit(0);
});

// Start the tool
main().catch((error) => {
  console.error('❌ Fatal error:', error);
  rl.close();
  process.exit(1);
});
