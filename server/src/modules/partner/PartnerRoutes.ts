import express from 'express'
import { uploadImage, updateImage,  getPartnerLogo } from './PartnerController'

const router = express.Router()
router.route('/fetchAllLogos').get(getPartnerLogo)
router.route('/uploadImage').post(uploadImage)
router.route('/updateImage').post(updateImage)



export { router }