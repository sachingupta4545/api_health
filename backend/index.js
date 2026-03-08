import express from 'express';

const app = express();

const PORT = process.env.PORT || 3000;

// app.use((req, res, next) => {
//     console.log("Hello sachin");

//     res.on('finish', () => {
//         console.log('Response finished');
//     })
//     next();
// })

app.get('/', (req, res) => {
    res.send('Hello Sachin Gupta!');
});

app.get('/health', (req, res) => {
    throw new Error("Something went wrong");
    // res.send('This is health route');
});

app.get('/about', (req, res) => {
    res.send('Hey sachin , this is about route');
});


app.use((err, req, res, next) => {
    console.error("Error happends", err);
    res.send("internal server error", 500);
})


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});