# Assets Folder

This folder contains static assets for the Blas Bar application.

## Structure

```
assets/
├── images/
│   ├── blas_header.png        # Main Blas header image
│   └── [other images]         # Additional images
└── README.md                  # This file
```

## Usage

To reference assets in your Angular components, use the `assets/` path:

```typescript
// In component template
<img src="assets/images/blas_header.png" alt="Blas Logo">

// In component styles
background-image: url('assets/images/blas_header.png');
```

## Image Guidelines

- Use SVG format for logos and icons for scalability
- Use PNG/JPG for photographs
- Optimize images for web use
- Keep file sizes reasonable for fast loading
