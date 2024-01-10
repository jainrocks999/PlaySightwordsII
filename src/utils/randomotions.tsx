export default (array: any, lenght: number) => {
  const newArray = [...array];
  let randomArray: any[] = [];

  for (let i = 0; i < lenght; i++) {
    const randomIndex = Math.floor(Math.random() * newArray.length);
    const selectedElement = newArray.splice(randomIndex, 1)[0];
    randomArray.push(selectedElement);
  }

  return randomArray;
};
