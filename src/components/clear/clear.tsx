import classNames from 'classnames';
import { useContext } from 'react';
import { CanvasContext } from '../../contexts/canvasContext';

/**
 * `Clear` component for the image app editor.
 *
 * This component provides a button to clear the canvas.
 *
 * @returns A React component that renders a button for clearing the canvas.
 */
export default function Clear() {
  // Extract clearCanvas and canvasRef from the CanvasContext
  const { clearCanvas, canvasRef } = useContext(CanvasContext);

  return (
    <div>
      <button
        // When the button is clicked, clear canvas function from canvas Context hook is called
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
