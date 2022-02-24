import { useEffect, useState } from 'react';

import usePoll from '@/hooks/poll';
import { PollResponseData } from '@/utils/types';

const usePollResponse = (pollId?: string) => {
  const { poll, setPollId } = usePoll(pollId);
  const [pollResponse, setPollResponse] = useState<PollResponseData>({
    sections: [],
  });

  useEffect(() => {
    if (!poll) {
      return;
    }

    setPollResponse({
      sections: poll.schema.sections.map((section) => ({
        id: section.id,
        questions: section.questions.map((question) => ({
          id: question.id,
          answers: [],
        })),
      })),
    });
  }, [poll]);

  const setAnswer = (sectionId: number, questionId: number, values: string[]) =>
    setPollResponse((response) => ({
      sections: response.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              questions: section.questions.map((question) =>
                question.id === questionId
                  ? {
                      ...question,
                      answers: values,
                    }
                  : question
              ),
            }
          : section
      ),
    }));

  const setCheckboxAnswer = (
    sectionId: number,
    questionId: number,
    answerId: string
  ) => {
    const { answers } = pollResponse.sections
      .find((section) => section.id === sectionId)!
      .questions.find((question) => question.id === questionId)!;

    if (answers.includes(answerId)) {
      setAnswer(
        sectionId,
        questionId,
        answers.filter((answer) => answer !== answerId)
      );
    } else {
      setAnswer(sectionId, questionId, [...answers, answerId]);
    }
  };

  return {
    poll,
    setPollId,
    pollResponse,
    setAnswer,
    setCheckboxAnswer,
  };
};

export default usePollResponse;
