//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

// Add your routes here

router.get('*', function (req, res, next) {
  // These functions are available on all pages in the prototype.
  // To use call the function inside curly brackets, for example {{ example_function() }}

  // Examples of date
  //
  // {{ date() }} shows todays date in the format 5 May 2022
  // {{ date({day: 'numeric', month: 'numeric', year: 'numeric'}) }} shows todays date in the format 05/05/2022
  // {{ date({day: 'numeric'}) }} shows the just the date of date, 5
  // {{ date({day: '2-digit'}) }} shows the date with a leading zero, 05
  // {{ date({day: 'numeric'}, {'day': -1}) }} shows just the date of yesterday
  // {{ date({weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'}) }} shows todays date in the format Tuesday, 5 July 2022.
  // {{ date({day: 'numeric', month: 'numeric', year: 'numeric'}, {'day': +2}) }}
  res.locals.date = function (
    format = { day: 'numeric', month: 'long', year: 'numeric' },
    diff = { year: 0, month: 0, day: 0 },
  ) {
    var date = new Date()
    if ('day' in diff) {
      date.setDate(date.getDate() + diff.day)
    }
    if ('month' in diff) {
      date.setMonth(date.getMonth() + diff.month)
    }
    if ('year' in diff) {
      date.setYear(date.getFullYear() + diff.year)
    }
    const formattedDate = new Intl.DateTimeFormat('en-GB', format).format(date)
    return `${formattedDate}`
  }

  // Examples of today
  //
  // Useful for pre-populating date fields
  //
  // {{ today().day }} shows just todays day
  // {{ today().month }} shows just todays month as a number
  // {{ today().year }} shows just todays year as a number
  res.locals.today = () => ({
    day: res.locals.date({ day: 'numeric' }),
    month: res.locals.date({ month: 'numeric' }),
    year: res.locals.date({ year: 'numeric' }),
  })

  // Examples of yesterday
  //
  // Useful for pre-populating date fields
  //
  // {{ yesterday().day }} shows just todays day
  // {{ yesterday().month }} shows just todays month as a number
  // {{ yesterday().year }} shows just todays year as a number
  res.locals.yesterday = () => ({
    day: res.locals.date({ day: 'numeric' }, (diff = { day: -1 })),
    month: res.locals.date({ month: 'numeric' }, (diff = { day: -1 })),
    year: res.locals.date({ year: 'numeric' }, (diff = { day: -1 })),
  })

  next()
})

router.post('/eighteen-answer', function(request, response) {

    var eighteen = request.session.data['eighteen']
    if (eighteen == "Yes"){
        response.redirect("/v1/device-wearer/device-wearer-contact")
    } else {
        response.redirect("/v1/device-wearer/responsible-adult")
    }
})

router.post('/contact-address', function(request, response) {

    var addressquestion = request.session.data['addressquestion']
    if (addressquestion == "Yes, they have a fixed address"){
        response.redirect("/v1/device-wearer/contact-address")
    } else {
        response.redirect("/v1/device-wearer/check-answers")
    }
})
router.post('/disability', function(request, response) {

    var disability = request.session.data['disability']
    if (disability == "The device wearer does not have any of these disabilities or health conditions"){
        response.redirect("/v1/installation/language")
    } else if (disability == "Not able to provide this information"){
        response.redirect("/v1/installation/language")    
    } else {
        response.redirect("/v1/installation/disability-needs")
    }
})

router.post('/risk', function(request, response) {

    var risk = request.session.data['risk']
    if (risk == "There are no risks that apply to the device wearer"){
        response.redirect("/v1/installation/mappa")  
    } else {
        response.redirect("/v1/installation/risk-3")
    }
})

router.post('/mappa', function(request, response) {

    var mappaquestion = request.session.data['mappaquestion']
    if (mappaquestion == "Yes"){
        response.redirect("/v1/installation/mappa-2")  
    } else {
        response.redirect("/v1/installation/check-answers")
    }
})

router.post('/install-address-question', function(request, response) {


    var addressquestion = request.session.data['addressquestion']
    
    if (addressquestion == "No, they have no fixed address"){
        response.redirect("/v1/monitoring-conditions/install-address")   
    } else {
        response.redirect("/v1/monitoring-conditions/install-address-question")
    }
})

router.post('/installation-address', function(request, response) {


    var installaddressquestion = request.session.data['installaddressquestion']
    
    if (installaddressquestion == "No"){
        response.redirect("/v1/monitoring-conditions/install-address")   
    } else {
        response.redirect("/v1/monitoring-conditions/monitoring-details")
    }
})

router.post('/monitoring-type', function(request, response) {

    var monitoringtype = request.session.data['monitoringtype']
    
    if (monitoringtype == "Curfew with electronic monitoring"){
        response.redirect("/v1/monitoring-conditions/curfew")   
    } else if (monitoringtype == "Exclusion and inclusion zone monitoring"){
        response.redirect("/v1/monitoring-conditions/exclusion")   
    } else if (monitoringtype == "Trail monitoring"){
        response.redirect("/v1/monitoring-conditions/Trail")   
    } else if (monitoringtype == "Mandatory attendance monitoring"){
        response.redirect("/v1/monitoring-conditions/attendance")      
    } else {
        response.redirect("/v1/monitoring-conditions/alcohol")
    }
})

router.post('/monitoring-type2', function(request, response) {

    var monitoringtype2 = request.session.data['monitoringtype2']
    
    if (monitoringtype2 == "Curfew with electronic monitoring"){
        response.redirect("/v1/monitoring-conditions/curfew")   
    } else if (monitoringtype2 == "Exclusion and inclusion zone monitoring"){
        response.redirect("/v1/monitoring-conditions/exclusion")   
    } else if (monitoringtype2 == "Trail monitoring"){
        response.redirect("/v1/monitoring-conditions/Trail")   
    } else if (monitoringtype2 == "Mandatory attendance monitoring"){
        response.redirect("/v1/monitoring-conditions/attendance")      
    } else {
        response.redirect("/v1/monitoring-conditions/alcohol")
    }
})



router.post('/curfew-address-question', function(request, response) {

    var curfewaddressquestion = request.session.data['curfewaddressquestion']
    if (curfewaddressquestion == "Yes"){
        response.redirect("/v1/monitoring-conditions/curfew-address")
    } else {
        response.redirect("/v1/monitoring-conditions/curfew-2")
    }
})

router.post('/curfew-times-question', function(request, response) {

    var curfewtimesquestion = request.session.data['curfewtimesquestion']
    if (curfewtimesquestion == "Yes"){
        response.redirect("/v1/monitoring-conditions/curfew-4?curfewtimetableday=False&curfewstandard=true")
    } else {
        response.redirect("/v1/monitoring-conditions/curfew-change?curfewtimetableday=Monday&curfewstandard=false")
    }
})


router.post('/alcohol', function(request, response) {

    var alcoholaddress = request.session.data['alcoholaddress']
    if (alcoholaddress == "At another location or address"){
        response.redirect("/v1/monitoring-conditions/alcohol-address")
    } else {
        response.redirect("/v1/monitoring-conditions/monitoring-needed")
    }
})

router.post('/exclusion-question', function(request, response) {

    var exclusionquestion = request.session.data['exclusionquestion']
    if (exclusionquestion == "Yes"){
        response.redirect("/v1/monitoring-conditions/exclusion-4")
    } else {
        response.redirect("/v1/monitoring-conditions/monitoring-needed")
    }
})




router.post('/monitoring-list', function(request, response) {

    var monitoringtypesquestion = request.session.data['monitoringtypesquestion']
    if (monitoringtypesquestion == "Yes"){
        response.redirect("/v1/monitoring-conditions/monitoring-details2")
    } else {
        response.redirect("/v1/monitoring-conditions/check-answers")
    }
})


router.post('/licence-question', function(request, response) {

    var licencequestion = request.session.data['licencequestion']
    if (licencequestion == "Yes"){
        response.redirect("/v1/attachments/licence")
    } else {
        response.redirect("/v1/attachments/photo-question")
    }
})


router.post('/photo-question', function(request, response) {

    var photoquestion = request.session.data['photoquestion']
    if (photoquestion == "Yes"){
        response.redirect("/v1/attachments/photo")
    } else {
        response.redirect("/v1/attachments/check-answers")
    }
})



// const radioButtonRedirect = require('radio-button-redirect')
// router.use(radioButtonRedirect)

// Add your routes here
// Search routes

// END 