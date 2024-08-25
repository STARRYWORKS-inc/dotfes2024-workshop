import { Osc } from "./osc";

const OscSendHost = "10.0.0.11"; // 送信先IPアドレス（講師のPCのIPアドレス）
const OscSendPort = 50000; // 送信先ポート（講師のPCの受信ポート）

class App {

	div: HTMLDivElement;

	constructor() {
		this.div = document.getElementById('app') as HTMLDivElement;
		// OSC受信イベント
		Osc.on(Osc.MESSAGE, this.onOscReceived);
		// マウスイベント
		window.addEventListener('mousemove', this.onMouseMove);
		window.addEventListener('mousedown', this.onMouseDown);
		window.addEventListener('mouseup', this.onMouseUp);
	}

	/**
	 * マウス移動時の処理
	 * @param e
	 */
	onMouseMove = (e: MouseEvent) => {
		console.log(e);
	}

	/**
	 * マウスボタンを押した時の処理
	 * @param e
	 */
	onMouseDown = (e: MouseEvent) => {
		console.log(e);
	}

	/**
	 * マウスボタンを離した時の処理
	 * @param e
	 */
	onMouseUp = (e: MouseEvent) => {
		console.log(e);
	}

 /**
	* OSCを送信
	* @param host
	* @param port
	* @param address
	* @param types
	* @param args
	*/
	sendOsc: (
		host: string,
		port: number,
		address: string,
		types: string[],
		args: (string | number | boolean | null | Blob)[],
	) => void = (host, port, address, types, args) => {
		// OSCメッセージの送信
		Osc.send(host, port, address, types, args);
	};

 /**
	* OSC受信時の処理
	* @param host
	* @param address
	* @param args
	*/
	onOscReceived = (
		host: string,
		address: string,
		args: (number | string | Blob | null)[],
	): void => {
		console.log({ host, address, args });
		// OSC受信アドレスが"/mouse/button"の場合
		if (address == "/mouse/button") {
			if (args[0] == 1) {
				this.div.style.transform = "scale(3)";
			} else {
				this.div.style.transform = "scale(1)";
			}
		}
		// OSC受信アドレスが"/mouse/position"の場合
		if (address == "/mouse/position") {
			const x = args[0] as number - this.div.getBoundingClientRect().width / 2;
			const y = args[1] as number - this.div.getBoundingClientRect().height / 2;
			this.div.style.position = "absolute";
			this.div.style.left = x + "px";
			this.div.style.top = y + "px";
		}
	};
}

function init(): void {
	window.addEventListener('DOMContentLoaded', () => new App())
}

init()
