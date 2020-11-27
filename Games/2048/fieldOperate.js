'use strict';

class FieldOperate extends FieldBase {
	constructor(args) {
		super(args);
		this.makeBlocks();
	}

	isValidCoord(x, y) {
		return _.zipWith([this.params.width, this.params.height], [x, y], (max, x) => ((0 <= x) && (x < max)))
			.every(x => x == true);
	}

	powToShade(pow) {
		let percents = 100 / (this.params.winPower - this.params.startPower) * (pow - this.params.startPower);
		if (percents < 0) percents = 0;
		if (percents > 100) percents = 100;
		return percents;
	}

	textToColor(text) {
		let n = Number(text);
		let pow = Math.log2(n);
		let shade = this.powToShade(pow);
		return {
			bg: `hsl(0, 0%, ${shade}%)`,
			fg: shade < 50 ? 'var(--light)' : 'var(--dark)',
		};
	}

	add(x, y, text, merge = false, logical = true) {
		let block = createDivClass('block');
		this.setBlockText(block, text);

		if (merge) block.classList.add('merge');

		this.field.append(block);

		this.move(block, x, y, false, logical);

		return block;
	}

	delete(block, logical = true, anim = null) {
		if (logical) {
			let coord = this.getBlockCoord(block);
			this.blocks[coord[0]][coord[1]] = null;
		}

		if (anim) {
			block.classList.add(anim);
			setTimeout(() => block.remove(), this.timeout);
		} else block.remove();

	}

	get(x, y) {
		return this.blocks[x][y];
	}

	has(x, y) {
		return this.isValidCoord(x, y) && this.get(x, y) != null;
	}

	clear() {
		for (let column of this.blocks) {
			for (let block of column) {
				if (block) this.delete(block);
			}
		}
	}

	hasBlock(block) {
		return this.getBlockCoord(block) != null;
	}

	getBlockCoord(block) {
		for (let i = 0; i < this.params.width; i++) {
			for (let j = 0; j < this.params.height; j++) {
				if (this.blocks[i][j] == block) return [i, j];
			}
		}

		return null;
	}

	setBlockText(block, text) {
		let {bg, fg} = this.textToColor(text);
		block.innerText = text;
		block.style.background = bg;
		block.style.color = fg;

	}

	getCoordText(x, y) {
		return this.get(x, y).innerText;
	}

	get freeCoords() {
		let ret = [];

		for (let i = 0; i < this.params.width; i++) {
			for (let j = 0; j < this.params.height; j++) {
				if (!this.has(i, j)) ret.push([i, j]);
			}
		}

		return ret;
	}

	getCoordPixels(x, y) {
		return [x, y].map(coord => coord * this.size + (coord + 1) * this.spacing);
	}

	move(block, x, y, write = false, logical = true) {
		let old;
		if (logical) {
			old = this.getBlockCoord(block);
			if (old) this.blocks[old[0]][old[1]] = null;
			this.blocks[x][y] = block;
		}

		let startCoord = this.getCoordPixels(x, y);
		let endCoord = startCoord.map(x => x + this.size);
		endCoord = _.zipWith(this.getCoordPixels(this.params.width, this.params.height), endCoord, _.subtract);

		[block.style.left, block.style.top] = startCoord.map(x => x + 'px');
		[block.style.right, block.style.bottom] = endCoord.map(x => x + 'px');

		if (!logical) return;

		if (write && !_.isEqual(old, [x, y])) {
			this.lastStep.push({
				type: 'move',
				old: old,
				new: [x, y]
			});
		}
	}
}
