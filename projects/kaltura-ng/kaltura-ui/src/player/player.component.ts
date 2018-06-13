import { Component, Input, Output, OnInit, OnDestroy, AfterViewInit, EventEmitter } from '@angular/core';

@Component({
    selector: 'k-player',
    templateUrl: './player.component.html',
	styleUrls: ['./player.component.scss']
})
export class KalturaPlayerComponent implements AfterViewInit, OnDestroy {

	@Input()
	width : number = 480;

	@Input()
	height : number = 360;

	@Input()
	pid : number;

	@Input()
	uiconfid : number;

	@Input()
	entryid : string;

	@Input()
	cdnUrl : string = 'http://cdnapi.kaltura.com';

	@Input()
	flashvars : any = {};

	@Input()
	lazy: boolean = false;

	@Input()
	id : string = "";

	@Output()
	kalturaPlayerReady = new EventEmitter<any>();

	private kdp: any;

	constructor() {}

	ngAfterViewInit(){
		if (!this.lazy){
			this.Embed();
		}
	}

	public Embed():void{
		// validation
		if (!this.pid || !this.uiconfid || !this.entryid){
			console.warn("Kaltura Player::Missing parameters. Please provide pid, uiconfid and entryid.");
		}else {
			// load player lib if doesn't exist
			if (document.getElementById("kalturaPlayerLib") === null) {
				let s = document.createElement('script');
				s.src = `${this.cdnUrl}/p/${this.pid}/sp/${this.pid}00/embedIframeJs/uiconf_id/${this.uiconfid}/partner_id/${this.pid}`;
				s.id = "kalturaPlayerLib";
				s.async = false;
				document.head.appendChild(s);
			}
			// wait for lib to load if not loaded and then embed player
			if (!this.kdp){
				const intervalID = setInterval(() => {
					if (typeof window['kWidget'] !== "undefined"){
						clearInterval(intervalID);
						this.doEmbed();
					}
				},50);
			}else{
				this.doEmbed();
			}
		}
	}

	private doEmbed():void{
		window['kWidget'].embed({
			"targetId": "kaltura_player_" + this.id,
			"wid": "_" + this.pid,
			"uiconf_id": this.uiconfid,
			"flashvars": this.flashvars,
			"cache_st": Math.random(),
			"entry_id": this.entryid,
			"readyCallback": (playerID) => {
				this.kdp = document.getElementById(playerID);
				this.kalturaPlayerReady.emit(this.kdp);
			}
		});
	}

	ngOnDestroy(){
		if (this.kdp){
			window['kWidget'].destroy(this.kdp);
		}
	}

}

