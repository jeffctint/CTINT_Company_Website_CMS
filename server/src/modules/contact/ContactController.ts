import { Request, Response } from 'express';

import { StatusCodes } from 'http-status-codes';
import { logger } from '@/utils/logger';
import { emailOption, transporter } from './ContactService'

export const requestDemo = async(req: Request, res: Response): Promise<any> => {
    if(req.method === "POST") {
        const data = req.body

       if( !data.firstName || !data.lastName || !data.email || !data.message){
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "Bad request"})
       }

       try {
            await transporter.sendMail({
                ...emailOption(data.email),
                subject: "Request Demo",
                // text: "This is a text string",
                html: `<div>
                    <div>First Name: ${data.firstName}</div>
                    <div>Last Name: ${data.lastName}</div>
                    <div>Email: ${data.email}</div>
                    <div>Phone: ${data.phoneNumber}</div>
                    <div>Message: ${data.message}</div>
                </div>`
            })

            const logbody = {
                firstName: data.firstName,
                lastName: data.lastName,
                phoneNumber: data.phoneNumber,
                email: data.email,
                message: data.messages
            }

            logger.info(`Request Demo: ${JSON.stringify(logbody)}`)

            return res.status(StatusCodes.OK).json({success: true})
       } catch(err:any) {
            console.log(err)
            return res.status(400).json({ message: err.message})

       }
    }
}



export const requestEnquiry = async(req: Request, res: Response): Promise<any> => {
    if(req.method === "POST") {
        const data = req.body

       if( !data.firstName || !data.lastName || !data.email || !data.message){
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "Bad request"})
       }

       try {
            await transporter.sendMail({
                ...emailOption(data.email),
                subject: "Request Enquiry",
                // text: "This is a text string",
                html: `<div>
                    <div>First Name: ${data.firstName}</div>
                    <div>Last Name: ${data.lastName}</div>
                    <div>Email: ${data.email}</div>
                    <div>Phone: ${data.phoneNumber}</div>
                    <div>Company Name: ${data.companyName}</div>
                    <div>Job Title: ${data.jobTitle}</div>
                    <div>Reason For Contact: ${data.reasonForContact}</div>
                    <div>Message: ${data.message}</div>
                </div>`
            })

            const logbody = {
                firstName: data.firstName,
                lastName: data.lastName,
                phoneNumber: data.phoneNumber,
                email: data.email,
                companyName: data.companyName,
                jobTitle: data.jobTitle,
                reasonForContact: data.reasonForContact,
                message: data.messages
            }

            logger.info(`Request Enquiry: ${JSON.stringify(logbody)}`)

            return res.status(StatusCodes.OK).json({success: true})
       } catch(err:any) {
            console.log(err)
            return res.status(400).json({ message: err.message})

       }
    }
}