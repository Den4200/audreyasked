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

  // Move N/A to last element
  const na = counter.findIndex((entry) => entry.answer === 'N/A');
  if (na !== -1) {
    const naCount = counter[na]!.count;
    counter.splice(na, 1);
    counter.push({ answer: 'N/A', count: naCount });
  }

  return counter;
};
