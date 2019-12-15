import * as vscode from 'vscode';
import { TimeStatusBar } from "./timestatusbar";

let time_sb = new TimeStatusBar();
export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(time_sb.statusBarItem);
	context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(time_sb.update));
	context.subscriptions.push(vscode.window.onDidChangeTextEditorSelection(time_sb.update));
	time_sb.update();
}

export function deactivate() { }
