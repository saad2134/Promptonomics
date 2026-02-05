import { PopupMessage, InjectedMessage } from "./types";

export function isExtensionMessage(
  message: unknown
): message is PopupMessage {
  return (
    typeof message === "object" &&
    message !== null &&
    "type" in message &&
    typeof (message as Record<string, unknown>).type === "string"
  );
}

export function isInjectedMessage(
  message: unknown
): message is InjectedMessage {
  return (
    typeof message === "object" &&
    message !== null &&
    "type" in message &&
    typeof (message as Record<string, unknown>).type === "string"
  );
}
