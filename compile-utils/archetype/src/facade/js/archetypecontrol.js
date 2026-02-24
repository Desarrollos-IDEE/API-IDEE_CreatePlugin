/**
 * @module IDEE/control/{{archetype.plugin.name}}Control
 */

import {{archetype.plugin.name}}ImplControl from 'impl/{{archetype.plugin.id}}control';
import template from 'templates/{{archetype.plugin.id}}';
import { getValue } from './i18n/language';

export default class {{archetype.plugin.name}}Control extends IDEE.Control {
  /**
   * @classdesc
   * Constructor de la clase. Crea un control {{archetype.plugin.name}}Control
   *
   * @constructor
   * @extends {IDEE.Control}
   * @api stable
   */
  constructor(isDraggable) {
    // 1. Comprueba si la implementación puede crear el control
    if (IDEE.utils.isUndefined({{archetype.plugin.name}}ImplControl)) {
      IDEE.exception(getValue('exceptions.impl'));
    }
    // 2. Crea la implementación del control
    const impl = new {{archetype.plugin.name}}ImplControl();
    super(impl, '{{archetype.plugin.name}}');

    /**
     * Indicador de si el plugin puede arrastrarse o no
     * @public
     * @type {boolean}
     */
    this.isDraggable_ = isDraggable || false;
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
    return new Promise((success, fail) => {
      const html = IDEE.template.compileSync(template, {
        vars: {
          translations: {
            title: getValue('title'),
            text: getValue('text'),
          },
        },
      });

      if (this.isDraggable_) {
        IDEE.utils.draggabillyPlugin(this.getPanel(), '#m-{{archetype.plugin.id}}-title');
      }
      success(html);
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
