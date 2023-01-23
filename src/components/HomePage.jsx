import Carousel from "./QuizCarousel";

const HomePage = () => {
  return (
    <div className="App flex-grow flex flex-col justify-center w-full h-full align-center">
      <div className="flex flex-col justify-center">
        <div className="text-3xl text-[60px] p-10">Participate in quizzes</div>
        <div className="text-3xl my-10">
          learn more about web3 ecosystem and win Bonks!
        </div>
      </div>
      <Carousel />
    </div>
  );
};

export default HomePage;
