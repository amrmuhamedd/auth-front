# React Authentication App

## Introduction

Welcome to the React Authentication frontend, a secure authentication system implementing HTTP-only cookie-based refresh tokens and localStorage access tokens. This implementation follows security best practices for web authentication.

## Features

- **Secure Authentication**: Using HTTP-only cookies for refresh tokens and localStorage for access tokens
- **Protected Routes**: Restricting access to authenticated users only
- **Token Auto-Refresh**: Seamless token refresh mechanism
- **Login/Register/Logout**: Complete authentication flow

## Tech Stack

This application is built using the following technologies:

- **React**: Frontend JavaScript library
- **Redux Toolkit**: State management
- **Axios**: HTTP client for API requests
- **Ant Design**: UI component library
- **TypeScript**: Type-safe JavaScript

## Authentication Security

The authentication system implements a secure approach:

- **Access Tokens**: Stored in localStorage for short-lived authentication
- **Refresh Tokens**: Stored as HTTP-only cookies, making them inaccessible to JavaScript and protected against XSS attacks
- **Auto Refresh**: Automatic token refresh when access tokens expire

## Getting Started

Follow these instructions to run the project locally:

1. Clone the project repository to your local machine:

   ```bash
   git clone <repository_url>
   cd <project_directory>
   ```

2. Create a `.env` file in the project root and configure the following environment variables:

   ```bash
   VITE_ENV_API_BASE_URL=http://localhost:5000
   ```

3. Install dependencies:

   ```bash
   yarn install
   ```

4. Start the development server:

   ```bash
   yarn dev
   ```

The application will be available at `http://localhost:5173`

## API Integration

This frontend is designed to work with a NestJS backend that uses secure cookie-based authentication. The backend should:

1. Set HTTP-only cookies for refresh tokens when users login/register
2. Clear the cookies on logout
3. Return new access tokens during the refresh token flow



