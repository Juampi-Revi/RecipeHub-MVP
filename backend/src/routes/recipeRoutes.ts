import { Router } from 'express';
import { 
  createRecipe,
  getRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  searchRecipes,
  getRecipesByAuthor,
  toggleLike,
  getMyRecipes,
  getFavoriteRecipes,
  publishRecipe,
  unpublishRecipe
} from '../controllers/recipeController';
import { authenticate, optionalAuth, requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/', optionalAuth, getRecipes);

router.get('/search', optionalAuth, searchRecipes);

router.get('/my', authenticate, getMyRecipes);

router.get('/favorites', authenticate, getFavoriteRecipes);

router.get('/author/:authorId', optionalAuth, getRecipesByAuthor);

router.get('/:recipeId', optionalAuth, getRecipeById);

router.post('/', authenticate, createRecipe);

router.put('/:recipeId', authenticate, updateRecipe);

router.delete('/:recipeId', authenticate, deleteRecipe);

router.post('/:recipeId/like', authenticate, toggleLike);

router.patch('/:recipeId/publish', authenticate, publishRecipe);

router.patch('/:recipeId/unpublish', authenticate, unpublishRecipe);

export default router;