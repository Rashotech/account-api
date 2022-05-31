const generateAccountNumber = () => {
    return Math.floor(Math.random() * 9000000000) + 1
}; 

export default generateAccountNumber;
