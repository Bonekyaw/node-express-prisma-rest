import express from 'express';

import { index, store, show, update, destroy } from '../../controllers/adminController';

const router = express.Router();

// GET localhost:8080/admins - get all admins
router.get('/admins', index);

// POST localhost:8080/admins - create an admin
router.post('/admins', store);

// GET localhost:8080/admins/1234 - get an admin
router.get('/admins/:id', show);

// PUT localhost:8080/admins/1234 - Update an admin
router.put('/admins/:id', update);

// DELETE localhost:8080/admins/1234 - delete an admin
router.delete('/admins/:id', destroy);

export default router;