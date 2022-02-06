import { forwardRef } from 'react';

import {
  ChevronDownIcon,
  ChevronUpIcon,
  DuplicateIcon,
  XIcon,
} from '@heroicons/react/outline';
import { PlusCircleIcon, XCircleIcon } from '@heroicons/react/solid';

import Button from '@/components/Button';
import CheckboxElement from '@/components/Checkbox';
import ConfettiForm from '@/components/ConfettiForm';
import Dropdown from '@/components/Dropdown';
import RadioButton from '@/components/RadioButton';
import TextInput, { TextInputProps } from '@/components/TextInput';
import { usePollSchema } from '@/hooks/pollSchema';
import Main from '@/templates/Main';
import clsxm from '@/utils/clsxm';
import { QuestionType } from '@/utils/types';

const QuestionInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ className, ...rest }, ref) => (
    <TextInput
      className={clsxm(
        'text-xl font-semibold border-dotted focus:border-solid focus:ring-0 px-2 mr-3 leading-10',
        className
      )}
      placeholder="Question here.."
      ref={ref}
      {...rest}
    />
  )
);

const AnswerOptionInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ className, ...rest }, ref) => (
    <TextInput
      className={clsxm(
        'border-dotted focus:border-solid focus:ring-0 leading-5',
        className
      )}
      placeholder="Answer here.."
      ref={ref}
      {...rest}
    />
  )
);

type QuestionElementProps = {
  sectionID: number;
  questionID: number;
};

type PollEditorProps = {
  submitText: string;
  onSubmit: () => void;
  title: string;
  description: string;
};

const QuestionElement = (props: QuestionElementProps) => {
  const { getQuestion, setQuestion, addAnswer, setAnswer, removeAnswer } =
    usePollSchema();
  const question = getQuestion(props.sectionID, props.questionID);

  switch (question.type) {
    case QuestionType.Checkbox:
      return (
        <div className="flex flex-col space-y-2">
          <QuestionInput
            onChange={(event) =>
              setQuestion(props.sectionID, question.id, event.target.value)
            }
            value={question.question}
          />
          {question.answers.map((answer) => (
            <div
              key={`${props.sectionID}-${question.id}-${answer.id}`}
              className="flex"
            >
              <CheckboxElement className="ml-2 mr-4" />
              <AnswerOptionInput
                onChange={(event) =>
                  setAnswer(
                    props.sectionID,
                    question.id,
                    answer.id,
                    event.target.value
                  )
                }
                value={answer.value}
              />
              <button
                className="text-gray-400 hover:text-gray-500 ml-1 w-4"
                onClick={() =>
                  removeAnswer(props.sectionID, question.id, answer.id)
                }
                tabIndex={-1}
              >
                <XIcon />
              </button>
            </div>
          ))}
          <button
            className="text-pink-400 hover:text-pink-500 rounded-full w-8 transition-colors duration-500 ml-1"
            onClick={() => addAnswer(props.sectionID, question.id)}
          >
            <PlusCircleIcon />
          </button>
        </div>
      );

    case QuestionType.Radio:
      return (
        <div className="flex flex-col space-y-2">
          <QuestionInput
            onChange={(event) =>
              setQuestion(props.sectionID, question.id, event.target.value)
            }
            value={question.question}
          />
          {question.answers.map((answer) => (
            <div
              key={`${props.sectionID}-${question.id}-${answer.id}`}
              className="flex"
            >
              <RadioButton
                name={`${props.sectionID}-${question.id}`}
                className="ml-2 mr-4"
              />
              <AnswerOptionInput
                onChange={(event) =>
                  setAnswer(
                    props.sectionID,
                    question.id,
                    answer.id,
                    event.target.value
                  )
                }
                value={answer.value}
              />
              <button
                className="text-gray-400 hover:text-gray-500 ml-1 w-4"
                onClick={() =>
                  removeAnswer(props.sectionID, question.id, answer.id)
                }
                tabIndex={-1}
              >
                <XIcon />
              </button>
            </div>
          ))}
          <button
            className="text-pink-400 hover:text-pink-500 rounded-full w-8 transition-colors duration-500 ml-1"
            onClick={() => addAnswer(props.sectionID, question.id)}
          >
            <PlusCircleIcon />
          </button>
        </div>
      );

    case QuestionType.Text:
      return (
        <div className="flex flex-col space-y-2">
          <QuestionInput
            onChange={(event) =>
              setQuestion(props.sectionID, question.id, event.target.value)
            }
            value={question.question}
          />
          <TextInput className="mr-3" />
        </div>
      );

    default:
      return <></>;
  }
};

const PollEditor = (props: PollEditorProps) => {
  const {
    pollSchema,
    addSection,
    removeSection,
    setTitle,
    setSectionTitle,
    setSectionQuestionType,
    addQuestion,
    moveQuestion,
    duplicateQuestion,
    removeQuestion,
  } = usePollSchema();

  return (
    <Main title={props.title} description={props.description}>
      <TextInput
        className="w-full text-3xl font-semibold border-dotted focus:border-solid focus:ring-0 leading-[3.25rem] mb-4 px-2"
        placeholder="Poll title here.."
        onChange={(event) => setTitle(event.target.value)}
        value={pollSchema.title}
      />
      <div className="mt-2 space-y-8">
        {pollSchema.sections.map((section) => (
          <div
            key={section.id}
            className="border-2 border-pink-300 p-4 rounded bg-white"
          >
            <button
              className="float-right text-pink-400 hover:text-pink-500 transition-colors duration-500 -mt-9 -mr-9 w-10 bg-pink-50 rounded-full"
              onClick={() => removeSection(section.id)}
              tabIndex={-1}
            >
              <XCircleIcon />
            </button>

            <div className="flex flex-col space-y-4 mt-2">
              <TextInput
                className="text-2xl font-semibold border-dotted focus:border-solid focus:ring-0 leading-10 px-2"
                placeholder="Section title here.."
                onChange={(event) =>
                  setSectionTitle(section.id, event.target.value)
                }
                value={section.title}
              />
              <hr />
              {section.questions.map((question) => (
                <div key={`${section.id}-${question.id}`}>
                  <div className="grid grid-cols-2 grid-rows-2 gap-2 float-right text-gray-400 w-11">
                    <ChevronUpIcon
                      className="cursor-pointer hover:text-gray-500"
                      onClick={() => moveQuestion(section.id, question.id, -1)}
                    />
                    <XIcon
                      className="cursor-pointer hover:text-gray-500"
                      onClick={() => removeQuestion(section.id, question.id)}
                    />
                    <ChevronDownIcon
                      className="cursor-pointer hover:text-gray-500"
                      onClick={() => moveQuestion(section.id, question.id, 1)}
                    />
                    <DuplicateIcon
                      className="cursor-pointer hover:text-gray-500"
                      onClick={() => duplicateQuestion(section.id, question.id)}
                    />
                  </div>
                  <QuestionElement
                    sectionID={section.id}
                    questionID={question.id}
                  />
                  <hr className="mt-4" />
                </div>
              ))}
            </div>

            <div className="mt-4 px-3 py-2 border border-pink-300 rounded">
              <div className="flex justify-between items-center">
                <div className="flex-col">
                  <h3 className="font-semibold mb-1">Add question</h3>
                  <Dropdown
                    className=""
                    options={Object.keys(QuestionType).filter(
                      (type) => !(parseInt(type, 10) >= 0)
                    )}
                    onChange={(event) =>
                      setSectionQuestionType(
                        section.id,
                        event.target.value as keyof typeof QuestionType
                      )
                    }
                    value={section.addQuestionType}
                  />
                </div>
                <button
                  className="text-pink-400 hover:text-pink-500 rounded-full w-12 transition-colors duration-500"
                  onClick={() => addQuestion(section.id)}
                >
                  <PlusCircleIcon />
                </button>
              </div>
            </div>
          </div>
        ))}

        <div className="flex justify-center">
          <button
            className="text-pink-400 hover:text-pink-500 rounded-full w-16 transition-colors duration-500"
            onClick={addSection}
          >
            <PlusCircleIcon />
          </button>
        </div>
        <hr className="border-gray-300" />
        <ConfettiForm className="flex justify-center" onSubmit={props.onSubmit}>
          <Button className="mb-4 px-4 py-2 text-xl">{props.submitText}</Button>
        </ConfettiForm>
      </div>
    </Main>
  );
};

export default PollEditor;
