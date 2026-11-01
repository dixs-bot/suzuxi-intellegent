import { LoginForm } from "@/components/LoginForm";
export default function LoginPage({searchParams}:{searchParams:Promise<{setup?:string;next?:string}>}) {
 return <LoginForm searchParams={searchParams}/>;
}
