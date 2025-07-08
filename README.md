# Voice Decoder App

### Live Demo: https://voice-decoder.vercel.app

Voice Decoder is a web application that allows users to upload audio files, decode their content into text, and manage their audio records. The app features user authentication, a simple dashboard for viewing and managing uploads, and supports payment for advanced features.

## Tech Stack

- Frontend: Next.js, TypeScript, TailwindCSS, Zustand
- Backend: Next.js API Routes
- Database: PostgreSQL
- ORM: Prisma
- File Storage: Vercel Blob
- Authentication: Clerk
- Speech-to-Text API: AssemblyAI
- Payments: Stripe

## Installation

1. Clone the repository:
```bash
git clone https://github.com/d-art3m/voice-decoder
```

2. Install dependencies:
```bash
npm install
```

3. Create your `.env` file

4. Open the `.env` file and configure the following environment variables:
```bash
NODE_ENV=
NEXT_PUBLIC_BASE_URL=

DATABASE_URL=

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

BLOB_READ_WRITE_TOKEN=

ASSEMBLY_AI_TOKEN=

STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

5. Run the development server:
```bash
npm run dev
```