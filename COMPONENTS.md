# eCureTrip Component Library

A comprehensive collection of reusable UI components built with the eCureTrip design system.

## 🎨 Design System Overview

### Color Palette
- **Primary**: `#2F6FE1` - Primary actions, buttons
- **Ink**: `#0E1B2A` - Headings, important text
- **Body**: `#1C2734` - Body text, paragraphs
- **Muted**: `#5A6A85` - Subtext, labels, secondary information
- **Success**: `#2BB673` - Success states, positive feedback
- **Warning**: `#DFA500` - Warning states, alerts
- **Danger**: `#D64545` - Error states, negative feedback
- **Price**: `#0E64B1` - Pricing information
- **Surface**: `#FFFFFF` - Card backgrounds
- **Surface-2**: `#F3F6FB` - Secondary surfaces
- **Border**: `#E5EAF2` - Borders, dividers

### Typography
- **H1**: 44px - Main page titles
- **H2**: 32px - Section headings
- **H3**: 24px - Subsection headings
- **Body**: 16px - Main content text
- **Sub**: 14px - Secondary text, labels
- **Cap**: 12px - Captions, small text

## 🧩 Components

### Button

A versatile button component with multiple variants, sizes, and states.

```tsx
import Button from '@/components/ui/Button'

// Basic usage
<Button>Click me</Button>

// Variants
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="outline">Outline</Button>
<Button variant="link">Link</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

// With icons
<Button icon={Search} iconPosition="left">Search</Button>
<Button icon={Heart} iconPosition="right">Like</Button>

// Loading state
<Button loading>Processing...</Button>

// Disabled state
<Button disabled>Disabled</Button>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'ghost' \| 'outline' \| 'link'` | `'primary'` | Button style variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Button size |
| `icon` | `LucideIcon` | `undefined` | Icon component |
| `iconPosition` | `'left' \| 'right'` | `'left'` | Icon position |
| `loading` | `boolean` | `false` | Show loading spinner |
| `disabled` | `boolean` | `false` | Disable button |
| `children` | `ReactNode` | - | Button content |

### Card

A flexible card component with header, body, and footer sections.

```tsx
import { Card, CardHeader, CardBody, CardFooter } from '@/components/ui/Card'

// Basic card
<Card>
  <CardHeader>
    <h3>Card Title</h3>
  </CardHeader>
  <CardBody>
    <p>Card content goes here</p>
  </CardBody>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>

// Variants
<Card variant="default">Default card</Card>
<Card variant="elevated">Elevated with shadow</Card>
<Card variant="outlined">Transparent background</Card>

// Padding options
<Card padding="none">No padding</Card>
<Card padding="sm">Small padding</Card>
<Card padding="md">Medium padding (default)</Card>
<Card padding="lg">Large padding</Card>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'elevated' \| 'outlined'` | `'default'` | Card style variant |
| `padding` | `'none' \| 'sm' \| 'md' \| 'lg'` | `'md'` | Card padding size |

### Input

A form input component with labels, validation, and icons.

```tsx
import Input from '@/components/ui/Input'

// Basic input
<Input label="Email" type="email" placeholder="Enter your email" />

// With icon
<Input 
  label="Search" 
  icon={Search} 
  iconPosition="right"
  placeholder="Search for doctors..."
/>

// With help text
<Input 
  label="Password" 
  type="password" 
  help="Must be at least 8 characters"
/>

// With error
<Input 
  label="Username" 
  error="Username is already taken"
  variant="error"
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | Input label |
| `error` | `string` | - | Error message |
| `help` | `string` | - | Help text |
| `icon` | `LucideIcon` | - | Icon component |
| `iconPosition` | `'left' \| 'right'` | `'left'` | Icon position |
| `variant` | `'default' \| 'error' \| 'success'` | `'default'` | Input state |

### Pill

A tag/badge component for displaying status, categories, or labels.

```tsx
import Pill from '@/components/ui/Pill'

// Basic pills
<Pill>Default</Pill>
<Pill variant="primary">Primary</Pill>
<Pill variant="success">Success</Pill>
<Pill variant="warning">Warning</Pill>
<Pill variant="danger">Danger</Pill>

// With icons
<Pill variant="success" icon={CheckCircle}>Verified</Pill>
<Pill variant="primary" icon={Shield}>Accredited</Pill>

// Sizes
<Pill size="sm">Small</Pill>
<Pill size="md">Medium (default)</Pill>
<Pill size="lg">Large</Pill>

// Removable
<Pill removable onRemove={() => console.log('removed')}>
  Removable
</Pill>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'primary' \| 'success' \| 'warning' \| 'danger'` | `'default'` | Pill style variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Pill size |
| `icon` | `LucideIcon` | - | Icon component |
| `removable` | `boolean` | `false` | Show remove button |
| `onRemove` | `() => void` | - | Remove handler |

### Alert

A notification component for displaying messages to users.

```tsx
import Alert from '@/components/ui/Alert'

// Basic alerts
<Alert variant="info">Information message</Alert>
<Alert variant="success">Success message</Alert>
<Alert variant="warning">Warning message</Alert>
<Alert variant="danger">Error message</Alert>

// With title
<Alert variant="success" title="Success!">
  Your changes have been saved.
</Alert>

// Dismissible
<Alert 
  variant="info" 
  title="Info" 
  dismissible 
  onDismiss={() => console.log('dismissed')}
>
  This alert can be dismissed.
</Alert>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'info' \| 'success' \| 'warning' \| 'danger'` | `'info'` | Alert type |
| `title` | `string` | - | Alert title |
| `dismissible` | `boolean` | `false` | Show dismiss button |
| `onDismiss` | `() => void` | - | Dismiss handler |

### Table

A data table component with sorting, pagination, and customization.

```tsx
import Table from '@/components/ui/Table'

const data = [
  { id: 1, name: 'Dr. John Smith', specialty: 'Cardiology', rating: 4.8 },
  { id: 2, name: 'Dr. Sarah Johnson', specialty: 'Neurology', rating: 4.9 }
]

const columns = [
  { key: 'name', header: 'Doctor Name', sortable: true },
  { key: 'specialty', header: 'Specialty', sortable: true },
  { 
    key: 'rating', 
    header: 'Rating', 
    sortable: true,
    render: (value) => (
      <div className="flex items-center space-x-1">
        <Star className="w-4 h-4 text-success" />
        <span>{value}</span>
      </div>
    )
  }
]

<Table
  data={data}
  columns={columns}
  sortable
  pagination
  pageSize={10}
  onRowClick={(row) => console.log('clicked:', row)}
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `T[]` | - | Table data array |
| `columns` | `Column<T>[]` | - | Column definitions |
| `sortable` | `boolean` | `false` | Enable sorting |
| `pagination` | `boolean` | `false` | Enable pagination |
| `pageSize` | `number` | `10` | Items per page |
| `onRowClick` | `(row: T) => void` | - | Row click handler |
| `loading` | `boolean` | `false` | Show loading state |
| `emptyMessage` | `string` | `"No data available"` | Empty state message |

### Modal

A modal dialog component with backdrop, animations, and accessibility features.

```tsx
import Modal from '@/components/ui/Modal'

const [isOpen, setIsOpen] = useState(false)

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirm Action"
  size="md"
>
  <div className="space-y-4">
    <p>Are you sure you want to proceed?</p>
    <div className="flex justify-end space-x-3">
      <Button variant="ghost" onClick={() => setIsOpen(false)}>
        Cancel
      </Button>
      <Button onClick={() => setIsOpen(false)}>
        Confirm
      </Button>
    </div>
  </div>
</Modal>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | - | Modal visibility |
| `onClose` | `() => void` | - | Close handler |
| `title` | `string` | - | Modal title |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | `'md'` | Modal size |
| `closeOnBackdrop` | `boolean` | `true` | Close on backdrop click |
| `closeOnEscape` | `boolean` | `true` | Close on escape key |
| `showCloseButton` | `boolean` | `true` | Show close button |

### Form

A form component with validation, error handling, and multiple field types.

```tsx
import Form from '@/components/ui/Form'

const fields = [
  { name: 'name', label: 'Full Name', type: 'text', required: true },
  { name: 'email', label: 'Email', type: 'email', required: true },
  { 
    name: 'specialty', 
    label: 'Specialty', 
    type: 'select',
    options: [
      { value: 'cardiology', label: 'Cardiology' },
      { value: 'neurology', label: 'Neurology' }
    ]
  },
  { name: 'message', label: 'Message', type: 'textarea' }
]

<Form
  fields={fields}
  onSubmit={(data) => console.log('form data:', data)}
  submitText="Send Message"
  loading={false}
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `fields` | `FormField[]` | - | Form field definitions |
| `onSubmit` | `(data: Record<string, any>) => void` | - | Submit handler |
| `submitText` | `string` | `'Submit'` | Submit button text |
| `loading` | `boolean` | `false` | Form loading state |
| `initialData` | `Record<string, any>` | `{}` | Initial form values |

### Navigation

A navigation component with dropdowns, mobile menu, and badges.

```tsx
import Navigation from '@/components/ui/Navigation'

const items = [
  { name: 'Home', href: '/' },
  { 
    name: 'Services', 
    children: [
      { name: 'Teleconsultation', href: '/teleconsultation' },
      { name: 'Second Opinion', href: '/second-opinion' }
    ]
  },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' }
]

<Navigation
  items={items}
  logo={<Logo />}
  variant="default"
  onItemClick={(item) => console.log('clicked:', item)}
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `NavigationItem[]` | - | Navigation items |
| `logo` | `ReactNode` | - | Logo component |
| `variant` | `'default' \| 'minimal' \| 'elevated'` | `'default'` | Navigation style |
| `onItemClick` | `(item: NavigationItem) => void` | - | Item click handler |

## 🎯 Usage Guidelines

### Component Composition
- Use semantic HTML elements within components
- Maintain consistent spacing using the design system
- Follow accessibility best practices

### Responsive Design
- All components are mobile-first
- Use responsive utilities for different screen sizes
- Test on various devices and orientations

### Accessibility
- Include proper ARIA labels
- Ensure keyboard navigation works
- Maintain sufficient color contrast
- Support screen readers

### Performance
- Use React.memo for expensive components
- Implement proper loading states
- Optimize bundle size with tree shaking

## 🔧 Customization

### CSS Variables
All design tokens are available as CSS variables:

```css
:root {
  --primary: #2F6FE1;
  --ink: #0E1B2A;
  --body: #1C2734;
  --muted: #5A6A85;
  --success: #2BB673;
  --warning: #DFA500;
  --danger: #D64545;
  --surface: #FFFFFF;
  --surface-2: #F3F6FB;
  --border: #E5EAF2;
}
```

### Tailwind Integration
All design tokens are available as Tailwind utility classes:

```tsx
// Colors
<div className="bg-primary text-white">Primary background</div>
<div className="text-ink">Heading text</div>
<div className="border-border">Bordered element</div>

// Typography
<h1 className="text-ink">Main heading</h1>
<p className="text-body">Body text</p>
<span className="text-muted">Muted text</span>
```

### Component Variants
Most components support multiple variants for different use cases:

```tsx
// Button variants
<Button variant="primary">Primary action</Button>
<Button variant="ghost">Secondary action</Button>
<Button variant="outline">Tertiary action</Button>

// Card variants
<Card variant="default">Standard card</Card>
<Card variant="elevated">Prominent card</Card>
<Card variant="outlined">Subtle card</Card>
```

## 📱 Mobile-First Approach

All components are designed with mobile-first principles:

- Touch-friendly interactions
- Appropriate sizing for mobile devices
- Responsive breakpoints
- Mobile-optimized layouts

## ♿ Accessibility Features

- ARIA labels and roles
- Keyboard navigation support
- Focus management
- Screen reader compatibility
- High contrast support
- Semantic HTML structure

## 🚀 Getting Started

1. Install the component library
2. Import components as needed
3. Use design system classes for styling
4. Follow the usage examples above
5. Customize using CSS variables or Tailwind classes

## 📚 Examples

See the [Components Showcase](/components-showcase) page for live examples of all components in action.

## 🤝 Contributing

When adding new components:

1. Follow the existing component patterns
2. Include TypeScript interfaces
3. Add comprehensive props documentation
4. Include accessibility features
5. Test on multiple devices
6. Update this documentation

## 📄 License

This component library is part of the eCureTrip platform and follows the same licensing terms.
