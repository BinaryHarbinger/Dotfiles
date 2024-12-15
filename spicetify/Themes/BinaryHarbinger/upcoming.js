// NAME: upcomingSong
// AUTHOR: Fl3xm3ist3r (https://github.com/fl3xm3ist3r)
// DESCRIPTION: Displays the upcoming song near the current song based on the queue.

(function upcomingSong() {
	const SPICETIFY_LOAD_INTERVAL_IN_MS = 4000;
	const LOAD_DELAY_IN_MS = 10;

	function waitForSpicetifyLoad() {
		if (!Spicetify.Player.data || !Spicetify.LocalStorage) {
			setTimeout(waitForSpicetifyLoad, SPICETIFY_LOAD_INTERVAL_IN_MS);
			return;
		}

		addUpcomingSong();
	}

	function addUpcomingSong(){
		const nowPlayingLeft = document.querySelector(".main-nowPlayingBar-left");
		if (nowPlayingLeft) {
            addCustomCss();
            addEventListeners();

			const upcomingSongDiv = createUpcomingSongDiv();
			nowPlayingLeft.appendChild(upcomingSongDiv);

            addCompatibilityForOtherExtensions();
			
			setTimeout(updateUpcomingSong, LOAD_DELAY_IN_MS);
		}
	}

    function addCustomCss(){
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            .main-nowPlayingBar-left {
                display: flex;
            }
            
            .main-nowPlayingWidget-nowPlaying {
                box-sizing: border-box;
            }
            
            #upcomingSongDiv {
                box-sizing: border-box;
                padding-left: 20px;
                padding-top: 24px;
            }
        `;
        document.head.appendChild(styleElement);
    }

    function addEventListeners(){
        const shuffleButton = document.querySelector(".main-shuffleButton-button")
        if(shuffleButton){
            shuffleButton.addEventListener("click", function() {
                setTimeout(updateUpcomingSong, LOAD_DELAY_IN_MS);
            });
        }

        Spicetify.Player.addEventListener("songchange", () => {
            setTimeout(updateUpcomingSong, LOAD_DELAY_IN_MS);
        });

        Spicetify.Platform.PlayerAPI._queue._events.addListener('queue_update', (eventData) => {
			if(Spicetify.Queue.nextTracks != null && Spicetify.Queue.nextTracks[0]){
				if(Spicetify.Queue.nextTracks[0].contextTrack.uid != Spicetify.Queue.track.contextTrack.uid){
					setTimeout(updateUpcomingSong, LOAD_DELAY_IN_MS);
				}
			}
        });
    }

    function addCompatibilityForOtherExtensions(){
		// hide upcoming song in full screen
		document.addEventListener("fullscreenchange", function() {
			recalculateUpcomingSongLayout();
		});
    }

	function createUpcomingSongDiv() {
		const upcomingSongDiv = document.createElement("div");
		upcomingSongDiv.classList.add("main-nowPlayingWidget-nowPlaying");
		upcomingSongDiv.setAttribute("id", "upcomingSongDiv");
		upcomingSongDiv.innerHTML = `
			<div class="main-coverSlotCollapsed-container main-coverSlotCollapsed-navAltContainer" aria-hidden="false">
				<div draggable="true">
					<div class="GlueDropTarget GlueDropTarget--albums GlueDropTarget--tracks GlueDropTarget--episodes GlueDropTarget--local-tracks">
						<a id="upcomingSongPlaylist" draggable="false" data-context-item-type="track" style="border: none;">
							<div class="main-nowPlayingWidget-coverArt">
								<div class="cover-art" aria-hidden="true" style="width: 30px; height: 30px; margin-top: 35%;">
									<div class="cover-art-icon" style="position: initial;">
										<svg role="img" height="24" width="24" aria-hidden="true" viewBox="-3 -3 30 30" data-encore-id="icon" class="Svg-sc-ytk21e-0 Svg-img-icon">
											<path d="M6 3h15v15.167a3.5 3.5 0 1 1-3.5-3.5H19V5H8v13.167a3.5 3.5 0 1 1-3.5-3.5H6V3zm0 13.667H4.5a1.5 1.5 0 1 0 1.5 1.5v-1.5zm13 0h-1.5a1.5 1.5 0 1 0 1.5 1.5v-1.5z"></path>
										</svg>
									</div>
									<img id="upcomingSongImg" aria-hidden="false" draggable="false" loading="eager" src="" alt="" class="main-image-image cover-art-image main-image-loaded" style="" />
								</div>
							</div>
						</a>
					</div>
				</div>
			</div>
			<div class="main-nowPlayingWidget-trackInfo main-trackInfo-container" style="margin: 0;">
				<div class="main-trackInfo-name">
					<div class="main-trackInfo-overlay">
						<div class="main-trackInfo-contentContainer">
							<div class="main-trackInfo-contentWrapper" style="--trans-x: 0px;">
								<div class="Type__TypeElement-sc-goli3j-0 TypeElement-mesto-type main-trackInfo-name" dir="auto" data-encore-id="type" style="margin-top: 5px">
									<a id="upcomingSongTitle" draggable="false" style="font-size: 0.7em; text-decoration: none;"></a>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="main-trackInfo-artists" style="padding-top: 0;">
					<div class="main-trackInfo-overlay">
						<div class="main-trackInfo-contentContainer">
							<div class="main-trackInfo-contentWrapper" style="--trans-x: 0px;">
								<div class="Type__TypeElement-sc-goli3j-0 TypeElement-finale-textSubdued-type main-trackInfo-artists" data-encore-id="type" style="font-size: 0.5em; padding-top: 0;">
									<span>
										<a id="upcomingSongArtist" draggable="true" dir="auto" style="text-decoration: none;"></a>
									</span>
									<span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		`;
		return upcomingSongDiv;
	}
	
	function updateUpcomingSong() {
		const queue = Spicetify.Queue;
		var nextTrack = null;
		for (let i = 0; i < queue.nextTracks.length; i++) {
			var tmpNextTrack = queue.nextTracks[i];
			if (!tmpNextTrack.removed.length && tmpNextTrack.contextTrack.uid != Spicetify.Queue.track.contextTrack.uid) {
				nextTrack = tmpNextTrack;
				break;
			}
		}

		const upcomingSongTitle = document.getElementById("upcomingSongTitle");
		const upcomingSongArtist = document.getElementById("upcomingSongArtist");
		const upcomingSongImg = document.getElementById("upcomingSongImg");

		if(nextTrack){		
			upcomingSongTitle.innerText = nextTrack.contextTrack.metadata.title;
	
			upcomingSongArtist.innerText = nextTrack.contextTrack.metadata.artist_name;
			for (let i = 1; i > 0; i++) {
				if (nextTrack.contextTrack.metadata['artist_name:' + i]) {
					upcomingSongArtist.innerText += ', ' + nextTrack.contextTrack.metadata['artist_name:' + i];
				} else {
					break;
				}
			}	
	
			if(!nextTrack.contextTrack.metadata.image_url){
				upcomingSongImg.style.display = "none";
			}
			else{
				upcomingSongImg.style.display = "flex";
				upcomingSongImg.src = nextTrack.contextTrack.metadata.image_url;
			}
		}
		else{
			upcomingSongTitle.innerText = "NoSongWasFound";
		}

		recalculateUpcomingSongLayout();
	}
	
	function recalculateUpcomingSongLayout() {
		const currentSong = document.querySelector(".main-nowPlayingWidget-nowPlaying:not(#upcomingSongDiv)");
		const upcomingSong = document.querySelector("#upcomingSongDiv");

		//no upcoming song was found
		const upcomingSongTitle = document.getElementById("upcomingSongTitle");
		if(upcomingSongTitle.innerText == "NoSongWasFound"){
			currentSong.style.flex = `0 0 ${100}%`;
			upcomingSong.style.setProperty("display", "none", "important");
			return;
		}

        //get actual width of elements
		currentSong.style.flex = ``;
		upcomingSong.style.display = "none";
		const currentSongWidth = currentSong.offsetWidth;
		upcomingSong.style.display = "flex";
	
		upcomingSong.style.flex = ``;
		currentSong.style.display = "none";
		const upcomingSongWidth = upcomingSong.offsetWidth;
		currentSong.style.display = "flex";
	
		const totalWidth = currentSong.parentElement.offsetWidth;

		// +1 to avoid scrolling on song title with fancy fonts
		let currentSongPercentage = (currentSongWidth / totalWidth) * 100 + 1;
		let upcomingSongPercentage = (upcomingSongWidth / totalWidth) * 100;
	
        //style the elements acording to the 62% and 38% rule
		if (currentSongPercentage > 62 && upcomingSongPercentage > 38) {
			currentSongPercentage = 62;
			upcomingSongPercentage = 38;
		} else if (upcomingSongPercentage <= 38 && currentSongPercentage > 62 && currentSongPercentage + upcomingSongPercentage > 100) {
			currentSongPercentage = 100 - upcomingSongPercentage;
		} else if (currentSongPercentage <= 62 && upcomingSongPercentage > 38 && currentSongPercentage + upcomingSongPercentage > 100) {
			upcomingSongPercentage = 100 - currentSongPercentage;
		}

		currentSong.style.flex = `0 0 ${currentSongPercentage}%`;
		upcomingSong.style.flex = `0 0 ${upcomingSongPercentage}%`;

		// ensure upcomingSong appears behind currentSong (seems to be caused by enhanced playlists)
		if(currentSong.parentElement.children[1].getAttribute("id") != "upcomingSongDiv"){
			upcomingSong.remove()
			currentSong.parentElement.appendChild(upcomingSong);
		}

        checkIfFullScreen();
	}

	function checkIfFullScreen(){
		const upcomingSongDiv = document.querySelector("#upcomingSongDiv");
		if (upcomingSongDiv) {
			if (document.fullscreenElement) {
				upcomingSongDiv.style.setProperty("display", "none", "important");
			} else {
				upcomingSongDiv.style = "flex";
			}
		}
	}

	waitForSpicetifyLoad();
})();
