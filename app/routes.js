//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//



const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

const v2Router = govukPrototypeKit.requests.setupRouter('/v2')

function registerPost(path, handler) {
  router.post(path, handler)
  router.post(`/v1${path}`, handler)
  v2Router.post(path, handler)
}

// Legacy forms post to root-level routes, so use the referrer to retain their version.
router.use((req, res, next) => {
  const requestVersion = req.path.match(/^\/(v\d+)(?=\/|$)/)
  const referrerVersion = req.get('Referrer')?.match(/\/(v\d+)(?=\/|$)/)
  const version = requestVersion?.[1] || referrerVersion?.[1]

  res.locals.basePath = version ? `/${version}` : ''

  if (version) {
    const redirect = res.redirect

    res.redirect = function (...args) {
      const locationIndex = typeof args[0] === 'number' ? 1 : 0
      const location = args[locationIndex]

      if (typeof location === 'string' && !/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(location)) {
        const absoluteLocation = location.startsWith('/') ? location : `/${location}`
        const locationVersion = absoluteLocation.match(/^\/v\d+(?=\/|$)/)
        args[locationIndex] = locationVersion
          ? `${res.locals.basePath}${absoluteLocation.slice(locationVersion[0].length)}`
          : `${res.locals.basePath}${absoluteLocation}`
      }

      return redirect.apply(this, args)
    }
  }

  next()
})

// Add your routes here

// Logging session data 
 
 router.use((req, res, next) => { 
 const log = { 
 method: req.method, 
 url: req.originalUrl, 
 data: req.session.data 
 } 
 console.log(JSON.stringify(log, null, 2)) 

 next() 
 })

 // GET SPRINT NAME - useful for relative templates
router.use('/', (req, res, next) => {
  res.locals.currentURL = req.originalUrl; //current screen
  res.locals.prevURL = req.get('Referrer'); // previous screen
console.log('previous page is: ' + res.locals.prevURL + " and current page is " + req.url + " " + res.locals.currentURL );
  next();
});

require('./routes/v2')(v2Router)

router.get(/.*/, function (req, res, next) {
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

registerPost('/eighteen-answer', function(request, response) {

    var under18 = request.session.data['under-18'] || request.session.data['eighteen']
    if (under18 == "Yes"){
        response.redirect("/v1/device-wearer/responsible-adult")
    } else {
        response.redirect("/v1/device-wearer/device-wearer-contact")
    }
})

registerPost('/contact-address', function(request, response) {

    var addressquestion = request.session.data['addressquestion']
    var variationsimple = request.session.data['variation-simple']
    if (addressquestion == "Yes"){
        response.redirect("/v1/postcode-lookup/postcode")
    } else if (variationsimple == "true"){
        response.redirect("/v1/variation-simple/monitoring-dates")      
    } else {
        response.redirect("/v1/device-wearer/check-answers")
    }
})

registerPost('/postcode', function(request, response) {

    var sectionid = request.session.data['sectionid']
    var sraddress = request.session.data['sr-address']
    var postcodetype = request.session.data['postcodetype']
    if (sectionid == " "){
        response.redirect("/v1/variation-simple/monitoring-dates")
     } else  if (sraddress == "Yes"){
        response.redirect("/v1/device-wearer/check-answers-view")        
     } else  if (sectionid == "About the device wearer"){
        response.redirect("/v1/device-wearer/check-answers")    
    } else if (postcodetype == "appointment"){
        response.redirect("/v1/monitoring-conditions/monitoring-needed")       
    } else if (postcodetype == "curfew"){
        response.redirect("/v1/postcode-lookup/address-name")    
    } else if (postcodetype == "installation"){
        response.redirect("/v1/monitoring-conditions/check-answers")            
    } else {
        response.redirect("/v1/variation-simple/monitoring-dates")
    }
})

registerPost('/disability', function(request, response) {

    var disability = request.session.data['disability']
    if (disability == "The device wearer does not have any of the disabilities or health conditions listed"){
        response.redirect("/v1/installation/language")
    } else if (disability == "Not able to provide this information"){
        response.redirect("/v1/installation/language")    
    } else {
        response.redirect("/v1/installation/language")
    }
})

registerPost('/risk', function(request, response) {

    var risk = request.session.data['risk']
    var usertype = request.session.data['usertype']

    if (usertype == "Home Office user") {
        response.redirect("/v1/installation/mappa")  
    } else {
        response.redirect("/v1/installation/check-answers")
    }
})

registerPost('/mappa', function(request, response) {

    var mappaquestion = request.session.data['mappaquestion']
    if (mappaquestion == "Yes"){
        response.redirect("/v1/installation/mappa-2")  
    } else {
        response.redirect("/v1/installation/check-answers")
    }
})

registerPost('/oasys', function(request, response) {

    var oasys = request.session.data['oasys']
    if (oasys == "Yes"){
        response.redirect("/v1/installation/oasys2")  
    } else {
        response.redirect("/v1/installation/risk-3")
    }
})

registerPost('/install-address-question', function(request, response) {


    var addressquestion = request.session.data['addressquestion']
    
    if (addressquestion == "No"){
        response.redirect("/v1/monitoring-conditions/install-address")   
    } else {
        response.redirect("/v1/monitoring-conditions/install-address-question")
    }
})

registerPost('/install-address-question2', function(request, response) {


    var installaddressquestion = request.session.data['installaddressquestion']
    
    if (installaddressquestion == "No"){
        response.redirect("/v1/monitoring-conditions/install-address")   
    } else {
        response.redirect("/v1/monitoring-conditions/appointment-question")
    }
})

registerPost('/installation-address', function(request, response) {


    var installaddressquestion = request.session.data['installaddressquestion']
    var monitoringtype = request.session.data['monitoringtype']
    
    if (installaddressquestion == "No"){
        response.redirect("/v1/monitoring-conditions/install-address")   
    } else if (monitoringtype == "Exclusion zone monitoring"){
        response.redirect("/v1/monitoring-conditions/exclusion") 
    } else if (monitoringtype == "Inclusion zone monitoring"){
        response.redirect("/v1/monitoring-conditions/inclusion")       
    } else if (monitoringtype == "Trail monitoring"){
        response.redirect("/v1/monitoring-conditions/trail") 
    } else if (monitoringtype == "Trail monitoring (Home Office)"){
        response.redirect("/v1/monitoring-conditions/trail")    
    } else if (monitoringtype == "Mandatory attendance monitoring"){
        response.redirect("/v1/monitoring-conditions/attendance")      
    } else {
        response.redirect("/v1/monitoring-conditions/alcohol")
    }
})

registerPost('/installation-address2', function(request, response) {


    var installaddressquestion = request.session.data['installaddressquestion']
    var monitoringtype2 = request.session.data['monitoringtype2']
    
    if (installaddressquestion == "No"){
        response.redirect("/v1/monitoring-conditions/install-address")   
    } else if (monitoringtype2 == "Exclusion zone monitoring"){
        response.redirect("/v1/monitoring-conditions/exclusion")   
    } else if (monitoringtype2 == "Inclusion zone monitoring"){
        response.redirect("/v1/monitoring-conditions/inclusion") 
    } else if (monitoringtype2 == "Trail monitoring"){
        response.redirect("/v1/monitoring-conditions/trail") 
    } else if (monitoringtype2 == "Trail monitoring (Home Office)"){
        response.redirect("/v1/monitoring-conditions/trail")    
    } else if (monitoringtype2 == "Mandatory attendance monitoring"){
        response.redirect("/v1/monitoring-conditions/attendance")      
    } else {
        response.redirect("/v1/monitoring-conditions/alcohol")
    }
})

registerPost('/appointment-addressold', function(request, response) {


    var appointmentquestion = request.session.data['appointmentquestion']
    var monitoringtype = request.session.data['monitoringtype']
    
    if (appointmentquestion == "Yes"){
        response.redirect("/v1/monitoring-conditions/appointment-details")   
    } else if (monitoringtype == "Exclusion zone monitoring"){
        response.redirect("/v1/monitoring-conditions/exclusion") 
    } else if (monitoringtype == "Inclusion zone monitoring"){
        response.redirect("/v1/monitoring-conditions/inclusion")       
    } else if (monitoringtype == "Trail monitoring"){
        response.redirect("/v1/monitoring-conditions/trail") 
    } else if (monitoringtype == "Trail monitoring (Home Office)"){
        response.redirect("/v1/monitoring-conditions/trail")    
    } else if (monitoringtype == "Mandatory attendance monitoring"){
        response.redirect("/v1/monitoring-conditions/attendance")      
    } else {
        response.redirect("/v1/monitoring-conditions/alcohol")
    }
})

registerPost('/appointment-address', function(request, response) {
    var appointmentquestion = request.session.data['appointmentquestion']
    var monitoringtype = request.session.data['monitoringtype']
   
    
    if (appointmentquestion == "At a prison"){
        response.redirect("/v1/monitoring-conditions/appointment-details")  
    } else if (appointmentquestion == "At a probation office"){
        response.redirect("/v1/monitoring-conditions/appointment-details") 
    } else if (appointmentquestion == "At an immigration removal centre"){
        response.redirect("/v1/monitoring-conditions/appointment-details")     
    } else if (appointmentquestion == "At another address"){
        response.redirect("/v1/monitoring-conditions/appointment-details")    
    } else if (appointmentquestion == "Installation has already taken place"){
        response.redirect("/v1/monitoring-conditions/check-answers")                   
    } else {
        response.redirect("/v1/monitoring-conditions/check-answers")
    }
})

registerPost('/appointment-address-ho', function(request, response) {
    var appointmentquestion = request.session.data['appointmentquestion']
    var monitoringtype = request.session.data['monitoringtype']
   
    
     if (appointmentquestion == "Installation has already taken place"){
        response.redirect("/v1/monitoring-conditions/check-answers")                   
    } else {
        response.redirect("/v1/monitoring-conditions/appointment-details")
    }
})

registerPost('/appointment-address2', function(request, response) {
    var appointmentquestion = request.session.data['appointmentquestion']
    var monitoringtype2 = request.session.data['monitoringtype2']
   
    
    if (appointmentquestion == "At a prison"){
        response.redirect("/v1/monitoring-conditions/appointment-details")  
    } else if (appointmentquestion == "At a probation office"){
        response.redirect("/v1/monitoring-conditions/appointment-details") 
    } else if (appointmentquestion == "At another address"){
        response.redirect("/v1/monitoring-conditions/install-address")               
    } else {
        response.redirect("/v1/monitoring-conditions/check-answers")
    }
})


registerPost('/appointment-address2old', function(request, response) {


    var appointmentquestion = request.session.data['appointmentquestion']
    var monitoringtype2 = request.session.data['monitoringtype2']
    
    if (appointmentquestion == "Yes"){
        response.redirect("/v1/monitoring-conditions/appointment-details")   
    } else if (monitoringtype2 == "Exclusion zone monitoring"){
        response.redirect("/v1/monitoring-conditions/exclusion")   
    } else if (monitoringtype2 == "Inclusion zone monitoring"){
        response.redirect("/v1/monitoring-conditions/inclusion") 
    } else if (monitoringtype2 == "Trail monitoring"){
        response.redirect("/v1/monitoring-conditions/trail") 
    } else if (monitoringtype2 == "Trail monitoring (Home Office)"){
        response.redirect("/v1/monitoring-conditions/trail")    
    } else if (monitoringtype2 == "Mandatory attendance monitoring"){
        response.redirect("/v1/monitoring-conditions/attendance")      
    } else {
        response.redirect("/v1/monitoring-conditions/alcohol")
    }
})



registerPost('/monitoring-questionold', function(request, response) {

    var monitoringtype = request.session.data['monitoringtype']
    var addressquestion = request.session.data['addressquestion']
    
    if (monitoringtype == "Curfew"){
        response.redirect("/v1/monitoring-conditions/curfew")   
    } else if (addressquestion == "No"){
        response.redirect("/v1/monitoring-conditions/install-address")   
    } else {
        response.redirect("/v1/monitoring-conditions/install-address-question")
    }
})

registerPost('/monitoring-question', function(request, response) {

    var monitoringtype = request.session.data['monitoringtype']
    var addressquestion = request.session.data['addressquestion']

    
    if (monitoringtype == "Curfew"){
        response.redirect("/v1/monitoring-conditions/curfew")     
    } else if (monitoringtype == "Alcohol monitoring"){
    response.redirect("/v1/monitoring-conditions/appointment-question") 
    } else if (monitoringtype == "Trail monitoring (Home Office)"){
    response.redirect("/v1/monitoring-conditions/appointment-question") 
    } else if (addressquestion == "No"){
    response.redirect("/v1/monitoring-conditions/install-address")   
    } else {
    response.redirect("/v1/monitoring-conditions/install-address-question")
    }
})

registerPost('/monitoring-question2old', function(request, response) {

    var monitoringtype2 = request.session.data['monitoringtype2']
    var addressquestion = request.session.data['addressquestion']
    
    if (monitoringtype2 == "Curfew"){
        response.redirect("/v1/monitoring-conditions/curfew")   
    } else if (addressquestion == "No"){
        response.redirect("/v1/monitoring-conditions/install-address")   
    } else {
        response.redirect("/v1/monitoring-conditions/install-address-question")
    }
})

registerPost('/monitoring-question2', function(request, response) {

    var monitoringtype2 = request.session.data['monitoringtype2']

    
    if (monitoringtype2 == "Curfew"){
        response.redirect("/v1/monitoring-conditions/curfew")     
    } else {
        response.redirect("/v1/monitoring-conditions/appointment-question")
    }
})

registerPost('/monitoring-type', function(request, response) {

    var monitoringtype = request.session.data['monitoringtype']
    
    if (monitoringtype == "Curfew"){
        response.redirect("/v1/monitoring-conditions/curfew")   
    } else if (monitoringtype == "Exclusion zone monitoring"){
        response.redirect("/v1/monitoring-conditions/exclusion")  
    } else if (monitoringtype == "Restriction zone monitoring"){
        response.redirect("/v1/monitoring-conditions/inclusion")  
    } else if (monitoringtype == "Trail monitoring"){
        response.redirect("/v1/monitoring-conditions/trail") 
    } else if (monitoringtype == "Trail monitoring (Home Office)"){
        response.redirect("/v1/monitoring-conditions/trail")    
    } else if (monitoringtype == "Mandatory attendance monitoring"){
        response.redirect("/v1/monitoring-conditions/attendance")      
    } else {
        response.redirect("/v1/monitoring-conditions/alcohol")
    }
})

registerPost('/install-type', function(request, response) {

    var monitoringtype = request.session.data['monitoringtype']
    
    if (monitoringtype == "Curfew"){
        response.redirect("/v1/monitoring-conditions/curfew")   
    } else if (monitoringtype == "Exclusion zone monitoring"){
        response.redirect("/v1/monitoring-conditions/exclusion")  
    } else if (monitoringtype == "Inclusion zone monitoring"){
        response.redirect("/v1/monitoring-conditions/inclusion")  
    } else if (monitoringtype == "Trail monitoring"){
        response.redirect("/v1/monitoring-conditions/trail") 
    } else if (monitoringtype == "Trail monitoring (Home Office)"){
        response.redirect("/v1/monitoring-conditions/trail")    
    } else if (monitoringtype == "Mandatory attendance monitoring"){
        response.redirect("/v1/monitoring-conditions/attendance")      
    } else {
        response.redirect("/v1/monitoring-conditions/check-answers")
    }
})

registerPost('/monitoring-type2', function(request, response) {

    var monitoringtype2 = request.session.data['monitoringtype2']
    
    if (monitoringtype2 == "Curfew"){
        response.redirect("/v1/monitoring-conditions/curfew")   
    } else if (monitoringtype2 == "Exclusion zone monitoring"){
        response.redirect("/v1/monitoring-conditions/exclusion") 
    } else if (monitoringtype2 == "Restriction zone monitoring"){
        response.redirect("/v1/monitoring-conditions/inclusion")       
    } else if (monitoringtype2 == "Trail monitoring"){
        response.redirect("/v1/monitoring-conditions/trail")   
    } else if (monitoringtype2 == "Trail monitoring (Home Office)"){
        response.redirect("/v1/monitoring-conditions/trail")  
    } else if (monitoringtype2 == "Mandatory attendance monitoring"){
        response.redirect("/v1/monitoring-conditions/attendance")      
    } else {
        response.redirect("/v1/monitoring-conditions/alcohol")
    }
})

registerPost('/install-type2', function(request, response) {

    var monitoringtype2 = request.session.data['monitoringtype2']
    
    if (monitoringtype2 == "Curfew"){
        response.redirect("/v1/monitoring-conditions/curfew")   
    } else if (monitoringtype2 == "Exclusion zone monitoring"){
        response.redirect("/v1/monitoring-conditions/exclusion") 
    } else if (monitoringtype2 == "Inclusion zone monitoring"){
        response.redirect("/v1/monitoring-conditions/inclusion")       
    } else if (monitoringtype2 == "Trail monitoring"){
        response.redirect("/v1/monitoring-conditions/trail")   
    } else if (monitoringtype2 == "Trail monitoring (Home Office)"){
        response.redirect("/v1/monitoring-conditions/trail")  
    } else if (monitoringtype2 == "Mandatory attendance monitoring"){
        response.redirect("/v1/monitoring-conditions/attendance")      
    } else {
        response.redirect("/v1/monitoring-conditions/check-answers")
    }
})


registerPost('/curfew-address-question', function(request, response) {

    var curfewaddressquestion = request.session.data['curfewaddressquestion']
    var view = request.session.data['view']
    if (curfewaddressquestion == "Yes"){
        response.redirect("/v1/postcode-lookup/postcode")
    } else if (view == "false"){
        response.redirect("/v1/monitoring-conditions/check-answers-view")     
    } else {
        response.redirect("/v1/monitoring-conditions/curfew-1")
    }
})

registerPost('/curfew-change', function(request, response) {

    var curfewperiods = request.session.data['curfewperiods']
    if (curfewperiods == "one"){
        response.redirect("/v1/monitoring-conditions/curfew-4")
    } else {
        response.redirect("/v1/monitoring-conditions/curfew-change2")
    }
})

registerPost('/curfew-times-question', function(request, response) {

    var curfewtimesquestion = request.session.data['curfewtimesquestion']
    if (curfewtimesquestion == "Yes"){
        response.redirect("/v1/monitoring-conditions/curfew-4?curfewtimetableday=false&curfewstandard=true&curfewchange-starttime-hours=19&CurfewStart-ampm=pm&curfewchange-starttime-minutes=00&curfewchange-endtime-hours=07&curfewchange-endtime-minutes=00&CurfewEnd-ampm=am&curfewperiods=one")
    } else {
        response.redirect("/v1/monitoring-conditions/curfew-period?curfewstandard=false&curfewtimetableday=false")
    }
})


registerPost('/alcohol', function(request, response) {

    var alcoholaddress = request.session.data['alcoholaddress']
    if (alcoholaddress == "At another location or address"){
        response.redirect("/v1/monitoring-conditions/alcohol-address")
    } else {
        response.redirect("/v1/monitoring-conditions/monitoring-needed")
    }
})



registerPost('/exclusion-question', function(request, response) {

    var exclusionquestion = request.session.data['exclusionquestion']
    if (exclusionquestion == "Yes"){
        response.redirect("/v1/monitoring-conditions/exclusion-4")
    } else {
        response.redirect("/v1/monitoring-conditions/monitoring-needed")
    }
})

registerPost('/map-question', function(request, response) {

    var mapquestion = request.session.data['mapquestion']
    if (mapquestion == "Yes"){
        response.redirect("/v1/attachments/map-upload")
    } else {
        response.redirect("/v1/attachments/check-answers")
    }
})

registerPost('/map-another', function(request, response) {

    var another = request.session.data['another']
    if (another == "yes"){
        response.redirect("/v1/attachments/map-upload")
    } else {
        response.redirect("/v1/attachments/check-answers")
    }
})

registerPost('/inclusion-question', function(request, response) {

    var exclusionquestion = request.session.data['exclusionquestion']
    if (exclusionquestion == "Yes"){
        response.redirect("/v1/monitoring-conditions/inclusion-4")
    } else {
        response.redirect("/v1/monitoring-conditions/monitoring-needed")
    }
})




registerPost('/monitoring-list', function(request, response) {

    var monitoringtypesquestion = request.session.data['monitoringtypesquestion']
    var monitoringtype = request.session.data['monitoringtype']
    var usertype = request.session.data['usertype']
    var monitoringtype2 = request.session.data['monitoringtype2']
    var errorremoved = request.session.data['errorremoved']
    if (monitoringtypesquestion == "Yes"){
        response.redirect("/v1/monitoring-conditions/monitoring-details2")
    } else if (errorremoved == "Yes"){
        response.redirect("/v1/monitoring-conditions/check-answers")     

    } else if (monitoringtype == "Alcohol monitoring"){
        response.redirect("/v1/monitoring-conditions/appointment-question") 
    } else if (monitoringtype2 == "Alcohol monitoring"){
        response.redirect("/v1/monitoring-conditions/appointment-question") 
    } else if (usertype == "Home Office user"){
        response.redirect("/v1/monitoring-conditions/appointment-question")             
    } else {
        response.redirect("/v1/monitoring-conditions/check-answers")
    }
})

registerPost('/monitoring-list-edit', function(request, response) {

    var monitoringtypesquestion = request.session.data['monitoringtypesquestion']
    var change = request.session.data['change']
    if (monitoringtypesquestion == "Yes"){
        response.redirect("/v1/monitoring-conditions/monitoring-details2")
    } else if (change == "true"){
        response.redirect("/v1/monitoring-conditions/check-answers-view")       
    } else {
        response.redirect("/v1/monitoring-conditions/check-answers")
    }
})

registerPost('/ho-question', function(request, response) {

    var notifyingorg = request.session.data['notifying-org']
    if (notifyingorg == "Home Office"){
        response.redirect("/v1/attachments/licence-question?cya5=false")
    } else {
        response.redirect("/v1/attachments/licence?cya5=false")
    }
})



registerPost('/licence-question', function(request, response) {
    var licencequestion = request.session.data['licencequestion']
    if (licencequestion == "Yes"){
        response.redirect("/v1/attachments/licence-ho")  
    } else {
        response.redirect("/v1/attachments/photo-question")
    }
})


registerPost('/photo-question', function(request, response) {

    var photoquestion = request.session.data['photoquestion']
    if (photoquestion == "Yes"){
        response.redirect("/v1/attachments/photo")
    } else {
        response.redirect("/v1/attachments/map-question")
    }
})


registerPost('/photo-questioncvl', function(request, response) {

    var photoquestion = request.session.data['photoquestion']
    if (photoquestion == "Yes"){
        response.redirect("/v1/attachments/photo")
    } else {
        response.redirect("/v1/attachments/map-list")
    }
})

registerPost('/photo-questionnomap', function(request, response) {

    var photoquestion = request.session.data['photoquestion']
    if (photoquestion == "Yes"){
        response.redirect("/v1/attachments/photo")
    } else {
        response.redirect("/v1/attachments/check-answers")
    }
})


registerPost('/photo-question2', function(request, response) {

    var photoquestion = request.session.data['photoquestion']
    if (photoquestion == "Yes"){
        response.redirect("/v1/attachments/photo")
    } else {
        response.redirect("/v1/attachments/check-answers-view")
    }
})

registerPost('/equipmentaddressquestion', function(request, response) {

    var equipmentaddressquestion = request.session.data['equipmentaddressquestion']
    if (equipmentaddressquestion == "No"){
        response.redirect("/v1/variations/edit-form-delete-addaddress")
    } else {
        response.redirect("/v1/variations/edit-form-delete-question")
    }
})

registerPost('/region', function(request, response) {

    var officerorg = request.session.data['officer-org']
    if (officerorg == "Probation service"){
        response.redirect("/v1/organisation/specialsquestion")
    } else if (officerorg == "Youth Justice Service (YJS)"){
        response.redirect("/v1/organisation/region")
    } else if (officerorg == "Youth Custody Service (YCS)"){
        response.redirect("/v1/organisation/region")           
    } else {
        response.redirect("/v1/organisation/check-answers")
    }
})

registerPost('/specialsquestion', function(request, response) {

    var specialsquestion = request.session.data['specialsquestion']
    if (specialsquestion == "Yes"){
        response.redirect("/v1/installation/hard-stop?sectionid=About the Notifying and Responsible Organisations")        
    } else {
        response.redirect("/v1/organisation/region")
    }
})

registerPost('/order-type', function(request, response) {

    var ordertype = request.session.data['order-type']
    if (ordertype == "Civil"){
        response.redirect("/v1/monitoring-conditions/monitoring-details")
    } else if (ordertype == "Post release"){
        response.redirect("/v1/otd-old/order-sentence") 
    } else if (ordertype == "Community"){
        response.redirect("/v1/otd-old/order-sentence") 
    } else if (ordertype == "Special"){
        response.redirect("/v1/mvp/order-conditions") 
    } else if (ordertype == "Pre trial"){
        response.redirect("/v1/otd-old/order-sentence")          
    } else {
        response.redirect("/v1/monitoring-conditions/monitoring-details")
    }
})

registerPost('/order-type2', function(request, response) {

    var ordertype = request.session.data['order-type']
    if (ordertype == "Civil"){
        response.redirect("/v1/mvp/civil")
    } else if (ordertype == "Post release"){
        response.redirect("/v1/mvp/postrelease") 
    } else if (ordertype == "Community"){
        response.redirect("/v1/mvp/community") 
    } else if (ordertype == "Special"){
        response.redirect("/v1/mvp/special") 
    } else if (ordertype == "Pre trial"){
        response.redirect("/v1/mvp/pretrial")          
    } else {
        response.redirect("/v1/mvp/end2")
    }
})




registerPost('/pilots', function(request, response) {

    var ordertype = request.session.data['order-type']
    var orderdescription = request.session.data['order-description']
    var notifyingorg = request.session.data['order-description']
    if (orderdescription == "GPS acquisitive crime"){
        response.redirect("/v1/otd-old/order-aq")         

  } else if (ordertype == "Post release") {
        response.redirect("/v1/otd-old/order-prrar")    
   } else {
        response.redirect("/v1/monitoring-conditions/monitoring-details")
    }
})

registerPost('/pilots-probation', function(request, response) {

    var ordertype = request.session.data['order-type']
    var orderdescription = request.session.data['order-description']
    var notifyingorg = request.session.data['order-description']
    if (orderdescription == "GPS acquisitive crime"){
        response.redirect("/v1/otd-old/order-aq")  

  } else if (orderdescription == "Domestic Abuse Perpetrator on Licence (DAPOL)") {
    response.redirect("/v1/otd-old/order-dapol")        

  } else if (ordertype == "Post release") {
        response.redirect("/v1/otd-old/order-prrar")    
   } else {
        response.redirect("/v1/monitoring-conditions/monitoring-details")
    }
})

registerPost('/order-region', function(request, response) {

    var orderdescription = request.session.data['order-description']
    if (orderdescription == "GPS acquisitive crime"){
        response.redirect("/v1/otd-old/order-aq") 
    } else {
        response.redirect("/v1/otd-old/order-prrar")
    }
})

registerPost('/order-conditions', function(request, response) {

    var ordercondition = request.session.data['order-condition']
    if (ordercondition == "Yes"){
        response.redirect("/v1/monitoring-conditions/order-conditions2") 
    } else {
        response.redirect("/v1/monitoring-conditions/order-prrar")
    }
})

registerPost('/order-sentence', function(request, response) {

    var ordertype = request.session.data['order-type']
    var ordersentence = request.session.data['order-sentence']

    if (ordertype == "Pre trial"){
        response.redirect("/v1/otd-old/order-issp") 
    } else if (ordersentence == "Youth Rehabilitation Order (YRO)") {
        response.redirect("/v1/otd-old/order-issp")  
    } else if (ordersentence == "Detention and Training Order (DTO)") {
        response.redirect("/v1/otd-old/order-issp")      
    } else if (ordertype == "Community") {
        response.redirect("/v1/monitoring-conditions/monitoring-details")        
    } else if (ordersentence == "Standard Determinate Sentence") {
        response.redirect("/v1/otd-old/order-hdc")
    } else {
        response.redirect("/v1/otd-old/order-prrar")
    }
})

registerPost('/order-hdc', function(request, response) {

  
    var ordersentence = request.session.data['order-sentence']
    if (ordersentence == "Section 250 / Section 91"){
        response.redirect("/v1/otd-old/order-prrar")      
    } else {
        response.redirect("/v1/otd-old/order-pilots")
    }
})

registerPost('/order-hdc-isr', function(request, response) {

  
    var ordersentence = request.session.data['order-sentence']
    var hdc = request.session.data['hdc']
    if (ordersentence == "Section 250 / Section 91"){
        response.redirect("/v1/otd-old/order-prrar") 
    } else if (hdc == "Yes") {
        response.redirect("/v1/otd-old/hdc-pause")      
    } else {
        response.redirect("/v1/otd-old/order-pilots")
    }
})


registerPost('/order-issp', function(request, response) {

  
    var ordersentence = request.session.data['order-sentence']
    if (ordersentence == "Detention and Training Order (DTO)"){
        response.redirect("/v1/otd-old/order-prrar") 
    } else {
        response.redirect("/v1/monitoring-conditions/monitoring-details")
    }
})

registerPost('/order-information', function(request, response) {

    var ordertype = request.session.data['order-type']
    if (ordertype == "Release from prison"){
        response.redirect("/v1/monitoring-conditions/order-hdc") 
    } else {
        response.redirect("/v1/monitoring-conditions/order-description")
    }
})

registerPost('/hdc', function(request, response) {

    var hdc = request.session.data['hdc']
    if (hdc == "No"){
        response.redirect("/v1/monitoring-conditions/order-sentence-type") 
    } else {
        response.redirect("/v1/monitoring-conditions/order-description")
    }
})

registerPost('/order-description', function(request, response) {

    var ordertype = request.session.data['order-type']
    if (ordertype == "Release from prison"){
        response.redirect("/v1/monitoring-conditions/order-prrar") 
    } else {
        response.redirect("/v1/monitoring-conditions/monitoring-details")
    }
})

registerPost('/curfew-dates-question', function(request, response) {

    var curfewdatesquestion = request.session.data['curfewdatesquestion']
    if (curfewdatesquestion == "No"){
        response.redirect("/v1/monitoring-conditions/curfew-2") 
    } else {
        response.redirect("/v1/monitoring-conditions/curfew-3")
    }
})

registerPost('/curfew-release-question', function(request, response) {

    var curfewreleasequestion = request.session.data['curfewreleasequestion']
    if (curfewreleasequestion == "No"){
        response.redirect("/v1/monitoring-conditions/curfew-3-enter") 
    } else {
        response.redirect("/v1/monitoring-conditions/curfew-3-question")
    }
})

registerPost('/exclusion-dates-question', function(request, response) {

    var exclusiondatesquestion = request.session.data['exclusiondatesquestion']
    if (exclusiondatesquestion == "No"){
        response.redirect("/v1/monitoring-conditions/exclusion-1") 
    } else {
        response.redirect("/v1/monitoring-conditions/exclusion-2")
    }
})

registerPost('/alcohol-dates-question', function(request, response) {

    var alcoholdatesquestion = request.session.data['alcoholdatesquestion']
    if (alcoholdatesquestion == "No"){
        response.redirect("/v1/monitoring-conditions/alcohol-1") 
    } else {
        response.redirect("/v1/monitoring-conditions/alcohol-2")
    }
})

registerPost('/attendance-dates-question', function(request, response) {

    var attendancedatesquestion = request.session.data['attendancedatesquestion']
    if (attendancedatesquestion == "No"){
        response.redirect("/v1/monitoring-conditions/attendance-1") 
    } else {
        response.redirect("/v1/monitoring-conditions/attendance-2")
    }
})

registerPost('/trail-dates-question', function(request, response) {

    var traildatesquestion = request.session.data['traildatesquestion']
    var monitoringtype = request.session.data['monitoringtype']
    var monitoringtype2 = request.session.data['monitoringtype']

    if (traildatesquestion == "No"){
        response.redirect("/v1/monitoring-conditions/trail-1") 
    } else if (monitoringtype == "Trail monitoring (Home Office)") {
        response.redirect("/v1/monitoring-conditions/trail-2") 
    } else if (monitoringtype2 == "Trail monitoring (Home Office)") {
        response.redirect("/v1/monitoring-conditions/trail-2")  
    } else {
        response.redirect("/v1/monitoring-conditions/monitoring-needed")
    }
})


registerPost('/pdu', function(request, response) {

    var pdu = request.session.data['pdu']

    if (pdu == "Cheshire East"){
        response.redirect("/v1/organisation/region3") 
    } else if (pdu == "Cheshire West") {
        response.redirect("/v1/organisation/region3") 
    } else if (pdu == "Central Lancashire") {
        response.redirect("/v1/organisation/region3") 
    } else if (pdu == "East Lancashire") {
        response.redirect("/v1/organisation/region3")  
    } else if (pdu == "North West Lancashire") {
        response.redirect("/v1/organisation/region3")   
    } else if (pdu == "Warrington and Halton") {
        response.redirect("/v1/organisation/region3")              
    } else {
        response.redirect("/v1/organisation/check-answers")
    }
})

registerPost('/sr-question-OLD', function(request, response) {

    var srtypesimple = request.session.data['sr-type-simple']
    if (srtypesimple == "I have changed something else in the form"){
        response.redirect("/v1/new-form?section-1-complete=false&section-2-complete=false&section-3-complete=false&section-4-complete=false&section-5-complete=false&section-6-complete=false&view=none&newform=false")     
    } else if (srtypesimple == "I need to end all monitoring for the device wearer2") {
        response.redirect("/v1/variation-simple/bail") 
    } else if (srtypesimple == "I need to end all monitoring for the device wearer") {
        response.redirect("/v1/variation-simple/bail")  
     } else if (srtypesimple == "I need monitoring equipment installed at a new address") {
        response.redirect("/v1/new-form?section-1-complete=false&section-2-complete=false&section-3-complete=false&section-4-complete=false&section-5-complete=false&section-6-complete=false&view=none&newform=false")       
    } else if (srtypesimple == "hardstop") {
        response.redirect("/v1/variations/hard-stop?equipment=true")  
    } else if (srtypesimple == "hardstop2") {
        response.redirect("/v1/variations/hard-stop?equipment=false")         
    } else {
        response.redirect("/v1/variation-simple/identity-numbers")
    }
})

registerPost('/sr-address-simple', function(request, response) {

    var sraddress = request.session.data['sr-address']
    if (sraddress == "No"){
        response.redirect("/v1/variation-simple/sr-question")     
    } else {
        response.redirect("/v1/new-form?section-1-complete=false&section-2-complete=false&section-3-complete=false&section-4-complete=false&section-5-complete=false&section-6-complete=false&view=none&newform=false")
    }
})

registerPost('/sr-question', function(request, response) {

    var srtypesimple = request.session.data['sr-type-simple']
    if (srtypesimple == "I have changed something else in the form"){
        response.redirect("/v1/new-form?section-1-complete=false&section-2-complete=false&section-3-complete=false&section-4-complete=false&section-5-complete=false&section-6-complete=false&view=none&newform=false")      
     } else if (srtypesimple == "I need monitoring equipment installed at a new address") {
        response.redirect("/v1/new-form?section-1-complete=false&section-2-complete=false&section-3-complete=false&section-4-complete=false&section-5-complete=false&section-6-complete=false&view=none&newform=false")       
    } else if (srtypesimple == "hardstop") {
        response.redirect("/v1/variations/hard-stop?equipment=true")  
    } else if (srtypesimple == "hardstop2") {
        response.redirect("/v1/variations/hard-stop?equipment=false")         
    } else {
        response.redirect("/v1/new-form?section-1-complete=false&section-2-complete=false&section-3-complete=false&section-4-complete=false&section-5-complete=false&section-6-complete=false&view=none&newform=false")
    }
})

registerPost('/sr-address-simple-OLD', function(request, response) {

    var sraddress = request.session.data['sr-address']
    if (sraddress == "No"){
        response.redirect("/v1/variation-simple/sr-question")     
    } else {
        response.redirect("/v1/variation-simple/bail")
    }
})

registerPost('/bail', function(request, response) {

    var bailorder = request.session.data['bail-order']
    if (bailorder == "No"){
        response.redirect("/v1/variation-simple/hard-stop") 
    } else {
        response.redirect("/v1/variation-simple/identity-numbers")
    }
})

registerPost('/bail-simple', function(request, response) {

    var bailorder = request.session.data['bail-order']
    if (bailorder == "Yes"){
        response.redirect("/v1/variation-simple/court") 
    } else {
        response.redirect("/v1/variation-simple/identity-numbers")
    }
})

registerPost('/type-change-areyousure', function(request, response) {

    var clarification = request.session.data['clarification']
    var usertype = request.session.data['usertype']
    if (usertype == "Probation user"){
        response.redirect("/v1/variations/sr-question?view=false") 
    } else if (usertype == "Home Office user"){
        response.redirect("/v1/variations/sr-question?view=false")     
     } else {
        response.redirect("/v1/org-details-change?sr-address=false&view=false&section-1-complete=false&section-2-complete=false&section-3-complete=false&section-4-complete=false&section-5-complete=false&section-6-complete=false") 
    }
})




registerPost('/type-change', function(request, response) {

    var clarification = request.session.data['clarification']
    if (clarification == "false"){
        response.redirect("/v1/org-details-change?sr-address=false&view=false&section-1-complete=false&section-2-complete=false&section-3-complete=false&section-4-complete=false&section-5-complete=false&section-6-complete=false&sr-type=I have changed something else in the form&view=false") 
    } else {
        response.redirect("/v1/org-details-change?sr-address=false&view=false&section-1-complete=false&section-2-complete=false&section-3-complete=false&section-4-complete=false&section-5-complete=false&section-6-complete=false")
    }
})

registerPost('/document-question', function(request, response) {

    var licencequestion = request.session.data['licencequestion']
    if (licencequestion == "Yes"){
        response.redirect("/v1/variation-simple/document")  
    } else {
        response.redirect("/v1/variation-simple/check-answers")
    }
})

registerPost('/identity-numbers', function(request, response) {

    var usertype = request.session.data['usertype']
    if (usertype == "Home Office user"){
        response.redirect("/v1/variation-simple/personal-details")      
    } else {
        response.redirect("/v1/variation-simple/personal-details")
    }
})

registerPost('/identity-numbers-lookup', function(request, response) {

    var usertype = request.session.data['usertype']
    if (usertype == "Home Office user"){
        response.redirect("/v1/device-wearer/personal-details")  
    } else if (usertype == "Court user") {
        response.redirect("/v1/device-wearer/personal-details") 
    } else if (usertype == "Court user") {
        response.redirect("/v1/device-wearer/personal-details")             
    } else {
        response.redirect("/v1/device-wearer/device-wearer-confirm")
    }
})


registerPost('/language', function(request, response) {

    var notifyingorg = request.session.data['notifying-org']
    var usertype = request.session.data['usertype']
    if (notifyingorg == "Family Court"){
        response.redirect("/v1/installation/check-answers")  
    } else if (notifyingorg == "Civil and County Court") {
        response.redirect("/v1/installation/check-answers")
     } else if (usertype == "Home Office user") {
        response.redirect("/v1/installation/mappa")         
    } else {
        response.redirect("/v1/installation/risk")
    }
})

registerPost('/curfew-dates', function(request, response) {

    var usertype = request.session.data['usertype']
    if (usertype == "Prison user"){
        response.redirect("/v1/monitoring-conditions/curfew-3")  
    } else if (usertype == "Youth user") {
        response.redirect("/v1/monitoring-conditions/curfew-3")        
    } else {
        response.redirect("/v1/monitoring-conditions/curfew-3-question")
    }
})

registerPost('/order-aq', function(request, response) {

    var orderaq = request.session.data['order-aq']
    if (orderaq == "They did not commit one of these offences"){
        response.redirect("/v1/otd-old/hard-stop")     
    } else {
        response.redirect("/v1/otd-old/order-aq-region")
    }
})

registerPost('/order-aq-region', function(request, response) {

    var regioneligibility = request.session.data['region-eligibility']
    if (regioneligibility == "The device wearer's release address is in a different police force area"){
        response.redirect("/v1/otd-old/hard-stop")     
    } else {
        response.redirect("/v1/otd-old/order-prrar")
    }
})


registerPost('/org-details', function(request, response) {

    var notifyingorg = request.session.data['notifying-org']
    var usertype = request.session.data['usertype']
    if (notifyingorg == "Prison service"){
        response.redirect("/v1/organisation/responsible-officer") 
    } else if (notifyingorg == "Probation service") {
        response.redirect("/v1/organisation/responsible-officer")  
    } else if (notifyingorg == "Youth Custody Service (YCS)") {
        response.redirect("/v1/organisation/responsible-officer")  
     } else if (notifyingorg == "Home Office") {
        response.redirect("/v1/organisation/org-contact")   
    } else if (notifyingorg == "") {
        response.redirect("/v1/organisation/responsible-officer")  
    } else if (usertype == "Prison user") {
        response.redirect("/v1/organisation/responsible-officer")   
    } else if (usertype == "Probation user") {
        response.redirect("/v1/organisation/responsible-officer")     
    } else if (usertype == "Home Office user") {
        response.redirect("/v1/organisation/org-contact") 
    } else if (usertype == "Youth user") {
        response.redirect("/v1/organisation/responsible-officer")                                  
    } else {
        response.redirect("/v1/organisation/org-contact")
    }
})


registerPost('/risk-list', function(request, response) {

    var offencelistquestion = request.session.data['offencelistquestion']
    if (offencelistquestion == "Yes"){
        response.redirect("/v1/installation/risk-civil")     
    } else {
        response.redirect("/v1/installation/check-answers")
    }
})

registerPost('/risk-1', function(request, response) {

    var offence = request.session.data['offence']
    if (offence == "Terrorism offence"){
        response.redirect("/v1/installation/hard-stop?sectionid=Access needs and installation risk")     
    } else {
        response.redirect("/v1/installation/risk-1")
    }
})

registerPost('/risk-civil', function(request, response) {

    var offence = request.session.data['offence']
    if (offence == "Terrorism offence"){
        response.redirect("/v1/installation/hard-stop?sectionid=Access needs and installation risk")     
    } else {
        response.redirect("/v1/installation/risk-list")
    }
})

registerPost('/risk-listdapo', function(request, response) {

    var dapoquestion = request.session.data['dapoquestion']
    if (dapoquestion == "Yes"){
        response.redirect("/v1/installation/risk-dapo")     
    } else {
        response.redirect("/v1/installation/check-answers")
    }
})

registerPost('/hard-stop', function(request, response) {

    var srtype = request.session.data['sr-type']
    if (srtype == "hardstop"){
        response.redirect("/v1/variations/hard-stop?equipment=true")     
     } else if (srtype == "hardstop2") {
        response.redirect("/v1/variations/hard-stop?equipment=false") 
   
    } else {
        response.redirect("/v1/org-details-change?view=false&section-1-complete=false&section-2-complete=false&section-3-complete=false&section-4-complete=false&section-5-complete=false&section-6-complete=false")
    }
})

registerPost('/sr-address', function(request, response) {

    var sraddress = request.session.data['sr-address']
    if (sraddress == "Yes"){
        response.redirect("/v1/org-details-change?view=false&section-1-complete=false&section-2-complete=false&section-3-complete=false&section-4-complete=false&section-5-complete=false&section-6-complete=false&sr-type=I need monitoring equipment reinstalled or checked")     
    } else {
        response.redirect("/v1/variations/sr-question3?sr-address=No")
    }
})





registerPost('/check-document', function(request, response) {

    var checkdocument = request.session.data['checkdocument']
    if (checkdocument == "Yes"){
        response.redirect("/v1/attachments/licence")     
    } else {
        response.redirect("/v1/attachments/check-answers-view")
    }
})

registerPost('/checkrisk', function(request, response) {

    var checkrisk = request.session.data['checkrisk']
    if (checkrisk == "Yes"){
        response.redirect("/v1/installation/risk-2?risk=Violent behaviour or threats of violence&risk-question=No&risk2=There are no risks that the installer should be aware of")     
    } else {
        response.redirect("/v1/installation/check-answers-view")
    }
})


registerPost('/checkconditions', function(request, response) {

    var checkconditions = request.session.data['checkconditions']
    if (checkconditions == "Yes"){
        response.redirect("/v1/monitoring-conditions/monitoring-needed?cvl=yes&cvl-incomplete=yes")     
    } else {
        response.redirect("/v1/monitoring-conditions/check-answers-view?cvl=no&cvl-incomplete=no")
    }
})


registerPost('/user-type-cohort', function(request, response) {

    var usertype = request.session.data['usertype']
    if (usertype == "Prison user"){
        response.redirect("start?notifying-org=Prison service&order-type=Post release")  
    } else if (usertype == "Probation user") {
        response.redirect("start?notifying-org=Probation service&order-type=Post release") 
    } else if (usertype == "Youth user") {
        response.redirect("start?notifying-org=Youth Custody Service (YCS)&order-type=Post release")  
    } else if (usertype == "Court user") {
        response.redirect("start?notifying-org=Family Court&order-type=Civil&hdc=clear")     
    } else if (usertype == "Home Office user") {
        response.redirect("start?notifying-org=Home Office&order-type=Immigration&hdc=clear")  
     } else {
        response.redirect("start?notifying-org=&order-type=&hdc=clear")
    }                        
})

registerPost('/user-type', function(request, response) {

    var usertype = request.session.data['usertype']
    if (usertype == "Prison user"){
        response.redirect("isr?order-type=Post release")  
    } else if (usertype == "Probation user") {
        response.redirect("isr?order-type=Post release") 
    } else if (usertype == "Youth user") {
        response.redirect("start?order-type=Post release")  
    } else if (usertype == "Family court user") {
        response.redirect("start?order-type=Civil&hdc=clear&usertype=Court user&notifying-org=Family Court")  
    } else if (usertype == "Civil court user") {
        response.redirect("start?order-type=Civil&hdc=clear&usertype=Court user&notifying-org=Civil and County Court")        
    } else if (usertype == "Home Office user") {
        response.redirect("start?order-type=Immigration&hdc=clear")  
     } else {
        response.redirect("start?notifying-org=&order-type=&hdc=clear")
    }                        
})












// const radioButtonRedirect = require('radio-button-redirect')
// router.use(radioButtonRedirect)

// Add your routes here
// Search routes

// END 