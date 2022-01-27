import { createContext, ReactNode, useContext, useState } from 'react';

import { newID, PollSchema, Question, QuestionType } from '@/utils/types';

type PollSchemaContextType = {
  pollSchema: PollSchema;
  setPollSchema: (pollSchema: PollSchema) => void;
  resetPollSchema: () => void;
  setTitle: (title: string) => void;
  addSection: () => void;
  removeSection: (id: number) => void;
  setSectionTitle: (sectionID: number, title: string) => void;
  setSectionQuestionType: (
    sectionID: number,
    type: keyof typeof QuestionType
  ) => void;
  addQuestion: (sectionID: number) => void;
  getQuestion: (sectionID: number, questionID: number) => Question;
  setQuestion: (sectionID: number, questionID: number, value: string) => void;
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
    sections: [],
  });

  const resetPollSchema = () =>
    setPollSchema({
      title: '',
      sections: [],
    });

  const setTitle = (title: string) => setPollSchema({ ...pollSchema, title });

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

  const addQuestion = (sectionID: number) =>
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
                  sectionID,
                  type: QuestionType[section.addQuestionType!],
                  question: '',
                  answers: [],
                },
              ],
            }
          : section
      ),
    });

  const getQuestion = (sectionID: number, questionID: number) =>
    pollSchema.sections
      .find((section) => section.id === sectionID)!
      .questions.find((question) => question.id === questionID)!;

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
                          sectionID,
                          questionID,
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
        addSection,
        setSectionTitle,
        setSectionQuestionType,
        removeSection,
        addQuestion,
        getQuestion,
        setQuestion,
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
