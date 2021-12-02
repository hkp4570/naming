import { Component } from 'react'
import {navigateTo} from '@tarojs/taro'
import { View } from '@tarojs/components'
import {AtButton, AtRadio, AtInput, AtDivider} from 'taro-ui'

import "taro-ui/dist/style/components/button.scss" // 按需引入
import './index.scss'

const books = [
  { label: '诗经', value: 'shijing',},
  { label: '楚辞', value: 'chuci',},
  { label: '唐诗', value: 'tangshi',},
  { label: '宋词', value: 'songci',},
  { label: '乐府诗集', value: 'yuefu',},
  { label: '古诗三百首', value: 'gushi',},
  { label: '著名辞赋', value: 'cifu',},
];
interface IState {
  value:string,
  surnameInpVal:string
}
export default class Index extends Component<any,IState> {
  constructor(props) {
    super(props);
    this.state={
      value: 'shijing',
      surnameInpVal: '李',
    }
  }

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  handleChange (value) {
    this.setState({
      value
    })
  }
  handleChangeSurname(value){
    this.setState({
      surnameInpVal:value
    });
  }
  handleCreateName(){
    navigateTo({
      url: '/pages/name/index'
    })
  }

  render () {
    const {value, surnameInpVal} = this.state;
    return (
      <View className='index'>
        <AtRadio
          options={books}
          value={value}
          onClick={this.handleChange.bind(this)}
        />
        <AtDivider />
        <AtInput
          name='value'
          title='姓氏'
          type='text'
          placeholder='请输入姓氏'
          value={surnameInpVal}
          onChange={this.handleChangeSurname.bind(this)}
        />
        <AtDivider/>
        <AtButton type='primary' size={'normal'} onClick={() => this.handleCreateName()}>起名</AtButton>
      </View>
    )
  }
}
