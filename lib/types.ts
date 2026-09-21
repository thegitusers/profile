export type TicketStatus = "open" | "in_progress" | "resolved" | "closed";

export type Attachment = {
  filename: string;
  contentType: string;
  dataUrl: string;
};

export type Comment = {
  author: "admin" | "company";
  authorName: string;
  message: string;
  createdAt: string;
  attachments?: Attachment[];
};

export type Ticket = {
  _id: string;
  ticketNumber?: number;
  companyCode?: string;
  companyId: string;
  companyName: string;
  subject: string;
  description: string;
  status: TicketStatus;
  attachments?: Attachment[];
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
};

export type Company = {
  _id: string;
  name: string;
  email: string;
  approved: boolean;
  logoDataUrl?: string;
  createdAt: string;
};
