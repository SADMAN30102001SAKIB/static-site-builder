# Static Site Builder

A comprehensive drag-and-drop website builder with professional tools for creating static websites without coding.

## Introduction

Static Site Builder is an easy to use modern, feature-rich platform that empowers users to create professional static websites through an intuitive drag-and-drop interface. Built with Next.js and deployed on Vercel, it combines ease of use with enterprise-grade features including custom domain management, template sharing, and integrated billing for premium usage.

## Objective of The Project

- **Democratize Web Development**: Enable anyone to create professional websites without coding knowledge
- **Provide Enterprise Features**: Offer advanced tools like custom domains, template marketplace, and billing integration
- **Ensure Performance**: Deliver fast, SEO-optimized static sites with edge computing
- **Foster Community**: Create a template sharing ecosystem for users to collaborate
- **Scalable Architecture**: Build a platform that can handle growing user demands
- **Monetization Ready**: Implement billing and subscription features for sustainable growth

## Literature Review

### Existing Solutions Analysis

**WordPress**: Highly customizable but requires technical knowledge for advanced features. Plugin ecosystem is vast but can lead to security vulnerabilities.

**Webflow**: Provides visual web design tools with code export but has a steep learning curve and expensive pricing tiers. Limited template sharing capabilities.

**Shopify**: E-commerce focused with limited general website building capabilities. Complex for non-commerce sites.

## Limitation of Existing Literature Review

- **Complex User Experience**: Steep learning curves with overwhelming interfaces that distract non-coders from their main goal of building websites, forcing them to waste time learning complex ecosystems instead of focusing on content creation
- **Limited Template Marketplace**: Lack of community-driven template sharing and forking
- **Complex Pricing**: Subscription-based models without one-time payment options
- **Limited Component System**: Restricted component libraries without extensibility
- **No Edge Computing**: Missing modern performance optimizations

## Outcomes of The Project

1. **Easy to use Drag-and-Drop Builder**: Wide variety of pre-built components including forms, galleries, pricing tables, testimonials
2. **Template Marketplace**: Community-driven template sharing with forking capabilities
3. **Custom Domain Integration**: Full Vercel DNS integration with automatic SSL provisioning
4. **Billing System**: Stripe-powered one-time payments with FREE and PRO tiers
5. **Performance Optimization**: Edge middleware for custom domains and offline (shows offline page when user is offline) capabilities
6. **Authentication System**: Secure NextAuth.js implementation with profile management
7. **Real-time Preview**: preview system with published site generation
8. **Component Hierarchy**: Advanced nested component system with position reordering
9. **Multi-page Management**: Complete page management with navbar routing and SEO optimization
10. **Database Integration**: PostgreSQL with Prisma ORM for scalable data management

## Tools and Technology used in The Project

### Development Environment

- **Visual Studio Code**: Primary Editor with extensions for React, TypeScript, and Tailwind CSS
- **Node.js 18+**: Runtime environment for development and deployment
- **Git**: Version control with GitHub repository management

### Frontend Technologies

- **Next.js 15.3.5**: React framework with App Router for modern web development
- **React 19.0.0**: Component-based UI library with latest features
- **Tailwind CSS 3.3.3**: Utility-first CSS framework for responsive design
- **React DnD**: Drag-and-drop functionality for component builder
- **Zustand 5.0.3**: State management for client-side data

### Backend Technologies

- **NextAuth.js 4.24.11**: Authentication system with credentials provider
- **Prisma 6.11.1**: Modern ORM for database operations
- **NeonDB PostgreSQL**: Primary database for data persistence
- **bcryptjs 3.0.2**: Password hashing and security
- **Vercel Postgres**: Managed database service

### Payment & Billing

- **Stripe 18.5.0**: Payment processing and subscription management
- **@stripe/stripe-js 7.9.0**: Client-side Stripe integration
- **Webhook Integration**: Stripe webhook handling for payment confirmation

### Infrastructure & Deployment

- **Vercel**: Hosting platform with edge computing capabilities
- **Vercel API**: Custom domain management and DNS configuration
- **Edge Runtime**: Middleware for custom domain routing
- **Service Worker**: PWA capabilities for offline functionality

### Development Tools

- **Prettier**: Code formatting and style consistency
- **ESLint**: Code quality and consistency enforcement
- **PostCSS**: CSS processing and optimization
- **Prisma Migrate**: Database schema versioning

### External Integrations

- **Vercel DNS**: Custom domain management (216.198.79.1 A record, f69a4e046fbb9111.vercel-dns-017.com CNAME)
- **CDN Integration**: Tailwind CSS CDN for published sites

## Environmental Setup

### Prerequisites

- Node.js 18.0.0 or higher
- PostgreSQL database (local or cloud based like neonDB) & add the `Database Connection URI` as environment variable in the `.env` file (you have to make this file if you don’t have it. check the `.evn.example` file for reference).
- Vercel account for deployment & after deployment add these (`VERCEL_ACCESS_TOKEN`, `VERCEL_PROJECT_ID` & `VERCEL_TEAM_ID`) as environment variables if you want the custom domain system to work. You can get them in your vercel account.
- Stripe account for payment processing & add these environment variables (`STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KE`, `STRIPE_PRO_PRICE_ID`, `STRIPE_WEBHOOK_SECRET`). You can get them in your stripe account.
- Git for version control

### Installation Steps

1. **Clone the Repository**

```bash
git clone https://github.com/SADMAN30102001SAKIB/static-site-builder.git
cd static-site-builder
```

2. **Install Dependencies**

```bash
npm install
# or
pnpm install
```

###### This will auto install all packages from `package.json` file

3. **Environment Configuration**
   Create `.env` file with the following variables (check my `.env.example` file as reference):

```env
# ✅ REQUIRED (Core app)
DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"
NEXTAUTH_SECRET="your-secret-key-here" # any random string

# App URL (only for production: add your deployed app's URL. it's optional for localhost)
# NEXT_PUBLIC_APP_URL="https://subdomain.vercel.com"
# NEXTAUTH_URL="https://subdomain.vercel.com"

# Custom Domains (Vercel integration)
VERCEL_ACCESS_TOKEN="your-vercel-token-here"
VERCEL_PROJECT_ID="your-project-id-here"
VERCEL_TEAM_ID="your-team-id-here"

# Billing (Stripe payments)
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_PRO_PRICE_ID="price_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

4. **Database Setup**

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# (Optional) Seed the database
npx prisma db seed
```

5. **Development Server**

```bash
npm run dev
# or
pnpm dev
```

## Project Description

### Key Features

#### 1. Visual Website Builder

- **Comprehensive Component Library**: Headers, text blocks, images, buttons, forms, galleries, pricing tables, testimonials, hero sections, navigation bars, footers, dividers, spacers, and many more
- **Drag-and-Drop Interface**: Intuitive component placement with visual feedback
- **Real-time Editing**: Live property editing panel with instant preview
- **Nested Components**: Support for container components with child elements
- **Component Hierarchy**: Advanced parent-child relationships with proper positioning

#### 2. Template Marketplace System

- **Template Sharing**: Users can share their published websites as community templates
- **Template Forking**: One-click template duplication with proper component hierarchy preservation
- **Fork Counter**: Track template popularity and usage statistics
- **Template Management**: Users can manage their shared templates and remove them from marketplace

#### 3. Advanced Authentication & User Management

- **NextAuth.js Integration**: Secure authentication with credentials provider
- **User Profiles**: Comprehensive profile management with avatar, bio, and account details
- **Password Management**: Secure password change functionality with validation
- **Session Management**: JWT-based sessions with automatic token refresh

#### 4. Billing & Subscription System

- **Stripe Integration**: Complete payment processing with one-time payments
- **FREE Tier**: 2 published website limit with full builder access
- **PRO Tier**: Unlimited published websites and custom domain access
- **Billing Dashboard**: Usage tracking, plan management, and upgrade flow
- **Webhook Processing**: Automatic plan upgrades upon successful payment

#### 5. Custom Domain Management

- **Vercel DNS Integration**: Automatic domain registration with Vercel
- **A Record Support**: Base domain configuration (216.198.79.1)
- **CNAME Support**: Subdomain configuration (f69a4e046fbb9111.vercel-dns-017.com)
- **SSL Certificates**: Automatic SSL provisioning through Vercel
- **Domain Verification**: Real-time domain verification status checking

#### 6. Progressive Web App Features

- **Service Worker**: When offline, instead of the browser's default **No Internet Connection** page, it shows a custom **Offline Page**.
- **Performance Optimization**: Edge runtime middleware for fast loading for static sites.

### Project Outline

#### Database Schema

- **Users**: Authentication, billing, and profile information
- **Websites**: Website metadata, custom domains, and publication status
- **Pages**: Individual page management with routing and SEO
- **Components**: Component hierarchy with properties and positioning

#### API Architecture

- **RESTful APIs**: Comprehensive API endpoints for all operations
- **Authentication Middleware**: Secure API access with session validation
- **Error Handling**: Consistent error responses and validation
- **Performance Optimization**: Database query & transaction optimization and caching

#### Component System

Built-in components organized by categories:

- **Basic Elements**: Heading, Text, Image, Button, Video, Logo
- **Layout Components**: Container, Columns, Divider, Spacer
- **Form Elements**: Text Input, Textarea, Checkbox, Select, Contact Form
- **Sections**: Hero, Features Grid, Testimonials, Pricing Table, Gallery
- **Navigation**: Navbar, Footer, Social Links, Call-to-Action

### Project Implementation

#### Frontend Implementation

- **React Components**: Modular component architecture with reusable UI elements
- **State Management**: Zustand for global state and React state for local component state
- **Drag-and-Drop**: React DnD implementation with custom drop zones and drag sources
- **Form Handling**: Custom form hooks with validation and error handling
- **Responsive Design**: Mobile-first approach with Tailwind CSS utilities

#### Backend Implementation

- **API Routes**: Next.js API routes for server-side functionality
- **Database Operations**: Prisma ORM for type-safe database interactions
- **Authentication**: NextAuth.js with custom credentials provider
- **Payment Processing**: Stripe webhook integration for payment confirmation
- **Domain Management**: Vercel API integration for domain operations

#### Deployment Strategy

- **Vercel Platform**: Optimized for Next.js applications
- **Edge Runtime**: Middleware for custom domain routing
- **Database Migration**: Automated migration deployment
- **Environment Variables**: Secure configuration management

## Discussion and Future Work

### Current Achievements

The project successfully implements a comprehensive website builder with advanced features like template marketplace and one-time payment model provides unique value propositions in the market.

### Performance Metrics

- **Build Time**: Optimized build process with minimal bundle size
- **Load Speed**: Edge computing ensures fast global performance
- **SEO Optimization**: Server-side rendering for published sites

### Future Enhancements

#### 1. Code Export & Asset Management

- **HTML/CSS Export**: Generate clean, production-ready static files
- **CDN Integration**: Amazon S3/CloudFront or Cloudinary for asset (_images/videos_) delivery

#### 2. Version Control & History

- **Git-like Versioning**: Full design history with branching
- **Named Snapshots**: User-created save points
- **Collaborative Editing**: Real-time multi-user editing with conflict resolution
- **Rollback System**: One-click revert to any previous state

#### 3. Advanced Component System

- **Custom Component Builder**: Visual/Code based component creation tool
- **Component Marketplace**: Buy/sell custom components
- **Dynamic Data Binding**: Connect components to APIs/databases

#### 4. Scalability Considerations

- **Database Optimization**: Query optimization and indexing strategies
- **CDN Integration**: Global content delivery for better performance
- **Caching Strategy**: Redis integration for session and data caching
- **Microservices**: Service decomposition for better maintainability

## Conclusion

Static Site Builder represents a significant advancement in website building technology, combining ease of use with enterprise-grade features. The project successfully addresses limitations of existing solutions by providing:

- A comprehensive drag-and-drop builder with built-in components
- Community-driven template marketplace with forking capabilities
- Advanced custom domain management with automatic SSL
- Flexible billing system with one-time payment options
- Progressive web app features for offline support

The technical implementation demonstrates modern web development practices using Next.js, Prisma, Stripe, and cloud-native technologies. The project is positioned for commercial success with its unique feature set and scalable architecture.

The codebase is well-structured, maintainable, and ready for production deployment, making it an excellent foundation for a sustainable website building platform.

## Links

- **Live Demo**: [https://staticsitebuilder.sadman.me](https://staticsitebuilder.sadman.me)
- **GitHub Repository**: [https://github.com/SADMAN30102001SAKIB/static-site-builder](https://github.com/SADMAN30102001SAKIB/static-site-builder)

## References

**Md. Sozib Hossain**  
মোঃ সজিব হোসেন  
Lecturer

📍 Room No: 116, Academic Building 1 (CSE)  
📞 Phone: 880-1771905794  
📧 Email: sozibruet99@gmail.com  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;sozib.hossain@cse.ruet.ac.bd  
🌐 Website: https://www.cse.ruet.ac.bd/md.-sozib-hossain
