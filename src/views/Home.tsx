import { ArrowRight } from "lucide-react";
import { ReactNode, useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/shadcn/Button";
import CursorGrid from "@/components/CursorGrid/CursorGrid";
import { LoginContext } from "../contexts/LoginContext";
import NavbarMenuLayout from "../layout/NavbarMenuLayout";

const Reveal = ({
	children,
	delay = 0,
	className = "",
}: {
	children: ReactNode;
	delay?: number;
	className?: string;
}) => {
	const ref = useRef<HTMLDivElement>(null);
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setVisible(true);
					observer.disconnect();
				}
			},
			{ threshold: 0.15 },
		);
		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	return (
		<div
			ref={ref}
			style={{ transitionDelay: `${delay}ms` }}
			className={`transition-all duration-700 ease-out ${
				visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
			} ${className}`}
		>
			{children}
		</div>
	);
};

const Home = () => {
	const { isLogin } = useContext(LoginContext);

	return (
		<NavbarMenuLayout yPad={false} xPad={false}>
			<div className="flex h-screen flex-col bg-background">
				{/* Hero */}
				<section className="relative flex flex-1 items-center overflow-hidden">
					<div
						className="pointer-events-none absolute inset-0"
						style={{
							background:
								"radial-gradient(60% 50% at 50% 0%, hsl(142 76% 36% / 0.08) 0%, transparent 100%)",
						}}
					/>
					<div className="absolute inset-0">
						<CursorGrid
							color="#16a34a"
							cellSize={60}
							radius={160}
							fadeDuration={900}
							maxOpacity={0.6}
						/>
					</div>
					<div className="relative mx-auto max-w-4xl px-6 py-24 text-center">
						<Reveal>
							<div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border bg-background px-4 py-1.5 text-sm text-muted-foreground shadow-sm">
								<span className="h-2 w-2 rounded-full bg-green-500" />
								Auto-grading platform for programming
							</div>
						</Reveal>
						<Reveal delay={100}>
							<h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-6xl sm:leading-tight">
								Practice. Submit.
								<br />
								Get graded{" "}
								<span className="inline-block bg-gradient-to-r from-green-600 to-emerald-400 bg-clip-text pb-1 text-transparent">
									instantly
								</span>
								.
							</h1>
						</Reveal>
						<Reveal delay={200}>
							<p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
								แพลตฟอร์มฝึกเขียนโปรแกรมพร้อมระบบตรวจอัตโนมัติ —
								สร้างโจทย์ จัดคอร์ส ส่งโค้ด
								และติดตามผลได้ในที่เดียว
							</p>
						</Reveal>
						<Reveal delay={300}>
							<div className="mt-10 flex flex-wrap items-center justify-center gap-3">
								<Button size="lg" asChild>
									<Link to="/explore">
										Explore Problems
										<ArrowRight className="ml-2 h-4 w-4" />
									</Link>
								</Button>
								<Button size="lg" variant="outline" asChild>
									{isLogin ? (
										<Link to="/dashboard">Go to Dashboard</Link>
									) : (
										<Link to="/register">Get Started — Free</Link>
									)}
								</Button>
							</div>
						</Reveal>
					</div>
				</section>

				{/* Footer */}
				<footer className="border-t bg-secondary/40">
					<div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 py-10 sm:flex-row">
						<div className="text-sm text-muted-foreground">
							<span className="font-semibold text-foreground">
								Model<span className="text-green-600">Grader</span>
							</span>{" "}
							— แพลตฟอร์มตรวจโค้ดอัตโนมัติ
						</div>
						<nav className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
							<Link className="transition-colors hover:text-foreground" to="/explore">
								Explore
							</Link>
							<Link className="transition-colors hover:text-foreground" to="/courses">
								Courses
							</Link>
							{!isLogin && (
								<>
									<Link className="transition-colors hover:text-foreground" to="/login">
										Login
									</Link>
									<Link className="transition-colors hover:text-foreground" to="/register">
										Register
									</Link>
								</>
							)}
						</nav>
						<div className="text-xs text-muted-foreground">
							© {new Date().getFullYear()} ModelGrader
						</div>
					</div>
				</footer>
			</div>
		</NavbarMenuLayout>
	);
};

export default Home;
