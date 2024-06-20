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
  ELLIPES = 'Ellipes',
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

const useDrawShape = (shapeType: ShapeType) => {
  const { canvasRef, lockObjects, unlockObjects, selectedShapes, setSelectedShapes, removeSelectedObjects } =
    useContext(CanvasContext);
  const dispatch = useDispatch();
  const [isDrawing, setIsDrawing] = useState(false);
  const [shape, setShape] = useState<fabric.Object | null>(null);
  const [polygonPoints, setPolygonPoints] = useState<{ x: number; y: number }[]>([]);
  const [line, setLine] = useState<fabric.Polyline | null>(null);
  const [lines, setLines] = useState([]);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const strokeColor = useSelector(selectStrokeColor);
  const strokeWidth = useSelector(selectStrokewidth);
  const fillColor = useSelector(selectFillColor);
  const fontSize = useSelector(selectFontSize);
  const textColor = useSelector(selectTextColor);

  const startDrawing = () => {
    dispatch(setRequestUngroupActiveGroup(true));
    setIsDrawing(true);
    if (canvasRef?.current) {
      canvasRef.current.defaultCursor = 'crosshair'; // Set cursor to crosshair
      lockObjects();
    }
  };

  useEffect(() => {
    if (shape) {
      dispatch(addObject(shape.id!));
    }
  }, [shape, dispatch]);

  const addPoint = (opt: fabric.IEvent<MouseEvent>) => {
    const pointer = canvasRef?.current?.getPointer(opt.e);
    const points = [...polygonPoints, { x: pointer?.x ?? 0, y: pointer?.y ?? 0 }];
    setPolygonPoints(points);

    if (points.length > 1) {
      if (line) {
        canvasRef?.current?.remove(line);
      }
      const polyLine = new fabric.Polyline(points, {
        fill: 'rgba(0,0,0,0)',
        stroke: 'black',
        strokeWidth: 2,
        selectable: true,
        evented: false,
      });
      canvasRef?.current?.add(polyLine);
      setLine(polyLine);
    }
  };

  useEffect(() => {
    const handleMouseDown = (event: fabric.IEvent<MouseEvent>) => {
      if (isDrawing && canvasRef?.current) {
        const id = uuidv4();
        const pointer = canvasRef.current.getPointer(event.e);

        if (shapeType === ShapeType.ELLIPES) {
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
        } else if (shapeType === ShapeType.RECT) {
          const newRectangle = new fabric.Rect({
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
        } else if (shapeType === ShapeType.SQUARE) {
          const newRectangle = new fabric.Rect({
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
          canvasRef.current.add(newRectangle);
          setShape(newRectangle);
        } else if (shapeType === ShapeType.POLYGON || shapeType === ShapeType.POLYLINE) {
          if (polygonPoints.length === 0) {
            setPolygonPoints([{ x: pointer.x, y: pointer.y }]);
            const newLine = new fabric.Polyline([new fabric.Point(pointer.x, pointer.y)], {
              fill: 'rgba(0,0,0,0)',
              stroke: 'black',
              strokeWidth: 2,
              selectable: false,
              evented: false,
              width: 100,
              height: 100,
            });
            canvasRef.current.add(newLine);
            setLine(newLine);
          } else {
            addPoint(event);
          }
        } else if (shapeType === ShapeType.CIRCLE) {
          const newCircle = new fabric.Circle({
            left: pointer.x,
            top: pointer.y,
            radius: 0,
            fill: fillColor,
            stroke: strokeColor,
            strokeWidth,
            lockRotation: false,
            selectable: true,
            hasControls: true,
            id,
          });
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

    const handleMouseMove = (event: fabric.IEvent<MouseEvent>) => {
      if (isDrawing && canvasRef?.current && (shape || line)) {
        const pointer = canvasRef.current.getPointer(event.e);
        if (shapeType === ShapeType.ELLIPES) {
          const rx = Math.abs(pointer.x - (shape!.left ?? 0));
          const ry = Math.abs(pointer.y - (shape!.top ?? 0));
          (shape as fabric.Ellipse).set({ rx, ry });
        } else if (shapeType === ShapeType.RECT) {
          const { left, top } = shape as fabric.Rect;
          const width = pointer.x - (left ?? 0);
          const height = pointer.y - (top ?? 0);
          (shape as fabric.Rect).set({ width: Math.abs(width), height: Math.abs(height) });
          if (width < 0) (shape as fabric.Rect).set({ left: pointer.x });
          if (height < 0) (shape as fabric.Rect).set({ top: pointer.y });
        } else if (shapeType === ShapeType.TRIANGLE) {
          const width = Math.abs(pointer.x - startPos.x);
          const height = Math.abs(pointer.y - startPos.y);
          (shape as fabric.Triangle).set({
            width: width,
            height: height,
            left: Math.min(pointer.x, startPos.x),
            top: Math.min(pointer.y, startPos.y),
          });
        } else if (shapeType === ShapeType.SQUARE) {
          const width = Math.abs(pointer.x - (shape!.left ?? 0));
          const height = Math.abs(pointer.y - (shape!.top ?? 0));
          (shape as fabric.Rect).set({ width: Math.max(width, height), height: Math.max(width, height) });
        } else if (shapeType === ShapeType.LINE) {
          (shape as fabric.Line).set({ x2: pointer.x, y2: pointer.y });
        } else if (shapeType === ShapeType.CIRCLE) {
          const radius = Math.hypot(pointer.x - (shape!.left ?? 0), pointer.y - (shape!.top ?? 0));
          (shape as fabric.Circle).set({ radius: radius });
        } else if (shapeType === ShapeType.POLYGON || shapeType === ShapeType.POLYLINE) {
          const points = [...polygonPoints, { x: pointer.x, y: pointer.y }].map((p) => new fabric.Point(p.x, p.y));
          if (line) {
            line.set({ points });
          }
        }
        canvasRef.current.renderAll();
      }
    };

    const handleDoubleClick = () => {
      if (shapeType === ShapeType.POLYGON || shapeType === ShapeType.POLYLINE) {
        if (polygonPoints.length > 2) {
          const id = uuidv4();
          const polygon =
            shapeType === ShapeType.POLYGON
              ? new fabric.Polygon(polygonPoints, {
                  fill: fillColor,
                  stroke: strokeColor,
                  strokeWidth: strokeWidth,
                  selectable: true,
                  hasControls: true,
                  lockRotation: false,
                  id,
                })
              : new fabric.Polyline(polygonPoints, {
                  fill: fillColor,
                  stroke: strokeColor,
                  strokeWidth: strokeWidth,
                  selectable: true,
                  hasControls: true,
                  lockRotation: false,
                  id,
                });
          canvasRef?.current?.add(polygon);
          dispatch(addObject(id));
          setPolygonPoints([]);
          dispatch(setRequestUngroupActiveGroup(false));
          setIsDrawing(false);
          unlockObjects();
          setShape(null);
          if (line) {
            canvasRef?.current?.remove(line);
            setLine(null);
          }
          if (canvasRef?.current) {
            canvasRef.current.defaultCursor = 'default';
          }
        }
      }
    };

    const handleMouseUp = () => {
      if (shapeType !== ShapeType.POLYGON && shapeType !== ShapeType.POLYLINE) {
        dispatch(setRequestUngroupActiveGroup(false));
        setIsDrawing(false);
        unlockObjects();
        setShape(null);
        if (canvasRef?.current) {
          canvasRef.current.defaultCursor = 'default'; // Reset cursor
        }
      }
    };

    const handleObjectSelected = (event: fabric.IEvent) => {
      if (event.selected?.[0]?.type !== 'textbox') {
        dispatch(setStrokeWidth(event.selected?.[0]?.strokeWidth ?? 2));
        dispatch(setStrokeColor(event.selected?.[0]?.stroke ?? 'red'));
        dispatch(setFillColor((event.selected?.[0]?.fill as string) ?? ''));
      } else {
        dispatch(setFontSize((event.selected?.[0] as fabric.Text)?.fontSize ?? 2));
        dispatch(setTextColor(((event.selected?.[0] as fabric.Text)?.fill as string) ?? 'red'));
      }

      setSelectedShapes(event.selected ?? null);
    };

    const handleSelectionCleared = () => {
      setSelectedShapes(null);
    };

    canvasRef?.current?.on('mouse:down', handleMouseDown as (e: fabric.IEvent) => void);
    canvasRef?.current?.on('mouse:move', handleMouseMove as (e: fabric.IEvent) => void);
    canvasRef?.current?.on('mouse:up', handleMouseUp as (e: fabric.IEvent) => void);
    canvasRef?.current?.on('selection:created', handleObjectSelected as (e: fabric.IEvent) => void);
    canvasRef?.current?.on('selection:updated', handleObjectSelected as (e: fabric.IEvent) => void);
    canvasRef?.current?.on('selection:cleared', handleSelectionCleared as (e: fabric.IEvent) => void);
    canvasRef?.current?.on('mouse:dblclick', handleDoubleClick);

    return () => {
      canvasRef?.current?.off('mouse:down', handleMouseDown as (e: fabric.IEvent) => void);
      canvasRef?.current?.off('mouse:move', handleMouseMove as (e: fabric.IEvent) => void);
      canvasRef?.current?.off('mouse:up', handleMouseUp as (e: fabric.IEvent) => void);
      canvasRef?.current?.off('selection:created', handleObjectSelected as (e: fabric.IEvent) => void);
      canvasRef?.current?.off('selection:updated', handleObjectSelected as (e: fabric.IEvent) => void);
      canvasRef?.current?.off('selection:cleared', handleSelectionCleared as (e: fabric.IEvent) => void);
      canvasRef?.current?.off('mouse:dblclick', handleDoubleClick);
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
    line,
    shapeType,
  ]);

  useEffect(() => {
    if (selectedShapes && canvasRef?.current) {
      selectedShapes.map((shape) => {
        if (shape.type !== 'textbox') {
          shape.set('stroke', strokeColor);
          shape.set('strokeWidth', strokeWidth);
          if (shape.type != 'line') shape.set('fill', fillColor);
        } else {
          shape.set('fill', textColor);
          (shape as fabric.Textbox).set('fontSize', fontSize);
        }
      });
      canvasRef.current.renderAll();
    }
  }, [strokeColor, selectedShapes, canvasRef, fontSize, strokeWidth, fillColor, textColor]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Delete' || event.key === 'Backspace') {
        removeSelectedObjects();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedShapes, canvasRef]);

  return { startDrawing, isDrawing };
};

export default useDrawShape;
