import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const _dirname = dirname(fileURLToPath(import.meta.url))
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))

var blogs = []

function makeDictionaryObject(data) {
    return {
        "id": blogs.length,
        "title": data.title,
        "subtitle": data.subtitle,
        "date": new Date().getDate,
        "body": data.body,
        "author": data.author,
    }
}

app.get('/', (req, res) => {
    res.render(_dirname+"/views/index.ejs")
})

app.get('/about', (req, res) => {
    res.render(_dirname+"/views/about.ejs")
})

app.get('/new-post', (req, res) => {
    res.render(_dirname+"/views/new_post.ejs")
})

app.post('/new-post', (req, res) => {
    var receivedData = req.body;
    blogs.push(makeDictionaryObject(receivedData));
    res.redirect('/');
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})
