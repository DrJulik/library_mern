# Library Color Palette

## Custom Colors Available in Tailwind

The following custom colors are available throughout the application:

### Library Scale
- `library-900` - `#0a0f14` - Darkest (almost black)
- `library-800` - `#081f2d` - Dark blue
- `library-700` - `#093748` - Medium-dark blue  
- `library-600` - `#195465` - Medium blue
- `library-accent` - `#d26939` - Orange/rust accent

### Primary (mapped to library colors)
- `primary-600` (DEFAULT) - `#195465` - Main primary color
- `primary-700` - `#093748`
- `primary-800` - `#081f2d`
- `primary-900` - `#0a0f14`

## Usage Examples

```tsx
// Background colors
<div className="bg-library-900">Darkest background</div>
<div className="bg-library-800">Dark background</div>
<div className="bg-library-700">Medium-dark background</div>
<div className="bg-library-600">Medium background</div>
<div className="bg-library-accent">Accent background</div>

// Text colors
<p className="text-library-900">Darkest text</p>
<p className="text-library-accent">Accent text</p>

// Border colors
<div className="border-library-600">Border</div>

// Using primary (automatically uses library colors)
<button className="bg-primary-600 hover:bg-primary-700">
  Primary Button
</button>
```

## Color Applications

- **library-900**: Headers, darkest backgrounds, text on light backgrounds
- **library-800**: Darker UI elements, secondary backgrounds
- **library-700**: Medium backgrounds, hover states
- **library-600**: Primary buttons, links, main brand color
- **library-accent**: CTAs, highlights, important actions

