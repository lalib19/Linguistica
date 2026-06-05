import { NextRequest, NextResponse } from "next/server";
import { getRedisClient } from "@/src/lib/redis";

export const runtime = "nodejs";

function isAuthorized(request: NextRequest): boolean {
    const cronSecret = process.env.CRON_SECRET;

    // If no secret is configured, allow calls (useful for local development).
    if (!cronSecret) {
        return true;
    }

    const authHeader = request.headers.get("authorization");
    return authHeader === `Bearer ${cronSecret}`;
}

export async function GET(request: NextRequest) {
    if (!isAuthorized(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const redis = await getRedisClient();

        if (!redis) {
            return NextResponse.json(
                { error: "Redis client unavailable" },
                { status: 503 }
            );
        }

        const now = new Date().toISOString();
        await redis.set("system:keepalive:lastSeen", now, { EX: 60 * 60 * 24 * 14 });
        await redis.get("system:keepalive:lastSeen");

        return NextResponse.json({
            ok: true,
            message: "Redis keepalive succeeded",
            timestamp: now,
        });
    } catch (error) {
        console.error("Redis keepalive failed:", error);
        return NextResponse.json(
            { ok: false, error: "Redis keepalive failed" },
            { status: 500 }
        );
    }
}