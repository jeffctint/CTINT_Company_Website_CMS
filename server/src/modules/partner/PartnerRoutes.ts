import express from 'express'
import { uploadImage, getPartnerLogo } from './PartnerController'

const router = express.Router()
router.route('/fetchAllLogos').get(getPartnerLogo)

router.route('/uploadImage').post(uploadImage)



export { router }