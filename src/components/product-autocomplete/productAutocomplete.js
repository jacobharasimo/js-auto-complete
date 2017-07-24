/* eslint-disable no-unused-vars,consistent-this,no-debugger */

import * as template from './productAutocomplete.html';
// custom loaders to parse scss -> css -> string
const style = require('!to-string-loader!css-loader!sass-loader!./productAutocomplete.scss');
import {Http} from '../../http';

export class ProductAutocomplete extends HTMLElement {
  createResultList(items) {
    const list = document.createElement('ul');
    let numResults = parseInt(this.attributes['data-list-size'].nodeValue, 10);
    list.classList.add('results-list');
    if (numResults > items.length) {
      numResults = items.length;
    }
    for (let i = 0; i < numResults; ++i) {
      const item = items[i];
      const listItem = document.createElement('li');
      listItem.classList.add('results-item');
      const innerItem = document.createElement('div');
      innerItem.classList.add('results-item__link');
      listItem.addEventListener('click', (e) => this.onSelect(item));
      innerItem.appendChild(document.createTextNode(item.name));
      listItem.appendChild(innerItem);
      list.appendChild(listItem);
    }
    return list;
  }

  /**
   * This function renders out the details view of an item. the item is displaying
   * most of the details at this time but it can be expanded. This item could also of
   * been generated using an inline template with backticks and variables into the strings
   * but i felt this was a more interesting approach.
   *
   * @param item - the server item
   * @returns {Element} - the results element
   */
  createDetailedResults(item) {
    const results = document.createElement('div');
    results.classList.add('detailed-results');

    const detailsContainer = document.createElement('div');
    detailsContainer.classList.add('details');

    const detailsArticle = document.createElement('article');
    // set the image
    const imageContainer = document.createElement('div');
    const image = document.createElement('img');
    imageContainer.classList.add('image-thumb');
    image.classList.add('thumb');
    image.src = item.image_url;
    imageContainer.appendChild(image);
    const formatedPrice = (item.price_in_cents / 100).toFixed(2);
    // add potential description
    if (item.description) {
      const description = document.createElement('p');
      description.appendChild(document.createTextNode(item.description));
      detailsArticle.appendChild(description);
    }
    // set the crafted node
    const crafted = document.createElement('h3');
    crafted.classList.add('regular');
    crafted.appendChild(document.createTextNode(`Origin: ${item.origin}`));
    detailsArticle.appendChild(crafted);

    // set the volume node
    const volume = document.createElement('h3');
    volume.classList.add('regular');
    volume.appendChild(document.createTextNode(`${item.package}`));
    detailsArticle.appendChild(volume);

    // set the price node
    const price = document.createElement('h2');
    price.appendChild(document.createTextNode(`$${formatedPrice}`));
    detailsArticle.appendChild(price);

    // set the title node
    const title = document.createElement('h1');
    title.classList.add('no-bottom-margin');
    title.appendChild(document.createTextNode(item.name));
    detailsContainer.appendChild(title);

    const type = document.createElement('span');
    type.appendChild(document.createTextNode(` ${item.primary_category} - ${item.secondary_category}`));
    detailsContainer.appendChild(type);

    // construct the result
    detailsContainer.appendChild(detailsArticle);
    results.appendChild(imageContainer);
    results.appendChild(detailsContainer);
    return results;
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
    this.itemDetails = this.sr.querySelector('.item-details');
    // much like react we have to manually bind our scope in as needed
    this.searchQuery.oninput = this.updateOnKeypres.bind(this);
    this.searchQuery.onfocus = this.onFocus.bind(this);
    // bind over functions that need scope
    this.createResultList = this.createResultList.bind(this);
    this.setIsLoading = this.setIsLoading.bind(this);
    this.setIsOpen = this.setIsOpen.bind(this);
    this.setIsEmpty = this.setIsEmpty.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.canShowItemDetails = this.canShowItemDetails.bind(this);
  }


  canShowItemDetails(state) {
    if (state) {
      this.itemDetails.classList.add('selected');
    } else {
      this.itemDetails.classList.remove('selected');
    }
  }

  setIsOpen(state) {
    if (state) {
      this.element.classList.add('open');
    } else {
      this.element.classList.remove('open');
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

  onFocus() {
    if (this.resultsList.querySelector('.results-list')) {
      this.setIsOpen(true);
    }
  }

  onBlur() {
    // when you blur the focus selector if there is one item in the list select it
  }

  onSelect(item) {
    this.setIsOpen(false);
    this.createDetailedResults(item);
    const innerDetails = this.createDetailedResults(item);
    // empty the details
    while (this.itemDetails.firstChild) {
      this.itemDetails.removeChild(this.itemDetails.firstChild);
    }
    // add the new inner child
    this.itemDetails.appendChild(innerDetails);
    this.canShowItemDetails(true);
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
        const result = this.createResultList(response.result);
        this.resultsList.appendChild(result);
        this.setIsOpen(true);
        this.setIsLoading(false);
      });
  }

  updateOnKeypres() {
    clearTimeout(this.timer);
    if (this.searchQuery.value.trim().length) {
      this.timer = setTimeout(this.fetchData, 300);
    }
  }

  // Fires when an attribute was added, removed, or updated.
  attributeChangedCallback(attrName, oldVal, newVal) {
    console.log('value change', attrName, 'old:', oldVal, 'new ', newVal);
  }

}

