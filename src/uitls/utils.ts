// 从arr数组中获取一个默认值
export const choose = (arr) => {
  const index = between(0, arr.length);
  return arr[index];
}
// 获取默认值
export const between = (min,max) => {
   return min + Math.floor(Math.random() * (max-min));
}
// setState Promise化
export function $ (context) {
  return {
    setState (state) {
      return new Promise(resolve => {
        context.setState(state, () => {
          resolve(state);
        })
      })
    }
  }
}
export const sleep = seconds => {
  return new Promise(resolve => {
    setTimeout(resolve,seconds * 1000)
  })
}
export const badChars = '胸鬼懒禽鸟鸡我邪罪凶丑杀仇鼠蟋蟀淫秽妹狐鸡鸭蝇悔鱼肉苦犬吠窥血丧饥女搔父母昏狗蟊疾病痛死潦哀痒害蛇牲妇狸鹅穴畜烂兽靡爪氓劫鬣螽毛婚姻匪婆羞辱';
