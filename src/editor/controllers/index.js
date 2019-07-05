import CtrlNumberInput from './ctrl-number-input';
import CtrlTextInput from './ctrl-text-input';
import CtrlColorPicker from './ctrl-color-picker';
import CtrlResourceDrop from './ctrl-resource-drop';
export const controllerTypeMap = {
  CTRL_NUMBER_INPUT: 'ctrl-number-input',
  CTRL_RESOURCE_DROP: 'ctrl-resource-drop',
  CTRL_COLOR_PICKER: 'ctrl-color-picker',
  CTRL_TEXT_INPUT: 'ctrl-text-input'
};
export const controllers = {
  'ctrl-number-input': CtrlNumberInput,
  'ctrl-resource-drop': CtrlResourceDrop,
  'ctrl-color-picker': CtrlColorPicker,
  'ctrl-text-input': CtrlTextInput
};
