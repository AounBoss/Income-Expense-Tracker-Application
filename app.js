import express from 'express';
import userRouter from './routes/route.js';
import categoryRouter from './routes/categories.route.js';
import transactionRouter from './routes/transaction.route.js';
const app = express();

app.use(express.json());
app.use((req,res,next) => {
    console.log("REQUEST","RECEIVED:",req.method,req.url);
    console.log("REQUEST BODY:", req.body);
    next();})
    app.get("/", (req, res) => {
    res.json({
        message: "Server is working"
    });
});
app.use("/api/v1/auth",userRouter);
app.use("/api/v1/categories",categoryRouter);
app.use("/api/v1/transactions",transactionRouter);


export default app;