
export function getMinRequiredOrderDate() {
    const today = new Date();
    
    // Calculate the minimum date (today + 7 days)
    const minDate = new Date(today);
    minDate.setDate(today.getDate() + 7);

    // Format the minimum date as a string in the "YYYY-MM-DD" format
    const minDateString = minDate.toISOString().split('T')[0];

    return minDateString;
};