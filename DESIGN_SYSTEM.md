# TFE 2.0 DESIGN SYSTEM
**Implementation Date:** September 23, 2026  
**Status:** Phase 1 Complete

---

## DESIGN SYSTEM COMPONENTS

### ✅ Core Design Tokens (globals.css)

**Color System:**
- Primary: `--color-teal` (#176B6B), `--color-teal-dark` (#125858), `--color-teal-light` (#1F8080)
- Neutrals: `--color-cream` (#FFFDF9), `--color-sand` (#F4F0E9), `--color-border` (#EAE6DF)
- Text: `--color-text-primary` (#1F2937), `--color-text-secondary` (#5B6470), `--color-text-muted` (#7A827D)
- Accent: `--color-gold` (#C9A86A), `--color-ochre` (#B88E4F)
- Status: `--color-success` (#059669), `--color-warning` (#D97706), `--color-error` (#DC2626)

**Typography:**
- Sans: Geist Sans (loaded via layout)
- Serif: System serif stack for headlines
- Mono: Geist Mono for code

**Spacing Scale:**
- xs: 0.25rem, sm: 0.5rem, md: 1rem, lg: 1.5rem, xl: 2rem, 2xl: 3rem, 3xl: 4rem

**Border Radius:**
- sm: 0.25rem, md: 0.5rem, lg: 1rem, xl: 1.5rem, 2xl: 2rem, full: 9999px

**Shadows:**
- sm, md, lg, xl levels defined

**Transitions:**
- fast: 150ms, base: 250ms, slow: 350ms (cubic-bezier easing)

**Z-Index Layers:**
- base: 0, dropdown: 10, sticky: 20, fixed: 30, modal-backdrop: 40, modal: 50

**Breakpoints:**
- sm: 640px, md: 768px, lg: 1024px, xl: 1280px, 2xl: 1536px

---

## ✅ UI Components (/app/components/ui/)

### Button Component
**Variants:** primary, secondary, outline, ghost, link  
**Sizes:** sm, md, lg  
**Features:** Loading state, disabled state, full width option, focus ring

### Input Component
**Features:** Label, error messages, helper text, disabled state, focus ring  
**Accessibility:** Proper label association, error announcements

### Textarea Component
**Features:** Label, error messages, helper text, resize control  
**Accessibility:** Proper label association

### Select Component
**Features:** Label, error messages, helper text, options array  
**Accessibility:** Proper label association

### Badge Component
**Variants:** tfe-pick, trending, new, deal, neutral  
**Usage:** Product labels, status indicators

### Card Component
**Variants:** default, elevated, bordered  
**Features:** Optional padding, click handling

---

## ✅ Layout Components (/app/components/layout/)

### Container
**Props:** maxWidth (sm, md, lg, xl, 2xl, full), className  
**Purpose:** Consistent content width and padding across pages  
**Responsive:** Adjusts padding on mobile/desktop

### Section
**Props:** background (cream, sand, white, dark, teal), padding (none, sm, md, lg, xl)  
**Purpose:** Consistent section spacing and backgrounds  
**Usage:** Wrap page sections for consistent vertical rhythm

### SectionHeader
**Props:** label, title, description, alignment (left, center)  
**Purpose:** Consistent section heading treatment  
**Features:** Optional eyebrow label, title, description

### PageLayout
**Purpose:** Consistent page wrapper with header and footer  
**Usage:** Wrap entire page content for unified layout

---

## ✅ Product Card Components (/app/components/product-cards/)

### StandardProductCard
**Usage:** Default product grid display  
**Features:** Image, title, category, price, store, quick actions (save, compare), hover effects  
**Variants:** With/without badge, with/without actions

### FeaturedProductCard
**Usage:** Hero/spotlight products  
**Features:** Split layout (image + content), editorial text, TFE Pick badge  
**Responsive:** Stacks on mobile

### EditorialProductCard
**Usage:** Curated collections, editorial picks  
**Features:** "Why We Love It" section, editorial styling  
**Background:** Sand (#F4F0E9)

### CompactProductCard
**Usage:** Sidebars, related products, lists  
**Features:** Horizontal layout, smaller footprint  
**Responsive:** Always horizontal

---

## ✅ Global Styles (/app/globals.css)

**Custom Utilities:**
- `.container-tfe` - Standard container with max-width and padding
- `.text-balance` - Better text wrapping
- `.font-serif` - Serif font family

**Scrollbar Styling:**
- Custom scrollbar colors matching TFE palette

**Focus Styles:**
- Teal outline on focus-visible
- 2px offset for visibility

**Selection Styles:**
- Teal background on text selection

**Animations:**
- `@keyframes fadeIn` - Fade in animation
- `@keyframes slideUp` - Slide up animation
- `.animate-fade-in` - Apply fade animation
- `.animate-slide-up` - Apply slide animation

---

## 📋 COMPONENT USAGE GUIDE

### Basic Button
```tsx
import { Button } from '@/app/components/ui';

<Button variant="primary" size="md">
  Click Me
</Button>
```

### Input with Validation
```tsx
import { Input } from '@/app/components/ui';

<Input
  label="Email"
  type="email"
  error={errors.email}
  helperText="Enter your email address"
/>
```

### Page Layout
```tsx
import { PageLayout, Container, Section, SectionHeader } from '@/app/components/layout';

<PageLayout>
  <Section background="cream" padding="lg">
    <Container maxWidth="xl">
      <SectionHeader
        label="Featured"
        title="Our Latest Finds"
        description="Handpicked products for you"
      />
      {/* Content */}
    </Container>
  </Section>
</PageLayout>
```

### Product Display
```tsx
import StandardProductCard from '@/app/components/product-cards/StandardProductCard';

<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
  {products.map(product => (
    <StandardProductCard
      key={product.id}
      product={product}
      showBadge={product.featured}
    />
  ))}
</div>
```

---

## 🎨 DESIGN PRINCIPLES

### 1. **Premium Editorial Feel**
- Generous whitespace
- Serif typography for headlines
- Sophisticated color palette
- Subtle shadows and borders

### 2. **Consistent Spacing**
- Use design tokens for all spacing
- Maintain vertical rhythm with Section padding
- Consistent container widths

### 3. **Responsive Design**
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px)
- Grid systems adjust at each breakpoint

### 4. **Accessibility**
- Proper focus indicators
- Semantic HTML
- ARIA labels where needed
- Keyboard navigation support

### 5. **Brand Consistency**
- Teal as primary action color
- Cream background throughout
- TFE Pick badge for featured items
- Editorial "Why We Love It" sections

---

## 📊 IMPLEMENTATION STATUS

### ✅ Completed
- [x] Design tokens in globals.css
- [x] All UI components (Button, Input, etc.)
- [x] Layout components (Container, Section, etc.)
- [x] Product card variants
- [x] Typography system
- [x] Color system
- [x] Spacing scale
- [x] Border radius system
- [x] Shadow system
- [x] Transition timing
- [x] Z-index layers
- [x] Focus styles
- [x] Selection styles
- [x] Scrollbar styling

### 🔄 Next Phase
- Integrate design system into existing pages
- Replace hardcoded values with design tokens
- Standardize component usage across all pages
- Remove duplicate/legacy components

---

## 🚀 USAGE IN EXISTING PAGES

**All pages should now use:**
1. Import from `@/app/components/ui` for buttons, inputs, badges
2. Import from `@/app/components/layout` for containers, sections
3. Import from `@/app/components/product-cards` for product displays
4. Use CSS custom properties (--color-teal, etc.) for inline styles
5. Use Tailwind classes that reference design tokens

**Example migration:**
```tsx
// Before
<div className="px-6 py-20 md:px-12 md:py-28">
  <div className="mx-auto max-w-6xl">
    <h2 className="text-4xl font-medium">Title</h2>
  </div>
</div>

// After
import { Section, Container, SectionHeader } from '@/app/components/layout';

<Section background="cream" padding="lg">
  <Container maxWidth="lg">
    <SectionHeader title="Title" />
  </Container>
</Section>
```

---

## 📝 DESIGN TOKEN REFERENCE

### Quick Reference
```css
/* Primary Colors */
bg-[#176B6B]   /* Teal */
bg-[#FFFDF9]   /* Cream */
bg-[#F4F0E9]   /* Sand */

/* Text Colors */
text-[#1F2937] /* Primary */
text-[#5B6470] /* Secondary */
text-[#7A827D] /* Muted */

/* Border */
border-[#EAE6DF]

/* Accent */
text-[#C9A86A] /* Gold */
```

---

**Phase 1 Complete:** TFE 2.0 design system is now fully implemented and ready for integration across all pages.
