# Vstrim — Architecture Guide

This project follows **Feature-Sliced Design (FSD)**, a scalable frontend architecture methodology.

---

## FSD Layers

Layers are ordered by dependency direction — lower layers cannot import from higher ones.

```
app/       ← Entry point: providers, navigation, global config, Redux store
pages/     ← Screen compositions (thin, route-level containers)
widgets/   ← Complex composed UI blocks used across pages
features/  ← User-facing features (login, quiz, match, chat, etc.)
entities/  ← Core business models and their types
shared/    ← Pure reusable utilities, UI components, theme, config
```

### Layer Rules

| Layer      | Can import from                       |
|------------|---------------------------------------|
| `app`      | all layers                            |
| `pages`    | widgets, features, entities, shared   |
| `widgets`  | features, entities, shared            |
| `features` | entities, shared                      |
| `entities` | shared                                |
| `shared`   | nothing from the project              |

> **React Native note:** In this project, feature screens (`features/*/screens/`) serve as the page layer. A dedicated `pages/` layer will be populated as the app grows.

---

## Project Structure

```
src/
├── app/
│   ├── config/           # apiClient, queryClient, env
│   ├── hooks/            # App-level hooks (useNetworks, useSocket, useWidgetSync)
│   ├── navigations/      # RootNavigator, MainNavigator
│   ├── providers/        # AppProviders, AuthProvider (Redux-backed), QuizProvider
│   ├── services/         # WidgetBridgeService
│   ├── store/            # Redux store + authSlice
│   └── utility/          # format, geolocation helpers
│
├── pages/                # (reserved — currently screen-level is in features/)
│
├── widgets/              # (reserved — composed UI blocks, e.g. BottomTabBar)
│
├── features/
│   ├── auth/             # Login, Register, Onboarding screens + AuthService
│   ├── dailyQuiz/        # Quiz screen, components, QuizService
│   ├── explore/          # Map explore screen, ExploreService
│   ├── forYou/           # For-You feed screen + MatchCard integration
│   ├── match/            # Match screen, MatchService, matchStore (Zustand UI)
│   ├── message/          # Inbox, ChatDetail screens, ChatService, chatStore (Zustand UI)
│   └── profile/          # Profile screens
│
├── entities/
│   ├── user/model/       # Re-exports User types from shared/types
│   ├── match/model/      # Re-exports MatchResponse, MatchItem, etc.
│   ├── chat/model/       # Re-exports ChatRoom, ChatMessage, etc.
│   └── quiz/model/       # Re-exports QuizQuestion, SubmitQuizPayload, etc.
│
├── shared/
│   ├── config/           # Constants (STORAGE_KEYS, JOIN_REASONS, VIBES, MOCK_INTERESTS)
│   ├── lib/              # Utilities: formatMessageTime, hooks (use-location, etc.)
│   ├── theme/            # colors.ts, typography.ts
│   ├── types/            # Global domain types (User, Place, Event, Match, etc.)
│   └── ui/               # Reusable components: HeaderBack, NetworkError, SectionHeader
│
└── assets/               # fonts, images, icons, animations
```

---

## State Management

### Decision: Redux Toolkit + Zustand

Two tools are used with **clearly separated responsibilities**:

| Tool              | Responsibility                           | Examples                             |
|-------------------|------------------------------------------|--------------------------------------|
| **Redux Toolkit** | Global business state (cross-feature)    | Authenticated user, isLoggedIn       |
| **Zustand**       | Local UI state (per-feature or per-page) | Active chat room, match filters, socket ref |

### Why Redux Toolkit for global state?

- Auth state (`user`, `isLoggedIn`, `isLoading`) is consumed by almost every screen.
- Redux DevTools provide time-travel debugging for auth flows.
- `authSlice` + typed selectors enforce a single source of truth with no prop drilling.

### Why Zustand for local UI state?

- Lightweight, zero-boilerplate for transient UI state.
- Zustand stores are co-located with the feature that owns them.
- Socket instances, typing indicators, and filter selections don't need Redux overhead.

### Auth Flow

```
App boot
  └─ AuthProvider.initializeAuth()
        ├─ Reads AsyncStorage token
        ├─ Refreshes if needed
        └─ dispatch(setUser) + dispatch(setLoggedIn)

Component reads state:
  const { user, isLoggedIn } = useAuth()  →  from useSelector (Redux)
  const { login, logout }    = useAuth()  →  from AuthActionsContext
```

### Zustand Stores

| Store         | Location                                    | State                                           |
|---------------|---------------------------------------------|-------------------------------------------------|
| `chatStore`   | `features/message/stores/chatStore.ts`      | socket, currentRoomId, rooms, messages, typing  |
| `matchStore`  | `features/match/hooks/matchStore.ts`        | filters (UI preference), selectedMatch          |

> Server data (chat rooms list, messages, match results) is fetched and cached by **React Query** — not stored in Zustand.

---

## Dependency Injection

`apiClient` lives in `app/config/apiClient.ts` (not `shared/`) because it depends on `AuthService` for token refresh interceptors, creating an intentional app-level concern.

---

## Adding a New Feature

1. Create `src/features/<name>/` with:
   - `screens/` — screen components
   - `components/` — feature-specific UI
   - `services/` — API calls
   - `hooks/` — React Query hooks + Zustand store (if UI state needed)
   - `model/` — types (re-export in `entities/<name>/`)
   - `index.ts` — public barrel export
2. If types are shared across features, add them to `entities/<name>/model/`.
3. Wire the screen into `app/navigations/` or a widget navigator.
