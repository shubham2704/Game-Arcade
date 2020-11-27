'use strict';

class FieldBase {
	constructor(args) {
		this.elem = null;

		this.setParams(args);

		this.darkTheme = false;
		this.size = parseFloat(getRootCssVar('size'));
		this.spacing = parseFloat(getRootCssVar('spacing'));
		this.timeout = parseFloat(getRootCssVar('transition')) * 1000;
		this.timeoutMove = parseFloat(getRootCssVar('transition-move')) * 1000;
		this.messageTimeout = 1000;
	}

	setParams(args) {
		if (this.params == undefined)
			this.params = Object.assign(Object.assign({}, defaultParams), args);
		else
			this.params = Object.assign(Object.assign({}, this.params), args);
	}

	makeBGField() {
		let field = createDivClass('field', 'bg');

		setRootCssVar('width', this.params.width);
		setRootCssVar('height', this.params.height);

		for (let i = 0; i < this.params.width * this.params.height; i++) {
			let block = createDivClass('block');
			field.append(block);
		}

		return field;
	}

	makeField() {
		let field = createDivClass('field');

		return field;
	}

	makeMessage() {
		let message = createDivClass('message', 'hidden');
		return message;
	}

	makeFieldContainer() {
		let container = createDivClass('field-container');

		let bgField = this.makeBGField(this.params.width, this.params.height);
		let field = this.makeField(this.params.width, this.params.height);
		let message = this.makeMessage();

		this.field = field;
		this.message = message;

		container.append(bgField);
		container.append(field);
		container.append(message);

		return container;
	}

	makeContainer() {
		let container = createDivClass('container');

		let menu = createDivClass('horizontal-menu');
		let leftButtons = createDivClass('horizontal-menu');
		let rightButtons = createDivClass('horizontal-menu');

		let newGameButton = createDivClass('button');
		newGameButton.addEventListener('click', () => this.newGame({}));
		newGameButton.innerText = 'New game';

		this.backButton = createDivClass('button');
		this.backButton.innerText = 'Back';
		this.backButton.addEventListener('click', () => {
			if (this.backButton.classList.contains('disabled'))
				return;

			this.back();
			this.backButton.classList.add('disabled');
		});

		let settingsButton = createDivClass('button');
		settingsButton.innerText = 'Settings';
		settingsButton.addEventListener('click', () => this.settings());

		leftButtons.append(newGameButton, this.backButton);

		rightButtons.append(settingsButton);

		menu.append(leftButtons, rightButtons);

		let fieldContainer = this.makeFieldContainer();
		container.append(menu, fieldContainer);

		return container;
	}

	makeBlocks() {
		this.blocks = [];
		for (let i = 0; i < this.params.width; i++) {
			this.blocks.push([]);
			for (let j = 0; j < this.params.height; j++) {
				this.blocks[i].push(null);
			}
		}
	}

	newGame(args) {
		this.clear();

		this.setParams(args);
		this.makeBlocks();

		let newElem = this.makeContainer();

		if (!this.elem) {
			this.elem = newElem;
			this.isFirstGame = false;
		} else {
			this.elem.replaceWith(newElem);
			this.elem = newElem;
		}

		this.hideMessage();

		this.new = [];
		this.won = false;
		this.lost = false;
		this.paused = false;
		this.backPressed = 0;
		this.settingsOpened = false;

		for (let i = 0; i < this.params.startCount; i++)
			this.addRandomBlock();

		this.backButton.classList.add('disabled');

		return this.elem;
	}
}
