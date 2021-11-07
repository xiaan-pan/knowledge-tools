/**
 * 全局 store 类型
 */
 export interface StoreType {
  Main: MainStoreType,
  DictionaryView: DictionaryViewStoreType,
  TextView: TextViewStoreType,
  MarkView: MarkViewStoreType,
  // Loading: LoadingStoreType,
  // TrainView: MarkViewStoreType,
}


export interface MainStoreType {
  dictionaryData: {
      [label: string]: TableDataType
  },
  textsData: Array<TextsDataType>,
  labelByShow: string,
  isSave: boolean,
}

export interface DictionaryViewStoreType {
  tableData: TableDataType,
  path: string
}

export interface TextViewStoreType {
  data: TextsDataType,
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
  }>,
  textArr?: Array<FontObject>
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
  _id?: string
}
