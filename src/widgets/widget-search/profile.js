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
      propName: 'size',
      controllerType: 'CTRL_SIZE_INPUT',
      label: '尺寸'
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
    },
    {
      propName: 'colorG',
      controllerType: 'CTRL_COLOR_GRADIENTS',
      label: '颜色渐变'
    },
    {
      propName: 'richText',
      controllerType: 'CTRL_RICH_TEXT',
      label: '富文本'
    },
    {
      propName: 'switch',
      controllerType: 'CTRL_SWITCH',
      label: '开关'
    },
    {
      propName: 'select',
      controllerType: 'CTRL_SELECT',
      label: '选择',
      setting: {
        options: [
          {
            value: '0',
            label: '黄金糕'
          },
          {
            value: '1',
            label: '双皮奶'
          },
          {
            value: '2',
            label: '蚵仔煎'
          },
          {
            value: '3',
            label: '龙须面'
          },
          {
            value: '4',
            label: '北京烤鸭'
          }
        ]
      }
    },
    {
      propName: 'text',
      controllerType: 'CTRL_TEXT_INPUT',
      label: '文本输入'
    },
    {
      propName: 'textarea',
      controllerType: 'CTRL_TEXTAREA',
      label: '文本输入'
    }
  ]
};
