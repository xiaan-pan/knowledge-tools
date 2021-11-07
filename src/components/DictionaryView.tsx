import {
  PlusOutlined,
  ExclamationCircleOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { Table, Input, Tag, Button, Modal, message as Message, message } from "antd";
import React, { Component } from "react";
import Icon from "@ant-design/icons";
import { AddIcon, SaveIcon } from "./Icon";
import { connect } from "react-redux";
import XLSX from 'xlsx'
import { modifyLabelOfDictionaryData, updateDictionaryData } from "../action";
import {
  DictionaryViewStoreType,
  StoreType,
  TableDataType,
} from "../types/propsTypes";
import axios, { AxiosResponse } from "axios";
import { PATH } from "../types/actionTypes";

axios.defaults.withCredentials = true;

interface DictionaryViewProps extends DictionaryViewStoreType {
  updateDictionaryData: typeof updateDictionaryData;
  modifyLabelOfDictionaryData: typeof modifyLabelOfDictionaryData;
  match: any;
  history: any,
}
interface DictionaryViewState {
  pageSize: number;
  tableData: TableDataType;
  inputNameByShow: string;
  inputVisibleName: string;
  path: string;
}

// console.log((View as any));

class DictionaryView extends Component<
  DictionaryViewProps,
  DictionaryViewState
> {
  private nameInput: any;
  private input: any;
  public constructor(props: DictionaryViewProps) {
    super(props);
    this.state = {
      pageSize: 14,
      tableData: [],
      inputNameByShow: "",
      inputVisibleName: "",
      path: "",
    };
  }

  public render(): JSX.Element {
    const { Column } = Table;
    const { pageSize, inputNameByShow, inputVisibleName } = this.state;
    const { tableData, updateDictionaryData, modifyLabelOfDictionaryData } = this.props;
    let label: string = "";
    if (tableData.length) {
      label = tableData[0]["label"];
    }
    // console.log('object');
    return (
      <div
        style={{
          width: "100%",
          // height: '475px',
          padding: "0px 2%",
          position: "relative",
          // backgroundColor: '#fafafa',
          // backgroundColor: 'red'
        }}
      >
        <Table
          dataSource={tableData}
          size="small"
          scroll={{ y: 580 }}
          pagination={{
            pageSize,
            position: ["topRight"],
            showSizeChanger: true,
            onChange: (page: number, pageSize?: number) => {
              this.setState({ pageSize: pageSize as number });
              // console.log('page:', page, 'pageSize:', pageSize)
            },
          }}
        >
          <Column
            title="名称"
            dataIndex="name"
            key="name"
            width="15%"
            render={(name: string, r: {
              name: string,
              label: string,
              key?: string,
              abbreviations: Array<string>
            }, i: number) => {
              return inputNameByShow !== name ? (
                <div
                  onMouseEnter={() => {
                    this.setState({ inputNameByShow: name }, () => {
                      this.nameInput.focus();
                    });
                  }}
                >
                  {name}
                </div>
              ) : (
                <Input
                  ref={(input) => {
                    this.nameInput = input;
                  }}
                  type="text"
                  size="small"
                  placeholder={name}
                  style={{ width: 70 }}
                  onBlur={
                    // 失去焦点保存
                    (e) => {
                      this.setState({ inputNameByShow: "" });
                      if (!e.target.value) return;
                      tableData[i]["name"] = e.target.value;
                      updateDictionaryData(tableData);
                      modifyLabelOfDictionaryData(label, tableData);
                      this.updateDictionary({...r, name: e.target.value});
                      // this.setState({ tableData })
                    }
                  }
                  onPressEnter={
                    // 键盘确定保存
                    (e) => {
                      this.setState({ inputNameByShow: "" });
                      if (!(e.target as any).value) return;
                      tableData[i]["name"] = (e.target as any).value;
                      updateDictionaryData(tableData);
                      modifyLabelOfDictionaryData(label, tableData);
                      this.updateDictionary({...r, name: (e.target as any).value});
                      // this.setState({ tableData })
                    }
                  }
                />
              );
            }}
          />
          <Column
            width="75%"
            title="别名"
            dataIndex="abbreviations"
            key="abbreviations"
            render={(
              abbreviations,
              record: {
                name: string;
                label: string;
                key: string;
                abbreviations: Array<string>;
              },
              i: number
            ) => (
              <>
                {abbreviations.map((abbreviation: string) => (
                  <Tag
                    closable
                    color="blue"
                    key={abbreviation}
                    onClose={(e) => {
                      e.preventDefault();
                      const newNames: Array<string> = abbreviations.filter(
                        (name: string) => name !== abbreviation
                      );
                      tableData[i]["abbreviations"] = [...newNames];
                      updateDictionaryData([...tableData]);
                      modifyLabelOfDictionaryData(label, [...tableData]);
                      this.updateDictionary({...record, abbreviations: [...newNames]})
                      // this.setState({ tableData })
                    }}
                  >
                    {abbreviation}
                  </Tag>
                ))}
                {"label" + i === inputVisibleName && (
                  <Input
                    ref={(input) => {
                      this.input = input;
                    }}
                    type="text"
                    size="small"
                    style={{ width: 78 }}
                    onBlur={(e) => {
                      // console.log(record, i);
                      this.setState({ inputVisibleName: "" });
                      if (!e.target.value) return;
                      tableData[i]["abbreviations"].push(
                        e.target.value
                      );
                      updateDictionaryData(tableData);
                      modifyLabelOfDictionaryData(label, [...tableData]);
                      this.updateDictionary({...record})
                      // this.setState({ tableData })
                    }}
                    onPressEnter={(e) => {
                      this.setState({ inputVisibleName: "" });
                      if (!(e.target as any).value) return;
                      tableData[i]["abbreviations"].push(
                        (e.target as any).value
                      );
                      updateDictionaryData(tableData);
                      modifyLabelOfDictionaryData(label, [...tableData]);
                      this.updateDictionary({...record})

                      // this.setState({ tableData })
                    }}
                  />
                )}
                {"label" + i !== inputVisibleName && (
                  <Tag
                    className="site-tag-plus"
                    onClick={() => {
                      this.setState({ inputVisibleName: "label" + i }, () => {
                        (this.input as any).focus();
                      });
                    }}
                  >
                    <PlusOutlined /> 添加别名
                  </Tag>
                )}
              </>
            )}
          />
          <Column
            title="操作"
            dataIndex="name"
            key="action"
            render={(name: any, r: any, i: number) => {
              return (
                <Button
                  size="small"
                  type="primary"
                  onClick={() => {
                    Modal.confirm({
                      title: "警告",
                      icon: <ExclamationCircleOutlined />,
                      content: "请确认是否要删除 " + name + " 的别名字典",
                      okText: "确认",
                      cancelText: "取消",
                      onOk: () => {
                        tableData.splice(i, 1);
                        updateDictionaryData([...tableData]);
                        modifyLabelOfDictionaryData(label, [...tableData]);
                        this.deleteDictionary(r['_id'], r['key']);
                        // this.setState({ tableData: [...tableData] })
                      },
                    });
                  }}
                  icon={<DeleteOutlined />}
                >
                  删除
                </Button>
              );
            }}
          />
        </Table>
        <Button
          type="primary"
          size="middle"
          icon={<Icon component={SaveIcon} />}
          style={{
            position: "absolute",
            top: 10,
          }}
          onClick={() => {
            /* original data */
            var filename = "dict.xls";
            // const data:Array<Array<string>> = [['标签', '全称', '别名']]
            const data:Array<Array<string>> = tableData.map((value: { name: string; label: string; key?: string | undefined; abbreviations: string[]; }) => [
              value['label'], value['name'], ...value['abbreviations']
            ])
            data.unshift(['标签', '全称', '别名'])
            // const data = 
            var sheetName = "Sheet1";
            var wb = XLSX.utils.book_new(),
              ws = XLSX.utils.aoa_to_sheet(data);
            /* add worksheet to workbook */
            XLSX.utils.book_append_sheet(wb, ws, sheetName);
            /* write workbook */
            XLSX.writeFile(wb, filename);
          }}
        >
          导出
        </Button>
        <Button
          size="middle"
          type="primary"
          icon={<Icon component={AddIcon} />}
          onClick={() => {
            tableData.unshift({
              key: "00",
              name: "",
              label: tableData.length ? tableData[0]["label"] : "",
              abbreviations: [],
            });
            // // console.log('data')
            // this.setState({ inputNameByShow: '0' })
            updateDictionaryData([...tableData]);
            modifyLabelOfDictionaryData(label, [...tableData]);
          }}
          style={{
            position: "absolute",
            top: 10,
            left: 120,
          }}
        >
          增加字典
        </Button>
      </div>
    );
  }

  public componentDidMount() {
    //
  }

  private updateDictionary (dictionary:{
    name: string,
    label: string,
    key?: string,
    abbreviations: Array<string>
  }) {
    axios.put(`${PATH}/update_dictionary`, dictionary)
    .then((res:AxiosResponse<any, any>) => {
      // console.log(res.data)
      const { data: response } = res;
      if (response['status'] === 200 && response['message'] === '更新成功') {
        message.success('更新成功', 1);
      } else if (response['status'] === 403 && response['message'] === '未登录') {
        message.error('请您先登录', 1.5, () => {
          this.props.history.push('/')
        })
      }
    })
  }

  private deleteDictionary (_id: string, key: string) {
    axios.delete(`${PATH}/delete_dictionary?_id=${_id}&key=${key}`)
      .then((res:AxiosResponse<any>) => {
        console.log(res.data)
        message.success('删除成功', 1);
      })
  }
}

const mapStateToProps = (state: StoreType, ownProps?: any) => {
  const { DictionaryView } = state;
  // console.log(Header)
  return {
    ...ownProps,
    ...DictionaryView,
  };
};

const mapDispatchToProps = {
  updateDictionaryData,
  modifyLabelOfDictionaryData,
};

export default connect(mapStateToProps, mapDispatchToProps)(DictionaryView);
