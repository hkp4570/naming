import { Component } from 'react';
import {getCurrentInstance } from '@tarojs/taro';
import { View } from '@tarojs/components';
import {AtToast} from 'taro-ui';
import bookCollect from '../../json/index';

export default class nameIndex extends Component{
  state={
    loading: true,
  }
  $instance = getCurrentInstance();
  componentDidMount() {
    const { surname='李', book='shijing' } = this.$instance.router.params;
    console.log(this.$instance);
    console.log(bookCollect);
  }

  render() {
    return <View>
      <AtToast isOpened text="加载中" icon="{icon}"/>
    </View>;
  }
}
