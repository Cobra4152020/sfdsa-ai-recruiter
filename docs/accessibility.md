# Accessibility Guidelines

This document outlines the accessibility features and guidelines for the SF Deputy Sheriff AI Recruitment application.

## WCAG Compliance

Our application aims to meet WCAG 2.1 AA compliance standards. This includes:

- **Perceivable**: Information and user interface components must be presentable to users in ways they can perceive.
- **Operable**: User interface components and navigation must be operable.
- **Understandable**: Information and the operation of the user interface must be understandable.
- **Robust**: Content must be robust enough to be interpreted reliably by a wide variety of user agents, including assistive technologies.

## Implemented Accessibility Features

### Keyboard Navigation

- All interactive elements are keyboard accessible
- Focus indicators are visible and have sufficient contrast
- Skip to content link allows users to bypass navigation
- Focus trapping in modal dialogs
- Logical tab order follows visual layout

### Screen Reader Support

- Proper ARIA roles, states, and properties
- Meaningful alt text for images
- Visually hidden text for icons and visual elements
- Proper heading structure
- Landmark roles for major sections
- Live regions for dynamic content

### Color and Contrast

- Color is not used as the only means of conveying information
- Text has sufficient contrast against its background
- Focus indicators have sufficient contrast
- Alternative color schemes for dark mode

### Forms and Inputs

- All form fields have associated labels
- Required fields are clearly indicated
- Error messages are associated with form fields
- Form validation provides clear feedback

## Testing Procedures

### Automated Testing

- Use axe-core for automated accessibility testing
- Run Lighthouse accessibility audits
- Check color contrast with WebAIM's contrast checker

### Manual Testing

- Keyboard navigation testing
- Screen reader testing with NVDA, JAWS, and VoiceOver
- Testing with browser zoom up to 200%
- Testing with high contrast mode

## Maintaining Accessibility

When adding new features or making changes to the application, ensure:

1. All new components follow the accessibility patterns established in this document
2. New images have appropriate alt text
3. New forms have proper labels and error handling
4. New interactive elements are keyboard accessible
5. New content has proper heading structure
6. Color contrast meets WCAG 2.1 AA standards

## Resources

- [WebAIM: Web Accessibility In Mind](https://webaim.org/)
- [WCAG 2.1 Guidelines](https://www.w3.org/TR/WCAG21/)
- [A11y Project Checklist](https://www.a11yproject.com/checklist/)
- [MDN Accessibility Guide](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
