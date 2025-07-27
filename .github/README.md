# GitHub Actions Build Workflow

This directory contains the GitHub Actions workflow configuration for automatically building and releasing the KernelSU module.

## Workflow: Build and Release KernelSU Module

**File:** `build-and-release.yml`

### Trigger
The workflow is triggered when a tag starting with 'v' is pushed to the repository:
```bash
git tag v1.0.2
git push origin v1.0.2
```

### What it does
1. **Checkout code** - Downloads the repository source code
2. **Setup Node.js** - Installs Node.js 18 with npm caching
3. **Install dependencies** - Runs `npm ci` to install build dependencies
4. **Build WebUI assets** - Runs `npm run build` to compile the web interface
5. **Package KernelSU module** - Creates a zip file with proper KernelSU module structure
6. **Create GitHub Release** - Creates a new release with the built module

### Output
- **Release**: A new GitHub release with the tag name
- **Asset**: A zip file named `{module_id}_{version}_{timestamp}.zip`

### Module Structure
The packaged module includes:
```
module.prop                 # Module metadata
webroot/                   # WebUI files
├── index.html
├── *.js                   # Compiled JavaScript
└── *.css                  # Compiled CSS
META-INF/                  # Installation scripts
customize.sh               # Module setup script
```

### Example Usage
```bash
# Create and push a new version tag
git tag v1.0.2 -m "Release version 1.0.2"
git push origin v1.0.2

# The workflow will automatically:
# 1. Build the WebUI
# 2. Package the module
# 3. Create a GitHub release
# 4. Upload the module zip file
```

### Requirements
- Node.js 18+ for building the WebUI
- The `module/module.prop` file must contain valid module metadata
- Source code must be in the `src/` directory

### Build Configuration
The build process uses:
- **Parcel** for bundling WebUI assets
- **kernelsu-stub.js** as a build-time replacement for the KernelSU API
- **package.json alias** to redirect kernelsu imports during build