import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanRedundantCategories() {
  console.log('🧹 Iniciando limpieza de categorías redundantes...');

  try {
    // IDs de las categorías redundantes
    const redundantCategoryIds = [
      'cmg6xqy8m000bikqgtywxyzby', // Easy
      'cmg6xqy8m000fikqgiciz5lfy', // Medium  
      'cmg6xqy8m000eikqglfxbd7vr', // Hard
      'cmg6xqy8l0005ikqg6atfum8j', // Breakfast
      'cmg6xqy8m0007ikqgaabw6sm4', // Lunch
      'cmg6xqy8m0008ikqgxk4f3ryc', // Dinner
      'cmg6xqy8m0009ikqgzvkobozz', // Snacks
    ];

    // 1. Eliminar las relaciones RecipeCategory para estas categorías
    console.log('📋 Eliminando relaciones de recetas con categorías redundantes...');
    const deletedRelations = await prisma.recipeCategory.deleteMany({
      where: {
        categoryId: {
          in: redundantCategoryIds
        }
      }
    });
    console.log(`✅ Eliminadas ${deletedRelations.count} relaciones de recetas`);

    // 2. Eliminar las categorías redundantes
    console.log('🗑️ Eliminando categorías redundantes...');
    const deletedCategories = await prisma.category.deleteMany({
      where: {
        id: {
          in: redundantCategoryIds
        }
      }
    });
    console.log(`✅ Eliminadas ${deletedCategories.count} categorías redundantes`);

    // 3. Mostrar categorías restantes
    console.log('📊 Categorías restantes:');
    const remainingCategories = await prisma.category.findMany({
      orderBy: { type: 'asc' }
    });
    
    remainingCategories.forEach(cat => {
      console.log(`  - ${cat.name} (${cat.type})`);
    });

    console.log('✨ Limpieza completada exitosamente!');
    
  } catch (error) {
    console.error('❌ Error durante la limpieza:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  cleanRedundantCategories()
    .catch((error) => {
      console.error('❌ Error fatal:', error);
      process.exit(1);
    });
}

export { cleanRedundantCategories };