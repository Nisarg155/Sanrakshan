"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const mongoose_1 = __importDefault(require("mongoose"));
const passport_1 = __importDefault(require("passport"));
const express_session_1 = __importDefault(require("express-session"));
const connect_mongo_1 = __importDefault(require("connect-mongo"));
require("./config/passport");
const auth_1 = __importDefault(require("./routes/auth"));
const contract_1 = __importDefault(require("./routes/contract"));
const app = (0, express_1.default)();
const port = process.env.PORT || 8000;
// Middleware
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URI,
    credentials: true
}));
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Connect to MongoDB
        yield mongoose_1.default.connect(process.env.MONGODB_URI);
        console.log('Database Connected');
        // Initialize session store
        const store = connect_mongo_1.default.create({
            mongoUrl: process.env.MONGODB_URI,
            collectionName: 'sessions'
        });
        app.use((0, express_session_1.default)({
            secret: process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: false,
            store,
            cookie: {
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                maxAge: 24 * 60 * 60 * 1000, // 1 day
            },
        }));
        app.use(passport_1.default.initialize());
        app.use(passport_1.default.session());
        // Routes
        app.use('/auth', auth_1.default);
        app.use('/contract', contract_1.default);
        // Root route
        app.get('/', (req, res) => {
            res.send('Working');
        });
        // Start server
        app.listen(port, () => {
            console.log(`Server running on port: ${port}`);
        });
    }
    catch (error) {
        console.error('Error connecting to the database:', error);
        process.exit(1);
    }
}))();
