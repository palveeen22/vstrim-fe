const formatDate = (input: string | Date): string => {
  try {
    // Create a Date object from the input
    const date = input instanceof Date ? input : new Date(input);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date format');
    }

    // Get the day of the week (short name)
    const dayOfWeek = date.toLocaleString('en-US', { weekday: 'short' });
    // Get the day of the month
    const dayOfMonth = date.getDate();
    // Get the month name
    const month = date.toLocaleString('en-US', { month: 'long' });

    // Construct the formatted date string
    return `${dayOfWeek}, ${dayOfMonth} ${month}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return input instanceof Date ? input.toString() : input; // Return the original input if there's an error
  }
};

// const formatToIDR = (amount: number): string => {
//   return new Intl.NumberFormat('id-ID', {
//     style: 'currency',
//     currency: 'IDR',
//     minimumFractionDigits: 0,
//     maximumFractionDigits: 0,
//   }).format(amount);
// };

// const formatPrice = (price: number): string => {
//   return new Intl.NumberFormat('id-ID', {
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//   }).format(price);
// };

const formatPrice = (price: number, currency: string) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: currency || 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Phone regex - allowing for various formats
// eslint-disable-next-line no-useless-escape
const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,3}[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,9}$/;

export {
  formatDate,
  formatPrice,
  emailRegex,
  phoneRegex,
};
