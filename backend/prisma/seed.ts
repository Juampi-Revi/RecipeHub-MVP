import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { createLogger } from '../src/config/logger';

const UserRole = {
  ADMIN: 'ADMIN',
  CHEF: 'CHEF', 
  USER: 'USER'
} as const;

const Difficulty = {
  EASY: 'EASY',
  MEDIUM: 'MEDIUM',
  HARD: 'HARD'
} as const;

const CategoryType = {
  DIFFICULTY: 'DIFFICULTY',
  MEAL_TYPE: 'MEAL_TYPE',
  CUISINE: 'CUISINE',
  DIETARY: 'DIETARY',
  FLAVOR: 'FLAVOR',
  CALORIES: 'CALORIES',
  OCCASION: 'OCCASION'
} as const;

const IngredientCategory = {
  PROTEIN: 'PROTEIN',
  VEGETABLE: 'VEGETABLE',
  FRUIT: 'FRUIT',
  GRAIN: 'GRAIN',
  DAIRY: 'DAIRY',
  SPICE: 'SPICE',
  HERB: 'HERB',
  SAUCE: 'SAUCE',
  OTHER: 'OTHER'
} as const;

const prisma = new PrismaClient();
const logger = createLogger();

async function main() {
  logger.info('🌱 Starting database seed...');

  await prisma.rating.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.recipeLike.deleteMany();
  await prisma.recipeIngredient.deleteMany();
  await prisma.recipeCategory.deleteMany();
  await prisma.recipeChef.deleteMany();
  await prisma.recipe.deleteMany();
  await prisma.ingredient.deleteMany();
  await prisma.chef.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const admin = await prisma.user.create({
    data: {
      email: 'admin@recipehub.com',
      name: 'Admin User',
      password: hashedPassword,
      role: UserRole.ADMIN,
      bio: 'Platform administrator and food enthusiast',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    }
  });

  const chef1 = await prisma.user.create({
    data: {
      email: 'maria.gonzalez@chef.com',
      name: 'María González',
      password: hashedPassword,
      role: UserRole.CHEF,
      bio: 'Professional chef specializing in Mediterranean cuisine',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
    }
  });

  const chef2 = await prisma.user.create({
    data: {
      email: 'carlos.rodriguez@chef.com',
      name: 'Carlos Rodríguez',
      password: hashedPassword,
      role: UserRole.CHEF,
      bio: 'Pastry chef and dessert specialist',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    }
  });

  const user1 = await prisma.user.create({
    data: {
      email: 'ana.lopez@user.com',
      name: 'Ana López',
      password: hashedPassword,
      role: UserRole.USER,
      bio: 'Home cooking enthusiast and food blogger',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
    }
  });

  await prisma.category.createMany({
    data: [
      { name: 'Easy', type: 'DIFFICULTY' },
      { name: 'Medium', type: 'DIFFICULTY' },
      { name: 'Hard', type: 'DIFFICULTY' },
      { name: 'Breakfast', type: 'MEAL_TYPE' },
      { name: 'Lunch', type: 'MEAL_TYPE' },
      { name: 'Dinner', type: 'MEAL_TYPE' },
      { name: 'Dessert', type: 'MEAL_TYPE' },
      { name: 'Italian', type: 'CUISINE' },
      { name: 'Asian', type: 'CUISINE' },
      { name: 'Mexican', type: 'CUISINE' },
      { name: 'Mediterranean', type: 'CUISINE' },
      { name: 'Vegetarian', type: 'DIETARY' },
      { name: 'Vegan', type: 'DIETARY' },
      { name: 'Gluten-Free', type: 'DIETARY' },
      { name: 'Spicy', type: 'FLAVOR' },
      { name: 'Sweet', type: 'FLAVOR' },
      { name: 'Low Calorie', type: 'CALORIES' },
      { name: 'High Protein', type: 'CALORIES' },
    ],
  });

  const categories = await prisma.category.findMany();

  const chefs = await Promise.all([
    prisma.chef.create({
      data: {
        name: 'Gordon Ramsay',
        bio: 'World-renowned chef and restaurateur known for his fiery personality and exceptional culinary skills.',
        imageUrl: 'https://images.unsplash.com/photo-1583394293214-28a5b0a4c7c8?w=400&h=400&fit=crop&crop=face',
        specialties: 'British, French, Mediterranean',
        yearsExperience: 30,
        isVerified: true,
      },
    }),
    prisma.chef.create({
      data: {
        name: 'Julia Child',
        bio: 'American chef who brought French cuisine to American kitchens through her cookbook and television shows.',
        imageUrl: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=400&fit=crop&crop=face',
        specialties: 'French, American',
        yearsExperience: 25,
        isVerified: true,
      },
    }),
    prisma.chef.create({
      data: {
        name: 'Nobu Matsuhisa',
        bio: 'Japanese celebrity chef known for his fusion cuisine blending traditional Japanese dishes with Peruvian ingredients.',
        imageUrl: 'https://images.unsplash.com/photo-1566554273541-37a9ca77b91b?w=400&h=400&fit=crop&crop=face',
        specialties: 'Japanese, Fusion, Sushi',
        yearsExperience: 35,
        isVerified: true,
      },
    }),
  ]);

  const ingredients = await Promise.all([
    prisma.ingredient.create({ data: { name: 'Chicken Breast', category: 'PROTEIN', unit: 'g' } }),
    prisma.ingredient.create({ data: { name: 'Salmon Fillet', category: 'PROTEIN', unit: 'g' } }),
    prisma.ingredient.create({ data: { name: 'Ground Beef', category: 'PROTEIN', unit: 'g' } }),
    prisma.ingredient.create({ data: { name: 'Eggs', category: 'PROTEIN', unit: 'pieces' } }),
    prisma.ingredient.create({ data: { name: 'Tomatoes', category: 'VEGETABLE', unit: 'pieces' } }),
    prisma.ingredient.create({ data: { name: 'Onions', category: 'VEGETABLE', unit: 'pieces' } }),
    prisma.ingredient.create({ data: { name: 'Garlic', category: 'VEGETABLE', unit: 'cloves' } }),
    prisma.ingredient.create({ data: { name: 'Bell Peppers', category: 'VEGETABLE', unit: 'pieces' } }),
    prisma.ingredient.create({ data: { name: 'Spinach', category: 'VEGETABLE', unit: 'g' } }),
    prisma.ingredient.create({ data: { name: 'Pasta', category: 'GRAIN', unit: 'g' } }),
    prisma.ingredient.create({ data: { name: 'Rice', category: 'GRAIN', unit: 'cups' } }),
    prisma.ingredient.create({ data: { name: 'Bread', category: 'GRAIN', unit: 'slices' } }),
    prisma.ingredient.create({ data: { name: 'Mozzarella Cheese', category: 'DAIRY', unit: 'g' } }),
    prisma.ingredient.create({ data: { name: 'Parmesan Cheese', category: 'DAIRY', unit: 'g' } }),
    prisma.ingredient.create({ data: { name: 'Heavy Cream', category: 'DAIRY', unit: 'ml' } }),
    prisma.ingredient.create({ data: { name: 'Butter', category: 'DAIRY', unit: 'g' } }),
    prisma.ingredient.create({ data: { name: 'Basil', category: 'HERB', unit: 'g' } }),
    prisma.ingredient.create({ data: { name: 'Oregano', category: 'HERB', unit: 'tsp' } }),
    prisma.ingredient.create({ data: { name: 'Black Pepper', category: 'SPICE', unit: 'tsp' } }),
    prisma.ingredient.create({ data: { name: 'Salt', category: 'SPICE', unit: 'tsp' } }),
    prisma.ingredient.create({ data: { name: 'Olive Oil', category: 'SAUCE', unit: 'tbsp' } }),
    prisma.ingredient.create({ data: { name: 'Tomato Sauce', category: 'SAUCE', unit: 'ml' } })
  ]);

  const recipe1 = await prisma.recipe.create({
    data: {
      title: 'Classic Spaghetti Carbonara',
      description: 'A traditional Italian pasta dish with eggs, cheese, and pancetta. Simple yet elegant.',
      instructions: JSON.stringify([
        'Bring a large pot of salted water to boil and cook spaghetti according to package directions',
        'While pasta cooks, heat olive oil in a large skillet and cook pancetta until crispy',
        'In a bowl, whisk together eggs, parmesan cheese, salt, and black pepper',
        'Drain pasta, reserving 1 cup of pasta water',
        'Add hot pasta to the skillet with pancetta',
        'Remove from heat and quickly stir in egg mixture, adding pasta water as needed',
        'Serve immediately with extra parmesan and black pepper'
      ]),
      prepTime: 15,
      cookTime: 20,
      servings: 4,
      difficulty: 'MEDIUM',
      imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=800&h=600&fit=crop',
      estimatedCalories: 520,
      isPublished: true,
      authorId: chef1.id
    }
  });

  const recipe2 = await prisma.recipe.create({
    data: {
      title: 'Grilled Salmon with Lemon Herbs',
      description: 'Fresh salmon fillet grilled to perfection with aromatic herbs and lemon.',
      instructions: JSON.stringify([
        'Preheat grill to medium-high heat',
        'Pat salmon fillets dry and season with salt and pepper',
        'Brush with olive oil and sprinkle with fresh herbs',
        'Grill salmon for 4-5 minutes per side',
        'Squeeze fresh lemon juice over the fish',
        'Serve with grilled vegetables or rice'
      ]),
      prepTime: 10,
      cookTime: 15,
      servings: 2,
      difficulty: 'EASY',
      imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&h=600&fit=crop',
      estimatedCalories: 280,
      isPublished: true,
      authorId: chef2.id
    }
  });

  const recipe3 = await prisma.recipe.create({
    data: {
      title: 'Chocolate Lava Cake',
      description: 'Decadent individual chocolate cakes with a molten center. Perfect for special occasions.',
      instructions: JSON.stringify([
        'Preheat oven to 425°F (220°C)',
        'Butter and dust ramekins with cocoa powder',
        'Melt chocolate and butter in a double boiler',
        'Whisk in eggs, sugar, and flour until smooth',
        'Divide batter among ramekins',
        'Bake for 12-14 minutes until edges are firm',
        'Let cool for 1 minute, then invert onto plates',
        'Dust with powdered sugar and serve immediately'
      ]),
      prepTime: 20,
      cookTime: 15,
      servings: 4,
      difficulty: 'HARD',
      imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&h=600&fit=crop',
      estimatedCalories: 450,
      isPublished: true,
      authorId: chef2.id
    }
  });

  const recipe4 = await prisma.recipe.create({
    data: {
      title: 'Mediterranean Quinoa Bowl',
      description: 'Healthy and colorful bowl with quinoa, fresh vegetables, and tahini dressing.',
      instructions: JSON.stringify([
        'Cook quinoa according to package instructions',
        'Dice tomatoes, cucumber, and red onion',
        'Prepare tahini dressing with lemon juice and olive oil',
        'Arrange quinoa in bowls',
        'Top with vegetables, olives, and feta cheese',
        'Drizzle with tahini dressing',
        'Garnish with fresh herbs'
      ]),
      prepTime: 15,
      cookTime: 20,
      servings: 2,
      difficulty: Difficulty.EASY,
      imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop',
      estimatedCalories: 380,
      isPublished: true,
      authorId: user1.id
    }
  });

  const [easy, medium, hard, breakfast, lunch, dinner, dessert, italian, asian, mexican, mediterranean, vegetarian, vegan, glutenFree, spicy, sweet, lowCalorie, highProtein] = categories;

  await prisma.recipeCategory.createMany({
    data: [
      { recipeId: recipe1.id, categoryId: medium.id },
      { recipeId: recipe1.id, categoryId: dinner.id },
      { recipeId: recipe1.id, categoryId: italian.id },
      { recipeId: recipe2.id, categoryId: easy.id },
      { recipeId: recipe2.id, categoryId: lunch.id },
      { recipeId: recipe2.id, categoryId: mediterranean.id },
      { recipeId: recipe3.id, categoryId: hard.id },
      { recipeId: recipe3.id, categoryId: dessert.id },
      { recipeId: recipe3.id, categoryId: sweet.id },
      { recipeId: recipe4.id, categoryId: easy.id },
      { recipeId: recipe4.id, categoryId: lunch.id },
      { recipeId: recipe4.id, categoryId: vegetarian.id },
    ],
  });

  const [chickenBreast, salmonFillet, groundBeef, eggs, tomatoes, onions, garlic, bellPeppers, spinach, pasta, rice, bread, mozzarellaCheese, parmesanCheese, heavyCream, butter, basil, oregano, blackPepper, salt, oliveOil, tomatoSauce] = ingredients;

  await prisma.recipeIngredient.createMany({
    data: [
      { recipeId: recipe1.id, ingredientId: pasta.id, quantity: 400 },
      { recipeId: recipe1.id, ingredientId: eggs.id, quantity: 3 },
      { recipeId: recipe1.id, ingredientId: parmesanCheese.id, quantity: 100 },
      { recipeId: recipe1.id, ingredientId: blackPepper.id, quantity: 1 },
      { recipeId: recipe2.id, ingredientId: salmonFillet.id, quantity: 300 },
      { recipeId: recipe2.id, ingredientId: oliveOil.id, quantity: 2 },
      { recipeId: recipe2.id, ingredientId: salt.id, quantity: 1 },
      { recipeId: recipe4.id, ingredientId: rice.id, quantity: 1 },
      { recipeId: recipe4.id, ingredientId: spinach.id, quantity: 100 },
      { recipeId: recipe4.id, ingredientId: tomatoes.id, quantity: 2 },
    ],
  });

  await Promise.all([
    prisma.recipeLike.create({
      data: {
        userId: user1.id,
        recipeId: recipe1.id,
      },
    }),
    prisma.recipeLike.create({
      data: {
        userId: admin.id,
        recipeId: recipe1.id,
      },
    }),
    prisma.recipeLike.create({
      data: {
        userId: chef2.id,
        recipeId: recipe2.id,
      },
    }),
    prisma.comment.create({
      data: {
        content: 'This carbonara recipe is absolutely delicious! The technique for the eggs is perfect.',
        userId: user1.id,
        recipeId: recipe1.id,
      },
    }),
    prisma.comment.create({
      data: {
        content: 'Simple and healthy salmon dish. Great for weeknight dinners!',
        userId: admin.id,
        recipeId: recipe2.id,
      },
    }),
  ]);

  await Promise.all([
    prisma.rating.create({
      data: {
        rating: 5,
        comment: 'Best carbonara recipe I\'ve tried!',
        userId: user1.id,
        recipeId: recipe1.id
      }
    }),
    prisma.rating.create({
      data: {
        rating: 4,
        comment: 'Delicious and healthy option',
        userId: chef1.id,
        recipeId: recipe2.id
      }
    })
  ]);

  logger.info('✅ Database seeded successfully!');
  logger.info(`Created:
  - ${await prisma.user.count()} users
  - ${await prisma.category.count()} categories  
  - ${await prisma.chef.count()} chefs
  - ${await prisma.ingredient.count()} ingredients
  - ${await prisma.recipe.count()} recipes
  - ${await prisma.recipeLike.count()} likes
  - ${await prisma.comment.count()} comments
  - ${await prisma.rating.count()} ratings`);
}

main()
  .catch((e) => {
    logger.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });