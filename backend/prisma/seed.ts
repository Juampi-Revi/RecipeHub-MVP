import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { createLogger } from '../src/config/logger';

// Enum definitions for SQLite
enum UserRole {
  ADMIN = 'ADMIN',
  CHEF = 'CHEF',
  USER = 'USER'
}

enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD'
}

enum Complexity {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD'
}

enum FlavorType {
  SWEET = 'SWEET',
  SAVORY = 'SAVORY'
}

enum MealType {
  BREAKFAST = 'BREAKFAST',
  LUNCH = 'LUNCH',
  SNACK = 'SNACK',
  DINNER = 'DINNER'
}

enum CategoryType {
  DIFFICULTY = 'DIFFICULTY',
  MEAL_TYPE = 'MEAL_TYPE',
  CUISINE = 'CUISINE',
  DIETARY = 'DIETARY',
  FLAVOR = 'FLAVOR',
  CALORIES = 'CALORIES',
  OCCASION = 'OCCASION'
}

enum IngredientCategory {
  PROTEIN = 'PROTEIN',
  VEGETABLE = 'VEGETABLE',
  FRUIT = 'FRUIT',
  GRAIN = 'GRAIN',
  DAIRY = 'DAIRY',
  SPICE = 'SPICE',
  HERB = 'HERB',
  SAUCE = 'SAUCE',
  OTHER = 'OTHER'
}

const prisma = new PrismaClient();
const logger = createLogger();

async function main() {
  logger.info('🌱 Starting database seed...');

  // Clean existing data
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
  
  // Create Users
  const admin = await prisma.user.create({
    data: {
      email: 'admin@recipehub.com',
      name: 'Admin User',
      password: hashedPassword,
      role: UserRole.ADMIN,
      bio: 'Platform administrator and food enthusiast',
      avatar: 'https://picsum.photos/800/600?random=11'
    }
  });

  const chef1 = await prisma.user.create({
    data: {
      email: 'maria.gonzalez@chef.com',
      name: 'María González',
      password: hashedPassword,
      role: UserRole.CHEF,
      bio: 'Professional chef specializing in Mediterranean cuisine',
      avatar: 'https://picsum.photos/800/600?random=12'
    }
  });

  const chef2 = await prisma.user.create({
    data: {
      email: 'carlos.rodriguez@chef.com',
      name: 'Carlos Rodríguez',
      password: hashedPassword,
      role: UserRole.CHEF,
      bio: 'Pastry chef and dessert specialist',
      avatar: 'https://picsum.photos/800/600?random=13'
    }
  });

  const user1 = await prisma.user.create({
    data: {
      email: 'ana.lopez@user.com',
      name: 'Ana López',
      password: hashedPassword,
      role: UserRole.USER,
      bio: 'Home cooking enthusiast and food blogger',
      avatar: 'https://picsum.photos/800/600?random=14'
    }
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'pedro.martinez@user.com',
      name: 'Pedro Martínez',
      password: hashedPassword,
      role: UserRole.USER,
      bio: 'Fitness enthusiast who loves healthy cooking',
      avatar: 'https://picsum.photos/800/600?random=15'
    }
  });

  // Create Categories
  const categories = await Promise.all([
    // Meal Type Categories
    prisma.category.create({
      data: {
        name: 'Breakfast',
        description: 'Morning meals and breakfast dishes',
        type: CategoryType.MEAL_TYPE,
        color: '#FFA500'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Lunch',
        description: 'Midday meals and light dishes',
        type: CategoryType.MEAL_TYPE,
        color: '#32CD32'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Dinner',
        description: 'Evening meals and hearty dishes',
        type: CategoryType.MEAL_TYPE,
        color: '#4169E1'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Snacks',
        description: 'Quick bites and appetizers',
        type: CategoryType.MEAL_TYPE,
        color: '#FFD700'
      }
    }),
    
    // Flavor Categories
    prisma.category.create({
      data: {
        name: 'Desserts',
        description: 'Sweet treats and desserts',
        type: CategoryType.FLAVOR,
        color: '#FF69B4'
      }
    }),
    
    // Dietary Categories
    prisma.category.create({
      data: {
        name: 'Healthy',
        description: 'Low-calorie and nutritious dishes',
        type: CategoryType.DIETARY,
        color: '#90EE90'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Vegetarian',
        description: 'Plant-based dishes without meat',
        type: CategoryType.DIETARY,
        color: '#228B22'
      }
    }),
    
    // Difficulty Categories
    prisma.category.create({
      data: {
        name: 'Easy',
        description: 'Simple recipes for beginners',
        type: CategoryType.DIFFICULTY,
        color: '#98FB98'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Medium',
        description: 'Intermediate cooking skills required',
        type: CategoryType.DIFFICULTY,
        color: '#FFD700'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Hard',
        description: 'Advanced cooking techniques',
        type: CategoryType.DIFFICULTY,
        color: '#FF6347'
      }
    }),
    
    // Cuisine Categories
    prisma.category.create({
      data: {
        name: 'Italian',
        description: 'Traditional Italian cuisine',
        type: CategoryType.CUISINE,
        color: '#DC143C'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Mediterranean',
        description: 'Mediterranean-style dishes',
        type: CategoryType.CUISINE,
        color: '#4682B4'
      }
    }),
    prisma.category.create({
      data: {
        name: 'American',
        description: 'Classic American dishes',
        type: CategoryType.CUISINE,
        color: '#B22222'
      }
    })
  ]);

  // Create Chefs
  const chefs = await Promise.all([
    prisma.chef.create({
      data: {
        name: 'Gordon Ramsay',
        bio: 'World-renowned chef and restaurateur',
        imageUrl: 'https://picsum.photos/800/600?random=16',
        specialties: 'Fine dining, British cuisine',
        yearsExperience: 30,
        isVerified: true
      }
    }),
    prisma.chef.create({
      data: {
        name: 'Julia Child',
        bio: 'Legendary French cuisine expert',
        imageUrl: 'https://picsum.photos/800/600?random=17',
        specialties: 'French cuisine, Classic techniques',
        yearsExperience: 40,
        isVerified: true
      }
    })
  ]);

  // Create Ingredients
  const ingredients = await Promise.all([
    // Proteins
    prisma.ingredient.create({ data: { name: 'Chicken Breast', category: IngredientCategory.PROTEIN, unit: 'g' } }),
    prisma.ingredient.create({ data: { name: 'Salmon', category: IngredientCategory.PROTEIN, unit: 'g' } }),
    prisma.ingredient.create({ data: { name: 'Eggs', category: IngredientCategory.PROTEIN, unit: 'piece' } }),
    prisma.ingredient.create({ data: { name: 'Ground Beef', category: IngredientCategory.PROTEIN, unit: 'g' } }),
    prisma.ingredient.create({ data: { name: 'Tofu', category: IngredientCategory.PROTEIN, unit: 'g' } }),
    prisma.ingredient.create({ data: { name: 'Shrimp', category: IngredientCategory.PROTEIN, unit: 'g' } }),
    
    // Vegetables
    prisma.ingredient.create({ data: { name: 'Tomatoes', category: IngredientCategory.VEGETABLE, unit: 'piece' } }),
    prisma.ingredient.create({ data: { name: 'Onions', category: IngredientCategory.VEGETABLE, unit: 'piece' } }),
    prisma.ingredient.create({ data: { name: 'Bell Peppers', category: IngredientCategory.VEGETABLE, unit: 'piece' } }),
    prisma.ingredient.create({ data: { name: 'Spinach', category: IngredientCategory.VEGETABLE, unit: 'g' } }),
    prisma.ingredient.create({ data: { name: 'Broccoli', category: IngredientCategory.VEGETABLE, unit: 'g' } }),
    prisma.ingredient.create({ data: { name: 'Carrots', category: IngredientCategory.VEGETABLE, unit: 'piece' } }),
    prisma.ingredient.create({ data: { name: 'Mushrooms', category: IngredientCategory.VEGETABLE, unit: 'g' } }),
    prisma.ingredient.create({ data: { name: 'Avocado', category: IngredientCategory.VEGETABLE, unit: 'piece' } }),
    
    // Grains
    prisma.ingredient.create({ data: { name: 'Rice', category: IngredientCategory.GRAIN, unit: 'g' } }),
    prisma.ingredient.create({ data: { name: 'Pasta', category: IngredientCategory.GRAIN, unit: 'g' } }),
    prisma.ingredient.create({ data: { name: 'Bread', category: IngredientCategory.GRAIN, unit: 'slice' } }),
    prisma.ingredient.create({ data: { name: 'Quinoa', category: IngredientCategory.GRAIN, unit: 'g' } }),
    prisma.ingredient.create({ data: { name: 'Oats', category: IngredientCategory.GRAIN, unit: 'g' } }),
    
    // Dairy
    prisma.ingredient.create({ data: { name: 'Milk', category: IngredientCategory.DAIRY, unit: 'ml' } }),
    prisma.ingredient.create({ data: { name: 'Cheese', category: IngredientCategory.DAIRY, unit: 'g' } }),
    prisma.ingredient.create({ data: { name: 'Butter', category: IngredientCategory.DAIRY, unit: 'g' } }),
    prisma.ingredient.create({ data: { name: 'Yogurt', category: IngredientCategory.DAIRY, unit: 'g' } }),
    
    // Fruits
    prisma.ingredient.create({ data: { name: 'Bananas', category: IngredientCategory.FRUIT, unit: 'piece' } }),
    prisma.ingredient.create({ data: { name: 'Apples', category: IngredientCategory.FRUIT, unit: 'piece' } }),
    prisma.ingredient.create({ data: { name: 'Berries', category: IngredientCategory.FRUIT, unit: 'g' } }),
    prisma.ingredient.create({ data: { name: 'Lemons', category: IngredientCategory.FRUIT, unit: 'piece' } }),
    
    // Spices & Herbs
    prisma.ingredient.create({ data: { name: 'Salt', category: IngredientCategory.SPICE, unit: 'tsp' } }),
    prisma.ingredient.create({ data: { name: 'Black Pepper', category: IngredientCategory.SPICE, unit: 'tsp' } }),
    prisma.ingredient.create({ data: { name: 'Garlic', category: IngredientCategory.HERB, unit: 'clove' } }),
    prisma.ingredient.create({ data: { name: 'Basil', category: IngredientCategory.HERB, unit: 'g' } }),
    prisma.ingredient.create({ data: { name: 'Oregano', category: IngredientCategory.HERB, unit: 'tsp' } }),
    
    // Others
    prisma.ingredient.create({ data: { name: 'Olive Oil', category: IngredientCategory.OTHER, unit: 'tbsp' } }),
    prisma.ingredient.create({ data: { name: 'Flour', category: IngredientCategory.OTHER, unit: 'g' } }),
    prisma.ingredient.create({ data: { name: 'Sugar', category: IngredientCategory.OTHER, unit: 'g' } }),
    prisma.ingredient.create({ data: { name: 'Honey', category: IngredientCategory.OTHER, unit: 'tbsp' } })
  ]);

  // Create 30+ Recipes with proper categorization
  const recipes = [
    // BREAKFAST RECIPES
    {
      title: 'Classic Pancakes',
      description: 'Fluffy American-style pancakes perfect for weekend mornings.',
      instructions: JSON.stringify([
        'Mix flour, sugar, baking powder, and salt in a bowl',
        'In another bowl, whisk milk, eggs, and melted butter',
        'Combine wet and dry ingredients until just mixed',
        'Cook on griddle until bubbles form, then flip',
        'Serve hot with syrup and butter'
      ]),
      prepTime: 10,
      cookTime: 15,
      servings: 4,
      difficulty: Difficulty.EASY,
      complexity: Complexity.EASY,
      flavorType: FlavorType.SWEET,
      mealType: MealType.BREAKFAST,
      isLowCalorie: false,
      estimatedCalories: 320,
      imageUrl: 'https://picsum.photos/800/600?random=18',
      authorId: user1.id
    },
    {
      title: 'Avocado Toast',
      description: 'Healthy and delicious avocado toast with a perfect poached egg.',
      instructions: JSON.stringify([
        'Toast bread slices until golden brown',
        'Mash ripe avocado with lime juice and salt',
        'Spread avocado mixture on toast',
        'Top with poached egg and black pepper',
        'Garnish with herbs if desired'
      ]),
      prepTime: 5,
      cookTime: 10,
      servings: 2,
      difficulty: Difficulty.EASY,
      complexity: Complexity.EASY,
      flavorType: FlavorType.SAVORY,
      mealType: MealType.BREAKFAST,
      isLowCalorie: true,
      estimatedCalories: 280,
      imageUrl: 'https://images.pexels.com/photos/1351238/pexels-photo-1351238.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      authorId: user2.id
    },
    {
      title: 'Overnight Oats',
      description: 'Nutritious make-ahead breakfast with oats, yogurt, and fresh berries.',
      instructions: JSON.stringify([
        'Mix oats, yogurt, and milk in a jar',
        'Add honey and vanilla extract',
        'Stir in chia seeds if using',
        'Refrigerate overnight',
        'Top with fresh berries before serving'
      ]),
      prepTime: 5,
      cookTime: 0,
      servings: 1,
      difficulty: Difficulty.EASY,
      complexity: Complexity.EASY,
      flavorType: FlavorType.SWEET,
      mealType: MealType.BREAKFAST,
      isLowCalorie: true,
      estimatedCalories: 250,
      imageUrl: 'https://picsum.photos/800/600?random=20',
      authorId: user2.id
    },
    {
      title: 'French Toast',
      description: 'Classic French toast with cinnamon and vanilla, perfect for special mornings.',
      instructions: JSON.stringify([
        'Whisk eggs, milk, vanilla, and cinnamon',
        'Dip bread slices in egg mixture',
        'Cook in buttered pan until golden',
        'Flip and cook other side',
        'Serve with maple syrup and powdered sugar'
      ]),
      prepTime: 10,
      cookTime: 15,
      servings: 4,
      difficulty: Difficulty.EASY,
      complexity: Complexity.EASY,
      flavorType: FlavorType.SWEET,
      mealType: MealType.BREAKFAST,
      isLowCalorie: false,
      estimatedCalories: 380,
      imageUrl: 'https://picsum.photos/800/600?random=21',
      authorId: chef2.id
    },
    {
      title: 'Breakfast Burrito',
      description: 'Hearty breakfast burrito with scrambled eggs, cheese, and vegetables.',
      instructions: JSON.stringify([
        'Scramble eggs with salt and pepper',
        'Sauté bell peppers and onions',
        'Warm tortillas in microwave',
        'Fill with eggs, vegetables, and cheese',
        'Roll tightly and serve immediately'
      ]),
      prepTime: 10,
      cookTime: 15,
      servings: 2,
      difficulty: Difficulty.EASY,
      complexity: Complexity.MEDIUM,
      flavorType: FlavorType.SAVORY,
      mealType: MealType.BREAKFAST,
      isLowCalorie: false,
      estimatedCalories: 450,
      imageUrl: 'https://picsum.photos/800/600?random=22',
      authorId: user1.id
    },

    // LUNCH RECIPES
    {
      title: 'Caesar Salad',
      description: 'Classic Caesar salad with crispy croutons and parmesan cheese.',
      instructions: JSON.stringify([
        'Wash and chop romaine lettuce',
        'Make dressing with anchovies, garlic, and lemon',
        'Toss lettuce with dressing',
        'Add croutons and parmesan cheese',
        'Serve immediately'
      ]),
      prepTime: 15,
      cookTime: 0,
      servings: 4,
      difficulty: Difficulty.EASY,
      complexity: Complexity.EASY,
      flavorType: FlavorType.SAVORY,
      mealType: MealType.LUNCH,
      isLowCalorie: true,
      estimatedCalories: 220,
      imageUrl: 'https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      authorId: chef1.id
    },
    {
      title: 'Grilled Chicken Sandwich',
      description: 'Juicy grilled chicken breast sandwich with fresh vegetables.',
      instructions: JSON.stringify([
        'Season chicken breast with herbs and spices',
        'Grill chicken until cooked through',
        'Toast sandwich buns',
        'Layer with lettuce, tomato, and chicken',
        'Add your favorite condiments'
      ]),
      prepTime: 10,
      cookTime: 20,
      servings: 2,
      difficulty: Difficulty.EASY,
      complexity: Complexity.MEDIUM,
      flavorType: FlavorType.SAVORY,
      mealType: MealType.LUNCH,
      isLowCalorie: false,
      estimatedCalories: 420,
      imageUrl: 'https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      authorId: user1.id
    },
    {
      title: 'Quinoa Buddha Bowl',
      description: 'Nutritious bowl with quinoa, roasted vegetables, and tahini dressing.',
      instructions: JSON.stringify([
        'Cook quinoa according to package instructions',
        'Roast vegetables with olive oil and seasonings',
        'Prepare tahini dressing with lemon and garlic',
        'Arrange quinoa and vegetables in bowls',
        'Drizzle with dressing and serve'
      ]),
      prepTime: 15,
      cookTime: 25,
      servings: 2,
      difficulty: Difficulty.EASY,
      complexity: Complexity.MEDIUM,
      flavorType: FlavorType.SAVORY,
      mealType: MealType.LUNCH,
      isLowCalorie: true,
      estimatedCalories: 380,
      imageUrl: 'https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      authorId: user2.id
    },
    {
      title: 'Tomato Basil Soup',
      description: 'Creamy tomato soup with fresh basil, perfect for cold days.',
      instructions: JSON.stringify([
        'Sauté onions and garlic in olive oil',
        'Add canned tomatoes and vegetable broth',
        'Simmer for 20 minutes',
        'Blend until smooth',
        'Stir in cream and fresh basil'
      ]),
      prepTime: 10,
      cookTime: 30,
      servings: 4,
      difficulty: Difficulty.EASY,
      complexity: Complexity.EASY,
      flavorType: FlavorType.SAVORY,
      mealType: MealType.LUNCH,
      isLowCalorie: true,
      estimatedCalories: 180,
      imageUrl: 'https://images.pexels.com/photos/539451/pexels-photo-539451.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      authorId: chef1.id
    },
    {
      title: 'Caprese Salad',
      description: 'Fresh mozzarella, tomatoes, and basil drizzled with balsamic glaze.',
      instructions: JSON.stringify([
        'Slice fresh mozzarella and tomatoes',
        'Arrange alternating on a plate',
        'Add fresh basil leaves',
        'Drizzle with olive oil and balsamic glaze',
        'Season with salt and pepper'
      ]),
      prepTime: 10,
      cookTime: 0,
      servings: 2,
      difficulty: Difficulty.EASY,
      complexity: Complexity.EASY,
      flavorType: FlavorType.SAVORY,
      mealType: MealType.LUNCH,
      isLowCalorie: true,
      estimatedCalories: 250,
      imageUrl: 'https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      authorId: chef1.id
    },

    // DINNER RECIPES
    {
      title: 'Spaghetti Carbonara',
      description: 'Classic Italian pasta with eggs, cheese, and pancetta.',
      instructions: JSON.stringify([
        'Cook spaghetti in salted boiling water',
        'Fry pancetta until crispy',
        'Whisk eggs with parmesan cheese',
        'Toss hot pasta with egg mixture',
        'Add pancetta and black pepper'
      ]),
      prepTime: 10,
      cookTime: 20,
      servings: 4,
      difficulty: Difficulty.MEDIUM,
      complexity: Complexity.MEDIUM,
      flavorType: FlavorType.SAVORY,
      mealType: MealType.DINNER,
      isLowCalorie: false,
      estimatedCalories: 520,
      imageUrl: 'https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      authorId: chef1.id
    },
    {
      title: 'Grilled Salmon',
      description: 'Perfectly grilled salmon with lemon and herbs.',
      instructions: JSON.stringify([
        'Season salmon fillets with salt and pepper',
        'Brush with olive oil and lemon juice',
        'Grill for 4-5 minutes per side',
        'Garnish with fresh herbs',
        'Serve with vegetables'
      ]),
      prepTime: 10,
      cookTime: 15,
      servings: 4,
      difficulty: Difficulty.EASY,
      complexity: Complexity.MEDIUM,
      flavorType: FlavorType.SAVORY,
      mealType: MealType.DINNER,
      isLowCalorie: true,
      estimatedCalories: 320,
      imageUrl: 'https://images.pexels.com/photos/3622643/pexels-photo-3622643.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      authorId: chef1.id
    },
    {
      title: 'Beef Stir Fry',
      description: 'Quick and flavorful beef stir fry with mixed vegetables.',
      instructions: JSON.stringify([
        'Slice beef into thin strips',
        'Heat oil in wok or large pan',
        'Stir fry beef until browned',
        'Add vegetables and cook until tender-crisp',
        'Toss with sauce and serve over rice'
      ]),
      prepTime: 15,
      cookTime: 15,
      servings: 4,
      difficulty: Difficulty.EASY,
      complexity: Complexity.MEDIUM,
      flavorType: FlavorType.SAVORY,
      mealType: MealType.DINNER,
      isLowCalorie: false,
      estimatedCalories: 420,
      imageUrl: 'https://images.pexels.com/photos/2456435/pexels-photo-2456435.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      authorId: user1.id
    },
    {
      title: 'Chicken Parmesan',
      description: 'Breaded chicken breast topped with marinara sauce and cheese.',
      instructions: JSON.stringify([
        'Pound chicken breasts to even thickness',
        'Bread with flour, egg, and breadcrumbs',
        'Pan fry until golden brown',
        'Top with marinara sauce and mozzarella',
        'Bake until cheese melts'
      ]),
      prepTime: 20,
      cookTime: 30,
      servings: 4,
      difficulty: Difficulty.MEDIUM,
      complexity: Complexity.MEDIUM,
      flavorType: FlavorType.SAVORY,
      mealType: MealType.DINNER,
      isLowCalorie: false,
      estimatedCalories: 480,
      imageUrl: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      authorId: chef2.id
    },
    {
      title: 'Vegetable Curry',
      description: 'Aromatic vegetable curry with coconut milk and spices.',
      instructions: JSON.stringify([
        'Sauté onions, garlic, and ginger',
        'Add curry spices and cook until fragrant',
        'Add vegetables and coconut milk',
        'Simmer until vegetables are tender',
        'Serve with rice and fresh cilantro'
      ]),
      prepTime: 15,
      cookTime: 25,
      servings: 4,
      difficulty: Difficulty.MEDIUM,
      complexity: Complexity.MEDIUM,
      flavorType: FlavorType.SAVORY,
      mealType: MealType.DINNER,
      isLowCalorie: true,
      estimatedCalories: 280,
      imageUrl: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      authorId: user2.id
    },
    {
      title: 'Mushroom Risotto',
      description: 'Creamy Italian risotto with mixed mushrooms and parmesan.',
      instructions: JSON.stringify([
        'Heat mushroom stock in a saucepan',
        'Sauté mushrooms until golden',
        'Cook onions until translucent',
        'Add arborio rice and stir for 2 minutes',
        'Add stock gradually, stirring constantly'
      ]),
      prepTime: 15,
      cookTime: 35,
      servings: 4,
      difficulty: Difficulty.HARD,
      complexity: Complexity.HARD,
      flavorType: FlavorType.SAVORY,
      mealType: MealType.DINNER,
      isLowCalorie: false,
      estimatedCalories: 380,
      imageUrl: 'https://images.pexels.com/photos/1640771/pexels-photo-1640771.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      authorId: chef1.id
    },

    // SNACK RECIPES
    {
      title: 'Hummus with Vegetables',
      description: 'Creamy homemade hummus served with fresh cut vegetables.',
      instructions: JSON.stringify([
        'Blend chickpeas, tahini, lemon juice, and garlic',
        'Add olive oil gradually while blending',
        'Season with salt and cumin',
        'Cut vegetables into sticks',
        'Serve hummus with vegetable sticks'
      ]),
      prepTime: 15,
      cookTime: 0,
      servings: 4,
      difficulty: Difficulty.EASY,
      complexity: Complexity.EASY,
      flavorType: FlavorType.SAVORY,
      mealType: MealType.SNACK,
      isLowCalorie: true,
      estimatedCalories: 180,
      imageUrl: 'https://images.pexels.com/photos/1640773/pexels-photo-1640773.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      authorId: user2.id
    },
    {
      title: 'Fruit Smoothie',
      description: 'Refreshing mixed berry smoothie with yogurt and honey.',
      instructions: JSON.stringify([
        'Add frozen berries to blender',
        'Add yogurt, milk, and honey',
        'Blend until smooth',
        'Add ice if needed for consistency',
        'Pour into glasses and serve immediately'
      ]),
      prepTime: 5,
      cookTime: 0,
      servings: 2,
      difficulty: Difficulty.EASY,
      complexity: Complexity.EASY,
      flavorType: FlavorType.SWEET,
      mealType: MealType.SNACK,
      isLowCalorie: true,
      estimatedCalories: 150,
      imageUrl: 'https://images.pexels.com/photos/775032/pexels-photo-775032.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      authorId: user2.id
    },
    {
      title: 'Cheese Quesadilla',
      description: 'Quick and easy cheese quesadilla perfect for snacking.',
      instructions: JSON.stringify([
        'Place cheese between two tortillas',
        'Cook in a dry pan until golden',
        'Flip carefully and cook other side',
        'Cut into wedges',
        'Serve with salsa and sour cream'
      ]),
      prepTime: 5,
      cookTime: 10,
      servings: 2,
      difficulty: Difficulty.EASY,
      complexity: Complexity.EASY,
      flavorType: FlavorType.SAVORY,
      mealType: MealType.SNACK,
      isLowCalorie: false,
      estimatedCalories: 320,
      imageUrl: 'https://images.pexels.com/photos/2092507/pexels-photo-2092507.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      authorId: user1.id
    },

    // DESSERT RECIPES
    {
      title: 'Chocolate Chip Cookies',
      description: 'Classic homemade chocolate chip cookies, crispy outside and chewy inside.',
      instructions: JSON.stringify([
        'Cream butter and sugars together',
        'Beat in eggs and vanilla',
        'Mix in flour, baking soda, and salt',
        'Fold in chocolate chips',
        'Bake at 375°F for 9-11 minutes'
      ]),
      prepTime: 15,
      cookTime: 25,
      servings: 24,
      difficulty: Difficulty.EASY,
      complexity: Complexity.EASY,
      flavorType: FlavorType.SWEET,
      mealType: MealType.SNACK,
      isLowCalorie: false,
      estimatedCalories: 180,
      imageUrl: 'https://images.pexels.com/photos/230325/pexels-photo-230325.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      authorId: chef2.id
    },
    {
      title: 'Tiramisu',
      description: 'Classic Italian dessert with coffee-soaked ladyfingers and mascarpone.',
      instructions: JSON.stringify([
        'Prepare strong espresso and let cool',
        'Whisk egg yolks with sugar until pale',
        'Fold in mascarpone cheese',
        'Dip ladyfingers in coffee and layer',
        'Refrigerate for at least 4 hours'
      ]),
      prepTime: 30,
      cookTime: 0,
      servings: 8,
      difficulty: Difficulty.MEDIUM,
      complexity: Complexity.MEDIUM,
      flavorType: FlavorType.SWEET,
      mealType: MealType.SNACK,
      isLowCalorie: false,
      estimatedCalories: 420,
      imageUrl: 'https://images.pexels.com/photos/3026804/pexels-photo-3026804.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      authorId: chef2.id
    },
    {
      title: 'Apple Pie',
      description: 'Traditional apple pie with flaky crust and cinnamon-spiced filling.',
      instructions: JSON.stringify([
        'Prepare pie crust and roll out',
        'Slice apples and toss with sugar and spices',
        'Fill bottom crust with apple mixture',
        'Cover with top crust and seal edges',
        'Bake at 425°F for 45-50 minutes'
      ]),
      prepTime: 45,
      cookTime: 50,
      servings: 8,
      difficulty: Difficulty.HARD,
      complexity: Complexity.HARD,
      flavorType: FlavorType.SWEET,
      mealType: MealType.SNACK,
      isLowCalorie: false,
      estimatedCalories: 380,
      imageUrl: 'https://images.pexels.com/photos/1070850/pexels-photo-1070850.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      authorId: chef2.id
    },
    {
      title: 'Chocolate Brownies',
      description: 'Fudgy chocolate brownies with a rich, dense texture.',
      instructions: JSON.stringify([
        'Melt chocolate and butter together',
        'Whisk in sugar and eggs',
        'Fold in flour and cocoa powder',
        'Pour into greased pan',
        'Bake at 350°F for 25-30 minutes'
      ]),
      prepTime: 15,
      cookTime: 30,
      servings: 16,
      difficulty: Difficulty.EASY,
      complexity: Complexity.EASY,
      flavorType: FlavorType.SWEET,
      mealType: MealType.SNACK,
      isLowCalorie: false,
      estimatedCalories: 280,
      imageUrl: 'https://images.pexels.com/photos/887853/pexels-photo-887853.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      authorId: chef2.id
    },
    {
      title: 'Lemon Bars',
      description: 'Tangy lemon bars with a buttery shortbread crust.',
      instructions: JSON.stringify([
        'Make shortbread crust and bake',
        'Whisk eggs, sugar, and lemon juice',
        'Add flour and lemon zest',
        'Pour over baked crust',
        'Bake until set and dust with powdered sugar'
      ]),
      prepTime: 20,
      cookTime: 45,
      servings: 12,
      difficulty: Difficulty.MEDIUM,
      complexity: Complexity.MEDIUM,
      flavorType: FlavorType.SWEET,
      mealType: MealType.SNACK,
      isLowCalorie: false,
      estimatedCalories: 220,
      imageUrl: 'https://images.pexels.com/photos/1070850/pexels-photo-1070850.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      authorId: chef2.id
    },

    // ADDITIONAL HEALTHY OPTIONS
    {
      title: 'Greek Yogurt Parfait',
      description: 'Layered parfait with Greek yogurt, berries, and granola.',
      instructions: JSON.stringify([
        'Layer Greek yogurt in glasses',
        'Add fresh berries',
        'Sprinkle with granola',
        'Repeat layers',
        'Drizzle with honey if desired'
      ]),
      prepTime: 5,
      cookTime: 0,
      servings: 2,
      difficulty: Difficulty.EASY,
      complexity: Complexity.EASY,
      flavorType: FlavorType.SWEET,
      mealType: MealType.BREAKFAST,
      isLowCalorie: true,
      estimatedCalories: 200,
      imageUrl: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      authorId: user2.id
    },
    {
      title: 'Zucchini Noodles',
      description: 'Light and healthy zucchini noodles with pesto sauce.',
      instructions: JSON.stringify([
        'Spiralize zucchini into noodles',
        'Sauté briefly in olive oil',
        'Prepare basil pesto sauce',
        'Toss noodles with pesto',
        'Garnish with parmesan cheese'
      ]),
      prepTime: 15,
      cookTime: 10,
      servings: 2,
      difficulty: Difficulty.EASY,
      complexity: Complexity.MEDIUM,
      flavorType: FlavorType.SAVORY,
      mealType: MealType.LUNCH,
      isLowCalorie: true,
      estimatedCalories: 180,
      imageUrl: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      authorId: user2.id
    },
    {
      title: 'Stuffed Bell Peppers',
      description: 'Colorful bell peppers stuffed with quinoa, vegetables, and herbs.',
      instructions: JSON.stringify([
        'Cut tops off bell peppers and remove seeds',
        'Cook quinoa with vegetable broth',
        'Sauté onions, garlic, and vegetables',
        'Mix quinoa with vegetables and herbs',
        'Stuff peppers and bake until tender'
      ]),
      prepTime: 20,
      cookTime: 35,
      servings: 4,
      difficulty: Difficulty.MEDIUM,
      complexity: Complexity.MEDIUM,
      flavorType: FlavorType.SAVORY,
      mealType: MealType.DINNER,
      isLowCalorie: true,
      estimatedCalories: 220,
      imageUrl: 'https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      authorId: user2.id
    },
    {
      title: 'Shrimp Tacos',
      description: 'Fresh shrimp tacos with cabbage slaw and lime crema.',
      instructions: JSON.stringify([
        'Season shrimp with chili powder and cumin',
        'Grill shrimp until pink and cooked through',
        'Make cabbage slaw with lime dressing',
        'Prepare lime crema with sour cream',
        'Assemble tacos with all components'
      ]),
      prepTime: 15,
      cookTime: 10,
      servings: 4,
      difficulty: Difficulty.EASY,
      complexity: Complexity.MEDIUM,
      flavorType: FlavorType.SAVORY,
      mealType: MealType.LUNCH,
      isLowCalorie: true,
      estimatedCalories: 280,
      imageUrl: 'https://images.pexels.com/photos/2092507/pexels-photo-2092507.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      authorId: chef1.id
    },
    {
      title: 'Chia Pudding',
      description: 'Nutritious chia seed pudding with coconut milk and fresh fruit.',
      instructions: JSON.stringify([
        'Mix chia seeds with coconut milk',
        'Add vanilla and sweetener',
        'Stir well and refrigerate overnight',
        'Stir again in the morning',
        'Top with fresh fruit and nuts'
      ]),
      prepTime: 5,
      cookTime: 0,
      servings: 2,
      difficulty: Difficulty.EASY,
      complexity: Complexity.EASY,
      flavorType: FlavorType.SWEET,
      mealType: MealType.BREAKFAST,
      isLowCalorie: true,
      estimatedCalories: 180,
      imageUrl: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      authorId: user2.id
    },
    {
      title: 'Mediterranean Wrap',
      description: 'Fresh wrap with hummus, vegetables, and feta cheese.',
      instructions: JSON.stringify([
        'Spread hummus on large tortilla',
        'Layer with lettuce, tomatoes, and cucumbers',
        'Add red onion and bell peppers',
        'Sprinkle with feta cheese and olives',
        'Roll tightly and slice in half'
      ]),
      prepTime: 10,
      cookTime: 0,
      servings: 2,
      difficulty: Difficulty.EASY,
      complexity: Complexity.EASY,
      flavorType: FlavorType.SAVORY,
      mealType: MealType.LUNCH,
      isLowCalorie: true,
      estimatedCalories: 320,
      imageUrl: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      authorId: user1.id
    }
  ];

  // Create all recipes
  const createdRecipes: any[] = [];
  for (const recipeData of recipes) {
    const recipe = await prisma.recipe.create({
      data: {
        ...recipeData,
        isPublished: true
      }
    });
    createdRecipes.push(recipe);
  }

  // Create recipe-category relationships
  for (let i = 0; i < createdRecipes.length; i++) {
    const recipe = createdRecipes[i];
    const categoriesToAssign: string[] = [];
    
    // Assign meal type categories (0-3)
    if (recipe.mealType === MealType.BREAKFAST) categoriesToAssign.push(categories[0].id);
    else if (recipe.mealType === MealType.LUNCH) categoriesToAssign.push(categories[1].id);
    else if (recipe.mealType === MealType.DINNER) categoriesToAssign.push(categories[2].id);
    else if (recipe.mealType === MealType.SNACK) categoriesToAssign.push(categories[3].id);
    
    // Assign flavor categories (4)
    if (recipe.flavorType === FlavorType.SWEET) {
      categoriesToAssign.push(categories[4].id); // Desserts
    }
    
    // Assign dietary categories (5-6)
    if (recipe.isLowCalorie) {
      categoriesToAssign.push(categories[5].id); // Healthy
    }
    
    // Assign vegetarian category based on recipe title/ingredients
    const vegetarianKeywords = ['avocado', 'quinoa', 'vegetable', 'hummus', 'fruit', 'yogurt', 'oats', 'chia', 'zucchini', 'bell peppers'];
    const isVegetarian = vegetarianKeywords.some(keyword => 
      recipe.title.toLowerCase().includes(keyword) || 
      recipe.description.toLowerCase().includes(keyword)
    );
    if (isVegetarian) {
      categoriesToAssign.push(categories[6].id); // Vegetarian
    }
    
    // Assign difficulty categories (7-9)
    if (recipe.difficulty === Difficulty.EASY) categoriesToAssign.push(categories[7].id);
    else if (recipe.difficulty === Difficulty.MEDIUM) categoriesToAssign.push(categories[8].id);
    else if (recipe.difficulty === Difficulty.HARD) categoriesToAssign.push(categories[9].id);
    
    // Assign cuisine categories (10-12)
    const italianKeywords = ['pasta', 'spaghetti', 'carbonara', 'parmesan', 'risotto', 'tiramisu'];
    const mediterraneanKeywords = ['hummus', 'olive', 'feta', 'mediterranean', 'caprese'];
    const americanKeywords = ['pancakes', 'burger', 'sandwich', 'brownies', 'cookies', 'french toast'];
    
    if (italianKeywords.some(keyword => recipe.title.toLowerCase().includes(keyword))) {
      categoriesToAssign.push(categories[10].id); // Italian
    } else if (mediterraneanKeywords.some(keyword => recipe.title.toLowerCase().includes(keyword))) {
      categoriesToAssign.push(categories[11].id); // Mediterranean
    } else if (americanKeywords.some(keyword => recipe.title.toLowerCase().includes(keyword))) {
      categoriesToAssign.push(categories[12].id); // American
    }
    
    // Create category relationships
    for (const categoryId of categoriesToAssign) {
      await prisma.recipeCategory.create({
        data: {
          recipeId: recipe.id,
          categoryId: categoryId
        }
      });
    }
  }

  // Create recipe-chef relationships
  for (let i = 0; i < Math.min(createdRecipes.length, 10); i++) {
    await prisma.recipeChef.create({
      data: {
        recipeId: createdRecipes[i].id,
        chefId: chefs[i % chefs.length].id
      }
    });
  }

  // Create sample recipe ingredients (simplified for brevity)
  const sampleIngredients = [
    { recipeIndex: 0, ingredientIndex: 33, quantity: 200, unit: 'g' }, // Pancakes - Flour
    { recipeIndex: 0, ingredientIndex: 34, quantity: 50, unit: 'g' }, // Pancakes - Sugar
    { recipeIndex: 1, ingredientIndex: 13, quantity: 1, unit: 'piece' }, // Avocado Toast - Avocado
    { recipeIndex: 1, ingredientIndex: 16, quantity: 2, unit: 'slice' }, // Avocado Toast - Bread
  ];

  for (const ing of sampleIngredients) {
    if (createdRecipes[ing.recipeIndex] && ingredients[ing.ingredientIndex]) {
      await prisma.recipeIngredient.create({
        data: {
          recipeId: createdRecipes[ing.recipeIndex].id,
          ingredientId: ingredients[ing.ingredientIndex].id,
          quantity: ing.quantity,
          unit: ing.unit
        }
      });
    }
  }

  // Create recipe steps with images for selected recipes
  const recipeStepsData = [
    // Pancakes (recipe index 0)
    {
      recipeIndex: 0,
      steps: [
        {
          stepNumber: 1,
          instruction: 'In a large bowl, whisk together flour, sugar, baking powder, and salt.',
          imageUrl: 'https://images.pexels.com/photos/4198019/pexels-photo-4198019.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
          duration: 2
        },
        {
          stepNumber: 2,
          instruction: 'In another bowl, beat the eggs and then whisk in milk and melted butter.',
          imageUrl: 'https://images.pexels.com/photos/4198020/pexels-photo-4198020.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
          duration: 3
        },
        {
          stepNumber: 3,
          instruction: 'Pour the wet ingredients into the dry ingredients and stir until just combined. Do not overmix.',
          imageUrl: 'https://images.pexels.com/photos/4198021/pexels-photo-4198021.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
          duration: 2
        },
        {
          stepNumber: 4,
          instruction: 'Heat a lightly oiled griddle or frying pan over medium-high heat.',
          imageUrl: 'https://images.pexels.com/photos/4198022/pexels-photo-4198022.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
          duration: 2
        },
        {
          stepNumber: 5,
          instruction: 'Pour 1/4 cup of batter onto the griddle for each pancake. Cook until bubbles form on surface, then flip.',
          imageUrl: 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
          duration: 4
        },
        {
          stepNumber: 6,
          instruction: 'Cook until golden brown on both sides. Serve hot with maple syrup.',
          imageUrl: 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
          duration: 3
        }
      ]
    },
    // Avocado Toast (recipe index 1)
    {
      recipeIndex: 1,
      steps: [
        {
          stepNumber: 1,
          instruction: 'Toast the bread slices until golden brown and crispy.',
          imageUrl: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
          duration: 3
        },
        {
          stepNumber: 2,
          instruction: 'Cut the avocado in half, remove the pit, and scoop the flesh into a bowl.',
          imageUrl: 'https://images.pexels.com/photos/557659/pexels-photo-557659.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
          duration: 2
        },
        {
          stepNumber: 3,
          instruction: 'Mash the avocado with a fork and season with salt, pepper, and lemon juice.',
          imageUrl: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
          duration: 2
        },
        {
          stepNumber: 4,
          instruction: 'Spread the mashed avocado evenly on the toasted bread.',
          imageUrl: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
          duration: 1
        },
        {
          stepNumber: 5,
          instruction: 'Top with sliced tomatoes, red pepper flakes, and a drizzle of olive oil. Serve immediately.',
          imageUrl: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
          duration: 2
        }
      ]
    },
    // Spaghetti Carbonara (recipe index 2)
    {
      recipeIndex: 2,
      steps: [
        {
          stepNumber: 1,
          instruction: 'Bring a large pot of salted water to boil and cook spaghetti according to package directions.',
          imageUrl: 'https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
          duration: 10
        },
        {
          stepNumber: 2,
          instruction: 'While pasta cooks, heat a large skillet over medium heat and cook pancetta until crispy.',
          imageUrl: 'https://images.pexels.com/photos/4518844/pexels-photo-4518844.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
          duration: 5
        },
        {
          stepNumber: 3,
          instruction: 'In a bowl, whisk together eggs, grated Parmesan cheese, and black pepper.',
          imageUrl: 'https://images.pexels.com/photos/4518845/pexels-photo-4518845.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
          duration: 2
        },
        {
          stepNumber: 4,
          instruction: 'Drain pasta, reserving 1 cup of pasta water. Add hot pasta to the skillet with pancetta.',
          imageUrl: 'https://images.pexels.com/photos/4518846/pexels-photo-4518846.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
          duration: 2
        },
        {
          stepNumber: 5,
          instruction: 'Remove from heat and quickly stir in the egg mixture, adding pasta water as needed to create a creamy sauce.',
          imageUrl: 'https://images.pexels.com/photos/4518847/pexels-photo-4518847.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
          duration: 3
        },
        {
          stepNumber: 6,
          instruction: 'Serve immediately with additional Parmesan cheese and freshly cracked black pepper.',
          imageUrl: 'https://images.pexels.com/photos/4518848/pexels-photo-4518848.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
          duration: 1
        }
      ]
    }
  ];

  // Create recipe steps
  for (const recipeSteps of recipeStepsData) {
    if (createdRecipes[recipeSteps.recipeIndex]) {
      for (const step of recipeSteps.steps) {
        await prisma.recipeStep.create({
          data: {
            recipeId: createdRecipes[recipeSteps.recipeIndex].id,
            stepNumber: step.stepNumber,
            instruction: step.instruction,
            imageUrl: step.imageUrl,
            duration: step.duration
          }
        });
      }
    }
  }

  // Create sample ratings and comments
  const sampleRatings = [
    { recipeIndex: 0, userId: user1.id, rating: 5, comment: 'Perfect pancakes! My family loved them.' },
    { recipeIndex: 1, userId: user2.id, rating: 4, comment: 'Healthy and delicious breakfast option.' },
    { recipeIndex: 5, userId: chef1.id, rating: 5, comment: 'Classic Caesar salad done right.' },
  ];

  for (const rating of sampleRatings) {
    if (createdRecipes[rating.recipeIndex]) {
      await prisma.rating.create({
        data: {
          recipeId: createdRecipes[rating.recipeIndex].id,
          userId: rating.userId,
          rating: rating.rating,
          comment: rating.comment
        }
      });
    }
  }

  // Create sample likes
  for (let i = 0; i < 10; i++) {
    await prisma.recipeLike.create({
      data: {
        recipeId: createdRecipes[i % createdRecipes.length].id,
        userId: [admin.id, chef1.id, chef2.id, user1.id, user2.id][i % 5]
      }
    });
  }

  logger.info(`✅ Seed completed successfully!`);
  logger.info(`📊 Created:`);
  logger.info(`   - ${createdRecipes.length} recipes`);
  logger.info(`   - ${categories.length} categories`);
  logger.info(`   - ${ingredients.length} ingredients`);
  logger.info(`   - ${chefs.length} chefs`);
  logger.info(`   - 5 users`);
}

main()
  .catch((e) => {
    logger.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });