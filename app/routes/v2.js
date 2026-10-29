function redirectToCurfewPage(response, page, query = '') {
    response.redirect(`/v2/monitoring-conditions/${page}${query}`)
}

module.exports = () => {
    const router = require('govuk-prototype-kit').requests.setupRouter('/v2')
  router.get('/', (request, response) => {
    response.redirect('/v2/dashboard')
  })

  const routeHandlers = new Map([
    /* POST forms: device-wearer/age.html, device-wearer/responsible-adult-question.html */
    ["/eighteen-answer", function(request, response) {

    if (request.session.data['under-18'] === "Yes"){
        response.redirect("/v2/device-wearer/responsible-adult")
    } else {
        response.redirect("/v2/device-wearer/device-wearer-contact")
    }
}],
    /* POST forms: device-wearer/contact-address-question.html, variation-simple/contact-address-question.html; GET links: submitted-form-all.html */
    ["/contact-address", function(request, response) {

    if (request.session.data['addressquestion'] === "Yes"){
        response.redirect("/v2/postcode-lookup/postcode")
    } else if (request.session.data['variation-simple'] === "true"){
        response.redirect("/v2/variation-simple/monitoring-dates")
    } else {
        response.redirect("/v2/device-wearer/check-answers")
    }
}],
    /* POST forms: monitoring-conditions/appointment-details.html, monitoring-conditions/attendance-2.html, postcode-lookup/postcode-confirm.html; GET links: device-wearer/check-answers-view.html, device-wearer/check-answers.html, monitoring-conditions/check-answers-error.html, monitoring-conditions/check-answers.html, monitoring-conditions/curfew-address.html, postcode-lookup/postcode-confirm.html, postcode-lookup/postcode-list.html, variation-simple/check-answers.html */
    ["/postcode", function(request, response) {

    var sectionid = request.session.data['sectionid']
    var sraddress = request.session.data['sr-address']
    var postcodetype = request.session.data['postcodetype']
    if (sectionid == " "){
        response.redirect("/v2/variation-simple/monitoring-dates")
     } else  if (sraddress == "Yes"){
        response.redirect("/v2/device-wearer/check-answers-view")
     } else  if (sectionid == "About the device wearer"){
        response.redirect("/v2/device-wearer/check-answers")
    } else if (postcodetype == "appointment"){
        response.redirect("/v2/monitoring-conditions/monitoring-needed")
    } else if (postcodetype == "curfew"){
        response.redirect("/v2/postcode-lookup/address-name")
    } else if (postcodetype == "installation"){
        response.redirect("/v2/monitoring-conditions/check-answers")
    } else {
        response.redirect("/v2/variation-simple/monitoring-dates")
    }
}],
    /* POST forms: installation/disability.html; GET links: installation/check-answers.html, submitted-form-all.html */
    ["/disability", function(request, response) {

    var disability = request.session.data['disability']
    if (disability == "The device wearer does not have any of the disabilities or health conditions listed"){
        response.redirect("/v2/installation/language")
    } else if (disability == "Not able to provide this information"){
        response.redirect("/v2/installation/language")
    } else {
        response.redirect("/v2/installation/language")
    }
}],
    /* GET links: installation/check-answers.html, submitted-form-all.html */
    ["/risk", function(request, response) {

    var risk = request.session.data['risk']
    var usertype = request.session.data['usertype']

    if (usertype == "Home Office user") {
        response.redirect("/v2/installation/mappa")
    } else {
        response.redirect("/v2/installation/check-answers")
    }
}],
    /* POST forms: installation/mappa.html; GET links: installation/check-answers.html, submitted-form-all.html */
    ["/mappa", function(request, response) {

    var mappaquestion = request.session.data['mappaquestion']
    if (mappaquestion == "Yes"){
        response.redirect("/v2/installation/mappa-2")
    } else {
        response.redirect("/v2/installation/check-answers")
    }
}],
    /* GET links: submitted-form-all.html */
    ["/install-address-question", function(request, response) {

    var addressquestion = request.session.data['addressquestion']

    if (addressquestion == "No"){
        response.redirect("/v2/monitoring-conditions/install-address")
    } else {
        response.redirect("/v2/monitoring-conditions/install-address-question")
    }
}],
    /* POST forms: monitoring-conditions/install-address-question.html */
    ["/installation-address", function(request, response) {

    var installaddressquestion = request.session.data['installaddressquestion']
    var monitoringtype = request.session.data['monitoringtype']

    if (installaddressquestion == "No"){
        response.redirect("/v2/monitoring-conditions/install-address")
    } else if (monitoringtype == "Exclusion zone monitoring"){
        response.redirect("/v2/monitoring-conditions/exclusion")
    } else if (monitoringtype == "Inclusion zone monitoring"){
        response.redirect("/v2/monitoring-conditions/inclusion")
    } else if (monitoringtype == "Trail monitoring"){
        response.redirect("/v2/monitoring-conditions/trail")
    } else if (monitoringtype == "Trail monitoring (Home Office)"){
        response.redirect("/v2/monitoring-conditions/trail")
    } else if (monitoringtype == "Mandatory attendance monitoring"){
        response.redirect("/v2/monitoring-conditions/attendance")
    } else {
        response.redirect("/v2/monitoring-conditions/alcohol")
    }
}],
    /* POST forms: monitoring-conditions/appointment-question.html */
    ["/appointment-address", function(request, response) {
    var appointmentquestion = request.session.data['appointmentquestion']
    var monitoringtype = request.session.data['monitoringtype']

    if (appointmentquestion == "At a prison"){
        response.redirect("/v2/monitoring-conditions/appointment-details")
    } else if (appointmentquestion == "At a probation office"){
        response.redirect("/v2/monitoring-conditions/appointment-details")
    } else if (appointmentquestion == "At an immigration removal centre"){
        response.redirect("/v2/monitoring-conditions/appointment-details")
    } else if (appointmentquestion == "At another address"){
        response.redirect("/v2/monitoring-conditions/appointment-details")
    } else if (appointmentquestion == "Installation has already taken place"){
        response.redirect("/v2/monitoring-conditions/check-answers")
    } else {
        response.redirect("/v2/monitoring-conditions/check-answers")
    }
}],
    /* POST forms: monitoring-conditions/appointment-question.html */
    ["/appointment-address-ho", function(request, response) {
    var appointmentquestion = request.session.data['appointmentquestion']
    var monitoringtype = request.session.data['monitoringtype']

     if (appointmentquestion == "Installation has already taken place"){
        response.redirect("/v2/monitoring-conditions/check-answers")
    } else {
        response.redirect("/v2/monitoring-conditions/appointment-details")
    }
}],
    /* POST forms: monitoring-conditions/monitoring-details.html */
    ["/monitoring-type", function(request, response) {

    var monitoringtype = request.session.data['monitoringtype']

    if (monitoringtype == "Curfew"){
        redirectToCurfewPage(response, 'curfew-dates')
    } else if (monitoringtype == "Exclusion zone monitoring"){
        response.redirect("/v2/monitoring-conditions/exclusion")
    } else if (monitoringtype == "Restriction zone monitoring"){
        response.redirect("/v2/monitoring-conditions/inclusion")
    } else if (monitoringtype == "Trail monitoring"){
        response.redirect("/v2/monitoring-conditions/trail")
    } else if (monitoringtype == "Trail monitoring (Home Office)"){
        response.redirect("/v2/monitoring-conditions/trail")
    } else if (monitoringtype == "Mandatory attendance monitoring"){
        response.redirect("/v2/monitoring-conditions/attendance")
    } else {
        response.redirect("/v2/monitoring-conditions/alcohol")
    }
}],
    /* POST forms: monitoring-conditions/install-address.html */
    ["/install-type", function(request, response) {

    var monitoringtype = request.session.data['monitoringtype']

    if (monitoringtype == "Curfew"){
        redirectToCurfewPage(response, 'curfew-dates')
    } else if (monitoringtype == "Exclusion zone monitoring"){
        response.redirect("/v2/monitoring-conditions/exclusion")
    } else if (monitoringtype == "Inclusion zone monitoring"){
        response.redirect("/v2/monitoring-conditions/inclusion")
    } else if (monitoringtype == "Trail monitoring"){
        response.redirect("/v2/monitoring-conditions/trail")
    } else if (monitoringtype == "Trail monitoring (Home Office)"){
        response.redirect("/v2/monitoring-conditions/trail")
    } else if (monitoringtype == "Mandatory attendance monitoring"){
        response.redirect("/v2/monitoring-conditions/attendance")
    } else {
        response.redirect("/v2/monitoring-conditions/check-answers")
    }
}],
    /* POST forms: monitoring-conditions/monitoring-details2.html */
    ["/monitoring-type2", function(request, response) {

    var monitoringtype2 = request.session.data['monitoringtype2']

    if (monitoringtype2 == "Curfew"){
        redirectToCurfewPage(response, 'curfew-dates')
    } else if (monitoringtype2 == "Exclusion zone monitoring"){
        response.redirect("/v2/monitoring-conditions/exclusion")
    } else if (monitoringtype2 == "Restriction zone monitoring"){
        response.redirect("/v2/monitoring-conditions/inclusion")
    } else if (monitoringtype2 == "Trail monitoring"){
        response.redirect("/v2/monitoring-conditions/trail")
    } else if (monitoringtype2 == "Trail monitoring (Home Office)"){
        response.redirect("/v2/monitoring-conditions/trail")
    } else if (monitoringtype2 == "Mandatory attendance monitoring"){
        response.redirect("/v2/monitoring-conditions/attendance")
    } else {
        response.redirect("/v2/monitoring-conditions/alcohol")
    }
}],
    /* POST forms: monitoring-conditions/install-address.html */
    ["/install-type2", function(request, response) {

    var monitoringtype2 = request.session.data['monitoringtype2']

    if (monitoringtype2 == "Curfew"){
        redirectToCurfewPage(response, 'curfew-dates')
    } else if (monitoringtype2 == "Exclusion zone monitoring"){
        response.redirect("/v2/monitoring-conditions/exclusion")
    } else if (monitoringtype2 == "Inclusion zone monitoring"){
        response.redirect("/v2/monitoring-conditions/inclusion")
    } else if (monitoringtype2 == "Trail monitoring"){
        response.redirect("/v2/monitoring-conditions/trail")
    } else if (monitoringtype2 == "Trail monitoring (Home Office)"){
        response.redirect("/v2/monitoring-conditions/trail")
    } else if (monitoringtype2 == "Mandatory attendance monitoring"){
        response.redirect("/v2/monitoring-conditions/attendance")
    } else {
        response.redirect("/v2/monitoring-conditions/check-answers")
    }
}],
    /* POST forms: monitoring-conditions/curfew-address.html */
    ["/curfew-address-question", function(request, response) {

    var curfewaddressquestion = request.session.data['curfewaddressquestion']
    var view = request.session.data['view']
    var usertype = request.session.data['usertype']
    if (curfewaddressquestion == "Yes"){
        response.redirect("/v2/postcode-lookup/postcode")
    } else if (view == "false"){
        response.redirect("/v2/monitoring-conditions/check-answers-view")
    } else if (usertype == "Prison user" || usertype == "Youth user") {
        redirectToCurfewPage(response, 'curfew-first-night')
    } else {
        redirectToCurfewPage(response, 'curfew-timetable-type')
    }
}],
    /* POST forms: monitoring-conditions/curfew-timetable-type.html */
    ["/curfew-times-question", function(request, response) {

    var curfewtimesquestion = request.session.data['curfewtimesquestion']
    if (curfewtimesquestion == "Yes"){
        redirectToCurfewPage(response, 'curfew-check-timetable', '?curfewtimetableday=false&curfewstandard=true&curfewchange-starttime-hours=19&CurfewStart-ampm=pm&curfewchange-starttime-minutes=00&curfewchange-endtime-hours=07&CurfewEnd-ampm=am&curfewperiods=one')
    } else {
        redirectToCurfewPage(response, 'curfew-timetable-periods', '?curfewstandard=false&curfewtimetableday=false')
    }
}],
    /* POST forms: monitoring-conditions/alcohol-2.html; GET links: monitoring-conditions/check-answers.html, submitted-form-all.html */
    ["/alcohol", function(request, response) {

    var alcoholaddress = request.session.data['alcoholaddress']
    if (alcoholaddress == "At another location or address"){
        response.redirect("/v2/monitoring-conditions/alcohol-address")
    } else {
        response.redirect("/v2/monitoring-conditions/monitoring-needed")
    }
}],
    /* POST forms: monitoring-conditions/exclusion-3.html */
    ["/exclusion-question", function(request, response) {

    var exclusionquestion = request.session.data['exclusionquestion']
    if (exclusionquestion == "Yes"){
        response.redirect("/v2/monitoring-conditions/exclusion-4")
    } else {
        response.redirect("/v2/monitoring-conditions/monitoring-needed")
    }
}],
    /* POST forms: attachments/map-question.html, attachments/photo.html */
    ["/map-question", function(request, response) {

    var mapquestion = request.session.data['mapquestion']
    if (mapquestion == "Yes"){
        response.redirect("/v2/attachments/map-upload")
    } else {
        response.redirect("/v2/attachments/check-answers")
    }
}],
    /* POST forms: attachments/map-list.html */
    ["/map-another", function(request, response) {

    var another = request.session.data['another']
    if (another == "yes"){
        response.redirect("/v2/attachments/map-upload")
    } else {
        response.redirect("/v2/attachments/check-answers")
    }
}],
    /* POST forms: monitoring-conditions/inclusion-3.html */
    ["/inclusion-question", function(request, response) {

    var exclusionquestion = request.session.data['exclusionquestion']
    if (exclusionquestion == "Yes"){
        response.redirect("/v2/monitoring-conditions/inclusion-4")
    } else {
        response.redirect("/v2/monitoring-conditions/monitoring-needed")
    }
}],
    /* POST forms: monitoring-conditions/monitoring-needed.html */
    ["/monitoring-list", function(request, response) {

    var monitoringtypesquestion = request.session.data['monitoringtypesquestion']
    var monitoringtype = request.session.data['monitoringtype']
    var usertype = request.session.data['usertype']
    var monitoringtype2 = request.session.data['monitoringtype2']
    var errorremoved = request.session.data['errorremoved']
    if (monitoringtypesquestion == "Yes"){
        response.redirect("/v2/monitoring-conditions/monitoring-details2")
    } else if (errorremoved == "Yes"){
        response.redirect("/v2/monitoring-conditions/check-answers")

    } else if (monitoringtype == "Alcohol monitoring"){
        response.redirect("/v2/monitoring-conditions/appointment-question")
    } else if (monitoringtype2 == "Alcohol monitoring"){
        response.redirect("/v2/monitoring-conditions/appointment-question")
    } else if (usertype == "Home Office user"){
        response.redirect("/v2/monitoring-conditions/appointment-question")
    } else {
        response.redirect("/v2/monitoring-conditions/check-answers")
    }
}],
    /* POST forms: monitoring-conditions/monitoring-needed.html */
    ["/monitoring-list-edit", function(request, response) {

    var monitoringtypesquestion = request.session.data['monitoringtypesquestion']
    var change = request.session.data['change']
    if (monitoringtypesquestion == "Yes"){
        response.redirect("/v2/monitoring-conditions/monitoring-details2")
    } else if (change == "true"){
        response.redirect("/v2/monitoring-conditions/check-answers-view")
    } else {
        response.redirect("/v2/monitoring-conditions/check-answers")
    }
}],
    /* POST forms: attachments/licence-question.html, attachments/licence.html */
    ["/licence-question", function(request, response) {
    var licencequestion = request.session.data['licencequestion']
    if (licencequestion == "Yes"){
        response.redirect("/v2/attachments/licence-ho")
    } else {
        response.redirect("/v2/attachments/photo-question")
    }
}],
    /* POST forms: attachments/licence-ho.html; GET links: attachments/check-answers.html, submitted-form-all.html */
    ["/photo-question", function(request, response) {

    var photoquestion = request.session.data['photoquestion']
    if (photoquestion == "Yes"){
        response.redirect("/v2/attachments/photo")
    } else {
        response.redirect("/v2/attachments/map-question")
    }
}],
    /* POST forms: attachments/photo-question.html */
    ["/photo-questionnomap", function(request, response) {

    var photoquestion = request.session.data['photoquestion']
    if (photoquestion == "Yes"){
        response.redirect("/v2/attachments/photo")
    } else {
        response.redirect("/v2/attachments/check-answers")
    }
}],
    /* POST forms: attachments/photo-question.html */
    ["/photo-question2", function(request, response) {

    var photoquestion = request.session.data['photoquestion']
    if (photoquestion == "Yes"){
        response.redirect("/v2/attachments/photo")
    } else {
        response.redirect("/v2/attachments/check-answers-view")
    }
}],
    /* POST forms: variations/edit-form-delete-addaddress.html */
    ["/equipmentaddressquestion", function(request, response) {

    var equipmentaddressquestion = request.session.data['equipmentaddressquestion']
    if (equipmentaddressquestion == "No"){
        response.redirect("/v2/variations/edit-form-delete-addaddress")
    } else {
        response.redirect("/v2/variations/edit-form-delete-question")
    }
}],
    /* POST forms: organisation/org-contact.html, organisation/police-force.html; GET links: organisation/check-answers-view-draft.html, organisation/check-answers-view.html, organisation/check-answers.html, submitted-form-all.html */
    ["/region", function(request, response) {

    var officerorg = request.session.data['officer-org']
    if (officerorg == "Probation service"){
        response.redirect("/v2/organisation/specialsquestion")
    } else if (officerorg == "Youth Justice Service (YJS)"){
        response.redirect("/v2/organisation/region")
    } else if (officerorg == "Youth Custody Service (YCS)"){
        response.redirect("/v2/organisation/region")
    } else {
        response.redirect("/v2/organisation/check-answers")
    }
}],
    /* POST forms: organisation/specialsquestion.html */
    ["/specialsquestion", function(request, response) {

    var specialsquestion = request.session.data['specialsquestion']
    if (specialsquestion == "Yes"){
        response.redirect("/v2/installation/hard-stop?sectionid=About the Notifying and Responsible Organisations")
    } else {
        response.redirect("/v2/organisation/region")
    }
}],
    /* POST forms: otd-old/order-information.html */
    ["/order-type", function(request, response) {

    var ordertype = request.session.data['order-type']
    if (ordertype == "Civil"){
        response.redirect("/v2/monitoring-conditions/monitoring-details")
    } else if (ordertype == "Post release"){
        response.redirect("/v2/otd-old/order-sentence")
    } else if (ordertype == "Community"){
        response.redirect("/v2/otd-old/order-sentence")
    } else if (ordertype == "Special"){
        response.redirect("/v2/mvp/order-conditions")
    } else if (ordertype == "Pre trial"){
        response.redirect("/v2/otd-old/order-sentence")
    } else {
        response.redirect("/v2/monitoring-conditions/monitoring-details")
    }
}],
    /* POST forms: mvp/end2.html, mvp/order-type2.html */
    ["/order-type2", function(request, response) {

    var ordertype = request.session.data['order-type']
    if (ordertype == "Civil"){
        response.redirect("/v2/mvp/civil")
    } else if (ordertype == "Post release"){
        response.redirect("/v2/mvp/postrelease")
    } else if (ordertype == "Community"){
        response.redirect("/v2/mvp/community")
    } else if (ordertype == "Special"){
        response.redirect("/v2/mvp/special")
    } else if (ordertype == "Pre trial"){
        response.redirect("/v2/mvp/pretrial")
    } else {
        response.redirect("/v2/mvp/end2")
    }
}],
    /* POST forms: otd-old/order-pilots.html */
    ["/pilots", function(request, response) {

    var ordertype = request.session.data['order-type']
    var orderdescription = request.session.data['order-description']
    var notifyingorg = request.session.data['order-description']
    if (orderdescription == "GPS acquisitive crime"){
        response.redirect("/v2/otd-old/order-aq")

  } else if (ordertype == "Post release") {
        response.redirect("/v2/otd-old/order-prrar")
   } else {
        response.redirect("/v2/monitoring-conditions/monitoring-details")
    }
}],
    /* POST forms: otd-old/order-pilots.html */
    ["/pilots-probation", function(request, response) {

    var ordertype = request.session.data['order-type']
    var orderdescription = request.session.data['order-description']
    var notifyingorg = request.session.data['order-description']
    if (orderdescription == "GPS acquisitive crime"){
        response.redirect("/v2/otd-old/order-aq")

  } else if (orderdescription == "Domestic Abuse Perpetrator on Licence (DAPOL)") {
    response.redirect("/v2/otd-old/order-dapol")

  } else if (ordertype == "Post release") {
        response.redirect("/v2/otd-old/order-prrar")
   } else {
        response.redirect("/v2/monitoring-conditions/monitoring-details")
    }
}],
    /* GET links: submitted-form-all.html */
    ["/order-conditions", function(request, response) {

    var ordercondition = request.session.data['order-condition']
    if (ordercondition == "Yes"){
        response.redirect("/v2/monitoring-conditions/order-conditions2")
    } else {
        response.redirect("/v2/monitoring-conditions/order-prrar")
    }
}],
    /* POST forms: otd-old/order-sentence.html; GET links: monitoring-conditions/check-answers-error.html, monitoring-conditions/check-answers.html */
    ["/order-sentence", function(request, response) {

    var ordertype = request.session.data['order-type']
    var ordersentence = request.session.data['order-sentence']

    if (ordertype == "Pre trial"){
        response.redirect("/v2/otd-old/order-issp")
    } else if (ordersentence == "Youth Rehabilitation Order (YRO)") {
        response.redirect("/v2/otd-old/order-issp")
    } else if (ordersentence == "Detention and Training Order (DTO)") {
        response.redirect("/v2/otd-old/order-issp")
    } else if (ordertype == "Community") {
        response.redirect("/v2/monitoring-conditions/monitoring-details")
    } else if (ordersentence == "Standard Determinate Sentence") {
        response.redirect("/v2/otd-old/order-hdc")
    } else {
        response.redirect("/v2/otd-old/order-prrar")
    }
}],
    /* POST forms: otd-old/order-hdc.html; GET links: monitoring-conditions/check-answers-error.html, monitoring-conditions/check-answers.html */
    ["/order-hdc", function(request, response) {


    var ordersentence = request.session.data['order-sentence']
    if (ordersentence == "Section 250 / Section 91"){
        response.redirect("/v2/otd-old/order-prrar")
    } else {
        response.redirect("/v2/otd-old/order-pilots")
    }
}],
    /* POST forms: otd-old/order-hdc.html */
    ["/order-hdc-isr", function(request, response) {


    var ordersentence = request.session.data['order-sentence']
    var hdc = request.session.data['hdc']
    if (ordersentence == "Section 250 / Section 91"){
        response.redirect("/v2/otd-old/order-prrar")
    } else if (hdc == "Yes") {
        response.redirect("/v2/otd-old/hdc-pause")
    } else {
        response.redirect("/v2/otd-old/order-pilots")
    }
}],
    /* POST forms: otd-old/order-issp.html; GET links: monitoring-conditions/check-answers-error.html, monitoring-conditions/check-answers.html, submitted-form-all.html */
    ["/order-issp", function(request, response) {


    var ordersentence = request.session.data['order-sentence']
    if (ordersentence == "Detention and Training Order (DTO)"){
        response.redirect("/v2/otd-old/order-prrar")
    } else {
        response.redirect("/v2/monitoring-conditions/monitoring-details")
    }
}],
    /* POST forms: monitoring-conditions/order-information.html; GET links: monitoring-conditions/check-answers-error.html, monitoring-conditions/check-answers.html, submitted-form-all.html */
    ["/order-information", function(request, response) {

    var ordertype = request.session.data['order-type']
    if (ordertype == "Release from prison"){
        response.redirect("/v2/monitoring-conditions/order-hdc")
    } else {
        response.redirect("/v2/monitoring-conditions/order-description")
    }
}],
    /* POST forms: monitoring-conditions/order-hdc.html */
    ["/hdc", function(request, response) {

    var hdc = request.session.data['hdc']
    if (hdc == "No"){
        response.redirect("/v2/monitoring-conditions/order-sentence-type")
    } else {
        response.redirect("/v2/monitoring-conditions/order-description")
    }
}],
    /* POST forms: monitoring-conditions/order-description.html, monitoring-conditions/order-sentence-type.html */
    ["/order-description", function(request, response) {

    var ordertype = request.session.data['order-type']
    if (ordertype == "Release from prison"){
        response.redirect("/v2/monitoring-conditions/order-prrar")
    } else {
        response.redirect("/v2/monitoring-conditions/monitoring-details")
    }
}],
    /* POST forms: monitoring-conditions/curfew-first-night.html */
    ["/curfew-release-question", function(request, response) {

    var curfewreleasequestion = request.session.data['curfewreleasequestion']
    if (curfewreleasequestion == "No"){
        redirectToCurfewPage(response, 'curfew-first-night-hours')
    } else {
        redirectToCurfewPage(response, 'curfew-timetable-type')
    }
}],
    /* POST forms: organisation/region2.html */
    ["/pdu", function(request, response) {

    var pdu = request.session.data['pdu']

    if (pdu == "Cheshire East"){
        response.redirect("/v2/organisation/region3")
    } else if (pdu == "Cheshire West") {
        response.redirect("/v2/organisation/region3")
    } else if (pdu == "Central Lancashire") {
        response.redirect("/v2/organisation/region3")
    } else if (pdu == "East Lancashire") {
        response.redirect("/v2/organisation/region3")
    } else if (pdu == "North West Lancashire") {
        response.redirect("/v2/organisation/region3")
    } else if (pdu == "Warrington and Halton") {
        response.redirect("/v2/organisation/region3")
    } else {
        response.redirect("/v2/organisation/check-answers")
    }
}],
    /* POST forms: variation-simple/sr-address.html */
    ["/sr-address-simple", function(request, response) {

    var sraddress = request.session.data['sr-address']
    if (sraddress == "No"){
        response.redirect("/v2/variation-simple/sr-question")
    } else {
        response.redirect("/v2/new-form?section-1-complete=false&section-2-complete=false&section-3-complete=false&section-4-complete=false&section-5-complete=false&section-6-complete=false&view=none&newform=false")
    }
}],
    /* POST forms: variation-simple/sr-question.html; GET links: variation-simple/check-answers.html */
    ["/sr-question", function(request, response) {

    var srtypesimple = request.session.data['sr-type-simple']
    if (srtypesimple == "I have changed something else in the form"){
        response.redirect("/v2/new-form?section-1-complete=false&section-2-complete=false&section-3-complete=false&section-4-complete=false&section-5-complete=false&section-6-complete=false&view=none&newform=false")
     } else if (srtypesimple == "I need monitoring equipment installed at a new address") {
        response.redirect("/v2/new-form?section-1-complete=false&section-2-complete=false&section-3-complete=false&section-4-complete=false&section-5-complete=false&section-6-complete=false&view=none&newform=false")
    } else if (srtypesimple == "hardstop") {
        response.redirect("/v2/variations/hard-stop?equipment=true")
    } else if (srtypesimple == "hardstop2") {
        response.redirect("/v2/variations/hard-stop?equipment=false")
    } else {
        response.redirect("/v2/new-form?section-1-complete=false&section-2-complete=false&section-3-complete=false&section-4-complete=false&section-5-complete=false&section-6-complete=false&view=none&newform=false")
    }
}],
    /* GET links: variation-simple/check-answers.html */
    ["/bail", function(request, response) {

    var bailorder = request.session.data['bail-order']
    if (bailorder == "No"){
        response.redirect("/v2/variation-simple/hard-stop")
    } else {
        response.redirect("/v2/variation-simple/identity-numbers")
    }
}],
    /* POST forms: variation-simple/bail.html */
    ["/bail-simple", function(request, response) {

    var bailorder = request.session.data['bail-order']
    if (bailorder == "Yes"){
        response.redirect("/v2/variation-simple/court")
    } else {
        response.redirect("/v2/variation-simple/identity-numbers")
    }
}],
    /* POST forms: variations/edit-form-variation.html */
    ["/type-change-areyousure", function(request, response) {

    var clarification = request.session.data['clarification']
    var usertype = request.session.data['usertype']
    if (usertype == "Probation user"){
        response.redirect("/v2/variations/sr-question?view=false")
    } else if (usertype == "Home Office user"){
        response.redirect("/v2/variations/sr-question?view=false")
     } else {
        response.redirect("/v2/org-details-change?sr-address=false&view=false&section-1-complete=false&section-2-complete=false&section-3-complete=false&section-4-complete=false&section-5-complete=false&section-6-complete=false")
    }
}],
    /* POST forms: variations/sr-question3.html */
    ["/type-change", function(request, response) {

    var clarification = request.session.data['clarification']
    if (clarification == "false"){
        response.redirect("/v2/org-details-change?sr-address=false&view=false&section-1-complete=false&section-2-complete=false&section-3-complete=false&section-4-complete=false&section-5-complete=false&section-6-complete=false&sr-type=I have changed something else in the form&view=false")
    } else {
        response.redirect("/v2/org-details-change?sr-address=false&view=false&section-1-complete=false&section-2-complete=false&section-3-complete=false&section-4-complete=false&section-5-complete=false&section-6-complete=false")
    }
}],
    /* POST forms: variation-simple/document-question.html, variation-simple/monitoring-dates.html, variation-simple/offence.html; GET links: variation-simple/check-answers.html */
    ["/document-question", function(request, response) {

    var licencequestion = request.session.data['licencequestion']
    if (licencequestion == "Yes"){
        response.redirect("/v2/variation-simple/document")
    } else {
        response.redirect("/v2/variation-simple/check-answers")
    }
}],
    /* POST forms: variation-simple/court.html, variation-simple/identity-numbers.html; GET links: device-wearer/check-answers.html, device-wearer/device-wearer-confirm.html, submitted-form-all.html, variation-simple/check-answers.html */
    ["/identity-numbers", function(request, response) {

    var usertype = request.session.data['usertype']
    if (usertype == "Home Office user"){
        response.redirect("/v2/variation-simple/personal-details")
    } else {
        response.redirect("/v2/variation-simple/personal-details")
    }
}],
    /* POST forms: device-wearer/identity-numbers.html */
    ["/identity-numbers-lookup", function(request, response) {

    var usertype = request.session.data['usertype']
    if (usertype == "Home Office user"){
        response.redirect("/v2/device-wearer/personal-details")
    } else if (usertype == "Court user") {
        response.redirect("/v2/device-wearer/personal-details")
    } else if (usertype == "Court user") {
        response.redirect("/v2/device-wearer/personal-details")
    } else {
        response.redirect("/v2/device-wearer/device-wearer-confirm")
    }
}],
    /* POST forms: installation/disability-needs.html, installation/risk-3.html; GET links: installation/check-answers.html, submitted-form-all.html */
    ["/language", function(request, response) {

    var notifyingorg = request.session.data['notifying-org']
    var usertype = request.session.data['usertype']
    if (notifyingorg == "Family Court"){
        response.redirect("/v2/installation/check-answers")
    } else if (notifyingorg == "Civil and County Court") {
        response.redirect("/v2/installation/check-answers")
     } else if (usertype == "Home Office user") {
        response.redirect("/v2/installation/mappa")
    } else {
        response.redirect("/v2/installation/risk")
    }
}],
    /* POST forms: monitoring-conditions/curfew-dates.html */
    ["/curfew-dates", function(request, response) {

    redirectToCurfewPage(response, 'curfew-address')
}],
    /* POST forms: otd-old/order-aq.html; GET links: monitoring-conditions/check-answers-error.html, monitoring-conditions/check-answers.html */
    ["/order-aq", function(request, response) {

    var orderaq = request.session.data['order-aq']
    if (orderaq == "They did not commit one of these offences"){
        response.redirect("/v2/otd-old/hard-stop")
    } else {
        response.redirect("/v2/otd-old/order-aq-region")
    }
}],
    /* POST forms: otd-old/order-aq-region.html; GET links: monitoring-conditions/check-answers-error.html, monitoring-conditions/check-answers.html */
    ["/order-aq-region", function(request, response) {

    var regioneligibility = request.session.data['region-eligibility']
    if (regioneligibility == "The device wearer's release address is in a different police force area"){
        response.redirect("/v2/otd-old/hard-stop")
    } else {
        response.redirect("/v2/otd-old/order-prrar")
    }
}],
    /* POST forms: dashboard.html, dashboard2.html */
    ["/org-details", function(request, response) {

    var notifyingorg = request.session.data['notifying-org']
    var usertype = request.session.data['usertype']
    if (notifyingorg == "Prison service"){
        response.redirect("/v2/organisation/responsible-officer")
    } else if (notifyingorg == "Probation service") {
        response.redirect("/v2/organisation/responsible-officer")
    } else if (notifyingorg == "Youth Custody Service (YCS)") {
        response.redirect("/v2/organisation/responsible-officer")
     } else if (notifyingorg == "Home Office") {
        response.redirect("/v2/organisation/org-contact")
    } else if (notifyingorg == "") {
        response.redirect("/v2/organisation/responsible-officer")
    } else if (usertype == "Prison user") {
        response.redirect("/v2/organisation/responsible-officer")
    } else if (usertype == "Probation user") {
        response.redirect("/v2/organisation/responsible-officer")
    } else if (usertype == "Home Office user") {
        response.redirect("/v2/organisation/org-contact")
    } else if (usertype == "Youth user") {
        response.redirect("/v2/organisation/responsible-officer")
    } else {
        response.redirect("/v2/organisation/org-contact")
    }
}],
    /* POST forms: installation/risk-list.html; GET links: installation/are-you-sure.html */
    ["/risk-list", function(request, response) {

    var offencelistquestion = request.session.data['offencelistquestion']
    if (offencelistquestion == "Yes"){
        response.redirect("/v2/installation/risk-civil")
    } else {
        response.redirect("/v2/installation/check-answers")
    }
}],
    /* POST forms: installation/risk.html; GET links: installation/check-answers.html */
    ["/risk-1", function(request, response) {

    var offence = request.session.data['offence']
    if (offence == "Terrorism offence"){
        response.redirect("/v2/installation/hard-stop?sectionid=Access needs and installation risk")
    } else {
        response.redirect("/v2/installation/risk-1")
    }
}],
    /* POST forms: installation/risk-civil.html; GET links: installation/are-you-sure.html */
    ["/risk-civil", function(request, response) {

    var offence = request.session.data['offence']
    if (offence == "Terrorism offence"){
        response.redirect("/v2/installation/hard-stop?sectionid=Access needs and installation risk")
    } else {
        response.redirect("/v2/installation/risk-list")
    }
}],
    /* POST forms: installation/risk-dapo.html, installation/risk-listdapo.html */
    ["/risk-listdapo", function(request, response) {

    var dapoquestion = request.session.data['dapoquestion']
    if (dapoquestion == "Yes"){
        response.redirect("/v2/installation/risk-dapo")
    } else {
        response.redirect("/v2/installation/check-answers")
    }
}],
    /* POST forms: variations/sr-question3.html */
    ["/hard-stop", function(request, response) {

    var srtype = request.session.data['sr-type']
    if (srtype == "hardstop"){
        response.redirect("/v2/variations/hard-stop?equipment=true")
     } else if (srtype == "hardstop2") {
        response.redirect("/v2/variations/hard-stop?equipment=false")

    } else {
        response.redirect("/v2/org-details-change?view=false&section-1-complete=false&section-2-complete=false&section-3-complete=false&section-4-complete=false&section-5-complete=false&section-6-complete=false")
    }
}],
    /* POST forms: variations/sr-question.html */
    ["/sr-address", function(request, response) {

    var sraddress = request.session.data['sr-address']
    if (sraddress == "Yes"){
        response.redirect("/v2/org-details-change?view=false&section-1-complete=false&section-2-complete=false&section-3-complete=false&section-4-complete=false&section-5-complete=false&section-6-complete=false&sr-type=I need monitoring equipment reinstalled or checked")
    } else {
        response.redirect("/v2/variations/sr-question3?sr-address=No")
    }
}],
    /* POST forms: attachments/check-licence.html */
    ["/check-document", function(request, response) {

    var checkdocument = request.session.data['checkdocument']
    if (checkdocument == "Yes"){
        response.redirect("/v2/attachments/licence")
    } else {
        response.redirect("/v2/attachments/check-answers-view")
    }
}],
    /* POST forms: user-type.html */
    ["/user-type", function(request, response) {

    var usertype = request.session.data['usertype']
    if (usertype == "Prison user"){
        response.redirect("/v2/isr?order-type=Post release")
    } else if (usertype == "Probation user") {
        response.redirect("/v2/isr?order-type=Post release")
    } else if (usertype == "Youth user") {
        response.redirect("/v2/start?order-type=Post release")
    } else if (usertype == "Family court user") {
        response.redirect("/v2/start?order-type=Civil&hdc=clear&usertype=Court user&notifying-org=Family Court")
    } else if (usertype == "Civil court user") {
        response.redirect("/v2/start?order-type=Civil&hdc=clear&usertype=Court user&notifying-org=Civil and County Court")
    } else if (usertype == "Home Office user") {
        response.redirect("/v2/start?order-type=Immigration&hdc=clear")
     } else {
        response.redirect("/v2/start?notifying-org=&order-type=&hdc=clear")
    }
}],

    











    /* Legacy or indirect handlers without current v2 form or link references. */
    /* No direct v2 form or link reference found (likely legacy or indirect). */
    ["/oasys", function(request, response) {

    var oasys = request.session.data['oasys']
    if (oasys == "Yes"){
        response.redirect("/v2/installation/oasys2")
    } else {
        response.redirect("/v2/installation/risk-3")
    }
}],
    /* No direct v2 form or link reference found (likely legacy or indirect). */
    ["/install-address-question2", function(request, response) {


    var installaddressquestion = request.session.data['installaddressquestion']

    if (installaddressquestion == "No"){
        response.redirect("/v2/monitoring-conditions/install-address")
    } else {
        response.redirect("/v2/monitoring-conditions/appointment-question")
    }
}],
    /* No direct v2 form or link reference found (likely legacy or indirect). */
    ["/installation-address2", function(request, response) {


    var installaddressquestion = request.session.data['installaddressquestion']
    var monitoringtype2 = request.session.data['monitoringtype2']

    if (installaddressquestion == "No"){
        response.redirect("/v2/monitoring-conditions/install-address")
    } else if (monitoringtype2 == "Exclusion zone monitoring"){
        response.redirect("/v2/monitoring-conditions/exclusion")
    } else if (monitoringtype2 == "Inclusion zone monitoring"){
        response.redirect("/v2/monitoring-conditions/inclusion")
    } else if (monitoringtype2 == "Trail monitoring"){
        response.redirect("/v2/monitoring-conditions/trail")
    } else if (monitoringtype2 == "Trail monitoring (Home Office)"){
        response.redirect("/v2/monitoring-conditions/trail")
    } else if (monitoringtype2 == "Mandatory attendance monitoring"){
        response.redirect("/v2/monitoring-conditions/attendance")
    } else {
        response.redirect("/v2/monitoring-conditions/alcohol")
    }
}],
    /* No direct v2 form or link reference found (likely legacy or indirect). */
    ["/appointment-addressold", function(request, response) {


    var appointmentquestion = request.session.data['appointmentquestion']
    var monitoringtype = request.session.data['monitoringtype']

    if (appointmentquestion == "Yes"){
        response.redirect("/v2/monitoring-conditions/appointment-details")
    } else if (monitoringtype == "Exclusion zone monitoring"){
        response.redirect("/v2/monitoring-conditions/exclusion")
    } else if (monitoringtype == "Inclusion zone monitoring"){
        response.redirect("/v2/monitoring-conditions/inclusion")
    } else if (monitoringtype == "Trail monitoring"){
        response.redirect("/v2/monitoring-conditions/trail")
    } else if (monitoringtype == "Trail monitoring (Home Office)"){
        response.redirect("/v2/monitoring-conditions/trail")
    } else if (monitoringtype == "Mandatory attendance monitoring"){
        response.redirect("/v2/monitoring-conditions/attendance")
    } else {
        response.redirect("/v2/monitoring-conditions/alcohol")
    }
}],
    /* No direct v2 form or link reference found (likely legacy or indirect). */
    ["/appointment-address2", function(request, response) {
    var appointmentquestion = request.session.data['appointmentquestion']
    var monitoringtype2 = request.session.data['monitoringtype2']


    if (appointmentquestion == "At a prison"){
        response.redirect("/v2/monitoring-conditions/appointment-details")
    } else if (appointmentquestion == "At a probation office"){
        response.redirect("/v2/monitoring-conditions/appointment-details")
    } else if (appointmentquestion == "At another address"){
        response.redirect("/v2/monitoring-conditions/install-address")
    } else {
        response.redirect("/v2/monitoring-conditions/check-answers")
    }
}],
    /* No direct v2 form or link reference found (likely legacy or indirect). */
    ["/appointment-address2old", function(request, response) {


    var appointmentquestion = request.session.data['appointmentquestion']
    var monitoringtype2 = request.session.data['monitoringtype2']

    if (appointmentquestion == "Yes"){
        response.redirect("/v2/monitoring-conditions/appointment-details")
    } else if (monitoringtype2 == "Exclusion zone monitoring"){
        response.redirect("/v2/monitoring-conditions/exclusion")
    } else if (monitoringtype2 == "Inclusion zone monitoring"){
        response.redirect("/v2/monitoring-conditions/inclusion")
    } else if (monitoringtype2 == "Trail monitoring"){
        response.redirect("/v2/monitoring-conditions/trail")
    } else if (monitoringtype2 == "Trail monitoring (Home Office)"){
        response.redirect("/v2/monitoring-conditions/trail")
    } else if (monitoringtype2 == "Mandatory attendance monitoring"){
        response.redirect("/v2/monitoring-conditions/attendance")
    } else {
        response.redirect("/v2/monitoring-conditions/alcohol")
    }
}],
    /* No direct v2 form or link reference found (likely legacy or indirect). */
    ["/monitoring-questionold", function(request, response) {

    var monitoringtype = request.session.data['monitoringtype']
    var addressquestion = request.session.data['addressquestion']

    if (monitoringtype == "Curfew"){
        redirectToCurfewPage(response, 'curfew-dates')
    } else if (addressquestion == "No"){
        response.redirect("/v2/monitoring-conditions/install-address")
    } else {
        response.redirect("/v2/monitoring-conditions/install-address-question")
    }
}],
    /* No direct v2 form or link reference found (likely legacy or indirect). */
    ["/monitoring-question", function(request, response) {

    var monitoringtype = request.session.data['monitoringtype']
    var addressquestion = request.session.data['addressquestion']


    if (monitoringtype == "Curfew"){
        redirectToCurfewPage(response, 'curfew-dates')
    } else if (monitoringtype == "Alcohol monitoring"){
    response.redirect("/v2/monitoring-conditions/appointment-question")
    } else if (monitoringtype == "Trail monitoring (Home Office)"){
    response.redirect("/v2/monitoring-conditions/appointment-question")
    } else if (addressquestion == "No"){
    response.redirect("/v2/monitoring-conditions/install-address")
    } else {
    response.redirect("/v2/monitoring-conditions/install-address-question")
    }
}],
    /* No direct v2 form or link reference found (likely legacy or indirect). */
    ["/monitoring-question2old", function(request, response) {

    var monitoringtype2 = request.session.data['monitoringtype2']
    var addressquestion = request.session.data['addressquestion']

    if (monitoringtype2 == "Curfew"){
        redirectToCurfewPage(response, 'curfew-dates')
    } else if (addressquestion == "No"){
        response.redirect("/v2/monitoring-conditions/install-address")
    } else {
        response.redirect("/v2/monitoring-conditions/install-address-question")
    }
}],
    /* No direct v2 form or link reference found (likely legacy or indirect). */
    ["/monitoring-question2", function(request, response) {

    var monitoringtype2 = request.session.data['monitoringtype2']


    if (monitoringtype2 == "Curfew"){
        redirectToCurfewPage(response, 'curfew-dates')
    } else {
        response.redirect("/v2/monitoring-conditions/appointment-question")
    }
}],
    /* No direct v2 form or link reference found (likely legacy or indirect). */
    ["/curfew-change", function(request, response) {

    var curfewperiods = request.session.data['curfewperiods']
    if (curfewperiods == "one"){
        redirectToCurfewPage(response, 'curfew-check-timetable')
    } else {
        response.redirect("/v2/monitoring-conditions/curfew-change2")
    }
}],
    /* No direct v2 form or link reference found (likely legacy or indirect). */
    ["/ho-question", function(request, response) {

    var notifyingorg = request.session.data['notifying-org']
    if (notifyingorg == "Home Office"){
        response.redirect("/v2/attachments/licence-question?cya5=false")
    } else {
        response.redirect("/v2/attachments/licence?cya5=false")
    }
}],
    /* No direct v2 form or link reference found (likely legacy or indirect). */
    ["/photo-questioncvl", function(request, response) {

    var photoquestion = request.session.data['photoquestion']
    if (photoquestion == "Yes"){
        response.redirect("/v2/attachments/photo")
    } else {
        response.redirect("/v2/attachments/map-list")
    }
}],
    /* No direct v2 form or link reference found (likely legacy or indirect). */
    ["/order-region", function(request, response) {

    var orderdescription = request.session.data['order-description']
    if (orderdescription == "GPS acquisitive crime"){
        response.redirect("/v2/otd-old/order-aq")
    } else {
        response.redirect("/v2/otd-old/order-prrar")
    }
}],
    /* No direct v2 form or link reference found (likely legacy or indirect). */
    ["/curfew-dates-question", function(request, response) {

    var curfewdatesquestion = request.session.data['curfewdatesquestion']
    if (curfewdatesquestion == "No"){
        response.redirect("/v2/monitoring-conditions/curfew-2")
    } else {
        redirectToCurfewPage(response, 'curfew-first-night')
    }
}],
    /* No direct v2 form or link reference found (likely legacy or indirect). */
    ["/exclusion-dates-question", function(request, response) {

    var exclusiondatesquestion = request.session.data['exclusiondatesquestion']
    if (exclusiondatesquestion == "No"){
        response.redirect("/v2/monitoring-conditions/exclusion-1")
    } else {
        response.redirect("/v2/monitoring-conditions/exclusion-2")
    }
}],
    /* No direct v2 form or link reference found (likely legacy or indirect). */
    ["/alcohol-dates-question", function(request, response) {

    var alcoholdatesquestion = request.session.data['alcoholdatesquestion']
    if (alcoholdatesquestion == "No"){
        response.redirect("/v2/monitoring-conditions/alcohol-1")
    } else {
        response.redirect("/v2/monitoring-conditions/alcohol-2")
    }
}],
    /* No direct v2 form or link reference found (likely legacy or indirect). */
    ["/attendance-dates-question", function(request, response) {

    var attendancedatesquestion = request.session.data['attendancedatesquestion']
    if (attendancedatesquestion == "No"){
        response.redirect("/v2/monitoring-conditions/attendance-1")
    } else {
        response.redirect("/v2/monitoring-conditions/attendance-2")
    }
}],
    /* No direct v2 form or link reference found (likely legacy or indirect). */
    ["/trail-dates-question", function(request, response) {

    var traildatesquestion = request.session.data['traildatesquestion']
    var monitoringtype = request.session.data['monitoringtype']
    var monitoringtype2 = request.session.data['monitoringtype']

    if (traildatesquestion == "No"){
        response.redirect("/v2/monitoring-conditions/trail-1")
    } else if (monitoringtype == "Trail monitoring (Home Office)") {
        response.redirect("/v2/monitoring-conditions/trail-2")
    } else if (monitoringtype2 == "Trail monitoring (Home Office)") {
        response.redirect("/v2/monitoring-conditions/trail-2")
    } else {
        response.redirect("/v2/monitoring-conditions/monitoring-needed")
    }
}],
    /* No direct v2 form or link reference found (likely legacy or indirect). */
    ["/sr-question-OLD", function(request, response) {

    var srtypesimple = request.session.data['sr-type-simple']
    if (srtypesimple == "I have changed something else in the form"){
        response.redirect("/v2/new-form?section-1-complete=false&section-2-complete=false&section-3-complete=false&section-4-complete=false&section-5-complete=false&section-6-complete=false&view=none&newform=false")
    } else if (srtypesimple == "I need to end all monitoring for the device wearer2") {
        response.redirect("/v2/variation-simple/bail")
    } else if (srtypesimple == "I need to end all monitoring for the device wearer") {
        response.redirect("/v2/variation-simple/bail")
     } else if (srtypesimple == "I need monitoring equipment installed at a new address") {
        response.redirect("/v2/new-form?section-1-complete=false&section-2-complete=false&section-3-complete=false&section-4-complete=false&section-5-complete=false&section-6-complete=false&view=none&newform=false")
    } else if (srtypesimple == "hardstop") {
        response.redirect("/v2/variations/hard-stop?equipment=true")
    } else if (srtypesimple == "hardstop2") {
        response.redirect("/v2/variations/hard-stop?equipment=false")
    } else {
        response.redirect("/v2/variation-simple/identity-numbers")
    }
}],
    /* No direct v2 form or link reference found (likely legacy or indirect). */
    ["/sr-address-simple-OLD", function(request, response) {

    var sraddress = request.session.data['sr-address']
    if (sraddress == "No"){
        response.redirect("/v2/variation-simple/sr-question")
    } else {
        response.redirect("/v2/variation-simple/bail")
    }
}],
    /* No direct v2 form or link reference found (likely legacy or indirect). */
    ["/checkrisk", function(request, response) {

    var checkrisk = request.session.data['checkrisk']
    if (checkrisk == "Yes"){
        response.redirect("/v2/installation/risk-2?risk=Violent behaviour or threats of violence&risk-question=No&risk2=There are no risks that the installer should be aware of")
    } else {
        response.redirect("/v2/installation/check-answers-view")
    }
}],
    /* No direct v2 form or link reference found (likely legacy or indirect). */
    ["/checkconditions", function(request, response) {

    var checkconditions = request.session.data['checkconditions']
    if (checkconditions == "Yes"){
        response.redirect("/v2/monitoring-conditions/monitoring-needed?cvl=yes&cvl-incomplete=yes")
    } else {
        response.redirect("/v2/monitoring-conditions/check-answers-view?cvl=no&cvl-incomplete=no")
    }
}],
    /* No direct v2 form or link reference found (likely legacy or indirect). */
    ["/user-type-cohort", function(request, response) {

    var usertype = request.session.data['usertype']
    if (usertype == "Prison user"){
        response.redirect("/v2/start?notifying-org=Prison service&order-type=Post release")
    } else if (usertype == "Probation user") {
        response.redirect("/v2/start?notifying-org=Probation service&order-type=Post release")
    } else if (usertype == "Youth user") {
        response.redirect("/v2/start?notifying-org=Youth Custody Service (YCS)&order-type=Post release")
    } else if (usertype == "Court user") {
        response.redirect("/v2/start?notifying-org=Family Court&order-type=Civil&hdc=clear")
    } else if (usertype == "Home Office user") {
        response.redirect("/v2/start?notifying-org=Home Office&order-type=Immigration&hdc=clear")
     } else {
        response.redirect("/v2/start?notifying-org=&order-type=&hdc=clear")
    }
}],

  ])
  for (const [path, handler] of routeHandlers) {
        router.post(path, handler)
  }
}
