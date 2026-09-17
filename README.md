# ACG Funded

> End-to-end infrastructure for operating a modern proprietary trading platform.

ACG Funded manages the complete lifecycle of a funded-trading customer, from challenge configuration and payment through trading-account provisioning, risk evaluation, challenge progression, account management, and payouts.

The platform is designed as an orchestration layer around independently operated trading, payments, risk, identity, and administration services.

```text
Visitor
   │
   ▼
Challenge Builder
   │
   ▼
Checkout
   │
   ▼
Payment
   │
   ▼
Trading Account
   │
   ▼
ACG Trader
   │
   ▼
Risk Engine
   │
   ▼
Challenge Engine
   │
   ├──── Passed ─────► Funded
   │
   └──── Failed ─────► Closed
                         │
                         ▼
                       Payout
```

---

## Why ACG Funded Exists

A prop-trading platform is not simply a website connected to a trading terminal.

It is a distributed state-management problem.

A customer may simultaneously have:

- a payment state
- a trading-account state
- a challenge state
- a risk state
- a payout state
- an identity state
- an administrative state

ACG Funded provides the orchestration layer that keeps these systems synchronized.

---

## Platform Architecture

```text
                        ┌───────────────────┐
                        │   Public Website  │
                        └─────────┬─────────┘
                                  │
                                  ▼
                        ┌───────────────────┐
                        │ Challenge Builder │
                        └─────────┬─────────┘
                                  │
                                  ▼
                        ┌───────────────────┐
                        │     Checkout      │
                        └─────────┬─────────┘
                                  │
                                  ▼
                        ┌───────────────────┐
                        │ Payments Service  │
                        └─────────┬─────────┘
                                  │
                                  ▼
                        ┌───────────────────┐
                        │ Account Provision │
                        └─────────┬─────────┘
                                  │
                 ┌────────────────┴────────────────┐
                 │                                 │
                 ▼                                 ▼
       ┌───────────────────┐             ┌───────────────────┐
       │    ACG Trader     │             │ External Platform │
       └─────────┬─────────┘             └─────────┬─────────┘
                 │                                 │
                 └────────────────┬────────────────┘
                                  │
                                  ▼
                        ┌───────────────────┐
                        │    Risk Engine    │
                        └─────────┬─────────┘
                                  │
                                  ▼
                        ┌───────────────────┐
                        │ Challenge Engine  │
                        └─────────┬─────────┘
                                  │
                         ┌────────┴────────┐
                         ▼                 ▼
                       PASS               FAIL
                         │
                         ▼
                     FUNDED
                         │
                         ▼
                      PAYOUT
```

---

## Major Components

### Challenge Builder

The Challenge Builder converts commercial challenge options into a validated configuration.

Configuration may include:

- account size
- challenge type
- number of evaluation stages
- profit target
- maximum daily loss
- maximum overall loss
- minimum trading days
- profit split
- payout frequency
- optional rule modifications

Example:

```json
{
  "type": "ONE_STEP",
  "accountSize": 100000,
  "profitTargetPercent": 10,
  "dailyLossPercent": 3,
  "maxLossPercent": 6,
  "minimumTradingDays": 0
}
```

Configurations should be validated against centrally managed rule boundaries before checkout.

---

## Pricing Engine

Challenge pricing is calculated independently from UI presentation.

```text
Base Account Price
        │
        ▼
Challenge Type Modifier
        │
        ▼
Risk Configuration Modifier
        │
        ▼
Commercial Options
        │
        ▼
Final Checkout Price
```

The pricing engine should be deterministic.

The same challenge configuration should produce the same price for the same pricing version.

---

## Checkout and Payments

Checkout converts a challenge configuration into a commercial order.

Responsibilities include:

- customer email capture
- challenge summary
- pricing confirmation
- terms acceptance
- card payment
- crypto payment
- payment-state tracking
- idempotent challenge creation

Example lifecycle:

```text
PENDING
   │
   ▼
PROCESSING
   │
   ├────► FAILED
   │
   ▼
PAID
   │
   ▼
PROVISIONING
   │
   ▼
ACTIVE
```

A payment confirmation should never rely exclusively on a client-side success redirect. Server-side confirmation is authoritative.

---

## Challenge Engine

The Challenge Engine evaluates trading performance against the rules of each account.

Typical evaluation rules:

- profit target
- daily loss
- maximum loss
- minimum trading days
- trading restrictions
- account status

Example:

```text
Starting Balance:       $100,000
Profit Target:          10%
Daily Loss Limit:        3%
Maximum Loss Limit:      6%
```

The challenge engine consumes normalized trading-account data rather than reading directly from frontend state.

---

## Risk Engine

Risk enforcement is separated from commercial challenge configuration.

```text
Commercial Rule
      │
      ▼
Challenge Engine
      │
      ▼
Risk Policy
      │
      ▼
Risk Engine
      │
      ▼
Account Action
```

Potential actions include:

- warning
- rule violation
- trading restriction
- account suspension
- challenge failure
- administrative review

Critical rule decisions should be reproducible from stored account and trading events.

---

## Trader Dashboard

The customer dashboard provides the account-control layer around the trading system.

Core areas include:

- active challenges
- funded accounts
- performance
- account credentials
- trading objectives
- current drawdown
- daily loss
- profit target
- transaction history
- payout requests
- account notifications

ACG Trader remains responsible for the trading experience.

ACG Funded remains responsible for the business and challenge lifecycle.

---

## Admin Platform

Administrative tooling provides operational visibility across the business.

Primary modules include:

```text
Dashboard
Users
Challenges
Trading Accounts
Payments
Risk Events
Violations
Payouts
Configuration
Audit History
```

The objective is to operate the business through explicit system state rather than manual spreadsheet processes.

---

## Account Lifecycle

Trading accounts should follow explicit state transitions.

```text
CREATED
   │
   ▼
AWAITING_PAYMENT
   │
   ▼
PROVISIONING
   │
   ▼
ACTIVE
   │
   ├────► FAILED
   │
   ├────► SUSPENDED
   │
   ▼
PASSED
   │
   ▼
FUNDED
   │
   ▼
CLOSED
```

State transitions should be validated centrally. The frontend should not independently change challenge state.

---

## ACG Trader Integration

ACG Funded and ACG Trader are separate systems with different responsibilities.

### ACG Funded

Responsible for:

```text
Users
Challenges
Payments
Commercial Rules
Risk Policy
Account Lifecycle
Payouts
Administration
```

### ACG Trader

Responsible for:

```text
Market Data
Charts
Orders
Execution
Positions
P&L
Margin
Trading History
Trading Interface
```

Integration boundary:

```text
ACG Funded
     │
     │ Account + Risk Configuration
     ▼
ACG Trader
     │
     │ Trading Events + Metrics
     ▼
ACG Funded
```

This separation allows trading infrastructure to evolve independently from the customer platform.

---

## Project Structure

Typical frontend organization:

```text
src/
├── components/
├── pages/
│   ├── landing/
│   ├── dashboard/
│   ├── checkout/
│   ├── admin/
│   └── auth/
├── services/
├── hooks/
├── context/
├── utils/
│   ├── challengeRules.js
│   ├── pricingEngine.js
│   └── challengePresets.js
└── assets/
```

Backend domains should follow business responsibilities rather than UI pages:

```text
src/
├── auth/
├── users/
├── challenges/
├── payments/
├── accounts/
├── risk/
├── payouts/
├── trading/
├── admin/
└── integrations/
```

---

## Engineering Principles

### 1. Domain separation

Payments should not contain challenge logic. Challenge logic should not contain execution logic. Trading execution should not contain presentation logic.

### 2. Backend authority

Financial and account state is controlled by backend services.

### 3. Explicit state machines

Challenge, payment, payout, and trading-account states should use defined transitions.

### 4. Idempotency

External events such as payment webhooks, account provisioning, and payout processing must be safely repeatable.

### 5. Auditability

Important account changes should preserve:

```text
What changed
Previous value
New value
Reason
Timestamp
Source
Actor
```

### 6. Provider abstraction

Payment providers and trading platforms should be replaceable behind integration interfaces.

---

## Technology Stack

### Frontend

- React
- Vite
- JavaScript / JSX
- Tailwind CSS
- React Router
- Firebase Authentication

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- Redis where required
- REST APIs
- WebSockets where required

### Integrations

- ACG Trader
- trading-platform APIs
- payment processors
- crypto payment infrastructure
- authentication providers
- email and notification services

---

## Development Status

```text
[✓] Public landing platform
[✓] Authentication
[✓] Customer dashboard
[✓] Admin dashboard
[✓] Challenge Builder
[✓] Challenge configuration engine
[✓] Pricing engine
[✓] Core risk engine

[~] Checkout
[~] Payment integrations
[~] Trading-account provisioning
[~] ACG Trader integration

[ ] Automated payouts
[ ] Advanced fraud controls
[ ] Event audit infrastructure
[ ] Production monitoring
[ ] Support automation
[ ] Extended analytics
```

---

## Local Development

Clone the repository:

```bash
git clone https://github.com/abhilashalphonse/funded-frontend.git
cd funded-frontend
```

Install dependencies:

```bash
npm install
```

Create environment configuration:

```bash
cp .env.example .env
```

Start the development server:

```bash
npm run dev
```

---

## Roadmap

### Platform Core

- complete payment lifecycle
- automated account creation
- trading-account synchronization
- challenge evaluation
- funded-account transition
- payout workflows

### Operations

- event-based auditing
- advanced risk monitoring
- administrative controls
- account investigations
- automated notifications

### Scale

- service-level separation
- queue-based background workflows
- distributed locks
- caching
- horizontally scalable trading services
- centralized observability

---

## Security

Security-sensitive issues should not be submitted through public GitHub issues.

Particular care is required around:

- financial state changes
- account authorization
- payment webhooks
- trading-account control
- admin permissions
- API credentials
- payout requests

Production secrets must never be committed to the repository.

---

## Repository Scope

Some components of ACG Funded may remain private because they contain proprietary business logic, commercial configuration, risk rules, or infrastructure details.

Public repositories may expose selected architectural components without exposing production credentials or internal operating logic.

---

## License

Copyright © ACG.

All rights reserved unless explicitly stated otherwise.
