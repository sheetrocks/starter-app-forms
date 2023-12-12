export enum Method {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE",
    PATCH = "PATCH",
}

export type Request = {
    method: Method;
    user: {
        email: string;
        name: string;
    };
    query: {
    };
    body: {
    };
};

export enum AccessError {
    NO_USER = "NO_USER",
    NOT_AUTHORIZED = "NOT_AUTHORIZED",
    SYSTEM_ERROR = "SYSTEM_ERROR",
}

export type User = {
    email: string;
    name : string;
};