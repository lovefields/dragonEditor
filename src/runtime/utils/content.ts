import { _clenupCursor } from "./cursor";
import "../type.d.ts";

export function _addBlockToContent($block: HTMLElement, store: any) {
    if (store.cursorData === null && store.$currentBlock === null) {
        (store.$content as HTMLDivElement).insertAdjacentElement("beforeend", $block);
    } else {
        _clenupCursor(store);

        if (store.$currentBlock === null) {
            let $target = store.cursorData.startNode;

            if ($target.constructor.name === "Text") {
                $target = $target.parentNode as Node;
            }

            const $targetBlock = ($target as HTMLElement).closest(".de-block") as Element;

            $targetBlock.insertAdjacentElement("afterend", $block);
        } else {
            store.$currentBlock.insertAdjacentElement("afterend", $block);
        }
    }
}
