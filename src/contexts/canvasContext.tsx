import React, { ReactNode, createContext, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { v4 as uuidv4 } from 'uuid';

// Define the type for the context values
interface CanvasContextType {
  canvasRef: React.MutableRefObject<fabric.Canvas | null> | null; // Reference to the Fabric.js canvas
  getObjectById: (id: string) => fabric.Object | undefined; // Function to get Fabric.js object by ID
  removeObjects: (ids: string[]) => void; // Function to remove objects from canvas by their IDs
  removeSelectedObjects: () => void; // Function to remove currently selected objects from canvas
  makeObjectsInvisible: (ids: string[]) => void; // Function to make objects with given IDs invisible
  makeObjectsVisible: (ids: string[]) => void; // Function to make objects with given IDs visible
  makeObjectsGroup: (ids: string[]) => string; // Function to group objects with given IDs into a new group
  makeObjectsUngroup: (ids: string[]) => string[]; // Function to ungroup a group with given IDs into individual objects
  rearrengeObjects: (layers: { id: number; objects: string[]; visible: boolean }[]) => void; // Function to rearrange objects based on layers
  lockObjects: () => void; // Function to lock (disable interaction) all objects on canvas
  unlockObjects: () => void; // Function to unlock (enable interaction) all objects on canvas
  clearCanvas: () => void; // Function to clear all objects from the canvas
  selectedShapes: fabric.Object[] | null; // State for currently selected objects on canvas
  setSelectedShapes: React.Dispatch<React.SetStateAction<fabric.Object[] | null>>; // Function to set selected objects
  getCanvasAtResoution: (newWidth: number, newHeight: number) => void; // Function to resize canvas and objects
  createDataUrl: (
    imagePreview: string | null,
    imageWidth: number,
    imageHeight: number,
    imageType: string
  ) => Promise<string | null>;
}

// Create the canvas context with initial default values
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
  getCanvasAtResoution: () => {},
  createDataUrl: () => {
    return Promise.resolve(null);
  },
});

// Props interface for the CanvasProvider component
interface CanvasProviderProps {
  children: ReactNode; // Children elements that will have access to the canvas context
}

// CanvasProvider component manages the Fabric.js canvas and provides context to its children
const CanvasProvider: React.FC<CanvasProviderProps> = ({ children }) => {
  const canvasRef = useRef<fabric.Canvas | null>(null); // Reference to the Fabric.js canvas
  const [selectedShapes, setSelectedShapes] = useState<fabric.Object[] | null>(null); // State to hold selected objects

  // Function to get Fabric.js object by its ID
  const getObjectById = (id: string) => {
    return canvasRef.current?.getObjects().find((obj) => obj.id === id);
  };

  // Function to remove objects from canvas by their IDs
  const removeObjects = (ids: string[]) => {
    ids.forEach((id) => {
      const object = getObjectById(id);
      if (object) {
        canvasRef.current?.remove(object);
      }
    });
  };
  const createDataUrl = (
    imagePreview: string | null,
    imageWidth: number,
    imageHeight: number,
    imageType: string
  ): Promise<string | null> => {
    return new Promise((resolve, reject) => {
      let dataURL: string | null | undefined = null;
      const offScreenCanvas = new fabric.Canvas(null, { width: imageWidth, height: imageHeight });

      if (imagePreview) {
        // Set the original image as the background of the off-screen canvas
        fabric.Image.fromURL(
          imagePreview,
          (img) => {
            offScreenCanvas.setBackgroundImage(img, offScreenCanvas.renderAll.bind(offScreenCanvas), {
              top: 0,
              left: 0,
              originX: 'left',
              originY: 'top',
            });

            const displayWidth = canvasRef.current?.width;
            const displayHeight = canvasRef.current?.height;
            const scaleX = imageWidth / (displayWidth ?? 1);
            const scaleY = imageHeight / (displayHeight ?? 1);

            // Copy all objects from the main canvas to the off-screen canvas
            canvasRef.current?.getObjects().forEach((obj) => {
              const clone = fabric.util.object.clone(obj);
              clone.set({
                scaleX: clone.scaleX * scaleX,
                scaleY: clone.scaleY * scaleY,
                left: clone.left * scaleX,
                top: clone.top * scaleY,
              });
              offScreenCanvas.add(clone);
            });

            // Render the off-screen canvas
            offScreenCanvas.renderAll();

            // Save the off-screen canvas as an image
            dataURL = offScreenCanvas.toDataURL({
              format: imageType,
              quality: 1.0,
            });

            resolve(dataURL); // Resolve the promise with the dataURL
          },
          {
            crossOrigin: 'Anonymous', // Add this if you are facing cross-origin issues
          }
        );
      }
    });
  };
  // Function to remove currently selected objects from canvas
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

  // Function to rearrange objects based on layers configuration
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

  // Function to make objects with given IDs invisible
  const makeObjectsInvisible = (ids: string[]) => {
    ids.forEach((id) => {
      let object = getObjectById(id);
      if (object) {
        object.visible = false;
      }
    });
    canvasRef?.current?.renderAll();
  };

  // Function to make objects with given IDs visible
  const makeObjectsVisible = (ids: string[]) => {
    ids.forEach((id) => {
      let object = getObjectById(id);
      if (object) {
        object.visible = true;
      }
    });
    canvasRef?.current?.renderAll();
  };

  // Function to group objects with given IDs into a new group
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

  // Function to ungroup a group with given IDs into individual objects
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

  // Function to lock (disable interaction) all objects on canvas
  const lockObjects = () => {
    canvasRef?.current?.getObjects().forEach((obj) => {
      obj.selectable = false;
      obj.evented = false;
    });
    canvasRef?.current?.renderAll();
  };

  // Function to unlock (enable interaction) all objects on canvas
  const unlockObjects = () => {
    canvasRef?.current?.getObjects().forEach((obj) => {
      obj.selectable = true;
      obj.evented = true;
    });
    canvasRef?.current?.renderAll();
  };

  // Function to clear all objects from the canvas
  const clearCanvas = () => {
    canvasRef.current?.clear();
    canvasRef?.current?.renderAll();
  };

  // Function to resize canvas and objects based on new width and height
  const getCanvasAtResoution = (newWidth: number, newHeight: number) => {
    if (canvasRef?.current) {
      let canvas = canvasRef.current;
      if (canvas.width != newWidth) {
        var scaleMultiplier = newWidth / (canvas.width ?? 1);
        var objects = canvas.getObjects();
        for (var i in objects) {
          objects[i].scaleX = (objects[i].scaleX ?? 1) * scaleMultiplier;
          objects[i].scaleY = (objects[i].scaleY ?? 1) * scaleMultiplier;
          objects[i].left = (objects[i].left ?? 1) * scaleMultiplier;
          objects[i].top = (objects[i].top ?? 1) * scaleMultiplier;
          objects[i].setCoords();
        }
        var obj = canvas.backgroundImage;
        if (obj) {
          (obj as fabric.Image).scaleX = ((obj as fabric.Image)?.scaleX ?? 1) * scaleMultiplier;
          (obj as fabric.Image).scaleY = ((obj as fabric.Image)?.scaleY ?? 1) * scaleMultiplier;
        }

        canvas.discardActiveObject();
        canvas.setWidth(newWidth);
        canvas.setHeight(newHeight);
        canvas.renderAll();
        canvas.calcOffset();
      }
    }
  };

  // Provide the context value to the children components
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
    getCanvasAtResoution,
    createDataUrl,
  };

  // Render the context provider with the context value and children components
  return <CanvasContext.Provider value={contextValue}>{children}</CanvasContext.Provider>;
};

// Export both the context and provider for use in other components
export { CanvasContext, CanvasProvider };
