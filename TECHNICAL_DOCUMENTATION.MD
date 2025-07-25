# SpyNet

A complete ecosystem for creating, hiring, and monetizing AI agents, featuring **blockchain integration**, **robust authentication**, and **intelligent recommendations via AI**.

### Powered by Civic, Solana, and Chainlink

SpyNet leverages **Civic Auth** to onboard users with **secure identity and automatic wallet creation**, enabling seamless Web3 experiences. All interactions with agents are tracked on-chain, and **micropayments are executed automatically** when contract quotas are consumed.

## Key Innovations

* **Civic Auth Integration:** Users authenticate via Civic, receiving a **verifiable decentralized identity (DID)** and a **Solana wallet**, enabling secure, permissionless access.
* **Automatic Wallet Provisioning:** Each authenticated user is provisioned a wallet for payments and proof registration — no manual setup required.
* **On-Chain Proof of Usage:** Each API call is tracked on the Solana blockchain using a custom Anchor smart contract.
* **Trustless Micropayments:** Once a contract's usage quota is depleted, the system **automatically transfers tokens** from the company to the agent creator.
* **AI-Powered Discovery:** Gemini AI recommends the most suitable agent based on business needs.

### Overview

**SpyNet** is a **Web3 marketplace** that connects AI agent creators with businesses. It integrates:

* **Decentralized authentication** via Civic
* **Wallet-based access and usage tracking**
* **On-chain payments and proofs**
* **AI-powered recommendations**
* **Image upload and secure storage**
* **Marketplace for AI service consumption**
---

## System Architecture

#### 1. Specialized Agents Backend

**Stacks and Technologies:**
- **Language:** TypeScript (Node.js)
- **Framework:** Express.js
- **ORM:** Prisma (PostgreSQL)
- **Authentication:** Civic Auth (users), API Key (contracts)
- **Image Upload:** Supabase Storage + Multer
- **AI Recommendation:** Google Gemini API
- **Blockchain:** ethers.js (payment integration and validation)
- **Others:** dotenv, bcrypt, axios, cors

**Data Modeling (Prisma):**
- **Agent:** `id`, `name`, `description`, `endpoint`, `pricePerCall`, `specialty`, `useCases`, `imageUrl`, `createdAt`, `creatorId`
- **User:** `id`, `name`, `email`, `walletAddress`, `password`, `role`, `enterprise`, `sector`, `telephone`, `createdAt`
- **Contract:** `id`, `userId`, `agentId`, `callsPurchased`, `callsRemaining`, `paymentTxHash`, `createdAt`, `apiKey`
- **UsageLog:** `id`, `contractId`, `timestamp`, `callsUsed`, `usageHash`
- **ApiKey:** `id`, `key`, `contractId`, `createdAt`

**Main Endpoints:**
- `POST /agent/register` – Agent registration (with image upload, JWT protected)
- `GET /agent/list` – Agent listing (creator data included)
- `GET /agent/:id` – Agent details
- `PUT /agent/:id` – Agent update
- `DELETE /agent/:id` – Agent removal
- `POST /agent/find-best` – Intelligent recommendation via Gemini

**Services and Middlewares:**
- **Image Upload:** Multer + Supabase Storage
- **AI Recommendation:** Service that queries Gemini and returns the ideal agent
- **Authentication:** JWT (`authMiddleware`), API Key (`apiKeyAuth`)
- **Usage Control:** Each call via API Key decrements the balance and generates a usage hash (proof-of-work)
- **Helpers:** `uploadImageToSupabase`, `generateProofOfWork`

**Implemented Flows:**
- **Agent Registration:** Authenticated user sends data and image → image saved in Supabase → agent created in the database.
- **Listing/Details:** Any user can list and view agent details.
- **Intelligent Search:** User sends requirements → Gemini recommends an agent.
- **Update/Removal:** Creator can update/remove their agents.
- **API Key Call:** Client makes a call → middleware validates balance and registers usage → proxy forwards to the agent's endpoint.

**Key Differentiators:**
- **AI Recommendation** (Gemini)
- **API Key-based usage control** and billing
- **Robust and secure image upload**
- **Modular architecture** (controllers, services, repositories, middlewares)
- **Security:** JWT, API Key, usage logs

---

#### 2. Authentication Backend

**Stacks and Technologies:**
- **Language:** Python 3.12
- **Framework:** FastAPI
- **ORM:** SQLAlchemy 2.x
- **Validation:** Pydantic 2.x
- **Database:** PostgreSQL (testcontainers for testing)
- **Authentication:** JWT (python-jose), OAuth2PasswordBearer
- **Password Hashing:** passlib
- **Infra:** Docker, docker-compose, python-dotenv
- **Testing:** pytest, pytest-bdd, TestClient
- **Others:** SMTP for password reset, CORS

**Main Endpoints:**
- `POST /register` – User registration (Creator/Enterprise)
- `POST /token` – Login (JWT)
- `GET /users` – User listing
- `POST /request-password-reset` – Requests password reset (email sending)
- `POST /reset-password` – Resets password via token

**Security and Testing:**
- JWT with configurable expiration
- Role-based route protection
- Secure password hashing
- Unit, integration, and BDD tests
- Isolated database for testing (testcontainers)
- Custom OpenAPI documentation (global JWT)

**Organization:**
- `/models`, `/schemas`, `/routers`, `/db`, `/security`, `/tests`

---

#### 3. Frontend

**Stacks and Technologies:**
- **Framework:** Next.js (App Router, TypeScript)
- **UI:** TailwindCSS, custom components
- **Authentication:** JWT, Context API (AuthProvider)
- **Web3:** wagmi (MetaMask, WalletConnect, Coinbase)
- **State Management:** Context API, React hooks
- **Toasts:** Sonner
- **Providers:** Web3Provider, AuthProvider

**Main Screens and Flows:**
- **Landing Page:** Agent cards, CTAs, images, sections for creators/companies
- **Login/Registration:** Modern forms, Web3 integration, profile tabs
- **Dashboards:**
    - **Creator:** Statistics, agent list, creation modal
    - **Company:** Contracts, costs, hired agents
- **Marketplace:** Agent listing, details, hiring
- **Hiring:** Plan form, terms acceptance, payment mock, success modal with API Key

**Global Components:**
- Navbar, Footer, Toaster, Dialog/Modal

**Other Points:**
- Contexts for authentication and Web3
- Services for agents and contracts
- TypeScript types for data
- Mock data for development
- Sensitive route protection
- Responsive layout

---

#### 5. Solana Integration with Civic Auth

**Stacks and Technologies:**

* **Blockchain:** Solana (Devnet)
* **Framework:** Anchor (smart contract development)
* **Language:** Rust (smart contracts), TypeScript (client-side calls)
* **Wallet:** Civic Web3 Wallet (embedded auth + wallet creation)
* **Smart Contract ID:** `CcjXNWQhiCgVD5mJH64iJo9FBTAgLxq7ijL5UKvYHTtB`
* **Client SDKs:** `@solana/web3.js`, `@coral-xyz/anchor`, `@civic/ethereum-auth`

**Functionalities and Architecture:**

The Solana integration enhances SpyNet with:

* **Automatic Wallet Creation via Civic Auth**
  Upon login with Civic, a user is authenticated and provisioned with a Solana wallet directly in the frontend. This wallet is used for on-chain payments and proof tracking.

* **Smart Contract on Solana (agent\_proof)**
  The `agent_proof` Anchor smart contract stores on-chain records of each call made to an agent. It tracks a unique hash (derived from the payload and timestamp), the timestamp of the call, and the public keys of both the **contract buyer** and the **agent creator**.

* **Automatic Micropayment on Completion**
  When `callsRemaining` reaches `0`, a transfer of tokens (e.g., USDC or custom SPL token) from the buyer's wallet to the agent creator is triggered programmatically.

* **On-chain Proof Registration**
  After each successful call to an agent (through the proxy), a function `register_call` is invoked. This registers a usage proof on Solana:

  * Inputs: `callHash`, `timestamp`, `contract public key`, and `signer public key`
  * Result: Immutable proof stored on-chain for auditability and trust

---

**Implementation Details:**

* `registerProof.ts` (utility)

  * Connects to Solana Devnet
  * Loads IDL and program ID
  * Derives PDA (Program Derived Address) for each proof
  * Submits transactions using AnchorProvider and user's wallet

* `proxyAgentCall` (Express middleware)

  * Validates API key and forwards request to the agent
  * On success, triggers `registerProof(...)` to log call on-chain

**Security & Benefits:**

* Civic ensures **KYC-based, verifiable identity** tied to a Solana wallet
* SpyNet guarantees **public verifiability** of agent call logs
* Eliminates fraud in API call billing and automates trustless payment release

---

## Project Structure

SpyNet/
├── backend/            # Node.js Backend (Express, Prisma)
│   ├── controllers/
│   ├── services/
│   ├── repositories/
│   ├── middleware/
│   ├── routes/
│   ├── utils/
│   ├── config/
│   └── prisma/
├── auth/               # FastAPI Backend (authentication)
│   ├── models/
│   ├── schemas/
│   ├── routers/
│   ├── db/
│   ├── security/
│   └── tests/
├── frontend/           # Next.js Frontend (React, Tailwind)
│   ├── src/
│   ├── components/
│   ├── providers/
│   ├── services/
│   └── types/
├── blockchain/         # Smart contracts, scripts, and tests
│   ├── contracts/
│   ├── scripts/
│   ├── test/
│   └── ignition/
└── README.md
└── TECHNICAL_DOCUMENTATION.md

---

## Usage Flow

1. User logs in and receives JWT.
2. Agent Registration: User sends data and image → backend saves to database and Supabase.
3. Hiring: Another user purchases credits, creates a contract, and receives an API Key.
4. API Call: User makes a call using the API Key → middleware validates, registers usage, and proxies to the agent.
5. Usage logs are recorded for auditing and billing.
6. Blockchain: Smart contracts manage assets, payments, validations, and cross-chain interoperability.

---

## Security and Quality

- **Civic Auth** for user authentication
- **API Key** for control of agent usage
- **Usage hash** (proof-of-work) for each call
- **Usage logs** for auditing
- **Unit, integration, and BDD tests**
- **Modular and scalable architecture**

---

## Technologies

- **Backend:** Node.js, TypeScript, Express, Prisma, Supabase, Multer, JWT, Google Gemini, ethers.js
- **Authentication:** Civic Auth
- **Frontend:** Next.js, React, TailwindCSS, wagmi, Sonner
- **Blockchain:** Solidity, Hardhat, Civic

---

## Quick Start

- **Backend (Node.js)**
```bash
cd backend
npm install
npm run dev
```


Frontend

```bash
cd frontend
npm install
npm run dev
```

Blockchain

```bash
cd blockchain
npx hardhat test
npx hardhat run scripts/deploy.js
```
---
Diagrams - Architecture

![Architecture](https://github.com/Web3Squad/SpyNet/blob/docs/update-readme/images/image-1.png)

Diagrams - Sequence Diagram

![Sequence](https://github.com/Web3Squad/SpyNet/blob/docs/update-readme/images/image-2.png)

Diagrams - Database Modeling

![Modeling](https://github.com/Web3Squad/SpyNet/blob/docs/update-readme/images/image-3.png)