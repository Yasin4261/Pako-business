================================================================================
                         PAKO BUSINESS - AI INSTRUCTIONS
================================================================================

## PROJECT TYPE
- Vue 3 Frontend Application
- Restaurant Courier Order Management System
- Online project - Frontend only

## ARCHITECTURE & PATTERNS
- MVVM (Model-View-ViewModel) architecture
- SOLID principles strictly enforced
- Composition API with <script setup>
- Pinia for state management (as ViewModel layer)

## SOLID PRINCIPLES - STRICT IMPLEMENTATION

### S - Single Responsibility Principle
- Each component/file has ONE job only
- Views: Only UI rendering and user interaction
- Stores: Only state management and business logic
- Services: Only API communication
- Composables: Only reusable logic

### O - Open/Closed Principle
- Components open for extension, closed for modification
- Use props and slots for customization
- Create base components, extend with wrapper components

### L - Liskov Substitution Principle
- Child components must be substitutable for parent
- Maintain consistent prop interfaces
- Event emissions must match parent expectations

### I - Interface Segregation Principle
- Small, focused interfaces
- Don't force components to depend on unused props
- Split large stores into smaller, focused stores

### D - Dependency Inversion Principle
- High-level modules don't depend on low-level modules
- Views depend on store abstractions, not implementations
- Use dependency injection via provide/inject when needed

## TECH STACK
- Vue 3.x (JavaScript - NO TypeScript)
- Pinia (state management)
- Vue Router
- Axios (HTTP client)
- Tailwind CSS (styling)

## API CONFIGURATION
- Base URL: http://localhost:8081/api/v1
- Auth endpoints:
  - POST /auth/register/business - Register new business
  - POST /auth/login - Login

## CODE STYLE RULES
1. All code, comments, variables in ENGLISH
2. JavaScript only (no TypeScript)
3. Components: PascalCase (LoginView.vue)
4. Composables: camelCase + use prefix (useAuth.js)
5. Stores: camelCase + .store suffix (auth.store.js)
6. Services: camelCase + .service suffix (auth.service.js)

## RESPONSIVE DESIGN REQUIREMENTS - MANDATORY

### Mobile First Approach
- Design for mobile (320px) first
- Scale up to tablet (768px) then desktop (1024px+)
- Use Tailwind responsive prefixes: sm:, md:, lg:, xl:, 2xl:

### Breakpoints (Tailwind defaults)
- sm: 640px (small tablets)
- md: 768px (tablets)
- lg: 1024px (laptops)
- xl: 1280px (desktops)
- 2xl: 1536px (large screens)

### Responsive Rules
1. Always use relative units (%, vh, vw, rem) over fixed px
2. Container max-widths: max-w-sm, max-w-md, max-w-lg, etc.
3. Flexible grids: grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
4. Responsive typography: text-sm md:text-base lg:text-lg
5. Responsive spacing: p-4 md:p-6 lg:p-8
6. Responsive hide/show: hidden md:block, md:hidden
7. Flexible images: w-full max-w-full h-auto

### UI Component Guidelines
- Buttons: min-h-[44px] for touch targets
- Forms: Full width on mobile, max-width on desktop
- Cards: Stack on mobile, grid on desktop
- Navigation: Hamburger on mobile, full nav on desktop
- Modals: Full screen on mobile, centered on desktop

## DESIGN REQUIREMENTS
- Modern, attractive, professional UI
- Mobile-first responsive design
- Clean and minimal design
- Smooth animations and transitions (transition-all duration-200)
- Consistent color scheme using Tailwind
- Glassmorphism effects (backdrop-blur, bg-white/80)
- Subtle shadows (shadow-lg, shadow-xl)
- Rounded corners (rounded-xl, rounded-2xl, rounded-3xl)

## FOLDER STRUCTURE
src/
├── components/     # Reusable UI components
├── views/          # Page components
├── stores/         # Pinia stores (ViewModel)
├── services/       # API services (Model)
├── composables/    # Reusable logic hooks
├── router/         # Vue Router config
└── assets/         # Static assets

## MVVM MAPPING
- Model: services/ (API calls, data fetching)
- View: views/ & components/ (UI templates)
- ViewModel: stores/ & composables/ (business logic, state)

## CONFIRMATION
✅ I confirm that I have read and will follow these instructions.
✅ I will apply SOLID principles to all code.
✅ I will ensure all designs are fully responsive.

================================================================================
