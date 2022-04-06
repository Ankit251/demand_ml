let map = {
  0: "measure",
  1: "account",
  2: "sku",
  3: "sbu",
};

export function getWhereCondition(filteredItems) {
  let items = Object.values(filteredItems);
  let temp = "";
  let p = 0;
  //looping array
  for (let i = 0; i < items.length; i++) {
    //check sub array length is greater then 0
    if (items[i].length > 0) {
      // eliminating adding 'AND' in first condition (WHERE Measure IN('PY POS','PY POS Dollars') AND  SKU IN('346004.02')\n" )
      if (p == 0) {
        temp += `WHERE UPPER(${map[i]}) IN(`;
        let q = items[i].length - 1;
        items[i].forEach((el) => {
          if (q >= 1) {
            q--;
            temp += `UPPER('${el}'),`;
          } else {
            temp += `UPPER('${el}')`;
          }
        });
        p = 1;
        temp += `)`;
      } else {
        temp += ` AND  UPPER(${map[i]}) IN(`;
        let q = items[i].length - 1;
        items[i].forEach((el) => {
          if (q >= 1) {
            q--;
            temp += `UPPER('${el}'),`;
          } else {
            temp += `UPPER('${el}')`;
          }
        });
        temp += `)`;
      }
    }
  }
  return temp;
}
