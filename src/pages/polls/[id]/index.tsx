import { useEffect } from 'react';

import { useRouter } from 'next/router';

import Button from '@/components/Button';
import Checkbox from '@/components/Checkbox';
import ConfettiForm from '@/components/ConfettiForm';
import RadioButton from '@/components/RadioButton';
import TextInput from '@/components/TextInput';
import usePollResponse from '@/hooks/pollResponse';
import { useAuth } from '@/lib/auth';
import axios from '@/lib/axios';
import Main from '@/templates/Main';
import { Question, QuestionType } from '@/utils/types';

type QuestionElementProps = {
  sectionId: number;
  question: Question;
  setAnswer: (values: string) => void;
  setCheckboxAnswer: (answerId: number) => void;
};

const QuestionElement = (props: QuestionElementProps) => {
  switch (props.question.type) {
    case QuestionType.Checkbox:
      return (
        <div className="flex flex-col space-y-2">
          <h3 className="text-xl font-semibold">{props.question.question}</h3>
          {props.question.answers.map((answer) => (
            <div
              key={`${props.sectionId}-${props.question.id}-${answer.id}`}
              className="flex"
            >
              <Checkbox
                className="ml-2 mr-4"
                onClick={() => props.setCheckboxAnswer(answer.id)}
              />
              <p>{answer.value}</p>
            </div>
          ))}
        </div>
      );

    case QuestionType.Radio:
      return (
        <div className="flex flex-col space-y-2">
          <h3 className="text-xl font-semibold">{props.question.question}</h3>
          {props.question.answers.map((answer) => (
            <div
              key={`${props.sectionId}-${props.question.id}-${answer.id}`}
              className="flex"
            >
              <RadioButton
                name={props.question.id.toString()}
                className="ml-2 mr-4"
                onClick={() => props.setAnswer(answer.id.toString())}
              />
              <p>{answer.value}</p>
            </div>
          ))}
        </div>
      );

    case QuestionType.Text:
      return (
        <div className="flex flex-col space-y-2">
          <h3 className="text-xl font-semibold">{props.question.question}</h3>
          <TextInput
            onChange={(event) => props.setAnswer(event.target.value)}
          />
        </div>
      );

    default:
      return <></>;
  }
};

const Poll = () => {
  const router = useRouter();

  const { poll, setPollId, pollResponse, setAnswer, setCheckboxAnswer } =
    usePollResponse();

  const onSubmit = async () => {
    axios.post(`polls/${poll.id}/responses`, {
      response: { data: pollResponse },
    });
    router.push(`/polls/${poll.id}/responses`);
  };

  useEffect(() => {
    const { id } = router.query;
    if (id) {
      setPollId(id.toString());
    }
  }, [router.query, setPollId]);

  return useAuth(
    <Main title={poll.schema.title} description={`Answer a poll!`}>
      <div className="mt-2 space-y-8">
        {poll.schema.sections.map((section) => (
          <div
            key={section.id}
            className="border-2 border-pink-300 p-4 rounded"
          >
            <div className="flex flex-col space-y-4 mt-2">
              <h2 className="text-2xl font-semibold">{section.title}</h2>
              <hr />
              {section.questions.map((question) => (
                <div key={`${section.id}-${question.id}`} className="group">
                  <QuestionElement
                    sectionId={section.id}
                    question={question}
                    setAnswer={(value: string) =>
                      setAnswer(section.id, question.id, [value])
                    }
                    setCheckboxAnswer={(answerId: number) =>
                      setCheckboxAnswer(
                        section.id,
                        question.id,
                        answerId.toString()
                      )
                    }
                  />
                  <hr className="mt-4 group-last:border-0 group-last:mt-2" />
                </div>
              ))}
            </div>
          </div>
        ))}
        <hr className="border-gray-300" />
        <ConfettiForm className="flex justify-center" onSubmit={onSubmit}>
          <Button className="mb-4 px-4 py-2 text-xl">Submit</Button>
        </ConfettiForm>
      </div>
    </Main>
  );
};

export default Poll;
