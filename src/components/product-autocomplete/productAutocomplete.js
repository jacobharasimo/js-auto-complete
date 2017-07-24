/* eslint-disable no-unused-vars,consistent-this,no-debugger */

import * as template from './productAutocomplete.html';
// custom loaders to parse scss -> css -> string
const style = require('!to-string-loader!css-loader!sass-loader!./productAutocomplete.scss');
import {Http} from '../../http';

export class ProductAutocomplete extends HTMLElement {
  createResultList(items) {
    const list = document.createElement('ul');
    list.classList.add('results-list');
    items.forEach((item) => {
      const listItem = document.createElement('li');
      listItem.classList.add('results-item');
      const link = document.createElement('a');
      link.classList.add('results-item__link');
      link.onclick = this.onSelect;
      link.appendChild(document.createTextNode(item.name));
      listItem.appendChild(link);
      list.appendChild(listItem);
    });
    return list;
  }

  // Fires when an instance of the element is created.
  createdCallback() {
    this.timer = null;
    this.resultsList = null;
    this.sr = this.attachShadow({mode: 'closed'});
    this.sr.innerHTML = template.default;
    this.sr.innerHTML += `<style>${style}</style>`;
  }

  // Fires when an instance was inserted into the document.
  attachedCallback() { /**/
    this.element = this.sr.querySelector('.search-widget');
    this.searchQuery = this.sr.querySelector('.search_query');
    this.resultsList = this.sr.querySelector('.autocomplete-results');
    // much like react we have to manually bind our scope in as needed
    this.searchQuery.oninput = this.updateOnKeypres.bind(this);
    this.createResultList = this.createResultList.bind(this);
    this.setIsLoading = this.setIsLoading.bind(this);
    this.setIsOpen = this.setIsOpen.bind(this);
    this.setIsEmpty = this.setIsEmpty.bind(this);
    this.fetchData = this.fetchData.bind(this);
  }

  setIsOpen(state) {
    if (state) {
      this.element.classList.add('open');
    } else {
      this.element.classList.remove('closed');
    }
  }

  setIsLoading(state) {
    if (state) {
      this.element.classList.add('loading');
    } else {
      this.element.classList.remove('loading');
    }
  }

  setIsEmpty(state) {
    if (state) {
      this.element.classList.add('isEmpty');
    } else {
      this.element.classList.remove('isEmpty');
    }
  }

  onBlur() {
    // when you blur the focus selector
  }

  onSelect(e) {
    e.preventDefault();
    console.log('you selected a drink');
    // when you select the item from the list
  }

  fetchData() {
    // remove the old results
    const list = this.resultsList.querySelector('.results-list');
    if (list) {
      this.resultsList.removeChild(list);
    }
    // show the loader
    this.setIsLoading(true);
    const searchTerm = encodeURIComponent(this.searchQuery.value.trim());
    Http.request(`${window.api.url}?q=${searchTerm}`)
      .then(response => {
        console.info('http request ', response);
      });
    setTimeout(() => {
      const result = this.createResultList([{name: 'TEST'}, {name: 'TEST2'}]);
      this.resultsList.appendChild(result);
      this.setIsOpen(true);
      this.setIsLoading(false);
    }, 1000);
  }

  updateOnKeypres() {
    clearTimeout(this.timer);
    if (this.searchQuery.value.trim().length) {
      this.timer = setTimeout(this.fetchData, 300);
    }
  }

  // Fires when an attribute was added, removed, or updated.
  attributeChangedCallback(attrName, oldVal, newVal) {
    // console.log('value change', attrName, 'old:', oldVal, 'new ', newVal);
  }

}

