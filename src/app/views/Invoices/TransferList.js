import React, { useState, useEffect } from "react";
import { Select } from '@mui/material';
import items from '../Maps/DB/items.json';

const InvoiceBox = ({ invoice, numberOfLeftInvoices=2, setIsNextButtonDisabled, setFinalSplitInvoices }) => {
    const [rightInvoiceBox, setRightInvoiceBox] = useState(invoice.products);
    const [splitInvoices, setSplitInvoices] = useState(Array.from({ length: numberOfLeftInvoices }, () => []));
    const [leftInvoiceBox, setLeftInvoiceBox] = useState([]);
    const [currentSplitInvoiceIndex, setCurrentSplitInvoiceIndex] = useState(0);

    function findProductName(productCode, products) {
      // loop through the products array
      for (let i = 0; i < products.length; i++) {
        // check if the productCode of the current object matches the given productCode
        if (products[i].prodCode === productCode) {
          // return the productName if there is a match
          console.log("Match found for productCode: " + productCode + " productName: " + products[i].prodDesc)
          return products[i].prodDesc;
        }
      }
      // if no match is found, return null or a suitable default value
      console.log("No match found for productCode: " + productCode)
      return productCode;
    }

    function areAnySplitsEmpty(arr) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].length === 0) {
          return true; // Found an empty array
        }
      }
      return false; // No empty arrays found
    }
    

    
    useEffect(() => {
      console.log("NOW IT's IN SPLIT: ", currentSplitInvoiceIndex)
      console.log("CURRENT SPLIT INVOICES: ", splitInvoices);
      setFinalSplitInvoices(splitInvoices);
      if(rightInvoiceBox.length !== 0) {
        setIsNextButtonDisabled(true)
      } else if(rightInvoiceBox.length === 0 && !areAnySplitsEmpty(splitInvoices)) {
        setIsNextButtonDisabled(false)
      }
    }, [currentSplitInvoiceIndex, rightInvoiceBox]);
    

  const handleRightPlus = (index) => {
    const newRightInvoiceBox = [...rightInvoiceBox];
    const product = newRightInvoiceBox[index];
    product.productQuantity++;
    setRightInvoiceBox(newRightInvoiceBox);

    const indexInLeft = splitInvoices[currentSplitInvoiceIndex].findIndex(
      (p) => findProductName(p.productCode, items) === findProductName(product.productCode, items)
    );
    if (indexInLeft === -1) return;
    const newLeftInvoiceBox = [...splitInvoices[currentSplitInvoiceIndex]];
    const alllInvoices = [...splitInvoices];
    newLeftInvoiceBox[indexInLeft].productQuantity--;
    if (newLeftInvoiceBox[indexInLeft].productQuantity === 0) {
      newLeftInvoiceBox.splice(indexInLeft, 1);
    }
    setLeftInvoiceBox(newLeftInvoiceBox);
    alllInvoices[currentSplitInvoiceIndex] = newLeftInvoiceBox;
    setSplitInvoices(alllInvoices);
  };

  const handleRightMinus = (index) => {
    const newRightInvoiceBox = [...rightInvoiceBox];
    const product = newRightInvoiceBox[index];
    product.productQuantity--;
    if (product.productQuantity === 0) {
      newRightInvoiceBox.splice(index, 1);
    }
    setRightInvoiceBox(newRightInvoiceBox);

    const allInvoices = [...splitInvoices];
    const indexInLeft = allInvoices[currentSplitInvoiceIndex].findIndex(
      (p) => findProductName(p.productCode, items) === findProductName(product.productCode, items)
    );
    if (indexInLeft === -1) {
        allInvoices[currentSplitInvoiceIndex] = [
        ...allInvoices[currentSplitInvoiceIndex],
        { productCode: product.productCode, productQuantity: 1 },
        ];
        setSplitInvoices(allInvoices);
      setLeftInvoiceBox([
        ...splitInvoices[currentSplitInvoiceIndex],
        { productCode: product.productCode, productQuantity: 1 },
      ]);
    } else {
      const newLeftInvoiceBox = [...splitInvoices[currentSplitInvoiceIndex]];
      newLeftInvoiceBox[indexInLeft].productQuantity++;
        allInvoices[currentSplitInvoiceIndex] = newLeftInvoiceBox;
        setSplitInvoices(allInvoices);
      setLeftInvoiceBox(newLeftInvoiceBox);
    }
  };

  const handleLeftPlus = (index) => {
    const allInvoices = [...splitInvoices];
    const newLeftInvoiceBox = [...splitInvoices[currentSplitInvoiceIndex]];
    const product = newLeftInvoiceBox[index];
    product.productQuantity++;
    setLeftInvoiceBox(newLeftInvoiceBox);
    allInvoices[currentSplitInvoiceIndex] = newLeftInvoiceBox;
    setSplitInvoices(allInvoices);

    const indexInRight = rightInvoiceBox.findIndex(
      (p) => findProductName(p.productCode, items) === findProductName(product.productCode, items)
    );
    if (indexInRight === -1) return;
    const newRightInvoiceBox = [...rightInvoiceBox];
    newRightInvoiceBox[indexInRight].productQuantity--;
    if (newRightInvoiceBox[indexInRight].productQuantity === 0) {
      newRightInvoiceBox.splice(indexInRight, 1);
    }
    setRightInvoiceBox(newRightInvoiceBox);
  };

  const handleLeftMinus = (index) => {
    const allInvoices = [...splitInvoices];
    const newLeftInvoiceBox = [...splitInvoices[currentSplitInvoiceIndex]];
    const product = newLeftInvoiceBox[index];
    product.productQuantity--;
    if (product.productQuantity === 0) {
        newLeftInvoiceBox.splice(index, 1);
    }
    allInvoices[currentSplitInvoiceIndex] = newLeftInvoiceBox;
    setSplitInvoices(allInvoices);
    setLeftInvoiceBox(newLeftInvoiceBox);

    const indexInRight = rightInvoiceBox.findIndex(
      (p) => findProductName(p.productCode, items) === findProductName(product.productCode, items)
    );
    if (indexInRight === -1) {
      setRightInvoiceBox([
        ...rightInvoiceBox,
        { productCode: product.productCode, productQuantity: 1 },
      ]);
    } else {
      const newRightInvoiceBox = [...rightInvoiceBox];
      newRightInvoiceBox[indexInRight].productQuantity++;
      setRightInvoiceBox(newRightInvoiceBox);
    }
  };

  const moveProductToLeftBox = (productName) => {
    const allInvoices = [...splitInvoices];
    const productIndex = rightInvoiceBox.findIndex((product) => findProductName(product.productCode, items) === findProductName(productName, items));
    const leftProductIndex = splitInvoices[currentSplitInvoiceIndex].findIndex((product) => findProductName(product.productCode, items) === findProductName(productName, items));
  
    if (leftProductIndex !== -1) {
        console.log("FROM FIRST IF STATEMENT")
      setLeftInvoiceBox((prevLeftInvoiceBox) => {
        const updatedLeftInvoiceBox = [...prevLeftInvoiceBox];
        updatedLeftInvoiceBox[leftProductIndex].productQuantity += rightInvoiceBox[productIndex].productQuantity;
        return updatedLeftInvoiceBox;
      });
      const updatedLeftInvoiceBox = [...splitInvoices[currentSplitInvoiceIndex]];
        updatedLeftInvoiceBox[leftProductIndex].productQuantity += rightInvoiceBox[productIndex].productQuantity;
        allInvoices[currentSplitInvoiceIndex] = updatedLeftInvoiceBox;
        setSplitInvoices(allInvoices);
    } else {
        setLeftInvoiceBox((prevLeftInvoiceBox) => [...prevLeftInvoiceBox, { ...rightInvoiceBox[productIndex], productQuantity: rightInvoiceBox[productIndex].productQuantity }]);
        allInvoices[currentSplitInvoiceIndex] = [...splitInvoices[currentSplitInvoiceIndex], { ...rightInvoiceBox[productIndex], productQuantity: rightInvoiceBox[productIndex].productQuantity }];
        setSplitInvoices(allInvoices);
    }
  
    setRightInvoiceBox((prevRightInvoiceBox) => {
        console.log("FROM END OF FUNCTION")
      const updatedRightInvoiceBox = [...prevRightInvoiceBox];
      updatedRightInvoiceBox.splice(productIndex, 1);
      console.log(updatedRightInvoiceBox)
      return updatedRightInvoiceBox;
    });
  };

  const moveAllProductsToLeft = () => {
    const allInvoices = [...splitInvoices];
    let updatedRightBox = [...rightInvoiceBox];
    let updatedLeftBox = [...splitInvoices[currentSplitInvoiceIndex]];
    
    updatedRightBox.forEach(product => {
      const leftProductIndex = updatedLeftBox.findIndex(leftProduct => findProductName(leftProduct.productCode, items) === findProductName(product.productCode, items));
      
      if (leftProductIndex !== -1) {
        updatedLeftBox[leftProductIndex].productQuantity += product.productQuantity;
      } else {
        updatedLeftBox.push({...product});
      }
    });
    
    setRightInvoiceBox([]);
    setLeftInvoiceBox(updatedLeftBox);
    allInvoices[currentSplitInvoiceIndex] = updatedLeftBox;
    setSplitInvoices(allInvoices);
  };

  const moveAllProductsToRight = () => {
    const allInvoices = [...splitInvoices];
    let updatedLeftBox = [...splitInvoices[currentSplitInvoiceIndex]];
    let updatedRightBox = [...rightInvoiceBox];
    
    updatedLeftBox.forEach(product => {
      const rightProductIndex = updatedRightBox.findIndex(rightProduct => findProductName(rightProduct.productCode, items) === findProductName(product.productCode, items));
      
      if (rightProductIndex !== -1) {
        updatedRightBox[rightProductIndex].productQuantity += product.productQuantity;
      } else {
        updatedRightBox.push({...product});
      }
    });
    
    setLeftInvoiceBox([]);
    setRightInvoiceBox(updatedRightBox);
    allInvoices[currentSplitInvoiceIndex] = [];
    setSplitInvoices(allInvoices);
  };
  
  

  const moveProductToRightBox = (productName) => {
    const allInvoices = [...splitInvoices];
    const productIndex = splitInvoices[currentSplitInvoiceIndex].findIndex((product) => findProductName(product.productCode, items) === findProductName(productName, items));
    const rightProductIndex = rightInvoiceBox.findIndex((product) => findProductName(product.productCode, items) === findProductName(productName, items));
  
    if (rightProductIndex !== -1) {
      setRightInvoiceBox((prevRightInvoiceBox) => {
        const updatedRightInvoiceBox = [...prevRightInvoiceBox];
        updatedRightInvoiceBox[rightProductIndex].productQuantity += splitInvoices[currentSplitInvoiceIndex][productIndex].productQuantity;
        return updatedRightInvoiceBox;
      });
    } else {
      setRightInvoiceBox((prevRightInvoiceBox) => [...prevRightInvoiceBox, { ...splitInvoices[currentSplitInvoiceIndex][productIndex], productQuantity: splitInvoices[currentSplitInvoiceIndex][productIndex].productQuantity }]);
    }
  
    setLeftInvoiceBox((prevLeftInvoiceBox) => {
      const updatedLeftInvoiceBox = [...prevLeftInvoiceBox];
      updatedLeftInvoiceBox.splice(productIndex, 1);
      return updatedLeftInvoiceBox;
    });
    const updatedLeftInvoiceBox = [...splitInvoices[currentSplitInvoiceIndex]];
    updatedLeftInvoiceBox.splice(productIndex, 1);
    allInvoices[currentSplitInvoiceIndex] = updatedLeftInvoiceBox;
    setSplitInvoices(allInvoices);
  };
  
  


  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", alignSelf: 'center', margin: 'auto' }}>
      <div style={{ 
        backgroundColor: "#F5F5F5",
        borderRadius: 10,
        width: "50%",
        minWidth: 500,
        padding: 20,
        margin: 20,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)"
      }}>
        <h2 style={{ color: "#333333", fontWeight: "bold", marginBottom: 20 }}>Main Invoice</h2>
        <button 
          style={{ 
            backgroundColor: "#007AFF", 
            color: "#FFFFFF", 
            borderRadius: 5, 
            border: "none",
            fontSize: 16,
            padding: "10px 20px",
            marginBottom: 20,
            cursor: "pointer",
            opacity: rightInvoiceBox.length === 0 ? 0.5 : 1
          }} 
          onClick={moveAllProductsToLeft} 
          disabled={rightInvoiceBox.length === 0}
        >
          Move All Products
        </button>
        {rightInvoiceBox.map((product, index) => (
          <div 
            key={index} 
            style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center", 
              marginBottom: 10,
              borderBottom: "1px solid #CCCCCC",
              paddingBottom: 10,
              width: "100%"
            }}
          >
            <div style={{ flex: 1 }}>
              <span style={{ fontWeight: "bold", color: "#333333" }}>{findProductName(product.productCode, items)}{"\n"}</span>Quantity: {product.productQuantity}
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minWidth: 80 }}>
              <button 
                style={{ 
                  backgroundColor: "#50C878", 
                  color: "#FFFFFF", 
                  borderRadius: 5, 
                  border: "none",
                  fontSize: 16,
                  padding: 5,
                  marginRight: 5,
                  cursor: "pointer",
                  opacity: !splitInvoices[currentSplitInvoiceIndex].find(item => findProductName(item.productCode, items) === findProductName(product.productCode, items)) ? 0.5 : 1
                }} 
                onClick={() => handleRightPlus(index)} 
                disabled={!splitInvoices[currentSplitInvoiceIndex].find(item => findProductName(item.productCode, items) === findProductName(product.productCode, items))}
              >
                +
              </button>
              <button 
                style={{ 
                  backgroundColor: "#FF5B5B", 
                  color: "#FFFFFF", 
                  borderRadius: 5, 
                  border: "none",
                  fontSize: 16,
                  padding: 5,
                  marginRight: 5,
                  cursor: "pointer",
                  opacity: product.productQuantity === 0 ? 0.5 : 1
                }} 
                onClick={() => handleRightMinus(index)} 
                disabled={product.productQuantity === 0}
              >
                -
              </button>
              <button 
                style={{ 
                  backgroundColor: "#007AFF", 
                  color: "#FFFFFF", 
                  borderRadius: 5, 
                  border: "none",
                  fontSize: 16,
                  padding: 5,
                  cursor: "pointer"
                }} 
                onClick={() => moveProductToLeftBox(product.productCode)}
              >
                Move Product
              </button>
            </div>
          </div>
        ))}
      </div>


      <div style={{ 
        backgroundColor: "#F5F5F5",
        borderRadius: 10,
        width: "50%",
        minWidth: 500,
        padding: 20,
        margin: 20,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)"
      }}>
        <h2 style={{ color: "#333333", fontWeight: "bold", marginBottom: 20 }}>Split Invoice</h2>
        <Select
            native
            onChange={(e) => setCurrentSplitInvoiceIndex(e.target.value)}
            defaultValue=""
            id="grouped-native-select"
            sx={{
                width: '100%',
                maxWidth: '150px',
                maxHeight: '30px',
                marginBottom: "10px",
                borderRadius: '8px',
                backgroundColor: '#F8F8F8',
                '& .MuiSelect-outlined': {
                    paddingTop: '10px',
                    paddingBottom: '12px',
                },
                '& .MuiInputBase-input': {
                    fontSize: '12px',
                    fontWeight: 500,
                    color: '#444444',
                },
                '& .MuiSvgIcon-root': {
                    color: '#444444',
                },
                '@media (max-width: 600px)': {
                    maxWidth: '100px',
                },
            }}
            MenuProps={{
                anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'left',
                },
                transformOrigin: {
                    vertical: 'top',
                    horizontal: 'left',
                },
                getContentAnchorEl: null,
                sx: {
                    borderRadius: '8px',
                    backgroundColor: '#F8F8F8',
                    '& .MuiMenuItem-root': {
                    fontSize: '16px',
                    fontWeight: 500,
                    color: '#444444',
                    },
                    '& .MuiListItem-button:hover': {
                    backgroundColor: '#EEEEEE',
                    },
                },
                }}

        >
            {splitInvoices.map((invoice, index) => (
                <option key={index} value={index}>Split {index + 1}</option>
            ))}
        </Select>
        <button 
          style={{ 
            backgroundColor: "#007AFF", 
            color: "#FFFFFF", 
            borderRadius: 5, 
            border: "none",
            fontSize: 16,
            padding: "10px 20px",
            marginBottom: 20,
            cursor: "pointer",
            opacity: splitInvoices[currentSplitInvoiceIndex].length === 0 ? 0.5 : 1
          }} 
          onClick={moveAllProductsToRight} 
          disabled={splitInvoices[currentSplitInvoiceIndex].length === 0}
        >
          Move All Products
        </button>
        {splitInvoices[currentSplitInvoiceIndex].map((product, index) => (
          <div 
            key={index} 
            style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center", 
              marginBottom: 10,
              borderBottom: "1px solid #CCCCCC",
              paddingBottom: 10,
              width: "100%"
            }}
          >
            <div style={{ flex: 1 }}>
              <span style={{ fontWeight: "bold", color: "#333333" }}>{findProductName(product.productCode, items) ? findProductName(product.productCode, items) : JSON.stringify(product)}{"\n"}</span>Quantity: {product.productQuantity}
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minWidth: 80 }}>
              <button 
                style={{ 
                  backgroundColor: "#50C878", 
                  color: "#FFFFFF", 
                  borderRadius: 5, 
                  border: "none",
                  fontSize: 16,
                  padding: 5,
                  marginRight: 5,
                  cursor: "pointer",
                  opacity: !rightInvoiceBox.find(item => findProductName(item.productCode, items) === findProductName(product.productCode, items)) ? 0.5 : 1
                }} 
                onClick={() => handleLeftPlus(index)} 
                disabled={!rightInvoiceBox.find(item => findProductName(item.productCode, items) === findProductName(product.productCode, items))}
              >
                +
              </button>
              <button 
                style={{ 
                  backgroundColor: "#FF5B5B", 
                  color: "#FFFFFF", 
                  borderRadius: 5, 
                  border: "none",
                  fontSize: 16,
                  padding: 5,
                  marginRight: 5,
                  cursor: "pointer",
                  opacity: product.productQuantity === 0 ? 0.5 : 1
                }} 
                onClick={() => handleLeftMinus(index)} 
                disabled={product.productQuantity === 0}
              >
                -
              </button>
              <button 
                style={{ 
                  backgroundColor: "#007AFF", 
                  color: "#FFFFFF", 
                  borderRadius: 5, 
                  border: "none",
                  fontSize: 16,
                  padding: 5,
                  cursor: "pointer"
                }} 
                onClick={() => moveProductToRightBox(product.productCode)}
              >
                Move Product
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  
  )
  
};

export default InvoiceBox;
