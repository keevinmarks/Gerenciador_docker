import { getUsers } from "@/actions/userAction";
import { User } from "@/types/types";
import UserManagerClient from "./UserManagerClient";

export default async function UserManagerServer() {
  // Fetch users on the server so the client UI receives initial data.
  let users: User[] = [];
  try {
    const resp = await getUsers();
    if (Array.isArray(resp)) users = resp;
  } catch (e) {
    console.error("Failed to fetch users on server:", e);
    users = [];
  }

  return <UserManagerClient initialUsers={users} />;
}
