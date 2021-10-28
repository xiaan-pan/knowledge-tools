import React, { Component } from 'react';
import { Layout, Menu, Button, message } from 'antd';
import 'antd/dist/antd.css';
import { UploadOutlined, PlayCircleOutlined, FileTextOutlined } from '@ant-design/icons';
import Icon from '@ant-design/icons';
import {
  Route,
  Switch,
} from 'react-router-dom'
import { connect } from 'react-redux';
import $ from 'jquery'
import { DictionaryIcon, TrainIcon } from './Icon';
// import { IDENTIFY_ENTITY_RESULT, UPLOAD_DICTIONARY_DATA, UPLOAD_TEXTS_DATA } from '../types/ipc';
// import { DictionaryIcon, TrainIcon } from './Icon'
// import { MainStoreType, StoreType, TextsDataType } from '../types/propsTypes';
// import { connect } from 'react-redux';
// import DictionaryWindow from './DictionaryWindow';
// import { identifyEntity, setLoadingState, updateAllDictionaryData, updateDictionaryData, updateLabelByShow, updateMarkTextData, updateTextsData } from '../action';
// import TextWindow from './TextWindow';
// import MarkView from './MarkView';
// import Loading from './Loading/index';
// import TrainView from './TrainView';


interface MainProps {
  history: any,
//   updateAllDictionaryData: typeof updateAllDictionaryData,
//   updateLabelByShow: typeof updateLabelByShow,
//   updateDictionaryData: typeof updateDictionaryData,
//   updateTextsData: typeof updateTextsData,
//   setLoadingState: typeof setLoadingState,
//   identifyEntity: typeof identifyEntity,
//   updateMarkTextData: typeof updateMarkTextData,
}
interface MainState {
  labelList: Array<string>,
  stringList: Array<string>,
  openKeys: Array<string>,
  selectedKeys: Array<string>,

}
class Main extends Component<MainProps, MainState>{
  public constructor(props: MainProps) {
    super(props)
    this.state = {
      labelList: [],
      stringList: [
        // ['dsa', 'gds'], 
        // ['dsa', 'gds'], 
        // ['dsa', 'gds'], 

      ],
      openKeys: ['directory'],
      selectedKeys: []
    }
  }

  public render(): JSX.Element {
    const { Header, Sider, Content } = Layout;
    const { SubMenu } = Menu;
    const { labelList, stringList, openKeys, selectedKeys } = this.state;
    return (
      <Layout style={{
        height: '100%'
      }}>
        <Sider trigger={null} theme="light">
          <div className="logo" style={{
            width: '100%',
            height: '60px',
            // marginLeft: '2%',
            lineHeight: '60px',
            textAlign: 'center',
            fontSize: '24px',
            fontWeight: 'bold',
            color: 'rgb(13,110,253)',
            userSelect: 'none'
          }} onClick={
            () => {
              // history.push('/')
            }
          }>
            实体抽取工具
          </div>
          <Menu theme="light" mode="inline" openKeys={openKeys} selectedKeys={selectedKeys}>
            <SubMenu key="dictionary" title="字典数据" icon={<Icon component={DictionaryIcon} />} onTitleClick={
              (e) => {
                // console.log(e);
                this.setState({ openKeys: openKeys[0] === e.key ? [] : [e.key] })
              }
            }>
              {
                labelList.map((value: string, index: number) => (
                  <Menu.Item key={value} onClick={
                    () => {
                      // this.props.updateLabelByShow(value)
                      // this.props.updateDictionaryData(dictionaryData[value])
                      // this.setState({ selectedKeys: [value] })
                      // history.push('/dictionary')
                    }
                  }>
                    {value}
                  </Menu.Item>
                ))
              }
            </SubMenu>
            <SubMenu key="text" title="语料数据" icon={<FileTextOutlined />} onTitleClick={
              (e) => {
                this.setState({ openKeys: openKeys[0] === e.key ? [] : [e.key] })
              }
            }>
              {
                stringList.map((value: string, index: number) => (
                  <Menu.Item key={'text' + index} onClick={
                    () => {
                      // this.setState({ selectedKeys: ['text' + index] })
                      // history.push('/texts')
                      // this.readTxtFile(value[1])
                    }
                  }>
                    {value}
                  </Menu.Item>
                ))
              }
            </SubMenu>
            <Menu.Item key={'train'} icon={<Icon component={TrainIcon}/>} onClick={
              () => {
                // history.push('/train')
              }
            }>
              训练数据
            </Menu.Item>
           
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Header className="site-layout-background" style={{ padding: 0, backgroundColor: 'white' }}>
            <Button icon={<UploadOutlined />} onClick={
              () => {

              }
            }>
              上传字典
            </Button>
            <input type="file" id="text-files" accept='text/plain' style={{
              display: 'none'
            }} onChange={
              (e) => {
                const fileByRead:FileList = e.currentTarget.files as FileList
                const name:string = fileByRead[0].name
                const reader = new FileReader(); 
                reader.readAsText(fileByRead[0]); //读取文件的内容
                reader.onload = () => {
                  // console.log(this.result)
                  const { result } = reader;
                  const data:Array<string> = (result as string).split('\r\n').filter((value: string) => value !== '')
                  console.log(data)
                  stringList.push(name)
                  this.setState({ stringList })
                }
              }
            } />
            <Button icon={<UploadOutlined />} onClick={
              () => {
                $('input#text-files').click()
                // const path: string = ipcRenderer.sendSync(UPLOAD_TEXTS_DATA)
                // if (path === '') {
                //   message.success('您已取消上传', 1);
                //   return;
                // }
                // stringList.push([path.split('\\')[path.split('\\').length - 1], path])
                // let index = stringList.length - 1
                // for (let i = 0; i < stringList.length - 1; i++) {
                //   if (stringList[i][0] === path.split('\\').pop() && stringList[i][1] === path) {
                //     stringList.pop()
                //     index = i
                //     break;
                //   }
                // }
                // this.setState({ stringList, openKeys: ['text'], selectedKeys: ['text' + index] })
                // this.readTxtFile(path)
                // message.success('您已成功上传的语料数据', 1)
              }
            }>
              上传语料
            </Button>
            <Button icon={<PlayCircleOutlined />} onClick={
              () => {
                // setLoadingState(true)
                // identifyEntity()
                // ipcRenderer.send(OPEN_MODEL_CONFIG_WINDOW)
              }
            }>
              实体标注
            </Button>
          </Header>
          <Content className="site-layout-background"
            style={{
              // margin: '24px 16px',
              // padding: 24,
              minHeight: 600,
            }}
          >
            {/* <Loading /> */}
            <Switch>
              {/* <Route path="/dictionary" component={DictionaryWindow} />
              <Route path="/texts" component={TextWindow}/>
              <Route path='/mark' component={MarkView} />
              <Route path='/train' component={TrainView} /> */}

              {/* <Route path="/force-directed" component={ForceDirectedView} exact/> */}
            </Switch>
          </Content>
        </Layout>
      </Layout>
    )
  }

  public componentDidMount(): void {

  }



}


export default Main