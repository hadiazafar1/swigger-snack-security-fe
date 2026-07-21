# Swigger Snack Security frontend

React and Vite frontend for the Swigger Snack Security application.

## Requirements

- Node.js 22 or later and npm, for local development
- Docker, for running the production container
- The backend API running on port `8080`, or at another URL supplied through `BACKEND_URL`

## Run locally for development

Install the dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

Open <http://localhost:3000>. During development, requests to `/api` and `/auth` are proxied to `http://localhost:8080`.

Other useful commands:

```bash
npm run lint    # Type-check the project
npm run build   # Create a production build in dist/
npm run preview # Preview the production build locally
```

## Run with Docker

Build the frontend image from the project directory:

```bash
docker build -t swigger-snack-frontend .
```

If the backend is running on port `8080` on your computer, start the frontend with:

```bash
docker run --rm \
  --name swigger-snack-frontend \
  --add-host=host.docker.internal:host-gateway \
  -p 3000:80 \
  swigger-snack-frontend
```

Open <http://localhost:3000>.

### Use a different backend

Set `BACKEND_URL` to a URL reachable from inside the frontend container:

```bash
docker run --rm \
  --name swigger-snack-frontend \
  -p 3000:80 \
  -e BACKEND_URL=http://backend:8080 \
  swigger-snack-frontend
```

When both containers use the same Docker network, `backend` should be the backend container or service name. `BACKEND_URL` must not end with a trailing slash.

## Configuration notes

- Nginx serves the compiled frontend on container port `80`.
- Browser requests to `/api/*` and `/auth/*` are forwarded to `BACKEND_URL`.
- The default backend URL is `http://host.docker.internal:8080`.
- Client-side routes fall back to `index.html`, so reloading a frontend route works correctly.
