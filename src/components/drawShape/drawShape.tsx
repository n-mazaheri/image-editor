import { useContext, useState } from 'react';
import styles from './drawShape.module.css';
import { useSelector } from 'react-redux';
import { selectImagePreview } from '../../redux/slices/imageSlice';
import { CanvasContext } from '../../contexts/canvasContext';
import useDrawShape, { ShapeType } from '../../hooks/draw';
import classNames from 'classnames';

const DrawShape = () => {
  const { canvasRef } = useContext(CanvasContext);
  const [shapeType, setShapeType] = useState<ShapeType>(ShapeType.LINE);
  const imagePreview = useSelector(selectImagePreview);
  const { startDrawing, isDrawing } = useDrawShape(shapeType);

  return (
    <div>
      <div className={styles.header}>Shapes</div>
      <div>
        <div className={styles.shapeRow}>
          <ShapeButton
            shapeType={ShapeType.LINE}
            setShapeType={setShapeType}
            disabled={!canvasRef?.current || !imagePreview}
            startDrawing={startDrawing}
            selected={isDrawing && shapeType == ShapeType.LINE}
          />
          <ShapeButton
            shapeType={ShapeType.SQUARE}
            setShapeType={setShapeType}
            disabled={!canvasRef?.current || !imagePreview}
            startDrawing={startDrawing}
            selected={isDrawing && shapeType == ShapeType.SQUARE}
          />
          <ShapeButton
            shapeType={ShapeType.RECT}
            setShapeType={setShapeType}
            disabled={!canvasRef?.current || !imagePreview}
            startDrawing={startDrawing}
            selected={isDrawing && shapeType == ShapeType.RECT}
          />
        </div>
        <div className={styles.shapeRow}>
          <ShapeButton
            shapeType={ShapeType.CIRCLE}
            setShapeType={setShapeType}
            disabled={!canvasRef?.current || !imagePreview}
            startDrawing={startDrawing}
            selected={isDrawing && shapeType == ShapeType.CIRCLE}
          />
          <ShapeButton
            shapeType={ShapeType.ELLIPES}
            setShapeType={setShapeType}
            disabled={!canvasRef?.current || !imagePreview}
            startDrawing={startDrawing}
            selected={isDrawing && shapeType == ShapeType.ELLIPES}
          />
          <ShapeButton
            shapeType={ShapeType.TEXT}
            setShapeType={setShapeType}
            disabled={!canvasRef?.current || !imagePreview}
            startDrawing={startDrawing}
            selected={isDrawing && shapeType == ShapeType.TEXT}
          />
        </div>
        <div className={styles.shapeRow}>
          <ShapeButton
            shapeType={ShapeType.POLYGON}
            setShapeType={setShapeType}
            disabled={!canvasRef?.current || !imagePreview}
            startDrawing={startDrawing}
            selected={isDrawing && shapeType == ShapeType.POLYGON}
          />
          <ShapeButton
            shapeType={ShapeType.POLYLINE}
            setShapeType={setShapeType}
            disabled={!canvasRef?.current || !imagePreview}
            startDrawing={startDrawing}
            selected={isDrawing && shapeType == ShapeType.POLYLINE}
          />
          <ShapeButton
            shapeType={ShapeType.TRIANGLE}
            setShapeType={setShapeType}
            disabled={!canvasRef?.current || !imagePreview}
            startDrawing={startDrawing}
            selected={isDrawing && shapeType == ShapeType.TRIANGLE}
          />
        </div>
      </div>
    </div>
  );
};

export default DrawShape;

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
      className={classNames(styles?.['shapeButton'], props.selected ? styles?.selected : '')}
    >
      <img src={'/shapes/' + props.shapeType.toLowerCase() + '.png'} style={{ width: '2rem' }}></img>
    </button>
  );
}
