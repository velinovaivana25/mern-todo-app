//database connection логиката
//mongoose е ODM (Object Data Modeling) библиотека за MongoDB.
// Ни дозволува: да дефинираме Schema,да креираме Model,да правиме CRUD операции
// ,да имаме валидација
// Без mongoose би користела „чист“ MongoDB driver што е покомплициран.
import mongoose from 'mongoose';


//Ова е функција што:
// ја повикуваш кога серверот стартува
// се поврзува со MongoDB
// Зошто е async? Затоа што поврзувањето со база е асинхрона операција 
// (потребно е време).
//try,catch->Ова е error handling.Ако конекцијата успее → продолжува Ако не успее → фаќа грешка
//Во production ова е многу важно.
// await mongoose.connect(process.env.MONGO_URI);
// Ова е најважниот ред.Што прави?
// Се поврзува со MongoDB користејќи connection string.
// Пример во .env: MONGO_URI=mongodb+srv://username:password@cluster0.mongodb.net/todoDB
// process.env.MONGO_URI
//го чита тоа од environment variable.
//Што враќа mongoose.connect()?
// Враќа connection object.
// Ти го чуваш во:  const conn
//conn.connection.host -> Ова само печати на кој host си поврзана.
// Пример output: MongoDB Connected: cluster0-shard-00-00.mongodb.net
// Ова е за debugging, не е задолжително.
// Што прави process.exit(1)? -> Го гаси Node процесот.
// Зошто? Ако нема база, апликацијата нема смисла да работи.
// Подобро е да се изгаси отколку да работи „полу-скршена“.
// 1 значи: Завршување со грешка
// 0 би значело успешно завршување.
//Што се случува кога стартуваш сервер?
// Во твојот server.js имаш:
// app.listen(5000, () => {
//     connectDB();
// });
// Flow:
// Серверот стартува
// Се повикува connectDB()
// Mongoose се поврзува со MongoDB
// Ако успее → печати порака
// Ако не → серверот се гаси
export const connectDB = async () => {
    try {

        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`)
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}