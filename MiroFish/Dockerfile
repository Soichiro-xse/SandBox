# ---- Build stage: frontend ----
FROM node:20-slim AS frontend-build
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ .
RUN npm run build

# ---- Runtime stage ----
FROM python:3.11-slim

# uv (fast Python package manager)
COPY --from=ghcr.io/astral-sh/uv:0.9.26 /uv /uvx /bin/

WORKDIR /app

# Python dependencies
COPY backend/pyproject.toml backend/uv.lock ./backend/
RUN cd backend && uv sync --frozen

# Backend source
COPY backend/ ./backend/

# Built frontend
COPY --from=frontend-build /app/frontend/dist ./frontend/dist

EXPOSE 5001

# Production: gunicorn
CMD ["sh", "-c", "cd backend && uv run gunicorn 'app:create_app()' --bind 0.0.0.0:${PORT:-5001} --workers 2 --timeout 120"]
