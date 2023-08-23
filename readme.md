## Build

> Make environment variables (see .env.example)

Download the dependencies:

```bash
npm ci
```

To run compile the Typescript:

```bash
npm run build
```

Remove dependencies for development:

```bash
npm ci --omit=dev
```

To run the application:

```bash
npm run start
```
