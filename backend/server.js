//express е framework за Node.js
//Се користи за:креирање сервер,дефинирање рути (routes),
// обработка на HTTP барања (GET, POST, PUT, DELETE).
// Без Express ќе мораш рачно да работиш со http модулот

//dotenv служи за читање на .env фајл
//Во .env обично чуваме:PORT,MONGO_URI,JWT_SECRET,API keys
//Зошто? За да не ги ставаме чувствителните податоци во кодот.

//connectDB
//Функција што ја поврзува апликацијата со MongoDB.Најчесто во config/db.js имаш нешто како:
//mongoose.connect(process.env.MONGO_URI)
//Зошто е одвоено? За да не го мешаш database кодот со server логиката.

import express from 'express';
import dotenv from 'dotenv';
import todoRoutes from './routes/todo.route.js';
import { connectDB } from './config/db.js';
import cors from "cors";
import path from "path";
const PORT =process.env.PORT || 5000;


//Го активира dotenv.Без ова .env нема да се чита.
dotenv.config();


//креирање на express апликација
//Ова креира сервер.
//app ти е главниот објект преку кој:дефинираш рути,користиш middleware
//,стартуваш сервер
const app = express();


//za da mi pecati ova na glavnata strana koga ke se strartuva na port 5000
// app.get("/", (req, res) => {
//     res.send("Server is ready");
// });


//Тоа е middleware што:Го чита JSON телото (body) од HTTP request 
// И го претвора во JavaScript објект  И го става во req.body
//Што се случува СО express.json()?
// Express:Го чита raw JSON текстот - > Го парсира (JSON.parse()) 
// ->Го претвора во JavaScript object -> Го става во req.body
//Пример:
// router.post("/", (req, res) => {
//     console.log(req.body);
// });
// Ако пратиш: { "text": "Study"  }
// Во конзола ќе добиеш:   { text: "Study" }
// Што значи app.use()?
// app.use() значи: „Користи го овој middleware за секој request“
//Middleware = функција што се извршува пред да стигнеш до route handler.
// Middleware е функција што има пристап до:  (req, res, next)
//Пример како изгледа express.json() внатрешно (поједноставено):
// function jsonParser(req, res, next) {
//    // parse body
//    next();
// }
// next() значи: продолжи кон следниот middleware или route
//middleware мора да се изврши ПРЕД route handler-от.-> редоследот мора 
// вака не смеат да се сменат местата 
// app.use(express.json()); 
// app.use("/api/todos", todoRoutes);
// Кога ти треба express.json()?
// ✔ POST
// ✔ PUT
// ✔ PATCH
//Кога праќаш body.
// Не ти треба за:
// ✔ GET
// ✔ DELETE (освен ако не праќаш body)
//Реален пример (цел flow)
// Frontend праќа:
// POST /api/todos
// Content-Type: application/json
// Body:
// {
//   "text": "Learn Node"
// }
// Server:
// app.use(express.json());
// router.post("/", (req, res) => {
//    console.log(req.body.text);
// });
// Output:
// Learn Node
//Ако го тргнеш middleware: Ќе добиеш: Cannot read property 'text' of undefined
app.use(express.json());


//Ова значи: Сите рути од todoRoutes ќе почнуваат со: /api/todos
// Ако во todo.route.js имаш: router.get("/")
// Тоа ќе стане: GET /api/todos
// Ако имаш: router.post("/")
// Ќе стане: POST /api/todos
// Ова се вика route prefixing.  Зошто е добро?  Подобра структура
// ,Подготвено за production,API стандарди
app.use("/api/todos", todoRoutes)


const __dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/frontend/dist")));
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));

    });
}




//Ова го стартува серверот на порт 5000.
// Кога ќе стартува:
// Се повикува connectDB() → се поврзуваш со MongoDB
// Се печати порака во конзола
//Зошто connectDB е внатре во listen?
// Затоа што:
// Сакаш база да се поврзе кога серверот ќе стартува
// Ако нема база → апликацијата нема да работи правилно
// Некои луѓе ја повикуваат пред listen, но ова е исто валиден начин.
// Архитектура што ја користиш
// Ти користиш:
// config/
// routes/
// models/
// controllers/
// server.js
// Ова се вика:  MVC-like структура (Model-View-Controller)
app.listen(5000, () => {
    connectDB();
    console.log("Server started  at http://localhost:5000");
});


//Што се случува кога ќе пуштиш npm run dev?
// Node стартува
// dotenv ги чита env променливите
// express креира сервер
// се активира middleware
// се регистрираат routes
// серверот слуша на порт 5000
// се поврзува MongoDB

