export type User = {
    id?:number;
    user_name?:string;
    position?:string;
    level_user?:number;
    password_user?:string;
    registration_date?:string;
    updated_at?:string;
    reset_password?:number;
}
export type Computer = {
    id_computer?: number
    name_computer: string;
    type_computer:string;
    mac_computer: string;
    asset_number: number;
    status_computer: number;
    exit_date: string;
    reason: string;
    return_date: string;
}

export type Printer = {
  id_printer: number;
  name_printer: string;
  mac_printer: string;
  asset_number: number;
  status_printer: number;
  exit_date?: string | null;
  reason?: string | null;
  return_date?: string | null;
};

