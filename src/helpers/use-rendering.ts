import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { z } from "zod";

import type { CompositionProps } from "@/types/schema";

import { getProgress, renderVideo } from "../lambda/api";

export type State =
  | {
      status: "init";
    }
  | {
      status: "invoking";
    }
  | {
      renderId: string;
      bucketName: string;
      progress: number;
      status: "rendering";
    }
  | {
      renderId: string | null;
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
  const pollProgressRef = useRef<
    ((params: { bucketName: string; renderId: string }) => Promise<void>) | null
  >(null);

  const pollProgress = useCallback(
    async ({
      bucketName,
      renderId,
    }: {
      bucketName: string;
      renderId: string;
    }): Promise<void> => {
      const progressResult = await getProgress({
        bucketName,
        id: renderId,
      });
      switch (progressResult.type) {
        case "error": {
          setState({
            error: new Error(progressResult.message),
            renderId,
            status: "error",
          });
          break;
        }
        case "done": {
          setState({
            size: progressResult.size,
            status: "done",
            url: progressResult.url,
          });
          break;
        }
        case "progress": {
          setState({
            bucketName,
            progress: progressResult.progress,
            renderId,
            status: "rendering",
          });
          window.setTimeout(() => {
            void pollProgressRef.current?.({ bucketName, renderId });
          }, 1000);
          break;
        }
        default: {
          break;
        }
      }
    },
    []
  );
  useEffect(() => {
    pollProgressRef.current = pollProgress;
  }, [pollProgress]);

  const renderMedia = useCallback(async () => {
    setState({
      status: "invoking",
    });
    try {
      const result = await renderVideo({ id, inputProps });

      if (result.type === "done") {
        setState({
          size: result.size,
          status: "done",
          url: result.url,
        });
        return;
      }

      const { renderId, bucketName } = result;
      setState({
        bucketName,
        progress: 0,
        renderId,
        status: "rendering",
      });

      await pollProgress({ bucketName, renderId });
    } catch (error) {
      setState({
        error: error as Error,
        renderId: null,
        status: "error",
      });
    }
  }, [id, inputProps, pollProgress]);

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
