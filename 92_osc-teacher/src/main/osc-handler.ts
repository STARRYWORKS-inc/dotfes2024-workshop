import osc from "osc";
import { BrowserWindow, IpcMainInvokeEvent, ipcMain } from "electron";
import { getPreferredLocalAddress } from "./utils";

const OscReceivePort = 50001;

/**
 * OSC通信をハンドリングするクラス
 */
export class OscHandler {
	mainWindow: BrowserWindow;
	udpPort: osc.UDPPort;
	ready: boolean = false;
	destroyed: boolean = false;

	/**
	 * コンストラクタ
	 * @param mainWindow
	 */
	constructor(mainWindow: BrowserWindow) {
		const ip = getPreferredLocalAddress("10.0.0");
		console.log(`----------\nlocal address: ${ip}\n----------\n`);
		this.mainWindow = mainWindow;
		this.udpPort = new osc.UDPPort({
			localPort: OscReceivePort,
			metadata: true,
			broadcast: true,
		});
		this.udpPort.options.localAddress = undefined; // osc.jsのバグ回避。これにより全てのアドレス宛のメッセージを受信する
		this.udpPort.on("message", this.onReceive);
		this.udpPort.open();
		this.udpPort.on("ready", () => {
			console.log("osc ready");
			this.ready = true;
		});
		ipcMain.handle("OscSend", this.onSend);
	}

	/**
	 * 破棄処理
	 */
	dispose(): void {
		this.ready = false;
		this.destroyed = true;
		this.udpPort.off("message", this.onReceive);
		this.udpPort.close();
		ipcMain.removeHandler("OscSend");
	}

	/**
	 * 受信したOSCメッセージをフロント側に受け渡す
	 * @param message
	 */
	onReceive = (oscMsg, _time, info): void => {
		if (this.destroyed) return;
		const address = oscMsg.address;
		const values: (number | string | Blob | null)[] = [];
		console.log({ address, oscMsg });
		oscMsg.args.map((arg) => {
			values.push(arg.value);
		});
		this.mainWindow.webContents.send("OscReceived", info.address, address, values);
	};

	/**
	 * フロント側からのOSCメッセージ送信を処理する
	 * @param _
	 * @param host
	 * @param port
	 * @param address
	 * @param values
	 */
	onSend = (
		_: IpcMainInvokeEvent,
		host: string,
		port: number,
		address: string,
		types: string[],
		values: string[] | number[],
	): void => {
		if (this.destroyed || !this.ready) return;
		const args: { type: string; value: number | string | boolean | Blob }[] = [];
		for (let i = 0; i < types.length && i < values.length; i++) {
			args.push({
				type: types[i],
				value: values[i],
			});
		}
		console.log("OSC Send ---");
		console.log({ address, args, host, port });
		this.udpPort.send({ address, args }, host, port);
	};
}
