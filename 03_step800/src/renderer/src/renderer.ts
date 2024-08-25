import { Direction, Step800, SwMode } from "@starryworks_inc/step-series";
import { Osc } from "./osc";

const Step800BoardId = 1; // Step800のボードID
const Step800MotorId = 1; // 使うモーターのID
const Step800holdKval = 80;
const Step800RunKval = 160;


class App {
	step800: Step800;

	constructor() {

		// Step800の初期設定
		this.step800 = new Step800();
		this.step800.setup(Step800BoardId, [Step800MotorId], this.sendOsc);
		this.step800.setKval(Step800MotorId, Step800holdKval, Step800RunKval, Step800RunKval, Step800RunKval); // 電圧設定
		this.step800.setHomeSwMode(Step800MotorId, SwMode.hardStopInterrupt); // ホーミングスイッチさ同時の挙動
		this.step800.setHomingDirection(Step800MotorId, Direction.reverse); // ホーミングの方向
		this.step800.setSpeedProfile(Step800MotorId, 300, 300, 500); // 加速度, 減速度, 最大速度
		this.step800.setHomingSpeed(Step800MotorId, 500); // ホーミング速度
		this.step800.setGoUntilTimeout(Step800MotorId, 60000); // GoUntilのタイムアウト
		this.step800.homing(Step800MotorId); // ホーミング実行


		// イベントリスナーの登録
		Osc.on(Osc.MESSAGE, this.onOscReceived);
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
		const rotation = Math.random() * 10; // 0-10のランダムな回転数
		this.step800.goToByAngle(Step800MotorId, 360 * rotation);
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
	};
}

function init(): void {
	window.addEventListener('DOMContentLoaded', () => new App())
}

init()
