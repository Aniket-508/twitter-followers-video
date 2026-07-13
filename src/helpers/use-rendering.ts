import { useCallback, useMemo, useState } from "react";
import type { z } from "zod";

import { renderVideo } from "@/render/api";
import type { CompositionProps } from "@/types/schema";

export type State =
  | {
      status: "init";
    }
  | {
      status: "invoking";
    }
  | {
      progress: number;
      phase: string;
      status: "rendering";
    }
  | {
      status: "error";
      error: Error;
    }
  | {
      url: string;
      size: number;
      status: "done";
    };

export const useRendering = (
  id: string,
  inputProps: z.infer<typeof CompositionProps>
) => {
  const [state, setState] = useState<State>({
    status: "init",
  });

  const renderMedia = useCallback(async () => {
    setState({
      status: "invoking",
    });
    try {
      await renderVideo({
        id,
        inputProps,
        onProgress: (result) => {
          switch (result.type) {
            case "error": {
              setState({
                error: new Error(result.message),
                status: "error",
              });
              break;
            }
            case "done": {
              setState({
                size: result.size,
                status: "done",
                url: result.url,
              });
              break;
            }
            case "phase":
            case "progress": {
              setState({
                phase:
                  result.type === "phase" ? result.phase : "Rendering video...",
                progress: result.progress,
                status: "rendering",
              });
              break;
            }
            default: {
              break;
            }
          }
        },
      });
    } catch (error) {
      setState({
        error: error as Error,
        status: "error",
      });
    }
  }, [id, inputProps]);

  const undo = useCallback(() => {
    setState({ status: "init" });
  }, []);

  return useMemo(
    () => ({
      renderMedia,
      state,
      undo,
    }),
    [renderMedia, state, undo]
  );
};
