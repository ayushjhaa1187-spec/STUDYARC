import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  requestId: string;
}

export function generateRequestId(): string {
  return crypto.randomUUID();
}

export function apiSuccess<T>(data: T, requestId: string, init?: ResponseInit): Response {
  const body: ApiResponse<T> = {
    success: true,
    data,
    requestId,
  };
  return new Response(JSON.stringify(body), {
    status: 200,
    ...init,
    headers: {
      "Content-Type": "application/json",
      "x-request-id": requestId,
      ...(init?.headers || {}),
    },
  });
}

export function apiError(
  code: string,
  message: string,
  requestId: string,
  status = 400,
  details?: any,
  init?: ResponseInit
): Response {
  const body: ApiResponse = {
    success: false,
    error: { code, message, details },
    requestId,
  };
  return new Response(JSON.stringify(body), {
    status,
    ...init,
    headers: {
      "Content-Type": "application/json",
      "x-request-id": requestId,
      ...(init?.headers || {}),
    },
  });
}

/**
 * Wraps a handler with Zod validation.
 */
export function withValidation<T>(
  schema: z.ZodSchema<T>,
  handler: (validatedData: T, req: Request, requestId: string) => Promise<Response>
) {
  return async (req: Request): Promise<Response> => {
    const requestId = req.headers.get("x-request-id") || generateRequestId();
    try {
      // Handle GET vs POST
      let data;
      if (req.method === "GET") {
        const url = new URL(req.url);
        const entries = Object.fromEntries(url.searchParams.entries());
        data = entries;
      } else {
        data = await req.json();
      }

      const parsed = schema.safeParse(data);
      if (!parsed.success) {
        return apiError("VALIDATION_ERROR", "Invalid request payload", requestId, 400, parsed.error.format());
      }

      return await handler(parsed.data, req, requestId);
    } catch (err: any) {
      console.error("Handler error:", err);
      return apiError("INTERNAL_SERVER_ERROR", "An unexpected error occurred", requestId, 500, err.message);
    }
  };
}

/**
 * Wraps a handler with Idempotency logic using Supabase database.
 */
export function withIdempotency(
  handler: (req: Request, requestId: string) => Promise<Response>
) {
  return async (req: Request): Promise<Response> => {
    const requestId = req.headers.get("x-request-id") || generateRequestId();
    const idempotencyKey = req.headers.get("idempotency-key");

    if (!idempotencyKey) {
      // If no key is provided, we either require it or bypass. For safety, let's bypass if not strictly required,
      // but log a warning. Alternatively, return 400. We will bypass here to allow flexible usage.
      return await handler(req, requestId);
    }

    // Initialize Supabase admin client to bypass RLS (Service Role)
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // 1. Try to acquire the idempotency lock
    const { data: existingKey, error: fetchError } = await supabaseAdmin
      .from("idempotency_keys")
      .select("*")
      .eq("key", idempotencyKey)
      .maybeSingle();

    if (fetchError) {
      console.error("Idempotency fetch error:", fetchError);
      return apiError("INTERNAL_SERVER_ERROR", "Failed to check idempotency key", requestId, 500);
    }

    if (existingKey) {
      if (existingKey.status === "completed") {
        // Return the cached response
        return new Response(JSON.stringify(existingKey.response_body), {
          status: existingKey.response_code,
          headers: {
            "Content-Type": "application/json",
            "x-request-id": requestId,
            "x-idempotent-replayed": "true",
          },
        });
      } else if (existingKey.status === "processing") {
        return apiError("CONFLICT", "Request is already being processed", requestId, 409);
      }
    }

    // 2. Insert as processing
    const { error: insertError } = await supabaseAdmin
      .from("idempotency_keys")
      .upsert({
        key: idempotencyKey,
        status: "processing",
      }, { onConflict: 'key' });

    if (insertError) {
      console.error("Idempotency insert error:", insertError);
      return apiError("INTERNAL_SERVER_ERROR", "Failed to lock idempotency key", requestId, 500);
    }

    // 3. Execute the handler
    let response: Response;
    try {
      response = await handler(req, requestId);
    } catch (err: any) {
      // Update as failed
      await supabaseAdmin.from("idempotency_keys").update({ status: "failed" }).eq("key", idempotencyKey);
      throw err;
    }

    // 4. Update the key as completed and save response
    const clonedResponse = response.clone();
    let responseBody = {};
    try {
      responseBody = await clonedResponse.json();
    } catch {
      // Body might not be JSON, ignore or handle accordingly
    }

    await supabaseAdmin
      .from("idempotency_keys")
      .update({
        status: "completed",
        response_code: response.status,
        response_body: responseBody,
      })
      .eq("key", idempotencyKey);

    return response;
  };
}
