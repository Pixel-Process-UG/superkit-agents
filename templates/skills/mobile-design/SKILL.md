---
name: mobile-design
description: >
  Use when the user needs mobile app design and development patterns for React Native, Flutter, or
  SwiftUI — including platform HIG compliance, gestures, and offline-first architecture. Triggers:
  user says "mobile", "iOS", "Android", "React Native", "Flutter", "SwiftUI", "app design",
  "mobile navigation", "touch targets", "offline-first".
---

# Mobile Design

## Overview

Design and build mobile applications that feel native on each platform. This skill covers React Native, Flutter, and SwiftUI with deep knowledge of platform-specific Human Interface Guidelines (Apple HIG) and Material Design, gesture handling, responsive layouts, offline-first patterns, and app store submission requirements.

## Phase 1: Platform Analysis

1. Identify target platforms (iOS, Android, both)
2. Choose framework (React Native, Flutter, SwiftUI, or cross-platform)
3. Review platform-specific design guidelines
4. Define navigation architecture
5. Map offline requirements

**STOP — Present platform and framework recommendation with rationale before design.**

### Framework Selection Decision Table

| Requirement | React Native | Flutter | SwiftUI | Kotlin/Compose |
|---|---|---|---|---|
| iOS only | Possible | Possible | Best | No |
| Android only | Possible | Possible | No | Best |
| Cross-platform | Good | Best | No | No |
| Native performance critical | OK | Good | Best | Best |
| Existing React web team | Best | Learning curve | Learning curve | Learning curve |
| Complex animations | Good | Best | Good | Good |
| Rapid prototyping | Good | Good | Best (iOS) | OK |
| Large existing codebase (JS) | Best | Rewrite | Rewrite | Rewrite |

## Phase 2: Design Implementation

1. Build component library with platform variants
2. Implement navigation (tab bar, stack, drawer)
3. Handle safe areas and notches
4. Add gesture recognizers
5. Implement responsive layouts for phone/tablet

**STOP — Present navigation architecture and component inventory for review.**

### Platform-Specific HIG Compliance

#### Apple Human Interface Guidelines

| Area | Guideline |
|---|---|
| Navigation | UINavigationController (push/pop), tab bars at bottom (max 5) |
| Typography | SF Pro / SF Pro Rounded, support Dynamic Type (all 11 sizes) |
| Safe Areas | Respect `safeAreaInsets` — never under notch/home indicator |
| Gestures | Swipe-back for navigation, long press for context menus |
| Haptics | UIFeedbackGenerator (impact, selection, notification) |
| Colors | Semantic system colors (`label`, `secondaryLabel`, `systemBackground`) |
| Modals | Sheets (`.sheet`, `.fullScreenCover`) with drag-to-dismiss |
| Lists | Grouped inset for settings, plain for content feeds |
| Icons | SF Symbols library (5000+ icons, variable weight/size) |

#### Material Design (Android)

| Area | Guideline |
|---|---|
| Navigation | Bottom navigation bar, navigation drawer, top app bar |
| Typography | Roboto / product font, Material type scale |
| Edge-to-edge | Draw behind system bars, handle window insets |
| Gestures | Predictive back gesture (Android 14+), swipe-to-dismiss |
| Haptics | HapticFeedbackConstants (click, long press, keyboard) |
| Colors | Material You dynamic color from wallpaper, tonal palettes |
| Components | FAB, snackbar, bottom sheet, chips |
| Motion | Shared element transitions, container transform |

### Cross-Platform Pattern Decision Table

| Feature | iOS Pattern | Android Pattern |
|---|---|---|
| Back navigation | Swipe from left edge | System back button |
| Primary action | Right nav bar button | FAB |
| Alerts | UIAlertController | MaterialAlertDialog |
| Loading | UIActivityIndicator | CircularProgressIndicator |
| Segmented | UISegmentedControl | Tabs / Chips |
| Date picker | Wheel picker | Calendar picker |
| Pull to refresh | Native support | SwipeRefreshLayout |
| Context menu | Long press + haptic | Long press + popup |

### Safe Area Handling

#### React Native

```jsx
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

function Screen() {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }}>
      {/* Content */}
    </View>
  );
}
```

#### Flutter

```dart
Widget build(BuildContext context) {
  return Scaffold(
    body: SafeArea(
      child: // Content
    ),
  );
}
```

#### SwiftUI

```swift
var body: some View {
  VStack {
    // Content automatically respects safe areas
  }
  .ignoresSafeArea(.keyboard) // Only ignore keyboard if needed
}
```

### Gesture Navigation Patterns

| Gesture | Usage | Min Target |
|---|---|---|
| Tap | Primary action | 44x44pt |
| Long press | Context menu / secondary action | 44x44pt |
| Swipe horizontal | Navigation, dismiss, reveal actions | Full row |
| Swipe vertical | Scroll, pull-to-refresh, dismiss sheet | Full area |
| Pinch | Zoom images/maps | Content area |
| Pan/Drag | Reorder, move elements | Drag handle |

### Touch Target Rules

| Rule | Value |
|---|---|
| Minimum size (iOS) | 44x44pt |
| Minimum size (Android) | 48x48dp |
| Minimum spacing | 8pt between targets |
| Visual vs touch | Visual can be smaller; use padding for touch area |
| Primary actions | Bottom 1/3 of screen (thumb zone) |

## Phase 3: Platform Polish

1. Platform-specific animations and transitions
2. Haptic feedback integration
3. App icon and launch screen
4. Dark mode and Dynamic Type support
5. App store metadata and screenshots

**STOP — Test on physical devices before declaring complete.**

### Responsive Layout Decision Table

| Form Factor | Layout | Navigation |
|---|---|---|
| Phone Portrait | Single column | Bottom tabs |
| Phone Landscape | Single column or split | Side tabs |
| Tablet Portrait | Two columns | Sidebar |
| Tablet Landscape | Three columns | Persistent sidebar |

#### React Native Responsive

```javascript
import { useWindowDimensions } from 'react-native';

function useResponsive() {
  const { width } = useWindowDimensions();
  return {
    isPhone: width < 768,
    isTablet: width >= 768 && width < 1024,
    isDesktop: width >= 1024,
    columns: width < 768 ? 1 : width < 1024 ? 2 : 3,
  };
}
```

#### Flutter Responsive

```dart
class ResponsiveLayout extends StatelessWidget {
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        if (constraints.maxWidth < 600) return MobileLayout();
        if (constraints.maxWidth < 1200) return TabletLayout();
        return DesktopLayout();
      },
    );
  }
}
```

### Offline-First Architecture

| Layer | Pattern | Implementation |
|---|---|---|
| Data | Local-first | SQLite/Realm as primary store, server as sync target |
| Updates | Optimistic | Apply locally, sync in background |
| Conflicts | Resolution strategy | Last-write-wins or field-level merge |
| Queue | Persistent ops | Store pending operations, retry on connectivity |
| Cache | Stale-while-revalidate | Serve cached, refresh in background |

#### Implementation Checklist

- [ ] Network status detection and UI indicator
- [ ] Local database for all critical data
- [ ] Operation queue for pending writes
- [ ] Retry logic with exponential backoff
- [ ] Conflict detection and resolution strategy
- [ ] Cache invalidation policy
- [ ] Sync status indicator in UI
- [ ] Graceful degradation for network-only features

### App Store Guidelines Summary

| Requirement | Apple App Store | Google Play Store |
|---|---|---|
| Screenshots | 6.7" and 5.5" required, 12.9" iPad | Min 2, max 8 per device |
| App icon | 1024x1024px, no alpha, no corners | 512x512px, adaptive recommended |
| Privacy | Nutrition labels required | Data safety section required |
| Review time | 24-48 hours typical | Hours to days |
| Common rejections | Crashes, placeholder content | Policy violations, crashes |

### Performance Targets

| Metric | Target |
|---|---|
| Cold start | < 2 seconds |
| Screen transition | < 300ms |
| Touch response | < 100ms |
| Scroll FPS | 60fps (no drops) |
| Memory usage | < 200MB baseline |
| App size | < 50MB download |

## Anti-Patterns / Common Mistakes

| Anti-Pattern | Why It Is Wrong | What to Do Instead |
|---|---|---|
| Web patterns in mobile (hover states) | No hover on touch devices | Use press/tap states |
| Tiny touch targets (< 44pt) | Frustrating, accessibility fail | Minimum 44x44pt touch area |
| iOS-styled buttons on Android | Feels foreign, confuses users | Use platform-native components |
| Fixed layouts for one screen size | Breaks on tablets and foldables | Responsive layouts with breakpoints |
| Blocking main thread with I/O | UI freezes, ANR dialogs | Async I/O, background threads |
| Not handling keyboard appearance | Content hidden behind keyboard | Adjust layout on keyboard show |
| Assuming constant connectivity | App crashes or hangs offline | Offline-first architecture |
| Pixel values instead of dp/pt | Different sizes on different screens | Use density-independent units |
| Skipping haptic feedback | App feels cheap and unresponsive | Add haptics for key interactions |

## Integration Points

| Skill | Integration |
|---|---|
| `ui-ux-pro-max` | Color palettes, typography, UX guidelines |
| `ui-design-system` | Design tokens adapted for mobile |
| `canvas-design` | Mobile data visualization and charts |
| `ux-researcher-designer` | Mobile usability testing |
| `senior-frontend` | React Native component implementation |
| `deployment` | App store submission pipeline |
| `performance-optimization` | Mobile performance profiling |

## Skill Type

**FLEXIBLE** — Adapt patterns to the chosen framework and target platforms. Platform-specific guidelines should be followed when targeting a single platform; cross-platform apps may blend conventions thoughtfully.
