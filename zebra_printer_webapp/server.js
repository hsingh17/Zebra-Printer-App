const express = require('express')
const app = express()
const path = require('path')
const PORT = process.env.PORT || 3000


app.use('/', express.static(path.join(__dirname, 'public')))

app.use(express.urlencoded({
    extended : true
})) // https://flaviocopes.com/express-forms/


app.post('/label', (req, res) => {
    console.log(req.body)
    res.status(204).send()  // 204 = No Content Response
})

app.listen(PORT, () => {
    console.log(`Server start ${PORT}`)
})