# Static Site Builder

A comprehensive drag-and-drop website builder with professional tools
for creating static websites without coding.

## Introduction

Static Site Builder is an easy to use modern, feature-rich platform that
empowers users to create professional static websites through an
intuitive drag-and-drop interface. Built with Next.js and deployed on
Vercel, it combines ease of use with enterprise-grade features including
custom domain management, template sharing, and integrated billing for
premium usage.

## Objective of The Project

- **Democratize Web Development**: Enable anyone to create

  > professional websites without coding knowledge

- **Provide Enterprise Features**: Offer advanced tools like custom

  > domains, template marketplace, and billing integration

- **Ensure Performance**: Deliver fast, SEO-optimized static sites

  > with edge computing

- **Foster Community**: Create a template sharing ecosystem for users

  > to collaborate

- **Scalable Architecture**: Build a platform that can handle growing

  > user demands

- **Monetization Ready**: Implement billing and subscription features
  > for sustainable growth

## Literature Review Existing Solutions Analysis:

- **WordPress**: Highly customizable but requires technical knowledge

  > for advanced features. The plugin ecosystem is vast but can lead
  > to security vulnerabilities **\[1\]**

- **Webflow**: Provides visual web design tools with code export but

  > has a steep learning curve, limited page creation in free trial
  > and expensive pricing tiers **\[2\]**

- **Shopify**: E-commerce focused with limited general website

  > building capabilities. Complex for non-commerce sites **\[3\]**

- **Wix**: Beginner-friendly with drag-and-drop simplicity, but
  > Limited template sharing capabilities **\[4\]**

## Limitation of Existing Literature Review

- **Complex User Experience**: Steep learning curves with overwhelming

  > interfaces that distract non-coders from main goal of building
  > simple static websites, forcing them to waste time learning their
  > complex ecosystems instead of focusing on creation

- **Limited Template Marketplace**: Lack of community-driven template

  > sharing and one-click forking except for _webflow_

- **Complex & High Pricing**: Subscription-based models without

  > one-time payment options

- **No Edge Computing**: Missing modern performance optimizations
  > except for _webflow_

## Outcomes of The Project

1.  **Easy to use Drag-and-Drop Builder**: Wide variety of pre-built

    > components including forms, galleries, pricing tables,
    > testimonials

2.  **Template Marketplace**: Community-driven template sharing with

    > forking capabilities

3.  **Custom Domain Integration**: Full Vercel DNS integration with

    > automatic SSL provisioning

4.  **Billing System**: Stripe-powered one-time payments with FREE and

    > PRO tiers

5.  **Performance Optimization**: Edge middleware for checking custom

    > domains and offline (shows offline page when user is offline)
    > capabilities

6.  **Authentication System**: Secure NextAuth.js implementation with

    > profile management

7.  **Real-time Preview**: preview system with published site generation

8.  **Component Hierarchy**: Advanced nested component system with

    > position reordering

9.  **Multi-page Management**: Complete page management with navbar

    > routing and SEO optimization

10. **Database Integration**: PostgreSQL with Prisma ORM for scalable
    > data management

## Tools and Technology used in The Project

### Development Environment:

- **Visual Studio Code**: Primary Editor with extensions for React,

  > TypeScript, and Tailwind CSS

- **Node.js v18 or higher**: Runtime environment for development and

  > deployment

- **Git**: Version control with GitHub repository management

### Frontend Technologies:

- **Next.js v15.3.5**: React framework with App Router for modern web

  > development

- **React v19.0.0**: Component-based UI library with latest features

- **Tailwind CSS v3.3.3**: Utility-first CSS framework for responsive

  > design

- **React DnD**: Drag-and-drop functionality for component builder

- **Zustand v5.0.3**: State management for client-side data

- **CDN Integration**: Tailwind CSS CDN for published sites

### Backend Technologies:

- **NextAuth.js v4.24.11**: Authentication system with credentials

  > provider

- **Prisma v6.11.1**: Modern ORM for database operations

- **NeonDB PostgreSQL**: Primary database for data persistence

- **bcryptjs v3.0.2**: Password hashing and security

- **Vercel DNS**: Custom domain management:

> _216.198.79.1_ for A record & _f69a4e046fbb9111.vercel-dns-017.com_
> for CNAME

### Payment & Billing:

- **Stripe v18.5.0**: Payment processing and subscription management

- **\@stripe/stripe-js v7.9.0**: Client-side Stripe integration

- **Webhook Integration**: Stripe webhook handling for payment
  > confirmation

### Infrastructure & Deployment:

- **Vercel**: Hosting platform with edge computing capabilities

- **Vercel API**: Custom domain management and DNS configuration

- **Edge Runtime**: Middleware for custom domain routing

- **Service Worker**: PWA capabilities for offline functionality

### Development Tools:

- **Prettier**: Code formatting and style consistency

- **ESLint**: Code quality and consistency enforcement

- **PostCSS**: CSS processing and optimization

- **Prisma Migrate**: Database schema versioning

## Environmental Setup

### Prerequisites:

- Node.js v18.0.0 or higher

- PostgreSQL database (local or cloud based like neonDB) & add the

  > [Database Connection URI]{.mark} as environment variable in the
  > [.env]{.mark} file (you have to make this file if you don't have
  > it. check the [.env.example]{.mark} file for reference).

- Vercel account for deployment & after deployment add these

  > ([VERCEL_ACCESS_TOKEN]{.mark}, [VERCEL_PROJECT_ID]{.mark} &
  > [VERCEL_TEAM_ID]{.mark}) as environment variables if you want the
  > custom domain system to work. You can get them from your vercel
  > account. You can continue without this but the domain feature will
  > not work.

- Stripe account for payment processing & add these environment

  > variables ([STRIPE_SECRET_KEY]{.mark},
  > [STRIPE_PRO_PRICE_ID]{.mark}, [STRIPE_WEBHOOK_SECRET]{.mark} &
  > [NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY]{.mark}). You can get them in
  > your stripe account. You can continue without this but the payment
  > feature will not work.

- Git for version control

### Installation Steps:

1.  **Clone the Repository**

git clone
https://github.com/SADMAN30102001SAKIB/static-site-builder.git\
\
cd static-site-builder

2.  **Install Dependencies**

npm install

######

###### This will automatically install all packages from the [package.json]{.mark} file

3.  **Environment Configuration**\
    > Create [.env]{.mark} file with the following variables (check the
    > [.env.example]{.mark} file as reference):

\# ✅ REQUIRED (Core app)\
DATABASE_URL=\"postgresql://username:password@host:port/database?sslmode=require\"\
NEXTAUTH_SECRET=\"your-secret-key-here\" \# any random string\
\
\# App URL (only for production: add your deployed app\'s URL. it's
optional for localhost)\
\# NEXT_PUBLIC_APP_URL=\"https://subdomain.vercel.com\"\
\# NEXTAUTH_URL=\"https://subdomain.vercel.com\"\
\
\# Custom Domains (Vercel integration).\
VERCEL_ACCESS_TOKEN=\"your-vercel-token-here\"\
VERCEL_PROJECT_ID=\"your-project-id-here\"\
VERCEL_TEAM_ID=\"your-team-id-here\"\
\
\# Billing (Stripe payments)\
STRIPE_SECRET_KEY=\"sk_test\_\...\"\
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=\"pk_test\_\...\"\
STRIPE_PRO_PRICE_ID=\"price\_\...\"\
STRIPE_WEBHOOK_SECRET=\"whsec\_\...\"

4.  **Database Setup**

\# Generate Prisma client\
npx prisma generate\
\
\# Run database migrations\
npx prisma migrate dev

5.  **Development Server**

npm run dev

##

## Then open [localhost:3000]{.mark} in your browser **Project Description**

**Key Features:**

**1. Advanced Authentication & User Management**

- **NextAuth.js Integration:** Secure authentication with credentials

  > provider

- **User Profiles:** Comprehensive profile management with avatar,

  > bio, and account details

- **Password Management:** Secure password change functionality with

  > validation

- **Session Management:** JWT-based sessions with automatic token
  > refresh

![](./screenshots/image13.png){width="3.01in"
height="1.78083552055993in"}![](./screenshots/image4.png){width="3.21in"
height="1.7856266404199475in"}

![](./screenshots/image8.png){width="3.11in"
height="1.7151498250218722in"}![](./screenshots/image6.png){width="3.11in"
height="1.7151498250218722in"}

#### 2. Visual Website Builder

- **Comprehensive Component Library**: Headers, text blocks, images,

  > buttons, forms, galleries, pricing tables, testimonials, hero
  > sections, navigation bars, footers, dividers, spacers, and many
  > more

- **Drag-and-Drop Interface**: Intuitive component placement with

  > visual feedback

- **Real-time Editing**: Live property editing panel with instant

  > preview

- **Nested Components**: Support for container components with child

  > elements

- **Component Hierarchy**: Advanced parent-child relationships with
  > proper positioning

![](./screenshots/image11.png){width="3.21in"
height="1.8329002624671915in"}![](./screenshots/image12.png){width="3.21in"
height="1.8165912073490813in"}

![](./screenshots/image16.png){width="3.11in"
height="1.7148600174978128in"}![](./screenshots/image15.png){width="3.11in"
height="1.705171697287839in"}![](./screenshots/image18.png){width="3.11in"
height="1.705171697287839in"}![](./screenshots/image17.png){width="3.11in"
height="1.7148600174978128in"}

#### 3. Template Marketplace System

- **Template Sharing**: Users can share their published websites as

  > community templates

- **Template Forking**: One-click template duplication with proper

  > component hierarchy

- **Fork Counter**: Track template popularity and usage statistics

- **Template Management**: Users can manage their shared templates and
  > remove them from marketplace

![](./screenshots/image10.png){width="3.21in"
height="1.7753051181102362in"}![](./screenshots/image2.png){width="3.21in"
height="1.7649835958005249in"}

**4. Custom Domain Management**

- **Vercel DNS Integration**: Automatic domain registration with

  > Vercel

- **A Record Support**: Base domain configuration (216.198.79.1)

- **CNAME Support**: Subdomain configuration

  > (f69a4e046fbb9111.vercel-dns-017.com)

- **SSL Certificates**: Automatic SSL provisioning through Vercel

- **Domain Verification**: Real-time domain verification status
  > checking

![](./screenshots/image1.png){width="3.21in"
height="1.745618985126859in"}![](./screenshots/image7.png){width="3.21in"
height="1.7546620734908136in"}![](./screenshots/image14.png){width="6.5in"
height="3.6527777777777777in"}

####

#### 5. Billing & Subscription System

- **Stripe Integration**: Complete payment processing with one-time

  > payments

- **FREE Tier**: 2 published website limit with full builder access

- **PRO Tier**: Unlimited published websites and custom domain access

- **Billing Dashboard**: Usage tracking, plan management, and upgrade

  > flow

- **Webhook Processing**: Automatic plan upgrades upon successful
  > payment\<

![](./screenshots/image5.png){width="3.21in"
height="1.7546620734908136in"}![](./screenshots/image3.png){width="3.21in"
height="1.7753051181102362in"}

#### 6. Progressive Web App Features

- **Service Worker**: When offline, instead of the browser\'s default

  > **No Internet Connection** page, it shows a custom **Offline
  > Page**

- **Performance Optimization**: Edge runtime middleware for fast
  > loading for static sites

![](./screenshots/image9.png){width="6.5in" height="3.6527777777777777in"}

### Project Outline

#### Application Navigation Flow

```
🌐 Static Site Builder
│
├── Home (/)
│   ├── → Login (/login)
│   └── → Register (/register)
│
├── Login (/login)
│   └── → Dashboard (/dashboard)
│
├──  Register (/register)
│   └── → Dashboard (/dashboard)
│
├── Dashboard (/dashboard)
│   ├── → Websites (/dashboard/websites)
│   ├── → Templates (/dashboard/templates)
│   ├── → Domains (/dashboard/domains)
│   ├── → Billing (/dashboard/billing)
│   ├── → Profile (/dashboard/profile)
│   └── → Settings (/dashboard/settings)
│
├── Websites (/dashboard/websites)
│   ├── → Website Details (/dashboard/websites/[id])
│   └── → New Website (create form)
│
├── Website Details (/dashboard/websites/[id])
│   ├── → Pages (/dashboard/websites/[id]/pages)
│   ├── → Preview (/preview/[id])
│   └── → Live Site (/site/[slug])
│
├── Pages Management (/dashboard/websites/[id]/pages)
│   ├── → New Page (/dashboard/websites/[id]/pages/new)
│   └── → Page Builder (/builder/[id]/pages/[pageId])
│
├── New Page (/dashboard/websites/[id]/pages/new)
│   └── → Page Builder (/builder/[id]/pages/[pageId])
│
├── Page Builder (/builder/[id]/pages/[pageId])
│   ├── → Pages Management (/dashboard/websites/[id]/pages)
│   ├── → Preview (/preview/[id])
│   └── → Dashboard (/dashboard)
│
├── Templates (/dashboard/templates)
│   ├── → My Templates (/dashboard/templates/my-templates)
│   └── → Dashboard (after forking)
│
├── My Templates (/dashboard/templates/my-templates)
│   └── → Templates (/dashboard/templates)
│
├── Domains (/dashboard/domains)
│   └── → Dashboard (/dashboard)
│
├── Billing (/dashboard/billing)
│   └── → Dashboard (/dashboard)
│
├── Profile (/dashboard/profile)
│   └── → Dashboard (/dashboard)
│
├── Settings (/dashboard/settings)
│   ├── → Change Password (/dashboard/settings/password)
│   └── → Dashboard (/dashboard)
│
├── Change Password (/dashboard/settings/password)
│   └── → Settings (/dashboard/settings)
│
├── Preview (/preview/[id])
│   ├── → Page Builder (/builder/[id]/pages/[pageId])
│   └── → Website Details (/dashboard/websites/[id])
│
└── Live Site (/site/[slug])
    ├── → Page (/site/[slug]/[pagePath])
    └── → Homepage (/site/[slug])
```

#### Database Schema

- **Users**: Authentication, billing, profile information
- **Websites**: Website metadata, domains, publication status
- **Pages**: Page management, routing, SEO
- **Components**: Component hierarchy, properties, positioning

#### API Architecture

- **Authentication**: `/api/auth/*` - Login, register, session management
- **User Management**: `/api/user/*` - Profile, password updates
- **Websites**: `/api/websites/*` - CRUD operations, publishing
- **Pages**: `/api/pages/*` - Page management, content
- **Components**: `/api/components/*` - Builder operations
- **Templates**: `/api/templates/*` - Marketplace, forking
- **Domains**: `/api/domains/*` - Custom domain management
- **Billing**: `/api/billing/*` - Stripe integration, webhooks

### Project Implementation:

#### Frontend Implementation

- **React Components**: Modular component architecture with reusable

  > UI elements

- **State Management**: Zustand for global state and React state for

  > local component state

- **Drag-and-Drop**: React DnD implementation with custom drop zones

  > and drag sources

- **Form Handling**: Custom form hooks with validation and error

  > handling

- **Responsive Design**: Mobile-first approach with Tailwind CSS
  > utilities

#### Backend Implementation

- **API Routes**: Next.js API routes for server-side functionality

- **Database Operations**: Prisma ORM for type-safe database

  > interactions

- **Authentication**: NextAuth.js with custom credentials provider

- **Payment Processing**: Stripe webhook integration for payment

  > confirmation

- **Domain Management**: Vercel API integration for domain operations

#### Deployment Strategy

- **Vercel Platform**: Optimized for Next.js applications

- **Edge Runtime**: Middleware for custom domain routing

- **Database Migration**: Automated migration deployment

- **Environment Variables**: Secure configuration management

## Discussion and Future Work

### Current Achievements:

The project successfully implements a comprehensive website builder with
advanced features like template marketplace and one-time payment model
provides unique value in the market.

### Performance Metrics:

- **Build Time**: Optimized build process with minimal bundle size

- **Load Speed**: Edge computing ensures fast global performance

- **SEO Optimization**: Server-side rendering for published sites

### Future Enhancements:

#### 1. Code Export & Asset Management

- **HTML/CSS Export**: Generate clean, production-ready static files

- **CDN Integration**: Amazon S3/CloudFront or Cloudinary for asset
  > (_images/videos_) delivery

#### 2. Version Control & History

- **Git-like Versioning**: Full design history with branching

- **Named Snapshots**: User-created save points

- **Collaborative Editing**: Real-time multi-user editing with

  > conflict resolution

- **Rollback System**: One-click revert to any previous state

#### 3. Advanced Component System

- **Custom Component Builder**: Visual/Code based component creation

  > tool

- **Component Marketplace**: Buy/sell custom components

- **Dynamic Data Binding**: Connect components to APIs/databases

### 4. Scalability Considerations

- **Database Optimization**: Query optimization and indexing

  > strategies

- **CDN Integration**: Global content delivery for better performance

- **Caching Strategy**: Redis integration for session and data caching

- **Microservices**: Service decomposition for better maintainability

## Conclusion

Static Site Builder represents a significant advancement in website
building technology, combining ease of use with enterprise-grade
features. The project successfully addresses limitations of existing
solutions by providing:

- A comprehensive drag-and-drop builder with built-in components

- Community-driven template marketplace with forking capabilities

- Advanced custom domain management with automatic SSL

- Flexible billing system with one-time payment options

- Progressive web app features for offline support

It demonstrates modern web development practices using Next.js, Prisma,
Stripe, and cloud-native technologies. The project is well-structured,
maintainable & positioned for commercial success with its unique feature
set and scalable architecture and ready for production deployment.
making it an excellent foundation for a website building platform.

## Links

- **Live Demo**:

  > [[https://staticsitebuilder.sadman.me]{.underline}](https://staticsitebuilder.sadman.me)

- **GitHub Repository**:
  > [<https://github.com/SADMAN30102001SAKIB/static-site-builder>\
  >
  > > \
  > > ]{.underline}

## References

\[1\] "WordPress -- Open Source CMS," WordPress.org. \[Online\].
Available: https://wordpress.org. \[Accessed: 09-Sep-2025\].

\[2\] "Webflow -- No-code Website Builder," Webflow.com. \[Online\].
Available: https://webflow.com. \[Accessed: 09-Sep-2025\].

\[3\] "Wix -- Website Builder," Wix.com. \[Online\]. Available:
https://www.wix.com. \[Accessed: 09-Sep-2025\].

\[4\] "Shopify -- Ecommerce Platform," Shopify.com. \[Online\].
Available: https://www.shopify.com. \[Accessed: 09-Sep-2025\].
