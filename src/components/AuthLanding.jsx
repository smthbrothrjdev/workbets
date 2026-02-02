import { useState } from "react";
import PropTypes from "prop-types";

export function AuthLanding({
	username,
	password,
	error,
	isSubmitting,
	onUsernameChange,
	onPasswordChange,
	onSubmit,
	registerEmail,
	registerPassword,
	registerWorkplace,
	registerError,
	registerSuccess,
	isRegistering,
	workplaces,
	onRegisterEmailChange,
	onRegisterPasswordChange,
	onRegisterWorkplaceChange,
	onRegisterSubmit,
}) {
	const [isRegisterOpen, setRegisterOpen] = useState(false);

	return (
		<main className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-16">
			<section className="grid gap-8 lg:items-start">
				<div
					className="rounded-3xl bg-gradient-to-br from-indigo-50 via-white to-sky p-10 shadow-soft"
					id="sign-in"
				>
					<p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-500">
						Work Bets
					</p>
					<h1 className="mt-4 text-4xl font-semibold text-slate-900">
						Care to make a friendly wager?
					</h1>
					<p className="mt-4 text-base text-slate-600">
						Sign in to join the fun, make wagers, and vote in your offices pool.
					</p>
					<div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
						<div>
							<p className="text-sm font-semibold text-slate-500">
								Demo only: Use riley@workbets.io with workbets123 to explore.
							</p>
							<h2 className="mt-2 text-2xl font-semibold text-slate-900">
								Sign in to Work Bets
							</h2>
							<form className="mt-6 space-y-4" onSubmit={onSubmit}>
								<label className="block text-sm font-medium text-slate-600">
									Username (email)
									<input
										className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
										placeholder="Enter your username"
										value={username}
										onChange={(event) => onUsernameChange(event.target.value)}
										autoComplete="username"
										required
									/>
								</label>
								<label className="block text-sm font-medium text-slate-600">
									Password
									<input
										className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
										placeholder="Enter your password"
										type="password"
										value={password}
										onChange={(event) => onPasswordChange(event.target.value)}
										autoComplete="current-password"
										required
									/>
								</label>
								{error ? (
									<p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600">
										{error}
									</p>
								) : null}
								<button
									type="submit"
									className="flex w-full items-center justify-center rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-indigo-300"
									disabled={isSubmitting}
								>
									{isSubmitting ? "Signing in..." : "Sign in"}
								</button>
							</form>
							<div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
								<p className="font-semibold text-slate-800">Need an account?</p>
								<p className="mt-1 text-sm text-slate-500">
									<button
										className="font-semibold text-indigo-600 hover:text-indigo-500"
										type="button"
										onClick={() => setRegisterOpen(true)}
									>
										Register
									</button>{" "}
									with your work email and pick a workplace to get started.
								</p>
							</div>
						</div>
					</div>
				</div>

			</section>
			{isRegisterOpen ? (
				<div className="fixed inset-0 z-20 flex items-center justify-center bg-slate-900/40 p-6">
					<div className="w-full max-w-xl rounded-3xl bg-white p-8 shadow-soft">
						<div className="flex items-start justify-between gap-4">
							<div>
								<p className="text-sm font-semibold text-slate-500">New here?</p>
								<h2 className="mt-2 text-2xl font-semibold text-slate-900">
									Register your workplace
								</h2>
							</div>
							<button
								className="rounded-full border border-slate-200 px-3 py-1 text-sm font-semibold text-slate-500 transition hover:border-slate-300 hover:text-slate-700"
								type="button"
								onClick={() => setRegisterOpen(false)}
							>
								Close
							</button>
						</div>
						<form className="mt-6 space-y-4" onSubmit={onRegisterSubmit}>
							<label className="block text-sm font-medium text-slate-600">
								Work email
								<input
									className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
									placeholder="you@company.com"
									type="email"
									value={registerEmail}
									onChange={(event) => onRegisterEmailChange(event.target.value)}
									autoComplete="email"
									required
								/>
							</label>
							<label className="block text-sm font-medium text-slate-600">
								Password
								<input
									className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
									placeholder="Create a secure password"
									type="password"
									value={registerPassword}
									onChange={(event) =>
										onRegisterPasswordChange(event.target.value)
									}
									autoComplete="new-password"
									required
								/>
								<span className="mt-2 block text-xs text-slate-400">
									5-24 characters, with at least three of: numbers, letters,
									special characters, or ASCII symbols.
								</span>
							</label>
							<label className="block text-sm font-medium text-slate-600">
								Workplace
								<select
									className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
									value={registerWorkplace}
									onChange={(event) =>
										onRegisterWorkplaceChange(event.target.value)
									}
									disabled={workplaces.length === 0}
								>
									{workplaces.length === 0 ? (
										<option value="">
											No workplaces yet — we&apos;ll create one for you.
										</option>
									) : (
										workplaces.map((workplace) => (
											<option key={workplace.id} value={workplace.id}>
												{workplace.name}
											</option>
										))
									)}
								</select>
							</label>
							{registerError ? (
								<p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600">
									{registerError}
								</p>
							) : null}
							{registerSuccess ? (
								<p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
									{registerSuccess}
								</p>
							) : null}
							<button
								type="submit"
								className="flex w-full items-center justify-center rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-indigo-300"
								disabled={isRegistering}
							>
								{isRegistering ? "Registering..." : "Register"}
							</button>
						</form>
						<p className="mt-4 text-xs text-slate-400">
							All workplaces are public while we validate access.
						</p>
					</div>
				</div>
			) : null}
		</main>
	);
}

AuthLanding.propTypes = {
	username: PropTypes.string.isRequired,
	password: PropTypes.string.isRequired,
	error: PropTypes.string,
	isSubmitting: PropTypes.bool.isRequired,
	onUsernameChange: PropTypes.func.isRequired,
	onPasswordChange: PropTypes.func.isRequired,
	onSubmit: PropTypes.func.isRequired,
	registerEmail: PropTypes.string.isRequired,
	registerPassword: PropTypes.string.isRequired,
	registerWorkplace: PropTypes.string.isRequired,
	registerError: PropTypes.string,
	registerSuccess: PropTypes.string,
	isRegistering: PropTypes.bool.isRequired,
	workplaces: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.string.isRequired,
			name: PropTypes.string.isRequired,
		})
	).isRequired,
	onRegisterEmailChange: PropTypes.func.isRequired,
	onRegisterPasswordChange: PropTypes.func.isRequired,
	onRegisterWorkplaceChange: PropTypes.func.isRequired,
	onRegisterSubmit: PropTypes.func.isRequired,
};

AuthLanding.defaultProps = {
	error: null,
	registerError: null,
	registerSuccess: null,
};
