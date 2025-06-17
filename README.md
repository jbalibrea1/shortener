# URL SHORTENER - - Dockerized Application with Frontend and Backend

## Description

This application consists of a dockerized stack including:

- A frontend service built with Next.js
- A backend service with its own API
- (Optional) A MongoDB database (currently commented out in the configuration)

## Prerequisites

- Docker installed on your system
- Docker Compose (usually included with Docker Desktop)
- Environment variables configured (see corresponding section)

## Configuration

### Environment Variables

Before starting the application, you need to configure the environment variables:

1. **Frontend**:
   - Create a `.env.production` file in the `front/` directory with these variables:

```bash
NEXT_PUBLIC_API_URL=<API_URL>
NEXT_PUBLIC_DOMAIN=<DOMAIN>
```

2. **Backend**:
   - Create a `.env` file in the `api/` directory with your backend-specific variables

```bash
MONGODB_URI=<YOUR_MONGODB_URI>
TEST_MONGODB_URI=<YOUR_TEST_MONGODB_URI>
PORT=<PORT_LISTENING>
SECRET=<YOUR_SECRET>
```

## How to Run

### Development

```bash
docker compose -f docker-compose.dev.yml up
```

### Production

```bash
docker-compose up --build -d
```

### Stop Services

```bash
docker-compose down
```

## Services

- **Frontend**: Accessible at <http://localhost:3000>
- **Backend API**: Accessible at <http://localhost:3001>

## Health Checks

The backend includes a healthcheck endpoint at /health that verifies service availability every 10 seconds

## Troubleshooting

If services fail to start:

```bash
docker-compose logs -f
```

To remove all containers and start fresh:

```bash
docker-compose down -v
```
