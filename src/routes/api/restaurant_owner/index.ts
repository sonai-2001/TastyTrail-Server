import { Router } from 'express';
const router= Router();

router.use("/allMenu", (req, res) => {
  res.json({ success: true, message: 'All menu items' });
});

export default router;