import express from 'express';
import { createNewsroom, findAllNews, findNewsByPkey, deleteNewsroom } from './NewsController';
import { updateNews } from './NewsService';

const router = express.Router();

// Get all news
router.route('/').post(findAllNews);

// Get news detail by pkey
router.route('/:pkey').get(findNewsByPkey);

// Create News
router.route('/createNews').post(createNewsroom);

// Update News
router.route('/updateNews').put(updateNews);

// Delete News
router.route('/deleteNews').put(updateNews);

export { router };
