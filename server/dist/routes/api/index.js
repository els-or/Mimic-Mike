import express from 'express';
const router = express.Router();
import userRoutes from './user-routes.js';
router.use('/users', userRoutes);
export default router;
