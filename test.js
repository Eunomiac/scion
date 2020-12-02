/**************************************
* IN ../mixins/generalMixins.js
***************************************/
export const EditableDivs = (superClass) => class extends superClass {
    activateListeners(html) {
        super.activateListeners(html);
		// CONTENT-EDITABLE DIVS
		html.find("div.contentEditable").each((i, element) => {
			element.addEventListener("click", _onEditClickOn.bind(this));
			element.addEventListener("focus", _onEditFocus.bind(this));
			element.addEventListener("blur", _onEditClickOff.bind(this));			
			/* ... etc, etc, etc */
			this.entity.update({[dataSet.path.replace(/^(actor|item)\./u, "")]: entityVal});
			// "this.entity" ensures the mixin works with both Actors and Items
		});
	}
};
			
/**************************************
* IN actor-sheet.js
***************************************/
import {MIX, EditableDivs} from "../mixins/generalMixins.js";
export class ScionActorSheet extends MIX(ActorSheet).with(EditableDivs) {
    activateListeners(html) {
        super.activateListeners(html);
        // CONTENT-EDITABLE DIVS
		// 				 ... lives here no longer!
	}
}

/**************************************
* IN item-sheet.js
***************************************/
import {MIX, EditableDivs} from "../mixins/generalMixins.js";
export class ScionItemSheet extends MIX(ItemSheet).with(EditableDivs) {
    activateListeners(html) {
        super.activateListeners(html);
        // CONTENT-EDITABLE DIVS
		// 				 ... is duplicated here no longer!
	}
}