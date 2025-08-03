# 🎯 Bonthun - Decentralized Bounty Platform

<div align="center">

![Bonthun Logo](./assets/images/icon.png)

**A revolutionary bounty hunting platform built on Solana blockchain** �

[![Expo](https://img.shields.io/badge/Expo-~53.0.16-blue.svg)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React%20Native-0.79.5-green.svg)](https://reactnative.dev)
[![Solana](https://img.shields.io/badge/Solana-Web3.js-purple.svg)](https://solana.com)
[![Anchor](https://img.shields.io/badge/Anchor-0.31.1-orange.svg)](https://www.anchor-lang.com)

</div>

## 🌟 What is Bonthun?

Bonthun is a cutting-edge decentralized bounty platform that connects **clients** who need tasks completed with **hunters** who have the skills to complete them. Built on the Solana blockchain, it ensures transparent, secure, and instant payments through smart contracts.

### ✨ Key Features

- 🎯 **Create & Browse Bounties** - Post tasks or find work opportunities
- 👤 **Dual User Profiles** - Act as both client and hunter
- 💰 **Instant SOL Payments** - Secure blockchain-based transactions
- 📊 **Performance Tracking** - Success rates and earnings analytics
- 🔒 **Smart Contract Security** - Trustless escrow system
- 📱 **Cross-Platform** - iOS, Android, and Web support
- 🌍 **Location-Based** - Find local opportunities

## 🏗️ Architecture

### Frontend (React Native + Expo)
- **Framework**: Expo 53 with React Native 0.79
- **Navigation**: Expo Router with file-based routing
- **State Management**: React Context + TanStack Query
- **UI Components**: Custom components with Lucide icons
- **Wallet Integration**: Solana Mobile Wallet Adapter

### Backend (Solana Smart Contract)
- **Framework**: Anchor 0.31.1
- **Language**: Rust
- **Network**: Solana blockchain
- **Program ID**: `ASDBLcyRSj8bWcQNFiPBJMtDLkWmWytsbYrC7B6RJ81M`

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Yarn or npm
- Expo CLI
- Rust & Anchor CLI (for smart contract development)
- Solana CLI

### 📱 Mobile App Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd bonthun
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   expo start
   ```

4. **Run on device/simulator**
   ```bash
   # iOS
   npm run ios

   # Android
   npm run android

   # Web
   npm run web
   ```

### ⚙️ Smart Contract Setup

1. **Navigate to Anchor project**
   ```bash
   cd bonthunanchor
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Build the program**
   ```bash
   anchor build
   ```

4. **Deploy to devnet**
   ```bash
   anchor deploy --provider.cluster devnet
   ```

5. **Run tests**
   ```bash
   anchor test
   ```

## 📱 App Structure

```
app/
├── (tabs)/
│   ├── index.tsx          # Browse bounties
│   ├── create.tsx         # Create new bounty
│   ├── mybounties.tsx     # My bounties dashboard
│   └── profile.tsx        # User profile
├── sign-in.tsx            # Authentication
└── _layout.tsx            # Root layout

components/
├── bounty/                # Bounty-related components
├── profile/               # Profile management
├── auth/                  # Authentication
└── ui/                    # Reusable UI components

bonthunanchor/
├── programs/
│   └── bonthunanchor/
│       └── src/
│           └── lib.rs     # Smart contract logic
└── tests/                 # Contract tests
```

## 🔧 Smart Contract Functions

### User Management
- `init_user_profile()` - Create user profile
- `edit_profile()` - Update profile information
- `delete_profile()` - Remove user profile

### Bounty Management
- `create_bounty()` - Post new bounty
- `claim_bounty()` - Accept bounty as hunter
- `submit_work()` - Submit completed work
- `select_winner()` - Award bounty to winner

## 🎨 Tech Stack

### Frontend
- **React Native** - Cross-platform mobile development
- **Expo** - Development platform and tools
- **TypeScript** - Type-safe JavaScript
- **Expo Router** - File-based navigation
- **TanStack Query** - Data fetching and caching
- **Lucide React Native** - Beautiful icons

### Blockchain
- **Solana** - High-performance blockchain
- **Anchor** - Solana development framework
- **Rust** - Systems programming language
- **@solana/web3.js** - Solana JavaScript SDK

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Static type checking

## 🌐 Deployment

### Mobile App
```bash
# Build for production
npm run build

# Create development build
expo build:android
expo build:ios
```

### Smart Contract
```bash
# Deploy to mainnet
anchor deploy --provider.cluster mainnet-beta
```

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with ❤️ using Expo and Solana
- Icons by [Lucide](https://lucide.dev)
- Inspired by the decentralized future of work

---

<div align="center">

**Ready to start bounty hunting?** 🎯

[Download the App](#) | [View Smart Contract](./bonthunanchor) | [Join Community](#)

</div>
