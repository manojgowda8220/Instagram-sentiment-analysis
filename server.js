const express = require('express');
const multer = require('multer');
const fs = require('fs');
const { spawn } = require('child_process');

const app = express();
app.use(express.static('public'));
app.use(express.json());

const upload = multer({ dest: 'uploads/' });

function analyzeSentiment(text) {
    return new Promise((resolve, reject) => {
        const process = spawn('python', ['analyze.py', text]);
        process.stdout.on('data', (data) => resolve(data.toString().trim()));
        process.stderr.on('data', (err) => reject(err.toString()));
    });
}

app.post('/upload', upload.single('file'), async (req, res) => {
    const filePath = req.file.path;
    const comments = JSON.parse(fs.readFileSync(filePath));
    const results = await Promise.all(comments.map(async (comment) => ({
        comment,
        sentiment: await analyzeSentiment(comment)
    })));
    fs.writeFileSync('public/results.json', JSON.stringify(results));
    res.json(results);
});

app.listen(5000, () => console.log('Server running on port 5000'));
app.use(express.static('public'));
