//
// For guidance on how to add JavaScript see:
// https://prototype-kit.service.gov.uk/docs/adding-css-javascript-and-images
//



window.GOVUKPrototypeKit.documentReady(() => {
  


})


import { FilterToggleButton } from '/javascripts/moj-frontend.min.js'

const $filter = document.querySelector('[data-module="moj-filter"]')

new FilterToggleButton($filter, {
  bigModeMediaQuery: '(min-width: 48.0625em)',
  startHidden: true,
  toggleButton: {
    showText: 'Show filter',
    hideText: 'Hide filter',
    classes: 'govuk-button--secondary'
  },
  closeButton: {
    text: 'Close'
  }
})


import { MultiFileUpload } from '/javascripts/moj-frontend.min.js'

const $multiFileUpload = document.querySelector(
  '[data-module="moj-multi-file-upload"]'
)

new MultiFileUpload($multiFileUpload, {
  uploadUrl: '/ajax-upload',
  deleteUrl: '/ajax-delete'
})