import { useState } from "react";
import { MdArrowOutward } from "react-icons/md";

interface Props {
  image: string;
  alt?: string;
  video?: string;
  link?: string;
}

const WorkImage = (props: Props) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    if (props.video) setOpen(true);
  };

  const handleClose = () => setOpen(false);

  return (
    <div className="work-image">
      <div
        className="work-image-in"
        onClick={handleOpen}
        data-cursor={"disable"}
      >
        {props.link && (
          <button
            className="work-link"
            onClick={(e) => {
              e.stopPropagation();
              if (props.link) {
                window.open(props.link, "_blank", "noopener,noreferrer");
              }
            }}
            aria-label="Open project link"
          >
            <MdArrowOutward />
          </button>
        )}
        <img src={props.image} alt={props.alt} />
        {props.video && (
          <div className="work-play-overlay">
            <div className="work-play-circle">
              <span className="work-play-triangle" />
            </div>
            <span className="work-play-label">Watch demo</span>
          </div>
        )}
      </div>

      {open && props.video && (
        <div
          className="work-video-modal"
          onClick={handleClose}
          data-cursor={"disable"}
        >
          <div
            className="work-video-modal-inner"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="work-video-close"
              onClick={handleClose}
              aria-label="Close video"
            >
              ✕
            </button>
            <video
              src={props.video}
              controls
              autoPlay
              playsInline
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkImage;
