// User Interface
export interface User {
    id: string;
    password_hash: string;
    mobile_no: string;
    level: number;
}

// Block Interface
export interface Block {
    id: number;
    name: string;
    description: string;
    image_url: string;
    floors:string;
}

// Lab Interface
export interface Lab {
    id: number;
    name: string;
    description: string;
    block_id: number; // References Block.id
    incharge_no: string; // References User.id
    floor:number;
}

// System Interface
export interface System {
    id: number;
    lab_id: number; // References Lab.id
    working: boolean;
    download_speed: number;
    upload_speed: number;
    ping: number;
    keyboard_working: boolean;
    mouse_working: boolean;
}

// Reported Problem Interface
export interface ReportedProblem {
    id: number
    system_id: number; // References System.id
    problem: string;
    reporter_id: string; // References User.id
}

// Problem Interface
export interface Problem {
    name: string;
}

export interface JWTPayload {
    reg_no: string;
}
