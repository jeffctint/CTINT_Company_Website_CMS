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
  newsTitle: string;
  pkey: string;
  serviceAgreementTypeDesc: string;
  status: string;
  statusDesc: string;
  imagePath: any[];
  status: string;
}

export interface NewsCardProps {
  imagePath: string;
  newsTitle: string;
  newsDate: string;
  pkey: string;
  status: string;
}

export interface CreateNewsFormProps {
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
  removeImages: (i: number) => void;
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
  newsTitle: string;
  newsContent: string;
  newsContentEn: string;
  newsContentHk?: string;
  newsContentJp?: string;
  newsContentCn?: string;
  newsDate: Datetime;
  resourceList?: ResourceProps[];
  relatedNewsList?: [];
  createUserPkey?: string;
  newsStatus: string;
  imagesList?: FileWithPath[];
}

export interface UpdateNewsProps {
  newsTitle: string;
  newsContent: string;
  newsContentEn: string;
  newsContentHk?: string;
  newsContentJp?: string;
  newsContentCn?: string;
  newsDate: Datetime;
  resourceList?: ResourceProps[];
  relatedNewsList?: [];
  createUserPkey?: string;
  newsStatus: string;
  imagesList?: FileWithPath[];
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
