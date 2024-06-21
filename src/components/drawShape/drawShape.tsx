import { useContext, useState } from 'react';
import styles from './drawShape.module.css';
import { CanvasContext } from '../../contexts/canvasContext';
import useDrawShape, { ShapeType } from '../../hooks/draw';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { selectImagePreview } from '../../redux/slices/imageSlice';

/**
 * DrawShape component for the image app editor.
 *
 * This component renders different buttons for drawing various shapes like lines, polygons, etc.
 * The logic for drawing shapes is inside the `useDrawShape` hook.
 * It also includes a delete button that appears only if an object is selected in the canvas.
 * When the delete button is clicked, it removes the selected objects.
 *
 * @returns A React component that renders buttons for drawing shapes and a delete button.
 */
const DrawShape = () => {
  const { canvasRef, selectedShapes, removeSelectedObjects } = useContext(CanvasContext);
  const [shapeType, setShapeType] = useState<ShapeType>(ShapeType.LINE);
  const { startDrawing, isDrawing } = useDrawShape(shapeType);
  const imagePreview = useSelector(selectImagePreview);

  /**
   * Renders a button for a specific shape.
   *
   * @param shapeType - The type of shape to draw.
   * @param selected - indicates if this shape was selected
   * @returns A React component that renders a button for a specific shape.
   */
  const renderShapeButton = (shapeType: ShapeType, selected: boolean) => (
    <ShapeButton
      shapeType={shapeType}
      setShapeType={setShapeType}
      disabled={!canvasRef?.current}
      startDrawing={startDrawing}
      selected={selected}
    />
  );

  return (
    <div>
      <div className={styles.header}>
        {selectedShapes?.length && selectedShapes?.length > 0 && (
          <button onClick={removeSelectedObjects} className={styles.deleteButton}>
            Delete
          </button>
        )}
        Shapes
      </div>
      <div>
        <div className={styles.shapeRow}>
          {renderShapeButton(ShapeType.LINE, isDrawing && shapeType === ShapeType.LINE)}
          {renderShapeButton(ShapeType.SQUARE, isDrawing && shapeType === ShapeType.SQUARE)}
          {renderShapeButton(ShapeType.RECT, isDrawing && shapeType === ShapeType.RECT)}
        </div>
        <div className={styles.shapeRow}>
          {renderShapeButton(ShapeType.CIRCLE, isDrawing && shapeType === ShapeType.CIRCLE)}
          {renderShapeButton(ShapeType.ELLIPSE, isDrawing && shapeType === ShapeType.ELLIPSE)}
          {renderShapeButton(ShapeType.TEXT, isDrawing && shapeType === ShapeType.TEXT)}
        </div>
        <div className={styles.shapeRow}>
          {renderShapeButton(ShapeType.POLYGON, isDrawing && shapeType === ShapeType.POLYGON)}
          {renderShapeButton(ShapeType.POLYLINE, isDrawing && shapeType === ShapeType.POLYLINE)}
          {renderShapeButton(ShapeType.TRIANGLE, isDrawing && shapeType === ShapeType.TRIANGLE)}
        </div>
      </div>
    </div>
  );
};

export default DrawShape;

/**
 * ShapeButton component for rendering individual shape buttons.
 *
 * @param props - The properties object containing various props for the shape button.
 * @param props.startDrawing - Function to start drawing the selected shape.
 * @param props.disabled - Boolean indicating if the button is disabled.
 * @param props.shapeType - The type of shape to draw.
 * @param props.setShapeType - Function to set the type of shape.
 * @param props.selected - Boolean indicating if the shape button is selected.
 * @returns A React component that renders a button for a specific shape.
 */
function ShapeButton(props: {
  startDrawing: () => void;
  disabled: boolean;
  shapeType: ShapeType;
  setShapeType: React.Dispatch<React.SetStateAction<ShapeType>>;
  selected: boolean;
}) {
  return (
    <button
      onClick={() => {
        props.setShapeType(props.shapeType);
        props.startDrawing();
      }}
      disabled={props.disabled}
      className={classNames(styles['shapeButton'], props.selected ? styles.selected : '')}
    >
      <img src={'/shapes/' + props.shapeType.toLowerCase() + '.png'} style={{ width: '2rem' }} />
    </button>
  );
}
