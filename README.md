# **Static Site Builder**
A comprehensive drag-and-drop website builder with professional tools for creating static websites without coding.

## **Introduction**
Static Site Builder is an easy to use modern, feature-rich platform that empowers users to create professional static websites through an intuitive drag-and-drop interface. Built with Next.js and deployed on Vercel **[1]**, it combines ease of use with enterprise-grade features including custom domain management, template sharing, and integrated billing for premium usage.

## **Objective of The Project**
* **Democratize Static Site Development**: Enable anyone to create professional static sites without coding knowledge  
* **Provide Enterprise Features**: Offer advanced tools like custom domains, template marketplace.  
* **Ensure Performance**: Deliver fast, SEO-optimized websites with edge computing & CDN  
* **Foster Community**: Create a template sharing ecosystem for users  
* **Scalable Architecture**: Build a platform that can handle growing user demands  
* **Monetization Ready**: Implement billing and subscription features for sustainable growth

## **Literature Review** 
### **Existing Solutions Analysis:**
* **WordPress**: A fully customizable, open-source CMS that powers everything from personal blogs to enterprise websites, supported by the largest plugin ecosystem, flexible themes, strong SEO features, and a massive global community. **[2]**
![WordPress](public/screenshots/01.png)
####
* **Webflow**: A professional-grade visual web design platform that combines pixel-perfect design control, responsive layout tools, CMS functionality, and clean HTML/CSS/JS code export. **[3]**
![Webflow](public/screenshots/02.png)
####
* **Shopify**: A complete e-commerce solution that provides secure hosting, integrated payments, scalable infrastructure, an extensive app marketplace, and built-in tools for managing products, inventory, and global online sales. **[4]**
![Shopify](public/screenshots/03.png)
####
* **Wix**: An all-in-one website builder with intuitive drag-and-drop editing, hundreds of templates, built-in hosting, app integrations, and AI-assisted design features, making it ideal for experts creating professional websites quickly. **[5]**
![Wix](public/screenshots/04.png)

## **Limitations of Existing Literature Review**
* **Complex User Experience**: Steep learning curves with overwhelming interfaces that distract non-coders from main goal of building simple static websites, forcing them to waste time learning their complex ecosystems instead of focusing on creation  
* **Security Issues:** The plugin ecosystem of Wordpress is vast but often leads to security vulnerabilities  
* **Limited Template Marketplace**: Lack of community-driven template sharing and one-click forking except for *webflow*  
* **Limited Usage:** Webflow has limits in page creation in free trial  
* **Complex Pricing**: Subscription-based models without one-time payment options  
* **Too Niche:** Shopify is E-commerce focused with limited general website building capabilities  
* **No Edge Computing**: Missing modern performance optimizations except for *webflow*

## **Outcomes of The Project**
1. **Easy to use Drag-and-Drop Builder**: Wide variety of pre-built customizable components including forms, galleries, pricing tables, testimonials  
2. **Authentication System**: Secure NextAuth.js implementation with profile management  
3. **Template Marketplace**: Community-driven template sharing with one click forking capabilities  
4. **No Limits:** Unlimited Website & Page Creation. Just making a site *live* has limit of 2 in FREE trial  
5. **Billing System**: Stripe-powered one-time payment to become a PRO user **[6]**  
6. **Performance Optimization**: Edge middleware for checking custom domains and offline (shows custom offline page when user is offline) capabilities & CDN for fast loading for static assets like images/videos/fonts/logos etc.  
7. **Versatility:** Supports blogs, portfolios, business sites & overall any kind of static sites. Not limited to a single niche.  
8. **Custom Domain Integration**: Full Vercel DNS integration with automatic SSL provisioning  
9. **Real-time Preview**: preview system with published site generation  
10. **Component Hierarchy**: Advanced nested component system with position reordering  
11. **Multi-page Management**: Complete page management with navbar routing and SEO optimization  
12. **Database Integration**: PostgreSQL with Prisma ORM for scalable data management

## **Tools and Technology used in The Project**
### **Development Environment:**
* **Visual Studio Code**: Primary Editor with extensions for React, and Tailwind CSS  
* **Node.js v18 or higher**: Runtime environment for development and deployment  
* **Git**: Version control with GitHub repository management

### **Frontend Technologies:**
* **Next.js v15.3.5**: React framework with App Router for modern web development  
* **React v19.0.0**: Component-based UI library with latest features  
* **Tailwind CSS v3.3.3**: Utility-first CSS framework for responsive design  
* **React DnD**: Drag-and-drop functionality for component builder  
* **Zustand v5.0.3**: Global state management for client-side data  
* **Service Worker**: PWA capabilities for offline functionality  
* **CDN Integration**: Tailwind CSS CDN for published sites

### **Backend Technologies:**
* **NextAuth.js v4.24.11**: Authentication system with credentials provider  
* **Prisma v6.11.1**: Modern ORM for database operations  
* **NeonDB PostgreSQL**: Primary database for data persistence  
* **bcryptjs v3.0.2**: Password hashing and security

### **Payment & Billing:**
* **Stripe v18.5.0**: Payment processing and subscription management  
* **@stripe/stripe-js v7.9.0**: Client-side Stripe integration  
* **Webhook Integration**: Stripe webhook handling for payment confirmation

### **Development Tools:**
* **Prettier**: Code formatting and style consistency  
* **ESLint**: Code quality and consistency enforcement  
* **PostCSS**: CSS processing and optimization

## **Environmental Setup**
### **Prerequisites:**
* Node.js v18.0.0 or higher  
* PostgreSQL database (local or cloud based like neonDB) & add the Database Connection URI as environment variable in the .env file (you have to make this file if you don’t have it. check the .env.example file for reference).  
* **Vercel** account for deployment & after deployment add these (VERCEL\_ACCESS\_TOKEN, VERCEL\_PROJECT\_ID and VERCEL\_TEAM\_ID) as environment variables if you want the custom domain system to work. You can get them from your vercel account. You can continue without this but the domain feature will not work. **[1]**  
* **Stripe** account for payment processing & add these environment variables (STRIPE\_SECRET\_KEY, STRIPE\_PRO\_PRICE\_ID, STRIPE\_WEBHOOK\_SECRET and NEXT\_PUBLIC\_STRIPE\_PUBLISHABLE\_KEY). You can get them from your stripe account. You can continue without this but the payment feature will not work. **[6]**  
* Git for version control

### **Installation Steps:**
1. **Clone the Repository**
```
git clone https://github.com/SADMAN30102001SAKIB/static-site-builder.git

cd static-site-builder
```
2. **Install Dependencies**
```
npm install
```
###### This will automatically install all packages from the package.json file 

3. **Environment Configuration**  
   Create .env file with the following variables (check the .env.example file as reference):
```
# REQUIRED (Core app)  
DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"  
NEXTAUTH_SECRET="your-secret-key-here" # any random string

# App URL (only for production: add your deployed app's URL. it's optional for localhost)  
# NEXT_PUBLIC_APP_URL="https://subdomain.vercel.com"  
# NEXTAUTH_URL="https://subdomain.vercel.com"

# Custom Domains (Vercel integration).  
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
```
# Generate Prisma client  
npx prisma generate  
# Run database migrations  
npx prisma migrate dev
```
5. **Development Server**
```
npm run dev
```
###### Then open localhost:3000 in your browser   

## **Project Description**
### **Key Features:**  
#### **1\. Advanced Authentication & User Management**
* **NextAuth.js Integration:** Secure authentication with credentials provider  
* **User Profiles:** Comprehensive profile management with avatar, bio, and account details  
* **Password Management:** Secure password change functionality with validation  
* **Session Management:** JWT-based sessions with automatic token refresh

#### **2\. Visual Website Builder**
* **Comprehensive Component Library**: Headers, text blocks, images, buttons, forms, galleries, pricing tables, testimonials, hero sections, navigation bars, footers, dividers, spacers, and many more  
* **Multi-page Management**: Complete page management with navbar routing and SEO optimization  
* **Drag-and-Drop Interface**: Intuitive component placement with position reordering  
* **Real-time Editing**: Property editing panel with instant preview  
* **Nested Components**: Support for container components which has advanced parent-child relationships with proper position reordering

#### **3\. Template Marketplace System**
* **Template Sharing**: Users can share their published websites as community templates  
* **Template Forking**: One-click template duplication with proper component hierarchy  
* **Fork Counter**: Track template popularity/usage  
* **Template Management**: Users can update their shared templates and remove them from marketplace


#### **4\. Custom Domain Management**
* **Vercel DNS Integration**: Automatic domain registration with Vercel  
* **A Record Support**: Base domain configuration (*216.198.79.1*)  
* **CNAME Support**: Subdomain configuration (*f69a4e046fbb9111.vercel-dns-017.com*)  
* **SSL Certificates**: Automatic SSL provisioning through Vercel  
* **Domain Verification**: Real-time domain verification status checking

#### **5\. Billing & Subscription System**
* **Stripe Integration**: Complete payment processing with one-time payments  
* **FREE Tier**: 2 published website & custom domain limit but with full builder access  
* **PRO Tier**: Unlimited published websites and custom domain access  
* **Billing Dashboard**: Pay to become a PRO user, Usage tracking, user’s plan status  
* **Webhook Processing**: Responsible for automatic plan upgrades upon successful payment

#### **6\. Progressive Web App Features**
* **Service Worker**: When offline, instead of the browser's default **No Internet Connection** page, it shows a custom **Offline Page**  
* **Performance Optimization**: Edge middleware for checking custom domains to **fast load custom sites** & CDN to **fast serve for static assets** like images/videos/fonts/logos etc.
![Offline Page](public/screenshots/05.png)

### **Project Outline:**
#### **Application Navigation Flow** 
![Application Navigation Flow](public/screenshots/06.png) 

#### **Database Schema**
* **Users**: Stores authentication, billing, and profile information  
  * **Fields**: `id`, `name`, `email, emailVerified`, `password`, `bio`, `image`, `plan`, `publishedWebsiteCount, stripeCustomerId` & timestamps (`createdAt`, `updatedAt`)  
  * **Relations**:  
    * One-to-many with **Websites**
* **Websites**: Stores website metadata, custom domains, and publication status  
  * **Fields**: `id`, `name`, `slug`, `description`, `published`, `customDomain`, `domainVerified`, template-related fields (`isTemplate`, `templateTags`, `forkCount, templateDescription`) & timestamps  
  * **Relations**:  
    * Belongs to a **User**  
    * One-to-many with **Pages**
* **Pages**: Represents individual pages with routing and SEO info  
  * **Fields**: `id`, `title`, `path`, `description`, `isHomePage`, `published` & timestamps  
  * **Relations**:  
    * Belongs to a **Website**  
    * One-to-many with **Components**
* **Components**: Defines page building blocks with hierarchy and positioning  
  * **Fields**: `id`, `type`, `position`, `properties`, `parentId` & timestamps  
  * **Relations**:  
    * Belongs to a **Page**  
    * Supports parent-child relationships for nested components

#### **API Design**
**RESTful API Endpoints**
├── **Authentication APIs**  
│ ├── Registration (/api/auth/register)  
│ └── NextAuth Handlers (/api/auth/[...nextauth])  
│  
├── **User Management**  
│ ├── Profile (/api/user/profile)  
│ └── Password (/api/user/password)  
│  
├── **Website APIs**  
│ ├── List/Create (/api/websites)  
│ ├── Individual (/api/websites/[id])  
│ └── Duplicate (/api/websites/duplicate)  
│  
├── **Page APIs**  
│ ├── List/Create (/api/pages)  
│ └── Individual (/api/pages/[id])  
│  
├── **Component APIs**  
│ ├── Add (/api/components/add)  
│ ├── Get & Update (/api/components/[id])  
│ └── Reorder (/api/components/reorder)  
│  
├── **Template APIs**  
│ ├── Browse (/api/templates)  
│ ├── Share (/api/templates/share)  
│ ├── Unshare (/api/templates/unshare)  
│ ├── Fork (/api/templates/fork)  
│ └── My Templates (/api/templates/my-templates)  
│  
├── **Domain APIs**  
│ ├── List/Add (/api/domains)  
│ └── Individual (/api/domains/[domain])  
│  
└── **Billing APIs**  
├── Info (/api/billing/info)  
├── Checkout (/api/billing/checkout)  
└── Webhook (/api/billing/webhook)

#### **Infrastructure & Deployment**
* **GitHub**: For repository hosting & to perform Continuous Integration/Continuous Deployment  
* **Vercel**: Hosting platform with Auto CI/CD, CDN support & fluid computing capabilities  
* **NeonDB**: Serverless database-as-a-service for postgreSQL  
* **Vercel API**: Custom domain management and DNS configuration  
* **Namecheap:** A domain registrar for purchasing domain names  
* **Edge Runtime**: Middleware for custom domain routing

### **Project Implementation:**  
#### **i. HOME PAGE (/)**  
**Description:** The main landing page where visitors first arrive. Shows off the drag-and-drop website builder with a big "Create beautiful websites without code" headline and a visual demo of how easy it is to build sites.  
![Home Page](public/screenshots/07.png)
**Points:**  
**1\. Get Started Button:** Takes new users to the registration page (/register) to create a new account and begin building their first website.  
**2\. Log In Button:** Directs existing users to the login page (/login) to access their dashboard and manage their existing websites.

#### **ii. REGISTER PAGE (/register)**  
**Description:** Registration form where new users create their account by entering their full name, email, and password. Once they complete registration, it takes them to the login page.  
![Register Page](public/screenshots/08.png)
**Points:**  
**1\. Create Account Button:** Submits the registration form and creates the new user account, then redirects them to the login page.  
**2\. Sign In Link:** Takes users who already have an account directly to the login page (/login) instead of registering.

#### **iii. LOGIN PAGE (/login)**  
**Description:** Sign in form where existing users enter their email and password to access their account. After successful login, users are taken to their dashboard.  
![Login Page](public/screenshots/09.png)
**Points:**  
**1\. Sign In Button:** Authenticates the user and redirects them to the dashboard (/dashboard) where they can manage their websites.  
**2\. Create an Account Link:** Takes users who don't have an account to the registration page (/register) to sign up.

#### **iv. DASHBOARD (/dashboard)**  
**Description:** Main control center where users manage their websites. Shows stats like total  
websites, published count, and plan info. Has a sidebar with navigation to different sections like websites, domains, templates, billing, and profile.  
![Dashboard](public/screenshots/10.png)
**Points:**  
**1\. Create Website Button:** Takes the user to the form to create a new website (/dashboard/websites/new) to start building their site.  
**2\. Sign Out Button:** Logs the user out and returns them to the home page (/).

#### **v. NEW WEBSITE (/dashboard/websites/new)**  
**Description:** Form where users create a new website by entering a unique name and description. The website gets created with a default home page.
![New Website](public/screenshots/11.png)
**Points:**  
**1\. Create Website Button:** Creates the new website and redirects to the website details page where users can manage their site.

#### **vi. WEBSITE DETAILS (/dashboard/websites/[id])**  
**Description:** Management page for a specific website showing details like creation date, status, and page count. Displays all website pages and provides quick actions for managing the site.  
![Website Details](public/screenshots/12.png)
**Points:**  
websites, published count, and plan info. Has a sidebar with navigation to different sections like websites, domains, templates, billing, and profile.  
**1\. Add New Page Button:** Takes the user to create a new page (/dashboard/websites/[id]/pages/new).  
**2\. Edit Button:** Opens the page builder (/builder/[id]/pages/[pageId]) to edit the selected page content and design.  
**3\. View All Pages Button:** Takes the user to the pages management section (/dashboard/websites/[id]/pages) to see all pages and bulk actions.  
**4\. Edit Details Button:** Opens a form to edit website information like name (must be unique) and description.  
**5\. Delete This Website Button:** Permanently removes the website and all its pages from the account.

#### **vii. NEW PAGE (/dashboard/websites/[id]/pages/new)**  
**Description:** Form to create a new page for a user's website by entering title, URL path, and optional description. Can also set it as the home page.  
![New Page](public/screenshots/13.jpeg)
**Points:**  
**1\. Create Page Button:** Creates the new page and takes the user to the view all pages section to manage all pages.

#### **vii. PAGES MANAGEMENT (/dashboard/websites/[id]/pages)**  
**Description:** Overview of all pages for the user's website where they can manage them. Shows each page's title, path, status, and provides quick actions for editing and managing.  
![Pages Management](public/screenshots/14.jpeg)
**Points:**  
**1\. Edit Content Button:** Opens the page builder to edit the page design and content.  
**2\. Edit Info Button:** Opens a form to edit page details like title, description, and URL path.  
**3\. Un/Publish Page Button:** Toggles the page between published and unpublished status. A page must be published along with the main website for it to be public.  
**4\. Add New Page Button:** Lets the user create a new page.
**5\. Set as Homepage Button:** Makes this page the main homepage for the user's website.
**6\. Delete Button:** Permanently removes that page from the user's website.

#### **ix. PAGE BUILDER (/builder/[id]/pages/[pageId])**
**Description:** The main design interface where the user builds their page by dragging components from the left sidebar onto the center canvas. The User can rearrange, style, and configure each component. 
![Page Builder](public/screenshots/15.png)
**Points:**
**1\. Component Library:** Left sidebar with draggable components like headings, paragraphs, images, and buttons that the user can drop onto the canvas and reorder them.
**2\. Properties Panel:** Right panel for styling and configuring the selected component with options like colors, fonts, links, and functionality.
**3\. Delete Component Button:** Remove the currently selected component from the user's page.
**4\. Preview Page Button:** View how the user's page looks to visitors, even if it's not published yet.

#### **x. PREVIEW (/preview/[id])**
**Description:** Shows how a user's website looks to visitors with a navigation header to browse between all pages. Users can test the design and functionality before publishing.
![Preview](public/screenshots/16.png)
**Points:**
**1\. Back to Dashboard Button:** Returns the user to the website details page to manage their site.
**2\. View Site Button:** Opens the live published version of the user's website.

#### **xi. WEBSITE DETAILS REVISITED (/dashboard/websites/[id])**
**Description:** Back to the website management page from the preview page to publish the whole site. 
![Website Details Revisited](public/screenshots/17.png)
**Points:**
**1\. Un/Publish Button:** Toggles the entire website between published and unpublished status.
**2\. (Live) View Site Button:** Opens the live website that everyone can see, using a custom domain if one is linked to the website otherwise a default URL is provided. 

#### **xii. LIVE SITE (/site/[slug])**
**Description:** The published website that visitors can see and access. Shows the actual content built with the page builder. 
![Live Site](public/screenshots/18.png)
**Points:**
**1\. Browser URL:** Shows the default StaticSiteBuilder domain, but the user can add their own custom domain to replace this.

#### **xiii. DOMAINS (/dashboard/domains)**
**Description:** Page where the user can connect their own custom domain to their websites. Shows a form to select which website to link and enter their domain name.
![Domains](public/screenshots/19.png)
**Points:**  
**1\. Domains Tab:** Navigate to the domains section from the left sidebar to manage custom domains.
**2\. Add Domain Button:** Opens the domain adding form where the user can connect a custom domain to their website.
**3\. Add Domain:** Actually adds the domain to the user's website and handles the verification process.

#### **xiv. DOMAIN CONFIGURATION (/dashboard/domains)**
**Description:** After adding a domain, this shows the DNS configuration instructions. Displays the A record OR CNAME record user needs to add to their domain provider. This triggers SSL certificate generation once everything is set up correctly (takes 1-2 minutes after DNS configuration). 
![Domain Configuration](public/screenshots/20.png)
**Points:**
**1\. Verify Button:** Checks if the DNS records are properly configured.

#### **xv. LIVE SITE WITH CUSTOM DOMAIN**
**Description:** The published website is now accessible through the user's custom domain. Shows the actual content built with the page builder but using the custom URL. 
![Live Site with Custom Domain](public/screenshots/21.png)
**Points:**
**1\. Browser URL:** Shows the custom domain URL that the user configured, replacing the default StaticSiteBuilder domain.

#### **xvi. TEMPLATES (/dashboard/templates)**
**Description:** Browse and discover website templates created by the community or share user's own creations. It also displays fork counts for each template. 
![Templates](public/screenshots/22.png)
**Points:**
**1\. Templates Tab:** Navigate to the templates section from the left sidebar to browse available templates.
**2\. Browse Templates Tab:** Currently active tab showing community-shared templates that users can fork.
**3\. Fork Button:** Creates a copy of the selected template to the user's account as a new website they can customize.

#### **xvii. MY TEMPLATES TAB (/dashboard/templates)**
**Description:** Same templates page but in the My Templates tab where the user can share their websites as templates for the community to use.
![My Templates Tab](public/screenshots/23.png)
**Points:**
**1\. Share as Template Button:** Opens a form to share the selected website as a template for others to fork.
**2\. Share as Template:** User adds description and tags, then submits to share their website as a template and can track fork counts.

#### **xviii. WEBSITES (/dashboard/websites)**
**Description:** Shows all user's websites as cards with quick action buttons. Each card displays website info, status, and provides options for managing and editing. 
![Websites](public/screenshots/24.png)
**Points:**
**1\. Websites Tab:** Navigate to the websites section from the left sidebar to view all user's websites.
**2\. Duplicate Button:** Creates a copy of the selected website with all its pages and content.
**3\. Manage Button:** Takes the user to the website details page (/dashboard/websites/[id]) where they can manage the site settings and pages.
**4\. Edit Button:** Takes the user directly to the home page builder to edit the main page content.

#### **xix. BILLING (/dashboard/billing)**
**Description:** Shows pricing plans and publishing limits. Free users can only publish up to 2 websites (hence only 2 custom domains) but have unlimited website/page creation. Pro is a one-time payment for unlimited publishing. 
![Billing](public/screenshots/25.jpeg)
**Points:**
**1\. Billing Tab:** Navigate to the billing section from the left sidebar to view plan details and upgrade options.
**2\. Upgrade to Pro Button:** Takes the user to the Stripe checkout page to purchase the Pro plan for unlimited publishing.

#### **xx. STRIPE CHECKOUT (External)**
**Description:** Stripe payment page for purchasing the Pro plan. The user enters payment details, billing address, and completes the one-time payment for lifetime Pro access. 
![Stripe Checkout](public/screenshots/26.png)
**Points:**
**1\. Pay Button:** Processes the payment and upgrades the user's account to Pro plan with unlimited publishing capabilities. Then redirects them to the billing page with the updated user status as PRO.

#### **xxi. PROFILE (/dashboard/profile)**
**Description:** User profile management page where they can update personal information like name, email, profile image, and bio. Also provides access to account security settings. 
![Profile](public/screenshots/27.png)
**Points:**
**1\. Profile Tab:** Navigate to the profile section from the left sidebar to manage personal information.
**2\. Save Changes Button:** Updates and saves all the profile information changes the user has made.
**3\. Change Password Button:** Takes the user to the password change page (/dashboard/settings/password) to update their account password.

#### **xxii. CHANGE PASSWORD (/dashboard/settings/password)**
**Description:** Security page where the user can update their account password. Requires current password and confirmation of the new password for security. 
![Change Password](public/screenshots/28.png)
**Points:**
**1\. Update Password Button:** Validates and updates user's password after confirming current password and new password match.

## **Discussion and Future Work**
### **Current Achievements:**
The project successfully implements a comprehensive website builder with advanced features like template marketplace and one-time payment model provides unique value in the market.

### **Performance Metrics:**
* **Build Time**: Optimized build process with minimal bundle size  
* **Load Speed**: Edge computing & CDN ensures fast global performance  
* **SEO Optimization**: Server-side rendering for published sites

### **Future Enhancements:**
#### **1\. Code Export & Asset Management**
* **HTML/CSS Export**: Generate clean, production-ready static files  
* **Cloud Storage Integration**: Amazon S3/CloudFront or Cloudinary for asset (*images/videos*) delivery

#### **2\. Version Control & History**
* **Git-like Versioning**: Full design history with branching  
* **Named Snapshots**: User-created save points  
* **Collaborative Editing**: Real-time multi-user editing with conflict resolution  
* **Rollback System**: One-click revert to any previous state

#### **3\. Advanced Component System**
* **Custom Component Builder**: Visual/Code based component creation tool  
* **Component Marketplace**: Buy/sell custom components  
* **Dynamic Data Binding**: Connect components to APIs/databases

#### **4\. Scalability Considerations**
* **Database Optimization**: Query optimization and indexing strategies  
* **CDN Integration**: Global content delivery for better performance  
* **Caching Strategy**: Redis integration for session and data caching  
* **Microservices**: Service decomposition for better maintainability

## **Conclusion**
Static Site Builder represents a significant advancement in website building technology, combining ease of use with enterprise-grade features. The project successfully addresses limitations of existing solutions by providing:

* A comprehensive drag-and-drop builder with customizable built-in components  
* Community-driven template marketplace with single click forking capabilities  
* Advanced custom domain management with automatic SSL  
* Flexible billing system with one-time payment options  
* Progressive web app features for offline support

It demonstrates modern web development practices using Next.js, Prisma, Stripe, and cloud-native technologies. The project is well-structured, maintainable & positioned for commercial success with its unique feature set and scalable architecture and ready for production deployment. making it an excellent foundation for a website building platform.

## **Links**
* **Live Demo**: [https://staticsitebuilder.sadman.me](https://staticsitebuilder.sadman.me)  
* **GitHub Repository**: [https://github.com/SADMAN30102001SAKIB/static-site-builder](https://github.com/SADMAN30102001SAKIB/static-site-builder)

## **References**
[1] “Vercel – Cloud Hosting Platform,” Vercel.com. [Online]. Available: https://vercel.com. [Accessed: 09-Sep-2025].

[2] “WordPress – Open Source CMS,” WordPress.org. [Online]. Available: https://wordpress.org. [Accessed: 09-Sep-2025].

[3] “Webflow – No-code Website Builder,” Webflow.com. [Online]. Available: https://webflow.com. [Accessed: 09-Sep-2025].

[4] “Wix – Website Builder,” Wix.com. [Online]. Available: https://www.wix.com. [Accessed: 09-Sep-2025].  
[5] “Shopify – Ecommerce Platform,” Shopify.com. [Online]. Available: https://www.shopify.com. [Accessed: 09-Sep-2025].

[6] “Stripe – Online Payment Processing,” Stripe.com. [Online]. Available: https://stripe.com. [Accessed: 09-Sep-2025].