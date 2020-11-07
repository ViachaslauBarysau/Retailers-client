import React, { useState, useEffect } from 'react';

export default () => {
  const [itemsData, setData] = useState({
    isLoading: true,
    error: null,
    items: null
  });

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/posts')
      .then(res => res.json())
      .then(items => {
        setData((prevState) => ({
          ...prevState,
          isLoading: false,
          items
        }));
      })
      .catch(e => {
        setData((prevState) => ({
          ...prevState,
          isLoading: false,
          error: e
        }))
      })
  }, []);

  const { isLoading, error, items } = itemsData;

  return (
    <>
      {isLoading && 'Loading....'}
      {!isLoading && !error &&
        (items != null
          ? items.map(item => <Items activateItem={() => setData({ ...itemsData, activeItem: item })} item={item} key={item.id} />)
          : 'Empty list')
      }
      {!isLoading && error && 'Error happens'}
      {itemsData.activeItem && <UserModal onClose={() => setData({ ...itemsData, activeItem: null })} />}
    </>
  );
}



function Items({ item, activateItem }) {
  return (
    <div style={{ marginTop: 10 }}>
      <li>{item.id}</li>
      <a href='#' onClick={activateItem} style={{ fontSize: 10, color: "blue", float: "right", marginRight: 5, marginTop: -5 }}>Read more</a>
      <hr />
    </div>
  )
}