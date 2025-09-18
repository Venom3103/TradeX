# TradeX

> **TradeX** is a **paper trading platform** built with Next.js, TypeScript, Prisma, and Tailwind CSS.  
> It lets users simulate trading (buy/sell) with a virtual balance, track holdings, and manage portfolios — without risking real money.

---

## 🚀 Features

- 🔐 **User Authentication** (JWT + bcrypt)  
- 💰 **Virtual Wallet** — each user starts with a default balance of 10,000 units  
- 📈 **Trade Simulation** — buy/sell assets with tracking of price, quantity, and side (buy/sell)  
- 📊 **Portfolio Holdings** stored in JSON with real-time updates  
- 🗂 **Relational Database** with Prisma ORM (PostgreSQL)  
- 🎨 **Responsive UI** powered by Tailwind CSS + Framer Motion  
- ⚡ **Data Fetching** with SWR for smooth UI experience  

---

## 🛠 Tech Stack

| Layer            | Technology                             |
|------------------|-----------------------------------------|
| Frontend         | Next.js, React, TypeScript, SWR         |
| Styling          | Tailwind CSS, Framer Motion, PostCSS    |
| Backend / ORM    | Prisma + @prisma/client                 |
| Database         | PostgreSQL (via `DATABASE_URL`)         |
| Auth & Security  | bcryptjs, jsonwebtoken, cookie          |
| Config           | dotenv                                  |

---

## 🗄 Database Models

### **User**
| Field      | Type      | Attributes                                |
|------------|----------|--------------------------------------------|
| id         | Int       | Primary Key, Auto-increment               |
| email      | String    | Unique                                    |
| name       | String    | Required                                  |
| password   | String?   | Optional (hashed)                         |
| balance    | Float     | Default: 10000                            |
| holdings   | Json      | Default: `{}` (stores user portfolio)     |
| createdAt  | DateTime  | Default: now()                            |
| updatedAt  | DateTime  | Auto-updated                              |
| trades     | Trade[]   | One-to-many relation with `Trade`         |

---

### **Trade**
| Field      | Type      | Attributes                                |
|------------|----------|--------------------------------------------|
| id         | Int       | Primary Key, Auto-increment               |
| symbol     | String    | Asset symbol (e.g., AAPL, TSLA)           |
| quantity   | Int       | Number of units traded                    |
| price      | Float     | Price at execution                        |
| side       | String    | "buy" / "sell"                            |
| userId     | Int       | Foreign key → User(id)                    |
| createdAt  | DateTime  | Default: now()                            |
| user       | User      | Belongs to a User                         |

---

## ⚡ Getting Started

### 1. Prerequisites

- Node.js (v18+ recommended)  
- npm (comes with Node)  
- PostgreSQL running locally or in the cloud  

---

### 2. Clone & Install

```bash
# Clone the repo
git clone https://github.com/Venom3103/TradeX.git
cd TradeX

# Install dependencies
npm install

```

### 3. Environment Variables

```bash
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/tradexdb"
JWT_SECRET="your_super_secret_key"

```

### 4. Database Setup

```bash
# Run migrations
npm run prisma:migrate

# Generate Prisma client
npm run prisma:generate

# (Optional) Seed DB
npm run seed

```
### 5. Run locally

```bash
npm run dev

The app will be running on 👉 http://localhost:3000

```
 ## 📜 Scripts

 
| Script                    | Description                        |
| ------------------------- | ---------------------------------- |
| `npm run dev`             | Start Next.js in development mode  |
| `npm run build`           | Build the app for production       |
| `npm start`               | Run the built app in production    |
| `npm run prisma:generate` | Generate Prisma client             |
| `npm run prisma:migrate`  | Run Prisma migration (create-only) |
| `npm run seed`            | Seed DB with initial data          |

---

 ## 📂 Project Structure

/ ── prisma/             # Prisma schema + seed files

/ ── pages/              # Next.js routes

/ ── components/         # Reusable UI components

/ ── styles/             # Tailwind / global styles

/ ── lib/                # Utilities (auth, db helpers)

/ ── public/             # Static assets

---

 ## 🚀 Deployment

 For production:

```bash
npm run build
npm start
``` 
Make sure to set production env vars: DATABASE_URL, JWT_SECRET.

 ## 🤝 Contributing

1. Fork & clone the repo

2. Create a feature branch (git checkout -b feature/your-feature)

3. Commit changes (git commit -m 'Add some feature')

4. Push to branch (git push origin feature/your-feature)

5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.
See the LICENSE file for details.

## Made With ❤️
