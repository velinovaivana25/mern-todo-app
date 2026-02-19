//Mongoose Schema и Model — ова е СРЦЕТО на backend апликацијата.

import mongoose from "mongoose";


//Schema е: „blueprint“ (шема) за тоа како ќе изгледа документот во MongoDB.
//timestamps:true -> Mongoose автоматски додава 2 полиња во секој документ:
// createdAt  i updatedAt
// Пример без timestamps
// Документ во база:
// {
//   "_id": "65abcd123",
//   "text": "Buy milk"
// }
// Пример со { timestamps: true }
// {
//   "_id": "65abcd123",
//   "text": "Buy milk",
//   "createdAt": "2026-02-16T12:00:00.000Z",
//   "updatedAt": "2026-02-16T12:00:00.000Z"
// }
//Многу корисно во реални апликации:
// ✔ сортирање по најнови задачи
// ✔ прикажување "created 5 minutes ago"
// ✔ логирање
// ✔ audit trail
// ✔ debugging
//Може ли да се смени името на полињата? ДА.
// { 
//   timestamps: { 
//     createdAt: 'created_at', 
//     updatedAt: 'updated_at' 
//   } 
// }
// Тогаш во база ќе имаш:
// created_at  i  updated_at
//Ако НЕ ставиш timestamps?  Ќе мораш рачно да правиш:
// createdAt: {
//    type: Date,
//    default: Date.now
// }
// И рачно да го менуваш updatedAt.
const todoSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },

    completed: {
        type:Boolean,
        default:false

    }
},{timestamps:true})

const Todo=mongoose.model("Todo",todoSchema);

export default Todo;