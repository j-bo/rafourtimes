import * as vscode from 'vscode';
import { TimeStatusBar } from "./timestatusbar";

let time_sb = new TimeStatusBar();
export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(time_sb.statusBarItem);
	time_sb.update();
}

export function deactivate() { }
