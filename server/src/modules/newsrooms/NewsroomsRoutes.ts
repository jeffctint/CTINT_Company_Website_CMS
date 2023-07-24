import express from 'express';
import { createNewsRoom, findAllNews, findNewsByPkey } from './NewsController';

const router = express.Router();

// Get all news
router.route('/').post(findAllNews);

// Get news detail by pkey
router.route('/:pkey').get(findNewsByPkey);

router.route('/createNews').post(createNewsRoom);

export { router };
