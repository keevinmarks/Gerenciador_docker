import { deleteCookies } from "@/actions/deleteCookies";
import LoginBox from "@/components/LoginBox";


const LoginPage = () => {
  
  return(
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-gradient-to-b from-yellow-100 to-yellow-600">
      <LoginBox></LoginBox>
    </div>
  )
}


export default LoginPage;