import { sqlDatetime, sqlInt, sqlNVarChar, sqlRequest } from '@/database/connection';
import { logger } from '@utils/logger';
import { v4 as uuidv4 } from 'uuid';

interface PartnerLogoProps {
    imageString: string;
    imageKey: string;
    position: number;
}

interface uploadPartnerLogoProps {
    imagesList: PartnerLogoProps[],
    oldImageListId: string[]
}

export const fetchPartnerLogo = async(): Promise<any> => {
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

    // const logos = result.recordsets[0]
    // const currentImageListIds:[] = logos.data.map((item:any) => {
    //     return item.imageKey
    // })

    // const partners = {
    //     logo: result.recordsets[0],
    //     currentImageListIds: currentImageListIds
    // }

    return {
        list: result.recordsets[0], 
        // currentImageListIds: currentImageListIds,
        resultCode: resultCode ?? 0,
        errMsg: errMsg ?? '',
       
      };

}

export const updatePartnerLogo = async ({imagesList, oldImageListId = []}:uploadPartnerLogoProps): Promise<any> => {
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

    if(imagesListWithKey.length > 0) {
      const diff = imagesListWithKey.filter((item: any) => !oldImageListId.some((key:any) => key === item.imageKey)); //add images
      const existedImage = imagesListWithKey.filter((item: any) => oldImageListId.filter((key:any) => key !== item.imageKey)); //existed items after deleted the first item

      const notIncluded = oldImageListId.filter((item: any, i: number) => imagesListWithKey[i]?.imageKey !== item);
      const removed = oldImageListId.filter((item: any) => !imagesListWithKey.some((key:any) => key.imageKey === item));

      const existed = oldImageListId.filter((item: any) => imagesListWithKey.find((img:any) => img.imageKey === item));

      if (diff.length > 0 || existedImage.length === 0) {
        console.log('in the diff');
        for (let i = 0; i < diff.length; i++) {
          console.log('diff', diff.length);

          const imgItem = diff[i];
          const request = await sqlRequest();

         
          const imageString = imgItem.imageString;
          const imageKey = imgItem.imageKey;
          const position =  imgItem.position

        
          request.input('imageString', sqlNVarChar, imageString);
          request.input('imageKey', sqlNVarChar, imageKey);
          request.input('position', sqlInt, position);


          // Set the output parameters
          request.output('imgResultCode', sqlInt);
          request.output('imgErrMsg', sqlNVarChar);

          console.log('times', i);
          console.log('imageResult', imageResult);
  
          imageResult = await request.execute('dbo.p_partner_createCustomImageForPartner');
          
        }
      } 

      if(diff.length > 0 && existedImage.length > 0) {
        console.log('in the existed');
        for (let i = 0; i < existedImage.length; i++) {
          console.log('existedImage', existedImage.length);

          const imgItem = existedImage[i];
          const request = await sqlRequest();

          const imageKey = imgItem.imageKey;
          const position =  imgItem.position

          request.input('imageKey', sqlNVarChar, imageKey);
          request.input('position', sqlInt, position);


          // Set the output parameters
          request.output('imgResultCode', sqlInt);
          request.output('imgErrMsg', sqlNVarChar);

          console.log('existedImage times', i);
          console.log('imageResult', imageResult);
          imageResult = await request.execute('dbo.p_partner_updateCustomImageForPartner');
        }
      }

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

          console.log('times', i);
          console.log('imageResult', imageResult);
          removeResult = await request.execute('dbo.p_partner_deleteCustomImageForPartner');
        }
      }
    }
    request.input('imagesList', sqlNVarChar, JSON.stringify(imagesListWithKey));
  }
  

  // Set the output parameters
  request.output('resultCode', sqlInt);
  request.output('errrMsg', sqlNVarChar);

  const logBody = {
    action: 'uploadPartnerLogo',
    logo: {
        imageResult,
        removeResult
    },
    inputParameters: request.parameters,
  };

    // Log the logBody
    logger.info(JSON.stringify(logBody, null, 2));


//   const result = await request.execute('dbo.p_partner_createCustomImageForPartner');

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
