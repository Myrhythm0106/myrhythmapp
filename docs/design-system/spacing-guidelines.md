# MyRhythm Spacing System

## Core Spacing Values

MyRhythm uses a **12px-based spacing system** for mobile touch targets and a flexible scale for layouts.

### Spacing Scale

```typescript
// From tailwind.config.ts
spacing: {
  'mobile-touch': '12px',    // Min space between touch targets
  'section': '24px',         // Between major sections
  'page': '32px',            // Page margins (desktop)
  'page-mobile': '16px',     // Page margins (mobile)
  'card': '16px',            // Card padding (mobile)
  'card-lg': '24px',         // Card padding (desktop)
  'safe-bottom': 'env(safe-area-inset-bottom)', // Mobile safe area
  'nav-height': '64px',      // Navigation bar height
}
```

---

## Mobile Touch Spacing Rules

### Minimum Touch Target Spacing
**12px minimum** between tappable elements on mobile (based on Apple/Google guidelines)

```tsx
// ✅ Correct - 12px spacing
<div className="space-y-mobile-touch">
  <Button>Action 1</Button>
  <Button>Action 2</Button>
  <Button>Action 3</Button>
</div>

// ❌ Incorrect - too tight
<div className="space-y-2"> {/* Only 8px */}
  <Button>Action 1</Button>
  <Button>Action 2</Button>
</div>
```

### Touch Target Sizes
- **Minimum:** 44x44px (Apple iOS)
- **Recommended:** 48x48px (Google Material)
- **Icon buttons:** 48x48px minimum on mobile

---

## Component Spacing Patterns

### Cards
**Mobile:** `p-4` (16px padding)  
**Desktop:** `p-6` (24px padding)

```tsx
// Responsive card padding
<Card className="p-card lg:p-card-lg">
  <CardContent>...</CardContent>
</Card>
```

### Sections
**Between sections:** `24px` (section spacing)

```tsx
<div className="space-y-section">
  <Section1 />
  <Section2 />
  <Section3 />
</div>
```

### Page Margins
**Mobile:** `16px` (page-mobile)  
**Desktop:** `32px` (page)

```tsx
<div className="px-page-mobile lg:px-page">
  <PageContent />
</div>
```

---

## Spacing Utilities

### Touch Spacing Utility
Automatically adds 12px spacing between child elements:

```tsx
<div className="touch-spacing-y">
  {/* Children will have 12px vertical spacing */}
  <Button>Button 1</Button>
  <Button>Button 2</Button>
  <Button>Button 3</Button>
</div>
```

### Section Spacing Utility
Automatically adds 24px spacing between child elements:

```tsx
<div className="section-spacing-y">
  {/* Children will have 24px vertical spacing */}
  <Section1 />
  <Section2 />
  <Section3 />
</div>
```

---

## Component-Specific Guidelines

### Buttons
- **Between buttons (vertical):** `mobile-touch` (12px) on mobile
- **Between buttons (horizontal):** `gap-3` (12px) on mobile
- **Button padding:** Built into button component

```tsx
// Vertical button list (mobile)
<div className="flex flex-col gap-mobile-touch md:gap-4">
  <Button>Primary</Button>
  <Button variant="outline">Secondary</Button>
</div>

// Horizontal button group
<div className="flex gap-3">
  <Button>Save</Button>
  <Button variant="outline">Cancel</Button>
</div>
```

### Forms
- **Between form fields:** `16px` (4 in Tailwind)
- **Between field and error message:** `4px` (1 in Tailwind)
- **Between form sections:** `24px` (section)

```tsx
<form className="space-y-4">
  <div>
    <Label>Name</Label>
    <Input className="mt-1" />
    <p className="text-sm text-red-500 mt-1">Error message</p>
  </div>
  <div>
    <Label>Email</Label>
    <Input className="mt-1" />
  </div>
  <Button type="submit" className="mt-section">Submit</Button>
</form>
```

### Navigation
- **Mobile bottom nav height:** `64px` (nav-height)
- **Safe area bottom padding:** `safe-bottom` (iOS notch)
- **Between nav items:** `8px` (2 in Tailwind)

```tsx
<nav className="fixed bottom-0 left-0 right-0 h-nav-height pb-safe-bottom">
  <div className="flex items-center justify-around gap-2">
    <NavItem />
    <NavItem />
    <NavItem />
    <NavItem />
  </div>
</nav>
```

### Calendar
- **Between days:** `4px` (1 in Tailwind)
- **Day cell size:** `40px` minimum (touch target)
- **Between weeks:** `8px` (2 in Tailwind)

### Lists
- **Between list items:** `12px` (mobile-touch) on mobile
- **Between list sections:** `24px` (section)

---

## Mobile vs Desktop Breakpoints

```tsx
// Mobile-first approach
<div className="
  px-page-mobile     // 16px on mobile
  lg:px-page         // 32px on desktop
  space-y-4          // 16px between items (mobile)
  lg:space-y-6       // 24px between items (desktop)
">
  <Content />
</div>
```

---

## Common Patterns

### Dashboard Grid
```tsx
<div className="
  grid 
  grid-cols-1 
  md:grid-cols-2 
  lg:grid-cols-3 
  gap-4           // 16px on mobile
  lg:gap-6        // 24px on desktop
  p-page-mobile 
  lg:p-page
">
  <Card />
  <Card />
  <Card />
</div>
```

### Modal/Dialog
```tsx
<Dialog>
  <DialogContent className="p-6 space-y-4">
    <DialogHeader className="space-y-2">
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
    <div className="space-y-4">
      {/* Content */}
    </div>
    <DialogFooter className="gap-3">
      <Button>Save</Button>
      <Button variant="outline">Cancel</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Hero Section
```tsx
<section className="
  py-16           // 64px vertical padding (mobile)
  lg:py-24        // 96px vertical padding (desktop)
  px-page-mobile 
  lg:px-page
">
  <div className="max-w-4xl mx-auto space-y-6 lg:space-y-8">
    <h1>Hero Title</h1>
    <p>Hero Description</p>
    <div className="flex gap-3">
      <Button>Primary</Button>
      <Button variant="outline">Secondary</Button>
    </div>
  </div>
</section>
```

---

## Spacing Audit Checklist

When reviewing a component:

- [ ] All touch targets have minimum 12px spacing on mobile
- [ ] Card padding is `p-card` on mobile, `lg:p-card-lg` on desktop
- [ ] Page margins use `px-page-mobile` and `lg:px-page`
- [ ] Section spacing is consistent (24px)
- [ ] Form fields have appropriate spacing (16px)
- [ ] Navigation respects safe area insets
- [ ] No arbitrary spacing values (use design tokens)

---

## Design Principle

> **"Breathable Spacing for Brain Health"**
>
> Proper spacing reduces cognitive load for users recovering from brain injuries:
> - **Adequate whitespace** = Less visual overwhelm
> - **Consistent spacing** = Predictable, learnable interface
> - **Touch-friendly spacing** = Reduced frustration, better accessibility

Every spacing decision should prioritize **clarity over density**.
