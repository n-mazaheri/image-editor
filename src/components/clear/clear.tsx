import classNames from 'classnames';
import { useContext } from 'react';
import { CanvasContext } from '../../contexts/canvasContext';

export default function Clear() {
  const { clearCanvas, canvasRef } = useContext(CanvasContext);
  return (
    <div>
      <button
        onClick={() => {
          if (canvasRef) {
            clearCanvas();
          }
        }}
        className={classNames('toolboxButton', 'upDownButton')}
      >
        Clear <span className="remove">Canvas</span>
      </button>
    </div>
  );
}
