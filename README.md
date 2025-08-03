# Expense Tracker

## Project Overview

Expense Tracker is a full-stack application designed to help users manage their expenses effectively. It includes features for tracking expenses, setting monthly limits, and visualizing spending patterns. The project is divided into two main parts:

- **Backend**: Built with NestJS, it provides a robust API for managing users, authentication, expenses, and health checks.
- **Frontend**: Developed with React and Vite, it offers an intuitive user interface for interacting with the application.

---

## Folder Structure

### Backend (`expense-tracker-backend`)

- **src/**: Contains the main application code.
  - **auth/**: Handles user authentication and authorization.
  - **expense/**: Manages expense-related operations.
  - **healthz/**: Provides health check endpoints.
  - **users/**: Manages user-related operations.
  - **utils/**: Utility functions like password hashing.
- **test/**: Contains end-to-end tests.
- **nest-cli.json**: Configuration for NestJS CLI.
- **tsconfig.json**: TypeScript configuration.

### Frontend (`expense-tracker-frontend`)

- **src/**: Contains the main application code.
  - **components/**: Reusable UI components.
  - **features/**: Feature-specific code for authentication and expenses.
  - **lib/**: Shared libraries like API utilities.
  - **routes/**: Application routing.
- **public/**: Static assets.
- **vite.config.ts**: Configuration for Vite.
- **tsconfig.json**: TypeScript configuration.

---

## Installation Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/tehaandev/expense-tracker.git
   ```
2. Navigate to the project directory:
   ```bash
   cd expense-tracker
   ```
3. Install dependencies for both backend and frontend:
   ```bash
   cd expense-tracker-backend
   npm install
   cd ../expense-tracker-frontend
   npm install
   ```

---

## Usage

### Running the Backend

1. Navigate to the backend directory:
   ```bash
   cd expense-tracker-backend
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```

### Running the Frontend

1. Navigate to the frontend directory:
   ```bash
   cd expense-tracker-frontend
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```

---

## API Documentation

### Authentication

- **POST /auth/login**: User login.
- **POST /auth/register**: User registration.

### Expenses

- **GET /expense**: Fetch all expenses.
- **POST /expense**: Create a new expense.
- **PUT /expense/:id**: Update an expense.
- **DELETE /expense/:id**: Delete an expense.

### Health Check

- **GET /healthz**: Check API health.

---

## Frontend Features

- **Authentication**: Login and registration forms with validation and navigation links.
- **Expense Dashboard**: Overview of expenses and monthly limits.
- **Expense Management**: Add, edit, and delete expenses.
- **Visualization**: Charts and progress bars for spending patterns.

---

## Technologies Used

- **Backend**: NestJS, TypeScript, JWT, bcrypt.
- **Frontend**: React, Vite, TypeScript, CSS.
- **Database**: MongoDB, Prisma ORM (PostgreSQL).

---

