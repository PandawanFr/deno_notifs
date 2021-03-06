import { unwrapResponse, opSync } from "./plugin.ts";

export type Icon = {
  /**
   * **(MACOS)** Name of the application to use the icon from.
   * 
   * Note: macOS does not explicitly support custom icons. 
   * To circumvent this, this option pretends your notifications are sent the given application.
   */
  app: string;
} | {
  /**
   * **(UNIX, WINDOWS)** A file:// URL to the icon.
   */
  path: string;
} | {
  /**
   * **(UNIX)** Name of the icon in an icon theme, must be freedesktop.org compliant.
   */
  name: string;
};

export interface NotifyOptions {
  /**
   * Single line title of the notification.
   * Defaults to "deno_notify"
   */
  title?: string;
  /**
   * Multi-line message of the notification.
   * May support simple HTML markup on some platforms, see notify-rust.
   */
  message: string;
  /**
   * Icon to render the notification with.
   * Set to "terminal" by default or if the icon is not found.
   */
  icon?: Icon;
  /**
   * **(MACOS, WINDOWS)** Sound to play when showing the notification.
   */
  sound?: string;
}

const defaultOptions: NotifyOptions = {
  title: "deno_notify",
  message: "",
  icon: { name: "terminal" },
  sound: undefined,
};

export interface NotifyResult {}

/**
 * Send a simple notification with a message.
 * @param message
 * @example
 * ```ts
 * notify('My message');
 * ```
 */
export function notify(message: string): NotifyResult;
/**
 * Sends a notification with various options.
 * @param options
 * @example
 * ```ts
 * notify({
 *   title: 'Hello',
 *   message: 'World',
 *   icon: {
 *     app: "Terminal",
 *   },
 *   sound: "Basso",
 * });
 * ```
 */
export function notify(options: NotifyOptions): NotifyResult;
export function notify(
  options: string | NotifyOptions,
): NotifyResult {
  const data = typeof options === "string"
    ? {
      ...defaultOptions,
      message: options,
    }
    : { ...defaultOptions, ...options };

  return unwrapResponse(
    opSync("notify_send", data),
  );
}
