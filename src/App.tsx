import { ThemeProvider } from "./providers/theme-providers";

function App() {
	return (
		<ThemeProvider defaultTheme="system">
			<div>Initial Config</div>
		</ThemeProvider>
	);
}

export default App;
