import { useContext, useState } from 'react';
import styles from './drawShape.module.css';
import { useSelector } from 'react-redux';
import { selectImagePreview } from '../../redux/slices/imageSlice';
import { CanvasContext } from '../../contexts/canvasContext';
import useDrawShape, { ShapeType } from '../../hooks/draw';

const DrawShape = () => {
  const { canvasRef } = useContext(CanvasContext);
  const [shapeType, setShapeType] = useState<ShapeType>(ShapeType.LINE);
  const imagePreview = useSelector(selectImagePreview);
  const { startDrawing } = useDrawShape(shapeType);

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
          />
          <ShapeButton
            shapeType={ShapeType.SQUARE}
            setShapeType={setShapeType}
            disabled={!canvasRef?.current || !imagePreview}
            startDrawing={startDrawing}
          />
          <ShapeButton
            shapeType={ShapeType.RECT}
            setShapeType={setShapeType}
            disabled={!canvasRef?.current || !imagePreview}
            startDrawing={startDrawing}
          />
        </div>
        <div className={styles.shapeRow}>
          <ShapeButton
            shapeType={ShapeType.CIRCLE}
            setShapeType={setShapeType}
            disabled={!canvasRef?.current || !imagePreview}
            startDrawing={startDrawing}
          />
          <ShapeButton
            shapeType={ShapeType.ELLIPES}
            setShapeType={setShapeType}
            disabled={!canvasRef?.current || !imagePreview}
            startDrawing={startDrawing}
          />
          <ShapeButton
            shapeType={ShapeType.TEXT}
            setShapeType={setShapeType}
            disabled={!canvasRef?.current || !imagePreview}
            startDrawing={startDrawing}
          />
        </div>
        <div className={styles.shapeRow}>
          <ShapeButton
            shapeType={ShapeType.POLYGON}
            setShapeType={setShapeType}
            disabled={!canvasRef?.current || !imagePreview}
            startDrawing={startDrawing}
          />
          <ShapeButton
            shapeType={ShapeType.POLYLINE}
            setShapeType={setShapeType}
            disabled={!canvasRef?.current || !imagePreview}
            startDrawing={startDrawing}
          />
          <ShapeButton
            shapeType={ShapeType.TRIANGLE}
            setShapeType={setShapeType}
            disabled={!canvasRef?.current || !imagePreview}
            startDrawing={startDrawing}
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
}) {
  return (
    <button
      onClick={() => {
        props.setShapeType(props.shapeType);
        props.startDrawing();
      }}
      disabled={props.disabled}
      className={styles?.['shapeButton']}
    >
      <img src={'/shapes/' + props.shapeType.toLowerCase() + '.png'} style={{ width: '2rem' }}></img>
    </button>
  );
}
