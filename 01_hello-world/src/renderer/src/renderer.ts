class App {
	constructor() {
		console.log('Hello, World!')
	}
}

function init(): void {
	window.addEventListener('DOMContentLoaded', () => new App())
}

init()
