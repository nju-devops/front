import React, { Component } from 'react'
import './Search.less'
import { Input, Select, Row, Col, Icon, Form, Button, Table } from 'antd'
import { fromJS, toJS } from 'immutable'
import { ke_attr } from '../../utils/ChAndEn.js'
import { fetchSearchResult,fetchKEInfo } from '../../services/SearchServices.js'
const { Option, OptGroup } = Select
export const keColumns = [

  {
    title: 'ID',
    dataIndex: 'id',
  },
  {
    title: '英文名',
    dataIndex: 'title',
  
  },
  {
    title: '中文名',
    dataIndex: 'chinese',
  
  },
  {
    title: '属性',
    children: [
      {
        title: '物种',
        dataIndex: 'species',
        width: 190,
      },
      {
        title: '性别',
        dataIndex: 'sex',
        width: 70,
      },
      {
        title: '生命阶段',
        dataIndex: 'lifeCycle',
        width: 160,
      },
      {
        title: '器官',
        dataIndex: 'organ',
        width: 90,
      },
      {
        title: '癌症',
        dataIndex: 'cancer',
        width: 80,
      },
      {
        title: '存活率',
        dataIndex: 'survivalRates',
        width: 80,
      },
      {
        title: '生物水平',
        dataIndex: 'level',
        width:90,
      },

    ]
  },
];
const speciesTypes=['无特异性', '哺乳', '两栖', '鱼', 
'鸟', '昆虫', '尾感器', '甲壳', '单子叶植物', '双甲']
const sexTypes=['无特异性', '雄性', '雌性']
const lifeCycleTypes=['全生命阶段', '胚胎', '胎儿', '幼体','身体发育阶段','成体']
const organTypes=['运动系统', '消化系统','呼吸系统','泌尿系统','生殖系统','内分泌系统',
  '免疫系统','神经系统','循环系统','其他']
const cancerTypes=['致癌', '非致癌']
const survivalRatesTypes = ['降低']
const  levelTypes = ['分子', '细胞','组织','器官','个体','种群']

class Search extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      checkTypes: fromJS(
        [{
          name: '',
          enName: '',
          value: '',
        }],
      ),
      checkTypeOptions: [],
      type: 'events',
      tableData: [],
      loading: false,
    }
  }
  componentDidMount() {
    this.getCheckTypeoptions()
   
  }
  componentDidUpdate(prevProps, prevState){
    if(this.props.location.pathname !== prevProps.location.pathname){
      fetchSearchResult(this.props.location.pathname.split('/')[1], {}).then(res =>
        this.setState({
          tableData: res.content,
          loading: false
        })
      )
    }
  
  }
  getCheckTypeoptions = () => {
    const path = window.location.hash
    if (path.includes('events')) {
      this.setState({
        checkTypeOptions: Object.keys(ke_attr),
        type: 'events',
      })
      fetchSearchResult('events', {}).then(res =>
        this.setState({
          tableData: res.content,
          loading: false
        })
      )
    
    } else{
      this.setState({
        checkTypeOptions: Object.keys(ke_attr),
        type: 'aops',
      })
      fetchSearchResult('aops', {}).then(res =>
        this.setState({
          tableData: res.content,
          loading: false
        })
      )
    } 
  }
  handleClickAddCheckType = () => {
    const { checkTypes } = this.state
    this.setState({
      checkTypes: checkTypes.push(fromJS({
        name: '',
        value: '',
        enName: '',
      }))
    })
  }
  handleChangeCheckTypeName = (index, value) => {
    const { checkTypes } = this.state
    let temp = checkTypes.setIn([index, 'name'], value)
    temp = temp.setIn([index, 'enName'], ke_attr[value])
    this.setState({
      checkTypes: temp
    })
  }
  handleChangeCheckTypeValue = (index, value) => {
    const { checkTypes } = this.state
    this.setState({
      checkTypes: checkTypes.setIn([index, 'value'], value)
    })
  }
  handleClickDeleteCheckType = (index) => {
    const { checkTypes } = this.state
    this.setState({ checkTypes: checkTypes.delete(index) })
  }
  handleReset = () => {
    this.props.form.resetFields();
  }
  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) { return }
      // const { checkTypes } = this.state
      let items = {...values}
      // checkTypes.map(v => {
      //   let key = v.get('enName');
      //   items[key] = v.get('value')
      // })
      // if (checkTypes.size == 1) {
      //   if (checkTypes.getIn([0, 'name']) == '' || checkTypes.getIn([0, 'value']) == '') {
      //     items = {}
      //   }
      // }
      let key1 = 'title'
      let value1 = values.name
      items[key1] = value1
      let key2 = 'chineseName'
      let value2 = values.chineseName
      items[key2] = value2
      this.setState({
        loading: true
      })
      fetchSearchResult(this.state.type, items).then(res =>
        this.setState({
          tableData: res.content,
          loading: false
        }))
    })
  }
  handleClickRow = (record) => {
    let subPath = window.location.hash.split('/')[1]
if(subPath == 'events'){
this.props.history.push(`/event/${record.id}`)
} else {
  this.props.history.push(`/aop/${record.id}`)
}
  }
  // renderCheckTypes = () => {
  //   const { checkTypes } = this.state
  //   return (
  //     <React.Fragment>
  //       <div className="line" >
  //         <div className="nameLabel">属性值：</div>
  //         <div style={{ flexGrow: 1 }}>
  //           {checkTypes.map((checkType, index) => (
  //             <Row gutter={12} className='check-types-row'>
  //               <Col span={5}>
  //                 <Form.Item className='search-item'>
  //                   <Select
  //                     allowClear
  //                     showSearch
  //                     placeholder="属性"
  //                     optionFilterProp="childern"
  //                     value={checkType.get('name')}
  //                     onChange={value => { this.handleChangeCheckTypeName(index, value) }}
  //                     onSearch={v => {
  //                       if (v.trim() == '') {
  //                         this.handleChangeCheckTypeName(index, '')
  //                       }
  //                     }}
  //                     filterOption={(input, option) =>
  //                       option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
  //                     }
  //                   >
  //                     {this.state.checkTypeOptions.map(v => <Option key={v} value={v} title={v}>{v}</Option>)}
  //                   </Select>
  //                 </Form.Item>
  //               </Col>
  //               <Col span={5}>
  //                 <Form.Item className='search-item'>
  //                   <Input placeholder="属性值" value={checkType.get('value')} style={{height: 30}} onChange={(e) => this.handleChangeCheckTypeValue(index, e.target.value)} />
  //                 </Form.Item>
  //               </Col>
  //               {index !== 0 ? (
  //                 <Col span={3}>
  //                   <Icon type="delete" style={{ color: '#BFBFBF', lineHeight: '40px' }} className='check-type-delete' onClick={() => this.handleClickDeleteCheckType(index)} />
  //                 </Col>
  //               ) : null}
  //             </Row>
  //           ))}
  //         </div>
  //       </div>
  //       {checkTypes.size < 5 ? ( // 最多添加5个
  //         <div>
  //           <Row>
  //             <Col span={9} className='check-type-add' onClick={this.handleClickAddCheckType}>
  //               <Icon type="plus" />添加筛选属性值
  //               </Col>
  //           </Row>
  //         </div>
  //       ) : null}
  //     </React.Fragment>
  //   )
  // }
  renderKESearch() {
    const { getFieldDecorator } = this.props.form
    const speciesOptions = []
    for (let i= 0;i<speciesTypes.length;i++){
      speciesOptions.push(<Option key={speciesTypes[i]}>{speciesTypes[i]}</Option>)
    }
    const sexOptions = []
    for (let i= 0;i<sexTypes.length;i++){
      sexOptions.push(<Option key={sexTypes[i]}>{sexTypes[i]}</Option>)
    }
    const lifeCycleOptions = []
    for (let i= 0;i<lifeCycleTypes.length;i++){
      lifeCycleOptions.push(<Option key={lifeCycleTypes[i]}>{lifeCycleTypes[i]}</Option>)
    }
    const organOptions = []
    for (let i= 0;i<organTypes.length;i++){
      organOptions.push(<Option key={organTypes[i]}>{organTypes[i]}</Option>)
    }
    const cancerOptions = []
    for (let i= 0;i<cancerTypes.length;i++){
      cancerOptions.push(<Option key={cancerTypes[i]}>{cancerTypes[i]}</Option>)
    }
    const survivalRatesOptions = []
    for (let i= 0;i<survivalRatesTypes.length;i++){
      survivalRatesOptions.push(<Option key={survivalRatesTypes[i]}>{survivalRatesTypes[i]}</Option>)
    }
    const levelOptions = []
    for (let i= 0;i<levelTypes.length;i++){
      levelOptions.push(<Option key={levelTypes[i]}>{levelTypes[i]}</Option>)
    }

    return <React.Fragment>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item label={'名称'} className='line'>
            {getFieldDecorator('name', {
              rules: [],
            })(
              <Input placeholder="输入英文名称" style={{ width: 230 }} />
            )}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label={'中文名'} className='line'>
            {getFieldDecorator('chineseName', {
              rules: [],
            })(
              <Input placeholder="输入中文名称" style={{ width: 230 }} />
            )}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label={'物种'} className='line'>
            {getFieldDecorator('species', {
              rules: [],
            })(
              <Select  allowClear style={{ width: 230 }} >
              {speciesOptions}
              </Select>
            )}
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item label={'性别'} className='line'>
            {getFieldDecorator('sex', {
              rules: [],
            })(
              <Select allowClear style={{ width: 230 }} >
              {sexOptions}
              </Select>
            )}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label={'生命阶段'} className='line'>
            {getFieldDecorator('lifeCycle', {
              rules: [],
            })(
              <Select allowClear style={{ width: 230 }} >
              {lifeCycleOptions}
              </Select>
            )}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label={'器官'} className='line'>
            {getFieldDecorator('organ', {
              rules: [],
            })(
              <Select allowClear style={{ width: 230 }} >
              {organOptions}
              </Select>
            )}
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item label={'癌症'} className='line'>
            {getFieldDecorator('cancer', {
              rules: [],
            })(
              <Select allowClear style={{ width: 230 }} >
              {cancerOptions}
              </Select>
            )}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label={'存活率'} className='line'>
            {getFieldDecorator('survivalRates', {
              rules: [],
            })(
              <Select allowClear style={{ width: 230 }} >
              {survivalRatesOptions}
              </Select>
            )}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label={'生物水平'} className='line'>
            {getFieldDecorator('level', {
              rules: [],
            })(
              <Select allowClear style={{ width: 230 }} >
              {levelOptions}
              </Select>
            )}
          </Form.Item>
        </Col>
      </Row>
      {/* {this.renderCheckTypes()} */}
    </React.Fragment>
  }
 renderTableData() {
    const { tableData } = this.state
    let dataSource = []
    for (let i = 0; i < tableData.length; i++) {
      dataSource.push({
        key: i,
        ...tableData[i],
      })
    }
    return (
      <Table dataSource={dataSource} 
      loading={this.state.loading} 
      columns={keColumns} 
      bordered
      onRowClick={ record => 
         this.handleClickRow(record)
      } />
    )
  }
  render() {
    let subPath = window.location.hash.split('/')[1]
    return (
      <div className="container">
        <div className="search">
          <Form className='ant-advanced-search-form' >
            <h3 style={{ marginBottom: '18px' }}>{subPath}搜索条件</h3>
            {this.renderKESearch()}
          </Form>
          <div style={{ textAlign: 'right' }}>
            <Button type="primary" onClick={this.handleSearch}>查询</Button>
            <Button style={{ marginLeft: 14, marghtRight: 30 }} onClick={this.handleReset}>
              清除
              </Button></div>
        </div>
        <div className="dataContent">
          <h3 style={{ marginBottom: '18px' }}>{subPath}数据</h3>
          {this.renderTableData()}
        </div>


      </div>
    )
  }
}
export default Form.create()(Search)