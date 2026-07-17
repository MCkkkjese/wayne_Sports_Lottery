const params = new URLSearchParams(window.location.search);
const orderData = params.get('order');
const container = document.querySelector('#confirmation-content');

function formatPoints(value) {
  return `${value} 積分`;
}

if (!orderData || !container) {
  container.innerHTML = '<div class="ticket-note">目前沒有可顯示的下單內容。</div>';
} else {
  try {
    const order = JSON.parse(decodeURIComponent(orderData));
    const itemsMarkup = order.items.map((item) => `
      <div class="confirmation-item">
        <div class="confirmation-item__header">
          <strong>${item.matchName}</strong>
          <span>${item.selections.length} 個玩法</span>
        </div>
        <div class="confirmation-item__body">
          ${item.selections.map((selection) => `<div>${selection.optionLabel}</div>`).join('')}
        </div>
        <div class="confirmation-item__meta">${formatPoints(item.totalPoints)}</div>
      </div>
    `).join('');

    container.innerHTML = `
      <div class="confirmation-box">
        <div class="confirmation-row"><span>下單日期</span><strong>${order.orderDate}</strong></div>
        <div class="confirmation-row"><span>下單時間</span><strong>${order.orderTime}</strong></div>
        <div class="confirmation-row"><span>下注總積分</span><strong>${formatPoints(order.totalPoints)}</strong></div>
      </div>
      <div class="confirmation-box confirmation-box--note">
        <h3>下注內容</h3>
        ${itemsMarkup}
      </div>
      <div class="confirmation-box confirmation-box--note">
        <h3>兌換說明</h3>
        <p>${order.note}</p>
      </div>
    `;
  } catch (error) {
    container.innerHTML = '<div class="ticket-note">下單內容讀取失敗，請重新整理。</div>';
  }
}
