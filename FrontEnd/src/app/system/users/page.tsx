import ButtonLogoff from "@/components/ButtonLogoff";

const UsersPage = () => {
    return(
        <div className="bg-gray-400 border-4 border-solid border-gray-800 rounded-md h-96 overflow-hidden">
            <table className="w-full align-middle">
                <thead>
                    <tr className="text-black">
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Posição</th>
                        <th>Data de registro</th>
                        <th>Última atualização</th>
                    </tr>
                </thead>
            </table>
        </div>
    )
}

export default UsersPage;