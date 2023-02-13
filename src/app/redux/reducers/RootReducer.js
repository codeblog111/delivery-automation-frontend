import { combineReducers } from 'redux'
import invoiceReducer from '../reducers/invoiceReducer'

const RootReducer = combineReducers({
    invoice:invoiceReducer

})

export default RootReducer
