# Micro-frontends Setup Guide

## Quick Setup - All Micro-frontends

### 1. Auth Microfrontend (Port 4201)
```bash
cd frontend-services/auth-microfrontend
npm install
npm start
```

**Features**: Login, Register
**Routes**: /auth/login, /auth/register

### 2. Feed Microfrontend (Port 4202)
```bash
cd frontend-services/feed-microfrontend
npm install
npm start
```

**Features**: Post feed, Create post, Like, Comment
**Routes**: /feed, /feed/create

### 3. Profile Microfrontend (Port 4203)
```bash
cd frontend-services/profile-microfrontend
npm install
npm start
```

**Features**: User profile, Edit profile, Follow/Unfollow
**Routes**: /profile, /profile/:username

### 4. Chat Microfrontend (Port 4204)
```bash
cd frontend-services/chat-microfrontend
npm install
npm start
```

**Features**: Real-time messaging, Conversations
**Routes**: /chat, /chat/:userId

### 5. Notifications Microfrontend (Port 4205)
```bash
cd frontend-services/notifications-microfrontend
npm install
npm start
```

**Features**: Notifications list, Mark as read
**Routes**: /notifications

## Start All Services

### Terminal 1 - Shell App
```bash
cd frontend-services/shell-app
npm install
npm start
```

### Terminal 2 - Auth
```bash
cd frontend-services/auth-microfrontend
npm install
npm start -- --port 4201
```

### Terminal 3 - Feed
```bash
cd frontend-services/feed-microfrontend
npm install
npm start -- --port 4202
```

### Terminal 4 - Profile
```bash
cd frontend-services/profile-microfrontend
npm install
npm start -- --port 4203
```

### Terminal 5 - Chat
```bash
cd frontend-services/chat-microfrontend
npm install
npm start -- --port 4204
```

### Terminal 6 - Notifications
```bash
cd frontend-services/notifications-microfrontend
npm install
npm start -- --port 4205
```

## Access Points
- Shell App: http://localhost:4200
- Auth: http://localhost:4201
- Feed: http://localhost:4202
- Profile: http://localhost:4203
- Chat: http://localhost:4204
- Notifications: http://localhost:4205

## Files Created for Each Micro-frontend

Each micro-frontend has:
- package.json
- angular.json
- tsconfig.json
- webpack.config.js (Module Federation)
- src/main.ts
- src/app/app.component.ts
- src/app/app.routes.ts
- Components for features
- Dockerfile
- nginx.conf

## Module Federation Configuration

Each remote exposes:
- `./routes` - Angular routes

Shell app consumes all remotes and loads them dynamically.
