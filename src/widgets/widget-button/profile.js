export default {
  name: '按钮',
  icon: '',
  description: '描述',
  controllers: [
    {
      propName: 'btnText',
      controllerType: 'CTRL_TEXT_INPUT',
      label: '按钮文本'
    },
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
      propName: 'borderRadius',
      controllerType: 'CTRL_SLIDER_INPUT',
      label: '圆角',
      setting: {
        range: {
          min: 0,
          max: 20
        }
      }
    },
    {
      propName: 'borderObj',
      controllerType: 'CTRL_BORDER',
      label: '边框'
    },
    {
      propName: 'btnBgColor',
      controllerType: 'CTRL_COLOR_PICKER',
      label: '按钮背景颜色'
    },
    {
      propName: 'btnTextColor',
      controllerType: 'CTRL_COLOR_PICKER',
      label: '按钮文本颜色'
    },
    {
      propName: 'btnBgImg',
      controllerType: 'CTRL_RESOURCE_DROP',
      label: '按钮背景图片'
    }
  ]
};
