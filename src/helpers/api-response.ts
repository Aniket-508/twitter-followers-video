import { NextResponse } from "next/server";
import type { z, ZodType } from "zod";

export type ApiResponse<Res> =
  | {
      type: "error";
      message: string;
    }
  | {
      type: "success";
      data: Res;
    };

export const executeApi =
  <Res, Req extends ZodType>(
    schema: Req,
    handler: (req: Request, body: z.infer<Req>) => Promise<Res>
  ) =>
  async (req: Request) => {
    try {
      const payload = await req.json();
      const parsed = schema.parse(payload);
      const data = await handler(req, parsed);
      return NextResponse.json({
        data,
        type: "success",
      });
    } catch (error) {
      return NextResponse.json(
        { message: (error as Error).message, type: "error" },
        {
          status: 500,
        }
      );
    }
  };
