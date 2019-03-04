import React, {Component} from 'react';
import {connect} from 'react-redux';

import * as actions from '../../store/actions';
import '../Auth/Auth.css';

class Product extends Component {

  state = {
    productForm: {
      id: '',
      name: '',
      qty: ''
    },
    btn: false
  }

  onInputChangehandler = (e, inputIdentifier) => {
    const updateCurrentProductForm = {
      ...this.state.productForm
    }
    updateCurrentProductForm[inputIdentifier] = e.target.value;
    // console.log(updateCurrentProductForm[inputIdentifier]);
    this.setState({
      productForm: updateCurrentProductForm,
      btn: true
    });
  }

  onFormSubmit = (e) => {
    e.preventDefault();
    this.setState({
      btn: false
    });
    this.props.onProduct(this.state.productForm.id, this.state.productForm.name, this.state.productForm.qty, this.props.userId);
  }

  render() {
    // console.log(this.state);
    // console.log(this.props.products);
    let form = (
      <form className="loginForm" onSubmit={this.onFormSubmit}>
        <input type="text" placeholder="Product ID" name='id'
          value={this.state.productForm.id} onChange={(event) => this.onInputChangehandler(event, 'id')}/>
        <br />
        <input type="text" placeholder="Product Name" name='name'
          value={this.state.productForm.name} onChange={(event) => this.onInputChangehandler(event, 'name')}/>
        <br />
        <input type="text" placeholder="Quantity" name='qty'
          value={this.state.productForm.qty} onChange={(event) => this.onInputChangehandler(event, 'qty')}/>
        {this.state.btn ?   <button>Add</button> : null }

      </form>
    );
    if(this.props.loading) {
      form = <p style={{textAlign:'center'}}>loading...</p>
    }

    let productDetails = null;
    let noProduct = <p style={{textAlign:'center'}}> No Products..</p>;
    if(this.props.hasProduct) {
      productDetails = this.props.products.map((product, key) => {
        if(this.props.userId in product) {
          if(product[this.props.userId]['hasProduct']) {
            return (
              <ul key={key}>
                <li>Product ID : {product[this.props.userId]['id']}</li>
                <li>Product Name : {product[this.props.userId]['name']}</li>
                <li>Product QTY : {product[this.props.userId]['qty']}</li>
                <li><button onClick={() => this.props.onProductDelete(product[this.props.userId]['id'], this.props.userId)}>Delete</button></li>
              </ul>
            )
          }
        }
      });
    }

    return (
      <div className="auth">
        {form}
      <div>
        {productDetails ? productDetails : noProduct}
      </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    loading: state.product.loading,
    isAuthenticated: state.auth.token !== null,
    userId: state.auth.userId,
    hasProduct: state.product.hasProduct,
    id: state.product.id,
    name: state.product.name,
    qty: state.product.qty,
    products: state.product.products
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onProduct: (id, name, qty, userId) => dispatch(actions.onProduct(id, name, qty, userId)),
    onProductDelete: (pid, userId) => dispatch(actions.productDelete(pid, userId)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Product);
