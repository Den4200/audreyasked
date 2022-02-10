import { createContext, ReactNode, useContext, useState } from 'react';

import {
  Answer,
  newID,
  PollSchema,
  Question,
  QuestionType,
} from '@/utils/types';

type PollSchemaContextType = {
  pollSchema: PollSchema;
  setPollSchema: (pollSchema: PollSchema) => void;
  resetPollSchema: () => void;
  setTitle: (title: string) => void;
  setAuthRequired: (authRequired: boolean) => void;
  addSection: () => void;
  removeSection: (id: number) => void;
  setSectionTitle: (sectionID: number, title: string) => void;
  setSectionQuestionType: (
    sectionID: number,
    type: keyof typeof QuestionType
  ) => void;
  addQuestion: (sectionID: number) => void;
  moveQuestion: (sectionID: number, questionID: number, dr: number) => void;
  getQuestion: (sectionID: number, questionID: number) => Question;
  setQuestion: (sectionID: number, questionID: number, value: string) => void;
  switchQuestionType: (sectionID: number, questionID: number) => void;
  duplicateQuestion: (sectionID: number, questionID: number) => void;
  removeQuestion: (sectionID: number, questionID: number) => void;
  addAnswer: (sectionID: number, questionID: number) => void;
  setAnswer: (
    sectionID: number,
    questionID: number,
    answerID: number,
    value: string
  ) => void;
  removeAnswer: (
    sectionID: number,
    questionID: number,
    answerID: number
  ) => void;
};

type PollSchemaProviderProps = {
  children: ReactNode;
};

const PollSchemaContext = createContext<PollSchemaContextType>(undefined!);

export const PollSchemaProvider = (props: PollSchemaProviderProps) => {
  const [pollSchema, setPollSchema] = useState<PollSchema>({
    title: '',
    authRequired: false,
    sections: [],
  });

  const resetPollSchema = () =>
    setPollSchema({
      title: '',
      authRequired: false,
      sections: [],
    });

  const setTitle = (title: string) => setPollSchema({ ...pollSchema, title });

  const setAuthRequired = (authRequired: boolean) =>
    setPollSchema({ ...pollSchema, authRequired });

  const addSection = () =>
    setPollSchema({
      ...pollSchema,
      sections: [
        ...pollSchema.sections,
        {
          id: newID(pollSchema.sections),
          title: '',
          questions: [],
          addQuestionType: 'Checkbox',
        },
      ],
    });

  const getSection = (sectionID: number) =>
    pollSchema.sections.find((section) => section.id === sectionID)!;

  const removeSection = (id: number) =>
    setPollSchema({
      ...pollSchema,
      sections: pollSchema.sections.filter((section) => section.id !== id),
    });

  const setSectionTitle = (sectionID: number, title: string) =>
    setPollSchema({
      ...pollSchema,
      sections: pollSchema.sections.map((section) =>
        section.id === sectionID ? { ...section, title } : section
      ),
    });

  const setSectionQuestionType = (
    sectionID: number,
    type: keyof typeof QuestionType
  ) =>
    setPollSchema({
      ...pollSchema,
      sections: pollSchema.sections.map((section) =>
        section.id === sectionID
          ? { ...section, addQuestionType: type }
          : section
      ),
    });

  const addQuestion = (
    sectionID: number,
    question?: string,
    answers?: Answer[]
  ) =>
    setPollSchema({
      ...pollSchema,
      sections: pollSchema.sections.map((section) =>
        section.id === sectionID
          ? {
              ...section,
              questions: [
                ...section.questions,
                {
                  id: newID(section.questions),
                  type: QuestionType[section.addQuestionType!],
                  question: question || '',
                  answers: answers || [],
                },
              ],
            }
          : section
      ),
    });

  const moveQuestion = (sectionID: number, questionID: number, dr: number) => {
    const sect = getSection(sectionID);
    const sectQuestions = sect.questions.filter(
      (question) => question.id !== questionID
    );
    const questionIndex = sect.questions.findIndex(
      (question) => question.id === questionID
    )!;
    const sliceIndex =
      (questionIndex + dr < 0
        ? sectQuestions.length + dr + 1
        : questionIndex + dr) %
      (sectQuestions.length + 1);

    setPollSchema({
      ...pollSchema,
      sections: pollSchema.sections.map((section) =>
        section.id === sectionID
          ? {
              ...section,
              questions: [
                ...sectQuestions.slice(0, sliceIndex),
                section.questions[questionIndex]!,
                ...sectQuestions.slice(sliceIndex),
              ],
            }
          : section
      ),
    });
  };

  const getQuestion = (sectionID: number, questionID: number) =>
    pollSchema.sections
      .find((section) => section.id === sectionID)!
      .questions.find((question) => question.id === questionID)!;

  const getQuestionIndex = (sectionID: number, questionID: number) =>
    pollSchema.sections
      .find((section) => section.id === sectionID)!
      .questions.findIndex((question) => question.id === questionID);

  const setQuestion = (sectionID: number, questionID: number, value: string) =>
    setPollSchema({
      ...pollSchema,
      sections: pollSchema.sections.map((section) =>
        section.id === sectionID
          ? {
              ...section,
              questions: section.questions.map((question) =>
                question.id === questionID
                  ? { ...question, question: value }
                  : question
              ),
            }
          : section
      ),
    });

  const switchQuestionType = (sectionID: number, questionID: number) =>
    setPollSchema({
      ...pollSchema,
      sections: pollSchema.sections.map((section) =>
        section.id === sectionID
          ? {
              ...section,
              questions: section.questions.map((question) =>
                question.id === questionID
                  ? {
                      ...question,
                      type:
                        question.type === QuestionType.Checkbox
                          ? QuestionType.Radio
                          : question.type === QuestionType.Radio
                          ? QuestionType.Checkbox
                          : question.type,
                    }
                  : question
              ),
            }
          : section
      ),
    });

  const duplicateQuestion = (sectionID: number, questionID: number) => {
    const question = getQuestion(sectionID, questionID);
    const questionIndex = getQuestionIndex(sectionID, questionID) + 1;

    setPollSchema({
      ...pollSchema,
      sections: pollSchema.sections.map((section) =>
        section.id === sectionID
          ? {
              ...section,
              questions: [
                ...section.questions.slice(0, questionIndex),
                {
                  ...question,
                  id: newID(section.questions),
                },
                ...section.questions.slice(questionIndex),
              ],
            }
          : section
      ),
    });
  };

  const removeQuestion = (sectionID: number, questionID: number) =>
    setPollSchema({
      ...pollSchema,
      sections: pollSchema.sections.map((section) =>
        section.id === sectionID
          ? {
              ...section,
              questions: section.questions.filter(
                (question) => question.id !== questionID
              ),
            }
          : section
      ),
    });

  const addAnswer = (sectionID: number, questionID: number) =>
    setPollSchema({
      ...pollSchema,
      sections: pollSchema.sections.map((section) =>
        section.id === sectionID
          ? {
              ...section,
              questions: section.questions.map((question) =>
                question.id === questionID
                  ? {
                      ...question,
                      answers: [
                        ...question.answers,
                        {
                          id: newID(question.answers),
                          value: '',
                        },
                      ],
                    }
                  : question
              ),
            }
          : section
      ),
    });

  const setAnswer = (
    sectionID: number,
    questionID: number,
    answerID: number,
    value: string
  ) =>
    setPollSchema({
      ...pollSchema,
      sections: pollSchema.sections.map((section) =>
        section.id === sectionID
          ? {
              ...section,
              questions: section.questions.map((question) =>
                question.id === questionID
                  ? {
                      ...question,
                      answers: question.answers.map((answer) =>
                        answer.id === answerID ? { ...answer, value } : answer
                      ),
                    }
                  : question
              ),
            }
          : section
      ),
    });

  const removeAnswer = (
    sectionID: number,
    questionID: number,
    answerID: number
  ) =>
    setPollSchema({
      ...pollSchema,
      sections: pollSchema.sections.map((section) =>
        section.id === sectionID
          ? {
              ...section,
              questions: section.questions.map((question) =>
                question.id === questionID
                  ? {
                      ...question,
                      answers: question.answers.filter(
                        (answer) => answer.id !== answerID
                      ),
                    }
                  : question
              ),
            }
          : section
      ),
    });

  return (
    <PollSchemaContext.Provider
      value={{
        pollSchema,
        setPollSchema,
        resetPollSchema,
        setTitle,
        setAuthRequired,
        addSection,
        setSectionTitle,
        setSectionQuestionType,
        removeSection,
        addQuestion,
        moveQuestion,
        getQuestion,
        setQuestion,
        switchQuestionType,
        duplicateQuestion,
        removeQuestion,
        addAnswer,
        setAnswer,
        removeAnswer,
      }}
    >
      {props.children}
    </PollSchemaContext.Provider>
  );
};

export const usePollSchema = () => useContext(PollSchemaContext);
