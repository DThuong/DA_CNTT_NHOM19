import React, {useState, memo} from 'react'

const SelectQuantity = ({ initialQuantity = 1, maxQuantity = 10, onChange }) => {
    const [quantity, setQuantity] = useState(initialQuantity);
  
    const handleAdd = () => {
      if (quantity < maxQuantity) {
        const newQuantity = quantity + 1;
        setQuantity(newQuantity);
        onChange && onChange(newQuantity); // Call the onChange callback if provided
      }
    };
  
    const handleMinus = () => {
      if (quantity > 1) {
        const newQuantity = quantity - 1;
        setQuantity(newQuantity);
        onChange && onChange(newQuantity); // Call the onChange callback if provided
      }
    };
  
    return (
      <div className="flex items-center gap-4">
        <button
          className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
          onClick={handleMinus}
        >
          -
        </button>
        <div className="w-8 text-center">{quantity}</div>
        <button
          className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
          onClick={handleAdd}
        >
          +
        </button>
      </div>
    );
  };
  

export default memo(SelectQuantity)