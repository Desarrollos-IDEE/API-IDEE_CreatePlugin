/**
 * @module IDEE/plugin/{{archetype.plugin.name}}
 */
import api from '../../api';
import myhelp from '../../templates/myhelp.html';
import '../assets/css/fonts';
import '../assets/css/{{archetype.plugin.id}}';
import {{archetype.plugin.name}}Control from './{{archetype.plugin.id}}control';
import en from './i18n/en';
import es from './i18n/es';
import { getValue } from './i18n/language';

/**
 * @classdesc
 * Fachada del plugin plantilla. Crea un plugin de ejemplo
 * con SidePanelButton + PluginSidePanel (API-IDEE v2).
 */
export default class {{archetype.plugin.name}} extends IDEE.Plugin {
  /**
   * @constructor
   * @extends {IDEE.Plugin}
   * @param {Object} options plugin options
   * @api stable
   */
  constructor(options = {}) {
    super('{{archetype.plugin.id}}', {
      position: options.position || 'right',
      tooltip: options.tooltip || getValue('tooltip'),
      order: options.order,
    });

    /**
     * Plugin options
     * @private
     * @type {Object}
     */
    this.options = options;

    /**
     * Facade of the map
     * @private
     * @type {IDEE.Map}
     */
    this.map = null;

    /**
     * Array of controls
     * @private
     * @type {Array<IDEE.Control>}
     */
    this.controls = [];

    /**
     * CSS class name for the panel
     * @private
     * @type {string}
     */
    this.className = 'm-plugin-{{archetype.plugin.id}}';

    /**
     * Option to allow the plugin to be initially collapsed
     * @private
     * @type {boolean}
     */
    this.collapsed = true;
    if (IDEE.utils.isBoolean(options.collapsed)) {
      this.collapsed = options.collapsed;
    }

    /**
     * Metadata from api.json
     * @private
     * @type {Object}
     */
    this.metadata = api.metadata;

    this.separatorApiJson = api.url.separator;
  }

  /**
   * This function adds this plugin into the map
   *
   * @public
   * @function
   * @param {IDEE.Map} map the map to add the plugin
   * @api stable
   */
  addTo(map) {
    this.map = map;
    this.control = new {{archetype.plugin.name}}Control({
      tooltip: this.tooltip,
      position: this.position,
      order: this.order,
    });
    this.controls = [this.control];

    this.button = new IDEE.ui.buttons.SidePanelButton(this.name, {
      position: this.position,
      tooltip: this.tooltip,
      svgPath: 'https://api-idee.juntadeandalucia.es/estaticos/Simbologia/svg/icons_cota/icn_tool.svg',
      order: this.order,
    });
    map.addButtons(this.button);

    this.panel = new IDEE.ui.panels.PluginSidePanel(this.name, {
      collapsed: this.collapsed,
      position: this.position,
      minWidth: this.minPanelWidth,
      maxWidth: this.maxPanelWidth,
      className: this.className,
      tooltip: this.tooltip,
      order: this.order,
    });

    this.control.setPanel(this.panel);

    this.control.on(IDEE.evt.ADDED_TO_MAP, () => {
      this.fire(IDEE.evt.ADDED_TO_MAP);
    });

    this.panel.on(IDEE.evt.ADDED_TO_MAP, (html) => {
      IDEE.utils.enableTouchScroll(html);
    });

    this.panel.addControls(this.controls);
    this.button.panel = this.panel;
    this.panel.button = this.button;
    map.addPanels(this.panel);
  }

  /**
   * This function destroys this plugin
   *
   * @public
   * @function
   * @api stable
   */
  destroy() {
    if (this.map) {
      if (this.control) {
        this.control.setPanel(null);
      }
      if (this.button) {
        this.map.removeButton(this.button);
      }
      if (this.panel) {
        this.map.removePanel(this.panel);
      }
      if (this.controls.length > 0) {
        this.map.removeControls(this.controls);
      }
    }
    this.map = null;
    this.control = null;
    this.controls = [];
    this.panel = null;
    this.button = null;
  }

  /**
   * This function return the control of plugin
   *
   * @public
   * @function
   * @api stable
   */
  getControls() {
    return this.controls;
  }

  /**
   * Devuelve el panel del plugin
   *
   * @public
   * @function
   * @returns {IDEE.ui.panels.PluginSidePanel}
   * @api
   */
  getPanel() {
    return this.panel;
  }

  /**
   * Get the API REST Parameters of the plugin
   *
   * @function
   * @public
   * @api
   */
  getAPIRest() {
    return `${this.name}=${this.position}${this.separatorApiJson}${this.collapsed}${this.separatorApiJson}${this.order}${this.separatorApiJson}${this.tooltip}`;
  }

  /**
   * Gets the API REST Parameters in base64 of the plugin
   *
   * @function
   * @public
   * @api
   */
  getAPIRestBase64() {
    return `${this.name}=base64=${IDEE.utils.encodeBase64(this.options)}`;
  }

  /**
   * This function gets metadata plugin
   *
   * @public
   * @function
   * @api stable
   * @return {Object}
   */
  getMetadata() {
    return this.metadata;
  }

  /**
   * This function compare if plugin recieved by param is instance of {{archetype.plugin.name}}
   *
   * @public
   * @function
   * @param {IDEE.Plugin} plugin to compare
   * @returns {boolean}
   * @api stable
   */
  equals(plugin) {
    return plugin instanceof {{archetype.plugin.name}};
  }

  /**
   * Return plugin language
   *
   * @public
   * @function
   * @param {string} lang type language
   * @api stable
   */
  static getJSONTranslations(lang) {
    if (lang === 'en' || lang === 'es') {
      if (lang === 'en') {
        return en;
      }
      return es;
    }
    return IDEE.language.getTranslation(lang).{{archetype.plugin.id}};
  }

  /**
   * Obtiene la ayuda del plugin
   *
   * @function
   * @public
   * @api
   */
  getHelp() {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    const imageHelp01 = require(`assets/images/${this.getMetadata().version}/help-01.png`);
    // eslint-disable-next-line global-require, import/no-dynamic-require
    const imageHelp02 = require(`assets/images/${this.getMetadata().version}/help-02.png`);

    return {
      title: getValue('textHelp.squemaTitle'),
      content: new Promise((resolve) => {
        const html = IDEE.template.compileSync(myhelp, {
          vars: {
            title: getValue('textHelp.title'),
            imageHelp01,
            imageHelp02,
            translations: {
              paragraph1: getValue('textHelp.paragraph1'),
              paragraph2: getValue('textHelp.paragraph2'),
              screenshot1Alt: getValue('textHelp.screenshot1Alt'),
              screenshot1Caption: getValue('textHelp.screenshot1Caption'),
              screenshot2Alt: getValue('textHelp.screenshot2Alt'),
              screenshot2Caption: getValue('textHelp.screenshot2Caption'),
              screenshot2Description: getValue(
                'textHelp.screenshot2Description',
              ),
            },
          },
        });
        resolve(html);
      }),
    };
  }
}
