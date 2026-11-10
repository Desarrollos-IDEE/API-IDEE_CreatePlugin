import {{archetype.plugin.name}} from 'facade/{{archetype.plugin.id}}';

IDEE.language.setLang(window.localStorage.getItem('language') || 'es');

const map = IDEE.map({
  container: 'mapjs',
});
window.map = map;

let mp;

const createPlugin = (options) => {
  mp = new {{archetype.plugin.name}}(options);
  window.mp = mp;
  map.addPlugin(mp);
};

const removePlugin = () => {
  if (mp) {
    try {
      map.removePlugins(mp);
    } catch (err) {
      console.error(err);
    }
    mp = null;
  }
};

const botonEliminar = document.getElementById('botonEliminar');
if (botonEliminar) {
  botonEliminar.addEventListener('click', () => { removePlugin(); });
}

const selectPosicion = document.getElementById('selectPosicion');
const selectCollapsed = document.getElementById('selectCollapsed');
const inputOrder = document.getElementById('inputOrder');
const inputTooltip = document.getElementById('inputTooltip');

const updatePlugin = () => {
  let position = 'right';
  if (selectPosicion) {
    position = selectPosicion.options[selectPosicion.selectedIndex].value;
  }

  let collapsed = true;
  if (selectCollapsed) {
    collapsed = selectCollapsed.options[selectCollapsed.selectedIndex].value === 'true';
  }

  let order = 0;
  if (inputOrder) {
    order = Number(inputOrder.value);
  }

  let tooltip = 'Plantilla plugin';
  if (inputTooltip) {
    tooltip = inputTooltip.value;
  }

  removePlugin();
  createPlugin({
    position: position,
    collapsed: collapsed,
    order: order,
    tooltip: tooltip,
  });
};

[
  selectPosicion,
  selectCollapsed,
  inputOrder,
  inputTooltip,
].filter(Boolean).forEach((ctrl) => {
  ctrl.addEventListener('change', updatePlugin);
});

updatePlugin();

map.addPlugin(new IDEE.plugin.Help({}));
