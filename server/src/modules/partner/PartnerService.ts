import { sqlDatetime, sqlInt, sqlNVarChar, sqlRequest } from '@/database/connection';
import { logger } from '@utils/logger';
import { v4 as uuidv4 } from 'uuid';

interface PartnerLogoProps {
  name: string;
  path: string;
  imageString: string;
  imageKey: string;
  position: number;
}

interface uploadPartnerLogoProps {
  imagesList: PartnerLogoProps[];
  oldImageListId: string[];
}

export const fetchPartnerLogo = async (): Promise<any> => {
  const request = await sqlRequest();

  request.output('resultCode', sqlInt);
  request.output('errMsg', sqlNVarChar);

  // Create the log body for the logger
  const logBody = {
    action: 'getPartner Logo',
    inputParameters: request.parameters,
  };

  // Log the logBody
  logger.info(JSON.stringify(logBody, null, 2));

  // Execute the stored procedure
  const result = await request.execute('dbo.p_partner_getCustomPartnerLogo');

  // Get the resultCode and errMsg
  const resultCode = result.output.resultCode;
  const errMsg = result.output.errMsg;

  // Log the total rows and page count
  logger.info(`Result code: ${resultCode} and Errmsg: ${errMsg}`);

  const logos = result.recordset;
  const currentImageListIds = logos.map((item: any) => {
    return item.imageKey;
  });

  return {
    list: result.recordsets[0],
    currentImageListIds: currentImageListIds,
    resultCode: resultCode ?? 0,
    errMsg: errMsg ?? '',
  };
};

export const createPartnerLogo = async ({ imagesList }: uploadPartnerLogoProps): Promise<any> => {
  const request = await sqlRequest();
  let imagesListWithKey: any = [];
  let imageResult;
  let removeResult;

  if (imagesList) {
    imagesListWithKey = imagesList.map((img: PartnerLogoProps) => {
      if (!img.imageKey) {
        return {
          ...img,
          imageKey: uuidv4(),
        };
      }

      return img;
    });

    if (imagesListWithKey.length > 0) {
      for (let i = 0; i < imagesListWithKey.length; i++) {
       
        const imgItem = imagesListWithKey[i];
        const request = await sqlRequest();

        const name = imgItem.name;
        const path = imgItem.path;
        const imageString = imgItem.imageString;
        const imageKey = imgItem.imageKey;
        const position = imgItem.position;

        request.input('name', sqlNVarChar, name);
        request.input('path', sqlNVarChar, path);
        request.input('imageString', sqlNVarChar, imageString);
        request.input('imageKey', sqlNVarChar, imageKey);
        request.input('position', sqlInt, position);

        // Set the output parameters
        request.output('imgResultCode', sqlInt);
        request.output('imgErrMsg', sqlNVarChar);

        imageResult = await request.execute('dbo.p_partner_createCustomImageForPartner');
      }
    }

  }

  // Set the output parameters
  request.output('imgResultCode', sqlInt);
  request.output('imgErrMsg', sqlNVarChar);

  const logBody = {
    action: 'createPartnerLogo',
    logo: {
      imageResult,
    },
    inputParameters: request.parameters,
  };

  // Log the logBody
  logger.info(JSON.stringify(logBody, null, 2));

  // Get the resultCode and errMsg
  const resultCode = imageResult.output.resultCode;
  const errMsg = imageResult.output.errMsg;

  // Log the total rows and page count
  logger.info(`Result code: ${resultCode} and Errmsg: ${errMsg}`);

  // Return the recordset for a single statement and do some data transformation
  return {
    result: imageResult,
    resultCode: resultCode ?? 0,
    errMsg: errMsg ?? '',
  };
};

export const updatePartnerLogo = async ({ imagesList, oldImageListId }: uploadPartnerLogoProps): Promise<any> => {
  // const request = await sqlRequest();
  let imagesListWithKey: any = [];
  let imageResult;
  let removeResult;

  if (imagesList) {
    imagesListWithKey = imagesList.map((img: PartnerLogoProps) => {
      if (!img.imageKey) {
        return {
          ...img,
          imageKey: uuidv4(),
        };
      }

      return img;
    });

    if (imagesListWithKey.length > 0) {
      const diff = imagesListWithKey.filter((item: any) => !oldImageListId.some((key: any) => key === item.imageKey)); //add images
      const existedImage = imagesListWithKey.filter((item: any) => oldImageListId.some((key: any) => key !== item.imageKey)); //existed items after deleted the first item

      const notIncluded = oldImageListId.filter((item: any, i: number) => imagesListWithKey[i]?.imageKey !== item);
      const removed = oldImageListId.filter((item: any) => !imagesListWithKey.some((key: any) => key.imageKey === item));

      const existed = oldImageListId.filter((item: any) => imagesListWithKey.find((img: any) => img.imageKey === item));
      console.log('oldImageListId', oldImageListId);
      console.log('diff', diff);
      console.log('existedImage', existedImage);
      console.log('removed', removed);

      // add new images, if delete previos images and update the position
      if (diff.length > 0 && existedImage.length > 0) {
        console.log('in the diff');

        if (removed.length > 0) {
          for (let i = 0; i < removed.length; i++) {
          
            const imgItem = removed[i];
            const request = await sqlRequest();
            const imageKey = imgItem;

            request.input('imageKey', sqlNVarChar, imageKey);
        
            // Set the output parameters
            request.output('removeResultCode', sqlInt);
            request.output('removeErrMsg', sqlNVarChar);

            removeResult = await request.execute('dbo.p_partner_deleteCustomImageForPartner');
          }
        }

        if (existedImage.length > 0) {
          for (let i = 0; i < existedImage.length; i++) {
            console.log('existedImage', existedImage.length);

            const imgItem = existedImage[i];
            const request = await sqlRequest();

            const imageKey = imgItem.imageKey;
            const position = imgItem.position;

            request.input('imageKey', sqlNVarChar, imageKey);
            request.input('position', sqlInt, position);

            // Set the output parameters
            request.output('imgResultCode', sqlInt);
            request.output('imgErrMsg', sqlNVarChar);

            imageResult = await request.execute('dbo.p_partner_updateCustomImageForPartner');
          }
        }

        for (let i = 0; i < diff.length; i++) {
          const imgItem = diff[i];
          const request = await sqlRequest();

          const name = imgItem.name;
          const path = imgItem.path;
          const imageString = imgItem.imageString;
          const imageKey = imgItem.imageKey;
          const position = imgItem.position;

          request.input('name', sqlNVarChar, name);
          request.input('path', sqlNVarChar, path);
          request.input('imageString', sqlNVarChar, imageString);
          request.input('imageKey', sqlNVarChar, imageKey);
          request.input('position', sqlInt, position);

          // Set the output parameters
          request.output('imgResultCode', sqlInt);
          request.output('imgErrMsg', sqlNVarChar);

          imageResult = await request.execute('dbo.p_partner_createCustomImageForPartner');

          const logBody = {
            action: 'createPartnerLogo',
            logo: {
              imageResult,
            },
            inputParameters: request.parameters,
          };

          // Log the logBody
          logger.info(JSON.stringify(logBody, null, 2));

          console.log('imageResult', imageResult);
        }

        // Get the resultCode and errMsg
        const resultCode = imageResult.output.imgResultCode;
        const errMsg = imageResult.output.imgErrMsg;

        // Log the total rows and page count
        logger.info(`Result code: ${resultCode} and Errmsg: ${errMsg}`);

        // Return the recordset for a single statement and do some data transformation
        return {
          result: imageResult,
          resultCode: resultCode ?? 0,
          errMsg: errMsg ?? '',
          message: 'Create Image Successfully',
        };
      }
      
      // remove the images, then update the existed image position
      if (removed.length > 0) {
        for (let i = 0; i < removed.length; i++) {
          console.log('in removed', removed.length);
          const imgItem = removed[i];
          const request = await sqlRequest();

          const imageKey = imgItem;

          request.input('imageKey', sqlNVarChar, imageKey);
          // request.input('newsroomCode', sqlNVarChar, newsroomCode);

          // Set the output parameters
          request.output('removeResultCode', sqlInt);
          request.output('removeErrMsg', sqlNVarChar);

          removeResult = await request.execute('dbo.p_partner_deleteCustomImageForPartner');

          const logBody = {
            action: 'deletePartnerLogo',
            logo: {
              removeResult,
            },
            inputParameters: request.parameters,
          };

          // Log the logBody
          logger.info(JSON.stringify(logBody, null, 2));
        }

        if (existedImage.length > 0) {
          for (let i = 0; i < existedImage.length; i++) {
            console.log('existedImage', existedImage.length);

            const imgItem = existedImage[i];
            const request = await sqlRequest();

            const imageKey = imgItem.imageKey;
            const position = imgItem.position;

            request.input('imageKey', sqlNVarChar, imageKey);
            request.input('position', sqlInt, position);

            // Set the output parameters
            request.output('imgResultCode', sqlInt);
            request.output('imgErrMsg', sqlNVarChar);

            imageResult = await request.execute('dbo.p_partner_updateCustomImageForPartner');
          }
        }

        // Get the resultCode and errMsg
        const resultCode = removeResult.output.resultCode;
        const errMsg = removeResult.output.errMsg;

        // Log the total rows and page count
        logger.info(`Result code: ${resultCode} and Errmsg: ${errMsg}`);

        // Return the recordset for a single statement and do some data transformation
        return {
          result: removeResult,
          resultCode: resultCode ?? 0,
          errMsg: errMsg ?? '',
          message: 'Delete Image Successfully',
        };
      }

      if (existedImage.length > 0 || (existedImage.length > 0 && diff.length > 0)) {
        console.log('in the existed');
        for (let i = 0; i < existedImage.length; i++) {
          console.log('existedImage', existedImage.length);

          const imgItem = existedImage[i];
          const request = await sqlRequest();

          const imageKey = imgItem.imageKey;
          const position = imgItem.position;

          request.input('imageKey', sqlNVarChar, imageKey);
          request.input('position', sqlInt, position);

          // Set the output parameters
          request.output('imgResultCode', sqlInt);
          request.output('imgErrMsg', sqlNVarChar);

          imageResult = await request.execute('dbo.p_partner_updateCustomImageForPartner');

          const logBody = {
            action: 'uploadPartnerLogo',
            logo: {
              imageResult,
            },
            inputParameters: request.parameters,
          };

          // Log the logBody
          logger.info(JSON.stringify(logBody, null, 2));
        }

        // Get the resultCode and errMsg
        const resultCode = imageResult.output.resultCode;
        const errMsg = imageResult.output.errMsg;

        // Log the total rows and page count
        logger.info(`Result code: ${resultCode} and Errmsg: ${errMsg}`);

        // Return the recordset for a single statement and do some data transformation
        return {
          result: imageResult,
          resultCode: resultCode ?? 0,
          errMsg: errMsg ?? '',
          message: 'Update Image Successfully',
        };
      }
    }
    
  }
};
