import CtrlNumberInput from './ctrl-number-input';
import CtrlTextInput from './ctrl-text-input';
export const controllerTypeMap = {
  CTRL_NUMBER_INPUT: 'ctrl-number-input',
  CTRL_TEXT_INPUT: 'ctrl-text-input'
};
export const controllers = {
  'ctrl-number-input': CtrlNumberInput,
  'ctrl-text-input': CtrlTextInput
};
