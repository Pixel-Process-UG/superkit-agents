---
name: canvas-design
description: >
  Use when the user needs HTML Canvas, SVG graphics, data visualization, generative art, or interactive
  visual elements with D3.js or similar libraries. Triggers: user says "canvas", "SVG", "chart",
  "data visualization", "D3", "generative art", "animation", "interactive graphics", drawing on screen.
---

# Canvas Design

## Overview

Create performant, accessible, and visually compelling graphics using HTML Canvas 2D, SVG, and data visualization libraries. This skill covers everything from low-level pixel manipulation to high-level chart composition with D3.js, including generative art, interactive graphics, and animation.

## Phase 1: Requirements Analysis

1. Determine output type (static, animated, interactive, data-driven)
2. Choose rendering technology (Canvas 2D, SVG, WebGL, hybrid)
3. Identify data sources and update frequency
4. Define accessibility requirements for the visualization
5. Set performance budget (frame rate, element count)

**STOP — Present technology recommendation with rationale before implementation.**

### Technology Selection Decision Table

| Requirement | Canvas 2D | SVG | WebGL |
|---|---|---|---|
| < 1000 elements | Maybe | Yes | No |
| > 10,000 elements | Yes | No | Yes |
| DOM event handling needed | No | Yes | No |
| Pixel manipulation | Yes | No | Yes |
| Text-heavy visualization | No | Yes | No |
| 3D rendering | No | No | Yes |
| Print quality | No | Yes | No |
| Animation-heavy | Yes | Maybe | Yes |
| Accessibility critical | No | Yes | No |
| SEO-relevant content | No | Yes | No |

### When to Use Each Technology

| Use Case | Recommended | Why |
|---|---|---|
| Dashboard charts (< 500 data points) | SVG + D3.js | DOM events, accessibility, print |
| Real-time data stream (1000+ points) | Canvas 2D | Performance at scale |
| Interactive map with tooltips | SVG | Hover events, accessible |
| Particle system / generative art | Canvas 2D | Pixel-level control, performance |
| 3D data visualization | WebGL (Three.js) | GPU acceleration |
| Infographic for blog post | SVG | Scalable, accessible, printable |
| Game or simulation | Canvas 2D or WebGL | Frame rate, pixel control |

## Phase 2: Implementation

1. Set up responsive canvas/SVG container
2. Implement rendering pipeline (clear, update, draw)
3. Add interaction handlers (hover, click, drag, zoom)
4. Optimize render loop (requestAnimationFrame, dirty rectangles)
5. Add accessibility layer (ARIA, screen reader descriptions)

**STOP — Verify rendering works correctly at target frame rate before adding polish.**

### Canvas 2D API Patterns

#### Responsive Canvas Setup

```javascript
function createResponsiveCanvas(container) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;

  function resize() {
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    ctx.scale(dpr, dpr);
  }

  const observer = new ResizeObserver(resize);
  observer.observe(container);
  container.appendChild(canvas);
  resize();

  return { canvas, ctx, destroy: () => observer.disconnect() };
}
```

#### Animation Loop Pattern

```javascript
function createAnimationLoop(drawFn) {
  let rafId = null;
  let lastTime = 0;

  function loop(timestamp) {
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    drawFn(deltaTime, timestamp);
    rafId = requestAnimationFrame(loop);
  }

  return {
    start: () => { rafId = requestAnimationFrame(loop); },
    stop: () => { cancelAnimationFrame(rafId); rafId = null; },
    isRunning: () => rafId !== null,
  };
}
```

#### Dirty Rectangle Optimization

```javascript
class DirtyRectRenderer {
  constructor(ctx, width, height) {
    this.ctx = ctx;
    this.dirtyRects = [];
    this.objects = [];
  }

  markDirty(x, y, w, h) {
    this.dirtyRects.push({ x, y, w, h });
  }

  render() {
    for (const rect of this.dirtyRects) {
      this.ctx.clearRect(rect.x, rect.y, rect.w, rect.h);
      for (const obj of this.objects) {
        if (this.intersects(obj.bounds, rect)) {
          obj.draw(this.ctx);
        }
      }
    }
    this.dirtyRects = [];
  }
}
```

### SVG Patterns

#### Programmatic SVG Creation

```javascript
function createSVG(width, height, viewBox) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  svg.setAttribute('viewBox', viewBox || `0 0 ${width} ${height}`);
  svg.setAttribute('role', 'img');
  return svg;
}
```

#### SVG Accessibility

```xml
<svg role="img" aria-labelledby="chart-title chart-desc">
  <title id="chart-title">Monthly Revenue Chart</title>
  <desc id="chart-desc">Bar chart showing revenue from Jan to Dec 2025</desc>
  <!-- chart content -->
</svg>
```

### D3.js Integration Patterns

#### Data Join Pattern (D3 v7)

```javascript
function updateBars(svg, data) {
  const bars = svg.selectAll('.bar')
    .data(data, d => d.id);

  bars.exit()
    .transition().duration(300)
    .attr('opacity', 0)
    .remove();

  bars.enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('opacity', 0)
    .merge(bars)
    .transition().duration(500)
    .attr('x', d => xScale(d.label))
    .attr('y', d => yScale(d.value))
    .attr('width', xScale.bandwidth())
    .attr('height', d => height - yScale(d.value))
    .attr('opacity', 1);
}
```

#### Scales and Axes

```javascript
// Linear scale for continuous data
const yScale = d3.scaleLinear()
  .domain([0, d3.max(data, d => d.value)])
  .range([height, 0])
  .nice();

// Band scale for categorical data
const xScale = d3.scaleBand()
  .domain(data.map(d => d.label))
  .range([0, width])
  .padding(0.2);

// Color scale
const colorScale = d3.scaleOrdinal(d3.schemeTableau10);
```

#### Responsive D3 Chart

```javascript
function responsiveChart(container, renderFn) {
  const observer = new ResizeObserver(entries => {
    const { width, height } = entries[0].contentRect;
    const margin = { top: 20, right: 20, bottom: 40, left: 50 };
    renderFn(container, {
      width: width - margin.left - margin.right,
      height: height - margin.top - margin.bottom,
      margin,
    });
  });
  observer.observe(container);
  return () => observer.disconnect();
}
```

## Phase 3: Polish

1. Add transitions and easing
2. Implement responsive resizing
3. Test across devices and browsers
4. Add fallback content for unsupported environments

**STOP — Verify accessibility and performance targets are met.**

### Generative Art Techniques

| Technique | Category | Use Case |
|---|---|---|
| Perlin/Simplex noise | Noise-based | Organic shapes, terrain |
| Fractal Brownian Motion | Noise-based | Terrain-like textures |
| Domain warping | Noise-based | Fluid-like effects |
| Particle systems | Simulation | Fire, water, swarms |
| L-systems | Algorithmic | Plant-like structures |
| Voronoi diagrams | Algorithmic | Cell-like partitions |
| Delaunay triangulation | Algorithmic | Mesh generation |
| Flow fields | Algorithmic | Directional patterns |

### Accessibility for Visualizations

| Requirement | Implementation |
|---|---|
| Text alternatives | `<title>` and `<desc>` in SVG, ARIA labels on Canvas |
| Data table fallback | Hidden table with same data for screen readers |
| Keyboard interaction | Tab to elements, arrow keys for navigation |
| Color-blind safe | Use shape/pattern in addition to color |
| High contrast mode | Detect and adjust colors |
| Reduced motion | Simplify or disable animations with `prefers-reduced-motion` |

### Performance Guidelines

| Technology | Optimization |
|---|---|
| Canvas | Batch draw calls, minimize state changes (fill/stroke/font) |
| SVG | Limit to < 1000 DOM nodes, use `<use>` for repeated elements |
| Worker | OffscreenCanvas for web worker rendering |
| Events | Throttle mousemove handlers to 16ms (60fps) |
| CSS | Use `will-change: transform` for CSS-animated SVG elements |
| Cleanup | Dispose of observers, animation frames on unmount |

## Anti-Patterns / Common Mistakes

| Anti-Pattern | Why It Is Wrong | What to Do Instead |
|---|---|---|
| Canvas for text-heavy content | Poor text rendering, no accessibility | Use SVG for text-heavy visualizations |
| Full canvas redraw every frame | Wastes CPU when nothing changed | Use dirty rectangle optimization |
| Creating new SVG elements instead of updating | Memory leaks, poor performance | Use D3 data join pattern |
| Forgetting devicePixelRatio | Blurry on Retina/HiDPI displays | Scale canvas by `window.devicePixelRatio` |
| No fallback content for Canvas | Screen readers get nothing | Add `aria-label` and hidden data table |
| Inline event handlers on 1000+ SVG elements | Memory and performance overhead | Use event delegation on parent |
| Not cleaning up animation frames | Memory leaks on unmount | `cancelAnimationFrame` in cleanup |
| Using D3 for simple static charts | Over-engineering | Use SVG directly or Chart.js |

## Integration Points

| Skill | Integration |
|---|---|
| `ui-ux-pro-max` | Chart type selection and color palettes |
| `ui-design-system` | Design tokens for chart theming |
| `artifacts-builder` | Self-contained visualization artifacts |
| `senior-frontend` | Component integration in React/Vue/Svelte |
| `performance-optimization` | Frame rate and rendering optimization |
| `mobile-design` | Touch interaction for mobile charts |

## Skill Type

**FLEXIBLE** — Choose the rendering technology and library that best fits the use case. SVG for accessibility-critical and interactive charts, Canvas for performance-critical and animation-heavy visuals, WebGL for 3D and massive datasets.
