/**
 * @module IDEE/control/{{archetype.plugin.name}}Control
 */

import {{archetype.plugin.name}}ImplControl from 'impl/{{archetype.plugin.id}}control';
import template from 'templates/{{archetype.plugin.id}}';
import { getValue } from './i18n/language';

/**
 * @classdesc
 * Control de ejemplo del plugin {{archetype.plugin.name}}.
 */
export default class {{archetype.plugin.name}}Control extends IDEE.Control {
  /**
   * @constructor
   * @extends {IDEE.Control}
   * @param {Object} options control options
   * @api stable
   */
  constructor(options = {}) {
    // 1. Comprueba si la implementación puede crear el control
    if (IDEE.utils.isUndefined({{archetype.plugin.name}}ImplControl)
      || (IDEE.utils.isObject({{archetype.plugin.name}}ImplControl)
      && IDEE.utils.isNullOrEmpty(Object.keys({{archetype.plugin.name}}ImplControl)))) {
      IDEE.exception(getValue('exception.impl'));
    }
    // 2. Crea la implementación del control
    const impl = new {{archetype.plugin.name}}ImplControl();
    super({{archetype.plugin.name}}Control.NAME, impl, options);
  }

  /**
   * Esta función crea la vista
   *
   * @public
   * @function
   * @param {IDEE.Map} map Mapa al que se añade el control
   * @api stable
   */
  createView(map) {
    this.map_ = map;
    return IDEE.template.compileSync(template, {
      vars: {
        translations: {
          text: getValue('text'),
        },
      },
    });
  }

  /**
   * Esta función compara controles
   *
   * @public
   * @function
   * @param {IDEE.Control} control control para comparar
   * @api stable
   */
  equals(control) {
    return control instanceof {{archetype.plugin.name}}Control;
  }
}

/**
 * Name of this control
 * @const
 * @type {string}
 * @public
 * @api stable
 */
{{archetype.plugin.name}}Control.NAME = '{{archetype.plugin.name}}';
