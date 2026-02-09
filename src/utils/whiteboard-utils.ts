import { getStroke } from 'perfect-freehand'

export interface Point {
    x: number
    y: number
    pressure?: number
}

export type ElementType = 'pencil' | 'highlighter' | 'eraser' | 'rect' | 'circle' | 'triangle' | 'text' | 'sticky' | 'image';

export interface WhiteboardElement {
    id: string
    type: ElementType
    points?: Point[]
    x: number
    y: number
    endX?: number
    endY?: number
    width?: number
    height?: number
    color: string
    strokeWidth: number
    text?: string
    opacity?: number
    image?: HTMLImageElement
}

export const distanceToSegment = (x: number, y: number, x1: number, y1: number, x2: number, y2: number) => {
    const A = x - x1
    const B = y - y1
    const C = x2 - x1
    const D = y2 - y1

    const dot = A * C + B * D
    const lenSq = C * C + D * D
    let param = -1
    if (lenSq !== 0) param = dot / lenSq

    let xx, yy

    if (param < 0) {
        xx = x1
        yy = y1
    } else if (param > 1) {
        xx = x2
        yy = y2
    } else {
        xx = x1 + param * C
        yy = y1 + param * D
    }

    const dx = x - xx
    const dy = y - yy
    return Math.sqrt(dx * dx + dy * dy)
}

export const isPointInTriangle = (p: { x: number, y: number }, p0: { x: number, y: number }, p1: { x: number, y: number }, p2: { x: number, y: number }) => {
    const A = 0.5 * (-p1.y * p2.x + p0.y * (-p1.x + p2.x) + p0.x * (p1.y - p2.y) + p1.x * p2.y);
    const sign = A < 0 ? -1 : 1;
    const s = (p0.y * p2.x - p0.x * p2.y + (p2.y - p0.y) * p.x + (p0.x - p2.x) * p.y) * sign;
    const t = (p0.x * p1.y - p0.y * p1.x + (p0.y - p1.y) * p.x + (p1.x - p0.x) * p.y) * sign;
    return s > 0 && t > 0 && (s + t) < 2 * A * sign;
}

export const hitTest = (element: WhiteboardElement, x: number, y: number, cameraZ: number): boolean => {
    const threshold = 10 / cameraZ // Adjust threshold based on zoom

    if (element.type === 'pencil' || element.type === 'highlighter' || element.type === 'eraser') {
        // Eraser strokes shouldn't be here if we filtered them out, but just in case
        if (!element.points || element.points.length < 2) return false
        for (let i = 0; i < element.points.length - 1; i++) {
            const p1 = element.points[i]
            const p2 = element.points[i + 1]
            if (distanceToSegment(x, y, p1.x, p1.y, p2.x, p2.y) < Math.max(element.strokeWidth, threshold)) {
                return true
            }
        }
        return false
    }

    // For shapes, we use the bounds
    const minX = Math.min(element.x, element.endX ?? element.x)
    const minY = Math.min(element.y, element.endY ?? element.y)
    const maxX = Math.max(element.x, element.endX ?? element.x)
    const maxY = Math.max(element.y, element.endY ?? element.y)

    if (element.type === 'rect' || element.type === 'text' || element.type === 'sticky' || element.type === 'image') {
        // Simple bounding box check
        return x >= minX && x <= maxX && y >= minY && y <= maxY
    }

    if (element.type === 'circle') {
        const cx = element.x
        const cy = element.y
        const rx = Math.abs((element.endX ?? element.x) - element.x)
        const ry = Math.abs((element.endY ?? element.y) - element.y)
        const radius = Math.sqrt(rx * rx + ry * ry)
        const dist = Math.sqrt(Math.pow(x - cx, 2) + Math.pow(y - cy, 2))
        return dist <= radius
    }

    if (element.type === 'triangle') {
        const p0 = { x: element.x, y: element.y }
        const p1 = { x: element.endX ?? element.x, y: element.endY ?? element.y }
        const p2 = { x: element.x - ((element.endX ?? element.x) - element.x), y: element.endY ?? element.y }
        return isPointInTriangle({ x, y }, p0, p1, p2)
    }

    return false
}

// SVG Eraser Cursor
// Using a filled path for better visibility on both light/dark backgrounds if we were to support them,
// but for now optimizing for dark board (white stroke).
// Hotspot set to 4 20 (near the tip of the eraser)
export const ERASER_CURSOR_URL = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="rgba(255,255,255,0.2)" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"/><path d="M22 21H7"/><path d="m5 11 9 9"/></svg>') 4 20, auto`;
