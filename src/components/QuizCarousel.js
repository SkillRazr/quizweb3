import React from "react";
import { NavLink } from "react-router-dom";

export default function QuizCarousel() {
  const [currentItem, setCurrentItem] = React.useState(1);
  const [isClick, setClicked] = React.useState(false);
  const [items, setItems] = React.useState([
    "Safegaurd your NFTs",
    "Essential bytes on Crypto wallets",
    "Beware of Cypto scams",
  ]);

  const rightRotateOneTime = (arr) => {
    const lastItem = arr.pop();
    arr.unshift(lastItem);
    console.log("arr", arr);
    setItems([...arr]);
    return arr;
  };

  const leftRotateOneTime = (arr) => {
    const firstItem = arr.shift();
    arr.push(firstItem);
    setItems([...arr]);
    console.log("arr", arr);
    return arr;
  };

  const getClass = (index) => {
    console.log("cu item", currentItem);
    if (currentItem === 1 || isClick) {
      return "";
    }

    if (currentItem === 0) {
      if (index === 2) {
        return "slide-2-left";
      } else if (index === 0) {
        return "slide-right";
      } else {
        return "slide-right";
      }
    } else {
      if (index === 0) {
        return "slide-2-right";
      } else if (index === 2) {
        return "slide-left";
      } else {
        return "slide-left";
      }
    }
  };

  console.log("currentItem", currentItem);

  return (
    <div className="flex justify-center">
      <ul className="quiz-cards max-w-[720px] flex p-4 cursor-pointer justify-center">
        {items.map((item, index) => {
          return (
            <li
              className={`p-8 mr-12 h-32 border ${item.color} ${getClass(
                index
              )} ${index === 1 ? "active" : ""}`}
              onClick={() => {
                setCurrentItem(index);
                if (index !== 1) {
                  setClicked(true);
                }

                if (index === 1) {
                  return;
                }

                // setTimeout(() => {
                //   index === 2
                //     ? leftRotateOneTime(items)
                //     : rightRotateOneTime(items);
                //   setClicked(false);
                // }, 200);
              }}
            >
              {item}
              {index === 1 && (
                <NavLink to="/quizzes/wallets">
                  <button className="block text-center w-full mt-2 border rounded-4 bg-green-200">
                    Participate
                  </button>
                </NavLink>
              )}
              {index !== 1 && isClick && (
                <div className="text-xs text-red-600">Coming soon!</div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
