import React, { Fragment, useEffect, useState } from 'react';

import { Listbox, Transition } from '@headlessui/react';
import {
  CheckIcon,
  SelectorIcon,
  UserGroupIcon,
  UserIcon,
} from '@heroicons/react/outline';
import { ResponsiveBar } from '@nivo/bar';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import useWebSocket from 'react-use-websocket';

import Checkbox from '@/components/Checkbox';
import Loading from '@/components/Loading';
import RadioButton from '@/components/RadioButton';
import TextInput from '@/components/TextInput';
import usePoll from '@/hooks/poll';
import axios from '@/lib/axios';
import Main from '@/templates/Main';
import clsxm from '@/utils/clsxm';
import responseCounter from '@/utils/responseCounter';
import { PollResponse, Question, QuestionType } from '@/utils/types';

const BAR_COLORS = [
  '#FECDD3',
  '#FBCFE8',
  '#F5D0FE',
  '#E9D5FF',
  '#DDD6FE',
  '#C7D2FE',
  '#BFDBFE',
  '#BAE6FD',
  '#A5F3FC',
  '#99F6E4',
  '#A7F3D0',
  '#BBF7D0',
  '#D9F99D',
  '#FEF08A',
  '#FDE68A',
  '#FED7AA',
  '#FECACA',
];

const OVERALL_RESPONSE = {
  id: 'overall',
  data: { sections: [] },
  user: {
    id: 'overall',
    name: 'Overall',
    image: null,
  },
};

type QuestionElementProps = {
  sectionId: number;
  question: Question;
  response: PollResponse;
};

const QuestionElement = (props: QuestionElementProps) => {
  const { answers } = props.response.data.sections
    .find((section) => section.id === props.sectionId)!
    .questions.find((question) => question.id === props.question.id)!;

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
                checked={
                  answers.find(
                    (answerId) => answerId === answer.id.toString()
                  ) !== undefined
                }
                disabled
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
                name={`${props.sectionId}-${props.question.id}`}
                className="ml-2 mr-4"
                checked={
                  answers.find(
                    (answerId) => answerId === answer.id.toString()
                  ) !== undefined
                }
                disabled
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
          <TextInput readOnly value={answers[0]!} />
        </div>
      );
    default:
      return <></>;
  }
};

const PollResponses = () => {
  const router = useRouter();

  const [wsUrl, setWsUrl] = useState<string | null>(null);
  const { lastJsonMessage } = useWebSocket(wsUrl);

  const { poll, setPollId } = usePoll();
  const [pollResponses, setPollResponses] = useState<PollResponse[]>([]);

  const [selectedResponse, setSelectedResponse] =
    useState<PollResponse>(OVERALL_RESPONSE);

  const { status, data: session } = useSession({ required: false });

  useEffect(() => {
    setPollId(router.query.id?.toString());
  }, [router.query.id, setPollId]);

  useEffect(() => {
    const getPollResponses = async () => {
      if (!router.query.id) {
        return;
      }

      const { data } = await axios.get(`polls/${router.query.id}/responses`);
      setPollResponses(data.responses);
    };
    getPollResponses();
  }, [router.query.id, setPollResponses]);

  useEffect(() => {
    if (!router.query.id) {
      return;
    }

    setWsUrl(
      `${process.env.NODE_ENV === 'production' ? 'wss' : 'ws'}://${
        window.location.host
      }/api/ws?pollId=${router.query.id!.toString()}`
    );
  }, [router.query.id]);

  useEffect(() => {
    if (lastJsonMessage) {
      setPollResponses((resps) => [...resps, lastJsonMessage.pollResponse]);
    }
  }, [lastJsonMessage]);

  const aggregatedResponses = poll.schema.sections.map((section) => ({
    id: section.id,
    title: section.title,
    questions: section.questions.map((question) => ({
      id: question.id,
      type: question.type,
      question: question.question,
      responses: (question.type === QuestionType.Text
        ? responseCounter(
            pollResponses
              .map(
                (response) =>
                  response.data.sections
                    .find((s) => s.id === section.id)
                    ?.questions.find((q) => q.id === question.id)?.answers || [
                    'N/A',
                  ]
              )
              .reduce((prev, curr) => (curr ? [...prev, ...curr] : prev), [])
          ).sort((resp1, resp2) =>
            resp2.answer !== 'N/A' ? resp2.count - resp1.count : -1
          )
        : responseCounter(
            pollResponses
              .map(
                (resp) =>
                  resp.data.sections
                    .find((sec) => sec.id === section.id)
                    ?.questions.find((ques) => ques.id === question.id)
                    ?.answers || ['N/A']
              )
              .reduce((prev, curr) => [...prev, ...curr], [])
              .map(
                (answerId) =>
                  poll.schema.sections
                    .find((sec) => sec.id === section.id)
                    ?.questions.find((ques) => ques.id === question.id)
                    ?.answers.find(
                      (answer) => answer.id === parseInt(answerId, 10)
                    )?.value || 'N/A'
              )
          ).sort((resp1, resp2) =>
            resp2.answer !== 'N/A' ? (resp2.answer < resp1.answer ? 1 : -1) : -1
          )
      ).map((resp, index) => ({
        ...resp,
        color: BAR_COLORS[index % BAR_COLORS.length]!,
      })),
    })),
  }));

  if (status === 'loading') {
    return <Loading />;
  }

  return (
    <Main
      title={`${poll.schema.title} responses`}
      description={`${pollResponses.length} response${
        pollResponses.length === 1 ? '' : 's'
      }!`}
    >
      {session?.user.id === poll.authorId ? (
        <div className="flex justify-center">
          <Listbox value={selectedResponse} onChange={setSelectedResponse}>
            <div className="relative w-11/12 md:w-1/2 mb-4 z-10">
              <Listbox.Button className="w-full focus:outline-none">
                <fieldset className="relative py-2 pl-3 pr-10 text-left bg-white border-2 border-pink-300 rounded">
                  <legend className="text-pink-400 font-semibold -ml-1 -mb-2 px-1">
                    Responses
                  </legend>
                  <span className="block truncate">
                    {selectedResponse.user?.name || 'Anonymous'}
                  </span>
                  <span className="absolute inset-y-0 right-0 flex items-center pr-2">
                    <SelectorIcon className="w-5 text-gray-400" />
                  </span>
                </fieldset>
              </Listbox.Button>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute w-full bg-white border-2 border-pink-300 py-1 mt-1 overflow-auto rounded max-h-80 focus:outline-none shadow-md">
                  {[OVERALL_RESPONSE, ...pollResponses].map((response) => (
                    <Listbox.Option
                      key={response.id}
                      className={({ active }) =>
                        clsxm(
                          'flex cursor-default select-none relative py-2 pl-10 pr-4',
                          active ? 'text-pink-500 bg-pink-100' : 'text-gray-900'
                        )
                      }
                      value={response}
                    >
                      {({ selected, active }) => (
                        <>
                          {response.user?.image ? (
                            <img
                              className="mr-2"
                              src={response.user?.image}
                              width={24}
                              height={24}
                              alt=""
                            />
                          ) : response.id === 'overall' ? (
                            <UserGroupIcon className="w-6 h-6 mr-2" />
                          ) : (
                            <UserIcon className="w-6 h-6 mr-2" />
                          )}
                          <span
                            className={clsxm(
                              'block truncate',
                              selected ? 'font-medium' : 'font-normal'
                            )}
                          >
                            {response.user?.name || 'Anonymous'}
                          </span>
                          {selected ? (
                            <span
                              className={clsxm(
                                'absolute inset-y-0 left-0 flex items-center pl-3',
                                active ? 'text-pink-500' : 'text-pink-500'
                              )}
                            >
                              <CheckIcon className="w-5" />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
        </div>
      ) : null}

      <div className="mt-2 space-y-8">
        {selectedResponse.id === 'overall' ? (
          <>
            {aggregatedResponses.map((section) => (
              <div
                key={section.id}
                className="rounded border-2 border-pink-300 bg-white p-4"
              >
                <div className="mt-2 space-y-4">
                  <h2 className="text-center text-3xl font-semibold">
                    {section.title}
                  </h2>
                  <hr className="border-gray-300" />
                  {section.questions.map((question) => (
                    <div key={`${section.id}-${question.id}`} className="group">
                      <h3 className="text-center text-xl font-semibold">
                        {question.question}
                      </h3>

                      {question.type === QuestionType.Text ? (
                        <ul className="mt-2 h-64 overflow-y-auto rounded border border-pink-300 px-2 md:h-72">
                          {question.responses.map((response) => (
                            <li
                              key={response.answer}
                              className="flex justify-between border-t border-pink-200 p-2 first:border-t-0"
                            >
                              <p>{response.answer}</p>
                              {response.count > 1 ? (
                                <p className="text-gray-400">
                                  ({response.count})
                                </p>
                              ) : null}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="h-64 md:h-72">
                          <ResponsiveBar
                            keys={['count']}
                            indexBy="answer"
                            data={question.responses}
                            colors={(resp) => resp.data.color}
                            margin={{
                              top: 16,
                              right: 16,
                              bottom: 24,
                              left: 32,
                            }}
                          />
                        </div>
                      )}
                      <hr className="mt-4 group-last:mt-2 group-last:border-0" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </>
        ) : (
          <>
            {poll.schema.sections.map((section, sectionIndex) =>
              selectedResponse.data.sections[sectionIndex] ===
              undefined ? null : (
                <div
                  key={section.id}
                  className="rounded border-2 border-pink-300 bg-white p-4"
                >
                  <div className="mt-2 flex flex-col space-y-4">
                    <h2 className="text-2xl font-semibold">{section.title}</h2>
                    <hr />
                    {section.questions.map((question, questionIndex) =>
                      selectedResponse.data.sections[sectionIndex]!.questions[
                        questionIndex
                      ] === undefined ? null : (
                        <div key={question.id} className="group">
                          <QuestionElement
                            sectionId={section.id}
                            question={question}
                            response={selectedResponse}
                          />
                          <hr className="mt-4 group-last:mt-2 group-last:border-0" />
                        </div>
                      )
                    )}
                  </div>
                </div>
              )
            )}
          </>
        )}
      </div>
    </Main>
  );
};

export default PollResponses;
