/* eslint-disable no-unused-vars,consistent-this */

import * as template from './productAutocomplete.html';
// custom loaders to parse scss -> css -> string
const style = require('!to-string-loader!css-loader!sass-loader!./productAutocomplete.scss');

export class ProductAutocomplete extends HTMLElement {
  // Fires when an instance of the element is created.
  createdCallback() {
    this.element = this.attachShadow({mode: 'closed'});
    this.element.innerHTML = template.default;
    this.element.innerHTML += `<style>${style}</style>`;
  }

  // Fires when an instance was inserted into the document.
  attachedCallback() { /**/
    this.element.getElementById('productSearch').onsubmit = this.onSubmit;
    this.element.query('.search_query').onchange = this.onChange;
  }

  onChange(e) {
    console.log(e);
  }
  // Fires when an attribute was added, removed, or updated.
  attributeChangedCallback(attrName, oldVal, newVal) {
    console.log('value change', attrName, 'old:', oldVal, 'new ', newVal);
  }

  onSubmit(e) {
    e.preventDefault();
    console.log('form was submitted');
  }
}

