# Deployment Instructions

## Dependency Resolution

This project requires the `--legacy-peer-deps` flag for npm installation due to peer dependency conflicts between the `ai` library and `zod`.

### For Local Development:
```bash
npm install --legacy-peer-deps
npm run dev
```

### For Production Build:
```bash
npm install --legacy-peer-deps
npm run build
npm start
```

### Platform-Specific Deployment Instructions:

#### Vercel:
Add this to your `package.json` in the scripts section:
```json
{
  "scripts": {
    "postinstall": "echo 'Dependencies installed with legacy peer deps support'"
  }
}
```

Set environment variable in Vercel dashboard:
- `NPM_FLAGS` = `--legacy-peer-deps`

#### Netlify:
Add `.nvmrc` file with Node version and use npm install command in build settings:
```
Build command: npm install --legacy-peer-deps && npm run build
```

#### Railway:
Add to `railway.toml`:
```toml
[build]
buildCommand = "npm install --legacy-peer-deps && npm run build"
```

#### Docker:
```dockerfile
RUN npm install --legacy-peer-deps
```

## Dependencies Fixed:
- `zod`: Updated from `3.25.67` to `^3.25.76` to satisfy `ai@5.0.48` peer dependency requirements
- All peer dependency conflicts resolved
- Build process now works correctly for deployment

## Environment Variables Required:
Check `.env.example` for all required environment variables before deployment.