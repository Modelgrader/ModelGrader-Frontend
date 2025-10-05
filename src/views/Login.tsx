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
// import { getAuthorization, login } from "@/services/auth.service";

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
				const account = response.data;
				localStorage.setItem("account_id", String(account.account_id));
				localStorage.setItem("username", account.username);
				if (account.token) {
					localStorage.setItem("token", account.token);
				}
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
