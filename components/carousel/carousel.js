import { useState } from "react";

import Card from "./Card";
import Paginator from "./Paginator";

import { data } from "./data";

function carousel() {
  const [index, setIndex] = useState(0);

  const slideLeft = () => {
    if (index - 1 >= 0) {
      setIndex(index - 1);
    }
  };

  const slideRight = () => {
    if (index + 1 <= data.length - 1) {
      setIndex(index + 1);
    }
  };

  const handlePageChange = (page) => {
    let n = page - index;
    setIndex(index + n);
  };

  const handlePointerEvent = (e) => {
    /* check which type of event we have, 
    and set a flag variable */
    let isTouchEvent = e.type === "touchstart" ? true : false;

    /* this is our card we will move */
    let card = e.target;
    /* to keep track of the value to offset the card left */
    let offset = 0;
    /* keeps the initial mouse click x value */
    let initialX = isTouchEvent ? e.touches[0].clientX : e.clientX;

    /* mouse events */
    /* set the documents onmousemove event to use this function */
    document.onmousemove = onPointerMove;
    /* sets the documents onmouseup event to use this function */
    document.onmouseup = onPointerEnd;

    /* touch events */
    /* set the documents ontouchmove to this function */
    document.ontouchmove = onPointerMove;
    /* set the documents ontouchend to this function */
    document.ontouchend = onPointerEnd;

    /* when the mouse moves we handle the event here */
    function onPointerMove(e) {
      /* set offset to the current position of the cursor,
      minus the initial starting position  */
      offset = (isTouchEvent ? e.touches[0].clientX : e.clientX) - initialX;
      if (offset <= -100) {
        slideRight();
        /* if we're at the last card, snap back to center */
        if (index === data.length - 1) {
          card.style.left = 0;
        } else {
          /* hide the shift back to center 
        until after the transition */
          setTimeout(() => {
            card.style.left = 0;
          }, 1000);
        }
        return;
      }
      if (offset >= 100) {
        slideLeft();
        /* if we're at the first card, snap back to center */
        if (index === 0) {
          card.style.left = 0;
        } else {
          /* hide the shift back to center 
        until after the transition */
          setTimeout(() => {
            card.style.left = 0;
          }, 1000);
        }
        return;
      }
      /* set the left style property of the card to the offset value */
      card.style.left = offset + "px";
    }

    function onPointerEnd(e) {
      /* if user releases mouse early,
      card needs to snap back */
      if (offset < 0 && offset > -100) {
        card.style.left = 0;
      }
      if (offset > 0 && offset < 100) {
        card.style.left = 0;
      }
      /* remove functions from event listeners
      (stop tracking pointer movements) */
      document.onmousemove = null;
      document.onmouseup = null;

      document.ontouchmove = null;
      document.ontouchend = null;
    }
  };

  return (
    <div>
    <div className="card-container">
      <div className="background-block"></div>
       {/* <button
            onClick={slideLeft}
            className="leftBtn"
          >left</button>
          <button
            onClick={slideRight}
            className="rightBtn"
       >Right</button>*/}
          {data.map((person, n) => {
            let position =
              n > index ? "nextCard" : n === index ? "activeCard" : "prevCard";
            return (
              <Card
                key={n}
                handlePointerEvent={handlePointerEvent}
                {...person}
                cardStyle={position}
              />
            );
          })}
          
    </div>
    <Paginator
            dataLength={data.length}
            activeIndex={index}
            handlePageChange={handlePageChange}
          />
    </div>
  );
}

export default carousel;
