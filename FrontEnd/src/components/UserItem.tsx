type Props = {
    id:number;
    user_name:string; 
    position:string; 
    registration_date:string; 
    updated_at:string;
}

const UserItem = ({id, user_name, position, registration_date, updated_at}: Props) => {
    return(
        <div>
            <tr>
                <td>{id}</td>
                <td>{user_name}</td>
                <td>{position}</td>
                <td>{registration_date}</td>
                <td>{updated_at}</td>
            </tr>
        </div>
    )
}

export default UserItem;