import { useEffect, useState } from 'react';

import { ResponsiveBar } from '@nivo/bar';
import { useRouter } from 'next/router';

import { usePollSchema } from '@/hooks/pollSchema';
import { useAuth } from '@/lib/auth';
import axios from '@/lib/axios';
import Main from '@/templates/Main';
import responseCounter from '@/utils/responseCounter';
import { PollResponse, QuestionType } from '@/utils/types';

const PollResponses = () => {
  const router = useRouter();
  const { pollSchema, setPollSchema } = usePollSchema();
  const [pollResponses, setPollResponses] = useState<PollResponse[]>([]);

  useEffect(() => {
    const applyPollSchema = async () => {
      if (!router.query.id) {
        return;
      }

      const { data } = await axios.get(`polls/${router.query.id}`);
      setPollSchema(data.poll.schema);
    };
    applyPollSchema();
  }, [router.query.id, setPollSchema]);

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

  const aggregatedResponses = pollSchema.sections.map((section) => ({
    id: section.id,
    title: section.title,
    questions: section.questions.map((question) => ({
      id: question.id,
      question: question.question,
      responses:
        question.type === QuestionType.Text
          ? responseCounter(
              pollResponses
                .map(
                  (response) =>
                    response.data.sections
                      .find((s) => s.id === section.id)
                      ?.questions.find((q) => q.id === question.id)
                      ?.answers || ['N/A']
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
                    pollSchema.sections
                      .find((sec) => sec.id === section.id)
                      ?.questions.find((ques) => ques.id === question.id)
                      ?.answers.find(
                        (answer) => answer.id === parseInt(answerId, 10)
                      )?.value || 'N/A'
                )
            ),
    })),
  }));

  return useAuth(
    <Main
      title={pollSchema.title}
      description={`${pollResponses.length} response${
        pollResponses.length === 1 ? '' : 's'
      }!`}
    >
      <div className="mt-2 space-y-8">
        {aggregatedResponses.map((section) => (
          <div
            key={section.id}
            className="border-2 border-pink-300 p-4 rounded bg-white"
          >
            <div className="space-y-4 mt-2">
              <h2 className="text-3xl font-semibold text-center">
                {section.title}
              </h2>
              <hr className="border-gray-300" />
              {section.questions.map((question) => (
                <div key={`${section.id}-${question.id}`} className="group">
                  <h3 className="text-xl font-semibold text-center">
                    {question.question}
                  </h3>

                  {pollSchema.sections
                    .find((s) => s.id === section.id)!
                    .questions.find((q) => q.id === question.id)!.type ===
                  QuestionType.Text ? (
                    <ul className="md:h-72 h-64 border mt-2 border-pink-300 overflow-y-auto rounded px-2">
                      {question.responses.map((response) => (
                        <li
                          key={response.answer}
                          className="flex justify-between border-t first:border-t-0 p-2 border-pink-200"
                        >
                          <p>{response.answer}</p>
                          {response.count > 1 ? (
                            <p className="text-gray-400">({response.count})</p>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="md:h-72 h-64">
                      <ResponsiveBar
                        keys={['count']}
                        indexBy="answer"
                        data={question.responses}
                        colors={{ scheme: 'pastel1' }}
                        margin={{ top: 16, right: 16, bottom: 24, left: 32 }}
                      />
                    </div>
                  )}
                  <hr className="mt-4 group-last:border-0 group-last:mt-2" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Main>
  );
};

export default PollResponses;
