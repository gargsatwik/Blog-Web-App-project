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
        "img_url": data.img_url,
    }
}

function removeElement(array, index) {
    if (index >= 0 && index < array.length) {
      return array.slice(0, index).concat(array.slice(index + 1));
    } else {
      console.error("Invalid index for deletion:", index);
      return array; 
    }
  }

app.get('/', (req, res) => {
    res.render(_dirname+"/views/index.ejs", {blogs})
})

app.get('/about', (req, res) => {
    res.render(_dirname+"/views/about.ejs")
})

app.get('/new-blog', (req, res) => {
    res.render(_dirname+"/views/new_blog.ejs")
})

app.post('/submit-blog', (req, res) => {
    var receivedData = req.body;
    blogs.push(makeDictionaryObject(receivedData));
    res.redirect('/');
})

app.get('/show-blog/:blog_index', (req, res) => {
    const blogIndex = req.params.blog_index;
    const blog = blogs[req.params.blog_index];
    res.render(_dirname+'/views/view_blog.ejs', {blog, blogIndex});
})

app.post('/delete-blog/:blog_index', (req, res) => {
    const blogIndex = req.params.blog_index;
    blogs = removeElement(blogs, blogIndex);
    console.log(blogs);
    res.redirect('/');
})

app.get('/edit-blog/:blog_index', (req, res) => {
    const blogIndex = req.params.blog_index;
    const blog = blogs[req.params.blog_index];
    res.render(_dirname+'/views/edit.ejs', {blog, blogIndex})
})

app.post('/edit-blog/:blog_index', (req, res) => {
    const blogIndex = req.params.blog_index;
    const data = req.body;
    blogs[blogIndex] = makeDictionaryObject(data);
    res.redirect('/');
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})
