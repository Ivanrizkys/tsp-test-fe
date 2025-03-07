import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLoginMutation } from "@/service/auth";
import { useUserStore } from "@/store/user";
import Cookies from "js-cookie";
import { Loader2 } from "lucide-react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";

interface LoginFormValues {
	email: string;
	password: string;
}

export default function Login() {
	const setUser = useUserStore((state) => state.setUser);

	const navigate = useNavigate();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormValues>();
	const { mutate: doLogin, isPending: isPendingLoading } = useLoginMutation();

	const handleLogin: SubmitHandler<LoginFormValues> = async (data) => {
		doLogin(
			{
				email: data.email,
				password: data.password,
			},
			{
				onSuccess: (res) => {
					Cookies.set("token", res.data.token, { expires: 0.25 }); // 6 hours = 0.25 days
					setUser(res.data.user);
					toast("Login Successful", {
						description: "Welcome back! You have successfully logged in.",
					});
					navigate("/");
				},
				onError: (error) => {
					toast.error("Login Failed", {
						description: ` ${error.message}. Please check your credentials and try again.`,
					});
					import.meta.env.DEV && console.error("Error occuered", error);
				},
			},
		);
	};

	return (
		<main className="w-full lg:grid lg:grid-cols-2 h-full min-h-dvh">
			<section className="hidden bg-muted lg:block" />
			<section className="flex items-center justify-center py-12 px-5 sm:px-0">
				<div className="mx-auto grid w-[350px] gap-6">
					<div className="grid gap-2 text-center">
						<h1 className="text-3xl font-bold">Login</h1>
						<p className="text-balance text-muted-foreground">
							Enter your email below to login to your account
						</p>
					</div>
					<form className="grid gap-4" onSubmit={handleSubmit(handleLogin)}>
						<div className="grid gap-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								placeholder="m@example.com"
								autoComplete="email"
								aria-invalid={errors.email ? "true" : "false"}
								{...register("email", {
									required: "Email can't be empty!",
									pattern: {
										value: /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/,
										message: "Email must be valid!",
									},
								})}
							/>
							{errors.email && (
								<span role="alert" className="text-destructive text-sm -mt-1">
									{errors.email?.message}
								</span>
							)}
						</div>
						<div className="grid gap-2">
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								type="password"
								placeholder="******"
								autoComplete="current-password"
								aria-invalid={errors.password ? "true" : "false"}
								{...register("password", {
									required: "Password can't be empty!",
								})}
							/>
							{errors.password && (
								<span role="alert" className="text-destructive text-sm -mt-1">
									{errors.password?.message}
								</span>
							)}
						</div>
						<Button type="submit" className="w-full">
							Login
							{isPendingLoading && <Loader2 className="w-4 h-4 animate-spin" />}
						</Button>
					</form>
				</div>
			</section>
		</main>
	);
}
