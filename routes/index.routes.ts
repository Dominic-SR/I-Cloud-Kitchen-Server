import { Router } from 'express';
// import { getAllUsers, createUser, getUserById } from '../controllers/UserController';

const router = Router();

router.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// User routes
// router.get('/users', getAllUsers);
// router.post('/users', createUser);
// router.get('/users/:id', getUserById);

export default router;