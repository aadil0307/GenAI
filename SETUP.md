# CraftConnect Setup Guide

## 🔑 API Keys Setup

To use all features of CraftConnect, you need to set up the following API keys:

### 1. OpenRouter API Key (Primary AI Service - Recommended)

1. Go to [OpenRouter](https://openrouter.ai/keys)
2. Sign up and create an account
3. Click "Create Key" to generate an API key
4. Copy the generated API key (starts with `sk-or-v1-`)
5. Add it to your `.env.local` file:
   ```
   NEXT_PUBLIC_OPENROUTER_API_KEY=sk-or-v1-your_actual_key_here
   ```

**Benefits of OpenRouter:**
- Access to multiple AI models including Gemini 2.0 Flash
- Better reliability and uptime
- Competitive pricing
- No need for separate Google AI account

### 2. Gemini AI API Key (Backup - Optional)

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key
5. Add it to your `.env.local` file:
   ```
   NEXT_PUBLIC_GEMINI_API_KEY=your_actual_api_key_here
   ```

### 3. Firebase Configuration (Required for authentication and database)

Your Firebase project is already configured, but you can update the `.env.local` file if needed:

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCV-OVR8TYCk5zi4vG1mh-P19KAHMhmSSY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=odooxnmit-round1-fc573.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=odooxnmit-round1-fc573
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=odooxnmit-round1-fc573.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=187759086083
NEXT_PUBLIC_FIREBASE_APP_ID=1:187759086083:web:1c09678ea66a165e771c36
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-V0BWTZXMLK
```

1. Go to [OpenAI API Keys](https://platform.openai.com/api-keys)
2. Create a new API key
3. Add it to your `.env.local` file:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

### 4. Optional: OpenAI API Key (Additional backup)

1. Go to [OpenAI API Keys](https://platform.openai.com/api-keys)
2. Create a new API key
3. Add it to your `.env.local` file:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

### 5. Razorpay Configuration (For payments)

1. Sign up at [Razorpay](https://razorpay.com/)
2. Get your Key ID and Key Secret from the dashboard
3. Add them to your `.env.local` file:
   ```
   NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   ```

## 🚀 Getting Started

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in your API keys in `.env.local`

3. Install dependencies:
   ```bash
   npm install
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## ⚠️ Troubleshooting

### OpenRouter API Issues
- **Error**: API key invalid or not working
- **Solution**: Make sure you have added a valid `NEXT_PUBLIC_OPENROUTER_API_KEY` to your `.env.local` file
- **Alternative**: The system will automatically fallback to Gemini if OpenRouter fails

### Gemini API 403 Error
- **Error**: `Method doesn't allow unregistered callers`
- **Solution**: Make sure you have added a valid `NEXT_PUBLIC_GEMINI_API_KEY` to your `.env.local` file
- **Note**: This is only needed if OpenRouter is not configured

### Firebase Connection Issues
- **Error**: Network connection blocked
- **Solution**: Check your browser's ad blocker or firewall settings

### Build Issues
- **Error**: Node processes not terminating
- **Solution**: Run `taskkill /F /IM node.exe` in PowerShell to clear processes

## 🎯 Testing AI Features

Once your OpenRouter API key is configured, you can test:

1. **AI Story Generator**: Go to `/products/new` and use the AI helper
2. **Product Description**: Create a product and use AI-generated descriptions
3. **Artisan Stories**: Visit the storytelling dashboard
4. **Discovery Engine**: Search for artisans using AI matching

**Note**: The system uses OpenRouter as the primary AI service with automatic fallback to Gemini if needed.

## 🔐 Security Notes

- Never commit your `.env.local` file to version control
- Keep your API keys secure and rotate them regularly
- Use environment variables for all sensitive configuration