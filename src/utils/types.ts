export interface ObjectID {
  id: number;
}

export enum QuestionType {
  Checkbox,
  Radio,
  Text,
}

export interface Answer extends ObjectID {
  value: string;
}

export interface Question extends ObjectID {
  type: QuestionType;
  question: string;
  answers: Answer[];
}

export interface Section extends ObjectID {
  questions: Question[];
  title: string;
  addQuestionType: keyof typeof QuestionType;
}

export type PollSchema = {
  title: string;
  authRequired?: boolean;
  sections: Section[];
};

export type Poll = {
  id: string;
  authorId: string;
  schema: PollSchema;
  createdAt: Date;
  updatedAt: Date;
};

export type DbPoll = Omit<Poll, 'schema'> & {
  schema: string;
};

export type PollResponseData = {
  sections: { id: number; questions: { id: number; answers: string[] }[] }[];
};

export type PollResponse = {
  id: string;
  data: PollResponseData;
  userId?: string | null;
};

export type DbPollResponse = Omit<PollResponse, 'data'> & {
  data: string;
};

export const newID = (objs: ObjectID[]) =>
  objs.length !== 0 ? Math.max(...objs.map((obj) => obj.id)) + 1 : 0;

export const parsePoll = (poll: DbPoll) => ({
  ...poll,
  schema: JSON.parse(poll.schema),
});

export const parsePollResponse = (pollResponse: DbPollResponse) => ({
  ...pollResponse,
  data: JSON.parse(pollResponse.data),
});
