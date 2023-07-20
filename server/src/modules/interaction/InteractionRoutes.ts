import express from 'express';
import { downloadAttachmentById, getContactList, findInteractionDetailById, findInteractions, getQueueList } from './InteractionController';
import { validateGcUserHeader } from '@/models';
import { validateInteractionDetail, validateInteractions } from './InteractionValidator';
const router = express.Router();

// Get all interactions (with optional query parameters)
router.route('/').post(findInteractions);
// Get interaction detail by interaction id
router.route('/detail/:id').get(validateGcUserHeader, validateInteractionDetail, findInteractionDetailById);
// Download attachment by attachment id
router.route('/attachments/download/:id').get(validateGcUserHeader, downloadAttachmentById);
// Get contact list by search input
router.route('/contacts').get(validateGcUserHeader, getContactList);
// Get queue list by search input
router.route('/queues').get(validateGcUserHeader, getQueueList);

export { router };
