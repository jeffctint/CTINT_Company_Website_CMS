import { Request, Response } from 'express';

import { StatusCodes } from 'http-status-codes';
import { logger } from '@/utils/logger';
import { createNews, deleteNews, getNewsDetailByPkey, getNewsList, updateNews } from './NewsService';

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

export const createNewsroom = async (req: Request, res: Response): Promise<any> => {
  const { result, resultCode, errMsg } = await createNews(req.body);

  // Log the user body
  logger.info(`Create News: ${JSON.stringify(req.body, null, 2)}`);

  res.status(StatusCodes.OK).json({
    data: result,
    resultCode: resultCode,
    errMsg: errMsg,
    message: 'created news',
    isSuccess: true,
  });
};

export const updateNewsroom = async (req: Request, res: Response): Promise<any> => {
  const { result, resultCode, errMsg, imgResultCode, imgErrMsg, removeResultCode, removeErrMsg } = await updateNews(req.body);

  // Log the user body
  logger.info(`Update News: ${JSON.stringify(req.body, null, 2)}`);

  res.status(StatusCodes.OK).json({
    data: result,
    resultCode: resultCode,
    errMsg: errMsg,
    imgResultCode: imgResultCode,
    imgErrMsg: imgErrMsg,
    removeResultCode: removeResultCode,
    removeErrMsg: removeErrMsg,
    message: 'Updated news',
    isSuccess: true,
  });
};

export const deleteNewsroom = async (req: Request, res: Response): Promise<any> => {
  const { result, resultCode, errMsg } = await deleteNews(req.body);

  // Log the user body
  logger.info(`Delete News: ${JSON.stringify(req.body, null, 2)}`);

  res.status(StatusCodes.OK).json({
    data: result,
    resultCode: resultCode,
    errMsg: errMsg,
    message: 'Delete news',
    isSuccess: true,
  });
};
