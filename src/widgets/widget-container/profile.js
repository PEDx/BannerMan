export default {
  name: '容器',
  icon: '',
  description: '描述',
  controllers: [
    {
      propName: 'bgColor',
      controllerType: 'CTRL_COLOR_PICKER',
      label: '容器背景颜色'
    },
    {
      propName: 'bgImg',
      controllerType: 'CTRL_RESOURCE_DROP',
      label: '容器背景图片'
    },
    {
      propName: 'heightModel',
      controllerType: 'CTRL_SELECT',
      label: '高度模式',
      setting: {
        options: [
          {
            value: 'auto',
            label: '根据内容高度'
          },
          {
            value: 'px',
            label: '自定义数值高度'
          }
        ]
      }
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
      propName: 'positionModel',
      controllerType: 'CTRL_SELECT',
      label: '定位模式',
      setting: {
        options: [
          {
            value: 'static',
            label: '正常定位'
          },
          {
            value: 'absolute',
            label: '绝对定位'
          },
          {
            value: 'fixed',
            label: '固定定位'
          }
        ]
      }
    },
    {
      propName: 'position',
      controllerType: 'CTRL_SIZE_INPUT',
      label: '定位',
      setting: {
        label: ['上', '左']
      }
    },
    {
      propName: 'zIndex',
      controllerType: 'CTRL_NUMBER_INPUT',
      label: '层级'
    }
  ]
};
