# MyRhythm Color System - Official 5-Color Palette

## The Five Core Colors

MyRhythm uses **exactly 5 colors** to create a cohesive, brain-health-focused design system:

1. **Teal** (`clarity-teal`, `brand-teal`, `brain-health`)
2. **Emerald** (`memory-emerald`, `brand-emerald`)
3. **Burnt Orange** (`brand-orange`)
4. **Blue** (`neural-blue`, `brand-blue`)
5. **Purple** (`neural-purple`)

### ⛔ Deprecated Colors (DO NOT USE)
- `neural-magenta` - Removed from color system
- `beacon-*` - Replaced with `neural-purple`
- `neural-indigo` - Use `neural-purple` or `neural-blue` instead

---

## Color Meanings & Usage

### 🌊 Teal - Cognitive Clarity & Focus
**Semantic Purpose:** Mental clarity, cognitive function, focus states

**Primary Tokens:**
- `clarity-teal-*` - Mental focus, active thinking
- `brand-teal-*` - Cognitive wellness
- `brain-health-*` - Overall health metrics

**Use For:**
- Progress indicators
- Health metrics
- Cognitive enhancement features
- Success states (with emerald)
- Focus mode backgrounds

**Example:**
```tsx
<div className="bg-gradient-to-r from-clarity-teal-500 to-brain-health-500">
  Cognitive Focus Mode
</div>
```

---

### 💚 Emerald - Growth, Healing & Success
**Semantic Purpose:** Memory retention, healing progress, positive outcomes

**Primary Tokens:**
- `memory-emerald-*` - Memory-related features
- `brand-emerald-*` - Growth and transformation

**Use For:**
- Success notifications
- Completed actions
- Memory achievements
- Healing progress bars
- Positive validation states

**Example:**
```tsx
<Button className="bg-memory-emerald-500 hover:bg-memory-emerald-600">
  Mark Complete
</Button>
```

---

### 🔥 Burnt Orange - Action & Urgency
**Semantic Purpose:** Call-to-action, important decisions, energy

**Primary Tokens:**
- `brand-orange-*` - Primary action color

**Use For:**
- Primary CTAs
- Submit buttons
- Important notifications
- Active states (navigation, tabs)
- Urgent reminders

**Example:**
```tsx
<Button variant="action" className="bg-gradient-to-r from-brand-orange-500 to-brand-orange-600">
  Start Your Journey
</Button>
```

---

### 💙 Blue - Trust, Stability & Navigation
**Semantic Purpose:** Trustworthiness, calm, core navigation

**Primary Tokens:**
- `neural-blue-*` - Navigation, structure
- `brand-blue-*` - Trust and reliability

**Use For:**
- Navigation elements
- Headers and titles
- Informational content
- Calendar grids
- Structural elements

**Example:**
```tsx
<nav className="bg-gradient-to-r from-neural-blue-50 to-neural-purple-50">
  <NavigationItems />
</nav>
```

---

### 💜 Purple - Empowerment & Transformation
**Semantic Purpose:** Brain transformation, empowerment, premium features

**Primary Tokens:**
- `neural-purple-*` - Empowerment, premium

**Use For:**
- Premium features
- Empowerment moments
- Transformation indicators
- Hero sections
- Highlight gradients

**Example:**
```tsx
<h1 className="text-4xl font-bold bg-gradient-to-r from-neural-purple-600 to-neural-blue-500 bg-clip-text text-transparent">
  Your Brain Can Transform
</h1>
```

---

## Approved Gradient Combinations

### Primary Brand Gradient
**Purple → Blue → Orange**
```css
bg-gradient-to-r from-neural-purple-600 via-neural-blue-500 to-brand-orange-600
```
**Use:** Hero headers, major empowerment moments

---

### Success Gradient
**Emerald → Teal → Brain Health**
```css
bg-gradient-to-r from-memory-emerald-500 via-clarity-teal-500 to-brain-health-500
```
**Use:** Progress bars, health metrics, achievement states

---

### Action Gradient
**Orange (solid, no fusion)**
```css
bg-gradient-to-r from-brand-orange-500 to-brand-orange-600
```
**Use:** Primary CTAs, submit buttons, urgent actions

---

### Cognitive Gradient
**Teal → Emerald**
```css
bg-gradient-to-r from-clarity-teal-500 to-memory-emerald-500
```
**Use:** Cognitive focus features, memory exercises

---

### Empowerment Gradient
**Purple → Blue**
```css
bg-gradient-to-r from-neural-purple-600 to-neural-blue-600
```
**Use:** Transformation features, premium content

---

### Background Gradient
**Purple/Blue/Teal (light, low opacity)**
```css
bg-gradient-to-br from-neural-purple-50/30 via-neural-blue-50/20 to-clarity-teal-50/30
```
**Use:** Page backgrounds, subtle depth

---

## Color Fusion Rules

### ✅ Allowed Combinations
- Purple + Blue (empowerment + trust)
- Teal + Emerald (focus + success)
- Blue + Teal (structure + clarity)
- Orange + Purple (action + empowerment)
- Orange + Blue (action + trust)

### ⛔ Avoid These Combinations
- Orange + Emerald (competing vibrancy)
- Purple + Emerald (too vibrant together)

---

## Component Color Mapping

| Component Type | Primary Color | Accent Color | Success State | Error State |
|----------------|---------------|--------------|---------------|-------------|
| **Headers/Titles** | Purple-Blue gradient | Orange | N/A | N/A |
| **Navigation** | Purple | Teal | Orange (active) | N/A |
| **CTAs/Buttons** | Orange | Purple | Emerald | Red (destructive) |
| **Progress/Health** | Teal → Emerald gradient | Blue | Emerald | Red |
| **Backgrounds** | Purple/Blue (light) | Teal/Emerald (light) | N/A | N/A |
| **Cards/Panels** | Teal/Emerald (light) | Purple/Blue accent | N/A | N/A |
| **Forms (Valid)** | Emerald | N/A | Emerald | Red |
| **Forms (Idle)** | Teal | N/A | Emerald | Red |
| **Skeletons** | Teal shimmer | Purple accent | N/A | N/A |

---

## Migration Guide

### Replacing `neural-magenta`
```tsx
// ❌ Old
<div className="bg-neural-magenta-500">

// ✅ New (use purple for empowerment)
<div className="bg-neural-purple-500">

// ✅ Or (use orange for action)
<div className="bg-brand-orange-500">
```

### Replacing `beacon-*`
```tsx
// ❌ Old
<div className="text-beacon-600">

// ✅ New
<div className="text-neural-purple-600">
```

### Replacing `neural-indigo`
```tsx
// ❌ Old
<Button className="bg-neural-indigo-600">

// ✅ New (use purple)
<Button className="bg-neural-purple-600">

// ✅ Or (use blue for trust)
<Button className="bg-neural-blue-600">
```

---

## Implementation Checklist

When implementing a new feature:

- [ ] Choose colors from the 5 approved colors only
- [ ] Use semantic color tokens (not direct HSL)
- [ ] Apply approved gradient combinations
- [ ] Check component color mapping table
- [ ] Ensure minimum 4.5:1 contrast ratio (WCAG AA)
- [ ] Test in both light and dark modes (if applicable)
- [ ] Verify no `neural-magenta` or `beacon-` usage

---

## Design Principle

> **"Empowerment Through Clarity"**
> 
> Each color serves a clear purpose in the brain health journey:
> - **Teal** = Think clearly
> - **Emerald** = Grow stronger
> - **Orange** = Take action
> - **Blue** = Trust the process
> - **Purple** = Transform yourself

By limiting to 5 colors, we create a cohesive, brain-friendly interface that doesn't overwhelm users recovering from brain injuries.
