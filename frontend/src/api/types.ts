export type ReportRead = {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string | undefined;
  age: number | undefined;
  content: string | undefined;
  attachmentURL: File | string | undefined;
};
