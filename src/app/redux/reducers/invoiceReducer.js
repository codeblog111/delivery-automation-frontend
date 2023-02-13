



const initialState = {
  invoices: [],
  currentInvoice: {},
  splittedInvoice:[],
  products: [],
  splits:1


};

export default function invoiceReducer(state = initialState, action) {
  switch (action.type) {
    case "SELECTED":
      return {
        ...state,
        splittedInvoice:[...action.payload],
        products:state.currentInvoice.subscriber.products.filter((item) => !state.splittedInvoice.includes(item))
      };
    case "GET_INVOICES":
      return{
        ...state,
        invoices:[...action.payload]
      }
      case "SET_CURRENT":
      return{
        ...state,
        currentInvoice:{...action.payload},
        products:action.payload.subscriber.products

      }
      case "SET_SPLIT":
      return{
        ...state,
        splits:action.payload

      }
      case "INCREMENT":
        return {
          ...state,
          products: action.payload,
          splittedInvoice : [...action.payload]
        }

    default:
      return state;
  }
}
