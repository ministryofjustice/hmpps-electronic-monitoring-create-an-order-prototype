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
    if (addressquestion == "Yes"){
        response.redirect("/v1/device-wearer/contact-address")
    } else {
        response.redirect("/v1/device-wearer/check-answers")
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
    } else if (appointmentquestion == "At another address"){
        response.redirect("/v1/monitoring-conditions/install-address") 
    } else if (monitoringtype == "Trail monitoring (Home Office)"){
        response.redirect("/v1/monitoring-conditions/trail")                 
    } else {
        response.redirect("/v1/monitoring-conditions/alcohol")
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
        response.redirect("/v1/monitoring-conditions/alcohol")
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
        response.redirect("/v1/monitoring-conditions/appointment-question")    
    } else if (monitoringtype == "Mandatory attendance monitoring"){
        response.redirect("/v1/monitoring-conditions/attendance")      
    } else {
        response.redirect("/v1/monitoring-conditions/appointment-question")
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
        response.redirect("/v1/monitoring-conditions/alcohol")
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
        response.redirect("/v1/monitoring-conditions/appointment-question")  
    } else if (monitoringtype2 == "Mandatory attendance monitoring"){
        response.redirect("/v1/monitoring-conditions/attendance")      
    } else {
        response.redirect("/v1/monitoring-conditions/appointment-question")
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
        response.redirect("/v1/monitoring-conditions/alcohol")
    }
})


router.post('/curfew-address-question', function(request, response) {

    var curfewaddressquestion = request.session.data['curfewaddressquestion']
    if (curfewaddressquestion == "Yes"){
        response.redirect("/v1/monitoring-conditions/curfew-address")
    } else {
        response.redirect("/v1/monitoring-conditions/curfew-boundary")
    }
})

router.post('/curfew-times-question', function(request, response) {

    var curfewtimesquestion = request.session.data['curfewtimesquestion']
    if (curfewtimesquestion == "Yes"){
        response.redirect("/v1/monitoring-conditions/curfew-4?curfewtimetableday=false&curfewstandard=true&curfewchange-starttime-hours=19&curfewchange-starttime-minutes=00&curfewchange-endtime-hours=07&curfewchange-endtime-minutes=00")
    } else {
        response.redirect("/v1/monitoring-conditions/curfew-change?curfewstandard=false&curfewtimetableday=false")
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
    if (monitoringtypesquestion == "Yes"){
        response.redirect("/v1/monitoring-conditions/monitoring-details2")
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
        response.redirect("/v1/monitoring-conditions/order-pilots")
    } else if (ordertype == "Post release"){
        response.redirect("/v1/monitoring-conditions/order-sentence") 
    } else if (ordertype == "Community"){
        response.redirect("/v1/monitoring-conditions/order-sentence") 
    } else if (ordertype == "Special"){
        response.redirect("/v1/mvp/order-conditions") 
    } else if (ordertype == "Pre trial"){
        response.redirect("/v1/monitoring-conditions/order-sentence")          
    } else {
        response.redirect("/v1/monitoring-conditions/monitoring-dates")
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
    if (ordertype == "Post release"){
        response.redirect("/v1/monitoring-conditions/order-conditions")
    } else {
        response.redirect("/v1/monitoring-conditions/monitoring-dates")
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

    if (ordertype != "Post release"){
        response.redirect("/v1/monitoring-conditions/order-issp") 
    } else if (ordersentence == "Standard Determinate Sentence") {
        response.redirect("/v1/monitoring-conditions/order-pilots")
    } else {
        response.redirect("/v1/monitoring-conditions/order-conditions")
    }
})

router.post('/order-description', function(request, response) {

    var ordertype = request.session.data['order-type']
    if (ordertype == "Post release"){
        response.redirect("/v1/otd/hdc") 
    } else {
        response.redirect("/v1/otd/order-description")
    }
})

router.post('/hdc', function(request, response) {

    var hdc = request.session.data['hdc']
    if (hdc == "No"){
        response.redirect("/v1/otd/sentence-type") 
    } else {
        response.redirect("/v1/otd/order-description")
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





// const radioButtonRedirect = require('radio-button-redirect')
// router.use(radioButtonRedirect)

// Add your routes here
// Search routes

// END 