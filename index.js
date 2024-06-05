import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";

dotenv.config();
const app = express();
const port = 3000;
const _dirname = dirname(fileURLToPath(import.meta.url))
const DB_URI = process.env.DB_URI;
const client = new MongoClient(DB_URI);
await client.connect();
const db = client.db("Blog Web App");
const blogCollection = db.collection("blogs");

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))

function padToTwoDigits(num) {
    return num.toString().padStart(2, '0');
}

async function makeDictionaryObject(data, Id) {
    const date = new Date();
    const year = date.getFullYear();
    const month = padToTwoDigits(date.getMonth() + 1); 
    const day = padToTwoDigits(date.getDate());
    const formattedDate = `${day}-${month}-${year}`;
    return {
        "id": Id || await blogCollection.countDocuments(),
        "title": data.title,
        "subtitle": data.subtitle,
        "date": formattedDate,
        "body": data.body,
        "author": data.author,
        "img_url": data.img_url,
    }
}

app.get('/', async (req, res) => {
    const blogs = await blogCollection.find().toArray();
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
    blogCollection.insertOne(makeDictionaryObject(receivedData));
    res.redirect('/');
})

app.get('/show-blog/:blogId', (req, res) => {
    const blogId = req.params.blogId;
    const blog = blogCollection.findOne( { "id": blogId } )
    res.render(_dirname+'/views/view_blog.ejs', {blog, blogId});
})

app.post('/delete-blog/:blogId', (req, res) => {
    const blogId = req.params.blogId;
    blogCollection.deleteOne( { "id": blogId } );
    res.redirect('/');
})

app.get('/edit-blog/:blogId', (req, res) => {
    const blogId = req.params.blogId;
    const blog = blogCollection.findOne( { "id": blogId } );
    res.render(_dirname+'/views/edit.ejs', {blog, blogId})
})

app.post('/edit-blog/:blogId', (req, res) => {
    const blogId = req.params.blogId;
    blogCollection.deleteOne( { "id": blogId } );
    blogCollection.insertOne(makeDictionaryObject(req.body, blogId));
    res.redirect('/');
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})
