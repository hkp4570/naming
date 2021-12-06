import { Component } from 'react';
import {getCurrentInstance } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import {AtToast, AtCard, AtDivider } from 'taro-ui';
import bookCollect from '../../json/index';
import { choose, badChars, between } from '../../uitls/utils';

export default class nameIndex extends Component{
  state={
    loading: true,
    nameArrData:[],
  }
  $instance = getCurrentInstance();
  componentDidMount() {
    const names = [];
    for (let i = 0; i < 6; i++){
      const name = this.createName();
      names.push(name);
    }
    console.log(names,'names')
    this.setState({
      nameArrData:names,
    });
  }
  createName(){
    const { surname='李', book='shijing' } = this.$instance.router.params;
    const currentBook = bookCollect[book];
    try{
      if(!currentBook) return;
      const randomContent = choose(currentBook); // 书籍中随机取一条诗句
      const { author, dynasty, content, book, title } = randomContent;
      if(!content) return ;
      const contentArr = this.splitContent(content);
      if(!(Array.isArray(contentArr) && contentArr.length > 0)) return ;
      const contentSingle = choose(contentArr);
      const cleanContent = this.cleanBadChar(this.cleanPunctuation(contentSingle));
      if(cleanContent.length <= 2) return null;
      const name = surname + this.getTwoChar(cleanContent.split(''));
      return {
        name,
        author,
        dynasty,
        content,
        book,
        title
      }
    }catch (error){
      throw new Error(error);
    }
  }
  getTwoChar(arr){
    const len = arr.length;
    const first = between(0, len);
    let second = between(0, len);
    let cnt = 0;
    while (second === first) {
      second = between(0, len);
      cnt++;
      if (cnt > 100) {
        break;
      }
    }
    return first <= second ? `${arr[first]}${arr[second]}` : `${arr[second]}${arr[first]}`;
  }
  // 清除标点符号
  cleanPunctuation(str){
    const puncReg = /[<>《》！*\(\^\)\$%~!@#…&%￥—\+=、。，？；‘’“”：·`]/g;
    return str.replace(puncReg, '');
  }
  // 清除坏字符
  cleanBadChar(str){
    return str.split('').filter(char => badChars.indexOf(char) === -1).join('');
  }
  // str -> arr
  splitContent(content){
    if(!content) return [];
    let formatData = this.formatStr(content);
    formatData = formatData.replace(/！|。|？|；/g, s => `${s}|`); // 把标点符号统一替换成 |
    formatData = formatData.replace(/\|$/g, ''); // 把以 | 结尾的替换为空
    let arr = formatData.split('|');
    arr = arr.filter(item => item.length >= 2);
    return arr;
  }
  // 清除标签
  formatStr(content):string{
    let str = content.replace(/(\s|  |“|”){1，}|<br>|<p>|<\/p>/g,'');
    str = str.replace(/\(.+\)/g,'');
    return str;
  }
  render() {
    const { nameArrData } = this.state;
    console.log(nameArrData,'nameArrData')
    return <View>
      <AtToast isOpened text="加载中" status={'loading'} />
      {
        nameArrData.map((item,index) => (
          <View>
            <AtCard
              key={index}
              note={`[${item.dynasty}] ${item.author}`}
              extra={`${item.book}●${item.title}`}
              title={item.name}
            >
              <View dangerouslySetInnerHTML={{__html: item.content}} />
            </AtCard>
            <AtDivider/>
          </View>
        ))
      }
    </View>;
  }
}
