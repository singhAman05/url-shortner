export const ERROR_MAP = {
    NOT_FOUND: {
        status: 404,
        message: "URL not found"
    },

    EXPIRED: {
        status: 410,
        message: "Link has expired"
    },

    DISABLED: {
        status: 403,
        message: "Link has been disabled"
    },

    INVALID_SHORT_KEY: {
        status: 400,
        message: "Invalid short URL"
    },

    INVALID_ORIGINAL_URL: {
        status: 400,
        message: "Invalid destination URL"
    },

    RATE_LIMITED: {
        status: 429,
        message: "Too many requests. Please try again later"
    },

    UNAUTHORIZED: {
        status: 401,
        message: "Authentication required"
    },

    FORBIDDEN: {
        status: 403,
        message: "You do not have permission to access this resource"
    },

    DB_ERROR: {
        status: 500,
        message: "Database error occurred"
    },

    CACHE_ERROR: {
        status: 500,
        message: "Cache service unavailable"
    },

    SERVICE_UNAVAILABLE: {
        status: 503,
        message: "Service temporarily unavailable"
    },

    INTERNAL_ERROR: {
        status: 500,
        message: "Internal server error"
    }
} as const;
