export const Counter = (array: string[]) => {
  const counter: { answer: string; count: number }[] = [];

  array.forEach((value) => {
    const answer = counter.find((ans) => ans.answer === value);

    if (answer === undefined) {
      counter.push({ answer: value, count: 1 });
    } else {
      answer.count += 1;
    }
  });

  return counter;
};
