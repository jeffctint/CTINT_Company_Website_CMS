import express from 'express';
import { findAllNews, findNewsByPkey } from './NewsController';

const router = express.Router();

// Get all news
router.route('/').post(findAllNews);

// Get news detail by pkey
router.route('/:pkey').get(findNewsByPkey);

export { router };
