import React, { ReactNode, createContext, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { v4 as uuidv4 } from 'uuid';

interface CanvasContextType {
  canvasRef: React.MutableRefObject<fabric.Canvas | null> | null;
  getObjectById: (id: string) => fabric.Object | undefined;
  removeObjects: (ids: string[]) => void;
  removeSelectedObjects: () => void;
  makeObjectsInvisible: (ids: string[]) => void;
  makeObjectsVisible: (ids: string[]) => void;
  makeObjectsGroup: (ids: string[]) => string;
  makeObjectsUngroup: (ids: string[]) => string[];
  rearrengeObjects: (layers: { id: number; objects: string[]; visible: boolean }[]) => void;
  lockObjects: () => void;
  unlockObjects: () => void;
  clearCanvas: () => void;
  selectedShapes: fabric.Object[] | null;
  setSelectedShapes: React.Dispatch<React.SetStateAction<fabric.Object[] | null>>;
}

const CanvasContext = createContext<CanvasContextType>({
  canvasRef: null,
  getObjectById: () => undefined,
  removeObjects: ([]) => {},
  removeSelectedObjects: () => {},
  makeObjectsInvisible: ([]) => {},
  makeObjectsVisible: ([]) => {},
  makeObjectsGroup: ([]) => {
    return '';
  },
  makeObjectsUngroup: ([]) => {
    return [];
  },
  rearrengeObjects: ([]) => {},
  lockObjects: () => {},
  unlockObjects: () => {},
  clearCanvas: () => {},
  selectedShapes: [],
  setSelectedShapes: () => {},
});
interface CanvasProviderProps {
  children: ReactNode;
}

const CanvasProvider: React.FC<CanvasProviderProps> = ({ children }) => {
  const canvasRef = useRef<fabric.Canvas | null>(null);
  const [selectedShapes, setSelectedShapes] = useState<fabric.Object[] | null>(null);
  const getObjectById = (id: string) => {
    return canvasRef.current?.getObjects().find((obj) => obj.id === id);
  };

  const removeObjects = (ids: string[]) => {
    ids.map((id) => {
      const object = getObjectById(id);
      if (object) {
        canvasRef.current?.remove(object);
      }
    });
  };

  const removeSelectedObjects = () => {
    if (selectedShapes && canvasRef?.current) {
      selectedShapes.forEach((shape) => {
        canvasRef.current?.remove(shape);
      });
      setSelectedShapes(null);
      canvasRef.current.discardActiveObject();
      canvasRef.current.renderAll();
    }
  };

  const rearrengeObjects = (layers: { id: number; objects: string[]; visible: boolean }[]) => {
    let index = 0;
    for (let layer of layers) {
      for (let objectId of layer.objects) {
        let object = getObjectById(objectId);
        object?.moveTo(index);
        index++;
      }
    }
    canvasRef?.current?.renderAll();
  };

  const makeObjectsInvisible = (ids: string[]) => {
    ids.map((id) => {
      let object = getObjectById(id);
      if (object) {
        object.visible = false;
      }
    });
    canvasRef?.current?.renderAll();
  };
  const makeObjectsVisible = (ids: string[]) => {
    ids.map((id) => {
      let object = getObjectById(id);
      if (object) {
        object.visible = true;
      }
    });
    canvasRef?.current?.renderAll();
  };
  const makeObjectsGroup = (ids: string[]) => {
    let id = uuidv4();
    let objects: fabric.Object[] = [];
    ids.forEach((id) => {
      let object = getObjectById(id);
      if (object) {
        objects.push(object);
      }
    });

    // Create a group with the objects
    const group = new fabric.Group(objects, { selectable: true, evented: true, id });

    // Remove individual objects from canvas and add the group
    objects.forEach((obj) => canvasRef?.current?.remove(obj));
    canvasRef?.current?.add(group);

    canvasRef?.current?.renderAll();
    return id;
  };

  const makeObjectsUngroup = (ids: string[]) => {
    let objects: fabric.Object[] = [];
    let resultIds: string[] = [];
    ids.forEach((id) => {
      let object = getObjectById(id);
      if (object) {
        objects.push(object);
      }
    });

    objects.forEach((object) => {
      if (object.type === 'group') {
        object = (object as fabric.Group).destroy();
        const groupObjects = (object as fabric.Group)._objects.slice();

        // Remove the group from the canvas
        canvasRef.current?.remove(object);

        // Add individual objects back to the canvas with adjusted positions
        groupObjects.forEach((obj) => {
          canvasRef.current?.add(obj);
          resultIds.push(obj.id ?? '');
        });
      }
    });

    canvasRef?.current?.renderAll();
    return resultIds;
  };

  const lockObjects = () => {
    canvasRef?.current?.getObjects().forEach((obj) => {
      obj.selectable = false;
      obj.evented = false;
    });
    canvasRef?.current?.renderAll();
  };

  const unlockObjects = () => {
    canvasRef?.current?.getObjects().forEach((obj) => {
      obj.selectable = true;
      obj.evented = true;
    });
    canvasRef?.current?.renderAll();
  };

  const clearCanvas = () => {
    canvasRef.current?.clear();
    canvasRef?.current?.renderAll();
  };

  const contextValue: CanvasContextType = {
    canvasRef,
    getObjectById,
    removeObjects,
    makeObjectsInvisible,
    makeObjectsVisible,
    rearrengeObjects,
    lockObjects,
    unlockObjects,
    makeObjectsGroup,
    makeObjectsUngroup,
    clearCanvas,
    selectedShapes,
    setSelectedShapes,
    removeSelectedObjects,
  };
  return <CanvasContext.Provider value={contextValue}>{children}</CanvasContext.Provider>;
};

export { CanvasContext, CanvasProvider };
