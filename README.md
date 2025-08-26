# Static Site Builder

A modern, visual website builder that allows users to create beautiful static websites with a drag-and-drop interface. Built with Next.js, Prisma, and deployed on Vercel with custom domain support.

## Features

### 🎨 Visual Builder

- Drag-and-drop component builder
- Real-time preview
- Component library with headers, text, buttons, forms, and more
- Responsive design support

### 🌐 Custom Domains

- Support for base domains (e.g., `sadman.me`)
- Support for subdomains (e.g., `portfolio.sadman.me`)
- Automatic SSL certificate provisioning
- DNS configuration guidance

### 📱 Component System

- Navbar with custom navigation items
- Hero sections, text blocks, buttons
- Contact forms with email integration
- Grid layouts and containers
- Image and media support

### 🔐 Authentication & Management

- NextAuth.js authentication
- User dashboard for website management
- Template system for quick starts
- Page management with publish/draft states

### 🚀 Performance

- Edge Runtime middleware for fast custom domain routing
- Server-side rendering for published sites
- Optimized for Vercel deployment

## Tech Stack

- **Framework**: Next.js 15.3.5 with App Router
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **Deployment**: Vercel
- **Custom Domains**: Vercel DNS + Edge Runtime

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Vercel account (for deployment)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/SADMAN30102001SAKIB/static-site-builder.git
cd static-site-builder
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

Configure the following variables:

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
VERCEL_TOKEN="your-vercel-token" # For custom domains
```

4. Set up the database:

```bash
npx prisma migrate dev
```

5. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Custom Domain Setup

### Base Domains (e.g., sadman.me)

Add an A record to your DNS provider:

- **Type**: A
- **Host**: @
- **Value**: 216.198.79.1
- **TTL**: 1800

### Subdomains (e.g., portfolio.sadman.me)

Add a CNAME record to your DNS provider:

- **Type**: CNAME
- **Host**: [subdomain name] (e.g., "portfolio")
- **Value**: f69a4e046fbb9111.vercel-dns-017.com
- **TTL**: 1800

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   ├── api/               # API routes
│   ├── builder/           # Website builder interface
│   ├── dashboard/         # User dashboard
│   ├── preview/           # Website preview routes
│   └── site/              # Public website routes
├── components/            # Reusable components
│   ├── builder/           # Builder-specific components
│   ├── dashboard/         # Dashboard components
│   └── ui/                # UI components
├── lib/                   # Utilities and configurations
│   ├── auth.js            # NextAuth configuration
│   ├── componentRenderers.jsx # Component rendering system
│   ├── prisma.js          # Database client
│   └── serverPageRenderer.js  # Server-side rendering
├── middleware.js          # Custom domain routing
└── prisma/               # Database schema and migrations
```

## API Routes

- `/api/auth/*` - Authentication endpoints
- `/api/websites` - Website management
- `/api/pages` - Page management
- `/api/components` - Component management
- `/api/domains` - Custom domain management
- `/api/templates` - Template system

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and commit: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue on GitHub.
