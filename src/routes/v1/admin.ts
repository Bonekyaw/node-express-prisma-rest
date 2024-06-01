import express from 'express';

import upload from "../../middlewares/uploadFile";
import { uploadProfile, index, store, show, update, destroy } from '../../controllers/adminController';

const router = express.Router();

// Upload single image
router.put('/admins/upload', upload.single('avatar'), uploadProfile );
// Upload multiple images
// router.put('/admins/upload',upload.array('avatar'), adminController.uploadProfile );

// GET localhost:8080/api/v1/admins?page=1&limit=5 
// Get all admins by Pagination
router.get('/admins', index);
// router.get('/admins', authorise(false, "user"), index);

// POST localhost:8080/api/v1/admins - create an admin
router.post('/admins', store);

// GET localhost:8080/api/v1/admins/1234 - get an admin
router.get('/admins/:id', show);

// PUT localhost:8080/api/v1/admins/1234 - Update an admin
router.put('/admins/:id', update);

// DELETE localhost:8080/api/v1/admins/1234 - delete an admin
router.delete('/admins/:id', destroy);

export default router;