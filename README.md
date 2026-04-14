# M365 Starter Kit

A production-ready boilerplate for rapid application development within the Microsoft 365 ecosystem. Built on Next.js 16, Better Auth, and Microsoft Graph API.

## Technical Stack
* **Next.js 16 (App Router)** – High-performance React framework with Server Components support.
* **Better Auth** – Modern authentication with native Microsoft Entra ID integration.
* **Fluent UI v9** – Microsoft's official design system for an authentic look and feel.
* **Prisma ORM** – Configured for SQLite by default (easily swappable for PostgreSQL/SQL Server).
* **Automated Setup** – PowerShell automation for App Registration and API permission scoping.

## Prerequisites
* **Node.js 22+**
* **Azure CLI** (authenticated via `az login`)
* **M365 Tenant** with Application Developer or Global Admin permissions.

## Quick Start

### 1. Clone and Install
```bash
git clone <repo-url>
cd m365-starter-kit
npm install
```
### 2. Automated Configuration
Run the setup script to register the application in Azure, configure Redirect URIs, and generate your .env.local file automatically.

````pwsh
.\setup-entra.ps1
````

### 3. Admin Consent
To enable data fetching from your tenant, administrative consent is required:

Navigate to Azure Portal > App Registrations.

Select your newly created application (default: M365 Management Portal).

Under API Permissions, click "Grant admin consent for [your-tenant]".

### 4. Initialize and Launch
```bash
npx prisma db push
npm run dev
```

## Project Structure
- /src/app/api/graph/ – Endpoints for Microsoft Graph API communication.
- /src/components/m365/ – Pre-built Fluent UI components (e.g., UserTable).
- /src/lib/auth.ts – Authentication logic and provider configuration.
- /scripts/ – Infrastructure management and Azure automation scripts.

## API Scopes
The following delegated permissions are required by default:

- User.Read – Access to the current user's profile.
- User.Read.All – Read user data across the entire organization.
- offline_access – Refresh tokens for long-lived sessions.