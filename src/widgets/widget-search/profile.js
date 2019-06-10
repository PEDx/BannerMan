export default {
  name: '搜索框',
  icon: '',
  description: '描述',
  controllers: [
    {
      propName: 'width',
      controllerType: 'CTRL_NUMBER_INPUT',
      label: '宽度'
    },
    {
      propName: 'height',
      controllerType: 'CTRL_NUMBER_INPUT',
      label: '高度'
    },
    {
      propName: 'text',
      controllerType: 'CTRL_TEXT_INPUT',
      label: '文本内容'
    }
  ]
};
