const matches = [
	{
		id: 'third-place',
		name: '季軍賽',
		label: '法國 (主) vs 英格蘭 (客)',
		tag: '第三名決定戰',
		home: '法國',
		away: '英格蘭',
	},
	{
		id: 'final',
		name: '冠軍賽',
		label: '西班牙 (主) vs 阿根廷 (客)',
		tag: '決賽',
		home: '西班牙',
		away: '阿根廷',
	},
];

const rewardTiers = [
	{
		name: '頭獎',
		badge: '終極大獎',
		threshold: 1000,
		accent: 'gold',
		items: [
			'現金 1,000 元',
			'清空購物車（上限 1500 元）',
			'高級餐廳雙人饗宴',
			'無條件答應一件事券',
			'週末小旅行規劃券（兩天一夜）',
		],
	},
	{
		name: '中獎',
		badge: '生活體貼與實用行程',
		threshold: 800,
		accent: 'rose',
		items: [
			'指定大餐（火鍋／壽司／她近期最想吃的美食）',
			'免死金牌券（吵架時立刻道歉）',
			'全套全身按摩 30 分鐘',
			'請看電影一次',
			'500 元餐廳請吃飯券',
			'手作晚餐',
		],
	},
	{
		name: '普獎',
		badge: '日常情趣與點心',
		threshold: 400,
		accent: 'sky',
		items: [
			'上班時外送飲料券',
			'點心兌換券',
			'吹頭髮服務 3 次',
			'請吃 200 元餐廳一次',
			'接送上下班 3 次',
			'請吃宵夜',
		],
	},
];

const POINTS_PER_UNIT = 100;
const MAX_MATCH_POINTS = 1000;
const MAX_MATCH_BETS = 3;

const marketGroups = [
	{
		group: '全場 / 半場賽果預測',
		markets: [
			{
				id: 'full-result',
				title: '全場不讓分 (1X2)',
				description: '預測全場主勝、客勝或和局。',
				buildOptions: (match) => [
					{ label: `${match.home} 勝`, times: 2 },
					{ label: '和局', times: 3 },
					{ label: `${match.away} 勝`, times: 2 },
				],
			},
			{
				id: 'full-handicap',
				title: '全場讓分盤',
				description: (match) => `${match.home} -1 / ${match.away} +1。${match.home} 贏 2 球以上算讓分勝，剛好贏 1 球算讓分和，${match.away} +1 則在 ${match.home} 沒有贏 2 球以上時成立。`,
				buildOptions: (match) => [
					{ label: `${match.home} -1 讓分勝`, times: 2 },
					{ label: `${match.home} -1 讓分和`, times: 3 },
					{ label: `${match.away} +1 受讓勝`, times: 2 },
				],
			},
			{
				id: 'double-chance',
				title: '雙勝',
				description: '一次包辦兩種賽果。',
				buildOptions: (match) => [
					{ label: `${match.home} 或 和局`, times: 1 },
					{ label: `${match.home} 或 ${match.away}`, times: 1 },
					{ label: `${match.away} 或 和局`, times: 1 },
				],
			},
			{
				id: 'half-result',
				title: '半場不讓分',
				description: '只計上半場主勝、和局、客勝。',
				buildOptions: (match) => [
					{ label: `半場 ${match.home} 勝`, times: 2 },
					{ label: '半場和局', times: 3 },
					{ label: `半場 ${match.away} 勝`, times: 2 },
				],
			},
			{
				id: 'half-double-chance',
				title: '半場雙勝',
				description: '上半場包辦兩種賽果，三個選項分開下注。',
				buildOptions: (match) => [
					{ label: `${match.home} 或 和局`, times: 1 },
					{ label: `${match.home} 或 ${match.away}`, times: 1 },
					{ label: `${match.away} 或 和局`, times: 1 },
				],
			},
			{
				id: 'half-full',
				title: '半 / 全場',
				description: '上半場與全場結果一起猜。',
				buildOptions: () => [
					{ label: '主 / 主', times: 3 },
					{ label: '主 / 和', times: 5 },
					{ label: '主 / 客', times: 9 },
					{ label: '和 / 主', times: 7 },
					{ label: '和 / 和', times: 5 },
					{ label: '和 / 客', times: 7 },
					{ label: '客 / 主', times: 9 },
					{ label: '客 / 和', times: 5 },
					{ label: '客 / 客', times: 3 },
				],
			},
		],
	},
	{
		group: '進球數與比數預測',
		markets: [
			{
				id: 'over-under',
				title: '大小',
				description: '預測總進球數大於或小於盤口。',
				buildOptions: () => [
					{ label: '大', times: 1 },
					{ label: '小', times: 1 },
				],
			},
			{
				id: 'odd-even',
				title: '單雙',
				description: '預測全場總進球數是單數或雙數。',
				buildOptions: () => [
					{ label: '單', times: 1 },
					{ label: '雙', times: 1 },
				],
			},
			{
				id: 'total-goals',
				title: '總進球數 / 正確進球數',
				description: '猜全場總進球數。',
				buildOptions: () => [
					{ label: '0 球', times: 6 },
					{ label: '1 球', times: 4 },
					{ label: '2 球', times: 3 },
					{ label: '3 球', times: 3 },
					{ label: '4 球', times: 4 },
					{ label: '5 球', times: 5 },
					{ label: '6 球以上', times: 6 },
				],
			},
			{
				id: 'correct-score',
				title: '正確比數',
				description: '精準預測最終比數。',
				buildOptions: () => [
					{ label: '0:0', times: 5 },
					{ label: '1:0', times: 5 },
					{ label: '0:1', times: 5 },
					{ label: '1:1', times: 4 },
					{ label: '2:0', times: 6 },
					{ label: '0:2', times: 6 },
					{ label: '2:1', times: 7 },
					{ label: '1:2', times: 7 },
					{ label: '2:2', times: 8 },
					{ label: '3:0', times: 9 },
					{ label: '0:3', times: 9 },
					{ label: '其他比數', times: 5 },
				],
			},
			{
				id: 'team-goals',
				title: '主(客)隊大小 / 正確進球數',
				description: '只看單一球隊的進球數。',
				buildOptions: (match) => [
					{ label: `${match.home} 0 球`, times: 4 },
					{ label: `${match.home} 1 球`, times: 3 },
					{ label: `${match.home} 2 球`, times: 3 },
					{ label: `${match.home} 3+ 球`, times: 4 },
					{ label: `${match.away} 0 球`, times: 4 },
					{ label: `${match.away} 1 球`, times: 3 },
					{ label: `${match.away} 2 球`, times: 3 },
					{ label: `${match.away} 3+ 球`, times: 4 },
				],
			},
			{
				id: 'half-over-under',
				title: '半場大小 / 半場正確比數',
				description: '只計算上半場。',
				buildOptions: () => [
					{ label: '半場大', times: 1 },
					{ label: '半場小', times: 1 },
					{ label: '半場 0:0', times: 4 },
					{ label: '半場 1:0', times: 4 },
					{ label: '半場 0:1', times: 4 },
					{ label: '半場 1:1', times: 4 },
					{ label: '半場 2:0', times: 5 },
					{ label: '半場 0:2', times: 5 },
				],
			},
			{
				id: 'higher-half',
				title: '得分較高半場',
				description: '預測哪個半場進球較多。',
				buildOptions: () => [
					{ label: '上半場較多', times: 2 },
					{ label: '下半場較多', times: 2 },
					{ label: '上下半場相同', times: 3 },
				],
			},
		],
	},
	{
		group: '特殊賽況與複合玩法',
		markets: [
			{
				id: 'both-score',
				title: '兩隊是否都進球',
				description: '預測雙方是否都會進球。',
				buildOptions: () => [
					{ label: '是', times: 1 },
					{ label: '否', times: 1 },
				],
			},
			{
				id: 'first-goal',
				title: '第一球 / 下一球 / 最後進球',
				description: '預測哪一隊進指定的一球。',
				buildOptions: (match) => [
					{ label: match.home, times: 2 },
					{ label: match.away, times: 2 },
					{ label: '無進球', times: 5 },
				],
			},
			{
				id: 'combo-result-total',
				title: '不讓分 / 大小 (複合玩法)',
				description: '同時預測賽果與總進球大小。',
				buildOptions: (match) => [
					{ label: `${match.home} 勝 + 大`, times: 4 },
					{ label: `${match.home} 勝 + 小`, times: 4 },
					{ label: '和局 + 大', times: 5 },
					{ label: '和局 + 小', times: 4 },
					{ label: `${match.away} 勝 + 大`, times: 4 },
					{ label: `${match.away} 勝 + 小`, times: 4 },
				],
			},
			{
				id: 'combo-result-both',
				title: '不讓分 / 兩隊是否都進球',
				description: '同時預測賽果與雙方都進球。',
				buildOptions: (match) => [
					{ label: `${match.home} 勝 + 是`, times: 4 },
					{ label: `${match.home} 勝 + 否`, times: 4 },
					{ label: '和局 + 是', times: 5 },
					{ label: '和局 + 否', times: 4 },
					{ label: `${match.away} 勝 + 是`, times: 4 },
					{ label: `${match.away} 勝 + 否`, times: 4 },
				],
			},
			{
				id: 'corners',
				title: '角球玩法',
				description: '角球數大小、單雙與區間。',
				buildOptions: () => [
					{ label: '角球大', times: 1 },
					{ label: '角球小', times: 1 },
					{ label: '角球單', times: 1 },
					{ label: '角球雙', times: 1 },
					{ label: '角球區間 0-8', times: 2 },
					{ label: '角球區間 9-11', times: 2 },
					{ label: '角球區間 12+', times: 3 },
				],
			},
			{
				id: 'champion',
				title: '冠軍 (賽事特別項目)',
				description: '預測最後奪冠隊伍，含延長賽與 PK。',
				buildOptions: (match) => [
					{ label: match.home, times: 4 },
					{ label: match.away, times: 4 },
				],
			},
		],
	},
];

const state = {
	activeMatchId: null,
	activeGroup: marketGroups[0].group,
	pendingSelections: [],
	selectionNotice: '',
	cartItems: [],
};

const playArea = document.querySelector('#play-area');
const ticketList = document.querySelector('#ticket-list');
const stakeInput = document.querySelector('#stake-input');
const comboTimesEl = document.querySelector('#combo-times');
const rewardStatusEl = document.querySelector('#reward-status');
const rewardHighlightEl = document.querySelector('#reward-highlight');
const rewardCatalogEl = document.querySelector('#reward-catalog');
const cartList = document.querySelector('#cart-list');
const cartTotalTimesEl = document.querySelector('#cart-total-times');
const cartRewardStatusEl = document.querySelector('#cart-reward-status');
const cartItemCountEl = document.querySelector('#cart-item-count');
const cartClearButton = document.querySelector('#cart-clear');
const confirmOrderButton = document.querySelector('#confirm-order');
const cartFabButton = document.querySelector('#cart-fab');
const orderFabButton = document.querySelector('#order-fab');
const limitToastEl = document.querySelector('#limit-toast');

let toastTimeoutId = null;

function formatPoints(value) {
	return `${value} 積分`;
}

function getActiveMatch() {
	return matches.find((match) => match.id === state.activeMatchId) ?? matches[0];
}

function getMarkets() {
	const group = marketGroups.find((item) => item.group === state.activeGroup);
	return group ? group.markets : [];
}

function getMatchById(matchId) {
	return matches.find((match) => match.id === matchId) ?? null;
}

function getMarketTitle(market, match) {
	return typeof market.title === 'function' ? market.title(match) : market.title;
}

function getMarketDescription(market, match) {
	return typeof market.description === 'function' ? market.description(match) : market.description;
}

function getOptionPoints(option) {
	return option.times * POINTS_PER_UNIT;
}

function showLimitToast(message) {
	if (!limitToastEl) {
		return;
	}

	limitToastEl.textContent = message;
	limitToastEl.classList.add('is-visible');
	clearTimeout(toastTimeoutId);
	toastTimeoutId = window.setTimeout(() => {
		limitToastEl.classList.remove('is-visible');
	}, 2200);
}

function updateBetLimitToast() {
	if (!limitToastEl) {
		return;
	}

	if (!state.activeMatchId) {
		limitToastEl.classList.remove('is-visible');
		return;
	}

	const matchUsage = getMatchBetUsage(state.activeMatchId);
	const remainingBets = MAX_MATCH_BETS - matchUsage;
	const isAtLimit = remainingBets <= 0;
	limitToastEl.textContent = isAtLimit
		? `本場比賽已達上限 ${matchUsage}/${MAX_MATCH_BETS} 次，不能再下注`
		: `本場比賽目前已下注 ${matchUsage}/${MAX_MATCH_BETS} 次，還能下注 ${remainingBets} 次`;
	limitToastEl.classList.toggle('is-warning', isAtLimit);
	limitToastEl.classList.add('is-visible');
}

function getMatchBetUsage(matchId) {
	return state.cartItems.filter((item) => item.matchId === matchId).length;
}

function getSelectionTotalTimes(selections) {
	return selections.reduce((total, selection) => total + selection.times, 0);
}

function getSelectionTotalPoints(selections, repeatCount = 1) {
	return getSelectionTotalTimes(selections) * repeatCount * POINTS_PER_UNIT;
}

function renderHeaderSelectors() {
	if (!state.activeMatchId) {
		return `
			<div class="selector-block selector-block--intro">
				<div class="selector-label">先選比賽</div>
				<div class="selector-grid selector-grid--matches">
					${matches
						.map((match) => {
							return `<button class="selector-button" type="button" data-match-id="${match.id}">
								<span>${match.name}</span>
								<strong>${match.label}</strong>
							</button>`;
						})
						.join('')}
				</div>
			</div>
		`;
	}

	const matchButtons = matches
		.map((match) => {
			const isActive = match.id === state.activeMatchId;
			return `<button class="selector-button ${isActive ? 'is-active' : ''}" type="button" data-match-id="${match.id}">
				<span>${match.name}</span>
				<strong>${match.label}</strong>
			</button>`;
		})
		.join('');

	const groupButtons = marketGroups
		.map((group) => {
			const isActive = group.group === state.activeGroup;
			return `<button class="category-button ${isActive ? 'is-active' : ''}" type="button" data-group="${group.group}">${group.group}</button>`;
		})
		.join('');

	return `
		<div class="selector-block">
			<div class="selector-label">選擇比賽</div>
			<div class="selector-grid">${matchButtons}</div>
		</div>
		<div class="selector-block">
			<div class="selector-label">再選玩法</div>
			<div class="category-list" role="tablist" aria-label="玩法分類">${groupButtons}</div>
		</div>
	`;
}

function createOptionButton(match, market, option) {
	const selectionKey = `${match.id}:${market.id}:${option.label}`;
	const isSelected = state.pendingSelections.some((selection) => selection.key === selectionKey);
	return `<button class="option-button ${isSelected ? 'is-selected' : ''}" type="button" data-selection-key="${selectionKey}" data-match-id="${match.id}" data-market-id="${market.id}" data-label="${option.label}" data-times="${option.times}">
		<span>${option.label}</span>
		<strong>+${getOptionPoints(option)} 積分</strong>
	</button>`;
}

function renderMarkets() {
	if (!state.activeMatchId) {
		return `
			<div class="play-panel play-panel--empty">
				<h3>先選一場比賽</h3>
				<p class="play-panel__description">先選好比賽，再挑你想要的玩法；達到上限後就要切到另一場比賽。</p>
			</div>
		`;
	}

	const match = getActiveMatch();
	const markets = getMarkets();

	return `
		<div class="match-strip">
			<div>
				<p class="match__label">${match.name}</p>
				<h2>${match.label}</h2>
			</div>
			<div class="match__tag ${match.id === 'final' ? 'match__tag--gold' : ''}">${match.tag}</div>
		</div>
		<div class="market-stack">
			${markets
				.map((market) => {
					const options = market.buildOptions(match);
					return `
						<section class="play-card market-card">
							<div class="play-panel__title">
								<h3>${getMarketTitle(market, match)}</h3>
								<span>${options.length} 個選項</span>
							</div>
							<p class="play-panel__description">${getMarketDescription(market, match)}</p>
							<div class="option-grid">
								${options.map((option) => createOptionButton(match, market, option)).join('')}
							</div>
						</section>
					`;
				})
				.join('')}
		</div>
	`;
}

function renderPlayArea() {
	playArea.innerHTML = `${renderHeaderSelectors()}${renderMarkets()}`;
	updateBetLimitToast();
}

function renderTicket() {
	if (!state.activeMatchId) {
		limitToastEl?.classList.remove('is-visible');
		ticketList.innerHTML = '<div class="ticket-empty">先選一場比賽，才能開始選玩法。</div>';
		comboTimesEl.textContent = '0 積分';
		rewardStatusEl.textContent = '尚未選比賽';
		return;
	}

	const matchUsage = getMatchBetUsage(state.activeMatchId);
	const remainingBets = MAX_MATCH_BETS - matchUsage;
	const isAtMatchLimit = matchUsage >= MAX_MATCH_BETS;
	updateBetLimitToast();

	if (state.pendingSelections.length === 0) {
		ticketList.innerHTML = `
			<div class="ticket-note">這場比賽目前已用 ${matchUsage}/${MAX_MATCH_BETS} 次，還能再加 ${remainingBets} 次。</div>
			<div class="ticket-empty">先選玩法，放進這場比賽的下注單。</div>
		`;
		comboTimesEl.textContent = '0 積分';
		rewardStatusEl.textContent = '尚未選玩法';
		return;
	}

	const repeatCount = Number(stakeInput.value || 1);
	const comboPoints = getSelectionTotalPoints(state.pendingSelections, repeatCount);
	const isOverLimit = comboPoints > MAX_MATCH_POINTS;
	const activeReward = rewardTiers.find((tier) => comboPoints >= tier.threshold) ?? rewardTiers[rewardTiers.length - 1];

	ticketList.innerHTML = `
		<div class="ticket-note">這場比賽目前已用 ${matchUsage}/${MAX_MATCH_BETS} 次，還能再加 ${remainingBets} 次。</div>
		<div class="ticket-note">同場比賽可以選多個玩法，但同一個玩法只能選一個結果。</div>
		<div class="ticket-note ticket-note--info">這筆下注以 ${repeatCount} 倍計算，總共 ${comboPoints} 積分。</div>
		${isAtMatchLimit ? `<div class="ticket-note ticket-note--warn">這場比賽已達 ${MAX_MATCH_BETS} 次下注上限，請切換到另一場比賽。</div>` : ''}
		${isOverLimit ? '<div class="ticket-note ticket-note--warn">單筆最多 1000 積分，請減少倍數或刪掉部分玩法。</div>' : ''}
		${state.pendingSelections
			.map(
				(selection) => `
					<div class="ticket-item">
						<div>
							<div class="ticket-item__title">${selection.marketTitle}</div>
							<div class="ticket-item__subtitle">${selection.optionLabel}</div>
						</div>
						<div class="ticket-item__right">
							<strong>+${selection.times * POINTS_PER_UNIT} 積分</strong>
							<button class="ticket-remove" type="button" data-remove-pending-key="${selection.key}">移除</button>
						</div>
					</div>
				`,
			)
			.join('')}
		<button id="add-to-cart" class="cart-add" type="button" ${isOverLimit || isAtMatchLimit ? 'disabled' : ''}>${isAtMatchLimit ? '已達上限' : '下注並加入購物車'}</button>
	`;

	comboTimesEl.textContent = formatPoints(comboPoints);
	rewardStatusEl.textContent = `${activeReward.name} 可解鎖`;
	if (state.selectionNotice) {
		ticketList.insertAdjacentHTML('afterbegin', `<div class="ticket-note ticket-note--warn">${state.selectionNotice}</div>`);
	}
}

function setPendingSelection(payload) {
	const match = matches.find((item) => item.id === payload.matchId);
	const markets = getMarkets();
	const market = markets.find((item) => item.id === payload.marketId);
	const existingSelectionIndex = state.pendingSelections.findIndex((selection) => selection.marketId === payload.marketId);
	const repeatCount = Number(stakeInput.value || 1);
	if (existingSelectionIndex >= 0) {
		const existingSelection = state.pendingSelections[existingSelectionIndex];
		if (existingSelection.optionLabel !== payload.label) {
			state.selectionNotice = '同一個玩法只能選一個結果，請先移掉原本選項。';
			renderPlayArea();
			renderTicket();
			return;
		}

		state.pendingSelections.splice(existingSelectionIndex, 1);
		state.selectionNotice = '';
		renderPlayArea();
		renderTicket();
		return;
	}

	const nextSelections = [
		...state.pendingSelections,
		{
			key: payload.selectionKey,
			matchId: payload.matchId,
			matchName: match?.name ?? '',
			marketId: payload.marketId,
			marketTitle: market?.title ?? '',
			optionLabel: payload.label,
			times: payload.times,
		},
	];
	const nextPoints = getSelectionTotalPoints(nextSelections, repeatCount);
	if (nextPoints > MAX_MATCH_POINTS) {
		state.selectionNotice = `單筆最多 ${MAX_MATCH_POINTS} 積分，請減少倍數或刪掉部分玩法。`;
		renderPlayArea();
		renderTicket();
		return;
	}

	state.pendingSelections.push({
		key: payload.selectionKey,
		matchId: payload.matchId,
		matchName: match?.name ?? '',
		marketId: payload.marketId,
		marketTitle: market?.title ?? '',
		optionLabel: payload.label,
		times: payload.times,
	});
	state.selectionNotice = '';
	renderPlayArea();
	renderTicket();
}

function getCartTotals() {
	const totalPoints = state.cartItems.reduce((sum, item) => sum + item.totalPoints, 0);
	return {
		totalPoints,
		itemCount: state.cartItems.length,
		reward: rewardTiers.find((tier) => totalPoints >= tier.threshold) ?? null,
	};
}

function renderCart() {
	const totals = getCartTotals();
	cartItemCountEl.textContent = `${totals.itemCount} 筆`;
	cartTotalTimesEl.textContent = formatPoints(totals.totalPoints);
	cartRewardStatusEl.textContent = totals.reward ? `${totals.reward.name} 可解鎖` : '尚未開始';
	renderRewardCatalog(totals.totalPoints);

	if (confirmOrderButton) {
		confirmOrderButton.disabled = !state.cartItems.length;
		confirmOrderButton.textContent = state.cartItems.length ? '確定下單' : '先選好玩法';
	}

	if (!state.cartItems.length) {
		cartList.innerHTML = '<div class="cart-empty">購物車還是空的，完成下注後會出現在這裡。</div>';
		return;
	}

	cartList.innerHTML = state.cartItems
		.map((item) => `
			<article class="cart-item">
				<div>
					<p class="cart-item__match">${item.matchName}</p>
					<h3>這一場比賽的下注單</h3>
					<p class="cart-item__option">${item.selections.map((selection) => selection.optionLabel).join('、')}</p>
				</div>
				<div class="cart-item__meta">
					<strong>${formatPoints(item.totalPoints)}</strong>
					<span>${item.selections.length} 個玩法</span>
					<button class="ticket-remove" type="button" data-remove-cart-id="${item.id}">刪除</button>
				</div>
			</article>
		`)
		.join('');
}

function addPendingToCart() {
	if (!state.activeMatchId || state.pendingSelections.length === 0) {
		return;
	}

	const matchUsage = getMatchBetUsage(state.activeMatchId);
	if (matchUsage >= MAX_MATCH_BETS) {
		state.selectionNotice = `這場比賽已達 ${MAX_MATCH_BETS} 次下注機會上限。`;
		showLimitToast(`這場比賽已達 ${MAX_MATCH_BETS} 次下注機會上限，請切換到另一場比賽。`);
		renderTicket();
		return;
	}

	const repeatCount = Number(stakeInput.value || 1);
	const totalPoints = getSelectionTotalPoints(state.pendingSelections, repeatCount);
	if (totalPoints > MAX_MATCH_POINTS) {
		state.selectionNotice = `單筆最多 ${MAX_MATCH_POINTS} 積分，請減少倍數或刪掉部分玩法。`;
		renderTicket();
		return;
	}
	state.cartItems.push({
		id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
		matchId: state.activeMatchId,
		matchName: getMatchById(state.activeMatchId)?.name ?? '',
		selections: state.pendingSelections.map((selection) => ({ ...selection })),
		repeatCount,
		totalPoints,
	});

	state.pendingSelections = [];
	state.selectionNotice = '';
	stakeInput.value = '1';
	renderPlayArea();
	renderTicket();
	renderCart();
}

function removeCartItem(id) {
	state.cartItems = state.cartItems.filter((item) => item.id !== id);
	renderCart();
}

function clearCart() {
	state.cartItems = [];
	renderCart();
}

function submitOrder() {
	if (!state.cartItems.length) {
		showLimitToast('先選好玩法後，再按確定下單。');
		return;
	}

	const totals = getCartTotals();
	const orderPayload = {
		orderDate: new Date().toLocaleDateString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit' }),
		orderTime: new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' }),
		items: state.cartItems,
		totalPoints: totals.totalPoints,
		note: '若預測中可得住獎勵，請呂紋鳳提供給陳威中做兌換。',
	};

	const encoded = encodeURIComponent(JSON.stringify(orderPayload));
	window.location.href = `order-confirmation.html?order=${encoded}`;
}

function renderRewardCatalog(totalPoints) {
	const activeTier = totalPoints > 0 ? rewardTiers.find((tier) => totalPoints >= tier.threshold) ?? rewardTiers[rewardTiers.length - 1] : null;
	rewardHighlightEl.innerHTML = activeTier
		? `
			<div class="reward-highlight__badge reward-highlight__badge--${activeTier.accent}">目前可解鎖：${activeTier.name}</div>
			<h3>${activeTier.badge}</h3>
			<p>你的累積積分已經到 ${totalPoints} 積分，現在可以從這一階層挑選喜歡的獎勵。</p>
		`
		: `
			<div class="reward-highlight__badge reward-highlight__badge--sky">尚未開始</div>
			<h3>先累積積分，再解鎖甜蜜禮物</h3>
			<p>目前還沒有累積積分。先挑幾個玩法，讓獎勵池慢慢往上解鎖。</p>
		`;

	rewardCatalogEl.innerHTML = rewardTiers
		.map((tier) => {
			const unlocked = totalPoints >= tier.threshold;
			return `
				<article class="reward-tier ${unlocked ? 'is-unlocked' : ''}">
					<div class="reward-tier__header">
						<div>
							<p class="reward-tier__name">${tier.name}</p>
							<h3>${tier.badge}</h3>
						</div>
						<div class="reward-tier__threshold">${tier.threshold} 積分</div>
					</div>
					<div class="reward-grid">
						${tier.items.map((item) => `<div class="reward-item">${item}</div>`).join('')}
					</div>
				</article>
			`;
		})
		.join('');
}

playArea.addEventListener('click', (event) => {
	const optionButton = event.target.closest('.option-button');
	if (optionButton) {
		setPendingSelection({
			selectionKey: optionButton.dataset.selectionKey,
			matchId: optionButton.dataset.matchId,
			marketId: optionButton.dataset.marketId,
			label: optionButton.dataset.label,
			times: Number(optionButton.dataset.times),
		});
		renderPlayArea();
		renderTicket();
		return;
	}

	const matchButton = event.target.closest('[data-match-id]');
	if (matchButton) {
		state.activeMatchId = matchButton.dataset.matchId;
		state.pendingSelections = [];
		state.selectionNotice = '';
		renderPlayArea();
		renderTicket();
		return;
	}

	const groupButton = event.target.closest('[data-group]');
	if (groupButton) {
		state.activeGroup = groupButton.dataset.group;
		renderPlayArea();
		renderTicket();
		return;
	}

});


ticketList.addEventListener('click', (event) => {
	const addButton = event.target.closest('#add-to-cart');
	if (addButton) {
		addPendingToCart();
		return;
	}

	const removePendingButton = event.target.closest('[data-remove-pending-key]');
	if (removePendingButton) {
		state.pendingSelections = state.pendingSelections.filter((selection) => selection.key !== removePendingButton.dataset.removePendingKey);
		state.selectionNotice = '';
		renderPlayArea();
		renderTicket();
	}
});

cartList.addEventListener('click', (event) => {
	const removeButton = event.target.closest('[data-remove-cart-id]');
	if (!removeButton) {
		return;
	}

	removeCartItem(removeButton.dataset.removeCartId);
	renderCart();
});

cartClearButton.addEventListener('click', () => {
	clearCart();
	renderCart();
});

confirmOrderButton?.addEventListener('click', () => {
	submitOrder();
});

cartFabButton.addEventListener('click', () => {
	document.querySelector('#cart-dock')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

orderFabButton.addEventListener('click', () => {
	document.querySelector('#order-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

stakeInput.addEventListener('input', renderTicket);

renderPlayArea();
renderTicket();
renderCart();