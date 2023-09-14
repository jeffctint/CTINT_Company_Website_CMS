export interface NewsProps {
  code: string;
  createDatetime: string;
  createUserPkey: string;
  dbUser: string;
  effDate: string;
  effSeq: string;
  latestUpdateDatetime: string;
  latestUpdateUserPkey: string;
  lockCounter: number;
  newsDate: string;
  newsTitleEn: string;
  pkey: string;
  serviceAgreementTypeDesc: string;
  status: string;
  statusDesc: string;
  imagePath: any[];
  status: string;
}

export interface NewsCardProps {
  imagePath: string;
  newsTitleEn: string;
  newsDate: string;
  pkey: string;
  status: string;
  handleStatus: ({ pkey: string, status: string }) => void;
}

export interface CreateNewsFormProps {
  type: string;
  register: any;
  type: string;
  handleSubmit: FormEventHandler<HTMLFormElement> | undefined;
  onFinishHandler: (data: FieldValues) => Promise<void> | void;
  form: any;
  register: UseFormRegister;
  infoFields: UseFieldArrayProps;
  infoAppend: UseFieldArrayAppend;
  infoRemove: UseFieldArrayRemove;
  relatedNewsFields: UseFieldArrayProps;
  relatedNewsAppend: UseFieldArrayAppend;
  relatedNewsRemove: UseFieldArrayRemove;
  files: any;
  handleUpload: (data: any) => void;
  isLoading: boolean;
  removeImages: (i: number) => void;
  handleSaveAsDraft: (data: FieldValues) => Promise<void> | void;
}

export interface NewsDetailFormProps {
  type: string;
  register: any;
  type: string;
  handleSubmit: FormEventHandler<HTMLFormElement> | undefined;
  onFinishHandler: (data: FieldValues) => Promise<void> | void;
  form: any;
  control: Control;
  register: UseFormRegister;
  infoFields: UseFieldArrayProps;
  infoAppend: UseFieldArrayAppend;
  infoRemove: UseFieldArrayRemove;
  relatedNewsFields: UseFieldArrayProps;
  relatedNewsAppend: UseFieldArrayAppend;
  relatedNewsRemove: UseFieldArrayRemove;
  files: any;
  handleUpload: (data: any) => void;
  isLoading: boolean;
  newsDetail: any;
  newsList: any;
  info?: any;
  relatedNews: any;
  images?: any;
  isEdit: boolean;
  setFiles: any;
  removeImages: (i: number) => void;
  enContent?: any;
  cnContent?: any;
  hkContent?: any;
  jpContent?: any;
}

export interface ResourceProps {
  name: string;
  newsroomCode?: string;
  website: string;
}

export interface RelatedNewsProps {
  newsDate?: Datetime;
  newsTitle?: string;
  referenceCode?: string;
  newsroomCode?: string;
}

export interface CreateNewsProps {
  newsTitleEn: string;
  newsTitleCn?: string;
  newsTitleHk?: string;
  newsTitleJp?: string;
  newsContentEn: string;
  newsContentHk?: string;
  newsContentJp?: string;
  newsContentCn?: string;
  newsDate: Datetime;
  resourceList?: ResourceProps[];
  imagePath?: string;
  relatedNewsList?: ReferenceCode[];
  createUserPkey?: string;
  newsStatus?: string;
  imagesList?: FileWithPath[];
}

export interface ReferenceCode {
  referenceCode: string;
}

export interface UpdateNewsProps {
  pkey: string;
  newsroomCode: number;
  newsTitleEn: string;
  newsTitleCn?: string;
  newsTitleHk?: string;
  newsTitleJp?: string;
  newsContentEn: string;
  newsContentHk?: string;
  newsContentJp?: string;
  newsContentCn?: string;
  newsDate: Datetime;
  imagePath?: string;
  resourceList?: ResourceProps[];
  relatedNewsList?: ReferenceCode[];
  newsStatus?: string;
  imagesList?: FileWithPath[];
  lockCounter: number;
  latestUpdateUserPkey: string;
  oldImageListId: string[];
}

export interface ResourceProps {
  name: string;
  website: string;
}

export type DetailPkeyProps = {
  params: {
    pkey: string;
  };
};

export interface UpdateStatus {
  pkey: string;
  status: string;
}

export interface UploadImageProps {
  imagesList: FileWithPath[];
}

export interface PartnersLogo {
  createDatetime: string;
  createUserPkey: string;
  filePath: string;
  imageKey: string;
  imageString: string;
  originalFileName: string;
  position: number;
  referenceCode: string;
  referenceType: string;
}
