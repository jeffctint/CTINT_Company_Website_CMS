import express from 'express'
import { requestDemo, requestEnquiry } from './ContactController'

const router = express.Router()

router.route('/requestDemo').post(requestDemo)
router.route('/enquiry').post(requestEnquiry)


export { router }