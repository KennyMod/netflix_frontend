# netflix_frontend

React single-page UI for a movie catalogue. Consumes the
[netflix_backend](https://github.com/KennyMod/netflix_backend) Spring Boot API.

## Stack

- React 18, Create React App
- MUI, React Bootstrap, React Router
- Axios
- nginx (production server and API reverse proxy)
- Docker (multi-stage build), AWS ECR, GitHub Actions

## How the API URL is resolved

Create React App substitutes `REACT_APP_*` variables at **build time**, not
runtime. Passing `-e REACT_APP_API_URL=...` to `docker run` does nothing — the
value is already compiled into the JavaScript bundle.

Rather than bake a backend address into the image, this project uses **relative
URLs with an nginx reverse proxy**. The app requests `/api/v1/movies` against its
own origin, and nginx forwards `/api/` to the backend container over the internal
Docker network.

Three consequences:

- The image is portable — it contains no backend address and runs unchanged in any environment
- No CORS is involved, since every request is same-origin
- The backend needs no published port; it is reachable only through nginx

## Configuration

Local development only. `.env` sets the dev-server proxy target:

```bash
cp .env.example .env
```

`.env` is gitignored **and excluded by `.dockerignore`**. This matters: without
that exclusion, `COPY . .` copies the local `.env` into the build stage, CRA reads
it, and `http://localhost:8080` gets compiled into the production bundle — which
works on the machine that built it and fails everywhere else.

## Run locally

Requires the backend running on port 8080.

```bash
npm ci
npm start
```

Runs on port 3000. The `proxy` field in `package.json` forwards unmatched requests
to the backend, mirroring what nginx does in production.

## Run in Docker

Both services together, from the parent directory:

```bash
docker compose up --build
```

Frontend on port 80, backend reachable only internally.

The image is a multi-stage build: Node compiles the bundle, then nginx serves it.
Final size is roughly 50 MB, down from about 400 MB for the original single-stage
image that ran `serve` inside a full Node image (kept as `Dockerfile.original`).

## Known issues

`npm audit` reports 74 vulnerabilities, 5 critical. These are almost entirely
transitive dependencies of `react-scripts`. Create React App has been unmaintained
since 2023, so most are unfixable without migrating to Vite.

## Status

Project complete. The AWS infrastructure (EC2, ECR, IAM) was decommissioned after
assessment, so the CI/CD workflows no longer run to completion. The workflow
definitions in `.github/workflows/` remain as a record of the Build → Push → Deploy
pipeline that was in use.
