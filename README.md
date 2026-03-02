# vstrim-fe

React Native app for Vstrim — a social discovery platform.

---

## Project Architecture

This project uses **Feature-Sliced Design (FSD)**. See [ARCHITECTURE.md](./ARCHITECTURE.md) for the full guide.

### Folder Overview

```
src/
├── app/          # Providers, navigation, Redux store, global config
├── pages/        # Screen-level route containers (reserved)
├── widgets/      # Composed UI blocks used across pages (reserved)
├── features/     # User-facing features (auth, quiz, match, chat, explore, profile)
├── entities/     # Business model types (user, match, chat, quiz)
├── shared/       # Reusable UI, utilities, theme, constants
└── assets/       # Fonts, images, icons
```

### State Management

| Tool              | When to use                                              |
|-------------------|----------------------------------------------------------|
| **Redux Toolkit** | Global business state — auth user, session               |
| **Zustand**       | Local UI state — active chat room, match filters, socket |
| **React Query**   | Server data — API fetching, caching, invalidation        |

---

## Getting Started

```bash
npm install
# iOS
npm run pods && npm run ios
# Android
npm run android
```

## Tech Stack

- React Native 0.81
- TypeScript
- React Navigation v7
- Redux Toolkit + React Redux
- Zustand
- TanStack React Query v5
- Axios
- Socket.IO Client
- Mapbox / React Native Maps
