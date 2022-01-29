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

export interface PollSchema {
  title: string;
  sections: Section[];
}

export const newID = (objs: ObjectID[]) =>
  objs.length !== 0 ? Math.max(...objs.map((obj) => obj.id)) + 1 : 0;
