import { Request, Response } from 'express';

import { StatusCodes } from 'http-status-codes';
import { logger } from '@/utils/logger';
import { createPartnerLogo, updatePartnerLogo, fetchPartnerLogo } from './PartnerService';

export const getPartnerLogo = async (req: Request, res: Response): Promise<any> => {
    const { list, currentImageListIds,  resultCode, errMsg } = await fetchPartnerLogo()
    res.status(StatusCodes.OK).json({ data: list, currentImageListIds: currentImageListIds, resultCode: resultCode, errMsg: errMsg, message: 'getPartnerLogo'});

}

export const uploadImage = async (req: Request, res: Response): Promise<any> => {
    const { result, resultCode, errMsg } = await createPartnerLogo(req.body);
  
    logger.info(`Upload logo: ${JSON.stringify(req.body, null, 2)}`);
  
    res.status(StatusCodes.OK).json({
      data: result,
      resultCode: resultCode,
      errMsg: errMsg,
      message: 'Upload logo successfully',
      isSuccess: true,
    });
  }


export const updateImage = async (req: Request, res: Response): Promise<any> => {
  const { result, resultCode, errMsg, message } = await updatePartnerLogo(req.body);

  logger.info(`Upload logo: ${JSON.stringify(req.body, null, 2)}`);

  res.status(StatusCodes.OK).json({
    data: result,
    // resultCode: resultCode,
    // errMsg: errMsg,
    message: message,
    isSuccess: true,
  });
}