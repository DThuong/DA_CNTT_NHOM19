import icons from "./icons"

const { MdOutlineStar, MdOutlineStarBorder} = icons
export const createSlug = string => string.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").split('').join('-') 

export const formatNumber = number => Number(number.toFixed(1)).toLocaleString() 

export const renderStar = (number) => {
  const star = [];
  const numStars = Number(number) || 0; // Nếu không hợp lệ hoặc 0, mặc định là 0.

  for (let i = 0; i < 5; i++) {
      if (i < numStars) {
          star.push(<MdOutlineStar key={i} color="orange" />); // Ngôi sao đầy
      } else {
          star.push(<MdOutlineStarBorder key={i} color="orange" />); // Ngôi sao rỗng
      }
  }

  return star;
};

export const validate = (payload, setInvalidFields) => {
    let invalids = 0;
    const invalidFields = []; // Temporary array for invalid fields
  
    Object.entries(payload).forEach(([key, value]) => {
      if (value.trim() === "") {
        invalids++;
        invalidFields.push({ name: key, msg: "This field is required." });
      }
    });
  
    setInvalidFields(invalidFields); // Update state once after iteration
    return invalids;
  };

export const formatMoney = function formatNumber(num) {
  return new Intl.NumberFormat('en-US').format(num);
}

  