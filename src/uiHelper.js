export const getQuizScrore = async (quizId, quizSubmission) => {
  return await fetch(
    `https://asia-south1-genlent-8aab7.cloudfunctions.net/skillRazr/getQuizScore`,
    {
      headers: {
        "X-Firebase-AppCheck": `appCheckTokenResponse.token`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ quizId, quizSubmission }),
    }
  ).then((resp) => resp.json());
};

export const getQuiz = async (quizId) => {
  return await fetch(
    `https://asia-south1-genlent-8aab7.cloudfunctions.net/skillRazr/getQuiz`,
    {
      headers: {
        "X-Firebase-AppCheck": `appCheckTokenResponse.token`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ quizId }),
    }
  ).then((resp) => resp.json());
};

export const getQuizes = async () => {
  return await fetch(
    `https://asia-south1-genlent-8aab7.cloudfunctions.net/skillRazr/getAllQuizes`,
    {
      headers: {
        "X-Firebase-AppCheck": `appCheckTokenResponse.token`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({}),
    }
  ).then((resp) => resp.json());
};

export const getCompletionText = async (query, prompt = "", apiKey = "") => {
  return await fetch(
    `https://asia-south1-genlent-8aab7.cloudfunctions.net/skillRazr/getCompletionText`,
    {
      headers: {
        "X-Firebase-AppCheck": `appCheckTokenResponse.token`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ query, prompt, apiKey }),
    }
  ).then((resp) => resp.json());
};

export const getScore = (answerObj, submissionObj) => {
  const totalQuestions = Object.keys(answerObj).length;

  let correctAnswers = 0;
  Object.keys(answerObj).forEach((questionId) => {
    if (answerObj[questionId] === submissionObj[questionId]) {
      correctAnswers++;
    }
  });

  return (correctAnswers / totalQuestions) * 100;
};

export const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const getQuizFromString = (quizString) => {
  const questionAnswers = quizString.slice(1).split("\n\n");

  console.log("all qas", questionAnswers);

  const questions = [];
  questionAnswers.forEach((qAStr, index) => {
    const arr = qAStr.split("\n");
    console.log("arr", arr);
    const [question, ...optionWithAnswer] = arr;
    console.log("question", question);
    console.log("options", optionWithAnswer.slice(0, -1));
    // console.log("answer", optionWithAnswer[optionWithAnswer.length - 1]);
    // const answer = optionWithAnswer[optionWithAnswer.length - 1];

    questions.push({
      id: (index + 1).toString(),
      options: optionWithAnswer,
      title: question,
    });
  });

  // return questions;

  return {
    questions,
    title: "",
    id: "",
    description: "",
    answers: {},
  };
};

export const getQuizQuestionsFromString = (quizString) => {
  const questionAndAnswers = quizString.slice(1).split("\n  \n");

  console.log("all qas", questionAndAnswers);

  const questions = [];
  const answers = {};
  questionAndAnswers.forEach((qAStr, index) => {
    const arr = qAStr.split("\n");
    console.log("arr", arr);
    const [question, ...optionWithAnswer] = arr;
    console.log("question", question);
    console.log("options", optionWithAnswer.slice(0, -1));
    const options = optionWithAnswer.slice(0, -1);
    // console.log("answer", optionWithAnswer[optionWithAnswer.length - 1]);
    const answer = optionWithAnswer[optionWithAnswer.length - 1];
    console.log("anwer", answer);

    const id = (index + 1).toString();
    answers[id] = answer.replace("answer: ", "");
    questions.push({
      id,
      options,
      title: question,
    });
  });

  return { questions, answers };
};

export const getTruncatedPubkey = (pubkey) => {
  const strlen = pubkey.length;

  return pubkey.substring(0, 4) + "..." + pubkey.substring(strlen - 4);
};
