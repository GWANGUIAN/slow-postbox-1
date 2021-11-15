require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
//const multer = require('multer');
const multipart = require('connect-multiparty'); /*추가*/
const MultipartyMiddleware = multipart({ uploadDir: './images' }); /*추가*/
const path = require('path');
const fs = require('fs');
const homeRouter = require('./router/homeRouter');
const adminRouter = require('./router/adminRouter');
const mailRouter = require('./router/mailRouter');
const userRouter = require('./router/userRouter');

const app = express();

app.use(express.json({ strict: false }));
// app.use(cors())
app.use(
  cors({
    origin: ['http://localhost:3000', 'http://localhost:3002'],
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  })
);

// let storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'public/');
//   },
//   filename: function (req, file, cb) {
//     let ext = file.originalname.split('.');
//     ext = ext[ext.length - 1];
//     cb(null, `${Date.now()}.${ext}`);
//   },
// });

//const upload = multer({ storage: storage });

app.use(cookieParser());
// app.use([express.static('public'), upload.array('files')]);
app.use(express.static('uploads'));
app.post('/uploads', MultipartyMiddleware, (req, res) => {
  const tempFile = req.files.upload;
  const tempPathfile = tempFile.path;

  const targetPathUrl = path.join(__dirname, './uploads/' + tempFile.name);
  if (
    path.extname(tempFile.originalFilename).toLowerCase() === '.png' ||
    '.jpg'
  ) {
    fs.rename(tempPathfile, targetPathUrl, (err) => {
      res.status(200).json({
        uploaded: true,
        url: `http://localhost:4000/${tempFile.originalFilename}`,
      });
      if (err) return console.log(err);
    });
  }
  console.log(req.files.upload);
});
app.use('/home', homeRouter);
app.use('/admin', adminRouter);
app.use('/mail', mailRouter);
app.use('/user', userRouter);

const PORT = 4000;

// const PORT = 80;

let server = app.listen(PORT, () =>
  console.log(`🚀 Server is starting on ${PORT}`)
);

module.exports = server;
