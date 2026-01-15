---
title: Docker for Beginners - Containers, Images, and Docker Compose Explained
pubDate: 2026-01-15
author: Melnard
slug: docker-containers-beginners-guide
image:
  src: ./main.png
  alt: Docker containers and whale logo illustration
description: A beginner-friendly guide to Docker fundamentals. Learn what containers and images are, how to use Docker commands, and orchestrate multi-container apps with Docker Compose.
technology:
  - docker
  - devops
  - containers
tags:
  - docker
  - devops
  - backend
  - tutorial
  - beginner
faqs:
  - question: What's the difference between Docker and a virtual machine?
    answer: Virtual machines run a complete operating system with its own kernel, consuming significant resources. Docker containers share the host's kernel and only package the application and its dependencies, making them much lighter and faster to start.
  - question: Do I need Docker Desktop or can I use Docker Engine alone?
    answer: On Linux, Docker Engine alone is sufficient. On Windows and macOS, Docker Desktop provides a VM to run the Linux kernel that containers need, plus a nice GUI. For development, Docker Desktop is recommended on non-Linux systems.
  - question: What happens to data when a container is deleted?
    answer: By default, all data inside a container is lost when deleted. To persist data, use Docker volumes or bind mounts. Volumes are managed by Docker and are the preferred way to persist data.
  - question: Can I run Windows containers on Linux or vice versa?
    answer: No, containers share the host kernel. Windows containers need a Windows host, and Linux containers need a Linux host (or a Linux VM like Docker Desktop provides on Windows/macOS).
  - question: How is Docker Compose different from Kubernetes?
    answer: Docker Compose is for defining and running multi-container applications on a single host - great for development and small deployments. Kubernetes is for orchestrating containers across multiple hosts at scale - used for production workloads that need high availability.
  - question: Should I use Docker for production?
    answer: Yes, Docker is widely used in production. However, for production you typically use orchestration tools like Kubernetes or Docker Swarm to manage scaling, health checks, and rolling updates across multiple hosts.
---

Imagine you're moving to a new apartment. Instead of carefully packing each item and hoping nothing breaks, what if you could shrink your entire room - furniture, decorations, everything - into a portable box that works exactly the same anywhere you place it?

That's what Docker does for software. It packages your application with everything it needs to run, so it works the same on your laptop, your colleague's machine, and the production server.

### Why Docker Exists

Before Docker, developers faced a common nightmare: "It works on my machine!"

An application might run perfectly on a developer's laptop but crash on the server because of:

- Different operating system versions
- Missing dependencies
- Conflicting library versions
- Different environment configurations

Docker solves this by packaging everything together into a **container** - a standardized unit that runs consistently everywhere.

### What is a Container?

A container is a lightweight, isolated environment that runs your application. Think of it as a shipping container for software:

- **Isolated**: Each container runs separately from others
- **Portable**: Runs the same way on any system with Docker
- **Lightweight**: Shares the host OS kernel, unlike virtual machines
- **Fast**: Starts in seconds, not minutes

```
┌─────────────────────────────────────────────────────────┐
│                    Your Computer                         │
│                                                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │ Container 1 │  │ Container 2 │  │ Container 3 │     │
│  │             │  │             │  │             │     │
│  │  Node.js    │  │  PostgreSQL │  │   Redis     │     │
│  │    App      │  │  Database   │  │   Cache     │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │                  Docker Engine                    │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │              Host Operating System                │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

Each container is isolated but shares the same Docker Engine and host OS, making them efficient.

### What is a Docker Image?

If a container is a running instance, an **image** is the blueprint used to create it.

Think of it like this:

- **Image** = Recipe (instructions to create something)
- **Container** = Cake (the actual thing created from the recipe)

You can create many containers from one image, just like baking multiple cakes from one recipe.

```bash
# Pull an image from Docker Hub
docker pull node:20

# List all images on your system
docker images

# Create and run a container from an image
docker run node:20
```

Images are built in **layers**. Each layer represents a change:

```
┌─────────────────────────────┐
│   Your Application Code     │  ← Layer 4
├─────────────────────────────┤
│   npm install dependencies  │  ← Layer 3
├─────────────────────────────┤
│   Node.js 20                │  ← Layer 2
├─────────────────────────────┤
│   Base Linux (Alpine)       │  ← Layer 1
└─────────────────────────────┘
```

Layers are cached and reused, making builds faster and images smaller.

### Installing Docker

**On Linux (Ubuntu/Debian):**

```bash
# Update packages
sudo apt update

# Install Docker
sudo apt install docker.io

# Start Docker and enable on boot
sudo systemctl start docker
sudo systemctl enable docker

# Add your user to docker group (logout/login after)
sudo usermod -aG docker $USER
```

**On macOS or Windows:**

Download and install [Docker Desktop](https://www.docker.com/products/docker-desktop/) - it includes everything you need.

**Verify installation:**

```bash
docker --version
# Docker version 24.0.7, build afdd53b

docker run hello-world
# Should print a welcome message
```

### Essential Docker Commands

Here are the commands you'll use daily:

#### Running Containers

```bash
# Run a container (pulls image if not local)
docker run nginx

# Run in background (detached mode)
docker run -d nginx

# Run with a custom name
docker run -d --name my-web-server nginx

# Run and map ports (host:container)
docker run -d -p 8080:80 nginx
# Now visit http://localhost:8080

# Run with environment variables
docker run -d -e POSTGRES_PASSWORD=secret postgres

# Run interactively with a shell
docker run -it ubuntu bash
```

#### Managing Containers

```bash
# List running containers
docker ps

# List all containers (including stopped)
docker ps -a

# Stop a container
docker stop my-web-server

# Start a stopped container
docker start my-web-server

# Remove a container
docker rm my-web-server

# Remove a running container (force)
docker rm -f my-web-server

# View container logs
docker logs my-web-server

# Follow logs in real-time
docker logs -f my-web-server

# Execute command in running container
docker exec -it my-web-server bash
```

#### Managing Images

```bash
# List images
docker images

# Pull an image
docker pull redis:7

# Remove an image
docker rmi redis:7

# Remove unused images
docker image prune
```

### Creating Your Own Image with Dockerfile

A `Dockerfile` is a text file with instructions to build an image. Let's create one for a Node.js application:

**Project structure:**

```
my-app/
├── Dockerfile
├── package.json
├── package-lock.json
└── src/
    └── index.js
```

**Dockerfile:**

```dockerfile
# Start from Node.js base image
FROM node:20-alpine

# Set working directory inside container
WORKDIR /app

# Copy package files first (for better caching)
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY src/ ./src/

# Expose port (documentation only)
EXPOSE 3000

# Command to run when container starts
CMD ["node", "src/index.js"]
```

**Build and run:**

```bash
# Build the image (don't forget the dot!)
docker build -t my-node-app .

# Run a container from your image
docker run -d -p 3000:3000 my-node-app

# Test it
curl http://localhost:3000
```

### Dockerfile Best Practices

**1. Use specific base image tags:**

```dockerfile
# Bad - version can change unexpectedly
FROM node:latest

# Good - predictable version
FROM node:20-alpine
```

**2. Order instructions by change frequency:**

```dockerfile
# Files that change rarely go first
COPY package*.json ./
RUN npm ci

# Files that change often go last
COPY src/ ./src/
```

**3. Use .dockerignore:**

Create `.dockerignore` to exclude unnecessary files:

```
node_modules
npm-debug.log
.git
.env
*.md
```

**4. Don't run as root:**

```dockerfile
# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser
```

### Docker Volumes: Persisting Data

Containers are ephemeral - when removed, their data is lost. Volumes solve this:

```bash
# Create a named volume
docker volume create my-data

# Run container with volume mounted
docker run -d \
  --name postgres-db \
  -v my-data:/var/lib/postgresql/data \
  -e POSTGRES_PASSWORD=secret \
  postgres:16

# Data persists even if container is removed
docker rm -f postgres-db

# Create new container with same volume - data is still there!
docker run -d \
  --name postgres-db-new \
  -v my-data:/var/lib/postgresql/data \
  -e POSTGRES_PASSWORD=secret \
  postgres:16
```

**Bind mounts** map a host directory to a container directory - useful for development:

```bash
# Mount current directory to /app in container
docker run -d \
  -v $(pwd):/app \
  -p 3000:3000 \
  node:20-alpine \
  node /app/index.js
```

### Docker Compose: Multi-Container Applications

Real applications often need multiple services - a web server, database, cache, etc. **Docker Compose** lets you define and run multi-container applications with a single file.

**docker-compose.yml:**

```yaml
version: '3.8'

services:
  # Node.js application
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgres://postgres:secret@db:5432/myapp
      - REDIS_URL=redis://cache:6379
    depends_on:
      - db
      - cache

  # PostgreSQL database
  db:
    image: postgres:16-alpine
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=secret
      - POSTGRES_DB=myapp
    volumes:
      - postgres-data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  # Redis cache
  cache:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres-data:
```

**Docker Compose commands:**

```bash
# Start all services (in background)
docker compose up -d

# View logs from all services
docker compose logs

# Follow logs
docker compose logs -f

# View logs from specific service
docker compose logs app

# Stop all services
docker compose stop

# Stop and remove containers, networks
docker compose down

# Stop and remove everything including volumes
docker compose down -v

# Rebuild images
docker compose build

# Rebuild and start
docker compose up -d --build
```

### Understanding Docker Networking

When using Docker Compose, services can communicate using their service names as hostnames:

```javascript
// In your Node.js app
const dbConnection = 'postgres://postgres:secret@db:5432/myapp';
//                                              ↑
//                        Service name from docker-compose.yml
```

Docker Compose creates a network for your services automatically. Containers on the same network can reach each other by name.

### Common Docker Compose Patterns

**Development with hot reload:**

```yaml
services:
  app:
    build: .
    volumes:
      - .:/app           # Mount source code
      - /app/node_modules # Don't override node_modules
    command: npm run dev  # Override CMD for development
    ports:
      - "3000:3000"
```

**Health checks:**

```yaml
services:
  db:
    image: postgres:16-alpine
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  app:
    build: .
    depends_on:
      db:
        condition: service_healthy
```

**Environment files:**

```yaml
services:
  app:
    build: .
    env_file:
      - .env
```

### Practical Example: Full-Stack Application

Let's put it all together with a complete example:

**Project structure:**

```
fullstack-app/
├── docker-compose.yml
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       └── index.js
└── frontend/
    ├── Dockerfile
    └── nginx.conf
```

**docker-compose.yml:**

```yaml
version: '3.8'

services:
  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgres://postgres:secret@db:5432/app
    depends_on:
      db:
        condition: service_healthy

  db:
    image: postgres:16-alpine
    environment:
      - POSTGRES_PASSWORD=secret
      - POSTGRES_DB=app
    volumes:
      - db-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  db-data:
```

**Start everything:**

```bash
# Build and start all services
docker compose up -d --build

# Check status
docker compose ps

# View logs
docker compose logs -f

# Clean up when done
docker compose down
```

### Debugging Containers

When things go wrong:

```bash
# Check container logs
docker logs container-name

# Get a shell inside a running container
docker exec -it container-name sh

# Inspect container details
docker inspect container-name

# Check resource usage
docker stats

# Check why a container exited
docker inspect container-name --format='{{.State.ExitCode}}'
```

### Takeaways

- **Containers** are isolated, portable environments for running applications
- **Images** are blueprints used to create containers (built from Dockerfiles)
- **Volumes** persist data beyond container lifecycle
- **Docker Compose** orchestrates multi-container applications
- Use specific image tags, not `latest`
- Order Dockerfile instructions by change frequency for better caching
- Services in Docker Compose can communicate using service names

### What's Next?

Once comfortable with Docker basics, explore:

- **Docker Hub**: Share and discover container images
- **Multi-stage builds**: Create smaller production images
- **Docker Swarm**: Native Docker orchestration for multiple hosts
- **Kubernetes**: Industry-standard container orchestration at scale
- **CI/CD integration**: Automate building and deploying containers

Further reading: [Docker Documentation](https://docs.docker.com/get-started/)
