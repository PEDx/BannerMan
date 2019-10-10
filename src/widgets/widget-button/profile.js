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
      propName: 'size',
      controllerType: 'CTRL_SIZE_INPUT',
      label: '尺寸',
      setting: {
        label: ['宽', '高']
      }
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
      label: '背景颜色'
    },
    {
      propName: 'btnTextColor',
      controllerType: 'CTRL_COLOR_PICKER',
      label: '文本颜色'
    },
    {
      propName: 'btnBgImg',
      controllerType: 'CTRL_RESOURCE_DROP',
      label: '背景图片'
    },
    {
      controllerType: 'CTRL_DESCRIPTION',
      label: '其他信息',
      setting: {
        description: '此组件可发射点击事件'
      }
    }
  ]
};
