export const VIDEO_FPS = 60;
export const VIDEO_DURATION_SECONDS = 7;
export const DURATION_IN_FRAMES = VIDEO_DURATION_SECONDS * VIDEO_FPS;

// Base resolution for scaling
export const BASE_WIDTH = 640;
export const BASE_HEIGHT = 360;

// Target resolution
export const VIDEO_WIDTH = 1920;
export const VIDEO_HEIGHT = 1080;

// Scale factor (change VIDEO_WIDTH/VIDEO_HEIGHT and everything scales automatically)
export const SCALE = VIDEO_WIDTH / BASE_WIDTH;

export const COMP_NAME = "MyComp";

export const COOLDOWN_SECONDS = 60; // 1 minute
export const COOKIE_NAME = "render-cooldown";
