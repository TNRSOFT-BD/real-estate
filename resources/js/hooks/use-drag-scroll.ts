import type { MouseEvent as ReactMouseEvent, PointerEvent as ReactPointerEvent } from 'react';
import { useCallback, useEffect, useRef } from 'react';

/**
 * Enables click-and-drag horizontal scrolling on an overflow container.
 *
 * Native touch scrolling is left untouched; only mouse/pen pointers are
 * handled so desktop users can pan by grabbing the content. A click that
 * follows a drag is suppressed so it does not trigger the underlying control.
 */
export function useDragScroll<T extends HTMLElement>(threshold = 6) {
    const ref = useRef<T | null>(null);
    const state = useRef({ pointerId: null as number | null, startX: 0, startScrollLeft: 0, moved: false });

    const onPointerDown = useCallback((event: ReactPointerEvent<T>) => {
        if (event.pointerType === 'touch') {
            return;
        }

        if (event.pointerType === 'mouse' && event.button !== 0) {
            return;
        }

        const element = ref.current;

        if (!element) {
            return;
        }

        state.current = {
            pointerId: event.pointerId,
            startX: event.clientX,
            startScrollLeft: element.scrollLeft,
            moved: false,
        };
    }, []);

    useEffect(() => {
        const onMove = (event: PointerEvent) => {
            const element = ref.current;
            const current = state.current;

            if (!element || current.pointerId === null || event.pointerId !== current.pointerId) {
                return;
            }

            const delta = event.clientX - current.startX;

            if (!current.moved && Math.abs(delta) < threshold) {
                return;
            }

            current.moved = true;
            event.preventDefault();
            element.scrollLeft = current.startScrollLeft - delta;
        };

        const onRelease = (event: PointerEvent) => {
            if (state.current.pointerId === null || event.pointerId !== state.current.pointerId) {
                return;
            }

            state.current.pointerId = null;
        };

        window.addEventListener('pointermove', onMove, { passive: false });
        window.addEventListener('pointerup', onRelease);
        window.addEventListener('pointercancel', onRelease);

        return () => {
            window.removeEventListener('pointermove', onMove);
            window.removeEventListener('pointerup', onRelease);
            window.removeEventListener('pointercancel', onRelease);
        };
    }, [threshold]);

    const onClickCapture = useCallback((event: ReactMouseEvent) => {
        if (state.current.moved) {
            event.preventDefault();
            event.stopPropagation();
            state.current.moved = false;
        }
    }, []);

    return { ref, onPointerDown, onClickCapture };
}
