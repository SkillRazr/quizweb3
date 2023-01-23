/* eslint-disable no-console */
import { useState, useEffect } from "react";
import {
  FormHelperText,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  FormLabel,
  Button,
  Grid,
} from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import PlayCircleFilledWhiteIcon from "@mui/icons-material/PlayCircleFilledWhite";
import AssignmentLateIcon from "@mui/icons-material/AssignmentLate";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import QuizIcon from "@mui/icons-material/Quiz";
import { getScore, shuffleArray } from "../uiHelper";
import confetti from "canvas-confetti";

// quizData in the form {answer: {}, questions: []}

const renderConfetti = () => {
  confetti({
    particleCount: 400,
    spread: 70,
    origin: { y: 0.6 },
  });
};

function Snack(props) {
  const { message } = props;
  const [state, setState] = useState({
    open: true,
    vertical: "top",
    horizontal: "center",
  });
  const { vertical, horizontal, open } = state;

  const handleClose = () => {
    setState({ ...state, open: false });
  };

  return (
    <div>
      <Snackbar
        className="!top-[110px] sm:!top-[70px] cursor-pointer"
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        onClose={handleClose}
        message={message}
        key={vertical + horizontal}
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            sx={{ p: 0.5 }}
            onClick={(e) => {
              handleClose();
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <CloseIcon />
          </IconButton>
        }
      />
    </div>
  );
}

const RenderQuestion = (props) => {
  const {
    question,
    _id,
    unAnswered,
    questionAnswers,
    handleChange,
    isSubmitDisabled,
    answer,
  } = props;
  const isUnanswered = unAnswered.includes(question.id);
  const [optionIndices, setOptionIndices] = useState([]);

  const choices = ["a", "b", "c", "d"];
  useEffect(() => {
    setOptionIndices(
      shuffleArray(Array.from(Array(question.options.length).keys()))
    );
  }, [question.options.length]);

  const radioGroupClass = isSubmitDisabled
    ? questionAnswers[question.id] !== answer
      ? "wrong-ans"
      : "correct-ans"
    : "";
  return (
    <FormControl
      key={_id}
      component="fieldset"
      error={isUnanswered}
      className={`!mt-12 !border !border-solid ${
        isUnanswered ? "!border-red-600" : "!border-stone-600"
      } !rounded !p-4`}
    >
      {isUnanswered && (
        <FormHelperText className="absolute top-0">
          {"Select an answer"}
        </FormHelperText>
      )}
      <FormLabel component="legend">
        <span className="text-black text-xl">{`${_id + 1}*`}</span>{" "}
        <span className="text-black">
          {question.type === "math" ? "Evaluate the math expression" : ""}{" "}
        </span>{" "}
        <span id={`output${_id}`} className="text-black text-xl">
          {question.title}
        </span>
      </FormLabel>
      <FormLabel component="legend">
        <span className="text-black">{question.description}</span>
      </FormLabel>

      <RadioGroup
        className={`options ${radioGroupClass}`}
        aria-label="option"
        name="option"
        id={question.id}
        value={questionAnswers.id}
        onChange={handleChange}
      >
        {optionIndices.map((index) => {
          return (
            <FormControlLabel
              id="option"
              value={choices[index]}
              control={<Radio disabled={isSubmitDisabled} id={question.id} />}
              label={
                <span className="text-black">{question.options[index]}</span>
              }
            />
          );
        })}

        {isSubmitDisabled && questionAnswers[question.id] !== answer && (
          <span className="text-green">Correct Answer :- {answer}</span>
        )}
      </RadioGroup>
    </FormControl>
  );
};

export const QuizInLine = ({ quizData, hideHowToParticipate = false }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [quizesData, _] = useState(quizData);
  const [allowedTime, setAllowedTime] = useState(60);
  const [submitClicked, setSubmitClicked] = useState(false);
  const [questionIndices, setQuestionIndices] = useState([]);

  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [questionAnswers, setQuestionValues] = useState({});
  const [unAnswered, setUnAnsweredQuestions] = useState([]);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
  const [score, setScore] = useState();

  useEffect(() => {
    setQuestionIndices(
      shuffleArray(Array.from(Array(quizData.questions.length).keys()))
    );
    setAllowedTime(120);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (event) => {
    const questionId = event.target.getAttribute("id");
    const answers = { ...questionAnswers, [questionId]: event.target.value };
    setQuestionValues(answers);

    setTimeout(() => {
      const answeredQuestionIds = Object.keys(answers);
      const allQuestionIds = quizesData.questions.map((q) => q.id);
      const unattended = allQuestionIds.filter(
        (qId) => !answeredQuestionIds.includes(qId)
      );
      submitClicked && setUnAnsweredQuestions(unattended);
    }, 0);
  };

  const _submitHandler = async () => {
    const answeredQuestionIds = Object.keys(questionAnswers);
    const allQuestionIds = quizesData.questions.map((q) => q.id);

    const unattended = allQuestionIds.filter(
      (qId) => !answeredQuestionIds.includes(qId)
    );
    setUnAnsweredQuestions(unattended);
    if (unattended) {
      setSubmitClicked(true);
    }

    if (unattended.length === 0) {
      setIsSubmitDisabled(true);

      // make a transaction using questionAnswers as participation data
      console.log("participaton obj", questionAnswers);
      const participationJson = Object.keys(questionAnswers).map((key) => ({
        [key]: questionAnswers[key],
      }));
      console.log("participation json", participationJson);

      const score = getScore(quizesData.answers, questionAnswers);
      setScore(score);
      if (score === 100) {
        setTimeout(() => {
          renderConfetti();
        }, 50);
      }
    }
  };

  const timerProps = {
    size: 100,
    strokeWidth: 5,
  };

  const renderTime = ({ remainingTime }) => {
    if (remainingTime === 0) {
      return (
        <div className="timer flex items-center flex-col text-center font-bold text-[red]">
          <AssignmentLateIcon />
          <span>Too late...</span>{" "}
          <PlayCircleFilledWhiteIcon
            htmlColor="green"
            className="cursor-pointer"
            onClick={() => {
              window.location.reload();
            }}
          />
        </div>
      );
    }

    return (
      <div className="timer text-sm text-center">
        <div className="text">
          {isQuizStarted && isSubmitDisabled ? "You took" : "Remaining"}
        </div>
        <div className="value font-bold">
          {isQuizStarted && isSubmitDisabled
            ? allowedTime - remainingTime
            : remainingTime}
        </div>
        <div className="text">seconds</div>
        {isSubmitDisabled && (
          <PlayCircleFilledWhiteIcon
            htmlColor="green"
            className="cursor-pointer"
            onClick={() => {
              window.location.reload();
            }}
          />
        )}
      </div>
    );
  };

  const onTimeComplete = () => {
    setIsSubmitDisabled(true);
  };

  const getStatusMessage = () => {
    if (score !== undefined) {
      return score === 100
        ? "Wow, you scored a perfect 100!"
        : `You're score in this quiz is ${score}`;
    }
    return "";
  };

  return (
    <div
      className={`flex flex-col w-full ${"mt-8 sm:mt-10 py-8  px-2 sm:px-20"}`}
    >
      {isQuizStarted && (
        <div id="timer" className="mt-10 sm:mt-0 flex justify-center">
          <CountdownCircleTimer
            onComplete={onTimeComplete}
            {...timerProps}
            isPlaying={isQuizStarted && !isSubmitDisabled}
            duration={allowedTime}
            colors={["#31db6b", "#85dba3", "#ec856d", "#f03307"]}
            colorsTime={[60, 30, 10, 0]}
          >
            {renderTime}
          </CountdownCircleTimer>
        </div>
      )}

      <div style={{ padding: "20px" }}>
        {isQuizStarted && (
          <div className="flex justify-center p-2">
            <a
              className="twitter-logo twitter-share-button h-[32px]"
              href={`https://twitter.com/intent/tweet?text=Quiz Time ${quizesData.title}&url=${window.location.href}`}
            >
              {" "}
              <i></i>
              <span>Tweet</span>
            </a>{" "}
          </div>
        )}
        {quizesData && quizesData.title && !isQuizStarted && (
          <div className="flex items-center flex-col">
            <QuizIcon />

            <h1 className="text-xl mt-2">{quizesData.title}</h1>
            <div className="">{quizesData.description}</div>
            <div
              style={{
                cursor: "pointer",
                padding: "5px",
                borderRadius: "5px",
                border: "1px solid gray",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-around",
                width: "100px",
                marginTop: "20px",
              }}
              id="startbtn"
              onClick={() => {
                setIsQuizStarted(true);
              }}
            >
              <PlayCircleFilledWhiteIcon />{" "}
              <span className="text-xl">Start</span>
            </div>
            {!hideHowToParticipate && (
              <div className="text-sm mt-12">
                Note:- Quiz timer will start immediatedly after you click on
                Start. <br /> There'll be a total of{" "}
                <span className="font-black">
                  {quizesData.questions.length}
                </span>{" "}
                questions and you need to answer all questions to get a score.{" "}
                <br />
                Good luck!
              </div>
            )}
          </div>
        )}

        {isQuizStarted && quizesData.questions.length ? (
          <Grid>
            <h1 className="text-xl">{quizesData.title}</h1>
            <div className="">{quizesData.description}</div>

            <form className="quiz-form flex flex-col justify-start">
              {questionIndices.map((index, _id) => {
                return (
                  <RenderQuestion
                    question={quizesData.questions[index]}
                    _id={_id}
                    unAnswered={unAnswered}
                    questionAnswers={questionAnswers}
                    handleChange={handleChange}
                    isSubmitDisabled={isSubmitDisabled}
                    submitted={submitClicked}
                    answer={quizesData.answers[quizesData.questions[index].id]}
                  />
                );
              })}
              <Button
                className="!mt-4 w-[200px]"
                color="primary"
                variant="contained"
                onClick={_submitHandler}
                disabled={isSubmitDisabled}
              >
                {"Submit quiz"}
              </Button>
              {isQuizStarted && unAnswered.length > 0 && (
                <FormHelperText className="!text-red-500">
                  Please answer all the questions!
                </FormHelperText>
              )}
            </form>
          </Grid>
        ) : null}

        {getStatusMessage() && (
          <Snack score={score} message={getStatusMessage()} />
        )}
      </div>
    </div>
  );
};

export default QuizInLine;
