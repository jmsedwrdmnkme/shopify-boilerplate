# shopify-boilerplate
Modern, optimised, minimal Shopify 2.0 boilerplate; installed and kept up to date via PNPM.

Will play nice(st) with the latest versions of modern browsers:-
* Edge
* Firefox
* Chromium
* Safari

## Get started
* git clone https://github.com/jmsedwrdmnkme/shopify-boilerplate.git
* cd shopify-boilerplate
* pnpm install
* gulp
* Start building!

## Features

### Javascript
* Latest Boostrap
* Javascript scripts process (uglify, compression, concat)
* Webpack via Gulp watch task runner for modular imports
* Native deferred loading of JS

### CSS
* Latest Boostrap
* CSS styling process (SASS with comment removal and compression, concat)
* Enqueuing styling to be processed and loaded as a liquid asset

### Modular Sections
* Utilising the Javascript and CSS processes from above
* Enqueuing Javascript and CSS on a component by component basis as sections are used within templates/Theme Editor
* Modular approach removes need for bloated Javascript and CSS at a base theme level
* Each section all packaged up within a singular .liquid file, ready for theme use

### Assets
* Enqueing fonts within assets folder for use
* Imagemin IMG process (image optimisation and SVG minification)
