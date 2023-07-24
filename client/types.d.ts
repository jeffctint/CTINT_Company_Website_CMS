export interface NewsProps {
  code: string;
  createDatetime: string;
  createUserPkey: string;
  dbUser: string;
  effDate: string;
  effSeq: string;
  imagePkey: string;
  latestUpdateDatetime: string;
  latestUpdateUserPkey: string;
  lockCounter: number;
  newsDate: string;
  newsTitle: string;
  pkey: string;
  serviceAgreementTypeDesc: string;
  status: string;
  statusDesc: string;
}

export interface NewsCardProps {
  imagePkey: string;
  newsTitle: string;
  newsDate: string;
  pkey: string;
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
  fields: UseFieldArrayProps;
  append: UseFieldArrayAppend;
  remove: UseFieldArrayRemove;
  files: any;
  handleUpload: (data: any) => void;
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
  newsDate: Datetime;
  resourceList?: ResourceProps[];
  relatedNewsList?: [];
  createUserPkey?: string;
  newsStatus: string;
  imageName?: FileWithPath[];
}

export interface ResourceProps {
  name: string;
  website: string;
}
