import React, { Component } from 'react';
import 'antd/dist/antd.css';
import { Button, Modal, Table, Input, message } from 'antd';
import { ExclamationCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import Icon from '@ant-design/icons';
import { saveAs } from 'file-saver';

import { AddIcon, CircleIcon, LabelIcon, SaveIcon, UpdateIcon } from './Icon';
import { connect } from 'react-redux';
import { FontObject, StoreType, TextViewStoreType } from '../types/propsTypes';
import { updateIsSave, updateMarkTextData, updateTextsData, updateTextTablePage } from '../action';
import axios, { AxiosResponse } from 'axios';
import { PATH } from '../types/actionTypes';

interface TextViewProps extends TextViewStoreType {
  history: any,
  updateTextsData: typeof updateTextsData,
  updateIsSave: typeof updateIsSave,
  updateTextTablePage: typeof updateTextTablePage,
  updateMarkTextData: typeof updateMarkTextData,
}
interface TextViewState {
  editKey: string,
  pageSize: number,
}


class TextView extends Component<TextViewProps, TextViewState>{
  private columns: any
  public constructor(props: TextViewProps) {
    super(props)
    this.state = {
      editKey: '',
      pageSize: 14
    }
    this.columns = [
      {
        title: <div style={{
          width: '100%',
          textAlign: 'center'
        }}>
          文本
        </div>,
        dataIndex: 'text',
        key: 'text',
        width: '82%',
        // ellipsis: true,
        align: 'left',
        render: (text: string, record: { key?: string, text: string, label: any }, index: number) => {
          const { TextArea } = Input
          const { editKey } = this.state
          return editKey !== record['key'] ?
            <div>
              {text}
            </div> :
            <TextArea
              value={text}
              onChange={
                (e) => {
                  const newText = e.target.value
                  const { data: originalData, updateTextsData, updateIsSave } = this.props
                  const data = originalData.map((value: { key?: string; text: string; label: any; }) => {
                    if (value['key'] !== record['key']) return value;
                    return {
                      ...value,
                      text: newText
                    }
                  })
                  updateTextsData(data)
                  updateIsSave(false)
                }
              }
              autoSize
            />
        }
      }, {
        title: '操作',
        dataIndex: 'kind',
        render: (label: string, record: { key: string, text: string, label: any, _id:string }, index: number) => (
          <React.Fragment>
            <Button size='small' type='primary' onClick={
              () => {
                const editKey: string = this.state.editKey === record['key'] ? '' : record['key']
                this.setState({ editKey })
              }
            } style={{
              // float: 'right',
              marginRight: '10px'
            }}>
              {this.state.editKey === record['key'] ? '保存' : '编辑'}
            </Button>
            
            <Button size='small' type='primary' onClick={
              () => {
                const { data, updateTextsData } = this.props
                Modal.confirm({
                  title: '警告',
                  icon: <ExclamationCircleOutlined />,
                  content: '请确认是否要删除改文本',
                  okText: '确认',
                  cancelText: '取消',
                  onOk: () => {
                    // console.log(record)
                    this.deleteText(record['_id'], record['key']);
                    updateTextsData(data.filter((value: any, i: number) => value['key'] !== record['key']))

                    // console.log('object');
                    // updateIsSave(false)
                  }
                });
              }
            } icon={<DeleteOutlined />} >
              删除
            </Button>
          </React.Fragment>

        ),
        width: '18%',
        align: 'center'
      }
    ]
  }

  public render(): JSX.Element {
    const { pageSize } = this.state
    const { data, isSave, current, history, updateTextsData, updateTextTablePage, updateMarkTextData } = this.props
    // data.forEach((value: { key?: string; text: string; label: any; }, index: number,) => {
    //   value['key'] = '' + index
    // })
    // console.log(data);
    return (
      <div style={{
        width: '100%',
        height: '475px',
        padding: '0px 2%',
        backgroundColor: '#fafafa',
        position: 'relative'
      }}>
        <React.Fragment>
          <Table columns={this.columns} dataSource={data} size='small'
            scroll={{ y: 580 }}
            pagination={{
              pageSize,
              current,
              simple: true,
              position: ['topRight'],
              // showSizeChanger: true,
              onChange: (page: number) => {
                updateTextTablePage(page)
                // this.setState({ pageSize: (pageSize as number) })
              }
            }}
          />
          <Button type="primary" size='middle' icon={
            <Icon component={isSave ? SaveIcon : CircleIcon} />
          } style={{
            position: 'absolute',
            top: 10
          }} onClick={
            () => {
              // this.saveFile(path)
              // updateIsSave(true)
            }
          }>
            保存
          </Button>
          <Button type="primary" size='middle' icon={
            <Icon component={isSave ? SaveIcon : CircleIcon} />
          } style={{
            position: 'absolute',
            top: 10,
            left: 110 + 3
          }} onClick={
            () => {
              const textString:string = data.map(
                (value: { key?: string | undefined; text: string; label: { start: number; end: number; label: string; }[]; }) => value['text']
              ).join('\r\n')
              saveAs(new Blob([textString], {type: 'text/plain;charset=utf-8'}), `data.txt`);
            }
          }>
            导出
          </Button>
          <Button size='middle' type='primary' icon={<Icon component={AddIcon} />} onClick={
            () => {
              data.unshift({
                key: '00',
                text: '',
                label: []
              })
              // console.log('data')
              this.setState({ editKey: '0' })
              updateTextsData([...data])
            }
          } style={{
            position: 'absolute',
            top: 10,
            left: 200 
          }}>
            增加文本
          </Button>
          <Button  type='primary' 
              icon={<Icon component={LabelIcon} />}
              onClick={
                () => {
                  // updateIsSave(false)
                  // updateMarkTextData(data.map((value: { key?: string | undefined; text: string; label: { start: number; end: number; label: string; }[]; textArr?: Array<FontObject>}) => ({
                  //   ...value,
                  //   textArr: value['textArr'] || value['text'].split('').map((value: string, index: number) => ({
                  //     text: value,
                  //     start: index,
                  //     end: index,
                  //     label: 'none',
                  //     color: ''
                  //   }))
                  // })))
                  history.push('/index/mark')
                }
              } style={{
                position: 'absolute',
                top: 10,
                left: 315
            }}>
              标注
            </Button>
        </React.Fragment>
      </div>
    )
  }

  public componentDidMount() {

  }

  private deleteText(_id: string, key: string) {
    axios.delete(`${PATH}/delete_text?_id=${_id}&key=${key}`)
      .then((res:AxiosResponse<any>) => {
        console.log(res.data)
      })
  }

}

const mapStateToProps = (state: StoreType, ownProps?: any) => {
  const { TextView } = state
  // console.log(Header)
  return {
    ...ownProps,
    ...TextView,
  }
}

const mapDispatchToProps = {
  updateTextsData,
  updateIsSave,
  updateTextTablePage,
  updateMarkTextData
}

export default connect(mapStateToProps, mapDispatchToProps)(TextView);