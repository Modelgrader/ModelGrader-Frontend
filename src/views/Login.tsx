import React, { useState } from "react";

import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "../components/shadcn/Button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../components/shadcn/Card";
import { Checkbox } from "../components/shadcn/Checkbox";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../components/shadcn/Form";
import { Input } from "../components/shadcn/Input";
import CenterContainer from "../layout/CenterLayout";
import { AuthService } from "@/services/Auth.service";
import { initiateGoogleLogin } from "@/services/GoogleAuth.service";

const Login = () => {
	const form = useForm();

	const [loading, setLoading] = useState(false);
	const [userNotFound, setUserNotFound] = useState(false);
	const [wrongPassword, setWrongPassword] = useState(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);
		setWrongPassword(false);
		setUserNotFound(false);
		const { username, password } = form.getValues();
		AuthService.login({
			username,
			password,
		}).then((response) => {
			if (response.status < 400) {
				const data = response.data as any;
				localStorage.setItem("account_id", String(data.account_id));
				localStorage.setItem("username", data.username);
				localStorage.setItem("access_token", data.access_token);
				localStorage.setItem("refresh_token", data.refresh_token);
				window.location.href = "/dashboard";
			}
			setLoading(false);
		}).catch((error) => {
			if (error.response.status === 404) {
				setUserNotFound(true);
			}
			else if (error.response.status === 406) {
				setWrongPassword(true);
			}
			setLoading(false);
		})
	};

	return (
		<CenterContainer className="w-[350px]">
			<Card>
				<CardHeader>
					<CardTitle>Login</CardTitle>
					<CardDescription>Login to your account</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form
							onSubmit={(e) => handleSubmit(e)}
							className="space-y-4"
						>
							<FormField
								control={form.control}
								name="username"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Username</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage>
											{userNotFound && "User doesn't exist."}
										</FormMessage>
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Password</FormLabel>
										<FormControl>
											<Input type="password" {...field} />
										</FormControl>
										<FormMessage>
											{wrongPassword && "Wrong password."}
										</FormMessage>
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="remember"
								render={({ field }) => (
									<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md pt-2">
										<FormControl>
											<Checkbox
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										</FormControl>
										<FormLabel className="cursor-pointer">
											Remember Me
										</FormLabel>
									</FormItem>
								)}
							/>

							<Button
								disabled={loading}
								className="w-full"
								type="submit"
							>
								{loading ? (
									<>
										<Loader2 className="animate-spin mr-2" />
										Logging
									</>
								) : (
									<>Login</>
								)}
							</Button>

							<div className="relative my-2">
								<div className="absolute inset-0 flex items-center">
									<span className="w-full border-t" />
								</div>
								<div className="relative flex justify-center text-xs uppercase">
									<span className="bg-background px-2 text-muted-foreground">or</span>
								</div>
							</div>

							<Button
								type="button"
								variant="outline"
								className="w-full"
								onClick={() => initiateGoogleLogin()}
							>
								<svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
									<path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
									<path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
									<path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
									<path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
								</svg>
								Continue with Google
							</Button>
						</form>
					</Form>
					<CardDescription className="mt-2">
						Doesn't has an account? Create one{" "}
						<a className="underline text-blue-700" href="/register">
							here
						</a>
					</CardDescription>
				</CardContent>
			</Card>
		</CenterContainer>
	);
};

export default Login;
