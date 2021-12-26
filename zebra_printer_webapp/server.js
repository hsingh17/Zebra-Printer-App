const express = require('express')
const app = express()
const path = require('path')
const fs = require('fs/promises')
const PORT = process.env.PORT || 3000

// In case localhost doesn't work: https://stackoverflow.com/questions/58929202/connection-refused-on-localhost

app.use('/', express.static(path.join(__dirname, 'public')))

app.use(express.urlencoded({
    extended : true
})) // https://flaviocopes.com/express-forms/

app.post('/label', async (req, res) => {
    let data = await fs.readFile('label_db.json')
    let db = JSON.parse(data)
    db.push(req.body)   // Push in the new label request

    let new_data = JSON.stringify(db)
    await fs.writeFile('label_db.json', new_data)
    res.status(204).send()  // 204 = No Content Response
})

app.get('/label', async (req, res) => {
    let data = await fs.readFile('label_db.json')
    let db = JSON.parse(data)

    await fs.writeFile('label_db.json', JSON.stringify([])) // Clear the old values
    res.json(db)
})

app.listen(PORT, () => {
    console.log(`Server start ${PORT}`)
})
