import React, { useEffect, useRef, useState } from "react";

const LETTERS: any = {
  A: {
    paths: [
      { move: [30, 250], line: [150, 30] },
      { move: [150, 30], line: [270, 250] },
      { move: [80, 150], line: [220, 150] }
    ]
  },
  B: {
    paths: [
      { move: [50, 30], line: [50, 250] },
      { move: [50, 30], curve: [120, 30, 180, 60, 180, 120] },
      { move: [180, 120], curve: [180, 180, 120, 140, 50, 140] },
      { move: [50, 140], curve: [120, 140, 180, 160, 180, 200] },
      { move: [180, 200], curve: [180, 250, 120, 250, 50, 250] }
    ]
  }
};

const ACCURACY_THRESHOLD = 85;
const SILVER_COLOR = '#cccccc';
const SKY_COLOR = '#0066ff';

const PixelBasedTracing = ({ initialLetter = 'A' }) => {
  const templateCanvasRef = useRef<any>(null);
  const drawingCanvasRef = useRef<any>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [accuracy, setAccuracy] = useState(0);
  const [lastPos, setLastPos] = useState<any>({ x: 0, y: 0 });
  const [currentLetter, setCurrentLetter] = useState<any>(initialLetter);
  const [completed, setCompleted] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  useEffect(() => {
    initializeCanvases();
  }, [currentLetter]);

  const initializeCanvases = () => {
    const templateCtx = templateCanvasRef.current.getContext('2d');
    const drawingCtx = drawingCanvasRef.current.getContext('2d');
    
    // Tăng kích thước canvas
    const canvasWidth = 300;
    const canvasHeight = 300;
    
    templateCanvasRef.current.width = canvasWidth;
    templateCanvasRef.current.height = canvasHeight;
    drawingCanvasRef.current.width = canvasWidth;
    drawingCanvasRef.current.height = canvasHeight;
    
    // Reset canvases
    templateCtx.clearRect(0, 0, canvasWidth, canvasHeight);
    drawingCtx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    // Set up drawing canvas với nét vẽ dày hơn
    drawingCtx.strokeStyle = SKY_COLOR;
    drawingCtx.lineWidth = 15;
    drawingCtx.lineCap = 'round';
    drawingCtx.lineJoin = 'round';
    
    // Draw template letter
    drawTemplateLetter(false);
    
    setCompleted(false);
    setAccuracy(0);
    setHasDrawn(false);
  };

  const drawTemplateLetter = (isCompleted) => {
    const ctx = templateCanvasRef.current.getContext('2d');
    const canvasWidth = templateCanvasRef.current.width;
    const canvasHeight = templateCanvasRef.current.height;
    
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.strokeStyle = isCompleted ? SKY_COLOR : SILVER_COLOR;
    ctx.lineWidth = 15; // Nét mẫu dày hơn
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const letterConfig = LETTERS[currentLetter];
    letterConfig.paths.forEach(path => {
      ctx.beginPath();
      if (path.move) ctx.moveTo(...path.move);
      if (path.line) ctx.lineTo(...path.line);
      if (path.curve) ctx.bezierCurveTo(...path.curve);
      ctx.stroke();
    });
  };

  const startDrawing = (e) => {
    if (completed) return;
    const canvas = drawingCanvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);
    
    setIsDrawing(true);
    setLastPos({ x, y });
    setHasDrawn(true);
  };

  const draw = (e) => {
    if (!isDrawing || completed) return;

    const canvas = drawingCanvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    ctx.beginPath();
    ctx.moveTo(lastPos.x, lastPos.y);
    ctx.lineTo(x, y);
    ctx.stroke();
    
    setLastPos({ x, y });
    calculateAccuracy();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const calculateAccuracy = () => {
    const templateCtx = templateCanvasRef.current.getContext('2d');
    const drawingCtx = drawingCanvasRef.current.getContext('2d');
    const canvasWidth = templateCanvasRef.current.width;
    const canvasHeight = templateCanvasRef.current.height;
    
    const templateData = templateCtx.getImageData(0, 0, canvasWidth, canvasHeight).data;
    const drawingData = drawingCtx.getImageData(0, 0, canvasWidth, canvasHeight).data;
    
    let matchingPixels = 0;
    let totalTemplatePixels = 0;

    for (let i = 0; i < templateData.length; i += 4) {
      if (templateData[i + 3] > 0) {
        totalTemplatePixels++;
        if (drawingData[i + 3] > 0) {
          matchingPixels++;
        }
      }
    }

    const accuracyPercentage = (matchingPixels / totalTemplatePixels) * 100;
    const newAccuracy = Math.round(accuracyPercentage);
    setAccuracy(newAccuracy);

    if (newAccuracy >= ACCURACY_THRESHOLD && !completed) {
      handleCompletion();
    }
  };

  const handleCompletion = () => {
    setCompleted(true);
    // Xóa nét vẽ của người dùng
    const drawingCtx = drawingCanvasRef.current.getContext('2d');
    drawingCtx.clearRect(0, 0, drawingCanvasRef.current.width, drawingCanvasRef.current.height);
    // Vẽ lại chữ với màu sky
    drawTemplateLetter(true);
  };

  const clearDrawing = () => {
    const drawingCtx = drawingCanvasRef.current.getContext('2d');
    drawingCtx.clearRect(0, 0, drawingCanvasRef.current.width, drawingCanvasRef.current.height);
    setAccuracy(0);
    setHasDrawn(false);
  };

  const changeLetter = (letter) => {
    setCurrentLetter(letter);
    setCompleted(false);
    setAccuracy(0);
    setHasDrawn(false);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="flex gap-2 mb-4">
        {Object.keys(LETTERS).map(letter => (
          <button
            key={letter}
            onClick={() => changeLetter(letter)}
            disabled={completed}
            className={`px-6 py-3 text-lg rounded-lg ${
              currentLetter === letter 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 hover:bg-gray-300'
            } ${completed ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {letter}
          </button>
        ))}
      </div>
      
      <div className="relative w-[300px] h-[300px]">
        <canvas
          ref={templateCanvasRef}
          className="absolute top-0 left-0"
        />
        <canvas
          ref={drawingCanvasRef}
          className="absolute top-0 left-0"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
      </div>
      
      <div className="mt-4 flex flex-col items-center gap-2">
        <div className="text-lg font-semibold">
          Độ chính xác: {accuracy}%
        </div>
        {completed && (
          <div className="text-sky-500 font-bold text-lg">
            Chúc mừng! Bạn đã hoàn thành chữ {currentLetter}
          </div>
        )}

          <button
            onClick={clearDrawing}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-lg"
          >
            Xóa và thử lại
          </button>

      </div>
    </div>
  );
};

export default PixelBasedTracing;