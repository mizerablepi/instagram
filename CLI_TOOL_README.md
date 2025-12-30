# CLI Credential Polling Tool

A command-line tool that polls the `/test/cred` endpoint continuously to monitor and validate credentials (password and OTP).

## Features

- 🔍 **Continuous Polling**: Automatically polls the `/test/cred` endpoint every 2 seconds
- ✅ **Password Validation**: Prompts user to approve or reject passwords
- 🔐 **OTP Monitoring**: After password approval, polls for OTP verification
- 🔄 **Automatic Retry**: Rejecting a password resets the flow and starts polling again
- 🎯 **Interactive CLI**: User-friendly command-line interface with clear prompts

## Workflow

1. **Poll for Password**: The tool continuously polls `/test/cred` until the `password` field is not empty
2. **User Validation**: When a password is received, the user is prompted:
   - Enter `y` → Approves the password (calls `POST /test/approve`) and proceeds to OTP polling
   - Enter `n` → Rejects the password (calls `POST /test/reject`) and restarts from step 1
3. **Poll for OTP**: After password approval, polls `/test/cred` until the `otp` field is not empty
4. **Complete**: Displays both password and OTP, then asks if you want to continue polling

## Usage

### Prerequisites

Make sure the server is running:

```bash
npm run server
```

### Running the CLI Tool

In a separate terminal, run:

```bash
npm run cli
```

### Testing the Workflow

To simulate the credential flow, you can manually update the `test-cred.json` file:

1. **Add a password**:
   ```json
   {
     "password": "test123",
     "otp": "",
     "status": "idle"
   }
   ```

2. The CLI will detect the password and prompt you for validation

3. **After approval, add an OTP**:
   ```json
   {
     "password": "test123",
     "otp": "123456",
     "status": "approved"
   }
   ```

4. The CLI will detect the OTP and complete the flow

## API Endpoints

The CLI tool interacts with these endpoints:

- `GET /test/cred` - Returns current credentials (password, otp, status)
- `POST /test/approve` - Approves the current password
- `POST /test/reject` - Rejects the password and resets credentials

## Configuration

You can modify these constants in `cli-poller.js`:

```javascript
const API_BASE = 'http://localhost:3001';  // Server URL
const POLL_INTERVAL = 2000;                // Polling interval in milliseconds
```

## Exiting

Press `Ctrl+C` at any time to gracefully exit the CLI tool.

## Example Session

```
╔════════════════════════════════════════╗
║   CLI Credential Polling Tool          ║
║   Press Ctrl+C to exit                 ║
╚════════════════════════════════════════╝

🔍 Polling for password...
.....
✅ Password received: mypassword123

❓ Is the password valid? (y/n): y
✅ Password approved

🔍 Polling for OTP...
....
✅ OTP received: 123456

✅ OTP verification complete!
   Password: mypassword123
   OTP: 123456

❓ Continue polling for next credential? (y/n): n

👋 Exiting CLI tool...
```
