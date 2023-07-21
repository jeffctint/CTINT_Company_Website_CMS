import { Request, Response } from 'express';

import { StatusCodes } from 'http-status-codes';
import { logger } from '@/utils/logger';
import { getNewsDetailByPkey, getNewsList } from './NewsService';

export const findAllNews = async (req: Request, res: Response): Promise<any> => {
  // get the request header and pass it to the service

  // Log the user body
  //   logger.info(`USER: ${JSON.stringify(user, null, 2)}`);

  const { list, resultCode, errMsg } = await getNewsList(req.body);
  res.status(StatusCodes.OK).json({ data: list, resultCode: resultCode, errMsg: errMsg, message: 'findAllNews' });
};

export const findNewsByPkey = async (req: Request, res: Response): Promise<any> => {
  // get the request header and pass it to the service

  // Log the user body
  //   logger.info(`USER: ${JSON.stringify(user, null, 2)}`);
  const body = {
    pkey: req.params.pkey,
    // ...user,
  };

  const result = await getNewsDetailByPkey(body);
  res.status(StatusCodes.OK).json({ data: result, message: 'findOneDetail', isSuccess: true });
};
