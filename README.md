# FaceUp interview task

Proposed solution of FaceUp interview task. Sample app with possiblility to create reports with possibility to upload attachment files. App allows viewing details of reports as well as editing and deleting functionality.

## Structure

Solution consists of separate frontend and backend app.

### Frontend app

Frontend is a React app that can be found in the "frontend" folder. It uses [React Query](https://react-query.tanstack.com/) for data fetching and [Shadcn UI](https://ui.shadcn.com/) for UI components.

### Backend app

Backend is a NodeJS app created using [Hono](https://hono.dev/) framework. App uses Prisma ORM and MySQL database. For file storage app uses [Firebase Storage](https://firebase.google.com/docs/storage).

## Getting Started

### Clone repository

```
git clone git@github.com:szolloli/faceup-interview.git
```

### Frontend

1. Install

```
cd frontend
npm i
```

2. Setup environment variables

- remove " copy" from ".env copy" filename
- set BASE_API_URL to URL of backend app once its running

3. Run

```
npm run dev
```

### Database

Setup MySQL database according to [official documentation](https://dev.mysql.com/)

### Firebase

Setup Firebase Storage according to [official documentation](https://firebase.google.com/docs/storage)

### Backend

1. Setup enviroment variables (.env)

- remove " copy" from ".env copy" filename
- set DATABASE_URL based on created database
- set Firebase config variables to values generated during Firebase setup

2. Generate Prisma models

```
cd backend
npx prisma generate
```

3. Prisma push database

```
npx prisma db push
```

4. Install

```
npm i
```

5. Run

```
npm run dev
```
