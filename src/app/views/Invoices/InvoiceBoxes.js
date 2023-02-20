import React, { useState } from "react";

const InvoiceBoxes = ({ invoice }) => {
  const [rightInvoiceBox, setRightInvoiceBox] = useState(invoice);
  const [leftInvoiceBox, setLeftInvoiceBox] = useState([]);

  const handleAddProduct = (product) => {
    const index = rightInvoiceBox.findIndex((p) => p.productName === product.productName);
    const updatedRightInvoiceBox = [...rightInvoiceBox];
    updatedRightInvoiceBox[index].productQuantity += 1;
    setRightInvoiceBox(updatedRightInvoiceBox);
  };

  const handleRemoveProduct = (product) => {
    const index = rightInvoiceBox.findIndex((p) => p.productName === product.productName);
    const updatedRightInvoiceBox = [...rightInvoiceBox];
    updatedRightInvoiceBox[index].productQuantity -= 1;
    if (updatedRightInvoiceBox[index].productQuantity <= 0) {
      updatedRightInvoiceBox.splice(index, 1);
    }
    setRightInvoiceBox(updatedRightInvoiceBox);
  };

  return (
    <div>
      <div>
        <h2>Right Invoice Box</h2>
        {rightInvoiceBox.map((product) => (
          <div key={product.productName}>
            <p>
              {product.productName} ({product.productQuantity})
            </p>
            <button onClick={() => handleAddProduct(product)}>+</button>
            <button onClick={() => handleRemoveProduct(product)}>-</button>
          </div>
        ))}
      </div>
      <div>
        <h2>Left Invoice Box</h2>
      </div>
    </div>
  );
};

export default InvoiceBoxes;
