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

let ca_style = document.createElement('style');
ca_style.innerHTML = `
:root {
  --cover-ambience-background: var(--spice-player);
}
.Root__now-playing-bar.LibraryX {
  --cover-ambience-background: var(--spice-sidebar);
}
.LibraryX .main-nowPlayingBar-container, .LibraryX .main-nowPlayingBar-container:before {
    border-radius: 8px;
}

footer.main-nowPlayingBar-container {
    transition: background 0.5s ease;
    background-size: 100%;
    --bg-img: linear-gradient(to right, var(--cover-ambience-color) 0, var(--cover-ambience-background) 280px, var(--cover-ambience-background) 100%);
    --bg-img-before: linear-gradient(to right, var(--cover-ambience-color-before) 0, var(--cover-ambience-background) 280px, var(--cover-ambience-background) 100%);
    background-image: var(--bg-img) !important;
    position: relative;
    z-index: 100;
    --cover-ambience-border-opacity: ${localStorage.CoverAmbienceBorderOpacity || 0.5};
    --cover-ambience-border-opacity-small: ${((localStorage.CoverAmbienceBorderOpacity || 0.5) * 80) / 100};
}
footer.main-nowPlayingBar-container:before {
    background-image: var(--bg-img-before);
    content: "";
    display: block;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    width: 100%;
    z-index: -100;
    transition: opacity 0.6s;
    opacity: var(--cover-ambience-opacity);
}

/* Add outlines to song text/artist/genre */
.Root__now-playing-bar .main-trackInfo-name
{
  text-shadow: -1px -1px 0 rgba(var(--spice-rgb-player), var(--cover-ambience-border-opacity)), 1px -1px 0 rgba(var(--spice-rgb-player), var(--cover-ambience-border-opacity)), -1px 1px 0 rgba(var(--spice-rgb-player), var(--cover-ambience-border-opacity)), 1px 1px 0 rgba(var(--spice-rgb-player), var(--cover-ambience-border-opacity));
}
.Root__now-playing-bar .main-trackInfo-artists, .Root__now-playing-bar .main-trackInfo-genres
{
  text-shadow: -1px -1px 0 rgba(var(--spice-rgb-player), var(--cover-ambience-border-opacity-small)), 1px -1px 0 rgba(var(--spice-rgb-player), var(--cover-ambience-border-opacity-small)), -1px 1px 0 rgba(var(--spice-rgb-player), var(--cover-ambience-border-opacity-small)), 1px 1px 0 rgba(var(--spice-rgb-player), var(--cover-ambience-border-opacity-small));
}
`;
document.head.appendChild(ca_style);

const hexToRGB = hex =>
  hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (m, r, g, b) => '#' + r + r + g + g + b + b)
    .substring(1).match(/.{2}/g)
    .map(x => parseInt(x, 16))

function RGBToHSL(rgb) {
  if (rgb.length) {
    // make r, g, and b fractions of 1
    let r = rgb[0] / 255,
      g = rgb[1] / 255,
      b = rgb[2] / 255,

    // find greatest and smallest channel values
      cmin = Math.min(r,g,b),
      cmax = Math.max(r,g,b),
      delta = cmax - cmin,
      h = 0,
      s = 0,
      l = 0;

    // calculate hue
    // no difference
    if (delta == 0)
      h = 0;
    // red is max
    else if (cmax == r)
      h = ((g - b) / delta) % 6;
    // green is max
    else if (cmax == g)
      h = (b - r) / delta + 2;
    // blue is max
    else
      h = (r - g) / delta + 4;

    h = Math.round(h * 60);

    // make negative hues positive behind 360°
    if (h < 0)
      h += 360;

    // calculate lightness
    l = (cmax + cmin) / 2;

    // calculate saturation
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

    // multiply l and s by 100
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);
    
    // normalize color
    s = s > 50 ? 50 : s;
    l = l > 35 ? 35 : l;
    l = l < 8 ? 8 : l;

    return "hsl(" + h + "," + s + "%," + l + "%)";

  } else {
    return "hsl(0, 0%, 50%)";
  }
}

async function fetchExtractedColors() {
    const res = await fetch(`https://api-partner.spotify.com/pathfinder/v1/query?operationName=fetchExtractedColors&variables=${encodeURIComponent(JSON.stringify({ uris: [Spicetify.Player.data.item.metadata.image_url] }))}&extensions=${encodeURIComponent(JSON.stringify({"persistedQuery":{"version":1,"sha256Hash":"d7696dd106f3c84a1f3ca37225a1de292e66a2d5aced37a66632585eeb3bbbfa"}}))}`, {
        method: "GET",
        headers: {
            authorization: `Bearer ${(await Spicetify.CosmosAsync.get('sp://oauth/v2/token')).accessToken}`
        }
    })
    .then(res => res.json());
    if (!res.data.extractedColors) return [128, 128, 128];
    return hexToRGB(res.data.extractedColors[0].colorRaw.hex);
}

LibraryX = false; // 'false' because class is not on by default
async function checkBackgroundColor() {
  let LibraryXCheck = Spicetify.RemoteConfigResolver.value.localConfiguration.values.get('enableYLXSidebar') || true;
  if (LibraryX != LibraryXCheck) {
    LibraryX = LibraryXCheck;
    let rootClasses = document.querySelector('.Root__now-playing-bar')?.classList;
    if (LibraryXCheck) rootClasses.add('LibraryX');
    else rootClasses.remove('LibraryX');
  }
}

var beforeElement = false;
async function setGradient() {
    checkBackgroundColor();
    let style = document.querySelector('.main-nowPlayingBar-container')?.style;
    let rgb = (await fetchExtractedColors() || [128, 128, 128]);
    let color = RGBToHSL(rgb);
    if (beforeElement) {
        style.setProperty('--cover-ambience-color', color);
        style.setProperty('--cover-ambience-opacity', 0);
        beforeElement = false;
    } else {
        style.setProperty('--cover-ambience-color-before', color);
        style.setProperty('--cover-ambience-opacity', 1);
        beforeElement = true;
    }
}

function initiate() {
  setGradient();
  Spicetify.Player.addEventListener('songchange', setGradient);
  setInterval(checkBackgroundColor, 5000);

  window.updateCABorderOpacity = function(value) {
    let style = document.querySelector('.main-nowPlayingBar-container')?.style;
    style.setProperty('--cover-ambience-border-opacity', value / 100);
    style.setProperty('--cover-ambience-border-opacity-small', ((value / 100) * 80) / 100);

    localStorage.CoverAmbienceBorderOpacity = value / 100;
  }

  const info = document.querySelector("div.main-nowPlayingWidget-trackInfo.main-trackInfo-container");

  var contextMenu = 0;

  info.addEventListener('mousedown', e => { // check if the context menu was clicked within the track info container
    if (e.button != 2) return; // right clicks only
    contextMenu = Date.now();
  })

  let borderOpacityMenuItem = new Spicetify.ContextMenu.Item(
    "Edit Border Opacity",
    () => {
      Spicetify.PopupModal.display({
        title: 'Border Opacity %',
        content: `<style>
          #coverAmbienceBorderRange {
            width: calc(100% - 78px);
            accent-color: var(--spice-button-active);
          }
          #coverAmbienceBorderNumber {
            width: 69px;
            padding: 11px;
            border-radius: 16px;
          }
          #coverAmbienceBorderNumber::-webkit-inner-spin-button {
            -webkit-appearance: auto;
          }
          .GenericModal__overlay {
            background: none;
          }
          .main-embedWidgetGenerator-container {
            box-shadow: 0 4px 13px rgb(var(--spice-rgb-shadow));
          }
          .x-searchInput-searchInputInput {
            background-color: var(--spice-main-elevated);
            border: 0;
            border-radius: 500px;
            color: var(--spice-text)!important;
            height: 48px;
            padding: 6px 36px;
            text-overflow: ellipsis;
            width: 100%
          }
          .x-searchInput-searchInputInput:hover {
            background-color: var(--spice-highlight-elevated);
            -webkit-box-shadow: 0 0 0 1px rgba(var(--spice-rgb-selected-row),.2);
            box-shadow: 0 0 0 1px rgba(var(--spice-rgb-selected-row),.2);
            outline: none
          }
          .x-searchInput-searchInputInput:focus {
            -webkit-box-shadow: 0 0 0 2px var(--spice-text);
            box-shadow: 0 0 0 2px var(--spice-text);
            outline: none
          }
        </style>
        <input id="coverAmbienceBorderRange" type="range" min="0" max="100" step="0.5" value="${(localStorage.CoverAmbienceBorderOpacity || 0.5) * 100}" oninput="this.nextElementSibling.value = this.value; updateCABorderOpacity(this.value)">
        <input id="coverAmbienceBorderNumber" type="number" class="Type__TypeElement-sc-goli3j-0 TypeElement-mesto-type x-searchInput-searchInputInput" maxlength="5" autocorrect="off" autocapitalize="off" spellcheck="false" placeholder="50" data-testid="search-input" data-encore-id="type" min="0" max="100" step="0.5" value="${(localStorage.CoverAmbienceBorderOpacity || 0.5) * 100}" oninput="this.previousElementSibling.value=this.value; updateCABorderOpacity(this.value)">`,
        isLarge: true
      });
    },
    () => {
      return Date.now() - contextMenu <= 500;
    },
    'edit',
    false,
  );
  
  borderOpacityMenuItem.register();
}

if (Spicetify.Player.data) {
  initiate();
} else {
  const observer = new MutationObserver((_, observer) => {
    if (Spicetify.Player.data) {
      observer.disconnect();
      initiate();
    }
  });
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// NAME: HomeWhereYouBelong
// AUTHOR: yodaluca23
// DESCRIPTION: Move Home Button Next to Navigation on Spotify v1.2.46+.

(function HomeWhereYouBelong() {
    function waitForElements() {
        const homeButton = document.querySelector('button[aria-label="Home"]');
        const goForwardButton = document.querySelector('button[aria-label="Go forward"]');

        if (homeButton && goForwardButton) {
            goForwardButton.parentNode.insertBefore(homeButton, goForwardButton.nextSibling);

            console.log("[HomeWhereYouBelong v1.3] Home button successfully moved.");
            observer.disconnect();
        }

    }

    const observer = new MutationObserver(waitForElements);
    observer.observe(document.body, { childList: true, subtree: true });

	waitForElements();
})();

// NAME: Old Like Button
// AUTHOR: Maskowh, OhItsTom
// DESCRIPTION: Adds a button to the tracklist to add/remove a song from Liked Songs.
// Heavily inspired of https://github.com/ohitstom/spicetify-extensions/tree/main/quickQueue, especially for rendering


let likedTracksIdsISRCs = new Map(); // ids/isrcs of all liked tracks, to check if we should display the heart icon or not. 
let likedTracksISRCs = new Set(likedTracksIdsISRCs.values()); // isrcs of all liked tracks, to check if we should display the half-heart icon or not

var proxyLikedTracksIdsISRCs; // proxy for likedTracksIds, to trigger an event on add/delete

var likedTracksChangeEvent = new CustomEvent('likedTracksChange');

async function initiateLikedSongs() {
    if (
        !(
            Spicetify.CosmosAsync
        )
    ) {
        setTimeout(initiateLikedSongs, 10);
        return;
    }
    let likedTracksItems = await Spicetify.CosmosAsync.get("sp://core-collection/unstable/@/list/tracks/all?responseFormat=protobufJson");
    let likedTracksIds = likedTracksItems.item.map(item => item.trackMetadata.link.replace("spotify:track:", ""));

    let newLikedTracksIdsISRCs = new Map();
    let likedTracksIdsWithUnknownISRCs = [];

    likedTracksIds.forEach(trackId => {
        const trackIsrc = localStorage.getItem("maskowh-oldlike-" + trackId)
        if (trackIsrc != null) {
            newLikedTracksIdsISRCs.set(trackId, trackIsrc)
        } else if (!trackId.startsWith("spotify:local:")) {
            likedTracksIdsWithUnknownISRCs.push(trackId);
        }
    });

    let promises = [];

    for (let i = 0; i < likedTracksIdsWithUnknownISRCs.length; i += 50) {
        let batch = likedTracksIdsWithUnknownISRCs.slice(i, i + 50);
        console.info("Requesting ISRCs for the following liked tracks: " + batch);
        promises.push(
            Spicetify.CosmosAsync.get(`https://api.spotify.com/v1/tracks?ids=${batch.join(",")}`).then(response => {
                response.tracks.forEach(track => {
                    newLikedTracksIdsISRCs.set(track.id, track.external_ids.isrc);
                    localStorage.setItem("maskowh-oldlike-" + track.id, track.external_ids.isrc);
                });
            })
        );
    }

    await Promise.all(promises);

    likedTracksIdsISRCs = newLikedTracksIdsISRCs;
    likedTracksISRCs = new Set(likedTracksIdsISRCs.values());

    proxyLikedTracksIdsISRCs = new Proxy(likedTracksIdsISRCs, {
        get: function (target, property, receiver) {
            // If the accessed property is a function and it's one of the methods I want to trigger an event for
            if (['set', 'delete'].includes(property) && typeof target[property] === 'function') {
                return function (...args) {
                    // Original method call
                    const result = target[property].apply(target, args);
                    // Trigger the event to notify the buttons
                    likedTracksISRCs = new Set(likedTracksIdsISRCs.values());
                    document.dispatchEvent(likedTracksChangeEvent);
                    return result;
                };
            }
            // If the accessed property is not one of the intercepted methods, return the property as usual
            return Reflect.get(target, property, receiver);
        }
    });

    // This is to initiate the buttons, then to refresh it every 30 seconds to handle new/removed likes from other sources (mobile, web browser)
    document.dispatchEvent(likedTracksChangeEvent);
    setTimeout(initiateLikedSongs, 30000);
}

initiateLikedSongs();

(function quickLike() {
    if (
        !(
            Spicetify.React &&
            Spicetify.ReactDOM &&
            Spicetify.SVGIcons &&
            Spicetify.showNotification &&
            Spicetify.Platform.PlayerAPI &&
            Spicetify.Tippy &&
            Spicetify.TippyProps &&
            Spicetify.CosmosAsync &&
            Spicetify.Player &&
            Spicetify.Player.data
        )
    ) {
        setTimeout(quickLike, 10);
        return;
    }

    const LikeButton = Spicetify.React.memo(function LikeButton({ uri, classList }) {

        const trackId = uri.replace("spotify:track:", "");
        const [isrc, setISRC] = Spicetify.React.useState(localStorage.getItem("maskowh-oldlike-" + trackId));
        const [isLiked, setIsLiked] = Spicetify.React.useState(likedTracksIdsISRCs.has(trackId));
        const [hasISRCLiked, setHasISRCLiked] = Spicetify.React.useState(likedTracksISRCs.has(isrc));
        const [isHovered, setIsHovered] = Spicetify.React.useState(false);
        const buttonRef = Spicetify.React.useRef(null);

        Spicetify.React.useEffect(() => {
            // Initialize tippy
            if (buttonRef.current) {
                const tippyInstance = Spicetify.Tippy(buttonRef.current, {
                    ...Spicetify.TippyProps,
                    hideOnClick: true,
                    content: isLiked ? "Remove from Liked Songs" : hasISRCLiked ? "Add to Liked Songs (You already like another version of the exact same recording)" : "Add to Liked Songs"
                });

                return () => {
                    tippyInstance.destroy();
                };
            }
        }, [isLiked, hasISRCLiked]);

        Spicetify.React.useEffect(() => {
            async function initISRC() {
                try {
                    // If the ISRC is not in known ISRCs, request the track to spotify api to get the isrc and store it in local storage
                    if (isrc == null) {
                        console.log("Requesting the isrc for " + trackId)
                        let track = await Spicetify.CosmosAsync.get(`https://api.spotify.com/v1/tracks/${trackId}`);
                        setISRC(track.external_ids.isrc);
                        localStorage.setItem("maskowh-oldlike-" + track.id, track.external_ids.isrc);
                        setHasISRCLiked(likedTracksISRCs.has(track.external_ids.isrc));
                    } else {
                        setHasISRCLiked(likedTracksISRCs.has(isrc));
                    }
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            };

            initISRC();
        }, [isLiked, hasISRCLiked]);

        // When the Liked Tracks list notify of a change, we set the new values
        document.addEventListener('likedTracksChange', function (event) {
            setIsLiked(likedTracksIdsISRCs.has(trackId));
            setHasISRCLiked(likedTracksISRCs.has(isrc));
        });

        const handleClick = async function () {
            Spicetify.showNotification(isLiked ? "Removed from Liked Songs" : "Added to Liked Songs");
            if (isLiked) {
                try {
                    await Spicetify.CosmosAsync.del(`https://api.spotify.com/v1/me/tracks?ids=${trackId}`);
                } catch (error) {
                    if (error instanceof SyntaxError && error.message === 'Unexpected end of JSON input') {
                        // Might happen since the response from this endpoint is empty, but ignore it
                    } else {
                        console.error(error);
                    }
                }
                proxyLikedTracksIdsISRCs.delete(trackId);
            } else {
                try {
                    await Spicetify.CosmosAsync.put(`https://api.spotify.com/v1/me/tracks?ids=${trackId}`);
                } catch (error) {
                    if (error instanceof SyntaxError && error.message === 'Unexpected end of JSON input') {
                        // Might happen since the response from this endpoint is empty, but ignore it
                    } else {
                        console.error(error);
                    }
                }
                if (isrc === "") {
                    console.error("Track without isrc set. Shouldn't happen")
                } else {
                    proxyLikedTracksIdsISRCs.set(trackId, isrc);
                }
            }
        };

        const handleMouseOver = function () {
            setIsHovered(true);
        }

        const handleMouseOut = function () {
            setIsHovered(false);
        }

        // Render
        return Spicetify.React.createElement(
            "button",
            {
                ref: buttonRef,
                className: classList,
                "aria-checked": isLiked || hasISRCLiked,
                onClick: handleClick,
                onMouseOver: handleMouseOver,
                onMouseOut: handleMouseOut,
                style: {
                    marginRight: "12px",
                    opacity: (isLiked || hasISRCLiked) ? "1" : undefined
                }
            },
            Spicetify.React.createElement(
                "span",
                { className: "Wrapper-sm-only Wrapper-small-only" },
                Spicetify.React.createElement("svg", {
                    role: "img",
                    height: "24",
                    width: "24",
                    viewBox: "0 0 24 24",
                    className: (isLiked || hasISRCLiked) ? "Svg-img-icon-small-textBrightAccent" : "Svg-img-icon-small",
                    style: {
                        fill: (isLiked || hasISRCLiked) ? "var(--text-bright-accent)" : "var(--text-subdued)"
                    },
                    dangerouslySetInnerHTML: {
                        __html: isLiked
                            ? (isHovered
                                ? `<path d="M19.5 10c-2.483 0-4.5 2.015-4.5 4.5s2.017 4.5 4.5 4.5 4.5-2.015 4.5-4.5-2.017-4.5-4.5-4.5zm2.5 5h-5v-1h5v1zm-6.527 4.593c-1.108 1.086-2.275 2.219-3.473 3.407-6.43-6.381-12-11.147-12-15.808 0-6.769 8.852-8.346 12-2.944 3.125-5.362 12-3.848 12 2.944 0 .746-.156 1.496-.423 2.253-1.116-.902-2.534-1.445-4.077-1.445-3.584 0-6.5 2.916-6.5 6.5 0 2.063.97 3.901 2.473 5.093z"></path>`
                                : `<path d="M12 4.248c-3.148-5.402-12-3.825-12 2.944 0 4.661 5.571 9.427 12 15.808 6.43-6.381 12-11.147 12-15.808 0-6.792-8.875-8.306-12-2.944z"/></path>`)
                            : (hasISRCLiked
                                ? (isHovered
                                    ? `<path d="M 4.851562 1.148438 C 1.820312 1.808594 -0.191406 4.480469 0.0390625 7.550781 C 0.148438 9.109375 0.640625 10.339844 1.839844 12.148438 C 2.980469 13.859375 4.230469 15.25 8.261719 19.300781 L 12 23.050781 L 13.710938 21.328125 L 15.429688 19.621094 L 14.78125 18.910156 C 13.679688 17.730469 13.128906 16.449219 13.039062 14.851562 C 12.839844 11.730469 15.078125 8.789062 18.148438 8.148438 C 19.871094 7.789062 21.910156 8.199219 23.171875 9.160156 C 23.339844 9.289062 23.511719 9.398438 23.539062 9.398438 C 23.660156 9.398438 23.910156 8.300781 23.96875 7.550781 C 24.148438 5.050781 22.859375 2.75 20.699219 1.730469 C 20.230469 1.5 19.640625 1.269531 19.378906 1.210938 C 17.539062 0.78125 15.570312 1.109375 14.019531 2.121094 C 13.390625 2.53125 12.550781 3.371094 12.230469 3.910156 C 12.140625 4.070312 12.03125 4.199219 12 4.199219 C 11.96875 4.199219 11.800781 3.96875 11.609375 3.691406 C 10.878906 2.621094 9.621094 1.730469 8.25 1.300781 C 7.328125 1.011719 5.800781 0.949219 4.851562 1.148438 Z M 8.988281 3.949219 C 10.101562 4.238281 11.179688 4.980469 11.78125 5.871094 L 12 6.179688 L 11.980469 13.191406 L 11.949219 20.210938 L 9.5 17.769531 C 7.328125 15.621094 6.578125 14.828125 5.410156 13.5 C 4.558594 12.53125 3.609375 10.921875 3.261719 9.851562 C 3 9.050781 2.949219 8.050781 3.148438 7.300781 C 3.589844 5.589844 4.539062 4.570312 6.25 3.988281 C 6.878906 3.78125 8.269531 3.75 8.988281 3.949219 Z M 8.988281 3.949219"/></path><path d="M 18.449219 10.140625 C 17.621094 10.339844 16.988281 10.699219 16.339844 11.339844 C 14.570312 13.121094 14.570312 15.878906 16.339844 17.660156 C 18.121094 19.429688 20.878906 19.429688 22.660156 17.660156 C 24.429688 15.878906 24.429688 13.121094 22.660156 11.339844 C 21.519531 10.210938 19.980469 9.769531 18.449219 10.140625 Z M 20 13 L 20 14 L 22 14 L 22 15 L 20 15 L 20 17 L 19 17 L 19 15 L 17 15 L 17 14 L 19 14 L 19 12 L 20 12 Z M 20 13"/></path>`
                                    : `<path d="M 5.449219 1.058594 C 5.339844 1.078125 5 1.148438 4.699219 1.210938 C 4.398438 1.269531 3.769531 1.5 3.300781 1.71875 C 0.710938 2.960938 -0.550781 5.949219 0.261719 8.949219 C 0.648438 10.410156 1.851562 12.390625 3.550781 14.398438 C 4.089844 15.03125 6.210938 17.238281 8.269531 19.300781 L 12 23.050781 L 15.730469 19.300781 C 19.769531 15.25 21.019531 13.859375 22.160156 12.148438 C 23.359375 10.339844 23.851562 9.109375 23.960938 7.550781 C 24.199219 4.410156 22.148438 1.761719 19 1.140625 C 16.480469 0.640625 13.738281 1.699219 12.390625 3.691406 C 12.199219 3.96875 12.03125 4.199219 12 4.199219 C 11.96875 4.199219 11.871094 4.070312 11.769531 3.910156 C 11.238281 3.011719 10 1.988281 8.871094 1.53125 C 7.839844 1.109375 6.28125 0.898438 5.449219 1.058594 Z M 9.289062 4.039062 C 9.691406 4.171875 10.269531 4.449219 10.570312 4.660156 C 11.160156 5.070312 11.859375 5.871094 11.949219 6.230469 C 11.980469 6.351562 11.988281 9.550781 11.980469 13.351562 L 11.949219 20.25 L 9.140625 17.449219 C 5.28125 13.589844 4.019531 12.011719 3.269531 10.050781 C 3.121094 9.660156 3.070312 9.28125 3.070312 8.351562 C 3.058594 7.179688 3.070312 7.128906 3.410156 6.398438 C 3.929688 5.300781 4.898438 4.441406 6.050781 4.050781 C 6.679688 3.839844 6.800781 3.820312 7.699219 3.808594 C 8.359375 3.800781 8.730469 3.859375 9.289062 4.039062 Z M 9.289062 4.039062"/></path>`)
                                : `<path d="M19.5 10c-2.483 0-4.5 2.015-4.5 4.5s2.017 4.5 4.5 4.5 4.5-2.015 4.5-4.5-2.017-4.5-4.5-4.5zm2.5 5h-2v2h-1v-2h-2v-1h2v-2h1v2h2v1zm-6.527 4.593c-1.108 1.086-2.275 2.219-3.473 3.407-6.43-6.381-12-11.147-12-15.808 0-4.005 3.098-6.192 6.281-6.192 2.197 0 4.434 1.042 5.719 3.248 1.279-2.195 3.521-3.238 5.726-3.238 3.177 0 6.274 2.171 6.274 6.182 0 .746-.156 1.496-.423 2.253-.527-.427-1.124-.768-1.769-1.014.122-.425.192-.839.192-1.239 0-2.873-2.216-4.182-4.274-4.182-3.257 0-4.976 3.475-5.726 5.021-.747-1.54-2.484-5.03-5.72-5.031-2.315-.001-4.28 1.516-4.28 4.192 0 3.442 4.742 7.85 10 13l2.109-2.064c.376.557.839 1.048 1.364 1.465z"></path>`)
                    }
                })
            )
        );
    });


	// Paybar button insertion
	function waitForWidgetMounted() {
		nowPlayingWidget = document.querySelector(".main-nowPlayingWidget-nowPlaying");
		entryPoint = document.querySelector(".main-nowPlayingWidget-nowPlaying > button:last-child");
		if (!(nowPlayingWidget && entryPoint)) {
			setTimeout(waitForWidgetMounted, 300);
			return;
		}

        const likeButtonWrapper = document.createElement("div");
        likeButtonWrapper.className = "likeControl-wrapper";

        const likeButtonElement = nowPlayingWidget.insertBefore(likeButtonWrapper, entryPoint);
        renderLikeButton(likeButtonElement);
    }

    (function attachObserver() {
		const leftPlayer = document.querySelector(".main-nowPlayingBar-left");
		if (!leftPlayer) {
			setTimeout(attachObserver, 300);
			return;
		}
		waitForWidgetMounted();
		const observer = new MutationObserver(mutations => {
			mutations.forEach(mutation => {
				if (mutation.removedNodes.length > 0) {
					const removedNodes = Array.from(mutation.removedNodes);
					const isNowPlayingRemoved = removedNodes.some(node => node.classList && node.classList.contains("main-nowPlayingWidget-nowPlaying"));
					if (isNowPlayingRemoved) {
						waitForWidgetMounted();
					}
				}
			});
		});
		observer.observe(leftPlayer, { childList: true });
	})();

    function renderLikeButton(container) {
        const uri = Spicetify.Player.data?.item?.uri || "";
        Spicetify.ReactDOM.render(
            Spicetify.React.createElement(LikeButton, {
                uri: uri,
                key: uri,
                classList: container.parentElement.querySelector(".main-nowPlayingWidget-nowPlaying > button:last-child").classList
            }),
            container
        );
        container.firstChild.style.marginRight = "0px";
    }
    
    Spicetify.Player.addEventListener("songchange", () => {
        const container = document.querySelector(".likeControl-wrapper");
        if (container) {
            renderLikeButton(container); // Re-render on song change
        }
    });


    // Main view button insertion
    function findVal(object, key, max = 10) {
        if (object[key] !== undefined || !max) {
            return object[key];
        }

        for (const k in object) {
            if (object[k] && typeof object[k] === "object") {
                const value = findVal(object[k], key, --max);
                if (value !== undefined) {
                    return value;
                }
            }
        }

        return undefined;
    }

    const observer = new MutationObserver(mutationList => {
        mutationList.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                const nodeMatch =
                    node.attributes?.role?.value === "row"
                        ? node.firstChild?.lastChild
                        : node.firstChild?.attributes?.role?.value === "row"
                            ? node.firstChild?.firstChild.lastChild
                            : null;

                if (nodeMatch) {
                    const entryPoint = nodeMatch.querySelector(":scope > button:not(:last-child):has([data-encore-id])");

                    if (entryPoint) {
                        const reactPropsKey = Object.keys(node).find(key => key.startsWith("__reactProps$"));
                        const uri = findVal(node[reactPropsKey], "uri");

                        const likeButtonWrapper = document.createElement("div");
                        likeButtonWrapper.className = "likeControl-wrapper";
                        likeButtonWrapper.style.display = "contents";
                        likeButtonWrapper.style.marginRight = 0;

                        const likeButtonElement = nodeMatch.insertBefore(likeButtonWrapper, entryPoint);
                        Spicetify.ReactDOM.render(
                            Spicetify.React.createElement(LikeButton, {
                                uri,
                                classList: entryPoint.classList
                            }),
                            likeButtonElement
                        );
                    }
                }
            });
        });
    });

    observer.observe(document, {
        subtree: true,
        childList: true
    });
})();

// NAME: Immersive View
// AUTHORS: OhItsTom
// DESCRIPTION: Button to hide unnecessary information, providing an immersive experience.
// Append Styling To Head
(function initStyle() {
	const style = document.createElement("style");
	style.textContent = `
                #main.immersive-view-active.hideplaybar .Root__now-playing-bar {
                    display: none !important;
                }

                #main.immersive-view-active.hidelibrary .Root__nav-bar {
                    display: none !important;
                }

                #main.immersive-view-active.hidetopbar .Root__top-bar {
                    display: none !important;
                }

                #main.immersive-view-active.hiderightpanel .Root__right-sidebar {
                    display: none !important;
                }

                #main.immersive-view-active {
                    transition: grid-template-columns 0.3s ease, column-gap 0.3s ease, padding-bottom 0.3s ease;
                }

                .immersive-view-settings {
                    padding: 20px;
                    color: var(--spice-text);
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                    max-height: 400px;
                    overflow-y: auto;
                }

                .immersive-view-settings .setting-item {
                    display: grid;
                    grid-template-columns: 1fr auto;
                    align-items: center;
                    margin-bottom: 10px;
                }

                .immersive-view-settings .setting-item-special {
                    margin-top: 10px;
                    margin-bottom: 0px;
                }

                .immersive-view-settings .setting-item-special > span {
                    margin-inline-start: 10px;
                }

                .immersive-view-settings .setting-item-special > span ~ input {
                    width: 3em;
                    text-align: center;
                    background-color: var(--spice-highlight);
                    border-color: var(--spice-text);
                    margin-left: calc(100% - 21px);
                }

                .immersive-view-settings .setting-item span {
                    font-size: 16px;
                    line-height: 20px;
                }

                .immersive-view-settings button {
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: 0;
                    margin: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 20px;
                }

                .immersive-view-settings button svg {
                    width: 20px;
                    height: 20px;
                    fill: var(--spice-text);
                    transition: fill 0.3s ease;
                }

                .immersive-view-settings button.active svg {
                    fill: var(--spice-highlight);
                }
            `;
	document.head.appendChild(style);
})();

(function immersiveView() {
	if (
		!(
			Spicetify.CosmosAsync &&
			Spicetify.Platform.UpdateAPI &&
			Spicetify.React &&
			Spicetify.Topbar &&
			Spicetify.PopupModal &&
			document.getElementById("main") &&
			Spicetify.Keyboard
		)
	) {
		setTimeout(immersiveView, 10);
		return;
	}

	// Default settings
	let state = false;
	let settings = {
		enableAtStartup: false,
		hideControls: false,
		hideTopbar: true,
		hideLibrary: true,
		hideRightPanel: true,
		hidePlaybar: true
	};

	// Save settings to localStorage
	function saveSettings() {
		localStorage.setItem("immersiveViewSettings", JSON.stringify(settings));
	}

	// Load settings from localStorage
	function loadSettings() {
		const storedSettings = localStorage.getItem("immersiveViewSettings");
		if (storedSettings) {
			settings = JSON.parse(storedSettings);
		}
	}

	loadSettings();

	// Apply settings if enabled at startup
	if (settings.enableAtStartup) {
		state = true;
		updateClasses();
	}

	// Update classes based on current settings
	function updateClasses() {
		const mainElement = document.getElementById("main");
		if (!mainElement) return;

		if (state) {
			mainElement.classList.add("immersive-view-active");
			Object.keys(settings).forEach(async key => {
				if (key.startsWith("hide")) {
					const className = key.toLowerCase();
					if (settings[key]) {
						mainElement.classList.add(className);
					} else {
						mainElement.classList.remove(className);
					}
				}

				if (key.includes("Controls")) {
					if (settings[key]) {
						// Override some theming of the html element
						const style = document.createElement("style");
						style.classList.add("immersive-view-controls");
						style.innerHTML = `
                html > body::after { display: none !important; }
                .Root__globalNav { padding-inline: 8px !important; padding-inline-end: 16px !important; }
                .Titlebar { display: none !important; } /* Hide the titlebar completely */
            `;
						document.head.appendChild(style);

						// Spotify functions >= 1.2.51
						if (Spicetify.Platform.UpdateAPI._updateUiClient?.updateTitlebarHeight) {
							Spicetify.Platform.UpdateAPI._updateUiClient.updateTitlebarHeight({
								height: 1
							});
						}

						if (Spicetify.Platform.UpdateAPI._updateUiClient?.setButtonsVisibility) {
							Spicetify.Platform.UpdateAPI._updateUiClient.setButtonsVisibility(false);
						}

						window.addEventListener("beforeunload", () => {
							if (Spicetify.Platform.UpdateAPI._updateUiClient?.setButtonsVisibility) {
								Spicetify.Platform.UpdateAPI._updateUiClient.setButtonsVisibility(true);
							}
						});

						// Spotify functions < 1.2.51
						await Spicetify.CosmosAsync.post("sp://messages/v1/container/control", {
							type: "update_titlebar",
							height: "1px"
						});

						// Now send a post request every X milliseconds to ensure the height stays at 1px
						const enforceHeight = () => {
							Spicetify.CosmosAsync.post("sp://messages/v1/container/control", {
								type: "update_titlebar",
								height: "1px"
							});
						};

						// Set an interval to periodically send the post request to enforce the height
						const intervalId = setInterval(enforceHeight, 100); // Every 100ms

						// Optionally, stop the interval after a certain period (e.g., 10 seconds)
						setTimeout(() => {
							clearInterval(intervalId); // Stop after 10 seconds if desired
						}, 10000); // Adjust time as necessary
					}
				}
			});
		} else {
			mainElement.classList.remove("immersive-view-active");
			Object.keys(settings).forEach(key => {
				if (key.startsWith("hide")) {
					const className = key.toLowerCase();
					mainElement.classList.remove(className);
				}
			});

			const styleElements = document.querySelectorAll(".immersive-view-controls");
			styleElements.forEach(styleElement => {
				styleElement.remove();
			});

			if (Spicetify.Platform.UpdateAPI._updateUiClient?.setButtonsVisibility) {
				Spicetify.Platform.UpdateAPI._updateUiClient.setButtonsVisibility({ showButtons: true });
			}

			if (Spicetify.Platform.UpdateAPI._updateUiClient?.updateTitlebarHeight) {
				Spicetify.Platform.UpdateAPI._updateUiClient.updateTitlebarHeight({
					height: settings.customHeight
				});
			}

			// Spotify functions < 1.2.51
			Spicetify.CosmosAsync.post("sp://messages/v1/container/control", {
				type: "update_titlebar",
				height: settings.customHeight
			});
		}
	}

	// Create the immersive view toggle button
	const buttonLabel = () => (state ? "Exit Immersive View" : "Enter Immersive View");
	const buttonIcon = () => (state ? "minimize" : "fullscreen");

	const button = new Spicetify.Topbar.Button(
		buttonLabel(),
		buttonIcon(),
		() => {
			state = !state;
			button.label = buttonLabel();
			button.icon = buttonIcon();
			updateClasses();
		},
		false,
		true
	);

	button.tippy.setProps({
		placement: "bottom"
	});

	// Keyboard shortcut
	Spicetify.Keyboard.registerShortcut({ key: "i", ctrl: true }, () => {
		button.element.querySelector("button").click();
	});
	Spicetify.Keyboard.registerShortcut("esc", () => {
		if (state) {
			button.element.querySelector("button").click();
		}
	});

	// Config Menu Component
	const SettingsContent = () => {
		const ToggleButton = ({ isActive, onClick }) => {
			return Spicetify.React.createElement(
				"button",
				{
					className: isActive ? "active" : "",
					onClick: e => {
						e.stopPropagation();
						onClick(e);
					}
				},
				Spicetify.React.createElement(
					"svg",
					{ viewBox: "0 0 24 24" },
					Spicetify.React.createElement("rect", {
						x: 3,
						y: 3,
						width: 18,
						height: 18,
						rx: 4,
						fill: "none",
						stroke: "currentColor",
						strokeWidth: 2
					}),
					isActive &&
						Spicetify.React.createElement("path", {
							d: "M8 12l2 2 4-4",
							stroke: "currentColor",
							strokeWidth: 2,
							fill: "none"
						})
				)
			);
		};

		const TextBox = ({ value, onChange }) => {
			return Spicetify.React.createElement("input", {
				type: "text",
				value: value,
				onChange: e => onChange(e.target.value)
			});
		};

		const [localSettings, setLocalSettings] = Spicetify.React.useState({ ...settings });

		const toggleSetting = key => {
			const updatedSettings = { ...localSettings, [key]: !localSettings[key] };
			setLocalSettings(updatedSettings);
			settings[key] = updatedSettings[key];
			saveSettings();
			if (key === "enableAtStartup") return; // No immediate effect for this setting
			updateClasses();
		};

		return Spicetify.React.createElement(
			"div",
			{ className: "immersive-view-settings" },
			["enableAtStartup", "hideControls", "hideTopbar", "hideLibrary", "hideRightPanel", "hidePlaybar"].map(key => {
				// Check if the current setting is "hideControls"
				const isHideControls = key === "hideControls"; // This should be defined here

				return Spicetify.React.createElement(
					"div",
					{ className: "setting-item" },
					Spicetify.React.createElement(
						"span",
						null,
						key
							.replace("hide", "Hide ")
							.replace("enable", "Enable ")
							.replace(/([A-Z])/g, " $1")
							.trim()
					),
					Spicetify.React.createElement(ToggleButton, {
						isActive: localSettings[key],
						onClick: () => toggleSetting(key)
					}),
					// If it's "hideControls", show the "Revert Height" option immediately after it
					isHideControls &&
						localSettings["hideControls"] &&
						Spicetify.React.createElement(
							"div",
							{ className: "setting-item setting-item-special" },
							Spicetify.React.createElement("span", null, "> Revert Height"),
							Spicetify.React.createElement(TextBox, {
								value: settings.customHeight, // Use customHeight instead of customCSS
								onChange: value => {
									settings.customHeight = value; // Update customHeight directly
									saveSettings();
									updateClasses();
								}
							})
						)
				);
			})
		);
	};

	// Config Modal trigger (Right click)
	button.element.oncontextmenu = event => {
		event.preventDefault();
		Spicetify.PopupModal.display({
			title: "Immersive View Settings",
			content: Spicetify.React.createElement(SettingsContent)
		});
	};
})();
