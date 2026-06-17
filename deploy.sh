#!/bin/bash
# Exit immediately if a command exits with a non-zero status
set -e

# Explicitly set the docker-compose project name
export COMPOSE_PROJECT_NAME=medysync

echo "=========================================================="
echo "🚀 Starting MediSync AI Deployment"
echo "=========================================================="

# 1. Find Docker Compose command
if command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE="docker-compose"
elif docker compose version &> /dev/null; then
    DOCKER_COMPOSE="docker compose"
else
    echo "❌ Error: Docker Compose is not installed on this system!"
    exit 1
fi

echo "🐳 Using Docker Compose command: $DOCKER_COMPOSE"

# Helper function to check if a port is occupied by anything
is_port_occupied() {
    local port=$1
    
    # Check if any docker container has published this port
    if docker ps --format '{{.Ports}}' | grep -q -E "(^|[^0-9])$port->"; then
        return 0
    fi
    
    # Check if host processes are listening on this port (ss)
    if command -v ss &>/dev/null; then
        if ss -tln | grep -q -E ":$port\b"; then
            return 0
        fi
    fi
    
    # Check if host processes are listening on this port (netstat)
    if command -v netstat &>/dev/null; then
        if netstat -tln | grep -q -E ":$port\b"; then
            return 0
        fi
    fi
    
    # Check using lsof
    if command -v lsof &>/dev/null; then
        if lsof -i :$port >/dev/null 2>&1; then
            return 0
        fi
    fi
    
    return 1 # Port is free
}

# Helper function to check if a port is occupied by other apps/containers (excluding ours)
is_port_occupied_by_others() {
    local port=$1
    local our_container_name=$2
    
    # If not occupied at all, it's not occupied by others
    if ! is_port_occupied $port; then
        return 1
    fi
    
    # Port is occupied. Let's see if our container is the one publishing it
    local container_names=$(docker ps --filter "publish=$port" --format '{{.Names}}')
    if [ -n "$container_names" ]; then
        for name in $container_names; do
            if [ "$name" = "$our_container_name" ]; then
                return 1 # Occupied by us, so we can safely reuse it!
            fi
        done
    fi
    
    return 0 # Occupied by others (either another container, or a host process)
}

# Find conflict-free port
get_port_for_service() {
    local preferred_port=$1
    local our_container_name=$2
    local port=$preferred_port
    
    while true; do
        if ! is_port_occupied_by_others $port $our_container_name; then
            echo "$port"
            return 0
        fi
        port=$((port + 1))
    done
}

# Read existing ports from .env if present
EXISTING_BACKEND_PORT=""
EXISTING_DB_PORT=""
if [ -f .env ]; then
    # Parse keys from .env
    EXISTING_BACKEND_PORT=$(grep -E "^MEDYSYNC_BACKEND_PORT=" .env | cut -d'=' -f2 || echo "")
    EXISTING_DB_PORT=$(grep -E "^MEDYSYNC_DB_PORT=" .env | cut -d'=' -f2 || echo "")
fi

# Resolve backend port (check if existing port is occupied by someone else, if so assign new)
if [ -n "$EXISTING_BACKEND_PORT" ] && ! is_port_occupied_by_others "$EXISTING_BACKEND_PORT" "medisync_backend"; then
    MEDYSYNC_BACKEND_PORT=$EXISTING_BACKEND_PORT
    echo "🔄 Reusing previously configured backend port: $MEDYSYNC_BACKEND_PORT"
else
    MEDYSYNC_BACKEND_PORT=$(get_port_for_service 5000 "medisync_backend")
    echo "✨ Assigned new conflict-free backend port: $MEDYSYNC_BACKEND_PORT"
fi

# Resolve db port
if [ -n "$EXISTING_DB_PORT" ] && ! is_port_occupied_by_others "$EXISTING_DB_PORT" "medisync_db"; then
    MEDYSYNC_DB_PORT=$EXISTING_DB_PORT
    echo "🔄 Reusing previously configured database port: $MEDYSYNC_DB_PORT"
else
    MEDYSYNC_DB_PORT=$(get_port_for_service 5432 "medisync_db")
    echo "✨ Assigned new conflict-free database port: $MEDYSYNC_DB_PORT"
fi

# Write/Update .env file
echo "📝 Writing/updating .env file with ports..."
touch .env

# Helper function to set or replace env var in .env file
set_env_var() {
    local key=$1
    local value=$2
    if grep -q "^${key}=" .env; then
        # Filter out the existing key and append the new one
        grep -v "^${key}=" .env > .env.tmp || true
        echo "${key}=${value}" >> .env.tmp
        mv .env.tmp .env
    else
        echo "${key}=${value}" >> .env
    fi
}

set_env_var "COMPOSE_PROJECT_NAME" "medysync"
set_env_var "MEDYSYNC_BACKEND_PORT" "$MEDYSYNC_BACKEND_PORT"
set_env_var "MEDYSYNC_DB_PORT" "$MEDYSYNC_DB_PORT"

# Export variables for this script's Compose execution
export MEDYSYNC_BACKEND_PORT
export MEDYSYNC_DB_PORT

# 2. Pull latest base images (if any)
echo "📥 Pulling base Docker images..."
$DOCKER_COMPOSE pull || true

# 3. Build and start services
echo "🏗️  Building and starting MediSync AI containers..."
# -d: Run in detached mode (background)
# --build: Build images before starting containers
# --remove-orphans: Remove containers for services not defined in the Compose file
$DOCKER_COMPOSE up -d --build --remove-orphans

# 4. Verify Running Setup
echo "📊 Current Container Status:"
$DOCKER_COMPOSE ps

# 5. Clean up unused images to free up disk space on the VPS
echo "🧹 Cleaning up dangling Docker images..."
docker image prune -f

echo "=========================================================="
echo "🎉 MediSync AI Deployment Completed Successfully!"
echo "📍 Access Web UI on http://<vps-ip>:$MEDYSYNC_BACKEND_PORT"
echo "🗄️  Database port (external mapping): $MEDYSYNC_DB_PORT"
echo "=========================================================="
