interface IEmail {
    email: string;
    token: string;
    name: string;
}
export declare class AuthEmail {
    static sendConfirmationEmail: (user: IEmail) => Promise<void>;
    static sendPasswordResetToken: (user: IEmail) => Promise<void>;
}
export {};
