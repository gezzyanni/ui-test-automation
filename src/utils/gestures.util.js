export const swipe = async (from, to) => {
    await driver.performActions([
        {
            // a. Create the event
            type: 'pointer',
            id: 'finger1',
            parameters: { pointerType: 'touch' },
            actions: [
                // b. Move finger into start position
                { type: 'pointerMove', duration: 0, x: from.x, y: from.y },
                // c. Finger comes down into contact with screen
                { type: 'pointerDown', button: 0 },
                // d. Pause for a little bit
                { type: 'pause', duration: 100 },
                // e. Finger moves to end position
                //    We move our finger from the center of the element to the
                //    starting position of the element
                { type: 'pointerMove', duration: 1000, x: to.x, y: to.y },
                // f. Finger lets up, off the screen
                { type: 'pointerUp', button: 0 },
            ],
        },
    ]);
    await driver.pause(2000);
}


/**
 * 
 * @param {WebdriverIO.Element} el 
 * @param {WebdriverIO.Element} scrollableEl 
 * @param {Number} maxScrolls 
 * @param {Boolean} scrollUp 
 */
export const findElementBySwipe = async (el, scrollableEl, maxScrolls = 5, scrollUp = false) => {
    for (let i = 0; i < maxScrolls; i++) {
        if (await el.isDisplayed()) {
            return el;
        }

        const { x, y, height, width } = await driver.getElementRect(
            scrollableEl.elementId,
        );
        const centerX = x + width / 2;
        const yStart = y + height * 0.9;
        const yEnd = y + height * 0.1;
        // Swipe
        if (scrollUp) {
            // It's the reverse
            await swipe({ x: centerX, y: yEnd }, { x: centerX, y: yStart });
        } else {
            await swipe({ x: centerX, y: yStart }, { x: centerX, y: yEnd });
        }
    }
}

/**
 * 
 * @param {WebdriverIO.Element} el 
 * @param {WebdriverIO.Element} scrollableEl 
 * @param {Number} maxScrolls 
 * @param {Boolean} scrollUp 
 */
export const findElementBySwipeUntilClickable = async (el, scrollableEl, maxScrolls = 5, scrollUp = false) => {
    for (let i = 0; i < maxScrolls; i++) {

        if (await el.isClickable()) {
            return el;
        }

        const { x, y, height, width } = await driver.getElementRect(
            scrollableEl.elementId,
        );
        const centerX = x + width / 2;
        const yStart = y + height * 0.9;
        const yEnd = y + height * 0.1;
        // Swipe
        if (scrollUp) {
            // It's the reverse
            await swipe({ x: centerX, y: yEnd }, { x: centerX, y: yStart });
        } else {
            await swipe({ x: centerX, y: yStart }, { x: centerX, y: yEnd });
        }
    }
}

export const pullToRefresh = async () => {
    const { x, y, width, height } = await driver.getWindowSize();

    let midX = (width / 2);
    let midY = (height / 2);

    let bottomEdge = (height * 0.85);

    await driver.touchAction([
        { action: 'press', x: midX, y: midY },
        { action: 'wait', ms: 1000 },
        { action: 'moveTo', x: midX, y: bottomEdge },
        'release'
    ])
}

export const clickToCoordinate = async (x1, y1) => {
    // https://www.macnp.com/express/info/en/f941e2a8
    const { x, y, width, height } = await driver.getWindowSize();


    let a1 = x1 / x;
    let b1 = y1 / y;

    await driver.touchAction({
        action: 'tap',
        x: a1 * width,
        y: b1 * height
    })
}

export const findElementBySwipeHorizontal = async (el, scrollableEl, maxScrolls = 30, scrollLeft = false) => {
    for (let i = 0; i < maxScrolls; i++) {
        if (await el.isDisplayed()) {
            return el;
        }

        const { x, y, height, width } = await driver.getElementRect(
            scrollableEl.elementId,
        );
        const centerY = y + height / 2;
        const xStart = x + width * 0.9;
        const xEnd = x + width * 0.1;

        // Swipe
        if (scrollLeft) {
            // It's the reverse
            await swipe({ x: xEnd, y: centerY }, { x: xStart, y: centerY });
        } else {
            await swipe({ x: xStart, y: centerY }, { x: xEnd, y: centerY });
        }
    }
}

export const scrollDownOnPage = async (numScrolls) => {
    for (let i = 0; i < numScrolls; i++) {
        const screenSize = await driver.getWindowRect();
        const startY = screenSize.height * 0.8; // Start from 80% down the screen
        const endY = screenSize.height * 0.2;   // End at 20% down the screen
        const centerX = screenSize.width / 2;   // Center X-coordinate

        await swipe({ x: centerX, y: startY }, { x: centerX, y: endY });
    }
}

/**
 * Scroll down in a screen. Finger gesture should be move from top to down.
 *
 * @param   numScrolls  Number of scrolling.
 * @param   yStart    Number (0-1) of y start position in screen device. Example Start from 0.2 -> 20% of the screen from top
 * @param   yEnd    Number (0-1) of y end position in screen device.  Example End from 0.8 -> 80% of the screen from top
 */
export const scrollUpOnPage = async (numScrolls, yStart, yEnd) => {

    for (let i = 0; i < numScrolls; i++) {
        const screenSize = await driver.getWindowRect();
        const startY = screenSize.height * yStart;
        const endY = screenSize.height * yEnd;
        const centerX = screenSize.width / 2;   // Center X-coordinate

        await swipe({ x: centerX, y: startY }, { x: centerX, y: endY });
    }
}

/**
 * 
 * @param {WebdriverIO.Element} canvasElement 
 * @param {Object} param1 
 */
export const drawSignature = async (canvasElement) => {

    await driver.action('pointer')
        .move({ duration: 0, origin: canvasElement, x: 0, y: 0 })
        .down({button:0}) // left button
        .move({ duration: 0, origin: 'pointer', x: 150, y: 0 })
        .move({ duration: 0, origin: 'pointer', x: 0, y: 150 })
        .up({ button: 0 })
        .perform();

};