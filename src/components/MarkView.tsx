import React, { Component, Key } from 'react';
import { Input, Modal, Table, Tag, Popover, Button } from 'antd';
import 'antd/dist/antd.css';
import Icon, { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
// import $ from 'jquery'
import { ColorResult, SketchPicker } from 'react-color';
import { SettingIcon } from './Icon';
import { connect } from 'react-redux';
import { FontObject, MarkTextsDataType, MarkViewStoreType, StoreType } from '../types/propsTypes';
import { updateMarkTextData, updateTextTablePage, updateTrainData } from '../action';
import { updateTextsData } from '../action';




interface MarkViewProps extends MarkViewStoreType {
	history: any,
	updateTextTablePage: typeof updateTextTablePage,
	updateMarkTextData: typeof updateMarkTextData,
	updateTextsData: typeof updateTextsData,
	updateTrainData: typeof updateTrainData,
}
interface MarkViewState {
	editKey: string,
	labels: Array<{
		color: string,
		name: string,
		key: string
	}>,
	inputVisible: boolean,
	labelSettingConfig: {
		label: string,
		color: string,
		key: string
	},
	popoverVisibleName: string,
	selectedRowKeys: Array<Key>,
	selectedRows: MarkTextsDataType,
}

// const { ipcRenderer } = (window as any).electron;

class MarkView extends Component<MarkViewProps, MarkViewState>{
	private startIndex: number
	private endIndex: number
	private columns: any
	private input: any
	public constructor(props: MarkViewProps) {
		super(props)
		this.startIndex = -1
		this.endIndex = -1
		this.state = {
			editKey: '',
			inputVisible: false,
			popoverVisibleName: '',
			selectedRowKeys: [],
			selectedRows: [],
			labelSettingConfig: {
				label: '',
				color: '',
				key: '',
			},
			labels: [
				{
					color: '#516b91',
					name: '人名',
					key: 'p'
				}, {
					color: '#59c4e6',
					name: '地名',
					key: 'd'
				}, {
					color: '#edafda',
					name: '时间',
					key: 't'
				}, {
					color: '#d1c7b7',
					name: '设备',
					key: 'e'
				}
			],
		}
		this.columns = [
			{
				title: <div style={{
					width: '100%',
					textAlign: 'center'
				}}>
					文本
				</div>,
				dataIndex: 'textArr',
				key: 'text',
				align: 'left',
				render: (text: Array<FontObject>, record: unknown, index: number) => {
					const { data, current, updateMarkTextData, updateTextsData } = this.props
					return (
						<div onMouseUp={
							() => {
								let start = Math.min(this.startIndex, this.endIndex)
								let end = Math.max(this.startIndex, this.endIndex)
								if (text.slice(start, end + 1).map((font: FontObject) => font['text']).join('').includes(getSelection()?.toString() as string) && getSelection()?.toString()) {
									const textBySelect: string = getSelection()?.toString() as string;
									start = start + text.slice(start, end + 1).map((font: FontObject) => font['text']).join('').indexOf(textBySelect);
									end = start + textBySelect.length - 1;
									let startIndex = data[current * 10 - 10 + index]['textArr'][start]['start']
									data[current * 10 - 10 + index]['textArr'].splice(start, end + 1 - start)
									data[current * 10 - 10 + index]['textArr'].splice(start, 0, {
										text: textBySelect,
										start: startIndex,
										end: startIndex + textBySelect.length - 1,
										label: 'uncertain',
										color: 'blue',
										_id: Number(Math.random().toString().substr(3, 10) + Date.now()).toString(36)
									})
									updateMarkTextData([...data])
									updateTextsData([...data])
									// labelRecord[current * 10 - 10 + index].push({
									// 	start: startIndex,
									// 	end: endIndex,
									// 	label: 'none',
                  //   text: textBySelect,
                  //   color: 'blue'
									// })
                  // updateMarkRecord([...labelRecord])
								}
								getSelection()?.removeAllRanges()
								this.startIndex = this.endIndex = -1
							}
						}>
							{
								text.map((value: FontObject, i: number) => {
                  // console.log('r', labelRecord)
                  // const recordIndex = labelRecord[current * 10 - 10 + index].findIndex((r: { start: number; end: number; label: string; text: string; color: string }) => r['text'] === value )
									if (!value['text']) return '';
									if (value['text'].length <= 1 && value['label'] === 'none') {
										return (
											<div key={i} style={{
												display: 'inline-block',
											}} onMouseDown={
												() => {
													this.startIndex = i
												}
											} onMouseOver={
												() => {
													this.endIndex = i
												}
											} onMouseUp={
												() => {
													this.endIndex = i
												}
											}>
												{value['text']}
											</div>
										)
									} else {
										return (
											<Tag key={i} color={value['color']} closable
												icon={<Icon component={SettingIcon} onClick={
													() => {

													}
												} />}
												style={{
													marginLeft: '5px'
												}} onClose={
													() => {
														// const { data, current, updateMarkTextData } = this.props
														const arr: Array<FontObject> = value['text'].split('').map((str: string, index: number) => ({
															text: str,
															start: value['start'] + index,
															end: value['start'] + index,
															label: 'none',
															color: ''
														}))
														data[current * 10 - 10 + index]['textArr'].splice(i, 1)
														// console.log(v, v.split(''));
														data[current * 10 - 10 + index]['textArr'].splice(i, 0, ...arr)
														// delete nameToColor[value]
                            // labelRecord[current * 10 - 10 + index] = labelRecord[current * 10 - 10 + index].filter((value: { start: number; end: number; label: string; text: string; color: string }) => (
                            //   value['text'] !== v
                            // ))
                            // console.log('.....', labelRecord)
                            // labelRecord[current * 10 - 10 + index].splice(j, 1)
                            // updateMarkRecord(labelRecord)
														updateMarkTextData([...data])
														updateTextsData([...data])
														// this.setState({  })
													}
												}>
												{value['text']}
											</Tag>
										)
									}
								})
							}
						</div>
					)

				}
			}
		]
	}

	public render(): JSX.Element {
		// const dataStr = 
		const { labels, inputVisible, labelSettingConfig, popoverVisibleName, selectedRowKeys, selectedRows } = this.state
		const { history, current, data, updateTextTablePage, updateTextsData, updateTrainData, updateMarkTextData } = this.props
		// if ()
		// console.log(data[0]);
		return (
			<div style={{
				width: '100%',
				height: '500px',
				// backgroundColor: 'red'
				// borderBottom: '1px solid black'
			}}>
				
				<div style={{
					width: '100%',
					height: '50px',
					padding: '10px',//rgb(255, 255, 255)
					// backgroundColor: 'red'
					// position: 'absolute'
				}}>
					{
						labels.map((value: { color: string; name: string; key: string; }, index: number) => (
							<Popover title='标签设置' visible={popoverVisibleName === value['name']} key={'label' + index}
								placement='bottomLeft'
								content={
									<div style={{
										width: '100%',
										height: '100px',
										lineHeight: '30px',
										// backgroundColor: 'red',
									}}>
										<div style={{
											height: '30px'
										}}>
											标签名：<Input value={labelSettingConfig.label} size='small' onChange={
												(e) => {
													labelSettingConfig.label = e.target.value
													this.setState({ labelSettingConfig: { ...labelSettingConfig } })
												}
											} style={{
												width: '100px'
											}} />
										</div>
										<div style={{
											height: '30px'
										}}>
											快捷键：
											<div style={{
												display: 'inline-block',
												// backgroundColor: 'blue',
												height: '30px'
											}}>
												Ctrl + &nbsp;
											</div>
											<Input maxLength={1} value={labelSettingConfig.key} size='small' onChange={
												(e) => {
													labelSettingConfig.key = e.target.value
													this.setState({ labelSettingConfig: { ...labelSettingConfig } })
												}
											} style={{
												width: '30px'
											}} />
										</div>
										<div style={{
											height: '30px',
											// po
										}}>
											颜色：
											<Popover title='拾色器' placement='left' trigger='click'
												content={
													<SketchPicker color={labelSettingConfig.color}
														onChange={
															(color: ColorResult) => {
																labelSettingConfig.color = color.hex
																this.setState({ labelSettingConfig })

															}
														}
													/>
												}
											>
												<div style={{
													width: '20px',
													height: '20px',
													transform: 'translate(15px, 5px)',
													display: 'inline-block',
													backgroundColor: labelSettingConfig.color
												}}></div>
											</Popover>
											<Button type='primary' size='small' style={{
												float: 'right',
												transform: 'translate(-5px, 2.5px)',
											}} onClick={
												() => {
													// for(let i = labelRecord.length - 1; i >= 0; i--) {
													// 	for(let j = labelRecord[i].length - 1; j >=0; j--) {
													// 		if(labelRecord[i][j]['label'] === labels[index]['name']) {
													// 			labelRecord[i][j]['label'] = labelSettingConfig.label
													// 			labelRecord[i][j]['color'] = labelSettingConfig.color
													// 		}
													// 	}
													// }
													// labels[index] = {
													// 	name: labelSettingConfig.label,
													// 	key: labelSettingConfig.key,
													// 	color: labelSettingConfig.color
													// }
													// this.setState({ labels, popoverVisibleName: '' })
													// updateMarkRecord(labelRecord)
												}
											}>
												确定
											</Button>
										</div>
									</div>
								}
							>
								<Tag closable color={value['color']} key={'name' + index}
									icon={<Icon component={SettingIcon} onClick={
										() => {
											const labelSettingConfig = {
												label: value['name'],
												color: value['color'],
												key: value['key']
											}
											const name = popoverVisibleName === value['name'] ? '' : value['name']
											this.setState({ labelSettingConfig, popoverVisibleName: name })
										}
									} />}
									style={{
										userSelect: 'none'
									}}
									onClose={
										(e) => {
											e.preventDefault()
											Modal.confirm({
												title: '警告',
												icon: <ExclamationCircleOutlined />,
												content: '请确认是否要删除标签：' + value['name'],
												okText: '确认',
												cancelText: '取消',
												onOk: () => {
													labels.splice(index, 1)
													this.setState({ labels })
												}
											});
										}
									}>
									{value['name'] + ' [' + value['key'] + ']'}
								</Tag>
							</Popover>
						))
					}
					{
						inputVisible && (
							<Input
								ref={
									(input) => {
										this.input = input
									}
								}
								type="text"
								size="small"
								style={{ width: 78 }}
								onBlur={
									(e) => {
										this.setState({ inputVisible: false })
										if (!e.target.value) return;
										labels.push({
											name: e.target.value,
											color: `#${Math.floor(Math.random() * 0xffffff).toString(16).padEnd(6, '0')}`,
											key: 'q'
										})
										this.setState({ labels })
									}
								}
								onPressEnter={
									(e) => {
										this.setState({ inputVisible: false })
										if (!(e.target as any).value) return;
										labels.push({
											name: (e.target as any).value,
											color: `#${Math.floor(Math.random() * 0xffffff).toString(16).padEnd(6, '0')}`,
											key: 'q'
										})
										this.setState({ labels })
									}
								}
							/>
						)
					}
					{
						!inputVisible &&
						<Tag className="site-tag-plus" onClick={
							() => {
								this.setState({ inputVisible: true }, () => {
									(this.input as any).focus();
								})
							}
						}>
							<PlusOutlined /> 添加标签
						</Tag>
					}
				</div>
				
				<Table columns={this.columns} dataSource={data} size='small' 
					scroll={{ y: 450 }}
					pagination={{
						pageSize: 10,
						current,
						simple: true,
						position: ['bottomRight'],
						// showSizeChanger: true,
						onChange: (page: number) => {
							updateTextTablePage(page)
							// this.setState({ pageSize: (pageSize as number) })
						}
					}}
					rowSelection={{
						selectedRowKeys,
						onChange: (selectedRowKeys, selectedRows) => {
							this.setState({ selectedRowKeys, selectedRows })
							// console.log(selectedRowKeys, selectedRows)
						}
						
					}}
				/>
				<Button type='primary' style={{
					// float: 'left'
					transform: 'translate(10px, -40px)'
				}} onClick={
					() => { 
						updateTrainData(selectedRows)
						console.log(selectedRowKeys)
						updateMarkTextData(data.filter((value: { key?: string | undefined; text: string; label: { start: number; end: number; label: string; }[]; textArr: FontObject[]; }) => !selectedRowKeys.includes(value['key'] as string)))
						this.setState({ selectedRowKeys: [], selectedRows: [] })
					}
				}>加入训练集</Button>
				<Button type='primary' style={{
					// float: 'left'
					transform: 'translate(20px, -40px)'
				}} onClick={
					() => { 
						history.push('/texts')
						// updateTextsData([...data])
					}
				}>返回</Button>
			</div>
		)
	}

	public componentDidMount() {
		document.addEventListener('keydown', (e) => {
			if (e.ctrlKey) {
        e.preventDefault();
				const { labels } = this.state
        const { data, updateMarkTextData, updateTextsData } = this.props
				for (let i = 0; i < labels.length; i++) {
					if (labels[i]['key'] === e.key) {
						for (let j = data.length - 1; j >=0; j--) {
              data[j]['textArr'].forEach((value: FontObject) => {
                if (value['color'] === 'blue') {
                  value['label'] = labels[i]['name']
                  value['color'] = labels[i]['color']
                }
              })
						}
						updateMarkTextData([...data])
						updateTextsData([...data])
						// this.setState({ })
						break;
					}
				}
			}
		})
	}

}

const mapStateToProps = (state:StoreType, ownProps?: any) => {
	const { MarkView } = state
	// console.log(Header)
	return {
			...ownProps,
			...MarkView,
	}
}

const mapDispatchToProps = {
  updateTextTablePage,
	updateMarkTextData,
	updateTextsData,
	updateTrainData
}


export default connect(mapStateToProps, mapDispatchToProps)(MarkView);