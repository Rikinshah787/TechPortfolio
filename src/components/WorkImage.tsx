import { useRef, useState, useCallback } from "react";
import { MdArrowOutward } from "react-icons/md";

interface Props {
  image: string;
  alt?: string;
  video?: string;
  link?: string;
}

const WorkImage = (props: Props) => {
  const [muted, setMuted] = useState(true);
  const previewRef = useRef<HTMLVideoElement>(null);

  // Seek preview video to midpoint once metadata loads
  const handlePreviewLoaded = () => {
    const v = previewRef.current;
    if (v && v.duration && isFinite(v.duration)) {
      v.currentTime = v.duration / 2;
    }
  };

  // Toggle mute imperatively — never change React props so the video doesn't restart
  const handleVideoClick = useCallback(() => {
    const v = previewRef.current;
    if (!v) return;
    if (v.muted) {
      v.muted = false;
      v.controls = true;
      setMuted(false);
    } else {
      v.muted = true;
      v.controls = false;
      setMuted(true);
    }
  }, []);

  return (
    <div className="work-image">
      <div
        className="work-image-in"
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
        {props.video ? (
          <video
            ref={previewRef}
            src={props.video}
            muted
            loop
            autoPlay
            playsInline
            onLoadedMetadata={handlePreviewLoaded}
            onClick={handleVideoClick}
            className="work-preview-video"
          />
        ) : (
          <img src={props.image} alt={props.alt} />
        )}
        {props.video && muted && (
          <div className="work-play-overlay" onClick={handleVideoClick}>
            <div className="work-play-circle">
              <span className="work-play-triangle" />
            </div>
            <span className="work-play-label">Tap to unmute</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkImage;
