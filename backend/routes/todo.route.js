//✔ express  Го користиш за да креираш Router.
// ✔ Todo  Ова е Mongoose Model-от што го направи претходно.
// Преку него комуницираш со MongoDB:
// find()
// save()
// findById()
// findByIdAndDelete()

import express from 'express';
import Todo from '../models/todo.model.js';


//Router ти дозволува да ги групираш рутите одвоено од главниот server.
// Во server.js имаш: app.use("/api/todos", todoRoutes)
// Значи сите овие рути ќе почнуваат со:  /api/todos
const router = express.Router();

//get all todos
//Todo.find():
// ✔ ги враќа сите документи од collection
// ✔ враќа array
// Пример response:
// [
//   { "text": "Study", "completed": false },
//   { "text": "Gym", "completed": true }
// ]
router.get('/', async (req, res) => {
    try {
        const todos = await Todo.find();
        res.json(todos);
    } catch (error) {
        res.status(500).json({ message: err.message });
    }
});


//add a new todo
router.post('/', async (req, res) => {
    //Создаваш нов документ.
    const todo = new Todo({
        text: req.body.text
    })
    try {
        //.save():
        // ✔ го зачувува документот во база
        // ✔ враќа зачуван документ
        const newTodo = await todo.save();
        res.status(201).json(newTodo); //201 = Created
    } catch (error) {
        res.status(400).json({ message: err.message })
    }
});

//Зошто користиш PATCH а не PUT?
// PATCH:
// ✔ partial update
// PUT:
// ✔ заменува цел документ

//update a todo(text and/or completed)
router.patch('/:id', async (req, res) => {
    try {
        //Го бара todo со id
        //req.params.id → доаѓа од URL.
        // Пример: PATCH /api/todos/65abc123
        const todo = await Todo.findById(req.params.id);
        if (!todo) return res.status(404).json({ message: "Todo not found" }); //404 = Not Found
        //Ако има text во body:
        // if (req.body.text !== undefined)
        // Го ажурираш. Ова е smart начин — дозволува partial update.
        if (req.body.text !== undefined) {
            todo.text = req.body.text;
        }
        if (req.body.completed !== undefined) {
            todo.completed = req.body.completed
        }
        //Ова:
        // ✔ го снима update
        // ✔ го менува updatedAt (поради timestamps)
        const updatedTodo = await todo.save();
        res.json(updatedTodo);

    } catch (error) {
        res.status(400).json({ message: err.message });
    }
});

//delete a todo
router.delete('/:id', async (req, res) => {
    try {
        await Todo.findByIdAndDelete(req.params.id);
        res.json({ message: "Todo deleted" })
    } catch (error) {
        res.status(500).json({ message: err.message });

    }
});

export default router;

//Разлика меѓу save() и create()
// Todo.create({...})
// е shortcut за:
// new Todo({...}).save()
//Што враќа find()? Array.
//Што враќа findById()? Еден документ или null.
//Зошто async/await? Затоа што database операции враќаат Promise.
//Promise е објект што претставува:
//  вредност што ќе ја добиеме во иднина
//  или грешка што ќе се случи во иднина
// Значи не веднаш.
//Promise има 3 состојби:
// 1. pending   (се чека)
// 2. fulfilled (успешно)
// 3. rejected  (грешка)
//Зошто database операции враќаат Promise?#
// Кога правиш:  Todo.find()
// Node:  праќа барање до MongoDB
// чека одговор
// враќа резултат
// Тоа не се случува веднаш.
// Потребно е време.
// Затоа find() враќа Promise.
//await значи:  "Чекај додека Promise не се заврши"
//async кажува:
// оваа функција враќа Promise, внатре можеш да користиш await
//Што ќе се случи ако НЕ користиш await?
// const todos = Todo.find();
// console.log(todos);
// Ќе добиеш:Promise { <pending> }
// Не вистинските податоци.
//Зошто JavaScript работи вака?
// Node е:  Single-threaded , Non-blocking
// Ако чекаше база синхроно:  целиот сервер би бил блокиран
// Со Promise: серверот може да обработува други request-и додека чека база
//Database операции што враќаат Promise:
// find()
// save()
// create()
// findById()
// findByIdAndUpdate()
// findByIdAndDelete()
//async функција автоматски враќа Promise.
// Пример:
// async function test() {
//    return 5;
// }
// Ова реално враќа:  Promise { 5 }
//Promise =  „Ќе ти дадам резултат подоцна“
// async/await = „Ќе почекам додека не го добијам резултатот“