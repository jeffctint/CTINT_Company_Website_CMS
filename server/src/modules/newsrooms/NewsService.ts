import { sqlDatetime, sqlInt, sqlNVarChar, sqlRequest } from '@/database/connection';
import { logger } from '@utils/logger';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';

interface ResourceProps {
  name: string;
  website: string;
}

interface CreateNewsProps {
  newsTitle: string;
  newsContentEn: string;
  newsContentHk?: string;
  newsContentJp?: string;
  newsContentCn?: string;
  newsDate: Date;
  resourceList?: string;
  relatedNewsList?: ResourceProps[];
  newsStatus: string;
  createUserPkey?: string;
  imagesList?: ImageProps[];
  imagePath?: string;
}

interface UpdateNewsProps {
  pkey: string;
  newsTitle: string;
  newsContentEn: string;
  newsContentHk?: string;
  newsContentJp?: string;
  newsContentCn?: string;
  newsDate: Date;
  resourceList?: string;
  relatedNewsList?: ResourceProps[];
  newsStatus: string;
  imagesList?: ImageProps[];
  lockCounter: number;
}

interface DeleteProps {
  code: string;
}

interface ImageProps {
  path: string;
  name: string;
  imageKey: string;
}

export const getNewsList = async ({}): Promise<any> => {
  const request = await sqlRequest();
  request.output('resultCode', sqlInt);
  request.output('errMsg', sqlNVarChar);

  // Create the log body for the logger
  const logBody = {
    action: 'getInteractions',
    inputParameters: request.parameters,
  };

  // Log the logBody
  logger.info(JSON.stringify(logBody, null, 2));

  // Execute the stored procedure
  const result = await request.execute('dbo.p_newsroom_getCustomNewsroomList');

  // Get the resultCode and errMsg
  const resultCode = result.output.resultCode;
  const errMsg = result.output.errMsg;

  // Log the total rows and page count
  logger.info(`Result code: ${resultCode} and Errmsg: ${errMsg}`);

  const news = {
    newsContent: result.recordsets[0],
    info: result.recordsets[1],
    images: result.recordsets[2],
  };

  // Return the recordset for a single statement and do some data transformation
  return {
    list: news,
    resultCode: resultCode ?? 0,
    errMsg: errMsg ?? '',
  };
};

export const getNewsDetailByPkey = async ({ pkey }: any) => {
  const request = await sqlRequest();

  // Set the input parameters
  request.input('pkey', sqlNVarChar, pkey);

  // Set the output parameters
  request.output('resultCode', sqlInt);
  request.output('errMsg', sqlNVarChar);

  // Create the log body for the logger
  const logBody = {
    action: 'getInteractionDetailById',
    // user: {
    //   userId,
    //   name,
    //   email,
    // },
    inputParameters: request.parameters,
  };

  // Log the logBody
  logger.info(JSON.stringify(logBody, null, 2));

  // Execute the stored procedure
  const result = await request.execute('dbo.p_newsroom_getCustomNewsroomByPkey');
  console.log(result);
  // Get the resultCode and errMsg
  const resultCode = result.output.resultCode;
  const errMsg = result.output.errMsg;

  // Log the total rows and page count
  logger.info(`Result code: ${resultCode} and Errmsg: ${errMsg}`);

  // Return the recordset for a single statement and do some data transformation
  return {
    result: result,
    resultCode: resultCode ?? 0,
    errMsg: errMsg ?? '',
  };
};

export const createNews = async ({
  newsTitle,
  newsContentEn,
  newsContentHk,
  newsDate,
  resourceList,
  //   relatedNewsList,
  newsStatus,
  createUserPkey,
  imagesList,
  imagePath,
}: CreateNewsProps): Promise<any> => {
  const request = await sqlRequest();

  // Set the input parameters
  request.input('newsTitle', sqlNVarChar, newsTitle);
  request.input('newsContentEn', sqlNVarChar, newsContentEn);
  request.input('newsContentHk', sqlNVarChar, newsContentHk);

  request.input('newsDate', sqlDatetime, newsDate);
  request.input('resourceList', sqlNVarChar, JSON.stringify(resourceList));
  //   request.input('relatedNewsList', sqlNVarChar, relatedNewsList);
  request.input('newsStatus', sqlNVarChar, newsStatus);
  request.input('createUserPkey', sqlNVarChar, createUserPkey);
  request.input('imagePath', sqlNVarChar, imagePath);

  if (imagesList) {
    const imagesListWithKey = imagesList.map((img: ImageProps) => {
      return {
        ...img,
        imageKey: uuidv4(),
      };
    });
    request.input('imagesList', sqlNVarChar, JSON.stringify(imagesListWithKey));
  }

  // Set the output parameters
  request.output('resultCode', sqlInt);
  request.output('errMsg', sqlNVarChar);

  // Create the log body for the logger
  const logBody = {
    action: 'createNews',
    news: {
      newsTitle,
      newsContentEn,
      newsContentHk,
      newsDate,
      resourceList,
      //   relatedNewsList,
      newsStatus,
      createUserPkey,
      imagesList,
      imagePath,
    },
    inputParameters: request.parameters,
  };

  // Log the logBody
  logger.info(JSON.stringify(logBody, null, 2));
  // Execute the stored procedure
  const result = await request.execute('dbo.p_newsroom_createCustomNewsroom');

  // Get the resultCode and errMsg
  const resultCode = result.output.resultCode;
  const errMsg = result.output.errMsg;

  // Log the total rows and page count
  logger.info(`Result code: ${resultCode} and Errmsg: ${errMsg}`);

  const news = {
    newsContent: result.recordsets[0],
    info: result.recordsets[1],
    relatedNews: result.recordsets[2],
    images: result.recordsets[3],
  };

  console.log(news);
  // Return the recordset for a single statement and do some data transformation
  return {
    result: news,
    resultCode: resultCode ?? 0,
    errMsg: errMsg ?? '',
  };
};

export const updateNews = async ({
  pkey,
  newsTitle,
  newsContentEn,
  newsDate,
  newsStatus,
  imagesList,
  lockCounter,
}: UpdateNewsProps): Promise<any> => {
  const request = await sqlRequest();

  // Set the input parameters
  request.input('pkey', sqlNVarChar, pkey);
  request.input('newsTitle', sqlNVarChar, newsTitle);
  request.input('newsContentEn', sqlNVarChar, newsContentEn);
  request.input('newsDate', sqlDatetime, newsDate);
  request.input('newsStatus', sqlNVarChar, newsStatus);
  request.input('lockCounter', sqlInt, lockCounter);

  // Set the output parameters
  request.output('resultCode', sqlInt);
  request.output('errMsg', sqlNVarChar);

  // Create the log body for the logger
  const logBody = {
    action: 'updateNews',
    news: {
      pkey,
      newsTitle,
      newsContentEn,
      newsDate,
      newsStatus,
      lockCounter,
    },
    inputParameters: request.parameters,
  };

  // Log the logBody
  logger.info(JSON.stringify(logBody, null, 2));

  // Execute the stored procedure
  const result = await request.execute('dbo.p_newsroom_updateCustomNewsroom');

  // Get the resultCode and errMsg
  const resultCode = result.output.resultCode;
  const errMsg = result.output.errMsg;

  // Log the total rows and page count
  logger.info(`Result code: ${resultCode} and Errmsg: ${errMsg}`);

  // Return the recordset for a single statement and do some data transformation
  return {
    result: result,
    resultCode: resultCode ?? 0,
    errMsg: errMsg ?? '',
  };
};

export const deleteNews = async ({ code }: DeleteProps): Promise<any> => {
  const request = await sqlRequest();

  // Set the input parameters
  request.input('code', sqlNVarChar, code);

  // Set the output parameters
  request.output('resultCode', sqlInt);
  request.output('errMsg', sqlNVarChar);

  // Create the log body for the logger
  const logBody = {
    action: 'deleteNews',
    news: {
      code,
    },
    inputParameters: request.parameters,
  };

  // Log the logBody
  logger.info(JSON.stringify(logBody, null, 2));

  // Execute the stored procedure
  const result = await request.execute('dbo.p_newsroom_deleteCustomNewsroom');

  // Get the resultCode and errMsg
  const resultCode = result.output.resultCode;
  const errMsg = result.output.errMsg;

  // Log the total rows and page count
  logger.info(`Result code: ${resultCode} and Errmsg: ${errMsg}`);

  // Return the recordset for a single statement and do some data transformation
  return {
    result: result,
    resultCode: resultCode ?? 0,
    errMsg: errMsg ?? '',
  };
};
