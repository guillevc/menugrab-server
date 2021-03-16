const orderTypePrefix = 'ORDER_TYPE_'
const OrderType = {
  pickup: `${orderTypePrefix}PICKUP`,
  table: `${orderTypePrefix}TABLE`
};

const orderStatePrefix = 'ORDER_STATE_'
const OrderState = {
  pending: `${orderStatePrefix}PENDING`,
  accepted: `${orderStatePrefix}ACCEPTED`,
  completed: `${orderStatePrefix}COMPLETED`,
  canceled: `${orderStatePrefix}CANCELED`
}

module.exports = { OrderType, OrderState };
