import { Osc } from "./osc";
import gsap from "gsap";

const OscSendHost = "255.255.255.255"; // OSC送信先IPアドレス
const OscSendPort = 50000; // OSC送信先ポート

class App {

	div: HTMLDivElement;

	constructor() {
		this.div = document.getElementById('app') as HTMLDivElement;
		// イベントリスナーの登録
		Osc.on(Osc.MESSAGE, this.onOscReceived);
		window.addEventListener('mousemove', this.onMouseMove);
		window.addEventListener('mousedown', this.onMouseDown);
		window.addEventListener('mouseup', this.onMouseUp);
		// Step800のセットアップ
		for (let i = 1; i<=4; i++) {
			const host = `10.0.0.${100+i}`;
			this.sendOsc(host, 50000, "/setDestIp",[],[]);
			this.sendOsc(host, 50000, "/setKval",["i", "i", "i", "i", "i"],[255, 60, 120, 120, 120]);
		}
	}

	/**
	 * マウス移動時の処理
	 * @param e
	 */
	onMouseMove = (e: MouseEvent) => {
		console.log(e);
		// this.sendOsc(OscSendHost, OscSendPort, "/mouse/position", ["f", "f"], [e.clientX, e.clientY]);
	}

	/**
	 * マウスボタンを押した時の処理
	 * @param e
	 */
	onMouseDown = (e: MouseEvent) => {
		console.log(e);
		// this.sendOsc(OscSendHost, OscSendPort, "/mouse/button", ["i"], [1]);
		// this.sendOsc("10.0.0.101", 50000, "/run",["i", "i"],[1, 200]);
	}

	/**
	 * マウスボタンを離した時の処理
	 * @param e
	 */
	onMouseUp = (e: MouseEvent) => {
		console.log(e);
		// this.sendOsc(OscSendHost, OscSendPort, "/mouse/button", ["i"], [0]);
		// this.sendOsc("10.0.0.101", 50000, "/softStop",["i"],[1]);
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
				gsap.to(this.div, { scale: Math.random() * 4 + 2, duration: 0.25, ease: "expo.out" });
			} else {
				gsap.to(this.div, { scale: 1, duration: 0.25, ease: "expo.out" });
			}
		}

		// OSC受信アドレスが"/mouse/position"の場合
		if (address == "/mouse/position") {
			const x = args[0] as number - this.div.getBoundingClientRect().width / 2 - window.innerWidth / 2;
			const y = args[1] as number - this.div.getBoundingClientRect().height / 2 - window.innerHeight / 2;
			gsap.to(this.div, { x, y, duration: 0.5, ease: "expo.out" });
		}
	};
}

function init(): void {
	window.addEventListener('DOMContentLoaded', () => new App())
}

init()
