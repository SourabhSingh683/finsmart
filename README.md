# FinSmart By ByteBenders 🔥🔥
# finsmart

**finsmart** is a finance platform built with JavaScript, React, and Next.js. This repository provides a foundation for building modern finance-related web applications and includes a rich set of UI components, hooks, and integrations with authentication and data services.

## Features

- Built with [Next.js](https://nextjs.org/) for server-side rendering and static site generation
- Uses [React](https://react.dev/) for building user interfaces
- Component-based architecture with reusable components
- Authentication powered by Clerk
- Data modeling and database access via Prisma
- Modern UI with Tailwind CSS and Radix UI components
- Includes charts and data visualization with Recharts
- Email functionality using react-email and Resend
- Type safety with Zod
- Various utility libraries for enhanced developer experience

## Directory Structure

- `/app` – Main application code
- `/components` – Reusable React components
- `/data` – Data-related files or mock data
- `/emails` – Email templates and related logic
- `/hooks` – Custom React hooks
- `/lib` – Library code and utilities
- `/prisma` – Prisma schema and database migrations
- `/public` – Static assets

## Getting Started

1. **Clone the repository**
    ```bash
    git clone https://github.com/SourabhSingh683/finsmart.git
    cd finsmart
    ```

2. **Install dependencies**
    ```bash
    npm install
    ```

3. **Configure environment variables**

    Create a `.env` file in the root and add your credentials (e.g., database, Clerk, email API keys).

4. **Run database migrations**
    ```bash
    npx prisma migrate dev
    ```

5. **Start the development server**
    ```bash
    npm run dev
    ```

6. **Open in browser**

    Visit [http://localhost:3000](http://localhost:3000)

## Scripts

- `npm run dev` – Start the development server
- `npm run build` – Build the application for production
- `npm run start` – Start the production server
- `npm run lint` – Lint the codebase

## Dependencies

Some of the core dependencies include:

- `next`
- `react`
- `@clerk/nextjs`
- `@prisma/client`
- `tailwindcss`
- `recharts`
- `zod`

For a complete list, see [`package.json`](https://github.com/SourabhSingh683/finsmart/blob/main/package.json).

## License

This project is licensed under the [MIT License](LICENSE).

---

> _Note: This README is a template and may need to be updated with project-specific details as development progresses._


