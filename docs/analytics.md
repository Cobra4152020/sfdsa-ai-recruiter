# Analytics Implementation Guide

This document outlines the analytics implementation for the SF Deputy Sheriff AI Recruitment application.

## Overview

The analytics system tracks user interactions, page views, and conversion events to provide insights into user behavior and recruitment effectiveness. The implementation uses Google Analytics 4 (GA4) as the primary analytics platform.

## Key Metrics

### Engagement Metrics

- **Page Views**: Track which pages users visit
- **Session Duration**: How long users spend on the site
- **Chat Interactions**: Number of messages sent to the AI assistant
- **Content Engagement**: Which resources users view or download

### Conversion Metrics

- **Sign-up Rate**: Percentage of visitors who sign up
- **Application Rate**: Percentage of visitors who apply
- **Funnel Completion**: Progress through the recruitment funnel
- **Conversion Time**: Time from first visit to application

### Performance Metrics

- **Page Load Time**: How quickly pages load
- **Component Render Time**: How quickly key components render
- **API Response Time**: How quickly the AI responds to queries

## Implementation Details

### Analytics Service

The core analytics functionality is implemented in `lib/analytics/index.ts`. This service:

- Initializes Google Analytics
- Tracks page views
- Tracks custom events
- Tracks user properties
- Tracks errors and performance metrics

### React Hooks

Custom React hooks in `lib/analytics/hooks.ts` make it easy to track analytics in React components:

- `usePageView`: Automatically tracks page views
- `useTrackComponentLoad`: Tracks component load time
- `useTrackFormSubmission`: Tracks form submissions
- `useTrackInteraction`: Tracks user interactions

### Analytics Provider

The `AnalyticsProvider` component in `components/analytics/analytics-provider.tsx` wraps the application and:

- Initializes analytics on page load
- Tracks page views automatically
- Sets user properties when a user logs in

### Event Tracking Components

Components in `components/analytics/track-event.tsx` make it easy to track events declaratively:

- `TrackEvent`: Tracks a custom event
- `TrackClick`: Tracks click events on any element

### Analytics Dashboard

The `AnalyticsDashboard` component in `components/analytics/analytics-dashboard.tsx` provides a visual interface for viewing analytics data. It includes:

- Overview metrics
- Visitor trends
- Engagement metrics
- Conversion funnel

## Event Naming Conventions

To ensure consistent event tracking, follow these naming conventions:

### Event Categories

- `engagement`: User interactions with the site
- `conversion`: Steps toward applying
- `navigation`: Page navigation
- `content`: Content consumption
- `error`: Error events
- `performance`: Performance metrics

### Event Actions

- Use verb_noun format (e.g., `view_page`, `click_button`, `submit_form`)
- Be specific but not too granular
- Use lowercase with underscores

### Event Labels

- Provide additional context for the event
- Be descriptive but concise
- Use consistent naming across similar events

## Implementation Examples

### Tracking Page Views

Page views are tracked automatically by the `AnalyticsProvider` component.

### Tracking Button Clicks

\`\`\`jsx
import { TrackClick } from '@/components/analytics/track-event'

function MyComponent() {
  return (
    <TrackClick action="click_apply_button" label="homepage" category="conversion">
      <Button>Apply Now</Button>
    </TrackClick>
  )
}
\`\`\`

### Tracking Form Submissions

\`\`\`jsx
import { useTrackFormSubmission } from '@/lib/analytics/hooks'

function MyForm() {
  const trackSubmit = useTrackFormSubmission('signup_form')
  
  const handleSubmit = async (data) => {
    try {
      await submitForm(data)
      trackSubmit(true, { field_count: Object.keys(data).length })
    } catch (error) {
      trackSubmit(false, { error: error.message })
    }
  }
  
  return <form onSubmit={handleSubmit}>...</form>
}
\`\`\`

### Tracking Component Load Time

\`\`\`jsx
import { useTrackComponentLoad } from '@/lib/analytics/hooks'

function HeavyComponent() {
  useTrackComponentLoad('heavy_component')
  
  return <div>...</div>
}
\`\`\`

## Adding New Events

When adding new events to track:

1. Determine the appropriate category, action, and label
2. Use the appropriate tracking method or component
3. Document the new event in this guide
4. Verify the event is being tracked correctly in Google Analytics

## Debugging

To debug analytics in development:

1. Set `ENABLE_ANALYTICS=true` in your `.env.local` file
2. Open the browser console to see analytics events being logged
3. Use the Google Analytics Debug View to verify events are being sent correctly

## Privacy Considerations

The analytics implementation respects user privacy:

- No personally identifiable information (PII) is tracked
- User IDs are anonymized
- Analytics are disabled by default in development
- Users can opt out of analytics by enabling Do Not Track in their browser
