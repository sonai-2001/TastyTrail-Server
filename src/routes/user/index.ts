import { Router } from 'express';

const router = Router();

router.use('/profile', (req, res) => {
  res.json({ success: true, message: 'User profile data' });
});

export default router;