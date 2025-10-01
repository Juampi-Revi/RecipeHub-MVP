#!/bin/sh

echo "🚀 Starting RecipeHub Backend..."

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 5

# Run database migrations
echo "📦 Running database migrations..."
npx prisma migrate deploy

# Check if migrations were successful
if [ $? -eq 0 ]; then
    echo "✅ Migrations completed successfully"
else
    echo "❌ Migrations failed"
    exit 1
fi

# Run database seed
echo "🌱 Seeding database..."
npx prisma db seed

# Check if seed was successful
if [ $? -eq 0 ]; then
    echo "✅ Database seeded successfully"
else
    echo "⚠️  Seed failed, but continuing..."
fi

# Start the development server
echo "🎉 Starting development server..."
npm run dev