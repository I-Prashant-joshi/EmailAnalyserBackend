# Email Analysis Backend

## Setup Instructions

1. Install dependencies:
```bash
cd server
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your email credentials
```

3. Start MongoDB locally:
```bash
mongod
```

4. Run the server:
```bash
npm run dev
```

## Email Credentials Setup

### Gmail Setup
1. Enable 2-factor authentication
2. Generate an App Password:
   - Go to Google Account settings
   - Security → App passwords
   - Generate password for "Mail"
   - Use this as EMAIL_PASSWORD

### IMAP Configuration
- Gmail: imap.gmail.com:993
- Outlook: outlook.office365.com:993
- Yahoo: imap.mail.yahoo.com:993

## API Endpoints

- `GET /api/test` - Health check
- `POST /api/fetch-email` - Fetch and analyze email
- `GET /api/emails` - Get analysis history

## Production Deployment

For production, uncomment the real IMAP code in `imap-config.js` and ensure proper error handling and security measures are in place.