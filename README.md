# AutomateFlow

**A modern, AI-powered workflow automation platform.**
*Build powerful automation workflows with natural language, just like Zapier but backed by AI.*

![Project Status](https://img.shields.io/badge/Status-MVP-success)
![License](https://img.shields.io/badge/License-MIT-blue)
![Next.js](https://img.shields.io/badge/Next.js-14.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)

## ✨ Features

- **🤖 AI Workflow Generation**: Type a prompt like *"Email me when a lead signs up"* and watch the system generate the nodes automatically using OpenAI.
- **🎨 Drag-and-Drop Canvas**: Professional-grade orchestration built on React Flow. Drag, connect, and configure nodes seamlessly.
- **🌑 Dark Mode Support**: Fully responsive UI with automatic theme switching (Sun/Moon toggle).
- **💾 Persistent Storage**: Saves workflow states, node positions, and configurations to PostgreSQL via Supabase.
- **⚡ Modern Tech Stack**: Built with the latest Next.js 14 App Router, Server Actions, and Tailwind CSS.
- **🔒 Secure Architecture**: Environment variable management and Prisma ORM for type-safe database access.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Shadcn UI + Lucide React
- **Database**: PostgreSQL (via Supabase)
- **ORM**: Prisma
- **State Management**: Zustand + React Context
- **AI Integration**: OpenAI GPT-4 Turbo
- **Visuals**: React Flow (Node-based editor)

---

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### 1. Prerequisites
- Node.js 18+ installed
- npm or yarn installed
- A Supabase account (for the database)
- An OpenAI API Key

### 2. Clone & Install
```bash
# Clone the repository
git clone [https://github.com/your-username/automateflow.git](https://github.com/your-username/automateflow.git)

# Navigate into the directory
cd automateflow

# Install dependencies
npm install
```

## Environment Setup

Create a `.env` file in the root directory and add your credentials:
```
# Database Connection (Get this from Supabase -> Project Settings -> Database)
# Note: Use the Transaction Pooler URL for the main connection to avoid connection limits in serverless.
DATABASE_URL="postgres://postgres.your-ref:password@aws-0-region.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct Connection (Used by Prisma for migrations)
DIRECT_URL="postgres://postgres.your-ref:password@aws-0-region.supabase.com:5432/postgres"

# OpenAI API Key (For the AI Generator)
OPENAI_API_KEY="sk-..."
```

## Database Setup
Initialize the database schema using Prisma:
```
# Generate the Prisma Client
npx prisma generate

# Push the schema to your Supabase database
npx prisma db push
```
## Run the Application

`npm run dev`
Open <http://localhost:3000> in your browser. The app should automatically redirect you to the dashboard.

## 📂 Project Structure
```
├── app/                  # Next.js App Router pages & layouts
│   ├── api/              # Backend API routes (AI, Database saves)
│   ├── dashboard/        # Dashboard layout and Workflow pages
│   ├── layout.tsx        # Root layout (Theme provider, Background grid)
│   └── page.tsx          # Root redirect
├── components/           # Reusable UI components
│   ├── ui/               # Shadcn UI primitives (Buttons, Inputs)
│   ├── workflows/        # Canvas logic, Node components
│   └── theme-provider.tsx
├── lib/                  # Utilities (Prisma client, Helper functions)
├── prisma/               # Database schema (schema.prisma)
└── public/               # Static assets
```
## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

- Fork the Project
- Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
- Commit your Changes (`git commit -m 'Add sometthing'`)
- Push to the Branch (`git push origin feature/something`)
- Open a Pull Request

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.
