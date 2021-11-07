import {
  UPDATE_DICTIONARY_DATA,
  UPDATE_TEXTS_DATA,
  UPDATE_ALL_DICTIONARY_DATA,
  UPDATE_LABEL_BY_SHOW,
  MODIFY_LABEL_OF_DICTIONARY_DATA,
  UPDATE_IS_SAVE,
  UPDATE_TEXT_TABLE_PAGE,
  UPDATE_MARK_TEXT_DATA,
  SET_LOADING_STATE,
  IDENTIFY_ENTITY,
  UPDATE_TRAIN_DATA,
  UPDATE_ALL_TEXTS_DATA,
} from '../types/actionTypes'
import { MarkTextsDataType, TableDataType, TextsDataType } from '../types/propsTypes'

/**
* 更新所有的字典数据
*/
export const updateAllDictionaryData = (dictionaryData: { [label: string]: TableDataType }) => ({
  type: UPDATE_ALL_DICTIONARY_DATA,
  dictionaryData
})
/**
* 更新展示的标签
*/
export const updateLabelByShow = (labelByShow: string) => ({
  type: UPDATE_LABEL_BY_SHOW,
  labelByShow
})

/**
* 修改对应标签的字典数据
*/
export const modifyLabelOfDictionaryData = (label: string, tableData: TableDataType) => ({
  type: MODIFY_LABEL_OF_DICTIONARY_DATA,
  label,
  tableData
})

/**
* 更新字典数据
*/
export const updateDictionaryData = (tableData: TableDataType) => ({
  type: UPDATE_DICTIONARY_DATA,
  tableData
})

/**
 * 更新所有的语料数据
 */
export const updateAllTextsData = (textsData: Array<TextsDataType>) => ({
  type: UPDATE_ALL_TEXTS_DATA,
  textsData
})

/**
* 更新语料数据
*/
export const updateTextsData = (data: TextsDataType) => ({
  type: UPDATE_TEXTS_DATA,
  data
})

/**
* 更改语料数据的保存状态
*/
export const updateIsSave = (isSave: boolean) => ({
  type: UPDATE_IS_SAVE,
  isSave
})

/**
* 更新语料表格的页码
*/
export const updateTextTablePage = (current: number) => ({
  type: UPDATE_TEXT_TABLE_PAGE,
  current
})

/**
* 更新标注的文本数据
*/
export const updateMarkTextData = (data:MarkTextsDataType) => ({
  type: UPDATE_MARK_TEXT_DATA,
  data
})

/**
* 更新训练集数据
*/
export const updateTrainData = (data:MarkTextsDataType) => ({
  type: UPDATE_TRAIN_DATA,
  data
})

/**
* 切换加载状态
*/
export const setLoadingState = (isLoading: boolean) => ({
  type: SET_LOADING_STATE,
  isLoading
})

/**
* 识别实体
*/
export const identifyEntity = () => ({
  type: IDENTIFY_ENTITY
})