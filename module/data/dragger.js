export class Dragger extends Draggable {
    constructor(app, element, handle, collapsibleElements, {width: collapsedWidth, height: collapsedHeight} = {}) {
        super(app, element, handle, false);
        this.collapsibles = collapsibleElements;
        this.expandedWidth = this.app.position.width;
        this.expandedHeight = this.app.position.height;
        this.collapsedWidth = collapsedWidth || this.handle.offsetWidth;
        this.collapsedHeight = collapsedHeight || this.handle.offsetHeight;
    }

    expand() {
        for (const el of this.collapsibles)
            el.classList.remove("collapsed");
        this.app.setPosition({
            width: this.expandedWidth,
            height: this.expandedHeight
        });
        setTimeout(() => this.app.render(), 100);
    }

    collapse() {
        for (const el of this.collapsibles)
            el.classList.add("collapsed");
        setTimeout(() => this.app.setPosition({
            width: this.collapsedWidth,
            height: this.collapsedHeight
        }), 500);
    }

    get isCollapsed() { return this.handle.classList.contains("collapsed") }

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
    }
}