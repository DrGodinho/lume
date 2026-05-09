const cloneItems = (items: any[]) => items.map(b => ({ ...b }));

self.onmessage = (e: MessageEvent) => {
    const { vidros, rollW, margin, modoOtimizacao } = e.data;
    let baseItems = vidros.map((v: any) => {
        const bw = v.forceRotate ? (v.oh + margin) : (v.ow + margin);
        const bh = v.forceRotate ? (v.ow + margin) : (v.oh + margin);
        const brw = v.forceRotate ? v.oh : v.ow;
        const brh = v.forceRotate ? v.ow : v.oh;
        return { 
            id: v.id, 
            w: bw, 
            h: bh, 
            rw: brw, 
            rh: brh, 
            cor: v.cor, 
            label: v.label, 
            rotated: v.forceRotate === true, 
            h_visual: bh, 
            forceRotate: v.forceRotate, 
            alignRight: v.alignRight === true, 
            sortOrder: v.sortOrder ?? 0 
        };
    });
    
    // Always pack in explicit sortOrder so drag-reorder is respected
    baseItems.sort((a: any, b: any) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
    
    let result;

    if (modoOtimizacao === 'densidade') {
        let items = cloneItems(baseItems);
        let freeRects = [{ x: 0, y: 0, w: rollW, h: 999999 }];
        let currentMaxY = 0, currentAreaV = 0;
        
        items.forEach(b => {
            let bestRectIdx = -1, bestY = Infinity, bestScoreX = b.alignRight ? -1 : Infinity, finalX = 0, willRotate = false;
            for (let i = 0; i < freeRects.length; i++) {
                let r = freeRects[i];
                if (b.w <= r.w && b.h <= r.h) { 
                    if (r.y < bestY || (r.y === bestY && (b.alignRight ? (r.x + r.w > bestScoreX) : (r.x < bestScoreX)))) { 
                        bestY = r.y; bestScoreX = b.alignRight ? (r.x + r.w) : r.x; finalX = b.alignRight ? (r.x + r.w - b.w) : r.x; bestRectIdx = i; willRotate = false; 
                    } 
                }
                if (b.forceRotate !== true && b.h <= r.w && b.w <= r.h) { 
                    if (r.y < bestY || (r.y === bestY && (b.alignRight ? (r.x + r.w > bestScoreX) : (r.x < bestScoreX)))) { 
                        bestY = r.y; bestScoreX = b.alignRight ? (r.x + r.w) : r.x; finalX = b.alignRight ? (r.x + r.w - b.h) : r.x; bestRectIdx = i; willRotate = true; 
                    } 
                }
            }
            if (bestRectIdx !== -1) {
                if (willRotate) { [b.w, b.h] = [b.h, b.w]; [b.rw, b.rh] = [b.rh, b.rw]; b.rotated = true; b.h_visual = b.h; }
                b.fit = { x: finalX, y: bestY };
                if (b.fit.y + b.h > currentMaxY) currentMaxY = b.fit.y + b.h;
                currentAreaV += (b.rw * b.rh);
                let newFR = [];
                for (let i = 0; i < freeRects.length; i++) {
                    let fr = freeRects[i];
                    if (b.fit.x < fr.x + fr.w && b.fit.x + b.w > fr.x && b.fit.y < fr.y + fr.h && b.fit.y + b.h > fr.y) {
                        if (b.fit.y > fr.y) newFR.push({ x: fr.x, y: fr.y, w: fr.w, h: b.fit.y - fr.y });
                        if (b.fit.y + b.h < fr.y + fr.h) newFR.push({ x: fr.x, y: b.fit.y + b.h, w: fr.w, h: (fr.y + fr.h) - (b.fit.y + b.h) });
                        if (b.fit.x > fr.x) newFR.push({ x: fr.x, y: fr.y, w: b.fit.x - fr.x, h: fr.h });
                        if (b.fit.x + b.w < fr.x + fr.w) newFR.push({ x: b.fit.x + b.w, y: fr.y, w: (fr.x + fr.w) - (b.fit.x + b.w), h: fr.h });
                    } else { newFR.push(fr); }
                }
                freeRects = [];
                for (let i = 0; i < newFR.length; i++) {
                    let r1 = newFR[i], isContained = false;
                    for (let j = 0; j < newFR.length; j++) {
                        if (i === j) continue;
                        let r2 = newFR[j];
                        if (r1.x >= r2.x && r1.y >= r2.y && r1.x + r1.w <= r2.x + r2.w && r1.y + r1.h <= r2.y + r2.h) { isContained = true; break; }
                    }
                    if (!isContained) freeRects.push(r1);
                }
            }
        });
        result = { blocos: items, maxY: currentMaxY, areaV: currentAreaV };
    } else {
        let strategies = [];
        strategies.push(cloneItems(baseItems));
        strategies.push(cloneItems(baseItems));
        strategies.push(cloneItems(baseItems).map(b => { if (b.forceRotate !== true && b.w > b.h && b.h <= rollW) { [b.w, b.h] = [b.h, b.w]; [b.rw, b.rh] = [b.rh, b.rw]; b.rotated = true; b.h_visual = b.h; } return b; }));
        strategies.push(cloneItems(baseItems).map(b => { if (b.forceRotate !== true && b.h > b.w && b.h <= rollW) { [b.w, b.h] = [b.h, b.w]; [b.rw, b.rh] = [b.rh, b.rw]; b.rotated = true; b.h_visual = b.h; } return b; }));
        let bestResult: any = null, minTotalY = Infinity;
        strategies.forEach(testItems => {
            let shelves: any[] = [], totalY = 0, currentAreaV = 0;
            testItems.forEach(item => {
                let placed = false, bCSI = -1, bCI = -1, bCW = Infinity;
                for (let i = 0; i < shelves.length; i++) {
                    let shelf = shelves[i];
                    for (let j = 0; j < shelf.columns.length; j++) {
                        let col = shelf.columns[j], rH = shelf.height - col.currentHeight;
                        if (item.w <= col.width && item.h <= rH) { let sc = (col.width - item.w) * 5 + (rH - item.h); if (sc < bCW) { bCW = sc; bCSI = i; bCI = j; } }
                    }
                }
                if (bCSI !== -1) {
                    let shelf = shelves[bCSI], col = shelf.columns[bCI], rH = shelf.height - col.currentHeight;
                    if (rH - item.h <= 10) item.h = rH;
                    item.fit = { x: col.x, y: shelf.y + col.currentHeight };
                    col.blocks.push(item); col.currentHeight += item.h; placed = true; currentAreaV += (item.rw * item.rh);
                }
                if (!placed) {
                    let bSI = -1, bW = Infinity;
                    for (let i = 0; i < shelves.length; i++) {
                        let shelf = shelves[i];
                        if (item.w <= (rollW - shelf.currentWidth) && item.h <= shelf.height) { let wH = shelf.height - item.h; if (wH < bW) { bW = wH; bSI = i; } }
                    }
                    if (bSI !== -1) {
                        let shelf = shelves[bSI];
                        if (shelf.height - item.h <= 10) item.h = shelf.height;
                        let nC = { x: shelf.currentWidth, width: item.w, currentHeight: item.h, blocks: [item] };
                        item.fit = { x: nC.x, y: shelf.y }; shelf.columns.push(nC); shelf.currentWidth += item.w; placed = true; currentAreaV += (item.rw * item.rh);
                    }
                }
                if (!placed) {
                    let nC = { x: 0, width: item.w, currentHeight: item.h, blocks: [item] };
                    let nS = { y: totalY, height: item.h, currentWidth: item.w, columns: [nC] };
                    item.fit = { x: 0, y: totalY }; shelves.push(nS); totalY += item.h; currentAreaV += (item.rw * item.rh);
                }
            });
            shelves.forEach(shelf => {
                const sobra = rollW - shelf.currentWidth;
                if (shelf.columns.length > 1 && sobra > 5 && sobra < 60) {
                    const lC = shelf.columns[shelf.columns.length - 1], nX = rollW - lC.width, sh = nX - lC.x;
                    lC.x = nX; lC.blocks.forEach((b: any) => { if (b.fit) b.fit.x += sh; });
                } else if (sobra > 0) {
                    let currentRight = rollW;
                    for (let c = shelf.columns.length - 1; c >= 0; c--) {
                        let col = shelf.columns[c];
                        if (col.blocks.some((b: any) => b.alignRight === true)) {
                            let nX = currentRight - col.width, sh = nX - col.x;
                            col.x = nX;
                            col.blocks.forEach((b: any) => { if (b.fit) b.fit.x += sh; });
                            currentRight = nX;
                        } else break;
                    }
                }
            });
            let flatBlocks = shelves.flatMap(s => s.columns.flatMap((c: any) => c.blocks));
            if (totalY < minTotalY) { minTotalY = totalY; bestResult = { totalY, currentAreaV, blocks: flatBlocks }; }
        });
        result = { blocos: bestResult.blocks, maxY: bestResult.totalY, areaV: bestResult.currentAreaV };
    }
    self.postMessage(result);
};
