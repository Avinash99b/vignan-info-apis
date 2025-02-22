import {User} from "../Routes/v1/DbEntites";

declare global{
    namespace Express{
        interface Request {
            forwardWithError: (error: string, errorCode?: number) => void;
            forwardWithMessage: (message: string) => void;
            user?:User|null
        }
    }
}

