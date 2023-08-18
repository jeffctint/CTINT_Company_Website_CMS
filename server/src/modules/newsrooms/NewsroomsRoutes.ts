import express from 'express';
import { createNewsroom, findAllNews, findNewsByPkey, deleteNewsroom, updateNewsroom, updateStatus } from './NewsController';

const router = express.Router();

// Get all news
router.route('/').post(findAllNews);

// Get news detail by pkey
router.route('/:pkey').get(findNewsByPkey);

// Create News
router.route('/createNews').post(createNewsroom);

// Update News
router.route('/updateNews').put(updateNewsroom);

// Delete News
router.route('/deleteNews').delete(deleteNewsroom);

//update status
router.route('/updateStatus').put(updateStatus);

export { router };
