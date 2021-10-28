/**
 * 全局 store 类型
 */
 export interface StoreType {
  // Main: MainStoreType,
  // DictionaryWindow: DictionaryWindowStoreType,
  TextWindow: TextWindowStoreType,
  // MarkView: MarkViewStoreType,
  // Loading: LoadingStoreType,
  // TrainView: MarkViewStoreType,
}


export interface MainStoreType {
  dictionaryData: {
      [label: string]: TableDataType
  },
  labelByShow: string,
  isSave: boolean,
}

export interface DictionaryWindowStoreType {
  tableData: TableDataType,
  path: string
}

export interface TextWindowStoreType {
  data: TextsDataType,
  path: string,
  isSave: boolean,
  current: number,
}

export interface MarkViewStoreType {
  data: MarkTextsDataType,
  current: number,
}

export interface LoadingStoreType {
  isLoading: boolean
}

/**
* 字典数据类型
*/
export type TableDataType = Array<{
  name: string,
  label: string,
  key?: string,
  abbreviations: Array<string>
}>

/**
* 语料数据类型
*/
export type TextsDataType = Array<{
  key?: string,
  text: string,
  label: Array<{
      start: number,
      end: number,
      label: string
  }>
}>

/**
* 待标注的语料数据
*/
export type MarkTextsDataType = Array<{
  key?: string,
  text: string,
  label: Array<{
      start: number,
      end: number,
      label: string
  }>,
  textArr: Array<FontObject>
}>

/**
* 单个文字的类型
*/
export interface FontObject {
  text: string,
  start: number,
  end: number,
  label: string,
  color: string,
}
