import Carousel from "./QuizCarousel";

const HomePage = () => {
  return (
    <div className="App flex-grow flex flex-col justify-center w-full align-center">
      <div className="text-3xl p-10">Welcome to Quiz web3</div>
      <div className="text-3xl my-10">
        Participate in quizzes and learn and win prizes
      </div>
      <Carousel />
    </div>
  );
};

export default HomePage;
