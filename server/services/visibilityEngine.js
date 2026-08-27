export const getVisibleQuestions = (questions, answers) => {
  return questions.filter((question) => {
    // Always visible if no condition exists
    if (!question.showIf) {
      return true;
    }

    const conditions = question.showIf;

    // Check every condition
    return Object.entries(conditions).every(([field, value]) => {
      const answer = answers[field];

      if (Array.isArray(answer)) {
        return answer.includes(value);
      }

      return answer === value;
    });
  });
};