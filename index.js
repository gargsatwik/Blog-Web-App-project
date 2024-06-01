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

function padToTwoDigits(num) {
    return num.toString().padStart(2, '0');
}

function makeDictionaryObject(data) {
    const date = new Date();
    const year = date.getFullYear();
    const month = padToTwoDigits(date.getMonth() + 1); // Months are zero-indexed
    const day = padToTwoDigits(date.getDate());
    const formattedDate = `${day}-${month}-${year}`;
    return {
        "title": data.title,
        "subtitle": data.subtitle,
        "date": formattedDate,
        "body": data.body,
        "author": data.author,
    }
}

app.get('/', (req, res) => {
    res.render(_dirname+"/views/index.ejs", {blogs})
})

app.get('/about', (req, res) => {
    res.render(_dirname+"/views/about.ejs")
})

app.get('/new-post', (req, res) => {
    res.render(_dirname+"/views/new_post.ejs")
})

app.post('/submit-post', (req, res) => {
    var receivedData = req.body;
    blogs.push(makeDictionaryObject(receivedData));
    res.redirect('/');
})

app.get('/show-post/:post_index', (req, res) => {
    const postIndex = req.params.post_index;
    const blog = blogs[req.params.post_index];
    res.render(_dirname+'/views/view_post.ejs', {blog, post_index})
})

app.get('/delete-post/:post_index', (req, res) => {
    const postIndex = req.params.post_index;
    blogs = blogs.filter((blogs, postIndex) => postIndex !== 2);
    console.log(blogs);
    res.redirect('/');
})

app.get('/edit-post/:post_index', (req, res) => {
    const postIndex = req.params.post_index;
    const blog = blogs[req.params.post_index];
    res.render(_dirname+'/views/edit.ejs', {blog, postIndex})
})

app.post('/edit-post/:post_index', (req, res) => {
    const postIndex = req.params.post_index;
    const data = req.body;
    blogs[postIndex] = makeDictionaryObject(data);
    res.redirect('/');
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})
