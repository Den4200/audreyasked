import { forwardRef } from 'react';

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
                className="text-gray-400 hover:text-gray-700 ml-1 -mt-1"
                onClick={() =>
                  removeAnswer(props.sectionID, question.id, answer.id)
                }
                tabIndex={-1}
              >
                x
              </button>
            </div>
          ))}
          <Button
            className="rounded-full p-2 w-10 h-10 text-2xl leading-3 scale-[0.64]"
            onClick={() => addAnswer(props.sectionID, question.id)}
          >
            +
          </Button>
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
                name={question.id.toString()}
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
                className="text-gray-400 hover:text-gray-700 ml-1 -mt-1"
                onClick={() =>
                  removeAnswer(props.sectionID, question.id, answer.id)
                }
                tabIndex={-1}
              >
                x
              </button>
            </div>
          ))}
          <Button
            className="rounded-full p-2 w-10 h-10 text-2xl leading-3 scale-[0.64]"
            onClick={() => addAnswer(props.sectionID, question.id)}
          >
            +
          </Button>
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
            className="border-2 border-pink-300 p-4 rounded"
          >
            <Button
              className="float-right text-white -mt-8 -mr-8 rounded-full text-sm w-8 h-8 leading-3"
              onClick={() => removeSection(section.id)}
              tabIndex={-1}
            >
              x
            </Button>

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
                  <button
                    className="float-right text-gray-400 hover:text-gray-700 mt-2"
                    onClick={() => removeQuestion(section.id, question.id)}
                    tabIndex={-1}
                  >
                    x
                  </button>
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
                <Button
                  className="rounded-full p-2 w-10 h-10 text-2xl leading-3"
                  onClick={() => addQuestion(section.id)}
                >
                  +
                </Button>
              </div>
            </div>
          </div>
        ))}

        <div className="flex justify-center">
          <Button
            className="rounded-full p-2 w-10 h-10 text-2xl leading-3"
            onClick={addSection}
          >
            +
          </Button>
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
