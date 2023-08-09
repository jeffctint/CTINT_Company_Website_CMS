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
  imageString: string;
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
    newsContent: result.recordsets[0].map((item: any) => {
      const images = result.recordsets[2].filter((img: any) => img.newsroomCode === item.code);
      return {
        ...item,
        id: item.code,
        imagePath: images ?? [],
      };
    }),
    // info: result.recordsets[1],
    // images: result.recordsets[2],
  };

  console.log('news', news.newsContent.length);
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

  const attachment = result.recordsets[3];

  const mappedAttachment = attachment.map((item: any) => {
    const base64String = Buffer.from(item.imageString, 'binary').toString('base64');

    return {
      ...item,
      base64String,
    };
  });

  const news = {
    newsContent: result.recordsets[0],
    info: result.recordsets[1],
    relatedNews: result.recordsets[2],
    images: mappedAttachment,
  };

  // Return the recordset for a single statement and do some data transformation
  return {
    ...news,
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
  relatedNewsList,
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
  request.input('relatedNewsList', sqlNVarChar, JSON.stringify(relatedNewsList));
  request.input('newsStatus', sqlNVarChar, newsStatus);
  request.input('createUserPkey', sqlNVarChar, createUserPkey);
  request.input('imagePath', sqlNVarChar, imagePath);

  let imagesListWithKey: any = [];
  if (imagesList) {
    imagesListWithKey = imagesList.map((img: ImageProps) => {
      return {
        ...img,
        imageKey: uuidv4(),
      };
    });
    // request.input('imagesList', sqlNVarChar, JSON.stringify(imagesListWithKey));
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
      relatedNewsList,
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

  let imageResult;
  if (imagesListWithKey) {
    for (let i = 0; i < imagesListWithKey.length; i++) {
      const imgItem = imagesListWithKey[i];
      const request = await sqlRequest();

      const name = imgItem.name;
      const path = imgItem.path;
      const imageString = imgItem.imageString;
      const imageKey = imgItem.imageKey;

      request.input('name', sqlNVarChar, name);
      request.input('path', sqlNVarChar, path);
      request.input('imageString', sqlNVarChar, imageString);
      request.input('imageKey', sqlNVarChar, imageKey);

      // Set the output parameters
      request.output('imgResultCode', sqlInt);
      request.output('imgErrMsg', sqlNVarChar);

      console.log('times', i);
      console.log('imageResult', imageResult);
      imageResult = await request.execute('dbo.p_newsroom_createCustomImageForNewsroom');
    }
  }

  // Get the resultCode and errMsg
  const resultCode = result.output.resultCode;
  const errMsg = result.output.errMsg;
  const imgResultCode = imageResult.output.imgResultCode;
  const imgErrMsg = imageResult.output.imgErrMsg;

  // Log the total rows and page count
  logger.info(`Result code: ${resultCode} and Errmsg: ${errMsg}`);

  const news = {
    newsContent: result.recordsets[0],
    info: result.recordsets[1],
    relatedNews: result.recordsets[2],
    images: imageResult,
  };

  console.log(news);
  // Return the recordset for a single statement and do some data transformation
  return {
    result: news,
    resultCode: resultCode ?? 0,
    errMsg: errMsg ?? '',
    imgResultCode: imgResultCode ?? 0,
    imgErrMsg: imgErrMsg ?? '',
  };
};

export const updateNews = async ({
  pkey,
  newsTitle,
  newsContentEn,
  newsContentHk,
  resourceList,
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
  request.input('newsContentHk', sqlNVarChar, newsContentHk);
  request.input('newsDate', sqlDatetime, newsDate);
  request.input('newsStatus', sqlNVarChar, newsStatus);
  request.input('resourceList', sqlNVarChar, JSON.stringify(resourceList));
  request.input('lockCounter', sqlInt, lockCounter);

  let imagesListWithKey: any = [];

  if (imagesList) {
    imagesListWithKey = imagesList.map((img: ImageProps) => {
      if (!img.imageKey) {
        return {
          ...img,
          imageKey: uuidv4(),
        };
      }

      return img;
    });
    request.input('imagesList', sqlNVarChar, JSON.stringify(imagesListWithKey));
  }

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
      imagesList,
    },
    inputParameters: request.parameters,
  };

  // Log the logBody
  logger.info(JSON.stringify(logBody, null, 2));

  // Execute the stored procedure
  const result = await request.execute('dbo.p_newsroom_updateCustomNewsroom');

  const news = {
    newsContent: result.recordsets[0],
    info: result.recordsets[1],
    relatedNews: result.recordsets[2],
    images: result.recordsets[3],
  };

  // Get the resultCode and errMsg
  const resultCode = result.output.resultCode;
  const errMsg = result.output.errMsg;

  // Log the total rows and page count
  logger.info(`Result code: ${resultCode} and Errmsg: ${errMsg}`);

  // Return the recordset for a single statement and do some data transformation
  return {
    result: news,
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
