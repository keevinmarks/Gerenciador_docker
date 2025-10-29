export type Computer = {
    id_computer?: number
    name_computer: string;
    type_computer:string;
    mac_computer: string;
    asset_number: number;
    status_computer: number;
    exit_date: string | null;
    reason: string;
    return_date: string | null;
}

export type User = {
    id?: number;
    user_name: string;
    email_user: string;
    position: string;
    level_user: number;
    status_user: boolean;
    password_user?: string;
    registration_date?: string;
    updated_at?: string | null;
    reset_password?: boolean;
    path_img?: string;
}