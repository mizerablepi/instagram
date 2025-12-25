# Manual Password Verification System

## How It Works

1. **User submits password** → Frontend sends it to backend
2. **Backend saves to `auth-status.json`** with status "pending"
3. **You manually verify** by checking your handbook
4. **You edit `auth-status.json`** to change status to "approved" or "rejected"
5. **Frontend polls every 2 seconds** and shows the result

## Setup & Usage

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the Backend Server

In one terminal:

```bash
npm run server
```

### 3. Start the Frontend

In another terminal:

```bash
npm run dev
```

### 4. Manual Verification Process

When a user submits their password:

1. The backend console will show:

   ```
   🔐 NEW PASSWORD SUBMISSION 🔐
   Password: [the password they entered]
   Status: PENDING
   ```

2. Check your handbook to verify if the password is correct

3. Open `auth-status.json` in the project root

4. Change the `status` field:

   - `"approved"` - if password is correct
   - `"rejected"` - if password is wrong

5. Save the file - the frontend will automatically detect the change!

## Example `auth-status.json`

**Pending:**

```json
{
  "status": "pending",
  "password": "test123",
  "timestamp": "2025-12-25T17:52:00.000Z"
}
```

**Approved:**

```json
{
  "status": "approved",
  "password": "test123",
  "timestamp": "2025-12-25T17:52:00.000Z"
}
```

**Rejected:**

```json
{
  "status": "rejected",
  "password": "test123",
  "timestamp": "2025-12-25T17:52:00.000Z"
}
```

## Frontend States

- **Idle**: Normal login button
- **Pending**: Shows "⏳ Verifying..." with pulsing animation
- **Approved**: Shows "✓ Approved!" in green, then proceeds to OTP screen
- **Rejected**: Shows "✗ Rejected" in red, resets after 3 seconds

## Tips

- Keep the backend terminal visible to see new password submissions
- The frontend polls every 2 seconds, so there's a slight delay after you approve/reject
- You can reset the status by calling `POST http://localhost:3001/reset` or just editing the JSON file
