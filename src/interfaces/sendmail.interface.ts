export interface sendMail {
  templateName: string;
  recipientEmail: string | Array<string>;
  subject: string;
  templateData: TemplateData;
  EventType: string;
}

export type TemplateData = {
  [key: string]: string;
};
