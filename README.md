## Build instructions

``` bash
# Install dependencies
yarn

# Build
yarn build

# Zip files
zip out.zip manifest.json dist/*
```

## Development instructions
``` bash
# Install dependencies
yarn

# Build and watch for file changes for development
yarn watch
```
## Environment variables
```env
BASE_API_URL: Is the base API URL for making database requests, default is 'https://pronouns.alejo.io/api/'