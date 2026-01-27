export const ERROR_MAP = {
    NOT_FOUND: { status: 404, message: "URL not found" },
    EXPIRED: { status: 410, message: "Link has expired" }
} as const;
