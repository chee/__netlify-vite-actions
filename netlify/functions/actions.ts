import type {Action} from "../../src/types.ts"
import {getStore} from "@netlify/blobs"

export default async function (request: Request) {
	const store = getStore("actions")
	if (request.method === "GET") {
		console.log("getting actions")
		// Get the current counter value
		const value = await store.list({prefix: "actions/"})
		const actions = await Promise.all(
			value.blobs.map(async blob => {
				const content = await store.get(blob.key, {type: "json"})
				return {
					...content,
					key: blob.key.replace(/^actions\//, ""),
				} as Action
			})
		)
		return Response.json({actions: actions.toReversed()})
	}

	if (request.method === "POST") {
		console.log("adding action")
		// Increment the counter

		const {choice} = (await request.json()) as Action

		const key = new Date().getTime()
		console.log(`actions/${key}`)
		await store.setJSON(`actions/${key}`, {choice, done: false})
		return Response.json({key})
	}

	if (request.method === "DELETE") {
		console.log("deleting action")
		// Delete an action
		const {key} = (await request.json()) as {key: string}
		console.log(`actions/${key}`)
		await store.delete(`actions/${key}`)
		return Response.json({key, deleted: true})
	}

	return new Response("Method Not Allowed", {status: 405})
}

export const config = {
	path: "/actions",
}
