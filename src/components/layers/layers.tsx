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
export default function Layers() {
  const layers = useSelector(selectLayers);
  const activeLayer = useSelector(selectActiveLayer);
  const ungroupActiveGroup = useSelector(selectRequestUngroupActiveGroup);
  const {
    canvasRef,
    removeObjects,
    makeObjectsInvisible,
    makeObjectsVisible,
    rearrengeObjects,
    makeObjectsGroup,
    makeObjectsUngroup,
  } = useContext(CanvasContext);

  useEffect(() => {
    rearrengeObjects(layers);
  }, [layers]);

  useEffect(() => {
    if (ungroupActiveGroup == true && activeLayer) {
      let activeLayerInfo = layers.find((la) => la.id == activeLayer);
      if (activeLayerInfo && activeLayerInfo.grouped == true) {
        handleLayerGroup(activeLayer, false, layers.find((la) => la.id == activeLayer)?.objects ?? []);
      }
    }
  }, [ungroupActiveGroup]);

  const dispatch = useDispatch();
  const addLayerLocal = () => {
    dispatch(addLayer());
  };
  const removeLayerLocal = (layerId: number) => {
    if (canvasRef?.current) {
      let objects = layers.find((layer) => layer.id == layerId)?.objects ?? [];
      removeObjects(objects);
    }
    dispatch(removeLayer(layerId));
  };
  const moveUp = (index: number) => {
    if (index > 0) {
      dispatch(moveLayerUp(index));
      if (canvasRef?.current) {
        rearrengeObjects(layers);
      }
    }
  };
  const moveDown = (index: number) => {
    if (index < layers.length - 1) {
      dispatch(moveLayerDown(index));

      if (canvasRef?.current) {
        rearrengeObjects(layers);
      }
    }
  };
  const setActiveLayerLocal = (layer: number) => {
    dispatch(setActiveLayer(layer));
  };

  const handleLayerVisibility = (layerId: number, visible: boolean, objectIds: string[]) => {
    if (visible == true) {
      makeObjectsVisible(objectIds);
    } else {
      makeObjectsInvisible(objectIds);
    }
    dispatch(changeLayerVisibility({ id: layerId, visible }));
  };

  const handleLayerGroup = (layerId: number, grouped: boolean, objectIds: string[]) => {
    let removed: string[] = [];
    let added: string[] = [];
    if (grouped == true) {
      let id = makeObjectsGroup(objectIds);
      added.push(id);
      removed = ([] as string[]).concat(removed, objectIds);
    } else {
      let ids = makeObjectsUngroup(objectIds);
      removed = ([] as string[]).concat(removed, objectIds);
      added = ([] as string[]).concat(added, ids);
    }
    dispatch(changeLayerGroup({ layerId, grouped, added, removed }));
  };

  return (
    <div>
      <div className={styles.header}>
        Layers
        <button onClick={addLayerLocal}>+</button>
      </div>
      <div className={styles.layersParrent}>
        {layers.map((layer, index) => (
          <div key={'layer' + layer.id} className={styles.layerRow}>
            <button onClick={() => moveUp(index)}>∧</button>
            <div
              className={classNames(styles.layersDiv, layer.id == activeLayer ? styles.activeLayer : '')}
              onClick={() => setActiveLayerLocal(layer.id)}
            >
              {layer.id}
            </div>
            <button onClick={() => moveDown(index)}>∨</button>
            <button onClick={() => removeLayerLocal(layer.id)}>-</button>
            <input
              type="checkbox"
              checked={layer.visible}
              onChange={() => {
                handleLayerVisibility(layer.id, !layer.visible, layer.objects);
              }}
            ></input>
            <input
              type="checkbox"
              checked={layer.grouped}
              onChange={() => {
                handleLayerGroup(layer.id, !layer.grouped, layer.objects);
              }}
            ></input>
          </div>
        ))}
      </div>
    </div>
  );
}
