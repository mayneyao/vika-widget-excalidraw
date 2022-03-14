import Excalidraw from "@excalidraw/excalidraw";
import { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import { AppState } from "@excalidraw/excalidraw/types/types";
import { useThrottleFn } from '@vikadata/components';
import { useActiveViewId, useDatasheet, useFields, useRecord } from '@vikadata/widget-sdk';
import React, { useEffect, useMemo, useRef } from 'react';
import { getFieldNameIdMap } from "./helper";



export const ExcalidrawApp = (props: { recordId: string }) => {
  const { recordId } = props;
  const excalidrawRef = useRef(null);
  const datasheet = useDatasheet();
  const viewId = useActiveViewId();
  const fields = useFields(viewId);
  const fieldNameIdMap = getFieldNameIdMap(fields);
  const record = useRecord(recordId);

  const updateScene = (elements) => {
    const sceneData = {
      elements,
    };
    (excalidrawRef.current as any)?.updateScene(sceneData);
  };

  const getRecordFileContent = (record) => {
    const data = record.getCellValue(fieldNameIdMap['rawData'])
    try {
      if (!data) {
        return {}
      }
      return JSON.parse(data)
    } catch (error) {
      console.error(error)
      return {}
    }
  }

  useEffect(() => {
    const data = getRecordFileContent(record);
    updateScene(data.elements || [])
  }, [recordId]);

  const syncFileContext = async (elements: readonly ExcalidrawElement[], appState?: AppState) => {
    const valuesMap = {
      [fieldNameIdMap['rawData']]: JSON.stringify({
        elements,
        // appState,
      })
    }
    if (datasheet && recordId && datasheet.checkPermissionsForSetRecord(recordId, valuesMap).acceptable) {
      datasheet.setRecord(recordId, valuesMap);
      console.log('syncFileContext', recordId)
    }
  }

  const fileContentFromDst = useMemo(() => getRecordFileContent(record), [recordId, record])

  const { run } = useThrottleFn(syncFileContext, { wait: 10 * 1000 });


  return (
    <div style={{ display: 'flex', height: '100%' }}>
      <Excalidraw
        initialData={fileContentFromDst}
        ref={excalidrawRef}
        onChange={(elements, state) => {
          run(elements, state)
        }}
        // onPointerUpdate={(payload) => console.log(payload)}
        // onCollabButtonClick={() =>
        //   window.alert("You clicked on collab button")
        // }
        langCode="zh-CN"
        // renderFooter={() => <span>xxxxx</span>}
        // renderTopRightUI={() => <span>haha</span>}
        viewModeEnabled={false}
        zenModeEnabled={false}
        gridModeEnabled={false}
      />
    </div>
  );
};