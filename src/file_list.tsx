import { List, TextButton } from '@vikadata/components';
import { useRecordsAll, useFields, useActiveViewId } from '@vikadata/widget-sdk';
import { getFieldNameIdMap } from './helper';
import React from 'react';

export const FileList = (props) => {
  const viewId = useActiveViewId();
  const records = useRecordsAll();
  const fields = useFields(viewId);
  const fieldNameIdMap = getFieldNameIdMap(fields)
  const data = records.map(record => {
    return {
      actions: [
        <TextButton size="x-small">{record.getCellValueString(fieldNameIdMap['updatedAt'])}</TextButton>,
        <TextButton size="x-small">{record.getCellValueString(fieldNameIdMap['createdAt'])}</TextButton>,
        <TextButton color='primary' size="x-small" onClick={() => {
          props.onOpenFile && props.onOpenFile(record.id)
        }}>open</TextButton>
      ],
      children: record.title
    }
  })
  return <List
    data={data}
  />
}