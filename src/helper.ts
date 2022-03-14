import { IField } from "@vikadata/widget-sdk";

export const getFieldNameIdMap = (fields: IField[]) => {
  return fields.reduce((res, field) => {
    res[field.name] = field.id
    return res;
  }, {})
}