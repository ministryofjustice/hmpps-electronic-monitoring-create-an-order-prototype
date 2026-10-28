module.exports = router => {
  router.get('/', (request, response) => {
    response.redirect('/dashboard')
  })
}
