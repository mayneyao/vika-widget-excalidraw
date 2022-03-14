import { initializeWidget, useSelection } from '@vikadata/widget-sdk';
import { ExcalidrawApp } from './draw_app';
import React, { useEffect, useState } from 'react';
import { FileList } from './file_list';

export const App: React.FC = () => {
  const [fileId, setFileId] = useState<string | null>(null); // fileId 就是 recordId 一个 record 表示一行记录
  const selection = useSelection();
  const selectedRecordId = selection?.recordIds[0];
  useEffect(() => {
    selectedRecordId && setFileId(selectedRecordId)
  }, [selectedRecordId])

  if (!fileId) {
    return <FileList onOpenFile={setFileId} />
  }
  return (
    <ExcalidrawApp recordId={fileId} />
  );
};

initializeWidget(App, process.env.WIDGET_PACKAGE_ID);
