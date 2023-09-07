import { Request, Response } from 'express';

import { StatusCodes } from 'http-status-codes';
import { logger } from '@/utils/logger';
import { createNews, deleteNews, getNewsDetailByPkey, getNewsList, updateNews, State as NewsState, changeStatus } from './NewsService';

export const findAllNews = async (req: Request, res: Response): Promise<any> => {
  // get the request header and pass it to the service

  // Log the user body
  //   logger.info(`USER: ${JSON.stringify(user, null, 2)}`);

  const queries = {
    status: (req.query?.status as NewsState) ?? 'ALL',
    page: (req.query?.page as string) ?? '0',
    pageSize: (req.query?.pageSize as string)
  };

  const { list, total, resultCode, errMsg, totalPages, totalRows } = await getNewsList(queries);
  res.status(StatusCodes.OK).json({ data: list, total: total, resultCode: resultCode, errMsg: errMsg, message: 'findAllNews', totalPages: totalPages, totalRows: totalRows });
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

export const updateStatus = async (req: Request, res: Response): Promise<any> => {
  const { result, resultCode, errMsg, pkey, status } = await changeStatus(req.body);

  // Log the user body
  logger.info(`Update Status: ${JSON.stringify(req.body, null, 2)}`);

  res.status(StatusCodes.OK).json({
    data: result,
    pkey,
    status,
    resultCode: resultCode,
    errMsg: errMsg,
    message: 'Update Status',
    isSuccess: true,
  });
};
