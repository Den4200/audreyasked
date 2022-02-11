import { forwardRef } from 'react';

import {
  ChevronDownIcon,
  ChevronUpIcon,
  DuplicateIcon,
  SwitchHorizontalIcon,
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
        'mr-3 border-dotted px-2 text-xl font-semibold leading-10 focus:border-solid focus:ring-0',
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
        'border-dotted leading-5 focus:border-solid focus:ring-0',
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
                className="ml-1 w-4 text-gray-400 hover:text-gray-500"
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
            className="ml-1 w-8 rounded-full text-pink-400 transition-colors duration-500 hover:text-pink-500"
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
                className="ml-1 w-4 text-gray-400 hover:text-gray-500"
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
            className="ml-1 w-8 rounded-full text-pink-400 transition-colors duration-500 hover:text-pink-500"
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
    setAuthRequired,
    setSectionTitle,
    setSectionQuestionType,
    addQuestion,
    moveQuestion,
    duplicateQuestion,
    switchQuestionType,
    removeQuestion,
  } = usePollSchema();

  return (
    <Main title={props.title} description={props.description}>
      <fieldset className="rounded border-2 border-pink-300 bg-white px-4 pt-2 pb-4">
        <TextInput
          className="mb-4 w-full border-dotted px-2 text-3xl font-semibold leading-[3.25rem] focus:border-solid focus:ring-0"
          placeholder="Poll title here.."
          onChange={(event) => setTitle(event.target.value)}
          value={pollSchema.title}
        />
        <legend className="text-pink-400 font-semibold -ml-1 px-1">
          Poll Settings
        </legend>
        <div className="flex">
          <CheckboxElement
            className="mr-4"
            onChange={(event) => setAuthRequired(event.target.checked)}
            checked={pollSchema.authRequired}
          />
          Collect users
        </div>
      </fieldset>
      <hr className="my-4 border-gray-300" />

      <div className="space-y-8">
        {pollSchema.sections.map((section) => (
          <div
            key={section.id}
            className="rounded border-2 border-pink-300 bg-white p-4"
          >
            <button
              className="float-right -mt-9 -mr-9 w-10 rounded-full bg-pink-50 text-pink-400 transition-colors duration-500 hover:text-pink-500"
              onClick={() => removeSection(section.id)}
              tabIndex={-1}
            >
              <XCircleIcon />
            </button>

            <div className="mt-2 flex flex-col space-y-4">
              <TextInput
                className="border-dotted px-2 text-2xl font-semibold leading-10 focus:border-solid focus:ring-0"
                placeholder="Section title here.."
                onChange={(event) =>
                  setSectionTitle(section.id, event.target.value)
                }
                value={section.title}
              />
              <hr />
              {section.questions.map((question) => (
                <div key={`${section.id}-${question.id}`}>
                  <div className="float-right grid w-8 grid-cols-2 text-gray-400 md:w-11 md:gap-2">
                    <ChevronUpIcon
                      className="-ml-2 w-5 cursor-pointer hover:text-gray-500 md:ml-0"
                      onClick={() => moveQuestion(section.id, question.id, -1)}
                    />
                    <XIcon
                      className="w-5 cursor-pointer hover:text-gray-500"
                      onClick={() => removeQuestion(section.id, question.id)}
                    />
                    <ChevronDownIcon
                      className="-ml-2 mt-1 w-5 cursor-pointer hover:text-gray-500 md:ml-0  md:mt-0"
                      onClick={() => moveQuestion(section.id, question.id, 1)}
                    />
                    <DuplicateIcon
                      className="mt-1 w-5 cursor-pointer hover:text-gray-500 md:mt-0"
                      onClick={() => duplicateQuestion(section.id, question.id)}
                    />

                    {[QuestionType.Checkbox, QuestionType.Radio].includes(
                      question.type
                    ) ? (
                      <>
                        <div />
                        <SwitchHorizontalIcon
                          className="mt-1 w-5 cursor-pointer hover:text-gray-500"
                          onClick={() =>
                            switchQuestionType(section.id, question.id)
                          }
                        />
                      </>
                    ) : null}
                  </div>
                  <QuestionElement
                    sectionID={section.id}
                    questionID={question.id}
                  />
                  <hr className="mt-4" />
                </div>
              ))}
            </div>

            <div className="mt-4 rounded border border-pink-300 px-3 py-2">
              <div className="flex items-center justify-between">
                <div className="flex-col">
                  <h3 className="mb-1 font-semibold">Add question</h3>
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
                  className="w-12 rounded-full text-pink-400 transition-colors duration-500 hover:text-pink-500"
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
            className="w-16 rounded-full text-pink-400 transition-colors duration-500 hover:text-pink-500"
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
