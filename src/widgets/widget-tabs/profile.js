export default {
  name: '标签容器',
  icon: '',
  description: '描述',
  multContainer: true,
  controllers: [
    {
      propName: 'tabsCount',
      controllerType: 'CTRL_NUMBER_INPUT',
      label: '标签数量'
    },
    {
      propName: 'tabsTextArr',
      relation: 'tabsCount', // 关联的 propName, 会通过 relationValue 传入 controller
      controllerType: 'CTRL_TEXT_MULT_INPUT',
      label: '标签名称'
    },
    {
      propName: 'fontObj',
      controllerType: 'CTRL_FONT',
      label: '标签文字(未选中)'
    },
    {
      propName: 'selectedFontObj',
      controllerType: 'CTRL_FONT',
      label: '标签文字(选中)'
    },
    // 由订阅者选择监听哪个组件的哪个事件, 订阅者需要提供对应触发的函数
    {
      propName: 'event', // 用作记录选中的监听事件
      handleName: 'switchTab', // 声明用作事件调用的函数
      controllerType: 'CTRL_ON_EVENT',
      label: '切换标签监听'
    }
  ]
};
