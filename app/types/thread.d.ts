import { Timestamp } from "firebase/firestore";
import { Moderator, User } from "./user";

type ThreadCategory =
    | 'Software Development'
    | 'Networking & Security'
    | 'Hardware & Gadgets'
    | 'Cloud Computing'
    | 'Tech News & Trends';

type ThreadStatus = 'New' | 'Hot';

export type Comment = {
  commentId: string;
  content: string;
  creationDate: Timestamp;
  creator: User;
}

export type Thread = {
  id: string;
  title: string;
  category: ThreadCategory;
  status?: ThreadStatus;
  creationDate: Timestamp;
  description: string;
  creator: User;
  comments: Comment[];
  isQnA?:boolean;
  isAnswered?:boolean;
  answeredCommentId?: string | null;
  isLocked: boolean;
}


