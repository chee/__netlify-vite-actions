import {createResource, For} from "solid-js"
import solidLogo from "./assets/solid.svg"
import netlifyLogo from "./assets/netlify.svg"
import viteLogo from "/vite.svg"
import "./App.css"
import type {Action} from "./types.ts"
export const choices = ["buy milk", "buy egg", "buy bread", "buy cheese"]

function App() {
	const [actions, {refetch}] = createResource(async () => {
		const res = await fetch("/actions")
		if (!res.ok)
			console.error(
				new Error(
					`Failed to fetch actions: ${res.status} ${await res.text()}`
				)
			)
		const data = await res.json()

		return data.actions as Action[]
	})

	async function addAction(action: Omit<Action, "key">) {
		const res = await fetch("/actions", {
			method: "POST",
			body: JSON.stringify(action),
		})
		if (!res.ok)
			console.error(
				new Error(`Failed to add action: ${res.status} ${await res.text()}`)
			)
		refetch()
	}

	async function completeAction(action: Action) {
		const res = await fetch("/actions", {
			method: "DELETE",
			body: JSON.stringify(action),
		})
		if (!res.ok)
			console.error(
				new Error(`Failed to add action: ${res.status} ${await res.text()}`)
			)
		refetch()
	}

	return (
		<>
			<div>
				<a href="https://vite.dev" target="_blank">
					<img src={viteLogo} class="logo" alt="Vite logo" />
				</a>
				<a href="https://netlify.com" target="_blank">
					<img src={netlifyLogo} class="logo netlify" alt="Netlify logo" />
				</a>
				<a href="https://solidjs.com" target="_blank">
					<img src={solidLogo} class="logo solid" alt="Solid logo" />
				</a>
			</div>
			<h1>Vite + Netlify + Solid</h1>
			<div class="card">
				<div class="choices">
					<For each={choices}>
						{(text, choice) => {
							return (
								<button onClick={() => addAction({choice: choice()})}>
									{text}
								</button>
							)
						}}
					</For>
				</div>
			</div>
			<div class="card">
				<ul class="actions">
					<For each={actions()}>
						{action => {
							const text = choices[action.choice]
							return (
								<li class="action">
									<button
										class="action__complete"
										aria-label={`complete ${text}`}
										onClick={() => completeAction(action)}></button>
									<span class="action__text">{text}</span>
								</li>
							)
						}}
					</For>
				</ul>
			</div>
		</>
	)
}

export default App
