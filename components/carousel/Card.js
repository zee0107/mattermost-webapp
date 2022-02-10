import { Feedback } from "react-bootstrap/lib/FormControl";

const Card = ({ handlePointerEvent, name, img,feed, cardStyle }) => {
  return (
    <article className={cardStyle}>
      <div
        className="card"
        onMouseDown={handlePointerEvent}
          onTouchStart={handlePointerEvent}
      >
        <div className="col-lg-12">
          <p>{feed}</p>
        </div>
        <div className="col-lg-12">
          <div className="d-flex">
            <div className="col-lg-2">
              <img src={img} alt={name} />
            </div>
            <div className="col-lg-10">
              <p>{name}</p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default Card;
