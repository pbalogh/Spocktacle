import * as React from "react";
import styles from "./App.module.scss";

interface IProps {
  children: React.ReactNode;
}

const Draggable = (props: IProps) => {
  const [position, setPosition] = React.useState({
    x: window.innerWidth * 0.25,
    y: 0
  });
  const [clickLocation, setClickLocation] = React.useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = React.useState(false);

  const startDrag = (e: React.MouseEvent) => {
    setClickLocation({ x: e.clientX, y: e.clientY });
    setIsDragging(true);
  };
  const stopDrag = () => setIsDragging(false);
  const mouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: position.x + e.clientX - clickLocation.x,
        y: position.y + e.clientY - clickLocation.y
      });
      setClickLocation({ x: e.clientX, y: e.clientY });
    }
  };

  //   const newStyle = { left: position.x + "px", top: position.y + "px" };

  return (
    //   style={newStyle}
    <svg
      className={styles.draggable}
      viewBox={`${-position.x} ${-position.y} ${2500} 1500`}
      width={window.innerWidth}
      height={window.innerHeight}
      onMouseDown={startDrag}
      onMouseUp={stopDrag}
      onMouseMove={mouseMove}
    >
      {props.children}
    </svg>
  );
};
export default Draggable;
