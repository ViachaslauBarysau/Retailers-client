import React, { useState, useEffect } from 'react';

export default () => {
    const [itemsData, setData] = useState({
        isLoading: false,
        error: null,
        items: null
    });

useEffect(()=>{
    setData(prevState => ({...prevState, isLoading: true}));
       fetch('http://localhost:8080/items/')
        .then(res => res.json())
        .then(items => {
          setData((prevState)=>({
            ...prevState,
            isLoading: false,
            items
          }));
      })
      .catch(e => {
        setData((prevState)=>({
          ...prevState,
          isLoading: false,
          error: e
        }))
      })
  }, []);
  
  const {isLoading, error, items} = itemsData;
  
  return  (
    <>
    {isLoading && 'Loading....'}
    {!isLoading && !error &&
        (items != null
          ? items.map(item => <Items item={item} key={item.id}/>)
          : 'Empty list')
    }
    {!isLoading && error && 'Error happens'}
    </>
  );
}

function Customers({item}){
  return (
    <div style={{marginTop: 10}}>
      <li>{item.id}</li>
      <a href={'/items/' + item.id} style={{fontSize: 10, color: "blue", float: "right", marginRight: 5, marginTop: -5}}>Read more</a>
      <hr />
    </div>
  )
}