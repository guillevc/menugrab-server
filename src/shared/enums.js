const orderTypePrefix = 'ORDER_TYPE_';
export const OrderType = {
  pickup: `${orderTypePrefix}PICKUP`,
  table: `${orderTypePrefix}TABLE`
};

const orderStatePrefix = 'ORDER_STATE_';
export const OrderState = {
  pending: `${orderStatePrefix}PENDING`,
  accepted: `${orderStatePrefix}ACCEPTED`,
  completed: `${orderStatePrefix}COMPLETED`,
  canceled: `${orderStatePrefix}CANCELED`
};
OrderState.inProgressStates = [OrderState.pending, OrderState.accepted];
