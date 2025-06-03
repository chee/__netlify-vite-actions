import {defineConfig} from "vite"
import solid from "vite-plugin-solid"
import netlify from "@netlify/vite-plugin"

export default defineConfig({
	plugins: [solid(), netlify()],
})
