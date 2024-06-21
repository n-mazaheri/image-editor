import { useState, useEffect, useContext } from 'react';
import { fabric } from 'fabric';
import { v4 as uuidv4 } from 'uuid';
import { useDispatch, useSelector } from 'react-redux';
import { addObject, setRequestUngroupActiveGroup } from '../redux/slices/imageSlice';
import { CanvasContext } from '../contexts/canvasContext';
import {
  selectFontSize,
  selectTextColor,
  selectFillColor,
  selectStrokewidth,
  selectStrokeColor,
  setStrokeColor,
  setStrokeWidth,
  setFillColor,
  setFontSize,
  setTextColor,
} from '../redux/slices/canvasSlice';

export enum ShapeType {
  ELLIPSE = 'Ellipse',
  LINE = 'Line',
  RECT = 'Rectangle',
  TEXT = 'Text',
  TRIANGLE = 'Triangle',
  POLYGON = 'Polygon',
  CIRCLE = 'Circle',
  SQUARE = 'Square',
  POLYLINE = 'Polyline',
}

declare module 'fabric' {
  namespace fabric {
    interface IObjectOptions {
      id?: string;
    }
  }
}

/**
 * Custom hook for drawing various shapes on a canvas.
 *
 * @param shapeType - Type of shape to draw (from ShapeType enum).
 * @returns Object with methods and state related to drawing shapes.
 */
const useDrawShape = (shapeType: ShapeType) => {
  const { canvasRef, lockObjects, unlockObjects, selectedShapes, setSelectedShapes, removeSelectedObjects } =
    useContext(CanvasContext);

  const dispatch = useDispatch();

  // State variables to manage drawing process
  const [isDrawing, setIsDrawing] = useState(false);
  const [shape, setShape] = useState<fabric.Object | null>(null);
  const [polygonPoints, setPolygonPoints] = useState<{ x: number; y: number }[]>([]);
  const [lines, setLines] = useState<fabric.Line[]>([]);
  const [startPos, setStartPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [originX, setOriginX] = useState(0);
  const [originY, setOriginY] = useState(0);

  // Selectors to get current style settings from Redux store
  const strokeColor = useSelector(selectStrokeColor);
  const strokeWidth = useSelector(selectStrokewidth);
  const fillColor = useSelector(selectFillColor);
  const fontSize = useSelector(selectFontSize);
  const textColor = useSelector(selectTextColor);

  // Function to initiate drawing mode
  const startDrawing = () => {
    dispatch(setRequestUngroupActiveGroup(true)); // Request ungrouping active group if any
    setIsDrawing(true); // Set drawing mode to true
    if (canvasRef?.current) {
      canvasRef.current.defaultCursor = 'crosshair'; // Change cursor to crosshair
      lockObjects(); // Lock objects on canvas
    }
  };

  // Effect to add the drawn shape to Redux store when `shape` changes
  useEffect(() => {
    if (shape) {
      dispatch(addObject(shape.id!)); // Add the object's ID to Redux store
    }
  }, [shape, dispatch]);

  // Function to add a point for polygon and polyline drawing
  const addPoint = (opt: fabric.IEvent<MouseEvent>) => {
    const pointer = canvasRef?.current?.getPointer(opt.e);
    let newPoint = { x: pointer?.x ?? 0, y: pointer?.y ?? 0 };
    const points = [...polygonPoints, newPoint]; // Add new point to points array
    setPolygonPoints(points); // Update state with new points

    // Create a new line object for drawing
    const newLine = new fabric.Line([newPoint.x, newPoint.y, newPoint.x, newPoint.y], {
      stroke: strokeColor,
      strokeWidth,
      fill: fillColor,
      lockRotation: false,
      selectable: true,
      hasControls: true,
    });

    canvasRef?.current?.add(newLine); // Add line to canvas
    setLines([...lines, newLine]); // Update lines state with new line
    canvasRef?.current?.renderAll(); // Render canvas
  };

  useEffect(() => {
    // Event handlers for mouse actions on canvas
    const handleMouseDown = (event: fabric.IEvent<MouseEvent>) => {
      if (isDrawing && canvasRef?.current) {
        const id = uuidv4(); // Generate unique ID for new shape
        const pointer = canvasRef.current.getPointer(event.e);

        // Determine shape type and create corresponding fabric.js object
        if (shapeType === ShapeType.ELLIPSE) {
          const newEllipse = new fabric.Ellipse({
            left: pointer.x,
            top: pointer.y,
            originX: 'center',
            originY: 'center',
            rx: 0,
            ry: 0,
            fill: fillColor,
            stroke: strokeColor,
            strokeWidth,
            lockRotation: false,
            selectable: true,
            hasControls: true,
            id,
          });
          canvasRef.current.add(newEllipse);
          setShape(newEllipse);
        } else if (shapeType === ShapeType.RECT || shapeType === ShapeType.SQUARE) {
          setOriginX(pointer.x);
          setOriginY(pointer.y);
          const newRectangle = new fabric.Rect({
            left: pointer.x,
            top: pointer.y,
            originX: 'left',
            originY: 'top',
            width: 0,
            height: 0,
            angle: 0,
            fill: fillColor,
            stroke: strokeColor,
            strokeWidth,
            lockRotation: false,
            selectable: true,
            hasControls: true,
            id,
          });

          canvasRef.current.add(newRectangle);
          setShape(newRectangle);
        } else if (shapeType === ShapeType.TRIANGLE) {
          setStartPos({ x: pointer.x, y: pointer.y });
          const newTriangle = new fabric.Triangle({
            left: pointer.x,
            top: pointer.y,
            width: 0,
            height: 0,
            fill: fillColor,
            stroke: strokeColor,
            strokeWidth,
            lockRotation: false,
            selectable: true,
            hasControls: true,
            id,
          });
          canvasRef.current.add(newTriangle);
          setShape(newTriangle);
        } else if (shapeType === ShapeType.POLYGON || shapeType === ShapeType.POLYLINE) {
          addPoint(event); // Add initial point for polygon or polyline
        } else if (shapeType === ShapeType.CIRCLE) {
          const newCircle = new fabric.Circle({
            left: pointer.x,
            top: pointer.y,
            originX: 'center',
            originY: 'center',
            radius: 0,
            fill: fillColor,
            stroke: strokeColor,
            strokeWidth,
            lockRotation: false,
            selectable: true,
            hasControls: true,
            id,
          });
          setOriginX(pointer.x);
          setOriginY(pointer.y);
          canvasRef.current.add(newCircle);
          setShape(newCircle);
        } else if (shapeType === ShapeType.LINE) {
          const newLine = new fabric.Line([pointer.x, pointer.y, pointer.x, pointer.y], {
            stroke: strokeColor,
            strokeWidth,
            fill: fillColor,
            lockRotation: false,
            selectable: true,
            hasControls: true,
            id,
          });
          canvasRef.current.add(newLine);
          setShape(newLine);
        } else if (shapeType === ShapeType.TEXT) {
          const newText = new fabric.Textbox('Your text here', {
            left: pointer.x,
            top: pointer.y,
            fill: textColor,
            fontSize,
            editable: true,
            selectable: true,
            hasControls: true,
            lockRotation: false,
            id,
          });

          canvasRef.current.add(newText);
          setShape(newText);
        }
      }
    };

    // Handler for mouse move events during drawing
    const handleMouseMove = (event: fabric.IEvent<MouseEvent>) => {
      if (isDrawing && canvasRef?.current && (shape || polygonPoints.length > 0)) {
        const pointer = canvasRef.current.getPointer(event.e);

        // Update shape properties based on mouse movement
        if (shapeType === ShapeType.ELLIPSE) {
          const rx = Math.abs(pointer.x - (shape!.left ?? 0));
          const ry = Math.abs(pointer.y - (shape!.top ?? 0));
          (shape as fabric.Ellipse).set({ rx, ry });
        } else if (shapeType === ShapeType.RECT || shapeType === ShapeType.SQUARE) {
          // Adjust left and top position based on mouse movement direction
          if (originX > pointer.x) {
            (shape as fabric.Rect).set({ left: Math.abs(pointer.x) });
          }
          if (originY > pointer.y) {
            (shape as fabric.Rect).set({ top: Math.abs(pointer.y) });
          }

          // Update rectangle dimensions
          shape?.set({
            width: Math.abs(originX - pointer.x),
            height: shapeType != ShapeType.SQUARE ? Math.abs(originY - pointer.y) : Math.abs(originX - pointer.x),
          });
        } else if (shapeType === ShapeType.TRIANGLE) {
          const width = Math.abs(pointer.x - startPos.x);
          const height = Math.abs(pointer.y - startPos.y);
          (shape as fabric.Triangle).set({
            width,
            height,
            left: Math.min(pointer.x, startPos.x),
            top: Math.min(pointer.y, startPos.y),
          });
        } else if (shapeType === ShapeType.LINE) {
          (shape as fabric.Line).set({ x2: pointer.x, y2: pointer.y });
        } else if (shapeType === ShapeType.CIRCLE) {
          const radius = Math.hypot(pointer.x - originX, pointer.y - originY);
          (shape as fabric.Circle).set({ radius });
        } else if (shapeType === ShapeType.POLYGON || shapeType === ShapeType.POLYLINE) {
          lines[lines.length - 1].set({ x2: pointer.x, y2: pointer.y });
        }

        canvasRef.current.renderAll(); // Render canvas with updated shapes
      }
    };

    // Handler for double-click event to finish drawing polygon or polyline
    const handleDoubleClick = () => {
      if (shapeType === ShapeType.POLYGON || shapeType === ShapeType.POLYLINE) {
        if (polygonPoints.length > 2) {
          const id = uuidv4();
          const polygon =
            shapeType === ShapeType.POLYGON
              ? new fabric.Polygon(polygonPoints, {
                  fill: fillColor,
                  stroke: strokeColor,
                  strokeWidth,
                  selectable: true,
                  hasControls: true,
                  lockRotation: false,
                  id,
                })
              : new fabric.Polyline(polygonPoints, {
                  fill: '#00000000',
                  stroke: strokeColor,
                  strokeWidth,
                  selectable: true,
                  hasControls: true,
                  lockRotation: false,
                  id,
                });

          canvasRef?.current?.add(polygon); // Add polygon or polyline to canvas
          dispatch(addObject(id)); // Add object ID to Redux store
          setPolygonPoints([]); // Clear polygon points
          dispatch(setRequestUngroupActiveGroup(false)); // Reset ungroup request
          setIsDrawing(false); // Exit drawing mode
          unlockObjects(); // Unlock objects on canvas
          setShape(null); // Reset current shape
          for (let line of lines) {
            canvasRef?.current?.remove(line); // Remove temporary lines
          }
          setLines([]); // Clear lines state

          if (canvasRef?.current) {
            canvasRef.current.defaultCursor = 'default'; // Reset cursor to default
          }
        }
      }
    };

    // Handler for mouse up event to finish drawing other shapes
    const handleMouseUp = () => {
      if (shapeType !== ShapeType.POLYGON && shapeType !== ShapeType.POLYLINE) {
        dispatch(setRequestUngroupActiveGroup(false)); // Reset ungroup request
        setIsDrawing(false); // Exit drawing mode
        unlockObjects(); // Unlock objects on canvas
        setShape(null); // Reset current shape
        if (canvasRef?.current) {
          canvasRef.current.defaultCursor = 'default'; // Reset cursor to default
        }
      }
    };

    // Handler for object selected event to update style settings
    const handleObjectSelected = (event: fabric.IEvent) => {
      if (event.selected?.[0]?.type !== 'textbox') {
        dispatch(setStrokeWidth(event.selected?.[0]?.strokeWidth ?? 2));
        dispatch(setStrokeColor(event.selected?.[0]?.stroke ?? 'red'));
        dispatch(setFillColor((event.selected?.[0]?.fill as string) ?? ''));
      } else {
        dispatch(setFontSize((event.selected?.[0] as fabric.Text)?.fontSize ?? 2));
        dispatch(setTextColor(((event.selected?.[0] as fabric.Text)?.fill as string) ?? 'red'));
      }

      setSelectedShapes(event.selected ?? null); // Update selected shapes state
    };

    // Handler for selection cleared event to reset selected shapes state
    const handleSelectionCleared = () => {
      setSelectedShapes(null); // Clear selected shapes state
    };

    // Add event listeners for canvas events
    canvasRef?.current?.on('mouse:down', handleMouseDown as (e: fabric.IEvent) => void);
    canvasRef?.current?.on('mouse:move', handleMouseMove as (e: fabric.IEvent) => void);
    canvasRef?.current?.on('mouse:up', handleMouseUp as (e: fabric.IEvent) => void);
    canvasRef?.current?.on('selection:created', handleObjectSelected as (e: fabric.IEvent) => void);
    canvasRef?.current?.on('selection:updated', handleObjectSelected as (e: fabric.IEvent) => void);
    canvasRef?.current?.on('selection:cleared', handleSelectionCleared as (e: fabric.IEvent) => void);
    canvasRef?.current?.on('mouse:dblclick', handleDoubleClick as (e: fabric.IEvent) => void);

    // Clean up event listeners when component unmounts or dependencies change
    return () => {
      canvasRef?.current?.off('mouse:down', handleMouseDown as (e: fabric.IEvent) => void);
      canvasRef?.current?.off('mouse:move', handleMouseMove as (e: fabric.IEvent) => void);
      canvasRef?.current?.off('mouse:up', handleMouseUp as (e: fabric.IEvent) => void);
      canvasRef?.current?.off('selection:created', handleObjectSelected as (e: fabric.IEvent) => void);
      canvasRef?.current?.off('selection:updated', handleObjectSelected as (e: fabric.IEvent) => void);
      canvasRef?.current?.off('selection:cleared', handleSelectionCleared as (e: fabric.IEvent) => void);
      canvasRef?.current?.off('mouse:dblclick', handleDoubleClick as (e: fabric.IEvent) => void);
    };
  }, [
    isDrawing,
    shape,
    strokeColor,
    strokeWidth,
    canvasRef,
    fontSize,
    fillColor,
    textColor,
    polygonPoints,
    shapeType,
    originX,
    originY,
  ]);

  // Effect to update selected shapes' styles when related state changes
  useEffect(() => {
    if (selectedShapes && canvasRef?.current) {
      selectedShapes.forEach((shape) => {
        if (shape.type !== 'textbox') {
          shape.set('stroke', strokeColor);
          shape.set('strokeWidth', strokeWidth);
          if (shape.type !== 'line') shape.set('fill', fillColor);
        } else {
          shape.set('fill', textColor);
          (shape as fabric.Textbox).set('fontSize', fontSize);
        }
      });

      canvasRef.current.renderAll(); // Render canvas with updated styles
    }
  }, [strokeColor, selectedShapes, canvasRef, fontSize, strokeWidth, fillColor, textColor]);

  // Effect to handle keyboard events for deleting selected objects
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Delete' || event.key === 'Backspace') {
        removeSelectedObjects(); // Remove selected objects from canvas
      }
    };

    document.addEventListener('keydown', handleKeyDown); // Add event listener for key down

    // Clean up event listener when component unmounts or dependencies change
    return () => {
      document.removeEventListener('keydown', handleKeyDown); // Remove event listener
    };
  }, [selectedShapes, canvasRef]);

  // Return methods and state variables for drawing shapes
  return { startDrawing, isDrawing };
};

export default useDrawShape;
