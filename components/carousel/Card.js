import { Feedback } from "react-bootstrap/lib/FormControl";
import starsImage from 'images/stars.png';
const Card = ({ handlePointerEvent, name, img,feed, cardStyle }) => {
  return (
    <article className={cardStyle}>
      <div
        className="card"
        onMouseDown={handlePointerEvent}
          onTouchStart={handlePointerEvent}
      >
        <div className="col-lg-12">
          <img src={starsImage} className="starImage"></img>
          <p className="textPaddingCard">{feed}</p>
        </div>
        <br></br>
        <div className="col-lg-12">
          <div className="d-flex">
            <div className="col-lg-2">
              <img src={img} alt={name} />
            </div>
            <div className="col-lg-10">
              <p className="nameTextCard">{name}</p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default Card;
