import { useDispatch, useSelector } from 'react-redux';
import styles from './layers.module.css';
import {
  changeLayerVisibility,
  selectActiveLayer,
  selectLayers,
  setActiveLayer,
  addLayer,
  removeLayer,
  moveLayerDown,
  moveLayerUp,
  changeLayerGroup,
  selectRequestUngroupActiveGroup,
} from '../../redux/slices/imageSlice';
import classNames from 'classnames';
import { useContext, useEffect } from 'react';
import { CanvasContext } from '../../contexts/canvasContext';

/**
 * Layers component for managing layers in the canvas.
 *
 * Each layer is a set of objects. This component allows the user to select the active layer,
 * move layers up and down (reordering them), remove layers, toggle layer visibility,
 * and group or ungroup objects within layers. Layer information is stored in Redux, and
 * canvas object manipulation is handled through the CanvasContext.
 *
 * @returns A React component for managing layers.
 */
export default function Layers() {
  const layers = useSelector(selectLayers); // Get layers from Redux store
  const activeLayer = useSelector(selectActiveLayer); // Get the currently active layer from Redux store
  const ungroupActiveGroup = useSelector(selectRequestUngroupActiveGroup); // Get the request to ungroup active group from Redux store
  const {
    canvasRef,
    removeObjects,
    makeObjectsInvisible,
    makeObjectsVisible,
    rearrengeObjects,
    makeObjectsGroup,
    makeObjectsUngroup,
  } = useContext(CanvasContext); // Access canvas manipulation functions from CanvasContext

  // Effect to re-arrange objects in the canvas when layers change
  useEffect(() => {
    rearrengeObjects(layers);
  }, [layers]);

  // Effect to handle ungrouping of objects when requested
  useEffect(() => {
    if (ungroupActiveGroup === true && activeLayer) {
      let activeLayerInfo = layers.find((la) => la.id === activeLayer);
      if (activeLayerInfo && activeLayerInfo.grouped === true) {
        handleLayerGroup(activeLayer, false, layers.find((la) => la.id === activeLayer)?.objects ?? []);
      }
    }
  }, [ungroupActiveGroup]);

  const dispatch = useDispatch();

  // Function to add a new layer
  const addLayerLocal = () => {
    dispatch(addLayer());
  };

  // Function to remove a layer and its objects
  const removeLayerLocal = (layerId: number) => {
    if (canvasRef?.current) {
      let objects = layers.find((layer) => layer.id === layerId)?.objects ?? [];
      removeObjects(objects); // Remove objects from the canvas
    }
    dispatch(removeLayer(layerId)); // Remove layer from Redux store
  };

  // Function to move a layer up in the order
  const moveUp = (index: number) => {
    if (index > 0) {
      dispatch(moveLayerUp(index));
      if (canvasRef?.current) {
        rearrengeObjects(layers); // Re-arrange objects in the canvas
      }
    }
  };

  // Function to move a layer down in the order
  const moveDown = (index: number) => {
    if (index < layers.length - 1) {
      dispatch(moveLayerDown(index));
      if (canvasRef?.current) {
        rearrengeObjects(layers); // Re-arrange objects in the canvas
      }
    }
  };

  // Function to set the active layer
  const setActiveLayerLocal = (layer: number) => {
    dispatch(setActiveLayer(layer));
  };

  // Function to handle layer visibility toggling
  const handleLayerVisibility = (layerId: number, visible: boolean, objectIds: string[]) => {
    if (visible === true) {
      makeObjectsVisible(objectIds); // Make objects visible in the canvas
    } else {
      makeObjectsInvisible(objectIds); // Make objects invisible in the canvas
    }
    dispatch(changeLayerVisibility({ id: layerId, visible })); // Update layer visibility in Redux store
  };

  // Function to handle grouping or ungrouping of layer objects
  const handleLayerGroup = (layerId: number, grouped: boolean, objectIds: string[]) => {
    let removed: string[] = [];
    let added: string[] = [];
    if (grouped === true) {
      let id = makeObjectsGroup(objectIds); // Group objects in the canvas
      added.push(id);
      removed = removed.concat(objectIds);
    } else {
      let ids = makeObjectsUngroup(objectIds); // Ungroup objects in the canvas
      removed = removed.concat(objectIds);
      added = added.concat(ids);
    }
    dispatch(changeLayerGroup({ layerId, grouped, added, removed })); // Update layer grouping in Redux store
  };

  return (
    <div>
      <div className={styles.header}>
        Layers
        <button onClick={addLayerLocal}>+</button>
      </div>
      <div className={styles.layersParrent}>
        {layers.map((layer, index) => (
          <div className={styles.mainRow} key={'layer' + layer.id}>
            <div className={styles.layerRow}>
              <button onClick={() => moveUp(index)}>∧</button>
              <div
                className={classNames(styles.layersDiv, layer.id === activeLayer ? styles.activeLayer : '')}
                onClick={() => setActiveLayerLocal(layer.id)}
              >
                {layer.id}
              </div>
              <button onClick={() => moveDown(index)}>∨</button>
              <button onClick={() => removeLayerLocal(layer.id)}>-</button>
            </div>
            <div className={styles.layerRow2}>
              <input
                type="checkbox"
                checked={layer.visible}
                onChange={() => {
                  handleLayerVisibility(layer.id, !layer.visible, layer.objects);
                }}
                id="VisibleCheck"
              ></input>
              <label htmlFor="VisibleCheck">Visible</label>
              <input
                type="checkbox"
                checked={layer.grouped}
                onChange={() => {
                  handleLayerGroup(layer.id, !layer.grouped, layer.objects);
                }}
                id="GroupedCheck"
              ></input>
              <label htmlFor="GroupedCheck">Group</label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
