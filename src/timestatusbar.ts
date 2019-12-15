import * as vscode from 'vscode';
import * as request from 'request-promise-native';

export class TimeStatusBar {
    statusBarItem: vscode.StatusBarItem;
    stop?: string;
    timer_waiting: NodeJS.Timer;

    constructor() {
        this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
        this.timer_waiting = setInterval(() => this.update(), 60000);
    }

    update(): void {
        (async () => {
            let stop_id = vscode.workspace.getConfiguration('rafourtimes').get('stop');
            var options = {
                uri: "http://data.metromobilite.fr/api/routers/default/index/stops/" + stop_id + "/stoptimes",
            };
            const result = await request.get(options);
            let stoptimes: Stoptimes[] = JSON.parse(result);
            let nextimes = this.get_next_times(stoptimes);
            if (nextimes.length > 0) {
                this.statusBarItem.text = '$(milestone) : ' + this.get_wait_str(nextimes[0]) + ' (' + this.get_wait_str(nextimes[1]) + ')';
                this.statusBarItem.show();
            } else {
                this.statusBarItem.hide();
            }
        })();
    }

    get_wait_str(tcode: number) {
        tcode = this.get_wait(tcode);
        let h = Math.floor(tcode / 3600);
        let m = Math.ceil((tcode % 3600) / 60);
        if (h >= 24) {
            h -= 24;
        }
        if (h > 0) {
            return h + 'h ' + m + ' min';
        } else {
            return m + ' min';
        }
    }
    get_next_times(stoptimes: Stoptimes[]) {
        var rtimes: number[] = [];
        stoptimes.forEach(function (stoptime) {
            stoptime.times?.forEach(function (time) {
                let t = time.realtimeDeparture;
                if (rtimes.length < 2) {
                    rtimes.push(t);
                } else {
                    if (t < rtimes[0]) {
                        rtimes[0] = t;
                    } else if (t < rtimes[1]) {
                        rtimes[1] = t;
                    }
                }
            });
        });
        while (rtimes.length < 2) {
            rtimes.push(9999);
        }
        return rtimes;
    }

    get_wait(tcode: number) {
        let dateTime = new Date();
        let current_time = dateTime.getHours() * 3600 + dateTime.getMinutes() * 60;
        return tcode - current_time;
    }

    dispose() {
        clearInterval(this.timer_waiting);
    }
}


interface Stoptimes {
    pattern: Pattern;
    times?: (TimesEntity)[] | null;
}
interface Pattern {
    id: string;
    desc: string;
    dir: number;
    shortDesc: string;
}
interface TimesEntity {
    stopId: string;
    stopName: string;
    scheduledArrival: number;
    scheduledDeparture: number;
    realtimeArrival: number;
    realtimeDeparture: number;
    arrivalDelay: number;
    departureDelay: number;
    timepoint: boolean;
    realtime: boolean;
    serviceDay: number;
    tripId: number;
}
