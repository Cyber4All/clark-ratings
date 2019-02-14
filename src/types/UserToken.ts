export interface UserToken {
    username: string;
    name: string;
    email: string;
    organization: string;
    emailVerified: boolean;
    accessGroups: string[];
}

export const UserRole = {
    ADMIN: 'admin',
    EDITOR: 'editor',
    CURATOR: 'curator',
    REVIEWER: 'reviewer',
    USER: 'user',
};

