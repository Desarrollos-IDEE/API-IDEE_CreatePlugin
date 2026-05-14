/**
 * @module IDEE/plugin/{{archetype.plugin.name}}
 */
import '../assets/css/{{archetype.plugin.id}}';
import '../assets/css/fonts';
import {{archetype.plugin.name}}Control from './{{archetype.plugin.id}}control';
import myhelp from '../../templates/myhelp';
import { getValue } from './i18n/language';
import es from './i18n/es';
import en from './i18n/en';

export default class {{archetype.plugin.name}} extends IDEE.Plugin {
  /**
   * @classdesc
   * Fachada del plugin plantilla
   *
   * @constructor
   * @extends {IDEE.Plugin}
   * @param {Object} options Opciones para el plugin
   * @api
   */
  constructor(options = {}) {
    super();

    /**
     * Nombre del plugin
     * @private
     * @type {String}
     */
    this.name_ = '{{archetype.plugin.id}}';

    /**
     * Fachada del mapa
     * @private
     * @type {IDEE.Map}
     */
    this.map_ = null;

    /**
     * Lista de controles
     * @private
     * @type {Array<IDEE.Control>}
     */
    this.controls_ = [];

    /**
     * Nombre de clase de la vista html
     * @public
     * @type {string}
     */
    this.className = 'm-plugin-{{archetype.plugin.id}}';

    /**
     * Posición del Plugin
     * @public
     * Posibles valores: TR | TL | BL | BR
     * @type {String}
     */
    const positions = ['TR', 'TL', 'BL', 'BR'];
    this.position = positions.includes(options.position) ? options.position : 'TR';

    /**
     * Tooltip del plugin
     *
     * @private
     * @type {string}
     */
    this.tooltip_ = options.tooltip || getValue('tooltip');

    /**
     * Indicador de si el plugin se muestra contraido
     * @public
     * @type {boolean}
     */
    this.collapsed = options.collapsed !== false;

    /**
     * Indicador de si el plugin se puede contraer no.
     * @public
     * @type {boolean}
     */
    this.collapsible = options.collapsible !== false;

    /**
     * Indicador de si el plugin puede arrastrarse o no
     * @public
     * @type {boolean}
     */
    this.isDraggable = !IDEE.utils.isUndefined(options.isDraggable) ? options.isDraggable : false;

    /**
     * Prioridad en la colocación del plugin en su área
     *@private
     *@type { Number }
     */
    this.order = options.order >= -1 ? options.order : null;

    /**
     * Parámetros del plugin
     * @public
     * @type {object}
     */
    this.options = options;
  }

  /**
   * Esta función añade el plugin al mapa.
   *
   * @public
   * @function
   * @param {IDEE.Map} map el mapa al que se añade el plugin
   * @api stable
   */
  addTo(map) {
    this.controls_.push(new {{archetype.plugin.name}}Control(this.isDraggable));
    this.map_ = map;
    this.panel_ = new IDEE.ui.Panel('{{archetype.plugin.name}}', {
      collapsible: this.collapsible,
      collapsed: this.collapsed,
      position: IDEE.ui.position[this.position],
      className: this.className,
      collapsedButtonClass: 'icon-{{archetype.plugin.id}}-wrench',
      tooltip: this.tooltip_,
      order: this.order,
    });
    this.panel_.addControls(this.controls_);
    map.addPanels(this.panel_);
  }

  /**
   * Obtiene el nombre del plugin
   *
   * @getter
   * @function
   */
  get name() {
    return this.name_;
  }

  /**
   * Esta función destruye el plugin
   *
   * @public
   * @function
   * @api stable
   */
  destroy() {
    this.map_.removeControls(this.controls_);
  }

  /**
   * Esta función obtiene los parámetros de
   * la API REST del plugin
   *
   * @function
   * @public
   * @api
   */
  getAPIRest() {
    return `${this.name}=${this.position}*${this.collapsed}*${this.collapsible}*${this.tooltip_}*${this.isDraggable}`;
  }

  /**
   * Esta función obtiene los parámetros de
   * la API REST en base64 del plugin
   *
   * @function
   * @public
   * @api
   */
  getAPIRestBase64() {
    return `${this.name}=base64=${IDEE.utils.encodeBase64(this.options)}`;
  }

  /**
   * Obtiene la ayuda del plugin
   *
   * @function
   * @public
   * @api
   */
  getHelp() {
    return {
      title: this.name,
      content: new Promise((success) => {
        const html = IDEE.template.compileSync(myhelp, {
          vars: {
            urlImages: `${IDEE.config.MAPEA_URL}plugins/{{archetype.plugin.id}}/images/`,
            translations: {
              help1: getValue('textHelp.help1'),
              help2: getValue('textHelp.help2'),
              help3: getValue('textHelp.help3'),
            },
          },
        });
        success(html);
      }),
    };
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
      return (lang === 'en') ? en : es;
    }
    return IDEE.language.getTranslation(lang).{{archetype.plugin.id}};
  }
}
