import React, { useState, useRef, useEffect } from "react";
import IO from "socket.io-client";

const io = IO("localhost:8080");

interface ILine {
  start: IPos;
  stop: IPos;
}

interface IPos {
  offsetX: number;
  offsetY: number;
}

interface IContextRef {
  current: CanvasRenderingContext2D;
}

const App = () => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [prevPos, setPrevPos] = useState({ offsetX: 0, offsetY: 0 });
  const canvasRef = useRef(null);
  const contextRef = (useRef(null) as unknown) as IContextRef;

  useEffect(() => {
    const canvas = (canvasRef.current as unknown) as HTMLCanvasElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    const context = canvas.getContext("2d") as CanvasRenderingContext2D;
    context.lineCap = "round";
    context.strokeStyle = "black";
    context.lineWidth = 5;
    contextRef.current = context;
    io.on("draw", (line: ILine) => {
      draw(line.start, line.stop);
    });
  }, [contextRef]);

  const onMouseDown = ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const { offsetX, offsetY } = nativeEvent;
    setPrevPos({ offsetX, offsetY });
    setIsDrawing(true);
  };

  const onMouseMove = ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (isDrawing) {
      const { offsetX, offsetY } = nativeEvent;
      const offSetData = { offsetX, offsetY };
      const positionData = {
        start: prevPos,
        stop: offSetData,
      };
      io.emit("draw", positionData);
      draw(prevPos, offSetData);
    }
  };

  const onMouseLeave = () => {
    if (isDrawing) {
      contextRef.current.closePath();
      setIsDrawing(false);
    }
  };

  const onMouseUp = () => {
    if (isDrawing) {
      contextRef.current.closePath();
      setIsDrawing(false);
    }
  };

  const draw = (prevPos: IPos, currPos: IPos) => {
    const { offsetX, offsetY } = currPos;
    const { offsetX: x, offsetY: y } = prevPos;
    contextRef.current.beginPath();
    contextRef.current.moveTo(x, y);
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
    setPrevPos({ offsetX, offsetY });
  };

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={onMouseDown}
      onMouseLeave={onMouseLeave}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
    />
  );
};

export default App;
