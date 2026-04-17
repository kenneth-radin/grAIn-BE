module.exports = [
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/grAInBE/pages/api/test-mongo.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>handler
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$grAInBE$2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/grAInBE/node_modules/mongoose)");
;
const MONGO_URI = process.env.MONGO_URI;
let isConnected = false;
async function handler(req, res) {
    if (!MONGO_URI) {
        return res.status(500).json({
            error: "MONGO_URI not set in .env"
        });
    }
    if (!isConnected) {
        try {
            const db = await __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$grAInBE$2f$node_modules$2f$mongoose$29$__["default"].connect(MONGO_URI); // ✅ no options needed
            isConnected = db.connections[0].readyState === 1;
            console.log("MongoDB Connected:", isConnected);
        } catch (error) {
            console.error("MongoDB connection error:", error);
            return res.status(500).json({
                error: "Failed to connect",
                details: error
            });
        }
    }
    res.status(200).json({
        message: "MongoDB is connected!",
        status: isConnected
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0d7jin6._.js.map