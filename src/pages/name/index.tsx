import { Component } from 'react';
import { getCurrentInstance } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import {AtToast, AtCard, AtDivider, AtButton} from 'taro-ui';
import bookCollect from '../../json/index';
import { choose, badChars, between, sleep } from '../../uitls/utils';
import {Simulate} from "react-dom/test-utils";

export default class nameIndex extends Component{
  state={
    loading: true,
    nameArrData:[],
    moreLoading: false,
  }
  $instance = getCurrentInstance();
  loadData(){
    const names = [];
    for (let i = 0; i < 6; i++){
      const name = this.createName();
      names.push(name);
    }
    // name: "李揖兮"
    // author: "佚名"
    // dynasty: "春秋"
    // content: "<p>子之还兮，遭我乎狃之间兮。并驱从两肩兮，揖我谓我儇兮。</p>"
    // book: "诗经"
    // title: "还"
    console.log(names,'names');

    sleep(1).then(() => {
      this.setState({
        nameArrData:[...this.state.nameArrData,...names],
        loading: false,
        moreLoading: false,
      });
    })
  }
  componentDidMount() {
    this.loadData();
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
        content: this.highLightName(name,content),
        book,
        title
      }
    }catch (error){
      throw new Error(error);
    }
  }
  highLightName(name,content){
    if(!name) return content;
    const reg = new RegExp(`[${name}]`,'ig');
    return content.replace(reg, char => `<strong style="font-weight: bold">${char}</strong>`)
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
  // 加载更多
  loadMore(){
    this.setState({moreLoading:true});
    this.loadData();
  }
  render() {
    const { nameArrData, loading, moreLoading } = this.state;
    return <View>
      {
        loading ? (
          <AtToast isOpened text="加载中" status={'loading'} />
        ) : (
          <View>
            {
              nameArrData.length ? nameArrData.map((item,index) => (
                <View key={index}>
                  {
                    item ? (
                      <View>
                        <AtCard
                          note={`[${item.dynasty}] ${item.author}`}
                          // extra={`${item.book}●${item.title}`}
                          title={item.name}
                        >
                          <View dangerouslySetInnerHTML={{__html: item.content}} />
                          <View style={{marginTop:10}}>{`—— ${item.book}●${item.title}`}</View>
                        </AtCard>
                        <AtDivider/>
                      </View>
                    ) : null
                  }
                </View>
              )) : null
            }
            <AtButton type='primary' loading={moreLoading} size={'normal'} customStyle={{width:'40%', marginBottom:40}} onClick={() => this.loadMore()}>加载更多</AtButton>
          </View>
        )
      }
    </View>;
  }
}
