/* eslint-disable no-unused-vars */

import * as template from './productAutocomplete.html';
// custom loaders to parse scss -> css -> string
const style = require('!to-string-loader!css-loader!sass-loader!./productAutocomplete.scss');

export class ProductAutocomplete extends HTMLElement {
  // Fires when an instance of the element is created.
  createdCallback() {
    const element = this.attachShadow({mode: 'closed'});
    element.innerHTML = template.default;
    element.innerHTML += `<style>${style}</style>`;
  }

  // Fires when an instance was inserted into the document.
  attachedCallback() { /**/
  }

  // Fires when an attribute was added, removed, or updated.
  attributeChangedCallback(attrName, oldVal, newVal) {

    /**/
  }
}

