const widget = require.context('./widget-icon', false, /\.svg$/);
const menu = require.context('./nav-menu-icon', false, /\.svg$/);
const requireAll = requireContext => requireContext.keys().map(requireContext);
requireAll(widget);
requireAll(menu);
