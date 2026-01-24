# Responsive Images Guide for Astro

A guide for optimizing image delivery using Astro's `<Image>` component.

## Core Concepts

### Device Pixel Ratio (DPR)

DPR is the ratio between physical pixels and CSS pixels on a screen.

| Device Type | DPR | Physical Pixels per CSS Pixel |
|-------------|-----|-------------------------------|
| Standard displays | 1x | 1 |
| Retina/HiDPI (most modern devices) | 2x | 4 (2×2) |
| Flagship phones (iPhone Pro, etc.) | 3x | 9 (3×3) |

**Why it matters:** An image displayed at 200px CSS width needs a 400px source image on 2x displays to look sharp.

---

## Astro Image Component Attributes

### `widths` - Image Variants to Generate

Tells Astro which image sizes to create at build time.

```astro
widths={[240, 320, 480, 512, 656]}
```

**Output:** Generates a `srcset` with multiple image files:
```html
srcset="image-240w.webp 240w, image-320w.webp 320w, image-480w.webp 480w..."
```

**Rules:**
- Include sizes that match your `sizes` breakpoints (accounting for DPR)
- Don't generate more sizes than necessary (increases build time)
- Largest width should match your largest display scenario

### `sizes` - Display Width Hints

Tells the browser how wide the image will render at each viewport, so it can select the correct file from `srcset`.

```astro
sizes="(min-width: 1280px) 656px, (min-width: 1024px) 512px, (min-width: 768px) 420px, 220px"
```

**How it works:**
1. Browser evaluates conditions left-to-right
2. First matching condition wins
3. Last value is the fallback (no condition)

**Rules:**
- Must reflect **actual rendered width**, not viewport width
- Account for container constraints, padding, grid layouts
- Browser multiplies this value by DPR to pick from `widths`

---

## How Browser Selects Images

Given:
```astro
widths={[240, 320, 480, 512, 656]}
sizes="(min-width: 1280px) 656px, (min-width: 768px) 420px, 220px"
```

| Viewport | sizes Value | 1x DPR Selection | 2x DPR Selection |
|----------|-------------|------------------|------------------|
| 1440px | 656px | 656w | 656w (capped) |
| 1024px | 420px | 480w | 656w |
| 768px | 420px | 480w | 656w |
| 375px | 220px | 240w | 480w |

**Calculation:** Browser needs `sizes × DPR`, picks closest `widths` value ≥ that.

---

## Common Mistakes

### 1. Using `calc(100vw - padding)` as fallback

**Problem:**
```astro
sizes="(min-width: 768px) 420px, calc(100vw - 32px)"
```

At 375px viewport: `calc(100vw - 32px)` = 343px → with 2x DPR, browser requests 686px.

But if your container actually renders the image at 220px, you're downloading 3x more data than needed.

**Solution:** Measure actual rendered width and use explicit values:
```astro
sizes="(min-width: 768px) 420px, (min-width: 480px) 280px, 220px"
```

### 2. Missing small widths in `widths` array

**Problem:**
```astro
widths={[512, 656, 800]}
```

Mobile with 220px display at 2x DPR needs 440px. Browser picks 512px (32% waste).

**Solution:** Include widths that cover mobile scenarios:
```astro
widths={[240, 320, 480, 512, 656]}
```

### 3. Not accounting for container constraints

Images inside flex/grid containers, fixed-height parents, or with `object-fit` may render smaller than the container width.

**Solution:** Use browser DevTools to measure actual rendered dimensions at each breakpoint.

---

## Debugging Workflow

### Step 1: Measure Actual Rendered Size

1. Open DevTools → Elements panel
2. Select the `<img>` element
3. Look at the computed dimensions (not the container)
4. Test at multiple viewport widths

### Step 2: Check Network Tab

1. Open DevTools → Network → Img filter
2. Reload page at different viewport sizes
3. Note which image variant downloads
4. Compare downloaded size vs rendered size

### Step 3: Run Lighthouse

1. DevTools → Lighthouse → Performance
2. Check "Properly size images" audit
3. Shows exact waste in KiB per image

---

## Template for Common Layouts

### Full-width image (edge-to-edge)
```astro
<Image
  src={image}
  widths={[375, 640, 768, 1024, 1280, 1536]}
  sizes="100vw"
  alt="Description"
/>
```

### Contained image (with padding)
```astro
<Image
  src={image}
  widths={[320, 480, 640, 768, 1024]}
  sizes="(min-width: 1280px) 1200px, (min-width: 768px) calc(100vw - 64px), calc(100vw - 32px)"
  alt="Description"
/>
```

### Grid column image (2-column layout at lg+)
```astro
<Image
  src={image}
  widths={[240, 320, 480, 512, 656]}
  sizes="(min-width: 1280px) 600px, (min-width: 1024px) 450px, (min-width: 768px) 350px, (min-width: 480px) 280px, 220px"
  alt="Description"
/>
```

### Thumbnail / Card image
```astro
<Image
  src={image}
  widths={[150, 200, 300, 400]}
  sizes="(min-width: 768px) 200px, 150px"
  alt="Description"
/>
```

---

## Other Image Attributes

| Attribute | Purpose | When to Use |
|-----------|---------|-------------|
| `loading="lazy"` | Defer loading until near viewport | Below-the-fold images |
| `loading="eager"` | Load immediately | LCP images, hero images |
| `decoding="async"` | Non-blocking decode | Most images |
| `fetchpriority="high"` | Prioritize download | LCP images |
| `fetchpriority="low"` | Deprioritize download | Decorative images |
| `quality={70}` | Compression level (1-100) | Balance quality vs size |

---

## Quick Reference

```astro
<Image
  src={importedImage}
  widths={[/* sizes to generate */]}
  sizes="/* media conditions → display width */"
  alt="Descriptive text"
  loading="lazy"           // or "eager" for LCP
  decoding="async"
  fetchpriority="auto"     // "high" for LCP, "low" for decorative
  quality={70}             // 60-80 is usually good
  class="your-classes"
/>
```

**Remember:** `sizes` must match reality. When in doubt, measure with DevTools.
