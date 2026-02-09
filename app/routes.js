//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//



const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

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
        response.redirect("/v1/device-wearer/responsible-adult")
    } else {
        response.redirect("/v1/device-wearer/device-wearer-contact")
    }
})

router.post('/contact-address', function(request, response) {

    var addressquestion = request.session.data['addressquestion']
    var variationsimple = request.session.data['variation-simple']
    if (addressquestion == "Yes"){
        response.redirect("/v1/postcode-lookup/postcode")
    } else if (variationsimple == "true"){
        response.redirect("/v1/variation-simple/offence")      
    } else {
        response.redirect("/v1/device-wearer/check-answers")
    }
})

router.post('/postcode', function(request, response) {

    var sectionid = request.session.data['sectionid']
    var postcodetype = request.session.data['postcodetype']
    if (sectionid == "About the device wearer"){
        response.redirect("/v1/device-wearer/check-answers")
    } else if (postcodetype == "appointment"){
        response.redirect("/v1/monitoring-conditions/monitoring-needed")       
    } else if (postcodetype == "curfew"){
        response.redirect("/v1/postcode-lookup/address-name")    
    } else if (postcodetype == "installation"){
        response.redirect("/v1/monitoring-conditions/alcohol")            
    } else {
        response.redirect("/v1/variation-simple/offence")
    }
})

router.post('/disability', function(request, response) {

    var disability = request.session.data['disability']
    if (disability == "The device wearer does not have any of the disabilities or health conditions listed"){
        response.redirect("/v1/installation/language")
    } else if (disability == "Not able to provide this information"){
        response.redirect("/v1/installation/language")    
    } else {
        response.redirect("/v1/installation/disability-needs")
    }
})

router.post('/risk', function(request, response) {

    var risk = request.session.data['risk']
    var notifyingorg = request.session.data['notifying-org']

    if (notifyingorg == "Home Office") {
        response.redirect("/v1/installation/mappa")  
    } else {
        response.redirect("/v1/installation/check-answers")
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
    
    if (addressquestion == "No"){
        response.redirect("/v1/monitoring-conditions/install-address")   
    } else {
        response.redirect("/v1/monitoring-conditions/install-address-question")
    }
})

router.post('/install-address-question2', function(request, response) {


    var installaddressquestion = request.session.data['installaddressquestion']
    
    if (installaddressquestion == "No"){
        response.redirect("/v1/monitoring-conditions/install-address")   
    } else {
        response.redirect("/v1/monitoring-conditions/appointment-question")
    }
})

router.post('/installation-address', function(request, response) {


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

router.post('/installation-address2', function(request, response) {


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

router.post('/appointment-addressold', function(request, response) {


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

router.post('/appointment-address', function(request, response) {
    var appointmentquestion = request.session.data['appointmentquestion']
    var monitoringtype = request.session.data['monitoringtype']
   
    
    if (appointmentquestion == "At a prison"){
        response.redirect("/v1/monitoring-conditions/appointment-details")  
    } else if (appointmentquestion == "At a probation office"){
        response.redirect("/v1/monitoring-conditions/appointment-details") 
    } else if (appointmentquestion == "At an immigration removal centre"){
        response.redirect("/v1/monitoring-conditions/appointment-details")     
    } else if (appointmentquestion == "At another address"){
        response.redirect("/v1/postcode-lookup/postcode") 
    } else if (monitoringtype == "Trail monitoring (Home Office)"){
        response.redirect("/v1/monitoring-conditions/trail")                 
    } else {
        response.redirect("/v1/monitoring-conditions/check-answers")
    }
})

router.post('/appointment-address2', function(request, response) {
    var appointmentquestion = request.session.data['appointmentquestion']
    var monitoringtype2 = request.session.data['monitoringtype2']
   
    
    if (appointmentquestion == "At a prison"){
        response.redirect("/v1/monitoring-conditions/appointment-details")  
    } else if (appointmentquestion == "At a probation office"){
        response.redirect("/v1/monitoring-conditions/appointment-details") 
    } else if (appointmentquestion == "At another address"){
        response.redirect("/v1/monitoring-conditions/install-address") 
    } else if (monitoringtype2 == "Trail monitoring (Home Office)"){
        response.redirect("/v1/monitoring-conditions/trail")                 
    } else {
        response.redirect("/v1/monitoring-conditions/check-answers")
    }
})


router.post('/appointment-address2old', function(request, response) {


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



router.post('/monitoring-questionold', function(request, response) {

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

router.post('/monitoring-question', function(request, response) {

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

router.post('/monitoring-question2old', function(request, response) {

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

router.post('/monitoring-question2', function(request, response) {

    var monitoringtype2 = request.session.data['monitoringtype2']

    
    if (monitoringtype2 == "Curfew"){
        response.redirect("/v1/monitoring-conditions/curfew")     
    } else {
        response.redirect("/v1/monitoring-conditions/appointment-question")
    }
})

router.post('/monitoring-type', function(request, response) {

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
        response.redirect("/v1/monitoring-conditions/alcohol")
    }
})

router.post('/install-type', function(request, response) {

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

router.post('/monitoring-type2', function(request, response) {

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
        response.redirect("/v1/monitoring-conditions/alcohol")
    }
})

router.post('/install-type2', function(request, response) {

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


router.post('/curfew-address-question', function(request, response) {

    var curfewaddressquestion = request.session.data['curfewaddressquestion']
    if (curfewaddressquestion == "Yes"){
        response.redirect("/v1/postcode-lookup/postcode")
    } else {
        response.redirect("/v1/monitoring-conditions/curfew-1")
    }
})

router.post('/curfew-change', function(request, response) {

    var curfewperiods = request.session.data['curfewperiods']
    if (curfewperiods == "one"){
        response.redirect("/v1/monitoring-conditions/curfew-4")
    } else {
        response.redirect("/v1/monitoring-conditions/curfew-change2")
    }
})

router.post('/curfew-times-question', function(request, response) {

    var curfewtimesquestion = request.session.data['curfewtimesquestion']
    if (curfewtimesquestion == "Yes"){
        response.redirect("/v1/monitoring-conditions/curfew-4?curfewtimetableday=false&curfewstandard=true&curfewchange-starttime-hours=19&curfewchange-starttime-minutes=00&curfewchange-endtime-hours=07&curfewchange-endtime-minutes=00&curfewperiods=one")
    } else {
        response.redirect("/v1/monitoring-conditions/curfew-period?curfewstandard=false&curfewtimetableday=false")
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

router.post('/inclusion-question', function(request, response) {

    var exclusionquestion = request.session.data['exclusionquestion']
    if (exclusionquestion == "Yes"){
        response.redirect("/v1/monitoring-conditions/inclusion-4")
    } else {
        response.redirect("/v1/monitoring-conditions/monitoring-needed")
    }
})




router.post('/monitoring-list', function(request, response) {

    var monitoringtypesquestion = request.session.data['monitoringtypesquestion']
    var monitoringtype = request.session.data['monitoringtype']
    var monitoringtype2 = request.session.data['monitoringtype2']
    if (monitoringtypesquestion == "Yes"){
        response.redirect("/v1/monitoring-conditions/monitoring-details2")

    } else if (monitoringtype == "Alcohol monitoring"){
        response.redirect("/v1/monitoring-conditions/appointment-question") 
    } else if (monitoringtype2 == "Alcohol monitoring"){
        response.redirect("/v1/monitoring-conditions/appointment-question") 
    } else if (monitoringtype == "Trail monitoring (Home Office)"){
        response.redirect("/v1/monitoring-conditions/appointment-question") 
    } else if (monitoringtype2 == "Trail monitoring (Home Office)"){
        response.redirect("/v1/monitoring-conditions/appointment-question")            
    } else {
        response.redirect("/v1/monitoring-conditions/check-answers")
    }
})

router.post('/monitoring-list-edit', function(request, response) {

    var monitoringtypesquestion = request.session.data['monitoringtypesquestion']
    if (monitoringtypesquestion == "Yes"){
        response.redirect("/v1/monitoring-conditions/monitoring-details2")
    } else {
        response.redirect("/v1/monitoring-conditions/check-answers-view")
    }
})

router.post('/ho-question', function(request, response) {

    var notifyingorg = request.session.data['notifying-org']
    if (notifyingorg == "Home Office"){
        response.redirect("/v1/attachments/licence-question?cya5=false")
    } else {
        response.redirect("/v1/attachments/licence?cya5=false")
    }
})



router.post('/licence-question', function(request, response) {
    var notifyingorg = request.session.data['notifying-org']
    var licencequestion = request.session.data['licencequestion']
    if (licencequestion == "Yes"){
        response.redirect("/v1/attachments/licence-ho")  
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

router.post('/equipmentaddressquestion', function(request, response) {

    var equipmentaddressquestion = request.session.data['equipmentaddressquestion']
    if (equipmentaddressquestion == "No"){
        response.redirect("/v1/variations/edit-form-delete-addaddress")
    } else {
        response.redirect("/v1/variations/edit-form-delete-question")
    }
})

router.post('/region', function(request, response) {

    var officerorg = request.session.data['officer-org']
    if (officerorg == "Probation service"){
        response.redirect("/v1/organisation/region")
    } else if (officerorg == "Youth Justice Service (YJS)"){
        response.redirect("/v1/organisation/region")
    } else if (officerorg == "Youth Custody Service (YCS)"){
        response.redirect("/v1/organisation/region")           
    } else {
        response.redirect("/v1/organisation/check-answers")
    }
})

router.post('/order-type', function(request, response) {

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

router.post('/order-type2', function(request, response) {

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




router.post('/pilots', function(request, response) {

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

router.post('/pilots-probation', function(request, response) {

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

router.post('/order-region', function(request, response) {

    var orderdescription = request.session.data['order-description']
    if (orderdescription == "GPS acquisitive crime"){
        response.redirect("/v1/otd-old/order-aq") 
    } else {
        response.redirect("/v1/otd-old/order-prrar")
    }
})

router.post('/order-conditions', function(request, response) {

    var ordercondition = request.session.data['order-condition']
    if (ordercondition == "Yes"){
        response.redirect("/v1/monitoring-conditions/order-conditions2") 
    } else {
        response.redirect("/v1/monitoring-conditions/order-prrar")
    }
})

router.post('/order-sentence', function(request, response) {

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

router.post('/order-hdc', function(request, response) {

  
    var ordersentence = request.session.data['order-sentence']
    if (ordersentence == "Section 250 / Section 91"){
        response.redirect("/v1/otd-old/order-prrar") 
    } else {
        response.redirect("/v1/otd-old/order-pilots")
    }
})

router.post('/order-issp', function(request, response) {

  
    var ordersentence = request.session.data['order-sentence']
    if (ordersentence == "Detention and Training Order (DTO)"){
        response.redirect("/v1/otd-old/order-prrar") 
    } else {
        response.redirect("/v1/monitoring-conditions/monitoring-details")
    }
})

router.post('/order-information', function(request, response) {

    var ordertype = request.session.data['order-type']
    if (ordertype == "Release from prison"){
        response.redirect("/v1/monitoring-conditions/order-hdc") 
    } else {
        response.redirect("/v1/monitoring-conditions/order-description")
    }
})

router.post('/hdc', function(request, response) {

    var hdc = request.session.data['hdc']
    if (hdc == "No"){
        response.redirect("/v1/monitoring-conditions/order-sentence-type") 
    } else {
        response.redirect("/v1/monitoring-conditions/order-description")
    }
})

router.post('/order-description', function(request, response) {

    var ordertype = request.session.data['order-type']
    if (ordertype == "Release from prison"){
        response.redirect("/v1/monitoring-conditions/order-prrar") 
    } else {
        response.redirect("/v1/monitoring-conditions/monitoring-details")
    }
})

router.post('/curfew-dates-question', function(request, response) {

    var curfewdatesquestion = request.session.data['curfewdatesquestion']
    if (curfewdatesquestion == "No"){
        response.redirect("/v1/monitoring-conditions/curfew-2") 
    } else {
        response.redirect("/v1/monitoring-conditions/curfew-3")
    }
})

router.post('/curfew-release-question', function(request, response) {

    var curfewreleasequestion = request.session.data['curfewreleasequestion']
    if (curfewreleasequestion == "No"){
        response.redirect("/v1/monitoring-conditions/curfew-3-enter") 
    } else {
        response.redirect("/v1/monitoring-conditions/curfew-3-question")
    }
})

router.post('/exclusion-dates-question', function(request, response) {

    var exclusiondatesquestion = request.session.data['exclusiondatesquestion']
    if (exclusiondatesquestion == "No"){
        response.redirect("/v1/monitoring-conditions/exclusion-1") 
    } else {
        response.redirect("/v1/monitoring-conditions/exclusion-2")
    }
})

router.post('/alcohol-dates-question', function(request, response) {

    var alcoholdatesquestion = request.session.data['alcoholdatesquestion']
    if (alcoholdatesquestion == "No"){
        response.redirect("/v1/monitoring-conditions/alcohol-1") 
    } else {
        response.redirect("/v1/monitoring-conditions/alcohol-2")
    }
})

router.post('/attendance-dates-question', function(request, response) {

    var attendancedatesquestion = request.session.data['attendancedatesquestion']
    if (attendancedatesquestion == "No"){
        response.redirect("/v1/monitoring-conditions/attendance-1") 
    } else {
        response.redirect("/v1/monitoring-conditions/attendance-2")
    }
})

router.post('/trail-dates-question', function(request, response) {

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


router.post('/pdu', function(request, response) {

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

router.post('/sr-question', function(request, response) {

    var srtypesimple = request.session.data['sr-type-simple']
    if (srtypesimple == "I have changed something else in the form"){
        response.redirect("/v1/new-form?section-1-complete=false&section-2-complete=false&section-3-complete=false&section-4-complete=false&section-5-complete=false&section-6-complete=false&view=none&newform=false")     
    } else if (srtypesimple == "I need to end all monitoring for the device wearer2") {
        response.redirect("/v1/variation-simple/bail") 
    } else {
        response.redirect("/v1/variation-simple/identity-numbers")
    }
})

router.post('/bail', function(request, response) {

    var bailorder = request.session.data['bail-order']
    if (bailorder == "No"){
        response.redirect("/v1/variation-simple/hard-stop") 
    } else {
        response.redirect("/v1/variation-simple/identity-numbers")
    }
})

router.post('/bail-simple', function(request, response) {

    var bailorder = request.session.data['bail-order']
    if (bailorder == "Yes"){
        response.redirect("/v1/variation-simple/identity-numbers") 
    } else {
        response.redirect("/v1/variation-simple/identity-numbers")
    }
})

router.post('/type-change-areyousure', function(request, response) {

    var clarification = request.session.data['clarification']
    var usertype = request.session.data['usertype']
    if (usertype == "Probation user"){
        response.redirect("/v1/variations/sr-question?view=false") 
    } else if (clarification == "true") {     
        response.redirect("/v1/submitted-form?view=false&section-1-complete=false&section-2-complete=false&section-3-complete=false&section-4-complete=false&section-5-complete=false&section-6-complete=false") 
    } else {
        response.redirect("/v1/variations/type-change?view=false") 
    }
})



router.post('/type-change', function(request, response) {

    var clarification = request.session.data['clarification']
    if (clarification == "false"){
        response.redirect("/v1/variations/sr-question?view=false") 
    } else {
        response.redirect("/v1/submitted-form?view=false&section-1-complete=false&section-2-complete=false&section-3-complete=false&section-4-complete=false&section-5-complete=false&section-6-complete=false")
    }
})

router.post('/document-question', function(request, response) {

    var licencequestion = request.session.data['licencequestion']
    if (licencequestion == "Yes"){
        response.redirect("/v1/variation-simple/document")  
    } else {
        response.redirect("/v1/variation-simple/check-answers")
    }
})

router.post('/identity-numbers', function(request, response) {

    var identitynumbers = request.session.data['identity-numbers']
    if (identitynumbers == "Magistrate Court Case Reference Number"){
        response.redirect("/v1/variation-simple/court")  
    } else if (identitynumbers == "Court Case Reference Number (CCRN)") {
        response.redirect("/v1/variation-simple/court")     
    } else {
        response.redirect("/v1/variation-simple/personal-details")
    }
})

router.post('/language', function(request, response) {

    var notifyingorg = request.session.data['notifying-org']
    if (notifyingorg == "Family Court"){
        response.redirect("/v1/installation/risk-dapo")  
    } else if (notifyingorg == "Civil and County Court") {
        response.redirect("/v1/installation/risk-civil")     
    } else {
        response.redirect("/v1/installation/risk")
    }
})

router.post('/order-aq', function(request, response) {

    var orderaq = request.session.data['order-aq']
    if (orderaq == "They did not commit one of these offences"){
        response.redirect("/v1/otd-old/hard-stop")     
    } else {
        response.redirect("/v1/otd-old/order-aq-region")
    }
})

router.post('/order-aq-region', function(request, response) {

    var regioneligibility = request.session.data['region-eligibility']
    if (regioneligibility == "The device wearer's release address is in a different police force area"){
        response.redirect("/v1/otd-old/hard-stop")     
    } else {
        response.redirect("/v1/otd-old/order-prrar")
    }
})


router.post('/org-details', function(request, response) {

    var notifyingorg = request.session.data['notifying-org']
    if (notifyingorg == "Prison service"){
        response.redirect("/v1/organisation/responsible-officer") 
    } else if (notifyingorg == "Probation service") {
        response.redirect("/v1/organisation/responsible-officer")  
    } else if (notifyingorg == "Youth Custody Service (YCS)") {
        response.redirect("/v1/organisation/responsible-officer")                  
    } else {
        response.redirect("/v1/organisation/org-contact")
    }
})


router.post('/risk-list', function(request, response) {

    var offencelistquestion = request.session.data['offencelistquestion']
    if (offencelistquestion == "Yes"){
        response.redirect("/v1/installation/risk-civil")     
    } else {
        response.redirect("/v1/installation/risk-1")
    }
})

router.post('/risk-listdapo', function(request, response) {

    var dapoquestion = request.session.data['dapoquestion']
    if (dapoquestion == "Yes"){
        response.redirect("/v1/installation/risk-dapo")     
    } else {
        response.redirect("/v1/installation/risk-2")
    }
})

router.post('/hard-stop', function(request, response) {

    var srtype = request.session.data['sr-type']
    if (srtype == "I need to end all monitoring for the device wearer2"){
        response.redirect("/v1/variations/hard-stop")     
    } else {
        response.redirect("/v1/submitted-form?view=false&section-1-complete=false&section-2-complete=false&section-3-complete=false&section-4-complete=false&section-5-complete=false&section-6-complete=false")
    }
})

router.post('/check-document', function(request, response) {

    var checkdocument = request.session.data['checkdocument']
    if (checkdocument == "Yes"){
        response.redirect("/v1/attachments/licence")     
    } else {
        response.redirect("/v1/attachments/check-answers-view")
    }
})


router.post('/user-type', function(request, response) {

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
    }
})











// const radioButtonRedirect = require('radio-button-redirect')
// router.use(radioButtonRedirect)

// Add your routes here
// Search routes

// END 