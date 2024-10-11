var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var { Pool } = require('pg'); // PostgreSQL 추가
var multer = require('multer'); // Multer 추가
var fs = require('fs');
var cors = require('cors'); // CORS 추가
var { createProxyMiddleware } = require('http-proxy-middleware'); // Proxy 추가

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors()); // CORS 사용

// PostgreSQL connection pool configuration
const pool = new Pool({
  user: 'postgres',
  host: '10.100.0.54',
  database: 'postgres',
  password: 'dlwjdtjq66',
  port: 5432,
});

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Add timestamp to filename
  }
});
const upload = multer({ storage: storage });

// Routes setup
app.use('/', indexRouter);
app.use('/users', usersRouter);

// POST request for '/test'
app.post('/test', (req, res) => {
  const { skin_type, moisture_type } = req.body;
  console.log('DB 서버 전송 전 단계');

  let query = 'SELECT * FROM "public".cosmetics WHERE 1=1';
  const queryParams = [];

  if (skin_type !== undefined) {
    queryParams.push(skin_type);
    query += ` AND skin_type = $${queryParams.length}`;
  }

  if (moisture_type !== undefined) {
    queryParams.push(moisture_type);
    query += ` AND moisture_type = $${queryParams.length}`;
  }

  console.log('Executing query:', query, 'with parameters:', queryParams);

  pool.query(query, queryParams, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error fetching data from database');
    } else {
      res.json(result.rows);
    }
  });
});

// Image upload route
app.post('/upload-image', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  const filePath = req.file.path;
  res.json({ message: 'Image uploaded successfully', filePath: filePath });
});

// Proxy to external API server
app.use('/api', createProxyMiddleware({
  target: 'http://10.100.1.57:8000',
  changeOrigin: true,
  pathRewrite: {
    '^/api': '',
  }
}));

// /api/gemma endpoint
app.post('/api/gemma', (req, res) => {
  const { formatted_data } = req.body;
  console.log('API 요청 데이터:', formatted_data);

  if (!formatted_data) {
    return res.status(400).json({ error: 'No formatted_data provided' });
  }

  res.json({ gemma_response: "API 요청 성공: " + formatted_data });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
