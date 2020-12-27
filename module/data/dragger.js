import {U} from "../modules.js";

export class Dragger extends Draggable {

    constructor(app, element, handle, collapsibleElements, {width: collapsedWidth, height: collapsedHeight} = {}, delayedCollapsibles = []) {
        super(app, element, handle, false);
        this.collapsibles = collapsibleElements;
        this.delayedCollapsibles = delayedCollapsibles;
        this.appClassName = app.constructor.name;
        this.expandedWidth = app.constructor.defaultOptions.width;
        this.expandedHeight = app.constructor.defaultOptions.height;
        this.collapsedWidth = collapsedWidth || this.handle.offsetWidth;
        this.collapsedHeight = collapsedHeight || this.handle.offsetHeight;
        // this.appElement = this.app.element[0];
        // this.mirrorContainers = this.appElement.getElementsByClassName("mirrorContainer");

        // Hooks.on(`close${this.appClassName}`, () => { setTimeout(() => this.expand(false), 500) });
        Hooks.on(`render${this.appClassName}`, () => {
            if (this.isCollapsed && (this.app.position.width !== this.collapsedWidth || this.app.position.height !== this.collapsedHeight))
                this.app.setPosition({
                    width: this.collapsedWidth,
                    height: this.expandedHeight
                });
            else if (this.app.position.width !== this.expandedWidth || this.app.position.height !== this.expandedHeight)
                this.app.setPosition({
                    width: this.expandedWidth,
                    height: this.expandedHeight
                });
            // this.setMirrorPosition();
        });
    }

    expand(isRendering = true) {
        for (const el of this.collapsibles)
            el.classList.remove("collapsed");
        this.app.setPosition({
            width: this.expandedWidth,
            height: this.expandedHeight
        });
        if (isRendering)
            setTimeout(() => this.app.render(), 500);
        setTimeout(() => {
            for (const el of this.delayedCollapsibles)
                el.classList.remove("collapsed");
        }, 2000);
    }

    collapse() {
        for (const el of [...this.collapsibles, ...this.delayedCollapsibles])
            el.classList.add("collapsed");
        setTimeout(() => this.app.setPosition({
            width: this.collapsedWidth,
            height: this.collapsedHeight
        }), 500);
    }

    get isCollapsed() { return this.handle.classList.contains("collapsed") }

    // setMirrorPosition() {
    //     const posData = {
    //         top: `-${this.appElement.style.top}`,
    //         left: `-${this.appElement.style.left}`,
    //         height: `${window.innerHeight}px`,
    //         width: `${window.innerWidth}px`
    //     };
    //     for (const mirrorContainer of this.mirrorContainers)
    //         Object.assign(mirrorContainer.style, posData);
    // }

    _onDragMouseMove(event) {
        event.preventDefault();

        // Limit dragging to 60 updates per second
        const now = Date.now();
        if ( (now - this._moveTime) < (1000/60) )
            return;
        this._moveTime = now;

        // Base position clamping on collapsed vs. expanded, rather than minimized:
        this.app.setPosition({
            left: this.position.left + (event.clientX - this._initial.x),
            top: this.position.top + (event.clientY - this._initial.y),
            width: this.isCollapsed ? this.collapsedWidth : this.expandedWidth,
            height: this.isCollapsed ? this.collapsedHeight : this.expandedHeight
        });
        // this.setMirrorPosition();
    }
}