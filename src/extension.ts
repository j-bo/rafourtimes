import * as vscode from 'vscode';
import { TimeStatusBar } from "./timestatusbar";

let time_sb = new TimeStatusBar();
export function activate(context: vscode.ExtensionContext) {
	const chooseStopId = 'rafourtimes.chooseStop';
	context.subscriptions.push(vscode.commands.registerCommand(chooseStopId, () => {
		time_sb.changeStop();
	}));
	time_sb.statusBarItem.command = chooseStopId;
	context.subscriptions.push(time_sb.statusBarItem);
	time_sb.update();
}

export function deactivate() { }
