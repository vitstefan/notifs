/** Enums representing notification's options. */
/** Light and dark theme */
enum NTheme { Light, Dark, }
/** Notification content type - differs in content color */
enum NContentType { Default, Success, Error, Warning, Info, }
/** Position of notification (with BottomRightCorner consider setting Regime to JustOne or Clear) */
enum NPosition { WholeScreen, RightSide, BottomRightCorner, }
/** Regime - JustOne (shows only last notification), Dominant (shows all notifications, but the last one is more dominant), SideBySide (shows all notifications), Clear (shown only last and clears history) */
enum NRegime { JustOne, Dominant, SideBySide, Clear, }
/** Lifespan of notification, when TillClosed set, close button will appear */
enum NLifespan { OneSecond, TwoSeconds, ThreeSeconds, FourSeconds, FiveSeconds, TillClosed, }

/*----------------------------------------------------------------------------------------------------------------------------------------------------*/

/**
 * Call this function with desired parameters to build notification.
 * 
 * @param {string} text Content text of notification.
 * @param {NTheme} theme Theme of notification.
 * @param {NContentType} contentType Differentiates content text.
 * @param {NPosition} position Whole screen / Right side / Bottom right corner.
 * @param {NRegime} regime Option to show just the last one or the other notifications too.
 * @param {NLifespan} lifespan Lifespan of notification, could disappear after few seconds or stay there till user dismisses it.
 */
function buildNotification(text: string,
    theme: NTheme = NTheme.Dark,
    contentType: NContentType = NContentType.Default,
    position: NPosition = NPosition.BottomRightCorner,
    regime: NRegime = NRegime.JustOne,
    lifespan: NLifespan = NLifespan.OneSecond): void {

    //remove close button
    removeCloseButton();

    //theme
    document.documentElement.style.setProperty('--notifs-background-color', theme === NTheme.Dark ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.9)');
    document.documentElement.style.setProperty('--notifs-content-color', theme === NTheme.Dark ? '#ffffff' : '#000000');

    //position
    getCanvas().classList.remove('notifs-canvas-hidden');
    getContent().classList.remove('notifs-content-hidden');

    switch (position) {
        case NPosition.WholeScreen:
            getCanvas().classList.add('notifs-canvas-whole-screen');
            break;
        case NPosition.RightSide:
            getCanvas().classList.add('notifs-canvas-right-side');
            break;
        default:
            getCanvas().classList.add('notifs-canvas-bottom-right-corner');
            break;
    }

    //regime
    //recommended regime for bottom right corner notification is JustOne or Clear
    switch (regime) {
        case NRegime.Clear:
            clearActives();
            break;
        case NRegime.JustOne:
            hideAll();
            break;
        case NRegime.Dominant:
            makeAllDefault();
            makeAllOpaque();
            break;
        default:
            makeAllDefault();
            break;
    }

    //content and content type
    //it takes roughly about 100 characters to correctly fit bottom right corner notification
    addNotification(text, contentType);

    //lifespan
    if (lifespan !== NLifespan.TillClosed) {
        let timeout = 0;
        switch (lifespan) {
            case NLifespan.TwoSeconds:
                timeout = 2000;
                break;
            case NLifespan.ThreeSeconds:
                timeout = 3000;
                break;
            case NLifespan.FourSeconds:
                timeout = 4000;
                break;
            case NLifespan.FiveSeconds:
                timeout = 5000;
                break;
            default:
                timeout = 1000;
                break;
        }
        setTimeout(() => {
            hide();
        }, timeout);
    } else {
        addCloseButton();
    }
}

/*----------------------------------------------------------------------------------------------------------------------------------------------------*/

function getCanvas(): HTMLElement {
    return document.getElementsByClassName('notifs-canvas')[0] as HTMLElement;
}

function getCloseButton(): HTMLElement {
    return document.getElementsByClassName('notifs-cross')[0] as HTMLElement;
}

function getContent(): HTMLOListElement {
    return document.getElementsByClassName('notifs-content')[0] as HTMLOListElement;
}

function getActiveCount(): number {
    return document.getElementById('notifs-content').childElementCount;
}

/**
 * Adds notification to html document. Called from buildNotification.
 */
function addNotification(text: string, contentType: NContentType = NContentType.Default): void {
    let newNotification = document.createElement('li');
    newNotification.innerHTML = text;
    if (contentType !== NContentType.Default) {
        newNotification.classList.add(`notifs-content-type-${contentType}`);
    }
    getContent().appendChild(newNotification);
}

function addCloseButton(): void {
    let closeButton = document.createElement('li');
    closeButton.innerHTML = '&times;';
    closeButton.id = 'notifs-close-button';
    closeButton.classList.add('notifs-close-button');
    closeButton.addEventListener('click', hide);
    getContent().appendChild(closeButton);
}

function removeCloseButton(): void {
    if ((getContent().lastChild as HTMLElement).id === 'notifs-close-button') {
        getContent().removeChild(getContent().lastChild);
    }
}

function hide(): void {
    getCanvas().classList.remove('notifs-canvas-whole-screen', 'notifs-canvas-right-side', 'notifs-canvas-bottom-right-corner');
    getCanvas().classList.add('notifs-canvas-hidden');
    getCanvas().removeEventListener('click', hide);

    getContent().classList.add('notifs-content-hidden');
}

function clearActives(): void {
    while (getContent().hasChildNodes()) {
        getContent().removeChild(getContent().lastChild);
    }
}

function makeAllDefault(): void {
    for (let i = 0; i < getContent().children.length; i++) {
        getContent().children[i].classList.remove('notifs-hidden', 'notifs-opaque');
    }
}

function hideAll(): void {
    for (let i = 0; i < getContent().children.length; i++) {
        getContent().children[i].classList.add('notifs-hidden');
    }
}

function makeAllOpaque(): void {
    for (let i = 0; i < getContent().children.length; i++) {
        getContent().children[i].classList.add('notifs-opaque');
    }
}

/*----------------------------------------------------------------------------------------------------------------------------------------------------*/

/**
 * This function is called from showcase site. For your project, call buildNotification above to create notifs.
 */
function createNotification() {
    const content = (document.getElementById('input-content') as HTMLInputElement).value;
    const theme = Number((document.getElementById('select-theme') as HTMLSelectElement).value);
    const contentType = Number((document.getElementById('select-content-type') as HTMLSelectElement).value);
    const position = Number((document.getElementById('select-position') as HTMLSelectElement).value);
    const regime = Number((document.getElementById('select-regime') as HTMLSelectElement).value);
    const lifespan = Number((document.getElementById('select-lifespan') as HTMLSelectElement).value);

    buildNotification(content, theme, contentType, position, regime, lifespan);
}