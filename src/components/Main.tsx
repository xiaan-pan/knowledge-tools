import React, { Component } from 'react';
import { Layout, Menu, Button, message, Avatar, Dropdown, Select } from 'antd';
import 'antd/dist/antd.css';
import { UploadOutlined, PlayCircleOutlined, FileTextOutlined } from '@ant-design/icons';
import Icon, { UserOutlined } from '@ant-design/icons';
import {
  Route,
  Switch,
} from 'react-router-dom'
import { connect } from 'react-redux';
import $ from 'jquery'
import XLSX from 'xlsx'
import { DictionaryIcon, TrainIcon } from './Icon';
import TextView from './TextView';
import { MainStoreType, StoreType, TableDataType, TextsDataType } from '../types/propsTypes';
import { identifyEntity, setLoadingState, updateAllDictionaryData, updateAllTextsData, updateDictionaryData, updateLabelByShow, updateMarkTextData, updateTextsData } from '../action';
import DictionaryView from './DictionaryView';
import MarkView from './MarkView';
import axios, { AxiosResponse } from 'axios';
import { PATH } from '../types/actionTypes';
// import { DictionaryIcon, TrainIcon } from './Icon'
// import { MainStoreType, StoreType, TextsDataType } from '../types/propsTypes';
// import { connect } from 'react-redux';
// import DictionaryWindow from './DictionaryWindow';
// import { identifyEntity, setLoadingState, updateAllDictionaryData, updateDictionaryData, updateLabelByShow, updateMarkTextData, updateTextsData } from '../action';
// import TextWindow from './TextWindow';
// import MarkView from './MarkView';
// import Loading from './Loading/index';
// import TrainView from './TrainView';

axios.defaults.withCredentials = true

interface MainProps extends MainStoreType {
  history: any,
  updateAllTextsData: typeof updateAllTextsData,
  updateAllDictionaryData: typeof updateAllDictionaryData,
//   updateLabelByShow: typeof updateLabelByShow,
  updateDictionaryData: typeof updateDictionaryData,
  updateTextsData: typeof updateTextsData,
//   setLoadingState: typeof setLoadingState,
//   identifyEntity: typeof identifyEntity,
  updateMarkTextData: typeof updateMarkTextData,
}
interface MainState {
  labelList: Array<string>,
  stringList: Array<string>,
  openKeys: Array<string>,
  selectedKeys: Array<string>,
  repositories: Array<{
    name: string,
    repositoryId: string,
  }>

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
      selectedKeys: [],
      repositories: [{ name: '私有仓库', repositoryId: 'private' }],
    }
  }

  public render(): JSX.Element {
    const { Header, Sider, Content } = Layout;
    const { SubMenu } = Menu;
    const { Option } = Select;
    const { labelList, stringList, openKeys, selectedKeys, repositories } = this.state;
    const { history, textsData, dictionaryData } = this.props;
    const { updateAllTextsData, updateTextsData, updateAllDictionaryData, updateDictionaryData } = this.props;
    // console.log(dictionaryData)
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
              history.push('/')
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
                      updateDictionaryData(dictionaryData[value])
                      this.setState({ selectedKeys: [value] })
                      history.push('/index/dictionary')
                    }
                  }>
                    {value}
                  </Menu.Item>
                ))
              }
            </SubMenu>
            {/* <SubMenu key="text" title="语料数据" icon={<FileTextOutlined />} onTitleClick={
              (e) => {
                this.setState({ openKeys: openKeys[0] === e.key ? [] : [e.key] })
              }
            }>
              {
                stringList.map((value: string, index: number) => (
                  <Menu.Item key={'text' + index} onClick={
                    () => {
                      history.push('/index/texts')
                      updateTextsData(textsData[index])
                      this.setState({ selectedKeys: ['text' + index] })
                    }
                  }>
                    {value}
                  </Menu.Item>
                ))
              }
            </SubMenu> */}
            <Menu.Item icon={<FileTextOutlined />} onClick={
              () => {
                history.push('/index/texts')
                // updateTextsData(textsData[index])
                // this.setState({ selectedKeys: ['text' + index] })
              }
            }>
              语料数据
            </Menu.Item>
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
            <input type="file"  id="dict-files" accept='application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
              style={{ display: 'none' }} onChange={
                (event: React.ChangeEvent<HTMLInputElement>) => {
                  const fileByRead:FileList = event.currentTarget.files as FileList
                  const reader = new FileReader(); 
                  reader.readAsArrayBuffer(fileByRead[0]); //读取文件的内容
                  reader.onload = () => {
                    // console.log(reader.result)
                    const { result } = reader;
                    const wb = XLSX.read(result)
                    /* Get first worksheet */
                    const wsname = wb.SheetNames[0];
                    const ws = wb.Sheets[wsname];
                    /* Convert array of arrays */
                    const data:Array<Array<string>> = XLSX.utils.sheet_to_json(ws, {header:1});
                    // console.log(data)
                    const dataByAdd:TableDataType = []
                    for(let i = data.length - 1; i > 0; i--) {//;
                      const d = {
                        name: data[i][1],
                        label: data[i][0],
                        key: Number(Math.random().toString().substr(3, 10) + Date.now()).toString(36),
                        abbreviations: [...data[i].slice(2)]
                      }
                      dataByAdd.push(d)
                      if(labelList.includes(data[i][0])) {
                        dictionaryData[data[i][0]].push(d)
                      } else {
                        labelList.push(data[i][0])
                        dictionaryData[data[i][0]] = [d]
                      }
                    }
                    axios.post(`${PATH}/upload_dictionary`, dataByAdd, {withCredentials: true})
                      .then((res:AxiosResponse<any>) => {
                        console.log(res.data)
                      })
                    history.push('/index/dictionary')
                    message.success('您已成功上传的字典数据', 1)
                    updateAllDictionaryData(JSON.parse(JSON.stringify(dictionaryData)))
                    this.setState({ labelList })
                  }
                }
              }
            />
            <Button icon={<UploadOutlined />} onClick={
              () => {
                $('input#dict-files').click()
                this.setState({ openKeys: ['dictionary'] })
              }
            }>
              上传字典
            </Button>
            <input type="file" id="text-files" placeholder='a.txt' accept='text/plain' style={{
              display: 'none'
            }} onChange={
              (event: React.ChangeEvent<HTMLInputElement>) => {
                const fileByRead:FileList = event.currentTarget.files as FileList
                const name:string = fileByRead[0].name
                const reader = new FileReader(); 
                reader.readAsText(fileByRead[0]); //读取文件的内容
                reader.onload = () => {
                  // console.log(this.result)
                  const { result } = reader;
                  const data:Array<string> = (result as string).split('\r\n').filter((value: string) => value !== '')
                  // console.log(data)
                  const textsData:TextsDataType = data.map((value: string) => ({
                    key: Number(Math.random().toString().substr(3, 10) + Date.now()).toString(36),
                    text: value,
                    label: [],
                    // textArr: []
                    textArr: value.split('').map((font:string, index:number) => ({
                      start: index,
                      end: index,
                      text: font,
                      label: 'none',
                      color: 'blue'
                    }))
                  }))
                  updateTextsData(textsData)
                  axios.post(`${PATH}/upload_texts`, textsData, {withCredentials: true})
                      .then((res:AxiosResponse<any>) => {
                        console.log(res.data)
                      })
                  // updateAllTextsData(textsData)
                  history.push('/index/texts')
                  // stringList.push(name)
                  // this.setState({ stringList })
                  message.success('您已成功上传的语料数据', 1)
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
                let index = stringList.length;
                // for (let i = 0; i < stringList.length - 1; i++) {
                //   if (stringList[i][0] === path.split('\\').pop() && stringList[i][1] === path) {
                //     stringList.pop()
                //     index = i
                //     break;
                //   }
                // }
                this.setState({ openKeys: ['text'], selectedKeys: ['text' + index] })
                // this.readTxtFile(path)
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
            <Avatar size='default' icon={<UserOutlined />} style={{
              float: 'right',
              marginTop: '15px',
              marginRight: '15px'
            }}/>
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
              <Route path="/index/dictionary" component={DictionaryView} />
              <Route path="/index/texts" component={TextView}/>
              <Route path='/index/mark' component={MarkView} />
              {/* <Route path='/train' component={TrainView} /> */}
              
              {/* <Route path="/force-directed" component={ForceDirectedView} exact/> */}
            </Switch>
          </Content>
        </Layout>
      </Layout>
    )
  }

  public componentDidMount(): void {
    const { labelList } = this.state;
    const { history, updateAllDictionaryData, updateTextsData, updateMarkTextData } = this.props;
    axios.get(`${PATH}/get_dictionary` )
      .then((res: AxiosResponse<any>) => {
        const { data: response } = res;
        if (response['status'] === 200 && response['message'] === '获取成功') {
          const dictionaryData:{
            [label: string]: TableDataType
          } = {}
          const { data } = response;
          console.log(data)
          for(let i = data.length - 1; i > 0; i--) {
            if(labelList.includes(data[i]['label'])) {
              dictionaryData[data[i]['label']].push(data[i])
            } else {
              labelList.push(data[i]['label'])
              dictionaryData[data[i]['label']] = [data[i]]
            }
          }
          updateAllDictionaryData(dictionaryData)
        } else {
          message.error('请您先登录', 1.5, () => {
            this.props.history.push('/')
          })
        }
      })
    axios.get(`${PATH}/get_texts` )
      .then((res: AxiosResponse<any>) => {
        const { data: response } = res;
        if (response['status'] === 200 && response['message'] === '获取成功') {
          updateTextsData(response.data)
          updateMarkTextData(response.data)
        } else {
          message.error('请您先登录', 1.5, () => {
            this.props.history.push('/')
          })
        }
      })
    

  }



}


const mapStateToProps = (state: StoreType, ownProps?: any) => {
  const { Main } = state
  // console.log()
  return {
    ...ownProps,
    ...Main,
  }
}

const mapDispatchToProps = {
  updateAllDictionaryData,
  updateLabelByShow,
  updateDictionaryData,
  updateAllTextsData,
  updateTextsData,
  setLoadingState,
  identifyEntity,
  updateMarkTextData
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);