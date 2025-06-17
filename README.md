# Delta Marketplace

A modern e-commerce platform built with Next.js, TypeScript, and Prisma.

## Features

- 🛍️ Full-featured e-commerce functionality
- 🌐 Internationalization support (i18n)
- 🔒 Secure authentication and authorization
- 🛒 Shopping cart management
- 💳 Checkout process
- ⭐ Product reviews and ratings
- 🎨 Product color variants
- 📱 Responsive design
- 🔍 Product search and filtering
- 🌓 Light/Dark theme support

## Tech Stack

- **Frontend:**
  - Next.js 14
  - TypeScript
  - CSS
  - Shadcn/ui components
  - React Server Components

- **Backend:**
  - Next.js API Routes
  - Prisma ORM
  - MySQL
  - NextAuth.js for authentication

- **Other Tools:**
  - ESLint for code quality
  - i18n for internationalization
  - CSRF protection
  - Data sanitization

## Getting Started

### Prerequisites

- Node.js 18 or higher
- PostgreSQL database
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/kor1pA/delta-marketplace.git
cd delta-marketplace
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```
Edit `.env.local` with your database and other configuration settings.

4. Set up the database:
```bash
pnpm prisma migrate dev
pnpm prisma generate
```

5. Seed the database (optional):
```bash
pnpm prisma db seed
```

6. Start the development server:
```bash
pnpm dev
```

The application will be available at `http://localhost:3000`.

## Project Structure

- `/src/app` - Next.js 14 app directory with route handlers and pages
- `/src/components` - Reusable React components
- `/src/lib` - Utility functions and configuration
- `/src/providers` - React context providers
- `/src/i18n` - Internationalization configuration and translations
- `/prisma` - Database schema and migrations
- `/public` - Static assets

## Features in Detail

### Authentication

- Email/Password authentication
- Social login (Google)
- Session management
- Protected routes

### Product Management

- Product listings with pagination
- Product categories
- Color variants
- Image management
- Product search and filtering

### Shopping Experience

- Shopping cart functionality
- Wishlist
- Product reviews and ratings
- Order management
- Secure checkout process

### Internationalization

- Multi-language support
- Currency formatting
- RTL support (planned)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Educational Purpose

This project was created solely for educational purposes as part of a learning curriculum. It serves as a demonstration of modern web development practices and e-commerce platform implementation.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [Shadcn/ui](https://ui.shadcn.com/)
- [NextAuth.js](https://next-auth.js.org/)
# delta-marketplace
