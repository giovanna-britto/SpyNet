# SpyNet

A secure, decentralized platform for creating, hiring, and monetizing AI agents — powered by blockchain, Civic identity, and intelligent automation.

#### Complete Documentation:

> [Complete Documentation - SpyNet](https://spynet.gitbook.io/spynet-docs)

#### Technical Documentation:

> [Technical Documentation - SpyNet](https://github.com/Web3Squad/SpyNet/blob/docs/update-readme/TECHNICAL_DOCUMENTATION.MD)

---

## Powered by Civic: Identity and Payments for Autonomous Agents
SpyNet integrates with Civic to offer a secure, decentralized, and seamless identity layer for agent users and creators.

### What Civic Enables:
- Self-Custodied Wallets: Civic Auth automatically creates and connects a Solana wallet for the user.

- Web3 Login: No passwords needed — login is done using your wallet and Civic identity.

- Trusted Payments: Civic-verified users authorize transactions in-app, removing friction and ensuring security.

- Agent-Level Control: Every agent interaction can be linked to the user’s Civic-authenticated wallet, ensuring provenance.

###  Solana Integration:
SpyNet uses Anchor framework + Solana Devnet to handle:

- Smart contracts for agent call registration

- Token transfers upon usage completion

- Automatic execution when ``callsRemaining == 0``

## Abstract

The emergence of a multi-agent AI economy, where autonomous artificial intelligence entities collaborate and transact, demands a fundamental redefinition of payment infrastructure. Traditional financial systems are inadequate to handle the high-frequency, low-value micropayments that are central to this future.

SpyNet proposes a blockchain-native infrastructure with Civic-enabled identities and automated Solana payments, allowing agents to be hired, tracked, and rewarded in a trustless, pay-per-use model — designed for the speed and granularity of AI-to-AI interaction.


![Home](https://github.com/Web3Squad/SpyNet/blob/docs/update-readme/images/home.png)

## Target Audience
SpyNet serves two distinct yet interconnected target audiences crucial for the flourishing AI agent economy. Understanding their motivations, pain points, and objectives is fundamental to our solution's success.

- Agent Creators: This group consists of companies, individual developers, AI startups, hackers, students, and researchers who are at the forefront of building highly specialized Artificial Intelligence agents. They are the innovators who construct the "AI workforce," developing solutions for specific domains like legal, marketing, finance, IT automation, healthcare, and more.

- Agent Buyers: This group comprises businesses of all sizes (startups, SMEs, large corporations), freelancers, and product teams looking to leverage the power of AI agents to optimize their processes, reduce costs, and increase operational efficiency. They represent the growing demand for "end-to-end workflow autonomy" and "ready-to-use AI solutions."

## What's Happening in the Market?

We're on the cusp of an unprecedented economic transformation, driven by the rise of Multi-Agent Systems (MAS) powered by Artificial Intelligence. AI is evolving from isolated tools into networks of autonomous, specialized agents capable of collaborating and transacting at speeds and scales impossible for humans. This is the "start of the AI maturity phase," with market projections indicating exponential growth from billions to hundreds of billions of dollars in the next decade, and a "trillion-dollar opportunity" for the global economy.

![Market](https://github.com/Web3Squad/SpyNet/blob/docs/update-readme/images/multiagente.png)

However, despite this colossal potential, the AI agent ecosystem is still nascent and faces significant bottlenecks hindering its full realization:

Proto-Persona 1: The Agent Creator

- For the innovators building these specialized agents (whether for marketing analysis, legal writing, software development, risk assessment, or project management), the pain points are palpable:

- Don't know how to monetize their agent: The absence of a native payment infrastructure for AI means agents are "limited to pre-funded accounts with usage limits" and "cannot directly transact with other AI agents." This stifles the ability to monetize granular, high-volume services.

- Lack a reliable distribution channel: There isn't a centralized, transparent hub where creators can efficiently list, promote, and distribute their agents to a broad and relevant audience.

- Difficulty proving their agent's quality: In a trustless environment, it's challenging for creators to demonstrate their agents' effectiveness and reliability in a verifiable and auditable way.

- No real market visibility (usage, clients, feedback): The lack of transparent metrics and public feedback prevents creators from understanding their agents' market performance and identifying improvement opportunities.

Proto-Persona 2: The Agent Buyer

- For organizations and professionals looking to leverage the power of AI agents to optimize their operations, the challenges are equally frustrating:

- Don't know where to find reliable agents: Market fragmentation and the absence of a centralized repository make it difficult to discover specialized, high-quality agents for specific needs.

- Difficulty understanding the true value of agents: Without verifiable proofs of work and transparent performance metrics, it's hard for buyers to assess an AI agent's potential ROI.

- Need proofs of work, traceability, trust: The autonomous nature of agents demands a high degree of trust and auditability, which traditional systems can't provide.

- Need efficient micropayments (can't pay US$ 50 for a US$ 0.05 test): Traditional payment systems impose "disproportionately high fees on microtransactions," making the "pay-per-use" model, essential for the AI agent economy, unfeasible.

- Insecurity about paying for something that doesn't deliver results: The lack of "pay-per-contribution" mechanisms and the inability to audit agent performance in real-time create insecurity and financial risk.

## Proposed Solution

We propose an AI Agent Marketplace built on the blockchain, designed to be the foundational infrastructure for the AI agent economy. This marketplace will resolve current bottlenecks, creating a vibrant, transparent, and efficient ecosystem for value exchange between agents and users.

What it Solves for Agent Creators:

- Monetization via automatic micro-payments per use: Creators can set granular prices (per API call). The blockchain-based micro-payment infrastructure enables sub-cent transactions, making these pricing models economically viable.

- No need for intermediaries or manual contracts: The trustless nature of blockchain and the execution of smart contracts eliminate the need for third parties and complex agreements, allowing agents to transact autonomously.

- Direct receipt in crypto (ecosystem token): Payments are settled instantly in cryptocurrencies, which act as the "native currency" for AI, free from banking hours or geographical borders.

What it Solves for Agent Buyers:

- Find agents by category, sector, problem: The marketplace will function as a decentralized directory, facilitating the discovery of specialized agents for various applications, from finance and logistics to healthcare and customer service.

- Pay only for actual use, without complex subscriptions: The "pay-for-contribution" model and micro-payments allow buyers to pay exactly for what they use, eliminating the need for expensive subscriptions or large upfront payments.

- Can audit interactions (public logs and on-chain proof-of-work): The transparent and immutable nature of blockchain ensures that all interactions and transactions are auditable, providing an unprecedented level of trust and traceability.


## 🧑 Tech Stack Overview

| Layer            | Techs & Frameworks                                 |
| ---------------- | -------------------------------------------------- |
| Frontend         | Next.js, Tailwind, wagmi, TypeScript               |
| Backend (Agents) | Node.js, Express, Prisma, JWT, Supabase, Gemini AI |
| Backend (Auth)   | FastAPI, SQLAlchemy, PostgreSQL, JWT               |
| Blockchain       | Solana, Anchor, Civic Auth, SPL Tokens             |
| Smart Contracts  | Rust (Anchor), TypeScript scripts                  |
| DevOps           | Docker, Hardhat, GitHub Actions                    |



## Architecture Summary

### 1. Wallet-Based User Authentication (via Civic)

* Users authenticate using Civic’s wallet-based flow.
* On successful login, the backend links user profile ↔ Civic wallet address.
* This wallet is used as the identity for all agent purchases, calls, and payments.

### 2. Agent Hiring + Usage Metering

* Buyer selects an agent and purchases `N` calls.
* Backend issues a **unique API Key** tied to the buyer’s wallet and contract.
* On each call:

  * The backend validates the key and checks `callsRemaining`.
  * Usage is registered both in the database and on-chain (via Anchor program).
  * When `callsRemaining == 0`, the smart contract triggers a **token transfer** (payment from buyer → agent creator).

### 3. Solana Smart Contract (Anchor)

* Written in Rust using Anchor framework.
* Each agent contract has:

  * Associated creator and buyer wallets
  * Total calls purchased
  * Calls remaining
  * On-chain counter and escrow logic
* On final call, the contract:

  * Emits proof
  * Sends tokens from buyer’s wallet to creator
  * Resets or closes if needed

---

## Usage Flow (End-to-End)

1. **Login with Civic Wallet**
   → Wallet and profile are linked.

2. **Hire Agent**
   → Choose plan, accept terms, simulate payment, receive API key.

3. **Call Agent via Proxy API**
   → Each request decrements balance and logs usage both off-chain (Prisma) and on-chain (Solana).

4. **Auto Payment**
   → When usage is complete, Anchor triggers transfer of tokens using Civic-authenticated wallets.

---

## Token and Payments

* **Token:** SPL-compatible token used on Solana Devnet
* **Wallets:** Generated and linked via Civic (no private key exposed)
* **Transfers:** Triggered automatically via smart contract (Anchor program)
* **Security:** Civic verifies user wallet, Anchor enforces rules, frontend controls access

---

## Quick Start

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Solana Anchor Contracts

```bash
cd agent_proof
anchor build
anchor test
anchor deploy
```

---

## Civic Integration Docs

* [Civic Auth SDK](https://docs.civic.com/)
* [Solana Devnet](https://solfaucet.com/)
* [Anchor Framework](https://book.anchor-lang.com/)

---

## Contributors

* Civic: Wallet-based authentication and identity
* Solana Foundation: Infra support and gasless development
* Web3Squad: Core protocol and frontend dev
* Inteli Hackathon Team: Research, execution, integration

