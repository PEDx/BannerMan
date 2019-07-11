import CtrlNumberInput from './ctrl-number-input';
import CtrlTextInput from './ctrl-text-input';
import CtrlTextarea from './ctrl-textarea';
import CtrlColorPicker from './ctrl-color-picker';
import CtrlResourceDrop from './ctrl-resource-drop';
import CtrlSelect from './ctrl-select';
import CtrlSwitch from './ctrl-switch';
import CtrlSizeInput from './ctrl-size-input';
import CtrlColorGradients from './ctrl-color-gradients';
import CtrlRichText from './ctrl-rich-text';

export const controllers = {
  'ctrl-number-input': CtrlNumberInput,
  'ctrl-resource-drop': CtrlResourceDrop,
  'ctrl-color-picker': CtrlColorPicker,
  'ctrl-rich-text': CtrlRichText,
  'ctrl-textarea': CtrlTextarea,
  'ctrl-size-input': CtrlSizeInput,
  'ctrl-color-gradients': CtrlColorGradients,
  'ctrl-select': CtrlSelect,
  'ctrl-switch': CtrlSwitch,
  'ctrl-text-input': CtrlTextInput
};

export const controllerTypeMap = {
  CTRL_NUMBER_INPUT: 'ctrl-number-input',
  CTRL_RESOURCE_DROP: 'ctrl-resource-drop',
  CTRL_COLOR_PICKER: 'ctrl-color-picker',
  CTRL_RICH_TEXT: 'ctrl-rich-text',
  CTRL_SELECT: 'ctrl-select',
  CTRL_COLOR_GRADIENTS: 'ctrl-color-gradients',
  CTRL_SIZE_INPUT: 'ctrl-size-input',
  CTRL_TEXTAREA: 'ctrl-textarea',
  CTRL_SWITCH: 'ctrl-switch',
  CTRL_TEXT_INPUT: 'ctrl-text-input'
};
