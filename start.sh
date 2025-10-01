#!/bin/bash

# RecipeHub - Startup Script
# This script helps you start the application in different modes

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
}

# Function to show help
show_help() {
    echo "RecipeHub - Startup Script"
    echo ""
    echo "Usage: ./start.sh [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  dev         Start in development mode with hot reload"
    echo "  prod        Start in production mode"
    echo "  build       Build all Docker images"
    echo "  stop        Stop all running containers"
    echo "  clean       Stop containers and remove volumes"
    echo "  logs        Show logs from all services"
    echo "  help        Show this help message"
    echo ""
    echo "Examples:"
    echo "  ./start.sh dev    # Start development environment"
    echo "  ./start.sh prod   # Start production environment"
    echo "  ./start.sh stop   # Stop all services"
}

# Function to start development environment
start_dev() {
    print_status "Starting RecipeHub in development mode..."
    check_docker
    
    print_status "Building development images..."
    docker-compose -f docker-compose.dev.yml build
    
    print_status "Starting services..."
    docker-compose -f docker-compose.dev.yml up -d
    
    print_status "Waiting for services to be ready..."
    sleep 10
    
    print_success "Development environment is ready!"
    echo ""
    echo "🚀 Application URLs:"
    echo "   Frontend: http://localhost:5173"
    echo "   Backend API: http://localhost:3001"
    echo "   Database: localhost:5432"
    echo ""
    echo "📝 To view logs: ./start.sh logs"
    echo "🛑 To stop: ./start.sh stop"
}

# Function to start production environment
start_prod() {
    print_status "Starting RecipeHub in production mode..."
    check_docker
    
    print_status "Building production images..."
    docker-compose build
    
    print_status "Starting services..."
    docker-compose up -d
    
    print_status "Running database migrations..."
    docker-compose exec backend npx prisma migrate deploy
    
    print_status "Seeding database..."
    docker-compose exec backend npm run seed
    
    print_status "Waiting for services to be ready..."
    sleep 15
    
    print_success "Production environment is ready!"
    echo ""
    echo "🚀 Application URLs:"
    echo "   Frontend: http://localhost"
    echo "   Backend API: http://localhost:3001"
    echo ""
    echo "📝 To view logs: ./start.sh logs"
    echo "🛑 To stop: ./start.sh stop"
}

# Function to build images
build_images() {
    print_status "Building all Docker images..."
    check_docker
    
    docker-compose build
    docker-compose -f docker-compose.dev.yml build
    
    print_success "All images built successfully!"
}

# Function to stop services
stop_services() {
    print_status "Stopping all RecipeHub services..."
    
    docker-compose down
    docker-compose -f docker-compose.dev.yml down
    
    print_success "All services stopped!"
}

# Function to clean everything
clean_all() {
    print_warning "This will stop all containers and remove all data volumes!"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "Cleaning all RecipeHub data..."
        
        docker-compose down -v
        docker-compose -f docker-compose.dev.yml down -v
        
        print_success "All data cleaned!"
    else
        print_status "Clean operation cancelled."
    fi
}

# Function to show logs
show_logs() {
    print_status "Showing logs from all services..."
    
    if docker-compose ps | grep -q "Up"; then
        docker-compose logs -f
    elif docker-compose -f docker-compose.dev.yml ps | grep -q "Up"; then
        docker-compose -f docker-compose.dev.yml logs -f
    else
        print_warning "No running services found."
    fi
}

# Main script logic
case "${1:-help}" in
    "dev")
        start_dev
        ;;
    "prod")
        start_prod
        ;;
    "build")
        build_images
        ;;
    "stop")
        stop_services
        ;;
    "clean")
        clean_all
        ;;
    "logs")
        show_logs
        ;;
    "help"|*)
        show_help
        ;;
esac