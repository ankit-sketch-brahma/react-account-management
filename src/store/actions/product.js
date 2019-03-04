import * as actionTypes from './actionTypes';
// import axios from 'axios';

export const productStart = () => {
  return {
    type: actionTypes.ON_PRODUCT_START
  }
}

export const productSuccess = (productData) => {
  return {
    type: actionTypes.ON_PRODUCT_SUCCESS,
    id: productData.id,
    userId: productData.userId,
    name: productData.name,
    qty: productData.qty
  }
}

export const onProduct = (id, name, qty, userId) => {
  return dispatch => {
    dispatch(productStart());

    const productData = {
      id: id,
      name: name,
      qty: qty,
      userId: userId,
    }

    setTimeout(() => {
      dispatch(productSuccess(productData));
    }, 1000);
  }
}

export const productDelete = (pid, userId) => {
  return {
    type: actionTypes.ON_PRODUCT_DELETE,
    id: pid,
    userId: userId,
  }
}
