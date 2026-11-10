import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";



import userRouter from './routes/route.js';
import categoryRouter from './routes/categories.route.js';
import transactionRouter from './routes/transaction.route.js';
import dashboardstatsRouter from './routes/dashboard.route.js';
import refreshTokenRouter from './routes/refreshToken.route.js';
const app = express();
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

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
app.use("/api/v1/dashboard",dashboardstatsRouter);
app.use("/api/v1/auth",refreshTokenRouter);


export default app;