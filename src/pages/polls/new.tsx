import { useState } from 'react';

import Button from '@/components/Button';
import CheckboxElement from '@/components/Checkbox';
import ConfettiForm from '@/components/ConfettiForm';
import Dropdown from '@/components/Dropdown';
import RadioButton from '@/components/RadioButton';
import TextInput from '@/components/TextInput';
import Meta from '@/layout/Meta';
import Main from '@/templates/Main';

interface ObjectID {
  id: number;
}

interface Answer extends ObjectID {
  value: string;
}

enum QuestionType {
  Checkbox,
  Radio,
  Text,
}

interface Question extends ObjectID {
  type: QuestionType;
  question?: string;
  answers?: string[];
}

interface Section extends ObjectID {
  questions: Question[];
  addQuestionType: keyof typeof QuestionType;
}

const newID = (objs: ObjectID[]) =>
  objs.length !== 0 ? Math.max(...objs.map((obj) => obj.id)) + 1 : 0;

const QuestionInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ className, ...rest }, ref) => (
    <TextInput
      className={clsxm(
        'text-xl font-semibold border-dotted focus:border-solid focus:ring-0 px-2 -ml-1 mr-3 leading-10',
        className
      )}
      placeholder="Question here.."
      ref={ref}
      {...rest}
    />
  )
);

const QuestionElement = (props: Question) => {
  const [question, setQuestion] = useState<string>(props.question || '');
  const [answers, setAnswers] = useState<Answer[]>(
    props.answers?.map((answer, id) => {
      return { id, value: answer };
    }) || []
  );

  const addAnswer = (value: string) =>
    setAnswers([
      ...answers,
      {
        id: newID(answers),
        value,
      },
    ]);

  const setAnswer = (id: number, value: string) =>
    setAnswers(
      answers.map((answer) => (answer.id === id ? { id, value } : answer))
    );

  const removeAnswer = (id: number) =>
    setAnswers(answers.filter((answer) => answer.id !== id));

  switch (props.type) {
    case QuestionType.Checkbox:
      return (
        <div className="flex flex-col space-y-2">
          <QuestionInput
            onChange={(event) => setQuestion(event.target.value)}
            value={question}
          />
          {answers.map((answer) => (
            <div key={`${props.id}-${answer.id}`} className="flex">
              <CheckboxElement className="mr-4" />
              <TextInput
                className="border-dotted focus:border-solid focus:ring-0 leading-5"
                onChange={(event) => setAnswer(answer.id, event.target.value)}
                value={answer.value}
                placeholder="Answer here.."
              />
              <button
                className="text-gray-400 hover:text-gray-700 ml-1 -mt-1"
                onClick={() => removeAnswer(answer.id)}
                tabIndex={-1}
              >
                x
              </button>
            </div>
          ))}
          <Button
            className="rounded-full p-2 w-10 h-10 text-2xl leading-3 scale-[0.64] -ml-2"
            onClick={() => addAnswer('')}
          >
            +
          </Button>
        </div>
      );

    case QuestionType.Radio:
      return (
        <div className="flex flex-col space-y-2">
          <QuestionInput
            onChange={(event) => setQuestion(event.target.value)}
            value={question}
          />
          {answers.map((answer) => (
            <div key={`${props.id}-${answer.id}`} className="flex">
              <RadioButton name={props.id.toString()} className="mr-4" />
              <TextInput
                className="border-dotted focus:border-solid focus:ring-0 leading-5"
                onChange={(event) => setAnswer(answer.id, event.target.value)}
                value={answer.value}
                placeholder="Answer here.."
              />
              <button
                className="text-gray-400 hover:text-gray-700 ml-1 -mt-1"
                onClick={() => removeAnswer(answer.id)}
                tabIndex={-1}
              >
                x
              </button>
            </div>
          ))}
          <Button
            className="rounded-full p-2 w-10 h-10 text-2xl leading-3 scale-[0.64] -ml-2"
            onClick={() => addAnswer('')}
          >
            +
          </Button>
        </div>
      );

    case QuestionType.Text:
      return (
        <div className="flex flex-col space-y-2">
          <QuestionInput
            onChange={(event) => setQuestion(event.target.value)}
            value={question}
          />
          <TextInput />
        </div>
      );

    default:
      return <></>;
  }
};

const NewPoll = () => {
  const [title, setTitle] = useState<string>();
  const [sections, setSections] = useState<Section[]>([]);

  const addSection = () =>
    setSections([
      ...sections,
      {
        id: newID(sections),
        questions: [],
        addQuestionType: 'Checkbox',
      },
    ]);

  const setSectionQuestionType = (
    sectionID: number,
    type: keyof typeof QuestionType
  ) =>
    setSections(
      sections.map((section) =>
        section.id === sectionID
          ? { ...section, addQuestionType: type }
          : section
      )
    );

  const removeSection = (id: number) =>
    setSections(sections.filter((section) => section.id !== id));

  const addQuestion = (sectionID: number) =>
    setSections(
      sections.map((section) =>
        section.id === sectionID
          ? {
              ...section,
              questions: [
                ...section.questions,
                {
                  id: newID(section.questions),
                  type: QuestionType[section.addQuestionType!],
                },
              ],
            }
          : section
      )
    );

  const removeQuestion = (sectionID: number, questionID: number) => {
    setSections(
      sections.map((section) =>
        section.id === sectionID
          ? {
              ...section,
              questions: section.questions.filter(
                (question) => question.id !== questionID
              ),
            }
          : section
      )
    );
  };

  return (
    <Main
      meta={<Meta title="New Poll" description="Create a new poll here!" />}
    >
      <TextInput
        className="w-full text-2xl font-semibold border-dotted focus:border-solid focus:ring-0 leading-10 mb-4 px-2"
        placeholder="Title here.."
        onChange={(event) => setTitle(event.target.value)}
        value={title}
      />
      <div className="mt-2 space-y-8">
        {sections.map((section) => (
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
              {section.questions.map((question) => (
                <div key={`${section.id}-${question.id}`}>
                  <button
                    className="float-right text-gray-400 hover:text-gray-700 mt-2"
                    onClick={() => removeQuestion(section.id, question.id)}
                    tabIndex={-1}
                  >
                    x
                  </button>
                  <QuestionElement {...question} />
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
        <ConfettiForm className="flex justify-center">
          <Button className="mb-4 px-4 py-2 text-xl">Create poll!</Button>
        </ConfettiForm>
      </div>
    </Main>
  );
};

export default NewPoll;
