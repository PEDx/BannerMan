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
      propName: 'image',
      controllerType: 'CTRL_RESOURCE_DROP',
      label: '图片资源'
    },
    {
      propName: 'color',
      controllerType: 'CTRL_COLOR_PICKER',
      label: '颜色'
    }
  ]
};
