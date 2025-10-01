# RecipeHub - Simple Setup
.PHONY: help install dev stop clean logs

# Default target
all: install dev

# Show help
help:
	@echo "🍳 RecipeHub - Simple Commands"
	@echo ""
	@echo "Usage:"
	@echo "  make          - Install and start everything"
	@echo "  make install  - Install dependencies and setup environment"
	@echo "  make dev      - Start development servers"
	@echo "  make stop     - Stop all services"
	@echo "  make clean    - Stop and clean everything"
	@echo "  make logs     - Show logs"
	@echo ""

# Install and setup everything
install:
	@echo "🚀 Setting up RecipeHub..."
	@echo "📋 Copying environment files..."
	@cp backend/.env.example backend/.env 2>/dev/null || true
	@cp frontend/.env.example frontend/.env 2>/dev/null || true
	@echo "✅ Environment files ready"
	@echo "🐳 Starting services with Docker..."

# Start development environment
dev: install
	@echo "🔥 Starting RecipeHub in development mode..."
	@chmod +x start.sh
	@./start.sh dev
	@echo ""
	@echo "🎉 RecipeHub is running!"
	@echo "📱 Frontend: http://localhost:3000"
	@echo "🔧 Backend:  http://localhost:3001"
	@echo ""
	@echo "To stop: make stop"

# Stop all services
stop:
	@echo "🛑 Stopping RecipeHub..."
	@./start.sh stop

# Clean everything
clean:
	@echo "🧹 Cleaning RecipeHub..."
	@./start.sh clean

# Show logs
logs:
	@docker compose -f docker-compose.dev.yml logs -f