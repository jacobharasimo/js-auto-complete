# LCBO Search
A sample of how one could use web components to create some widgets. This uses the LCBO open api to generate an autocomplte
list of products. you may then select a product to get more details.

## Improvements
* currently you must select a product to collapse the autocomplete results. This could be removed so that `ESC` or clicking
on the DOM would collapse it.

# Requirements
This site is built using Yarn and written in some ES6/ES6 syntax that is transpiled via babel.

## Install
To install the application download the repo and run `yarn` from the command line. This will add the required dependancies.

Once the dependencies are finished installing `yarn start` will run a local server. The site can be found at http://localhost:3000/ 